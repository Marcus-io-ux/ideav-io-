import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

interface CollaborationRequestCardProps {
  request: any;
}

export const CollaborationRequestCard = ({ request }: CollaborationRequestCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
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

  const handleSendMessage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: request.requester_id,
          content: message,
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });

      setMessage("");
      setIsMessageDialogOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMessageDialogOpen(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {request.requester?.username}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsMessageDialogOpen(false);
                setMessage("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};