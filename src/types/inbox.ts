export interface Author {
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender: {
    username: string;
    avatar_url?: string;
    user_id: string;
  };
  recipient: {
    username: string;
    avatar_url?: string;
    user_id: string;
  };
}

export interface Conversation {
  id: number;
  sender: Author;
  ideaTitle: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  type: "request" | "message";
}