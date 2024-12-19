export interface Idea {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  images?: string[];
  isFavorite?: boolean;
  isDraft?: boolean;
  deleted?: boolean;
}

export interface IdeaFormData {
  title: string;
  content: string;
  channel?: string;
  category?: string;
  feedbackType?: string;
  shareToCommunity?: boolean;
  tags?: string[];
  images?: string[];
}