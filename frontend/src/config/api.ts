// API 地址配置：根据运行环境自动切换
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// 生产环境下使用 VITE_API_BASE 环境变量（Vercel 上设置）
// 若未设置则用空字符串（仅开发环境有效）
const PROD_API_BASE = import.meta.env.VITE_API_BASE || "";

export const API_BASE = isLocal ? "" : PROD_API_BASE;

export const API_COMMENTS = `${API_BASE}/api/comments`;

// 资源 API
export const API_NOTES = `${API_BASE}/api/notes`;
export const API_ALBUMS = `${API_BASE}/api/albums`;
export const API_MUSIC_TRACKS = `${API_BASE}/api/music/tracks`;
export const API_BLOG_INFO = `${API_BASE}/api/blog/info`;
