import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SharedIdea } from "@/types/shared-idea";

interface IdeaSubmitData {
  title: string;
  content: string;
  channel: string;
  category?: string;
  feedbackType?: string;
  tags?: string[];
}

export const useCommunityPosts = (channel: string) => {
  const [posts, setPosts] = useState<SharedIdea[]>([]);
  const { toast } = useToast();

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from("community_posts")
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq("channel", channel)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      return;
    }

    setPosts(data || []);
  }, [channel]);

  const handleIdeaSubmit = async (idea: IdeaSubmitData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to share ideas",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("community_posts").insert({
        title: idea.title,
        content: idea.content,
        channel: idea.channel,
        category: idea.category,
        feedback_type: idea.feedbackType,
        user_id: user.id,
        tags: idea.tags || [],
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your idea has been shared with the community",
      });

      fetchPosts();
    } catch (error) {
      console.error("Error submitting idea:", error);
      toast({
        title: "Error",
        description: "Failed to share your idea. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    posts,
    handleIdeaSubmit,
    fetchPosts,
  };
};