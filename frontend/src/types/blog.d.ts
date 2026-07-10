// 博客文章类型
export interface Post {
  id: string;
  title: string;
  cover: string;
  date: string;
  datetime: string;
  wordCount: string;
  readTime: string;
  pinned: boolean;
  tags: string[];
  excerpt: string;
}

// 导航链接类型
export interface NavLink {
  name: string;
  path: string;
}

// 社交链接类型
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

// 一言类型
export interface Hitokoto {
  text: string;
  author: string;
}

// 博客信息类型
export interface BlogInfo {
  name: string;
  welcomeText: string;
  avatar: string;
}

// 必应壁纸类型
export interface BingWallpaper {
  image: string;
  title: string;
  description: string;
  copyright: string;
  location: string;
}
