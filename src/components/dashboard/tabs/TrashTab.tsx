import { IdeaCard } from "@/components/IdeaCard";
import { Idea } from "@/types/idea";

interface TrashTabProps {
  ideas: Idea[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TrashTab = ({
  ideas,
  selectedIds,
  onSelect,
  onDelete,
}: TrashTabProps) => {
  return (
    <div className="grid gap-6 mt-6">
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          {...idea}
          isSelected={selectedIds.includes(idea.id)}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};