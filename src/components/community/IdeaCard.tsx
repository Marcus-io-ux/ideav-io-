import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, UserPlus, UserCheck, Share2, Bookmark } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

export const IdeaCard = ({ id, title, content, author, likes, comments, tags, createdAt }: IdeaCardProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isBookmarked, setIsBookmarked] = useState(false);
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
          >
            <MessageSquare className="w-5 h-5 group-hover:text-primary" />
            <span className="text-sm">{comments}</span>
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
      </CardContent>
    </Card>
  );
};