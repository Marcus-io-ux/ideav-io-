import { Button } from "@/components/ui/button";
import { Star, Trash2, ThumbsUp, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface IdeaCardFooterProps {
  isCurrentlyFavorite: boolean;
  onToggleFavorite: () => void;
  onDelete?: () => void;
  userId?: string;
  sharedToCommunity?: boolean;
  isLiked: boolean;
  likesCount: number;
  onLike: () => void;
  commentsCount: number;
  isCommentsExpanded: boolean;
  onToggleComments: () => void;
  hideInteractions?: boolean;
}

export const IdeaCardFooter = ({
  isCurrentlyFavorite,
  onToggleFavorite,
  onDelete,
  userId,
  sharedToCommunity,
  isLiked,
  likesCount,
  onLike,
  commentsCount,
  isCommentsExpanded,
  onToggleComments,
  hideInteractions = false,
}: IdeaCardFooterProps) => {
  return (
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
      {!hideInteractions && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 text-muted-foreground hover:text-primary",
              isLiked && "text-primary"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            disabled={!userId}
          >
            <ThumbsUp className={cn("h-4 w-4", isLiked && "fill-current")} />
            <span className="text-sm">{likesCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 text-muted-foreground hover:text-primary",
              isCommentsExpanded && "text-primary"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onToggleComments();
            }}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">{commentsCount}</span>
          </Button>
        </div>
      )}
      
      <div className={cn("flex items-center gap-2 ml-auto")}>
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
    </div>
  );
};