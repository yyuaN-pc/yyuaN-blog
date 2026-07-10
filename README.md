
# YY Blog — 个人知识管理与展示平台

一个前后端分离的个人博客系统，支持 Markdown 笔记管理、旅行相册展示、B 站音频提取、音乐播放、评论互动等功能。

## 技术栈

| 分类 | 技术 |
|------|------|
| 前端框架 | Vue 3 + TypeScript + Vite |
| 路由 | Vue Router (Hash 模式) |
| 后端 | Node.js + Express |
| 图标库 | Tabler Icons |
| Markdown | marked + DOMPurify |
| Web Worker | Markdown 异步解析 |
| PWA | vite-plugin-pwa（离线缓存 + 添加到主屏幕） |
| 部署 | 前端静态托管 + Node.js 后端 |

## 功能模块

- **首页** — 个人名片、必应每日壁纸、一言语录、文章列表
- **笔记系统** — Markdown 渲染、分类浏览、全文搜索、目录导航高亮、Web Worker 异步解析
- **相册系统** — 子相册网格展示、单图/多图模式切换、动态网格布局、键盘快捷键
- **工具集** — B 站视频转音频提取与下载、实用网址导航
- **背景音乐播放器** — 全局单例跨页面不断播，支持循环/单曲/随机模式，CD 唱片旋转动画
- **评论系统** — 楼中楼回复、敏感词过滤、Emoji 选择、图片上传、分页展示、信息持久化
- **PWA 离线支持** — Service Worker 三级缓存策略（CacheFirst / StaleWhileRevalidate / NetworkFirst）

## 项目结构

```
yy-project/
├── backend/                   # 后端服务
│   ├── content/               # 内容资源（笔记/照片/音乐/头像）
│   │   ├── blog_infos/        # 博客配置（头像等）
│   │   ├── music/             # 背景音乐（.mp3 + .json）
│   │   ├── notes/             # Markdown 笔记（按分类目录组织）
│   │   └── photos/            # 相册照片（按相册目录 + photos.json）
│   ├── data/                  # 运行时数据
│   │   └── comments.json      # 评论数据持久化
│   ├── server.js              # Express 服务入口
│   └── package.json
│
├── frontend/                  # 前端 SPA
│   ├── src/
│   │   ├── components/        # 可复用组件
│   │   │   ├── icons/         # 自定义图标
│   │   │   └── tools/         # 工具集子组件
│   │   ├── composables/       # 组合式逻辑（useMusicPlayer, useScrollSpy）
│   │   ├── config/            # 配置（API 地址等）
│   │   ├── data/              # 数据层（异步 API 获取）
│   │   ├── router/            # 路由配置
│   │   ├── styles/            # 全局样式
│   │   ├── types/             # TypeScript 类型定义
│   │   ├── utils/             # 工具函数（搜索、Markdown、B站API）
│   │   ├── views/             # 页面组件
│   │   └── workers/           # Web Worker（Markdown 异步解析）
│   ├── index.html
│   ├── vite.config.ts         # Vite 配置（含 PWA + API 代理）
│   └── package.json
│
└── package.json               # 根目录脚本
```

## 本地开发

### 前置要求

- Node.js >= 18

### 1. 启动后端

```bash
cd backend
npm install
npm start
```

后端运行在 `http://localhost:5000`

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 `http://localhost:5173`，开发模式下 `/api/*` 请求自动代理到后端。

### 3. 添加内容

所有内容资源存放在 `backend/content/` 目录：

| 类型 | 目录 | 添加方式 |
|------|------|---------|
| 笔记 | `content/notes/<分类>/` | 新建 `.md` 文件，添加 frontmatter 头 |
| 照片 | `content/photos/<相册>/` | 放入照片 + 创建 `photos.json` |
| 音乐 | `content/music/` | 放入 `.mp3` 文件，可选同名 `.json` 配置 |
| 头像 | `content/blog_infos/avatars/` | 替换图片文件 |

添加内容后直接刷新前端即可生效，**无需重新构建**。

---

### 新用户快速上手

> **Fork 了本项目？** 先运行一键重置脚本清空原作者的个人数据：
> ```bash
> # Windows
> .\scripts\reset-personal-data.bat
>
> # macOS/Linux
> # 暂无一键脚本，手动删除：backend/content/ 下的 .md/.jpg/.mp3 文件
> ```

克隆项目后，按以下步骤配置个人信息：

1. **复制用户配置模板**
   ```bash
   cp backend/content/blog_infos/user-config.sample.json backend/content/blog_infos/user-config.json
   ```
   打开 `user-config.json`，填入你的姓名、头像、社交链接

2. **添加个人头像**
   将头像文件放入 `backend/content/blog_infos/avatars/`，并在 `user-config.json` 中填写文件名

3. **添加笔记**
   在 `backend/content/notes/` 下创建分类目录（如 `java/`），放入 `.md` 文件（需包含 frontmatter 头）

4. **添加照片**
   在 `backend/content/photos/` 下创建相册目录，放入照片 + 创建 `photos.json`

5. **添加背景音乐**
   将 `.mp3` 文件放入 `backend/content/music/`，可选同名 `.json` 文件配置歌名/歌手

6. **（可选）清空评论数据**
   ```bash
   echo "{}" > backend/data/comments.json
   ```

## 部署方案（Vercel + Render）

推荐使用 **Vercel 部署前端** + **Render 部署后端**，两个平台都有免费额度，各自负责最擅长的领域。

---

### 第一步：后端部署到 Render

1. 在 [Render](https://render.com) 注册 → Dashboard → **New +** → **Web Service**
2. 连接 GitHub 仓库，选择 `backend/` 为 **Root Directory**
3. 填入配置：

   | 项目 | 值 |
   |------|-----|
   | Name | `yy-blog-api`（可自定义） |
   | Build Command | `npm install` |
   | Start Command | `node server.js` |
   | Instance Type | **Free** |

4. 点击 **Advanced** → **Add Environment Variable**，添加：

   | 变量 | 值 |
   |------|-----|
   | `PORT` | `5000` |
   | `CLIENT_URL` | `*`（上线后再改为前端域名） |

5. 点击 **Create Web Service**，等待部署完成
6. 成功后你会得到一个 URL：`https://yy-blog-api.onrender.com`

---

### 第二步：前端部署到 Vercel

1. 在 [Vercel](https://vercel.com) 注册 → **Add New** → **Project**
2. 导入同一个 GitHub 仓库
3. **关键配置**：

   | 项目 | 值 |
   |------|-----|
   | Root Directory | `frontend` |
   | Framework Preset | Vite |
   | Build Command | `npm install && npm run build` |
   | Output Directory | `dist` |

4. 点击 **Environment Variables**，添加：

   | 变量 | 值 |
   |------|-----|
   | `VITE_API_BASE` | `https://yy-blog-api.onrender.com`（替换为你的 Render 地址） |

5. 点击 **Deploy**，等待部署完成
6. 成功后你会得到一个 URL：`https://yy-blog.vercel.app`

---

### 第三步：更新 Render 的 CORS

回到 Render Dashboard，编辑你的 Web Service，在 Environment Variables 中更新：

| 变量 | 值 |
|------|-----|
| `CLIENT_URL` | `https://yy-blog.vercel.app`（你的 Vercel 地址） |

保存后 Render 会自动重新部署。

---

### 第四步：验证上线

1. 打开 `https://yy-blog.vercel.app`
2. 检查：
   - 首页文章列表是否正常加载
   - 笔记详情页 Markdown 是否正确渲染
   - 相册图片是否正常显示
   - 评论能否正常提交
   - 音乐播放器能否播放
3. 打开 F12 → Network，确认所有 `/api/*` 请求都指向你的 Render 域名

---

### 后续更新内容

SSH 不需要，直接在 **Render Dashboard** → 你的 Web Service → **Shell** 选项卡（或通过 SFTP 工具连接），在 `backend/content/` 目录下添加文件即可自动生效。

或者将 `backend/content/` 目录单独放到 GitHub 仓库，每次推送 Render 会自动重新部署。

---

### 环境变量参考

| 变量 | 平台 | 说明 | 示例 |
|------|------|------|------|
| `VITE_API_BASE` | Vercel | 后端 API 完整地址 | `https://yy-blog-api.onrender.com` |
| `PORT` | Render | 后端服务端口 | `5000` |
| `CLIENT_URL` | Render | CORS 允许的前端地址 | `https://yy-blog.vercel.app` |

---

### 绑定自定义域名（可选）

- **Vercel**：Project → Settings → Domains → 输入域名 → 按照提示配置 DNS
- **Render**：Dashboard → Web Service → Settings → Custom Domain → 配置 CNAME 指向 `onrender.com`

## 常见操作

### 更新内容

内容文件热生效，无需重新构建前端：
1. SSH 登录服务器
2. 在 `backend/content/` 目录下添加/修改文件
3. 刷新前端页面即可看到变更

### 清除评论数据

```bash
# 重置所有评论
echo "{}" > backend/data/comments.json
```

## 许可证

MIT
