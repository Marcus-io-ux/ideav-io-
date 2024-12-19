import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ShareIdeaModal } from "@/components/community/ShareIdeaModal";
import { useCommunityPosts } from "@/hooks/use-community-posts";

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
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="border-b p-4 flex items-center justify-end bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            onClick={() => setIsShareModalOpen(true)}
            className="gap-2 flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Share Idea</span>
          </Button>
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