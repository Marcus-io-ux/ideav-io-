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

  const { data: ideas = [], isLoading } = useQuery({
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

      let query = supabase
        .from("ideas")
        .select("*, favorites!inner(*)")
        .eq("user_id", user.id)
        .eq("deleted", false);

      if (showFavorites) {
        query = query.not("favorites", "is", null);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data.map(idea => ({
        ...idea,
        createdAt: new Date(idea.created_at),
        isFavorite: true, // Since we're using an inner join, all returned ideas are favorites
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

  const filteredIdeas = ideas.filter(idea =>
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto p-6 space-y-8">
        <PageHeader
          title="My Ideas"
          description="Your personal vault of saved and developing ideas."
        />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="h-10 w-10"
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
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
            >
              <Filter className="h-4 w-4" />
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