import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePostInteractions = (postId: string, userId: string | null) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchInitialState = async () => {
      if (!userId) return;

      // Check if post is liked
      const { data: likeData, error: likeError } = await supabase
        .from("community_post_likes")
        .select()
        .eq("post_id", postId)
        .eq("user_id", userId);

      if (!likeError && likeData) {
        setIsLiked(likeData.length > 0);
      }

      // Check if post is favorited
      const { data: favoriteData, error: favoriteError } = await supabase
        .from("favorites")
        .select()
        .eq("idea_id", postId)
        .eq("user_id", userId)
        .eq("item_type", 'community_post');

      if (!favoriteError && favoriteData) {
        setIsFavorite(favoriteData.length > 0);
      }

      // Get initial counts
      const { data: post } = await supabase
        .from("community_posts")
        .select("likes_count, comments_count")
        .eq("id", postId)
        .single();

      if (post) {
        setLikeCount(post.likes_count || 0);
        setCommentCount(post.comments_count || 0);
      }
    };

    fetchInitialState();

    // Subscribe to real-time updates
    const channel = supabase.channel(`post-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts',
          filter: `id=eq.${postId}`
        },
        (payload) => {
          if (payload.new) {
            setLikeCount(payload.new.likes_count || 0);
            setCommentCount(payload.new.comments_count || 0);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, userId]);

  return {
    isLiked,
    setIsLiked,
    isFavorite,
    setIsFavorite,
    likeCount,
    commentCount
  };
};