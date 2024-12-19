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
  // Filter out deleted ideas and get the most recent 5
  const recentIdeas = ideas
    .filter(idea => !idea.deleted)
    .slice(0, 5);
  
  return (
    <div className="grid gap-6 mt-6">
      {recentIdeas.map((idea) => (
        <IdeaCard
          key={idea.id}
          {...idea}
          isSelected={selectedIds.includes(idea.id)}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      {recentIdeas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No recent ideas found</p>
        </div>
      )}
    </div>
  );
};