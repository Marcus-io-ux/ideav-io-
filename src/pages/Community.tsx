import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ShareIdeaModal } from "@/components/community/ShareIdeaModal";
import { useCommunityPosts } from "@/hooks/use-community-posts";
import { CommunityLayout } from "@/components/community/layout/CommunityLayout";
import { CommunityContentHeader } from "@/components/community/layout/CommunityContent";

const Community = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { handleIdeaSubmit } = useCommunityPosts("general-ideas");

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
      
      <div className="flex-1 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-end mb-6">
            <Button
              onClick={() => setIsShareModalOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Share Idea</span>
            </Button>
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