import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageHeader } from "@/components/inbox/MessageHeader";
import { MessageThreadList } from "@/components/inbox/MessageThreadList";
import { NewMessageDialog } from "@/components/inbox/NewMessageDialog";
import { CollaborationRequestCard } from "@/components/inbox/CollaborationRequestCard";
import { useMessages } from "@/hooks/use-messages";
import { Badge } from "@/components/ui/badge";

const Inbox = () => {
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const { sendMessage } = useMessages();

  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['collaboration-requests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('collaboration_requests')
        .select(`
          *,
          post:community_posts(
            title,
            content,
            tags
          ),
          requester:profiles!collaboration_requests_requester_id_fkey(
            username,
            avatar_url
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(username, avatar_url),
          recipient:profiles!messages_recipient_id_fkey(username, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const pendingRequestsCount = requests?.filter(req => req.status === 'pending').length || 0;
  const unreadMessagesCount = messages?.filter(msg => !msg.is_read).length || 0;

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <MessageHeader />
        <Button
          onClick={() => setIsNewMessageOpen(true)}
          className="gap-2"
        >
          New Message
        </Button>
      </div>

      <Tabs defaultValue="messages" className="mt-8">
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
            Collaboration Requests
            {pendingRequestsCount > 0 && (
              <Badge variant="secondary">
                {pendingRequestsCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="mt-4">
          {isLoadingMessages ? (
            <div>Loading messages...</div>
          ) : messages?.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No messages yet
            </div>
          ) : (
            <MessageThreadList
              messages={messages}
              onReply={(message) => {
                setIsNewMessageOpen(true);
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="requests" className="mt-4 space-y-4">
          {isLoadingRequests ? (
            <div>Loading requests...</div>
          ) : requests?.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No collaboration requests yet
            </div>
          ) : (
            requests?.map((request) => (
              <CollaborationRequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>
      </Tabs>

      <NewMessageDialog
        open={isNewMessageOpen}
        onOpenChange={setIsNewMessageOpen}
        onSend={sendMessage}
      />

      <div className="mt-8 text-center text-muted-foreground">
        <p>Got feedback or a question? Reach out to collaborators directly and keep the momentum going!</p>
      </div>
    </div>
  );
};

export default Inbox;