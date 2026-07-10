import type { Category, Note, AdjacentNotes } from '../types'
import { API_NOTES } from '../config/api'

export const categories: Category[] = [
  { id: "java", name: "Java笔记" },
  { id: "frontend", name: "前端笔记" },
  { id: "database", name: "数据库笔记" },
];

// 缓存笔记列表
let _notes: Note[] | undefined;

export async function getNotes(): Promise<Note[]> {
  if (_notes) return _notes;
  const res = await fetch(API_NOTES);
  const data = await res.json();
  _notes = data.notes;
  return data.notes as Note[];
}

export async function getNoteContent(id: string): Promise<string> {
  const res = await fetch(`${API_NOTES}/${encodeURIComponent(id)}/content`);
  if (!res.ok) return "暂无内容";
  return await res.text();
}

export async function getAdjacentNotes(id: string): Promise<AdjacentNotes> {
  const notes = await getNotes();
  const index = notes.findIndex((n) => n.id === id);
  return {
    prev: index > 0 ? notes[index - 1] : null,
    next: index < notes.length - 1 ? notes[index + 1] : null,
  };
}
