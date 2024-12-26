import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ThumbsUp, Share2, Bookmark, Search, TrendingUp, Clock, Users, Filter } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Community = () => {
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

  const navigateToExplore = (category: string) => {
    // For now, just scroll to the feed section and set the appropriate tab
    const feedElement = document.getElementById('community-feed');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to the IdeaVault Community!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Share your ideas, collaborate with like-minded innovators, and get valuable feedback to refine your vision.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => {
            const postBox = document.getElementById('post-box');
            if (postBox) postBox.focus();
          }}>Post an Idea</Button>
          <Button size="lg" variant="outline" onClick={() => navigateToExplore('discussions')}>
            Join a Discussion
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigateToExplore('trending')}>
            Explore Trending Ideas
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" 
                onClick={() => navigate('/dashboard')}>
                My Posts
              </Button>
              <Button variant="ghost" className="w-full justify-start"
                onClick={() => navigate('/dashboard')}>
                My Saved Ideas
              </Button>
              <Button variant="ghost" className="w-full justify-start"
                onClick={() => navigateToExplore('topics')}>
                Explore Topics
              </Button>
              <Button variant="ghost" className="w-full justify-start"
                onClick={() => navigateToExplore('users')}>
                Popular Users
              </Button>
            </nav>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Community Stats</h3>
            <div className="space-y-2">
              <p>{posts?.length || 0} ideas shared</p>
              <p>Active community members</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-6 space-y-6">
          {/* Post Creation */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">What's on your mind?</h2>
            <Textarea
              id="post-box"
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

          {/* Feed Tabs */}
          <Tabs defaultValue="trending" id="community-feed">
            <TabsList className="w-full">
              <TabsTrigger value="trending" className="flex-1">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="newest" className="flex-1">
                <Clock className="w-4 h-4 mr-2" />
                Newest
              </TabsTrigger>
              <TabsTrigger value="collaborative" className="flex-1">
                <Users className="w-4 h-4 mr-2" />
                Collaborative
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending">
              {isLoading ? (
                <div>Loading posts...</div>
              ) : (
                posts?.map((post) => (
                  <div key={post.id} className="bg-card rounded-lg p-6 shadow-sm mt-4">
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
            </TabsContent>

            <TabsContent value="newest">
              {/* Same content as trending but sorted by date */}
              {isLoading ? (
                <div>Loading posts...</div>
              ) : (
                posts?.map((post) => (
                  <div key={post.id} className="bg-card rounded-lg p-6 shadow-sm mt-4">
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
            </TabsContent>

            <TabsContent value="collaborative">
              {/* Same content as trending but filtered for collaborative posts */}
              {isLoading ? (
                <div>Loading posts...</div>
              ) : (
                posts?.map((post) => (
                  <div key={post.id} className="bg-card rounded-lg p-6 shadow-sm mt-4">
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
            </TabsContent>
          </Tabs>
        </main>

        {/* Right Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search ideas, users, or topics..." />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters</span>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Achievements</h3>
            <div className="space-y-2">
              <Badge variant="outline" className="w-full justify-start">
                🌟 Idea Contributor
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                🤝 Top Collaborator
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                🏗️ Community Builder
              </Badge>
            </div>
          </div>
        </aside>
      </div>

      {/* Call to Action */}
      <section className="text-center mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-4">Start Sharing Your Ideas Today!</h2>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => {
            const postBox = document.getElementById('post-box');
            if (postBox) postBox.focus();
          }}>Join the Conversation</Button>
          <Button size="lg" variant="outline" onClick={() => {
            const postBox = document.getElementById('post-box');
            if (postBox) postBox.focus();
          }}>Share Your First Idea</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-12 pt-8">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <a href="#" className="hover:underline">Community Guidelines</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default Community;
