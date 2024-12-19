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