import { IdeaCard } from "@/components/IdeaCard";
import { Idea } from "@/types/idea";

interface RecentIdeasTabProps {
  ideas: Idea[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const RecentIdeasTab = ({
  ideas,
  selectedIds,
  onSelect,
  onEdit,
  onDelete,
}: RecentIdeasTabProps) => {
  // Filter out deleted ideas before showing the most recent 5
  const activeIdeas = ideas.filter(idea => !idea.deleted);
  
  return (
    <div className="grid gap-6 mt-6">
      {activeIdeas.slice(0, 5).map((idea) => (
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