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
  return (
    <div className="grid gap-6 mt-6">
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          {...idea}
          isSelected={selectedIds.includes(idea.id)}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};