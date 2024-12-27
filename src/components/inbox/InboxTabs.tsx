import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageThreadList } from "./MessageThreadList";
import { CollaborationRequestCard } from "./CollaborationRequestCard";
import { Message } from "@/types/inbox";
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
  const navigate = useNavigate();
  const currentFolder = new URLSearchParams(location.search).get("folder") || "inbox";

  const handleTabChange = (value: string) => {
    if (value === "messages") {
      navigate("/inbox?folder=inbox");
    } else if (value === "sent") {
      navigate("/inbox?folder=sent");
    } else {
      navigate("/inbox?folder=requests");
    }
  };

  const currentTab = currentFolder === "sent" ? "sent" : 
                     currentFolder === "requests" ? "requests" : "messages";

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="mt-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="messages" className="flex items-center gap-2">
          Messages
          {unreadMessagesCount > 0 && (
            <Badge variant="secondary">
              {unreadMessagesCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="sent">
          Sent
        </TabsTrigger>
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
        ) : filteredMessages?.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No messages found
          </div>
        ) : (
          <MessageThreadList
            messages={filteredMessages?.filter(msg => msg.recipient_id === msg.sender_id)}
            onReply={() => setIsNewMessageOpen(true)}
          />
        )}
      </TabsContent>

      <TabsContent value="sent" className="mt-6">
        {isLoadingMessages ? (
          <div className="text-center text-muted-foreground">Loading sent messages...</div>
        ) : messages?.filter(msg => msg.sender_id === msg.recipient_id).length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No sent messages found
          </div>
        ) : (
          <MessageThreadList
            messages={messages?.filter(msg => msg.sender_id === msg.recipient_id)}
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