import type { Note, SearchResult } from "../types";
import { getNotes, getNoteContent } from "../data/notesData";

/**
 * 转义正则特殊字符
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 从匹配位置提取上下文
 */
function extractContext(
  text: string,
  matchIndex: number,
  matchLength: number,
  radius = 40
): string {
  const start = Math.max(0, matchIndex - radius);
  const end = Math.min(text.length, matchIndex + matchLength + radius);
  let context = text.slice(start, end).replace(/\n/g, " ");
  if (start > 0) context = "..." + context;
  if (end < text.length) context = context + "...";
  return context;
}

let _allNotes: Note[] | null = null;

/**
 * 搜索笔记：按 title > excerpt > content 优先级匹配
 */
export async function searchNotes(query: string): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  if (!_allNotes) {
    _allNotes = await getNotes();
  }

  const results: SearchResult[] = [];

  for (const note of _allNotes) {
    // 1. 标题匹配
    const titleIndex = note.title.toLowerCase().indexOf(q);
    if (titleIndex !== -1) {
      results.push({
        note,
        context: note.excerpt,
        matchedField: "title",
      });
      continue;
    }

    // 2. 摘要匹配
    const excerptIndex = note.excerpt.toLowerCase().indexOf(q);
    if (excerptIndex !== -1) {
      results.push({
        note,
        context: extractContext(note.excerpt, excerptIndex, q.length),
        matchedField: "excerpt",
      });
      continue;
    }

    // 3. 内容匹配
    try {
      const content = await getNoteContent(note.id);
      if (content && content !== "暂无内容") {
        const contentIndex = content.toLowerCase().indexOf(q);
        if (contentIndex !== -1) {
          results.push({
            note,
            context: extractContext(content, contentIndex, q.length),
            matchedField: "content",
          });
        }
      }
    } catch {
      // 跳过获取失败的笔记
    }
  }

  return results;
}

/**
 * 高亮关键词（返回 HTML 字符串，已转义）
 */
export function highlightText(text: string, query: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const q = query.trim();
  if (!q) return escaped;
  const regex = new RegExp(`(${escapeRegExp(q)})`, "gi");
  return escaped.replace(regex, '<mark class="search-highlight">$1</mark>');
}
