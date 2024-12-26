import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentList } from "./comments/CommentList";
import { CreatePostDialog } from "./CreatePostDialog";

export const CommunityFeed = () => {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  // Fetch posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['community-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Create post mutation
  const createPost = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('community_posts')
        .insert([
          {
            user_id: user.id,
            title: "New Post",
            content: postContent,
            channel: 'general'
          }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      setPostContent("");
      toast({
        title: "Post created",
        description: "Your idea has been shared with the community!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Like post mutation
  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First check if the user has already liked this post
      const { data: existingLike } = await supabase
        .from('community_post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingLike) {
        // If like exists, remove it (unlike)
        const { error } = await supabase
          .from('community_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
        return { action: 'unliked' };
      } else {
        // If no like exists, create one
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

  const toggleComments = (postId: string) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-6">
        <Button 
          onClick={() => setIsPostDialogOpen(true)}
          size="lg"
          className="shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="mr-2" size={20} />
          Share your idea
        </Button>
      </div>

      <CreatePostDialog 
        isOpen={isPostDialogOpen} 
        onClose={() => setIsPostDialogOpen(false)} 
      />

      {isLoading ? (
        <div>Loading posts...</div>
      ) : (
        posts?.map((post) => (
          <div key={post.id} className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Avatar>
                <AvatarImage src={post.profiles?.avatar_url} />
                <AvatarFallback>
                  {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{post.profiles?.username || 'Anonymous'}</h3>
                <p className="text-sm text-muted-foreground">
                  Posted {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="mb-4">{post.content}</p>
            <div className="flex gap-2 mb-4">
              {post.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary">#{tag}</Badge>
              ))}
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" onClick={() => likePost.mutate(post.id)}>
                <ThumbsUp className="w-4 h-4 mr-2" />
                {post.likes_count || 0}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toggleComments(post.id)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                {post.comments_count || 0}
              </Button>
            </div>
            
            {expandedPost === post.id && (
              <div className="mt-4 pt-4 border-t">
                <CommentList postId={post.id} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
