import { useState } from "react";
import { ChannelList } from "@/components/community/channels/ChannelList";
import { IdeaCard } from "@/components/community/IdeaCard";
import { Button } from "@/components/ui/button";
import { Plus, Menu } from "lucide-react";
import { ShareIdeaModal } from "@/components/community/ShareIdeaModal";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCommunityPosts } from "@/hooks/use-community-posts";

const Community = () => {
  const [activeChannel, setActiveChannel] = useState("general-ideas");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { posts, handleIdeaSubmit } = useCommunityPosts(activeChannel);

  const handleSubmit = async (idea: { 
    title: string; 
    content: string; 
    channel: string; 
    feedbackType: string; 
    isCollaborative: boolean;
    tags: string[];
  }) => {
    await handleIdeaSubmit({
      title: idea.title,
      content: idea.content,
      channel: idea.channel,
      category: idea.feedbackType,
      feedbackType: idea.feedbackType,
      tags: [...idea.tags, idea.feedbackType],
    });
  };

  return (
    <div className="flex h-screen">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[240px]">
          <ChannelList activeChannel={activeChannel} onChannelSelect={(channel) => {
            setActiveChannel(channel);
            setIsSidebarOpen(false);
          }} />
        </SheetContent>
      </Sheet>

      <div className="hidden md:block w-64 border-r bg-background">
        <ChannelList activeChannel={activeChannel} onChannelSelect={setActiveChannel} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="border-b p-4 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden flex-shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold truncate">#{activeChannel}</h1>
          </div>
          <Button
            onClick={() => setIsShareModalOpen(true)}
            className="gap-2 flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Share Idea</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 sm:p-6 space-y-4">
          <div className="max-w-3xl mx-auto w-full">
            {posts.map((post) => (
              <IdeaCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                author={{
                  id: post.user_id || '',
                  name: post.profiles?.username || "Anonymous",
                  avatar: post.profiles?.avatar_url,
                }}
                likes={post.likes_count || 0}
                comments={post.comments_count || 0}
                createdAt={post.created_at || ""}
                category={post.category}
                feedbackType={post.feedback_type}
                isPinned={post.is_pinned}
                emojiReactions={post.emoji_reactions || {}}
                tags={post.tags || []}
              />
            ))}
          </div>
        </div>
      </div>

      <ShareIdeaModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Community;