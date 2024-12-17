import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, UserPlus, Pin, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { IdeaComments } from "./IdeaComments";

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

  const handleCollaborate = () => {
    toast({
      title: "Collaboration request sent",
      description: `Your request to collaborate has been sent to ${author.name}`,
    });
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("user_id", user.id)
      .single();

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

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("community_comments")
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .eq("post_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    setCommentsList(data || []);
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
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{title}</h3>
              {isPinned && <Pin className="h-4 w-4 text-primary" />}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">{author.name}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-600">
                {new Date(createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        {currentUserId === author.id && (
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive/90"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
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
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{likeCount}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            onClick={() => {
              setShowComments(!showComments);
              if (!showComments) {
                fetchComments();
              }
            }}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{comments}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleCollaborate}
          >
            <UserPlus className="h-4 w-4" />
            <span>Collaborate</span>
          </Button>
        </div>

        {showComments && (
          <IdeaComments
            comments={commentsList.map(comment => ({
              id: comment.id,
              content: comment.content,
              author: {
                name: comment.profiles?.username || "Anonymous",
                avatar: comment.profiles?.avatar_url,
              },
              createdAt: new Date(comment.created_at),
            }))}
            newComment={newComment}
            onNewCommentChange={setNewComment}
            onAddComment={handleAddComment}
          />
        )}

        {Object.keys(emojiReactions).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(emojiReactions).map(([emoji, count]) => (
              <span
                key={emoji}
                className="inline-flex items-center gap-1 px-2 py-1 bg-accent rounded-full text-sm"
              >
                {emoji} <span className="text-xs">{count}</span>
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};