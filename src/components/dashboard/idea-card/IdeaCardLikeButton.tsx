import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface IdeaCardLikeButtonProps {
  isLiked: boolean;
  likesCount: number;
  onLike: () => void;
  disabled?: boolean;
}

export const IdeaCardLikeButton = ({
  isLiked,
  likesCount,
  onLike,
  disabled
}: IdeaCardLikeButtonProps) => {
  const getLikeText = () => {
    if (likesCount === 0) return "Be the first to like this idea!";
    if (isLiked) {
      return likesCount === 1 
        ? "You liked this idea" 
        : `Liked by you and ${likesCount - 1} other${likesCount - 1 === 1 ? '' : 's'}`;
    }
    return `${likesCount} like${likesCount === 1 ? '' : 's'}`;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
          disabled={disabled}
        >
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          <span className="text-sm">{getLikeText()}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isLiked ? "Remove your like" : "Show your support for this idea"}</p>
      </TooltipContent>
    </Tooltip>
  );
};