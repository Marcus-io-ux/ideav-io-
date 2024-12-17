import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, UserPlus, UserCheck, Share2, Bookmark, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

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
  const [isBookmarked, setIsBookmarked] = useState(false);
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

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Bookmarked",
      description: isBookmarked 
        ? "This idea has been removed from your bookmarks" 
        : "This idea has been added to your bookmarks",
    });
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
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
        <div className="flex items-center justify-between sm:justify-start sm:gap-6 mt-4 border-t pt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="group flex items-center gap-2 transition-transform hover:scale-105"
            onClick={handleLike}
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
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="w-5 h-5 group-hover:text-primary" />
            <span className="text-sm">{commentsList.length}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="group transition-transform hover:scale-105"
            onClick={handleBookmark}
          >
            <Bookmark 
              className={`w-5 h-5 transition-colors ${
                isBookmarked ? 'fill-primary text-primary' : 'group-hover:text-primary'
              }`} 
            />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="group transition-transform hover:scale-105"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5 group-hover:text-primary" />
          </Button>
        </div>

        {showComments && (
          <div className="mt-4 space-y-4">
            <div className="max-h-48 overflow-y-auto space-y-2">
              {commentsList.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{comment.author.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1 ml-8">{comment.content}</p>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                className="flex-1"
              />
              <Button onClick={handleAddComment} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};