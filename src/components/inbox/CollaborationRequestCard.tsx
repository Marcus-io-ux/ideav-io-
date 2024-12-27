import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageDialog } from "./MessageDialog";
import { useNavigate } from "react-router-dom";

interface CollaborationRequestCardProps {
  request: any;
}

export const CollaborationRequestCard = ({ request }: CollaborationRequestCardProps) => {
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleMessageSent = () => {
    setIsMessageDialogOpen(false);
    navigate("/inbox?folder=sent");
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={request.requester?.avatar_url} />
          <AvatarFallback>
            {request.requester?.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{request.requester?.username}</h3>
            <Badge variant={request.status === 'pending' ? 'secondary' : request.status === 'accepted' ? 'success' : 'destructive'}>
              {request.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Requested collaboration on post: {request.post?.title}
          </p>
          <div className="bg-muted/50 rounded-md p-3 mb-4">
            <p className="text-sm">{request.message}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsMessageDialogOpen(true)}
            >
              Send Message
            </Button>
          </div>
        </div>
      </div>

      <MessageDialog
        open={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        recipientId={request.requester_id}
        recipientUsername={request.requester?.username}
      />
    </div>
  );
};