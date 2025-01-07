import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCommunityPostsQuery = (
  selectedChannel: string,
  showOnlyMyPosts: boolean,
  currentUserId: string | null
) => {
  return useQuery({
    queryKey: ['community-posts', selectedChannel, showOnlyMyPosts, currentUserId],
    queryFn: async () => {
      const postsQuery = supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          ),
          comments:community_comments (
            id,
            content,
            created_at,
            user_id,
            profiles:user_id (
              username,
              avatar_url
            )
          ),
          likes:community_post_likes(count)
        `)
        .neq('channel', 'general')
        .order('created_at', { ascending: false });

      if (selectedChannel !== 'all') {
        postsQuery.eq('channel', selectedChannel);
      }

      if (showOnlyMyPosts && currentUserId) {
        postsQuery.eq('user_id', currentUserId);
      }

      const { data: postsData, error: postsError } = await postsQuery;
      if (postsError) throw postsError;

      if (currentUserId) {
        const { data: userLikes } = await supabase
          .from('community_post_likes')
          .select('post_id')
          .eq('user_id', currentUserId);

        return postsData.map(post => ({
          ...post,
          is_liked: userLikes?.some(like => like.post_id === post.id) || false,
          likes_count: post.likes?.[0]?.count || 0,
          comments_count: post.comments?.length || 0
        }));
      }

      return postsData.map(post => ({
        ...post,
        is_liked: false,
        likes_count: post.likes?.[0]?.count || 0,
        comments_count: post.comments?.length || 0
      }));
    },
    enabled: true,
  });
};