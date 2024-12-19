import { Json } from "@/integrations/supabase/types";

export interface SharedIdea {
  id: string;
  title: string;
  content: string;
  user_id: string | null;
  created_at: string | null;
  category: string | null;
  channel: string | null;
  comments_count: number | null;
  emoji_reactions: Record<string, number> | null;
  feedback_type: string | null;
  is_pinned: boolean | null;
  likes_count: number | null;
  tags: string[] | null;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  } | null;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface SharedIdeaResponse extends Omit<SharedIdea, 'emoji_reactions'> {
  emoji_reactions: Json;
}