import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Star, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IdeaCardActionsProps {
  isLiked: boolean;
  likeCount: number;
  isFavorite: boolean;
  commentsCount: number;
  onLike: () => void;
  onFavorite: () => void;
  onShare: () => void;
  onCommentClick: () => void;
}

export const IdeaCardActions = ({
  isLiked,
  likeCount,
  isFavorite,
  commentsCount,
  onLike,
  onFavorite,
  onShare,
  onCommentClick,
}: IdeaCardActionsProps) => {
  return (
    <div className="flex items-center justify-between sm:justify-start sm:gap-6 mt-4 border-t pt-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className="group flex items-center gap-2 transition-transform hover:scale-105"
        onClick={onLike}
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${
            isLiked ? 'fill-red-500 text-red-500' : 'group-hover:text-red-500'
          }`} 
        />
        <span className="text-sm">{likeCount}</span>
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="group flex items-center gap-2 transition-transform hover:scale-105"
        onClick={onCommentClick}
      >
        <MessageSquare className="w-5 h-5 group-hover:text-primary" />
        <span className="text-sm">{commentsCount}</span>
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="group transition-transform hover:scale-105"
        onClick={onFavorite}
      >
        <Star 
          className={`w-5 h-5 transition-colors ${
            isFavorite ? 'fill-primary text-primary' : 'group-hover:text-primary'
          }`} 
        />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="group transition-transform hover:scale-105"
        onClick={onShare}
      >
        <Share2 className="w-5 h-5 group-hover:text-primary" />
      </Button>
    </div>
  );
};