import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";
import { RecentIdeasTab } from "./tabs/RecentIdeasTab";
import { AllIdeasTab } from "./tabs/AllIdeasTab";
import { FavoritesTab } from "./tabs/FavoritesTab";
import { Idea } from "@/types/idea";

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

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    onDeleteIdeas(selectedIds);
    setSelectedIds([]);
  };

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
        <AddIdeaDialog onIdeaSubmit={() => {}} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 h-auto p-1">
          <TabsTrigger value="recent" className="px-8 py-2">Recent Ideas</TabsTrigger>
          <TabsTrigger value="all" className="px-8 py-2">All Ideas</TabsTrigger>
          <TabsTrigger value="favorites" className="px-8 py-2">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          <RecentIdeasTab
            ideas={ideas}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onEdit={onEditIdea}
            onDelete={(id) => onDeleteIdeas([id])}
          />
        </TabsContent>
        
        <TabsContent value="all">
          <AllIdeasTab
            ideas={ideas}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onEdit={onEditIdea}
            onDelete={(id) => onDeleteIdeas([id])}
          />
        </TabsContent>

        <TabsContent value="favorites">
          <FavoritesTab
            ideas={ideas}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onEdit={onEditIdea}
            onDelete={(id) => onDeleteIdeas([id])}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};