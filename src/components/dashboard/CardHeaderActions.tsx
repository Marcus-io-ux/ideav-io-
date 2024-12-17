import { Star, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardHeaderActionsProps {
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  size?: "default" | "sm";
}

export const CardHeaderActions = ({
  isFavorite,
  onToggleFavorite,
  onDelete,
  size = "default",
}: CardHeaderActionsProps) => {
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={cn(
          "p-1 rounded-full transition-colors",
          isFavorite ? "text-primary hover:bg-primary-light" : "text-gray-400 hover:bg-gray-100"
        )}
      >
        <Star
          className={cn(
            iconSize,
            "transition-colors",
            isFavorite && "fill-primary"
          )}
        />
      </button>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Trash className={cn(iconSize, "text-gray-500")} />
        </button>
      )}
    </div>
  );
};