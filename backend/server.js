const express = require("express");
const cors = require("cors");
const axios = require("axios");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 5000;

const CLIENT_URL = process.env.CLIENT_URL || "*";
const PUBLIC_URL = process.env.PUBLIC_URL || "";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());

// ============================================================
// 静态资源服务
// ============================================================
const CONTENT_DIR = path.join(__dirname, "content");
app.use("/api/files", express.static(CONTENT_DIR));

// ============================================================
// 评论 API
// ============================================================

// 笔记 frontmatter 解析（兼容前端 frontmatter.ts）
function parseFrontmatter(content) {
  const result = {
    title: "",
    category: "",
    date: "",
    datetime: "",
    wordCount: "",
    readTime: "",
    excerpt: "",
    tags: [],
    cover: "",
  };

  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: result, content };

  const [, frontmatterStr, bodyContent] = match;
  const lines = frontmatterStr.split("\n");
  let currentKey = null;
  let currentValue = "";

  function setValue(obj, key, value) {
    if (!value) return;
    if (key === "tags") {
      if (value.startsWith("[") && value.endsWith("]")) {
        const inner = value.slice(1, -1).trim();
        if (inner) {
          obj.tags = inner
            .split(",")
            .map((t) => t.trim().replace(/^['"]|['"]$/g, ""));
        }
      }
      return;
    }
    obj[key] = value.replace(/^['"]|['"]$/g, "");
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex !== -1) {
      if (currentKey) setValue(result, currentKey, currentValue.trim());
      currentKey = trimmed.slice(0, colonIndex).trim();
      currentValue = trimmed.slice(colonIndex + 1).trim();
    } else if (trimmed.startsWith("- ") && currentKey === "tags") {
      const tag = trimmed.slice(2).trim().replace(/^['"]|['"]$/g, "");
      result.tags.push(tag);
      currentValue = "";
    } else if (currentKey) {
      currentValue += "\n" + trimmed;
    }
  }
  if (currentKey) setValue(result, currentKey, currentValue.trim());

  return { frontmatter: result, content: bodyContent.trim() };
}

// 扫描 content/notes 目录，列出所有笔记
function scanNotes() {
  const notesDir = path.join(CONTENT_DIR, "notes");
  const notes = [];
  const categories = [
    { id: "java", name: "Java笔记" },
    { id: "frontend", name: "前端笔记" },
    { id: "database", name: "数据库笔记" },
  ];

  function walkDir(dirPath, relativePath) {
    let items;
    try {
      items = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch {
      return;
    }
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      if (item.isDirectory()) {
        walkDir(fullPath, path.join(relativePath, item.name));
      } else if (item.name.endsWith(".md")) {
        const mdContent = fs.readFileSync(fullPath, "utf-8");
        const { frontmatter, content } = parseFrontmatter(mdContent);
        const fileName = item.name.replace(/\.md$/, "");

        // 解析 cover 路径
        let cover = frontmatter.cover || "";
        if (cover && !cover.startsWith("/") && !cover.startsWith("http")) {
          cover = `${PUBLIC_URL}/api/files/notes/${relativePath}/${cover.replace(/^\.\//, "")}`;
        }

        notes.push({
          id: fileName,
          title: frontmatter.title || fileName,
          cover,
          date: frontmatter.date || "",
          datetime: frontmatter.datetime || "",
          wordCount: frontmatter.wordCount || "",
          readTime: frontmatter.readTime || "",
          category: frontmatter.category || "other",
          tags: frontmatter.tags || [],
          excerpt: frontmatter.excerpt || "",
        });
      }
    }
  }

  walkDir(notesDir, "");
  notes.sort((a, b) => {
    if (a.datetime && b.datetime)
      return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
    return 0;
  });

  return { notes, categories };
}

// GET /api/notes - 获取笔记列表
app.get("/api/notes", (req, res) => {
  try {
    const data = scanNotes();
    res.json(data);
  } catch (e) {
    console.error("扫描笔记失败:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/notes/:id/content - 获取笔记原始 Markdown 内容
app.get("/api/notes/:id/content", (req, res) => {
  try {
    const { id } = req.params;
    const notesDir = path.join(CONTENT_DIR, "notes");

    let found = null;
    function findFile(dir) {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        const full = path.join(dir, item.name);
        if (item.isDirectory()) findFile(full);
        else if (item.name === `${id}.md`) found = full;
      }
    }
    findFile(notesDir);

    if (!found) return res.status(404).json({ error: "笔记不存在" });
    const content = fs.readFileSync(found, "utf-8");
    const parsed = parseFrontmatter(content);
    res.type("text/plain").send(parsed.content);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/albums - 获取所有相册
app.get("/api/albums", (req, res) => {
  try {
    const photosDir = path.join(CONTENT_DIR, "photos");
    const albums = [];
    const subAlbums = [];

    const items = fs.readdirSync(photosDir, { withFileTypes: true });
    for (const item of items) {
      if (!item.isDirectory()) continue;
      const jsonPath = path.join(photosDir, item.name, "photos.json");
      if (!fs.existsSync(jsonPath)) continue;

      const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      const albumId = item.name;

      const photos = (raw.photos || []).map((photo) => ({
        ...photo,
        url: photo.url.startsWith("http")
          ? photo.url
          : `${PUBLIC_URL}/api/files/photos/${albumId}/${photo.url.split("/").pop()}`,
      }));

      const album = {
        id: albumId,
        title: raw.title || albumId,
        description: raw.description || "",
        photos,
      };
      albums.push(album);
      subAlbums.push({
        id: albumId,
        title: album.title,
        description: album.description,
        cover: photos[0]?.url || "",
        count: photos.length,
      });
    }

    res.json({ albums, subAlbums });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/music/tracks - 获取音乐曲目列表
app.get("/api/music/tracks", (req, res) => {
  try {
    const musicDir = path.join(CONTENT_DIR, "music");
    const tracks = [];

    const files = fs.readdirSync(musicDir, { withFileTypes: true });
    for (const file of files) {
      if (!file.name.endsWith(".mp3")) continue;
      const nameWithoutExt = file.name.replace(/\.mp3$/i, "");

      // 尝试读取同名的 json 配置文件
      const jsonPath = path.join(musicDir, `${nameWithoutExt}.json`);
      let name = nameWithoutExt;
      let artist = "未知歌手";

      if (fs.existsSync(jsonPath)) {
        try {
          const info = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
          name = info.name || name;
          artist = info.artist || artist;
        } catch {
          /* ignore */
        }
      }

      tracks.push({
        id: `default_${nameWithoutExt}`,
        name,
        artist,
        url: `${PUBLIC_URL}/api/files/music/${file.name}`,
      });
    }

    res.json(tracks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/blog/info - 获取博客信息
app.get("/api/blog/info", (req, res) => {
  // 尝试读取用户自定义配置，不存在则返回通用默认值
  const configPath = path.join(CONTENT_DIR, "blog_infos", "user-config.json");
  let userConfig = {};
  if (fs.existsSync(configPath)) {
    try {
      userConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch {
      /* ignore malformed config */
    }
  }

  const name = userConfig.name || "My Blog";
  const welcomeText = userConfig.welcomeText || "Welcome!";
  const avatarFile = userConfig.avatar || "";
  const avatar = avatarFile
    ? `${PUBLIC_URL}/api/files/blog_infos/avatars/${avatarFile}`
    : "";
  const userSocialLinks = userConfig.socialLinks || [];

  // 默认社交链接占位
  const defaultSocialLinks = [
    { name: "github", url: "https://github.com/", icon: "github" },
    { name: "bilibili", url: "https://space.bilibili.com/", icon: "bilibili" },
  ];

  res.json({
    name,
    welcomeText,
    avatar,
    navLinks: [
      { name: "首页", path: "/" },
      { name: "文章", path: "/articles" },
      { name: "项目", path: "/project" },
      { name: "相册", path: "/album" },
      { name: "工具", path: "/tools" },
      { name: "关于", path: "/about" },
    ],
    socialLinks: userSocialLinks.length > 0 ? userSocialLinks : defaultSocialLinks,
    hitokotos: [
      { text: "live a life you will remember.", author: "Avicii" },
      { text: "恐惧是生物的本能，勇气是人类的赞歌。", author: "JOJO的奇妙冒险" },
      { text: "But one day, I will be the champion.", author: "Brandon Moreno" },
      { text: "你有飘散的长发，我有手臂，笔直地举起。", author: "北岛" },
    ],
    bingWallpapers: [
      {
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20dramatic%20mountain%20landscape%20with%20lake%20at%20sunset%20golden%20light%20cinematic%20photography%20ultra%20wide%20angle&image_size=landscape_16_9",
        title: "大西洋雕琢而成的加拿大",
        description: '"地牢"塌陷海洞形成了天然的半封闭空间，海浪拍击时产生的回声会随着海况变化而改变，形成独特的海岸声学现象。',
        copyright: "© Kaitlyn McLachlan/Getty Images",
        location: "地牢省立公园, 纽芬兰和拉布拉多省, 加拿大",
      },
      {
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=aurora%20borealis%20northern%20lights%20over%20snowy%20mountains%20night%20sky%20purple%20green%20colors%20astrophotography&image_size=landscape_16_9",
        title: "北极光下的雪山",
        description: "北极光在夜空中舞动，绿色和紫色的光芒映照在皑皑雪山上，构成一幅绝美的自然画卷。",
        copyright: "© National Geographic",
        location: "挪威, 特罗姆瑟",
      },
      {
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tropical%20beach%20sunset%20palm%20trees%20turquoise%20ocean%20golden%20hour%20paradise%20island%20vacation&image_size=landscape_16_9",
        title: "热带海滩日落",
        description: "金色的阳光洒在碧蓝的海面上，棕榈树随风摇曳，构成一幅完美的热带天堂画面。",
        copyright: "© Getty Images",
        location: "马尔代夫",
      },
      {
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cherry%20blossom%20spring%20japanese%20garden%20pink%20flowers%20traditional%20pagoda%20peaceful%20zen&image_size=landscape_16_9",
        title: "春日樱花盛开",
        description: "樱花盛开的季节，粉色的花瓣随风飘落，古老的寺庙在花海中显得格外宁静。",
        copyright: "© Japan Tourism",
        location: "日本, 京都",
      },
      {
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=grand%20canyon%20sunrise%20red%20orange%20rock%20formations%20vast%20landscape%20majestic%20nature&image_size=landscape_16_9",
        title: "大峡谷日出",
        description: "清晨的阳光照亮了大峡谷的红色岩壁，层次分明的地质结构展现出大自然的鬼斧神工。",
        copyright: "© National Park Service",
        location: "美国, 亚利桑那州",
      },
    ],
  });
});

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

app.get("/api/video_info", async (req, res) => {
  const { bvid } = req.query;

  if (!bvid) {
    return res.status(400).json({ error: "缺少bvid参数" });
  }

  try {
    const response = await axios.get(
      `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
      {
        headers: { "User-Agent": USER_AGENT },
      },
    );

    const { data } = response;

    if (data.code !== 0) {
      return res
        .status(400)
        .json({ error: data.message || "获取视频信息失败" });
    }

    const info = data.data;
    const title = info.title || "";
    const cid = info.cid || 0;
    const pic = info.pic || "";
    const author = info.owner?.name || "";

    res.json({
      title,
      cid,
      pic,
      author,
      bvid,
    });
  } catch (error) {
    console.error("获取视频信息失败:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/audio_url", async (req, res) => {
  const { bvid, cid } = req.query;

  if (!bvid || !cid) {
    return res.status(400).json({ error: "缺少bvid或cid参数" });
  }

  try {
    const response = await axios.get(
      `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=16&fnval=80&fnver=0&fourk=1`,
      {
        headers: { "User-Agent": USER_AGENT },
      },
    );

    const { data } = response;

    if (data.code !== 0) {
      return res
        .status(400)
        .json({ error: data.message || "获取播放地址失败" });
    }

    const playInfo = data.data;
    const audioStreams = playInfo.dash?.audio || [];

    if (!audioStreams.length) {
      return res.status(400).json({ error: "未找到音频流" });
    }

    audioStreams.sort((a, b) => (b.bandwidth || 0) - (a.bandwidth || 0));
    const audioUrl = audioStreams[0].baseUrl;

    if (!audioUrl) {
      return res.status(400).json({ error: "未找到音频地址" });
    }

    res.json({ audio_url: audioUrl });
  } catch (error) {
    console.error("获取音频地址失败:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/proxy_audio", (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "缺少url参数" });
  }

  const protocol = url.startsWith("https") ? https : http;

  protocol
    .get(
      url,
      {
        headers: {
          "User-Agent": USER_AGENT,
          Referer: "https://www.bilibili.com/",
        },
      },
      (stream) => {
        const contentType = stream.headers["content-type"] || "audio/mpeg";
        const contentLength = stream.headers["content-length"];

        res.writeHead(200, {
          "Content-Type": contentType,
          "Content-Length": contentLength,
          "Access-Control-Allow-Origin": CLIENT_URL,
        });

        stream.pipe(res);

        stream.on("error", (err) => {
          console.error("音频流错误:", err.message);
          res.status(500).json({ error: err.message });
        });
      },
    )
    .on("error", (err) => {
      console.error("音频请求错误:", err.message);
      res.status(500).json({ error: err.message });
    });
});

app.get("/api/proxy_image", (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "缺少url参数" });
  }

  const protocol = url.startsWith("https") ? https : http;

  protocol
    .get(
      url,
      {
        headers: {
          "User-Agent": USER_AGENT,
          Referer: "https://www.bilibili.com/",
        },
      },
      (stream) => {
        const contentType = stream.headers["content-type"] || "image/jpeg";

        res.writeHead(200, {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": CLIENT_URL,
        });

        stream.pipe(res);

        stream.on("error", (err) => {
          console.error("图片流错误:", err.message);
          res.status(500).json({ error: err.message });
        });
      },
    )
    .on("error", (err) => {
      console.error("图片请求错误:", err.message);
      res.status(500).json({ error: err.message });
    });
});

// ============================================================
// 评论数据存储（基于 JSON 文件持久化）
// ============================================================
const DATA_DIR = path.join(__dirname, "data");
const COMMENTS_FILE = path.join(DATA_DIR, "comments.json");

// 确保 data 目录存在
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(COMMENTS_FILE))
  fs.writeFileSync(COMMENTS_FILE, "{}", "utf-8");

function loadComments() {
  try {
    return JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveComments(data) {
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// GET /api/comments/:pageId?page=1&limit=10 - 获取某页面的分页评论
app.get("/api/comments/:pageId", (req, res) => {
  const { pageId } = req.params;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const all = loadComments();
  const comments = all[pageId] || [];
  const total = comments.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const items = comments.slice(start, start + limit);
  res.json({ items, total, page, totalPages, limit });
});

// 敏感词列表（正则模式）
const SENSITIVE_WORDS = [
  /fuck/gi,
  /shit/gi,
  /傻逼/gi,
  /操你/gi,
  /草泥马/gi,
  /他妈/gi,
  /垃圾/gi,
  /去死/gi,
  /混蛋/gi,
  /白痴/gi,
  /脑残/gi,
];

// 敏感词过滤（用 *** 替换匹配词）
function filterSensitive(text) {
  let filtered = text;
  for (const pattern of SENSITIVE_WORDS) {
    filtered = filtered.replace(pattern, (match) => "*".repeat(match.length));
  }
  return filtered;
}

// POST /api/comments/:pageId - 添加评论
app.post("/api/comments/:pageId", (req, res) => {
  const { pageId } = req.params;
  const { nickname, contact, content, contactType, image } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "评论内容不能为空" });
  }
  const all = loadComments();
  if (!all[pageId]) all[pageId] = [];
  const comment = {
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    nickname: (nickname || "").trim() || "匿名",
    contact: (contact || "").trim() || null,
    contactType: contactType || null,
    content: filterSensitive(content.trim().slice(0, 500)),
    image: image || null,
    createdAt: new Date().toISOString(),
    replies: [],
  };
  all[pageId].push(comment);
  saveComments(all);
  res.status(201).json(comment);
});

// POST /api/comments/:pageId/:commentId/reply - 回复评论
app.post("/api/comments/:pageId/:commentId/reply", (req, res) => {
  const { pageId, commentId } = req.params;
  const { nickname, contact, content, contactType } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "回复内容不能为空" });
  }
  const verifyToken = req.headers["x-verify-token"];
  if (
    !verifyToken ||
    !verifyToken.startsWith("verified_")
  ) {
    return res.status(403).json({ error: "请先完成人机验证" });
  }
  const all = loadComments();
  if (!all[pageId]) return res.status(404).json({ error: "未找到该页面评论" });
  const comment = all[pageId].find((c) => c.id === commentId);
  if (!comment) return res.status(404).json({ error: "未找到该评论" });
  if (!comment.replies) comment.replies = [];
  const reply = {
    id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    nickname: (nickname || "").trim() || "匿名",
    contact: (contact || "").trim() || null,
    contactType: contactType || null,
    content: filterSensitive(content.trim().slice(0, 500)),
    createdAt: new Date().toISOString(),
    replyToNickname: comment.nickname,
  };
  comment.replies.push(reply);
  saveComments(all);
  res.status(201).json(reply);
});

// DELETE /api/comments/:pageId/:commentId - 删除评论
app.delete("/api/comments/:pageId/:commentId", (req, res) => {
  const { pageId, commentId } = req.params;
  const all = loadComments();
  if (!all[pageId]) return res.status(404).json({ error: "未找到评论" });
  const idx = all[pageId].findIndex((c) => c.id === commentId);
  if (idx === -1) return res.status(404).json({ error: "未找到该评论" });
  all[pageId].splice(idx, 1);
  saveComments(all);
  res.json({ success: true });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Allowed client: ${CLIENT_URL}`);
});
