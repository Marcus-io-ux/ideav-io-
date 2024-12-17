import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { IdeaComments } from "./IdeaComments";
import { IdeaCardHeader } from "./IdeaCardHeader";
import { IdeaCardActions } from "./IdeaCardActions";
import { IdeaCardContent } from "./IdeaCardContent";
import { usePostInteractions } from "@/hooks/use-post-interactions";

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
  category?: string;
  feedbackType?: string;
  createdAt: Date;
  isPinned?: boolean;
  emojiReactions?: Record<string, number>;
}

export const IdeaCard = ({
  id,
  title,
  content,
  author,
  tags,
  category,
  feedbackType,
  createdAt,
  isPinned,
  emojiReactions = {},
}: IdeaCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    isLiked,
    setIsLiked,
    isFavorite,
    setIsFavorite,
    likeCount,
    commentCount
  } = usePostInteractions(id, currentUserId);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const fetchComments = async () => {
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from("community_comments")
        .select(`
          id,
          content,
          created_at,
          user_id
        `)
        .eq("post_id", id)
        .order("created_at", { ascending: true });

      if (commentsError) {
        console.error("Error fetching comments:", commentsError);
        return;
      }

      const commentsWithAuthors = await Promise.all(
        commentsData.map(async (comment) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("user_id", comment.user_id)
            .single();

          return {
            id: comment.id,
            content: comment.content,
            createdAt: new Date(comment.created_at),
            author: {
              name: profileData?.username || "Anonymous",
              avatar: profileData?.avatar_url
            }
          };
        })
      );

      setCommentsList(commentsWithAuthors);
    } catch (error) {
      console.error("Error processing comments:", error);
    }
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
          onDelete={() => {}}
        />
      </CardHeader>
      <CardContent>
        <IdeaCardContent
          content={content}
          tags={tags}
          category={category}
          feedbackType={feedbackType}
          emojiReactions={emojiReactions}
        />
        
        <IdeaCardActions
          postId={id}
          ownerId={author.id}
          isLiked={isLiked}
          likeCount={likeCount}
          comments={commentCount}
          onLike={async () => {
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

            if (newLikeState) {
              const { error } = await supabase
                .from("community_post_likes")
                .insert({ post_id: id, user_id: user.id });

              if (error) {
                console.error("Error liking post:", error);
                setIsLiked(false);
              }
            } else {
              const { error } = await supabase
                .from("community_post_likes")
                .delete()
                .match({ post_id: id, user_id: user.id });

              if (error) {
                console.error("Error unliking post:", error);
                setIsLiked(true);
              }
            }
          }}
          onComment={() => {
            setShowComments(!showComments);
            if (!showComments) {
              fetchComments();
            }
          }}
          currentUserId={currentUserId}
          authorName={author.name}
          isFavorite={isFavorite}
          onFavoriteChange={setIsFavorite}
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