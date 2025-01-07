import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePostLikeMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
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
};