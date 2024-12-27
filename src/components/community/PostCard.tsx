import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PostComments } from "./comments/PostComments";
import { PostCardHeader } from "./post-card/PostCardHeader";
import { PostCardContent } from "./post-card/PostCardContent";
import { PostCardCommentInput } from "./post-card/PostCardCommentInput";
import { PostCardDialog } from "./post-card/PostCardDialog";
import { PostCardEditor } from "./post-card/PostCardEditor";

interface PostCardProps {
  post: any;
  currentUserId: string | null;
  isExpanded: boolean;
  onToggleComments: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export const PostCard = ({
  post,
  currentUserId,
  isExpanded,
  onToggleComments,
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

  const handleCommentAdded = () => {
    // Always expand comments when a new comment is added
    if (!isExpanded) {
      onToggleComments(post.id);
    }
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
        <PostCardContent
          post={post}
          isEditing={isEditing}
          editedTitle={editedTitle}
          editedContent={editedContent}
          editedTags={editedTags}
          setEditedTitle={setEditedTitle}
          setEditedContent={setEditedContent}
          handleTagsChange={handleTagsChange}
          handleSaveEdit={handleSaveEdit}
          setIsEditing={setIsEditing}
        />
      )}
      
      <div className="mt-4">
        <PostCardCommentInput 
          postId={post.id}
          onCommentAdded={handleCommentAdded}
        />
      </div>
      
      {/* Always show comments if they exist */}
      {post.comments?.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <PostComments
            postId={post.id}
            comments={post.comments || []}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      )}

      <PostCardDialog
        isOpen={isCollabDialogOpen}
        onClose={() => setIsCollabDialogOpen(false)}
        postId={post.id}
        postUserId={post.user_id}
        currentUserId={currentUserId}
      />
    </div>
  );
};