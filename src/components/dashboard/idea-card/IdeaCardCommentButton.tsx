import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface IdeaCardCommentButtonProps {
  commentsCount: number;
  onClick: () => void;
  isExpanded: boolean;
}

export const IdeaCardCommentButton = ({
  commentsCount,
  onClick,
  isExpanded
}: IdeaCardCommentButtonProps) => {
  const getCommentText = () => {
    if (commentsCount === 0) return "Start the conversation—leave the first comment!";
    return `View ${commentsCount} comment${commentsCount === 1 ? '' : 's'}`;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2 text-muted-foreground hover:text-primary",
            isExpanded && "text-primary"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm">{getCommentText()}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Share your thoughts or feedback on this idea</p>
      </TooltipContent>
    </Tooltip>
  );
};