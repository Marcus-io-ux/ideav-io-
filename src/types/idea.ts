export interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  images?: string[];
  createdAt: Date;
  isFavorite?: boolean;
  sharedToCommunity?: boolean;
  deleted?: boolean;
}

export interface IdeaFormData {
  title: string;
  content: string;
  tags: string[];
  images?: string[];
  category?: string;
  feedbackType?: string;
  channel?: string;
  isCollaborative?: boolean;
  shareToCommunity?: boolean;
}