import { IdeaCard } from "@/components/IdeaCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

interface IdeasGridProps {
  ideas: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: Date;
  }>;
  isLoading: boolean;
  viewMode: "grid" | "list";
  onDelete?: (id: string) => void;
  onIdeaSubmit?: () => Promise<void>;
}

export const IdeasGrid = ({ ideas, isLoading, viewMode, onDelete, onIdeaSubmit }: IdeasGridProps) => {
  if (isLoading) {
    return (
      <div className={`grid gap-4 sm:gap-6 ${
        viewMode === "grid" 
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
      }`}>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  if (ideas.length === 0) {
    return <EmptyState onIdeaSubmit={onIdeaSubmit} />;
  }

  return (
    <div className={`grid gap-4 sm:gap-6 ${
      viewMode === "grid" 
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
        : "grid-cols-1"
    }`}>
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          {...idea}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};