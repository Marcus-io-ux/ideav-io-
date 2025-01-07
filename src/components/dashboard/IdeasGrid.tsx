import { IdeaCard } from "@/components/IdeaCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Idea } from "@/types/idea";

interface IdeasGridProps {
  ideas: Idea[];
  isLoading: boolean;
  viewMode: "grid" | "list";
  onDelete: (id: string) => void;
  onIdeaSubmit: () => void;
}

export const IdeasGrid = ({
  ideas,
  isLoading,
  viewMode,
  onDelete,
  onIdeaSubmit,
}: IdeasGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Loading ideas...</p>
      </div>
    );
  }

  if (ideas.length === 0) {
    return <EmptyState onIdeaSubmit={onIdeaSubmit} />;
  }

  return (
    <div className={
      viewMode === "grid"
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center"
        : "flex flex-col items-center gap-4 sm:gap-6"
    }>
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          {...idea}
          onDelete={onDelete}
          hideInteractions={true}
        />
      ))}
    </div>
  );
};