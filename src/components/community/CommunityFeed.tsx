import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Database, Building, Cpu, Leaf, Palette, Smartphone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentList } from "./comments/CommentList";
import { CreatePost } from "./CreatePost";

export const CommunityFeed = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState("general");

  const channels = [
    { id: "general", icon: Database, label: "General Ideas" },
    { id: "business", icon: Building, label: "Startups & Business" },
    { id: "tech", icon: Cpu, label: "Tech & Innovation" },
    { id: "lifestyle", icon: Leaf, label: "Lifestyle & Wellness" },
    { id: "design", icon: Palette, label: "Design & Creativity" },
    { id: "apps", icon: Smartphone, label: "Apps & Tech Tools" },
  ];

  // Fetch posts with channel filter
  const { data: posts, isLoading } = useQuery({
    queryKey: ['community-posts', selectedChannel],
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

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 mb-6">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <Button
              key={channel.id}
              variant={selectedChannel === channel.id ? "default" : "outline"}
              className="w-full h-auto py-2 px-3"
              onClick={() => setSelectedChannel(channel.id)}
            >
              <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">
                {channel.label}
              </span>
            </Button>
          );
        })}
      </div>

      <CreatePost selectedChannel={selectedChannel} />

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