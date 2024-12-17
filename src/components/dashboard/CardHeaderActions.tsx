import { Star, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardHeaderActionsProps {
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CardHeaderActions = ({
  isFavorite,
  onToggleFavorite,
  onDelete,
}: CardHeaderActionsProps) => {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onToggleFavorite}
        className={cn(
          "p-1 rounded-full transition-colors",
          isFavorite ? "text-primary hover:bg-primary-light" : "text-gray-400 hover:bg-gray-100"
        )}
      >
        <Star
          className={cn(
            "h-5 w-5 transition-colors",
            isFavorite && "fill-primary"
          )}
        />
      </button>
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Trash className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  );
};