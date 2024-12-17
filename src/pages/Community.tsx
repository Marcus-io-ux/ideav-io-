import { useState, useEffect } from "react";
import { ChannelList } from "@/components/community/channels/ChannelList";
import { ActiveUsersList } from "@/components/community/users/ActiveUsersList";
import { IdeaCard } from "@/components/community/IdeaCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ShareIdeaModal } from "@/components/community/ShareIdeaModal";
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
    username: string;
    avatar_url: string;
  };
}

const Community = () => {
  const [activeChannel, setActiveChannel] = useState("general");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select(`
          *,
          author:user_id (
            username:profiles(username),
            avatar_url:profiles(avatar_url)
          )
        `)
        .eq("channel", activeChannel)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      setPosts(data || []);
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
      {/* Left Sidebar - Channels */}
      <div className="w-64 border-r bg-background">
        <ChannelList activeChannel={activeChannel} onChannelSelect={setActiveChannel} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 className="text-2xl font-bold">#{activeChannel}</h1>
          <Button
            onClick={() => setIsShareModalOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Share Idea
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {posts.map((post) => (
            <IdeaCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              author={{
                id: post.user_id,
                name: post.author?.username || "Anonymous",
                avatar: post.author?.avatar_url,
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

      {/* Right Sidebar - Active Users */}
      <div className="w-64 border-l bg-background">
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