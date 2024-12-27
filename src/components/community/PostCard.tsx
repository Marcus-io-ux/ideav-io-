import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCollaborationRequest } from "@/hooks/use-collaboration-request";
import { PostComments } from "./comments/PostComments";
import { PostCardHeader } from "./post-card/PostCardHeader";
import { PostCardContent } from "./post-card/PostCardContent";
import { PostCardFooter } from "./post-card/PostCardFooter";

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
  const [collabMessage, setCollabMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedTags, setEditedTags] = useState(post.tags || []);
  const { sendCollaborationRequest, isLoading } = useCollaborationRequest();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCollabRequest = async () => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send collaboration requests",
        variant: "destructive",
      });
      return;
    }

    if (currentUserId === post.user_id) {
      toast({
        title: "Cannot collaborate with yourself",
        description: "You cannot send a collaboration request to your own post",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendCollaborationRequest(post.id, post.user_id, collabMessage);
      setIsCollabDialogOpen(false);
      setCollabMessage("");
      
      toast({
        title: "Request sent successfully",
        description: "Your collaboration request has been sent to the post owner",
      });

      const viewInInbox = window.confirm("Would you like to view your sent request in your inbox?");
      if (viewInInbox) {
        navigate("/inbox");
      }
    } catch (error) {
      toast({
        title: "Error sending request",
        description: "Failed to send collaboration request. Please try again.",
        variant: "destructive",
      });
    }
  };

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

      <Dialog open={isCollabDialogOpen} onOpenChange={setIsCollabDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Collaboration</DialogTitle>
            <DialogDescription>
              Send a message to the author explaining why you'd like to collaborate on this idea.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={collabMessage}
              onChange={(e) => setCollabMessage(e.target.value)}
              placeholder="I'm interested in collaborating because..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCollabDialogOpen(false);
                setCollabMessage("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCollabRequest}
              disabled={!collabMessage.trim() || isLoading}
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};