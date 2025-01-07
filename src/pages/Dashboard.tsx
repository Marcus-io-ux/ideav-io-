import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FeedbackButton } from "@/components/feedback/FeedbackButton";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { DashboardTutorial } from "@/components/dashboard/DashboardTutorial";
import { useUserProfile } from "@/hooks/use-user-profile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { IdeasGrid } from "@/components/dashboard/IdeasGrid";
import { DashboardActionsBar } from "@/components/dashboard/DashboardActionsBar";
import { useDashboardIdeas } from "@/hooks/use-dashboard-ideas";

const Dashboard = () => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const { userName } = useUserProfile();
  const { toast } = useToast();

  const { data: ideasData = [], isLoading } = useDashboardIdeas(showFavorites, showDrafts);

  const handleDeleteIdea = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({ deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Idea moved to trash",
      });
    } catch (error: any) {
      console.error('Error deleting idea:', error);
      toast({
        title: "Error",
        description: "Failed to delete idea. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleIdeaSubmit = () => {
    toast({
      title: "Success",
      description: "Your idea has been created successfully!",
    });
  };

  const filteredIdeas = ideasData.filter(idea =>
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dailyQuote = "The best way to predict the future is to create it.";

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">
        <PageHeader
          title={`Welcome back, ${userName}!`}
          description="Your personal vault of saved and developing ideas."
          className="text-center"
        />
        
        <div className="text-center text-muted-foreground italic mb-4 sm:mb-8 px-4">
          "{dailyQuote}"
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <FeedbackButton onClick={() => setIsFeedbackModalOpen(true)} />
          <div className="w-full">
            <DashboardActionsBar
              totalIdeas={ideasData.length}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              viewMode={viewMode}
              setViewMode={setViewMode}
              showFavorites={showFavorites}
              setShowFavorites={setShowFavorites}
              showDrafts={showDrafts}
              setShowDrafts={setShowDrafts}
              handleIdeaSubmit={handleIdeaSubmit}
            />
          </div>
        </div>

        <IdeasGrid
          ideas={filteredIdeas}
          isLoading={isLoading}
          viewMode={viewMode}
          onDelete={handleDeleteIdea}
          onIdeaSubmit={handleIdeaSubmit}
        />
      </div>

      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
      <DashboardTutorial />
    </div>
  );
};

export default Dashboard;