import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ShareIdeaModal } from "@/components/community/ShareIdeaModal";
import { useCommunityPosts } from "@/hooks/use-community-posts";
import { CommunityLayout } from "@/components/community/layout/CommunityLayout";
import { IdeaCard } from "@/components/community/IdeaCard";
import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";

const Community = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { channelId = "general-ideas" } = useParams();
  const { posts, handleIdeaSubmit } = useCommunityPosts(channelId);

  // Function to format channel name
  const formatChannelName = (channelId: string) => {
    return channelId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
      <div className="flex-1 p-4 bg-accent/5">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{formatChannelName(channelId)}</h1>
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

          {/* Guidelines Sidebar - Now with responsive design */}
          <div className="lg:w-80 order-first lg:order-last">
            <Card className="p-6 sticky top-4">
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