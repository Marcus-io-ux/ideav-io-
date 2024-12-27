import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";

interface EmptyStateProps {
  onIdeaSubmit: () => void;
}

export const EmptyState = ({ onIdeaSubmit }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4 py-8 sm:py-12 space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold">No ideas found</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Get started by creating your first idea. You can add details, tags, and even share it with the community later.
      </p>
      <AddIdeaDialog onIdeaSubmit={onIdeaSubmit} />
    </div>
  );
};