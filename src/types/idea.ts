export interface IdeaFormData {
  title: string;
  content: string;
  tags: string[];
  category?: string;
  feedbackType?: string;
  channel?: string;
  isCollaborative?: boolean;
  shareToCommunity?: boolean;
}