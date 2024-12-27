import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FeedbackButton } from "@/components/feedback/FeedbackButton";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { DashboardTutorial } from "@/components/dashboard/DashboardTutorial";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { IdeasGrid } from "@/components/dashboard/IdeasGrid";
import { DashboardActionsBar } from "@/components/dashboard/DashboardActionsBar";

const Dashboard = () => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const { userName } = useUserProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ideasData = [], isLoading } = useQuery({
    queryKey: ["my-ideas", showFavorites, showDrafts],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view your ideas",
          variant: "destructive",
        });
        throw new Error("No user found");
      }

      const { data: ideas, error: ideasError } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", user.id)
        .eq("deleted", false)
        .eq("is_draft", showDrafts)
        .order("created_at", { ascending: false });

      if (ideasError) throw ideasError;

      if (showFavorites) {
        const { data: favorites, error: favoritesError } = await supabase
          .from("favorites")
          .select("idea_id")
          .eq("user_id", user.id)
          .eq("item_type", "idea");

        if (favoritesError) throw favoritesError;

        const favoriteIdeaIds = new Set(favorites.map(f => f.idea_id));
        return ideas
          .filter(idea => favoriteIdeaIds.has(idea.id))
          .map(idea => ({
            ...idea,
            createdAt: new Date(idea.created_at),
            isFavorite: true
          }));
      }

      const { data: favorites, error: favoritesError } = await supabase
        .from("favorites")
        .select("idea_id")
        .eq("user_id", user.id)
        .eq("item_type", "idea");

      if (favoritesError) throw favoritesError;

      const favoriteIdeaIds = new Set(favorites?.map(f => f.idea_id) || []);

      return ideas.map(idea => ({
        ...idea,
        createdAt: new Date(idea.created_at),
        isFavorite: favoriteIdeaIds.has(idea.id)
      }));
    },
  });

  const handleDeleteIdea = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({ deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
      
      toast({
        title: "Success",
        description: "Idea moved to trash",
      });
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast({
        title: "Error",
        description: "Failed to delete idea. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleIdeaSubmit = async () => {
    await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
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