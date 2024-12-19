import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IdeaCardActions } from "./IdeaCardActions";
import { formatDistanceToNow } from "date-fns";
import { Author } from "@/types/author";
import { useState } from "react";
import { IdeaComments } from "./IdeaComments";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IdeaCardProps {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  userId?: string;
  isPinned?: boolean;
  category?: string;
  feedbackType?: string;
  emojiReactions?: Record<string, number>;
  onLike?: () => void;
  onComment?: () => void;
}

export const IdeaCard = ({
  id,
  title,
  content,
  author,
  createdAt,
  likes,
  comments,
  isLiked = false,
  userId,
  isPinned,
  feedbackType,
  emojiReactions,
}: IdeaCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentComments, setCurrentComments] = useState(comments);
  const [isCurrentlyLiked, setIsCurrentlyLiked] = useState(isLiked);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLike = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like posts",
          variant: "destructive",
        });
        return;
      }

      if (!isCurrentlyLiked) {
        // Check if like already exists
        const { data: existingLike } = await supabase
          .from('community_post_likes')
          .select()
          .eq('post_id', id)
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!existingLike) {
          const { error } = await supabase
            .from('community_post_likes')
            .insert([{ post_id: id, user_id: session.user.id }]);

          if (error) throw error;
          setCurrentLikes(prev => prev + 1);
          setIsCurrentlyLiked(true);
        }
      } else {
        const { error } = await supabase
          .from('community_post_likes')
          .delete()
          .match({ post_id: id, user_id: session.user.id });

        if (error) throw error;
        setCurrentLikes(prev => prev - 1);
        setIsCurrentlyLiked(false);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleCommentAdded = () => {
    setCurrentComments(prev => prev + 1);
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold">{author.name}</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        {userId === author.id && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{content}</p>
        <div className="border-t pt-4">
          <IdeaCardActions
            postId={id}
            ownerId={userId || ''}
            isLiked={isCurrentlyLiked}
            likeCount={currentLikes}
            comments={currentComments}
            onLike={handleLike}
            onComment={() => setShowComments(!showComments)}
            currentUserId={userId || null}
            authorName={author.name}
          />
        </div>
        {showComments && (
          <IdeaComments
            postId={id}
            onCommentAdded={handleCommentAdded}
          />
        )}
      </CardContent>
    </Card>
  );
};
