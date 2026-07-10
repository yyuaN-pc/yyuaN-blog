import type { Note } from "./note";

export interface SearchResult {
  note: Note;
  context: string;
  matchedField: "title" | "excerpt" | "content";
}