export interface Sender {
  name: string;
  avatar: string;
}

export interface Conversation {
  id: number;
  sender: Sender;
  ideaTitle: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  type: "request" | "message";
}

export interface Message {
  id: number;
  senderId: string | number;
  content: string;
  timestamp: string;
}