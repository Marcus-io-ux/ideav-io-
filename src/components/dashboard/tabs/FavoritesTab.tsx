import { IdeaCard } from "@/components/IdeaCard";
import { Idea } from "@/types/idea";

interface FavoritesTabProps {
  ideas: Idea[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const FavoritesTab = ({
  ideas,
  selectedIds,
  onSelect,
  onEdit,
  onDelete,
}: FavoritesTabProps) => {
  // Filter out deleted ideas and show only favorites
  const favoriteIdeas = ideas.filter(idea => !idea.deleted && idea.isFavorite);
  
  return (
    <div className="grid gap-6">
      {favoriteIdeas.map((idea) => (
        <IdeaCard
          key={idea.id}
          {...idea}
          isSelected={selectedIds.includes(idea.id)}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      {favoriteIdeas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No favorite ideas found</p>
        </div>
      )}
    </div>
  );
};