import { useState, useEffect } from "react";
import { ChannelList } from "@/components/community/channels/ChannelList";
import { ActiveUsersList } from "@/components/community/users/ActiveUsersList";
import { IdeaCard } from "@/components/community/IdeaCard";
import { Button } from "@/components/ui/button";
import { Plus, Menu, Users } from "lucide-react";
import { ShareIdeaModal } from "@/components/community/ShareIdeaModal";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";

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
  author: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

const Community = () => {
  const [activeChannel, setActiveChannel] = useState("general");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUsersListOpen, setIsUsersListOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select(`
          *,
          author:profiles(username, avatar_url)
        `)
        .eq("channel", activeChannel)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      // Parse emoji_reactions from JSON to Record<string, number>
      const parsedPosts = data?.map(post => ({
        ...post,
        emoji_reactions: typeof post.emoji_reactions === 'string' 
          ? JSON.parse(post.emoji_reactions) 
          : post.emoji_reactions || {},
      }));

      setPosts(parsedPosts || []);
    };

    fetchPosts();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("community_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "community_posts",
          filter: `channel=eq.${activeChannel}`,
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChannel]);

  const handleIdeaSubmit = async (idea: {
    title: string;
    content: string;
    category: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("community_posts").insert({
      title: idea.title,
      content: idea.content,
      channel: activeChannel,
      user_id: user.id,
    });

    if (error) {
      console.error("Error creating post:", error);
      return;
    }

    setIsShareModalOpen(false);
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Channel List Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[240px]">
          <ChannelList activeChannel={activeChannel} onChannelSelect={(channel) => {
            setActiveChannel(channel);
            setIsSidebarOpen(false);
          }} />
        </SheetContent>
      </Sheet>

      {/* Mobile Active Users List Sidebar */}
      <Sheet open={isUsersListOpen} onOpenChange={setIsUsersListOpen}>
        <SheetContent side="right" className="p-0 w-[240px]">
          <ActiveUsersList />
        </SheetContent>
      </Sheet>

      {/* Desktop Channel List */}
      <div className="hidden md:block w-64 border-r bg-background">
        <ChannelList activeChannel={activeChannel} onChannelSelect={setActiveChannel} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">#{activeChannel}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsShareModalOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Share Idea</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsUsersListOpen(true)}
            >
              <Users className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 sm:p-6 space-y-4">
          {posts.map((post) => (
            <IdeaCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              author={{
                id: post.user_id,
                name: post.author?.username || "Anonymous",
                avatar: post.author?.avatar_url || undefined,
              }}
              likes={post.likes_count}
              comments={post.comments_count}
              tags={[]}
              createdAt={new Date(post.created_at)}
              isPinned={post.is_pinned}
              emojiReactions={post.emoji_reactions}
            />
          ))}
        </div>
      </div>

      {/* Desktop Active Users List */}
      <div className="hidden md:block w-64 border-l bg-background">
        <ActiveUsersList />
      </div>

      <ShareIdeaModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onSubmit={handleIdeaSubmit}
      />
    </div>
  );
};

export default Community;