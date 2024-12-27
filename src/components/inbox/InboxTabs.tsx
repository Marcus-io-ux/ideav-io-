import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageThreadList } from "./MessageThreadList";
import { CollaborationRequestCard } from "./CollaborationRequestCard";
import { Message } from "@/types/inbox";

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
  return (
    <Tabs defaultValue="messages" className="mt-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="messages" className="flex items-center gap-2">
          Messages
          {unreadMessagesCount > 0 && (
            <Badge variant="secondary">
              {unreadMessagesCount}
            </Badge>
          )}
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
            messages={filteredMessages}
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