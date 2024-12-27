import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";
import { RecentIdeasTab } from "./tabs/RecentIdeasTab";
import { AllIdeasTab } from "./tabs/AllIdeasTab";
import { FavoritesTab } from "./tabs/FavoritesTab";
import { Idea } from "@/types/idea";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface IdeasListProps {
  ideas: Idea[];
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  onEditIdea: (id: string) => void;
  onDeleteIdeas: (ids: string[]) => void;
}

export const IdeasList = ({
  ideas,
  onEditIdea,
  onDeleteIdeas,
}: IdeasListProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("recent");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    console.log('Deleting ideas:', selectedIds);
    try {
      await onDeleteIdeas(selectedIds);
      console.log('Ideas deleted successfully');
      setSelectedIds([]);
      // Invalidate both ideas and community posts queries
      await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
      await queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      
      toast({
        title: "Success",
        description: "Selected ideas have been deleted",
      });
    } catch (error) {
      console.error('Error deleting ideas:', error);
      toast({
        title: "Error",
        description: "Failed to delete ideas. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleIdeaSubmit = async () => {
    await queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
  };

  // Calculate counts
  const activeIdeas = ideas.filter(idea => !idea.deleted);
  const favoriteIdeas = ideas.filter(idea => !idea.deleted && idea.isFavorite);
  const recentIdeas = activeIdeas.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="flex-1 sm:flex-none items-center justify-center gap-2 px-4"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedIds.length})
            </Button>
          )}
        </div>
        <AddIdeaDialog onIdeaSubmit={handleIdeaSubmit} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 h-auto p-1">
          <TabsTrigger value="recent" className="px-8 py-2">Recent Ideas ({recentIdeas.length})</TabsTrigger>
          <TabsTrigger value="all" className="px-8 py-2">All Ideas ({activeIdeas.length})</TabsTrigger>
          <TabsTrigger value="favorites" className="px-8 py-2">Favorites ({favoriteIdeas.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          <RecentIdeasTab
            ideas={ideas}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onEdit={onEditIdea}
            onDelete={(id) => {
              console.log('Deleting single idea:', id);
              onDeleteIdeas([id]);
            }}
          />
        </TabsContent>
        
        <TabsContent value="all">
          <AllIdeasTab
            ideas={ideas}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onEdit={onEditIdea}
            onDelete={(id) => {
              console.log('Deleting single idea:', id);
              onDeleteIdeas([id]);
            }}
          />
        </TabsContent>

        <TabsContent value="favorites">
          <FavoritesTab
            ideas={ideas}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onEdit={onEditIdea}
            onDelete={(id) => {
              console.log('Deleting single idea:', id);
              onDeleteIdeas([id]);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};