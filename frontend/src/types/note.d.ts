// 笔记分类类型
export interface Category {
  id: string;
  name: string;
}

// 笔记类型
export interface Note {
  id: string;
  title: string;
  category: string;
  date: string;
  datetime: string;
  wordCount: string;
  readTime: string;
  excerpt: string;
  tags: string[];
  cover: string;
}

// 笔记内容映射类型
export interface NoteContents {
  [key: string]: string;
}

// 相邻笔记类型
export interface AdjacentNotes {
  prev: Note | null;
  next: Note | null;
}

// 目录项类型
export interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Markdown 前端元数据类型
export interface Frontmatter {
  title: string;
  category: string;
  date: string;
  datetime: string;
  wordCount: string;
  readTime: string;
  excerpt: string;
  tags: string[];
  cover: string;
}

// 解析后的 Markdown 类型
export interface ParsedMarkdown {
  frontmatter: Frontmatter;
  content: string;
}
