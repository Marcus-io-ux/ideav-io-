import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageThreadList } from "./MessageThreadList";
import { CollaborationRequestCard } from "./CollaborationRequestCard";
import { Message } from "@/types/inbox";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

interface InboxTabsProps {
  messages: Message[] | null;
  filteredMessages: Message[] | null;
  requests: any[] | null;
  isLoadingMessages: boolean;
  isLoadingRequests: boolean;
  unreadMessagesCount: number;
  pendingRequestsCount: number;
  setIsNewMessageOpen: (open: boolean) => void;
}

export const InboxTabs = ({
  messages,
  filteredMessages,
  requests,
  isLoadingMessages,
  isLoadingRequests,
  unreadMessagesCount,
  pendingRequestsCount,
  setIsNewMessageOpen,
}: InboxTabsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentFolder = new URLSearchParams(location.search).get("folder") || "inbox";

  // Filter messages based on the current folder
  const displayMessages = filteredMessages?.filter(msg => {
    if (currentFolder === "sent") {
      return msg.sender.user_id === (messages?.[0]?.sender.user_id || msg.sender.user_id);
    }
    return msg.recipient.user_id === (messages?.[0]?.recipient.user_id || msg.recipient.user_id);
  });

  return (
    <Tabs defaultValue="messages" className="mt-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="messages" className="flex items-center gap-2">
          Messages
          {unreadMessagesCount > 0 && (
            <Badge variant="secondary">
              {unreadMessagesCount}
            </Badge>
          )}
        </TabsTrigger>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => navigate("/inbox?folder=sent")}
        >
          <Send className="h-4 w-4" />
          Sent
        </Button>
        <TabsTrigger value="requests" className="flex items-center gap-2">
          Requests
          {pendingRequestsCount > 0 && (
            <Badge variant="secondary">
              {pendingRequestsCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="messages" className="mt-6">
        {isLoadingMessages ? (
          <div className="text-center text-muted-foreground">Loading messages...</div>
        ) : displayMessages?.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No messages found
          </div>
        ) : (
          <MessageThreadList
            messages={displayMessages}
            onReply={() => setIsNewMessageOpen(true)}
          />
        )}
      </TabsContent>

      <TabsContent value="requests" className="mt-6">
        {isLoadingRequests ? (
          <div className="text-center text-muted-foreground">Loading requests...</div>
        ) : requests?.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No collaboration requests yet
          </div>
        ) : (
          <div className="space-y-4">
            {requests?.map((request) => (
              <CollaborationRequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};