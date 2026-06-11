// ===== API TYPES =====

export interface User {
  _id: string;
  username: string;
}

export type ContentType = 'tweet' | 'youtube' | 'document' | 'link' | 'note';

export interface Content {
  _id: string;
  title: string;
  link?: string;
  type?: ContentType;
  tags?: string[];
  userId: User | string;
  createdAt?: string;
  note?: string;
}

export interface AuthResponse {
  token: string;
}

export interface MessageResponse {
  message: string;
}

export interface ContentListResponse {
  content: Content[];
}

export interface ShareResponse {
  hash: string;
}
