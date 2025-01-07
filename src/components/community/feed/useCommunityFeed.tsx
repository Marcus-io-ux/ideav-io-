import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useCommunityPostsQuery } from "@/hooks/use-community-posts-query";
import { usePostLikeMutation } from "@/hooks/use-post-like-mutation";
import { usePostDeleteMutation } from "@/hooks/use-post-delete-mutation";

export const useCommunityFeed = () => {
  const queryClient = useQueryClient();
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState("feedback");
  const [showOnlyMyPosts, setShowOnlyMyPosts] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);
    };
    getUser();

    const channel = supabase.channel('community-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts'
        },
        () => {
          console.log('Post updated, refreshing feed...');
          queryClient.invalidateQueries({ queryKey: ['community-posts'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_comments'
        },
        () => {
          console.log('Comment added/removed, refreshing feed...');
          queryClient.invalidateQueries({ queryKey: ['community-posts'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_post_likes'
        },
        () => {
          console.log('Like added/removed, refreshing feed...');
          queryClient.invalidateQueries({ queryKey: ['community-posts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: posts, isLoading } = useCommunityPostsQuery(
    selectedChannel,
    showOnlyMyPosts,
    currentUserId
  );

  const likePost = usePostLikeMutation();
  const deletePost = usePostDeleteMutation();

  return {
    posts,
    isLoading,
    currentUserId,
    expandedPost,
    selectedChannel,
    showOnlyMyPosts,
    setShowOnlyMyPosts,
    setSelectedChannel,
    setExpandedPost,
    likePost,
    deletePost,
  };
};