import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ShareIdeaModal } from "@/components/community/ShareIdeaModal";
import { useCommunityPosts } from "@/hooks/use-community-posts";
import { CommunityLayout } from "@/components/community/layout/CommunityLayout";
import { CommunityContentHeader } from "@/components/community/layout/CommunityContent";
import { IdeaCard } from "@/components/community/IdeaCard";
import { Card } from "@/components/ui/card";

const Community = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { posts, handleIdeaSubmit } = useCommunityPosts("general-ideas");

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
    <CommunityLayout>
      <CommunityContentHeader 
        title="Community"
        onSearch={(query) => console.log("Search:", query)}
      />
      
      <div className="flex-1 p-4 bg-accent/5">
        <div className="max-w-5xl mx-auto flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-4">
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setIsShareModalOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Share Idea</span>
              </Button>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {posts?.map((post) => (
                <IdeaCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  author={{
                    id: post.user_id || '',
                    name: post.profiles?.username || 'Anonymous',
                    avatar: post.profiles?.avatar_url
                  }}
                  createdAt={post.created_at || ''}
                  likes={post.likes_count || 0}
                  comments={post.comments_count || 0}
                  userId={post.user_id || ''}
                  isPinned={post.is_pinned}
                  category={post.category}
                  feedbackType={post.feedback_type}
                  emojiReactions={post.emoji_reactions}
                  tags={post.tags || []}
                />
              ))}
            </div>
          </div>

          {/* Guidelines Sidebar */}
          <div className="hidden md:block w-80">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Community Guidelines</h2>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>1. Be respectful and constructive in your feedback</p>
                <p>2. Share detailed ideas to get better responses</p>
                <p>3. Use appropriate tags for better visibility</p>
                <p>4. Engage with others and build connections</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ShareIdeaModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </CommunityLayout>
  );
};

export default Community;