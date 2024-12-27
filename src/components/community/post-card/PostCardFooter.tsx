import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardFooterProps {
  currentUserId: string | null;
  post: any;
  setIsCollabDialogOpen: (value: boolean) => void;
  isCommentsExpanded: boolean;
  onToggleComments: () => void;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  onLike: () => void;
}

export const PostCardFooter = ({
  currentUserId,
  post,
  setIsCollabDialogOpen,
  isCommentsExpanded,
  onToggleComments,
  isLiked,
  likesCount,
  commentsCount,
  onLike,
}: PostCardFooterProps) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2 text-muted-foreground hover:text-primary",
            isLiked && "text-primary"
          )}
          onClick={onLike}
          disabled={!currentUserId}
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
          onClick={onToggleComments}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm">{commentsCount}</span>
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsCollabDialogOpen(true)}
        disabled={!currentUserId || currentUserId === post.user_id}
      >
        Collaborate
      </Button>
    </div>
  );
};