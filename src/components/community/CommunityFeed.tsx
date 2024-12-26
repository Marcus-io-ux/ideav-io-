import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Database, Building, Cpu, Leaf, Palette, Smartphone, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);
    };
    getUser();
  }, []);

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

  // Fix delete post mutation
  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.user) throw new Error("Not authenticated");

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

  const toggleComments = (postId: string) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <Button
              key={channel.id}
              variant={selectedChannel === channel.id ? "default" : "outline"}
              className="w-full h-auto py-2 px-1 md:px-3 text-xs md:text-sm"
              onClick={() => setSelectedChannel(channel.id)}
            >
              <Icon className="w-4 h-4 mr-1 md:mr-2 flex-shrink-0" />
              <span className="truncate">
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
          <div key={post.id} className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-4">
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
              {post.user_id === currentUserId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePost.mutate(post.id)}
                  className="text-muted-foreground hover:text-destructive self-start md:self-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="mb-4">{post.content}</p>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="px-2 md:px-3 py-1 text-xs md:text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
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