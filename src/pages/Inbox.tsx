import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { CollaborationRequestCard } from "@/components/inbox/CollaborationRequestCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

const Inbox = () => {
  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['collaboration-requests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First get the collaboration requests with post data
      const { data: collaborationRequests, error } = await supabase
        .from('collaboration_requests')
        .select(`
          *,
          post:community_posts(
            title,
            content,
            tags
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching collaboration requests:', error);
        throw error;
      }

      // Then fetch the requester profiles separately
      const requestsWithProfiles = await Promise.all(
        (collaborationRequests || []).map(async (request) => {
          const { data: requesterProfile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('user_id', request.requester_id)
            .maybeSingle();

          return {
            ...request,
            requester: requesterProfile
          };
        })
      );

      return requestsWithProfiles;
    }
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(username, avatar_url),
          recipient:profiles!messages_recipient_id_fkey(username, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return messages;
    }
  });

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <PageHeader
        title="Inbox"
        description="Manage your collaboration requests and messages"
      />

      <Tabs defaultValue="requests" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Collaboration Requests</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

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

        <TabsContent value="messages" className="mt-4 space-y-4">
          {isLoadingMessages ? (
            <div>Loading messages...</div>
          ) : messages?.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No messages yet
            </div>
          ) : (
            messages?.map((message) => (
              <Card key={message.id} className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={message.sender.avatar_url} />
                    <AvatarFallback>
                      {message.sender.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{message.sender.username}</p>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-1">{message.content}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inbox;