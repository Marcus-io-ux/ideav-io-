import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PostComments } from "./comments/PostComments";
import { PostCardHeader } from "./post-card/PostCardHeader";
import { PostCardContent } from "./post-card/PostCardContent";
import { PostCardFooter } from "./post-card/PostCardFooter";
import { PostCardEditor } from "./post-card/PostCardEditor";
import { PostCardCollaboration } from "./post-card/PostCardCollaboration";

interface PostCardProps {
  post: any;
  currentUserId: string | null;
  isExpanded: boolean;
  onToggleComments: (postId: string) => void;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export const PostCard = ({
  post,
  currentUserId,
  isExpanded,
  onToggleComments,
  onLike,
  onDelete,
}: PostCardProps) => {
  const [isCollabDialogOpen, setIsCollabDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedTags, setEditedTags] = useState(post.tags || []);
  const { toast } = useToast();

  const handleSaveEdit = async () => {
    try {
      const { error: postError } = await supabase
        .from('community_posts')
        .update({
          title: editedTitle,
          content: editedContent,
          tags: editedTags,
        })
        .eq('id', post.id);

      if (postError) throw postError;

      const { error: ideaError } = await supabase
        .from('ideas')
        .update({
          title: editedTitle,
          content: editedContent,
          tags: editedTags,
        })
        .match({
          title: post.title,
          content: post.content,
          user_id: currentUserId
        });

      if (ideaError) {
        console.error('Error updating idea:', ideaError);
      }

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Your post has been updated",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTagsChange = (value: string) => {
    const newTags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setEditedTags(newTags);
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
      <PostCardHeader
        post={post}
        currentUserId={currentUserId}
        onDelete={onDelete}
        setIsEditing={setIsEditing}
      />

      {isEditing ? (
        <PostCardEditor
          editedTitle={editedTitle}
          editedContent={editedContent}
          editedTags={editedTags}
          setEditedTitle={setEditedTitle}
          setEditedContent={setEditedContent}
          handleTagsChange={handleTagsChange}
          handleSaveEdit={handleSaveEdit}
          setIsEditing={setIsEditing}
        />
      ) : (
        <PostCardContent post={post} />
      )}
      
      <PostCardFooter
        currentUserId={currentUserId}
        post={post}
        setIsCollabDialogOpen={setIsCollabDialogOpen}
        isCommentsExpanded={isExpanded}
        onToggleComments={() => onToggleComments(post.id)}
        isLiked={post.is_liked}
        likesCount={post.likes_count}
        commentsCount={post.comments_count}
        onLike={() => onLike(post.id)}
      />
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t">
          <PostComments
            postId={post.id}
            comments={post.comments || []}
            onCommentAdded={() => onToggleComments(post.id)}
          />
        </div>
      )}

      <PostCardCollaboration
        post={post}
        currentUserId={currentUserId}
        isCollabDialogOpen={isCollabDialogOpen}
        setIsCollabDialogOpen={setIsCollabDialogOpen}
      />
    </div>
  );
};