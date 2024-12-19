export interface DashboardIdea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  isFavorite?: boolean;
  sharedToCommunity?: boolean;
  deleted?: boolean;
}

export interface IdeaFormData {
  title: string;
  content: string;
  channel: string;
  category: string;
  feedbackType: string;
  shareToCommunity: boolean;
  tags: string[];
}