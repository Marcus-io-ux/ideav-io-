import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCommunityFeed = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState("general");
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

  const { data: posts, isLoading } = useQuery({
    queryKey: ['community-posts', selectedChannel, showOnlyMyPosts, currentUserId],
    queryFn: async () => {
      const query = supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedChannel !== 'all') {
        query.eq('channel', selectedChannel);
      }

      if (showOnlyMyPosts && currentUserId) {
        query.eq('user_id', currentUserId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: existingLike } = await supabase
        .from('community_post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingLike) {
        const { error } = await supabase
          .from('community_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
        return { action: 'unliked' };
      } else {
        const { error } = await supabase
          .from('community_post_likes')
          .insert([
            { post_id: postId, user_id: user.id }
          ]);

        if (error) throw error;
        return { action: 'liked' };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast({
        title: result.action === 'liked' ? "Post liked" : "Post unliked",
        description: result.action === 'liked' ? "You've liked this post!" : "You've unliked this post",
      });
    },
    onError: (error) => {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.user) throw new Error("Not authenticated");

      const { data: post } = await supabase
        .from('community_posts')
        .select('title, content, user_id')
        .eq('id', postId)
        .single();

      if (post) {
        await supabase
          .from('ideas')
          .update({ shared_to_community: false })
          .match({
            title: post.title,
            content: post.content,
            user_id: post.user_id
          });
      }

      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast({
        title: "Success",
        description: "Your post has been deleted",
      });
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  });

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