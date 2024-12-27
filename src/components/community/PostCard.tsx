import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Trash2, UserPlus, Edit2 } from "lucide-react";
import { CommentList } from "./comments/CommentList";
import { useCollaborationRequest } from "@/hooks/use-collaboration-request";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

      // Also update the corresponding idea if it exists
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

      // Refresh the posts list
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={post.profiles?.avatar_url} />
            <AvatarFallback>
              {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{post.profiles?.username || 'Anonymous'}</h3>
            <p className="text-sm text-muted-foreground">
              Posted {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {post.user_id === currentUserId && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="text-muted-foreground hover:text-primary"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(post.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="mb-2"
              placeholder="Title"
            />
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px]"
              placeholder="Content"
            />
          </div>
          <div>
            <Input
              value={editedTags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="Tags (comma-separated)"
              className="mb-2"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveEdit}>Save</Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditing(false);
                setEditedTitle(post.title);
                setEditedContent(post.content);
                setEditedTags(post.tags || []);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
          <p className="mb-4">{post.content}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="px-2 md:px-3 py-1 text-xs md:text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </>
      )}

      <div className="flex gap-4">
        <Button variant="ghost" size="sm" onClick={() => onLike(post.id)}>
          <ThumbsUp className="w-4 h-4 mr-2" />
          {post.likes_count || 0}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onToggleComments(post.id)}>
          <MessageSquare className="w-4 h-4 mr-2" />
          {post.comments_count || 0}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsCollabDialogOpen(true)}
          className="text-primary hover:text-primary/80"
          disabled={post.user_id === currentUserId}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Collaborate
        </Button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t">
          <CommentList postId={post.id} />
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