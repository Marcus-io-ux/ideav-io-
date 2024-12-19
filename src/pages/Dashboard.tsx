import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FeedbackButton } from "@/components/feedback/FeedbackButton";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { DashboardTutorial } from "@/components/dashboard/DashboardTutorial";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";
import { IdeasGrid } from "@/components/dashboard/IdeasGrid";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List, Search, Star } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Dashboard = () => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFavorites, setShowFavorites] = useState(false);
  const { userName } = useUserProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ideasData = [], isLoading } = useQuery({
    queryKey: ["my-ideas", showFavorites],
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

      // First, get all ideas for the user
      const { data: ideas, error: ideasError } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", user.id)
        .eq("deleted", false)
        .order("created_at", { ascending: false });

      if (ideasError) throw ideasError;

      // If showing favorites, get the user's favorites
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

      // Get all favorites to mark favorite ideas
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

  const dailyQuote = "The best way to predict the future is to create it."; // You can make this dynamic later

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto p-6 space-y-8">
        <PageHeader
          title={`Welcome back, ${userName}!`}
          description="Your personal vault of saved and developing ideas."
        />
        <div className="text-center text-muted-foreground italic mb-8">
          "{dailyQuote}"
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1" />
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="hidden md:flex h-10 w-10" // Hide on mobile, show on md and up
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Search className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Input
                  placeholder="Search ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </PopoverContent>
            </Popover>
            <Button
              variant={showFavorites ? "default" : "outline"}
              size="icon"
              className="h-10 w-10"
              onClick={() => setShowFavorites(!showFavorites)}
            >
              <Star className={cn("h-4 w-4", showFavorites && "fill-current")} />
            </Button>
            <AddIdeaDialog onIdeaSubmit={handleIdeaSubmit} />
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

      <FeedbackButton onClick={() => setIsFeedbackModalOpen(true)} />
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
      <DashboardTutorial />
    </div>
  );
};

export default Dashboard;
