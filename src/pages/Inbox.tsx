import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMessages } from "@/hooks/use-messages";
import { InboxSidebar } from "@/components/inbox/InboxSidebar";
import { InboxPageHeader } from "@/components/inbox/InboxPageHeader";
import { InboxTabs } from "@/components/inbox/InboxTabs";
import { NewMessageDialog } from "@/components/inbox/NewMessageDialog";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Inbox = () => {
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { sendMessage } = useMessages();
  const location = useLocation();
  const currentFolder = new URLSearchParams(location.search).get("folder") || "inbox";
  const isMobile = useIsMobile();

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

  const pendingRequestsCount = requests?.filter(req => req.status === 'pending').length || 0;
  const unreadMessagesCount = messages?.filter(msg => !msg.is_read).length || 0;

  // Filter messages based on current folder, search query, and active filters
  const filteredMessages = messages?.filter(msg => {
    // First apply folder filter
    switch (currentFolder) {
      case 'inbox':
        return !msg.is_read;
      case 'starred':
        return false;
      case 'sent':
        return msg.sender_id === currentUser?.id;
      case 'archived':
        return false;
      case 'trash':
        return false;
      default:
        return true;
    }
  })?.filter(msg => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        msg.content.toLowerCase().includes(searchLower) ||
        msg.sender.username?.toLowerCase().includes(searchLower) ||
        msg.recipient.username?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  })?.filter(msg => {
    if (activeFilters.includes('unread')) {
      return !msg.is_read;
    }
    if (activeFilters.includes('has_attachments')) {
      return false;
    }
    return true;
  });

  const folderCounts = {
    inbox: unreadMessagesCount,
    starred: 0,
    sent: messages?.filter(msg => msg.sender_id === currentUser?.id).length || 0,
    archived: 0,
    trash: 0,
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {!isMobile && <InboxSidebar counts={folderCounts} />}
      
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <InboxPageHeader
            onSearch={setSearchQuery}
            onFilterChange={setActiveFilters}
            activeFilters={activeFilters}
            onNewMessage={() => setIsNewMessageOpen(true)}
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

          <div className="mt-8 text-center text-muted-foreground">
            <p>Need help? Visit our support page for tips on using your inbox!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;