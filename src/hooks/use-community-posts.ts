import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  user_id: string;
  channel: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  emoji_reactions: Record<string, number>;
  category?: string;
  feedback_type?: string;
  author: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export const useCommunityPosts = (channelName: string) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const { toast } = useToast();

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("community_posts")
      .select(`
        *,
        author:profiles(username, avatar_url)
      `)
      .eq("channel", channelName)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      return;
    }

    const parsedPosts = data?.map(post => ({
      ...post,
      emoji_reactions: typeof post.emoji_reactions === 'string' 
        ? JSON.parse(post.emoji_reactions) 
        : post.emoji_reactions || {},
    }));

    setPosts(parsedPosts || []);
  };

  const handleIdeaSubmit = async (idea: {
    title: string;
    content: string;
    category: string;
    channel: string;
    feedbackType: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post ideas",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("community_posts").insert({
      title: idea.title,
      content: idea.content,
      channel: idea.channel,
      category: idea.category,
      feedback_type: idea.feedbackType,
      user_id: user.id,
    });

    if (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Your idea has been posted successfully!",
    });

    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();

    // Create the subscription channel
    const subscription = supabase
      .channel('public:community_posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts',
          filter: `channel=eq.${channelName}`,
        },
        async () => {
          console.log('Real-time update received for channel:', channelName);
          await fetchPosts();
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channelName]);

  return { posts, handleIdeaSubmit };
};