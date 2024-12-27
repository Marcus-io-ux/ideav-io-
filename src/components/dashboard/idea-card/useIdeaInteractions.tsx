import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useIdeaInteractions = (ideaId: string, userId: string | null) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

  useEffect(() => {
    const fetchInitialState = async () => {
      if (!userId) return;

      // Check if idea is liked by current user
      const { data: likeData } = await supabase
        .from("idea_likes")
        .select()
        .eq("idea_id", ideaId)
        .eq("user_id", userId)
        .single();

      setIsLiked(!!likeData);

      // Get initial counts
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

    // Subscribe to real-time updates for likes and comments
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
          if (newIdea) {
            setLikesCount(newIdea.likes_count || 0);
            setCommentsCount(newIdea.comments_count || 0);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ideaId, userId]);

  const handleLike = async () => {
    if (!userId) return;

    try {
      if (isLiked) {
        await supabase
          .from("idea_likes")
          .delete()
          .eq("idea_id", ideaId)
          .eq("user_id", userId);
      } else {
        await supabase
          .from("idea_likes")
          .insert([
            { idea_id: ideaId, user_id: userId }
          ]);
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleComments = () => {
    setIsCommentsExpanded(!isCommentsExpanded);
    if (!isCommentsExpanded) {
      fetchComments();
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .rpc('get_idea_comments', {
          p_idea_id: ideaId
        });
      
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
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