import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FeedbackButton } from "@/components/feedback/FeedbackButton";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { DashboardTutorial } from "@/components/dashboard/DashboardTutorial";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";
import { IdeasGrid } from "@/components/dashboard/IdeasGrid";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "alphabetical">("recent");
  const { userName } = useUserProfile();
  const { toast } = useToast();

  const { data: ideas = [], isLoading } = useQuery({
    queryKey: ["my-ideas"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", user.id)
        .eq("deleted", false)
        .order("created_at", { ascending: sortBy === "oldest" });

      if (error) throw error;
      return data.map(idea => ({
        ...idea,
        createdAt: new Date(idea.created_at),
      }));
    },
  });

  const filteredIdeas = ideas.filter(idea =>
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIdeaSubmit = async () => {
    await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
    toast({
      title: "Success",
      description: "Your idea has been created successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto p-6 space-y-8">
        <PageHeader
          title="My Ideas"
          description="Your personal vault of saved and developing ideas."
        />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-96">
            <SearchBar onSearch={setSearchQuery} />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="h-10 w-10"
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
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