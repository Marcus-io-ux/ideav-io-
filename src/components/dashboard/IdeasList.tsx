import { IdeaCard } from "@/components/IdeaCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [isEmptyTrashDialogOpen, setIsEmptyTrashDialogOpen] = useState(false);

  const activeIdeas = ideas.filter(idea => !idea.deleted);
  const trashedIdeas = ideas.filter(idea => idea.deleted);

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

  const handleEmptyTrash = () => {
    const trashedIds = trashedIdeas.map(idea => idea.id);
    onDeleteIdeas(trashedIds);
    setIsEmptyTrashDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          {selectedIds.length > 0 && activeTab !== "trash" && (
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
          {selectedIds.length > 0 && activeTab === "trash" && (
            <Button
              variant="default"
              size="sm"
              onClick={handleBulkRestore}
              className="flex-1 sm:flex-none items-center justify-center gap-2 px-4"
            >
              <RotateCcw className="h-4 w-4" />
              Restore Selected ({selectedIds.length})
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <AddIdeaDialog onIdeaSubmit={() => {}} />
          {activeTab === "trash" && trashedIdeas.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsEmptyTrashDialogOpen(true)}
              className="flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Empty Trash ({trashedIdeas.length})
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={isEmptyTrashDialogOpen} onOpenChange={setIsEmptyTrashDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Empty Trash?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all {trashedIdeas.length} items in the trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep ideas</AlertDialogCancel>
            <AlertDialogAction onClick={handleEmptyTrash} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, empty trash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 h-auto p-1">
          <TabsTrigger value="recent" className="px-8 py-2">Recent Ideas</TabsTrigger>
          <TabsTrigger value="all" className="px-8 py-2">All Ideas ({activeIdeas.length})</TabsTrigger>
          <TabsTrigger value="trash" className="px-8 py-2">Trash</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          <div className="grid gap-6 mt-6">
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
          <div className="grid gap-6 mt-6">
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
          <div className="grid gap-6 mt-6">
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