import { IdeaCard } from "@/components/IdeaCard";
import { Idea } from "@/types/idea";

interface AllIdeasTabProps {
  ideas: Idea[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AllIdeasTab = ({
  ideas,
  selectedIds,
  onSelect,
  onEdit,
  onDelete,
}: AllIdeasTabProps) => {
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