import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { IdeaComments } from "./IdeaComments";
import { IdeaCardHeader } from "./IdeaCardHeader";
import { IdeaCardActions } from "./IdeaCardActions";
import { IdeaCardContent } from "./IdeaCardContent";

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
  isPinned?: boolean;
  emojiReactions?: Record<string, number>;
}

interface CommentResponse {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export const IdeaCard = ({
  id,
  title,
  content,
  author,
  likes,
  comments,
  tags,
  createdAt,
  isPinned,
  emojiReactions = {},
}: IdeaCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like posts",
        variant: "destructive",
      });
      return;
    }

    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    setLikeCount(prev => newLikeState ? prev + 1 : prev - 1);

    if (newLikeState) {
      const { error } = await supabase
        .from("community_post_likes")
        .insert({ post_id: id, user_id: user.id });

      if (error) {
        console.error("Error liking post:", error);
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      }
    } else {
      const { error } = await supabase
        .from("community_post_likes")
        .delete()
        .match({ post_id: id, user_id: user.id });

      if (error) {
        console.error("Error unliking post:", error);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    }
  };

  const handleDelete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== author.id) {
      toast({
        title: "Unauthorized",
        description: "You can only delete your own posts",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("community_posts")
      .delete()
      .match({ id });

    if (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("community_comments")
      .select(`
        id,
        content,
        created_at,
        user_id,
        author:profiles!community_comments_user_id_fkey(
          username,
          avatar_url
        )
      `)
      .eq("post_id", id)
      .order("created_at", { ascending: true }) as { data: CommentResponse[] | null, error: any };

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    if (!data) return;

    const formattedComments = data.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: new Date(comment.created_at),
      author: {
        name: comment.author?.username || "Anonymous",
        avatar: comment.author?.avatar_url
      }
    }));

    setCommentsList(formattedComments);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to comment",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("community_comments")
      .insert({
        post_id: id,
        user_id: user.id,
        content: newComment,
      });

    if (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } else {
      setNewComment("");
      fetchComments();
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <CardHeader>
        <IdeaCardHeader
          title={title}
          author={author}
          createdAt={createdAt}
          isPinned={isPinned}
          currentUserId={currentUserId}
          onDelete={handleDelete}
        />
      </CardHeader>
      <CardContent>
        <IdeaCardContent
          content={content}
          tags={tags}
          emojiReactions={emojiReactions}
        />
        
        <IdeaCardActions
          postId={id}
          ownerId={author.id}
          isLiked={isLiked}
          likeCount={likeCount}
          comments={comments}
          onLike={handleLike}
          onComment={() => {
            setShowComments(!showComments);
            if (!showComments) {
              fetchComments();
            }
          }}
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