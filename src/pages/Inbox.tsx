import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMessages } from "@/hooks/use-messages";
import { InboxPageHeader } from "@/components/inbox/InboxPageHeader";
import { InboxTabs } from "@/components/inbox/InboxTabs";
import { NewMessageDialog } from "@/components/inbox/NewMessageDialog";
import { useLocation } from "react-router-dom";

const Inbox = () => {
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { sendMessage } = useMessages();
  const location = useLocation();
  const currentFolder = new URLSearchParams(location.search).get("folder") || "inbox";

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

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
          sender:profiles!messages_sender_id_fkey(username, avatar_url, user_id),
          recipient:profiles!messages_recipient_id_fkey(username, avatar_url, user_id)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Filter messages based on search query, active filters, and current folder
  const filteredMessages = messages?.filter(msg => {
    // First apply folder filter
    if (currentFolder === "sent" && msg.sender_id !== currentUser?.id) {
      return false;
    }
    if (currentFolder === "inbox" && msg.recipient_id !== currentUser?.id) {
      return false;
    }

    // Then apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        msg.content.toLowerCase().includes(searchLower) ||
        msg.sender.username?.toLowerCase().includes(searchLower) ||
        msg.recipient.username?.toLowerCase().includes(searchLower)
      );
    }
    // Apply unread filter
    if (activeFilters.includes('unread')) {
      return !msg.is_read;
    }
    return true;
  });

  const pendingRequestsCount = requests?.filter(req => req.status === 'pending').length || 0;
  const unreadMessagesCount = messages?.filter(msg => 
    !msg.is_read && msg.recipient_id === currentUser?.id
  ).length || 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container mx-auto p-4 md:p-6">
        <InboxPageHeader
          onSearch={setSearchQuery}
        />

        <InboxTabs
          messages={messages}
          filteredMessages={filteredMessages}
          requests={requests}
          isLoadingMessages={isLoadingMessages}
          isLoadingRequests={isLoadingRequests}
          unreadMessagesCount={unreadMessagesCount}
          pendingRequestsCount={pendingRequestsCount}
          setIsNewMessageOpen={setIsNewMessageOpen}
        />

        <NewMessageDialog
          open={isNewMessageOpen}
          onOpenChange={setIsNewMessageOpen}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
};

export default Inbox;