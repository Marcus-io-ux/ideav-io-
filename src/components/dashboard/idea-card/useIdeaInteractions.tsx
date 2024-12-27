import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

export const useIdeaInteractions = (ideaId: string, userId: string | undefined) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInitialState = async () => {
      if (!userId) return;

      // Check if user has liked the idea
      const { data: likeData } = await supabase
        .from("idea_likes")
        .select()
        .eq("idea_id", ideaId)
        .eq("user_id", userId)
        .single();

      setIsLiked(!!likeData);

      // Get idea stats
      const { data: idea } = await supabase
        .from("ideas")
        .select("likes_count, comments_count")
        .eq("id", ideaId)
        .single();

      if (idea) {
        setLikesCount(idea.likes_count || 0);
        setCommentsCount(idea.comments_count || 0);
      }
    };

    fetchInitialState();

    // Subscribe to real-time updates
    const channel = supabase.channel(`idea-${ideaId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas',
          filter: `id=eq.${ideaId}`
        },
        (payload) => {
          const newIdea = payload.new as any;
          setLikesCount(newIdea.likes_count || 0);
          setCommentsCount(newIdea.comments_count || 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ideaId, userId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("idea_comments")
      .select(`
        id,
        content,
        created_at,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq("idea_id", ideaId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    setComments(data as Comment[]);
  };

  const handleLike = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like ideas",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!isLiked) {
        const { error } = await supabase
          .from("idea_likes")
          .insert([{ idea_id: ideaId, user_id: userId }]);

        if (error) throw error;
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      } else {
        const { error } = await supabase
          .from("idea_likes")
          .delete()
          .eq("idea_id", ideaId)
          .eq("user_id", userId);

        if (error) throw error;
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleComments = async () => {
    setIsCommentsExpanded(!isCommentsExpanded);
    if (!isCommentsExpanded) {
      await fetchComments();
    }
  };

  return {
    isLiked,
    likesCount,
    commentsCount,
    comments,
    isCommentsExpanded,
    handleLike,
    toggleComments,
    fetchComments,
  };
};