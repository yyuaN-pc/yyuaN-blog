import type { NavLink, SocialLink, Hitokoto, BlogInfo, BingWallpaper } from '../types'
import { API_BLOG_INFO } from '../config/api'

export const navLinks: NavLink[] = [
  { name: "首页", path: "/" },
  { name: "文章", path: "/articles" },
  { name: "项目", path: "/project" },
  { name: "相册", path: "/album" },
  { name: "工具", path: "/tools" },
  { name: "关于", path: "/about" },
];

export const socialLinks: SocialLink[] = [
  { name: "github", url: "https://github.com/your-username", icon: "github" },
  { name: "bilibili", url: "https://space.bilibili.com/your-uid", icon: "bilibili" },
];

export const hitokotos: Hitokoto[] = [
  { text: "live a life you will remember.", author: "Avicii" },
  { text: "恐惧是生物的本能，勇气是人类的赞歌。", author: "JOJO的奇妙冒险" },
  {
    text: "But one day, I will be the champion.",
    author: "Brandon Moreno",
  },
  { text: "你有飘散的长发，我有手臂，笔直地举起。", author: "北岛" },
];

// 从后端获取博客信息（头像等）
let _blogInfo: BlogInfo | undefined;

export async function getBlogInfo(): Promise<BlogInfo> {
  if (_blogInfo) return _blogInfo;
  try {
    const res = await fetch(API_BLOG_INFO);
    _blogInfo = await res.json() as BlogInfo;
  } catch {
    _blogInfo = { name: "My Blog", welcomeText: "Welcome!", avatar: "" };
  }
  return _blogInfo!;
}

export const bingWallpapers: BingWallpaper[] = [
  {
    image:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20dramatic%20mountain%20landscape%20with%20lake%20at%20sunset%20golden%20light%20cinematic%20photography%20ultra%20wide%20angle&image_size=landscape_16_9",
    title: "大西洋雕琢而成的加拿大",
    description:
      '"地牢"塌陷海洞形成了天然的半封闭空间，海浪拍击时产生的回声会随着海况变化而改变，形成独特的海岸声学现象。',
    copyright: "© Kaitlyn McLachlan/Getty Images",
    location: "地牢省立公园, 纽芬兰和拉布拉多省, 加拿大",
  },
  {
    image:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=aurora%20borealis%20northern%20lights%20over%20snowy%20mountains%20night%20sky%20purple%20green%20colors%20astrophotography&image_size=landscape_16_9",
    title: "北极光下的雪山",
    description:
      "北极光在夜空中舞动，绿色和紫色的光芒映照在皑皑雪山上，构成一幅绝美的自然画卷。",
    copyright: "© National Geographic",
    location: "挪威, 特罗姆瑟",
  },
  {
    image:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tropical%20beach%20sunset%20palm%20trees%20turquoise%20ocean%20golden%20hour%20paradise%20island%20vacation&image_size=landscape_16_9",
    title: "热带海滩日落",
    description:
      "金色的阳光洒在碧蓝的海面上，棕榈树随风摇曳，构成一幅完美的热带天堂画面。",
    copyright: "© Getty Images",
    location: "马尔代夫",
  },
  {
    image:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cherry%20blossom%20spring%20japanese%20garden%20pink%20flowers%20traditional%20pagoda%20peaceful%20zen&image_size=landscape_16_9",
    title: "春日樱花盛开",
    description:
      "樱花盛开的季节，粉色的花瓣随风飘落，古老的寺庙在花海中显得格外宁静。",
    copyright: "© Japan Tourism",
    location: "日本, 京都",
  },
  {
    image:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=grand%20canyon%20sunrise%20red%20orange%20rock%20formations%20vast%20landscape%20majestic%20nature&image_size=landscape_16_9",
    title: "大峡谷日出",
    description:
      "清晨的阳光照亮了大峡谷的红色岩壁，层次分明的地质结构展现出大自然的鬼斧神工。",
    copyright: "© National Park Service",
    location: "美国, 亚利桑那州",
  },
];

export const bingWallpaper: BingWallpaper = bingWallpapers[0];
