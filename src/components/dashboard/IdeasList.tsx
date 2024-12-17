import { IdeaCard } from "@/components/IdeaCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2, RotateCcw, Lightbulb, Star } from "lucide-react";
import { useState } from "react";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";

interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  priority?: "high" | "medium" | "low";
  isFavorite?: boolean;
  sharedToCommunity?: boolean;
  deleted?: boolean;
}

interface IdeasListProps {
  ideas: Idea[];
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  onEditIdea: (id: string) => void;
  onDeleteIdeas: (ids: string[]) => void;
  onRestoreIdeas: (ids: string[]) => void;
}

export const IdeasList = ({
  ideas,
  onEditIdea,
  onDeleteIdeas,
  onRestoreIdeas,
}: IdeasListProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("recent");

  const activeIdeas = ideas.filter(idea => !idea.deleted);
  const trashedIdeas = ideas.filter(idea => idea.deleted);
  const favoriteIdeas = activeIdeas.filter(idea => idea.isFavorite);

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

  const handleBulkRestore = () => {
    onRestoreIdeas(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          {selectedIds.length > 0 && activeTab !== "trash" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedIds.length})
            </Button>
          )}
          {selectedIds.length > 0 && activeTab === "trash" && (
            <Button
              variant="default"
              size="sm"
              onClick={handleBulkRestore}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Restore Selected ({selectedIds.length})
            </Button>
          )}
          <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-2 border border-blue-100 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <span className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Lightbulb className="h-4 w-4" />
              {activeIdeas.length} Ideas
            </span>
            <span className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Star className="h-4 w-4" />
              {favoriteIdeas.length} Favorites
            </span>
          </div>
        </div>
        <AddIdeaDialog onIdeaSubmit={() => {}} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="recent">Recent Ideas</TabsTrigger>
          <TabsTrigger value="all">All Ideas</TabsTrigger>
          <TabsTrigger value="trash">Trash</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          <div className="grid gap-6">
            {activeIdeas.slice(0, 5).map((idea) => (
              <IdeaCard
                key={idea.id}
                {...idea}
                isSelected={selectedIds.includes(idea.id)}
                onSelect={handleSelect}
                onEdit={onEditIdea}
                onDelete={(id) => onDeleteIdeas([id])}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="all">
          <div className="grid gap-6">
            {activeIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                {...idea}
                isSelected={selectedIds.includes(idea.id)}
                onSelect={handleSelect}
                onEdit={onEditIdea}
                onDelete={(id) => onDeleteIdeas([id])}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trash">
          <div className="grid gap-6">
            {trashedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                {...idea}
                isSelected={selectedIds.includes(idea.id)}
                onSelect={handleSelect}
                onDelete={(id) => onDeleteIdeas([id])}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};