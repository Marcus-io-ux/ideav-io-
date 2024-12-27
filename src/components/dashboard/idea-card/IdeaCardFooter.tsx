import { Button } from "@/components/ui/button";
import { Star, Trash2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface IdeaCardFooterProps {
  isCurrentlyFavorite: boolean;
  onToggleFavorite: () => void;
  onDelete?: () => void;
  userId?: string;
  sharedToCommunity?: boolean;
}

export const IdeaCardFooter = ({
  isCurrentlyFavorite,
  onToggleFavorite,
  onDelete,
  userId,
  sharedToCommunity,
}: IdeaCardFooterProps) => {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8",
          isCurrentlyFavorite ? "text-primary" : "text-muted-foreground hover:text-primary"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
      >
        <Star className={cn("h-4 w-4", isCurrentlyFavorite && "fill-current")} />
      </Button>

      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};