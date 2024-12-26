import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Trash2 } from "lucide-react";
import { MessageDialog } from "./MessageDialog";

interface CollaborationRequestCardProps {
  request: any;
}

export const CollaborationRequestCard = ({ request }: CollaborationRequestCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleResponse = async (status: 'accepted' | 'rejected') => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('collaboration_requests')
        .update({ status })
        .eq('id', request.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['collaboration-requests'] });

      toast({
        title: `Request ${status}`,
        description: `You have ${status} the collaboration request`,
      });
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('collaboration_requests')
        .delete()
        .eq('id', request.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['collaboration-requests'] });

      toast({
        title: "Request deleted",
        description: "The collaboration request has been deleted",
      });
    } catch (error: any) {
      console.error('Error deleting request:', error);
      toast({
        title: "Error",
        description: "Failed to delete request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={request.requester?.avatar_url} />
            <AvatarFallback>
              {request.requester?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {request.requester?.username} wants to collaborate
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              on post: {request.post?.title}
            </p>
            <p className="mt-2">{request.message}</p>
            {request.post?.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {request.post.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {request.status === 'pending' ? (
            <>
              <Button
                variant="outline"
                onClick={() => handleResponse('rejected')}
                disabled={isLoading}
              >
                Decline
              </Button>
              <Button
                onClick={() => handleResponse('accepted')}
                disabled={isLoading}
              >
                Accept
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant={request.status === 'accepted' ? 'default' : 'secondary'}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
              {request.status === 'accepted' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMessageDialogOpen(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <MessageDialog
        open={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        recipientId={request.requester_id}
        recipientUsername={request.requester?.username}
      />
    </Card>
  );
};