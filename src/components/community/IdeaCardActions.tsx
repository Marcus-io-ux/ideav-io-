import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, UserPlus } from "lucide-react";

interface IdeaCardActionsProps {
  isLiked: boolean;
  likeCount: number;
  comments: number;
  onLike: () => void;
  onComment: () => void;
  onCollaborate: () => void;
}

export const IdeaCardActions = ({
  isLiked,
  likeCount,
  comments,
  onLike,
  onComment,
  onCollaborate,
}: IdeaCardActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
        onClick={onLike}
      >
        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        <span>{likeCount}</span>
      </Button>
      <Button variant="ghost" size="sm" className="gap-2" onClick={onComment}>
        <MessageCircle className="h-4 w-4" />
        <span>{comments}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={onCollaborate}
      >
        <UserPlus className="h-4 w-4" />
        <span>Collaborate</span>
      </Button>
    </div>
  );
};