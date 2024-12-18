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
  // Only show deleted ideas
  const trashedIdeas = ideas.filter(idea => idea.deleted);
  
  return (
    <div className="grid gap-6 mt-6">
      {trashedIdeas.map((idea) => (
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