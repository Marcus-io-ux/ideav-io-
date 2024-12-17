import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { IdeaCardActions } from "./IdeaCardActions";
import { IdeaComments } from "./IdeaComments";

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
}

interface IdeaCardProps {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  tags: string[];
  createdAt: Date;
}

export const IdeaCard = ({ id, title, content, author, likes, comments: initialComments, tags, createdAt }: IdeaCardProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const { toast } = useToast();

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing
        ? `You have unfollowed ${author.name}`
        : `You are now following ${author.name}`,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    toast({
      title: isLiked ? "Unliked" : "Liked",
      description: isLiked ? "You have unliked this idea" : "You have liked this idea",
    });
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would update the favorites in a global state or backend
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? "This idea has been removed from your favorites" 
        : "This idea has been added to your favorites and can be found in the Favorites page",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share",
      description: "Sharing functionality coming soon!",
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: {
        name: "Current User", // In a real app, this would come from auth
        avatar: "/placeholder.svg",
      },
      createdAt: new Date(),
    };

    setCommentsList([...commentsList, comment]);
    setNewComment("");
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">{author.name}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-600">
                {new Date(createdAt).toLocaleDateString()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 transition-transform hover:scale-105"
                onClick={handleFollow}
              >
                {isFollowing ? (
                  <UserCheck className="w-4 h-4 text-green-500" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{content}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <IdeaCardActions
          isLiked={isLiked}
          likeCount={likeCount}
          isFavorite={isFavorite}
          commentsCount={commentsList.length}
          onLike={handleLike}
          onFavorite={handleFavorite}
          onShare={handleShare}
          onCommentClick={() => setShowComments(!showComments)}
        />

        {showComments && (
          <IdeaComments
            comments={commentsList}
            newComment={newComment}
            onNewCommentChange={setNewComment}
            onAddComment={handleAddComment}
          />
        )}
      </CardContent>
    </Card>
  );
};