import { Button } from "@/components/ui/button";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";

interface EmptyStateProps {
  onIdeaSubmit?: () => Promise<void>;
}

export const EmptyState = ({ onIdeaSubmit }: EmptyStateProps) => {
  const handleIdeaSubmit = async () => {
    if (onIdeaSubmit) {
      await onIdeaSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div className="rounded-full bg-primary/10 p-4">
        <div className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-lg font-semibold">No ideas yet</h3>
      <p className="text-muted-foreground max-w-sm">
        You haven't saved any ideas yet. Click '+ Add New Idea' to get started!
      </p>
      <AddIdeaDialog onIdeaSubmit={handleIdeaSubmit} />
    </div>
  );
};