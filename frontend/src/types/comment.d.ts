export interface Reply {
  id: string;
  nickname: string;
  contact: string | null;
  contactType: string | null;
  content: string;
  createdAt: string;
  replyToNickname: string;
}

export interface Comment {
  id: string;
  nickname: string;
  contact: string | null;
  contactType: string | null;
  content: string;
  image: string | null;
  createdAt: string;
  replies: Reply[];
}

export interface CommentPage {
  items: Comment[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export type ContactType = "qq" | "email" | "bilibili" | "website";
