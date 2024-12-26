import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Share2, Bookmark } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const CommunityFeed = () => {
  const [postContent, setPostContent] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
    onError: (error) => {
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

      const { error } = await supabase
        .from('community_post_likes')
        .insert([
          { post_id: postId, user_id: user.id }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast({
        title: "Post liked",
        description: "You've liked this post!",
      });
    }
  });

  // Save post mutation
  const savePost = useMutation({
    mutationFn: async (postId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('favorites')
        .insert([
          { 
            idea_id: postId, 
            user_id: user.id,
            item_type: 'community_post'
          }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Post saved",
        description: "Post has been saved to your favorites!",
      });
    }
  });

  const handlePost = () => {
    if (!postContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }
    createPost.mutate();
  };

  const handleShare = async (postId: string) => {
    try {
      await navigator.share({
        title: 'Check out this post on IdeaVault',
        text: 'I found this interesting post on IdeaVault',
        url: `${window.location.origin}/community/post/${postId}`
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to share the post. Try copying the link instead.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">What's on your mind?</h2>
        <Textarea
          placeholder="Share your latest idea, ask a question, or start a discussion..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="mb-4"
        />
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Attach Files</Button>
            <Button variant="outline" size="sm">Add Tags</Button>
            <Button variant="outline" size="sm">Tag Users</Button>
          </div>
          <Button onClick={handlePost} disabled={createPost.isPending}>
            {createPost.isPending ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>

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
              <Button variant="ghost" size="sm" onClick={() => navigate(`/community/post/${post.id}`)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                {post.comments_count || 0}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleShare(post.id)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm" onClick={() => savePost.mutate(post.id)}>
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};