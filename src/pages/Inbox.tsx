import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ConversationList } from "@/components/inbox/ConversationList";
import { ConversationView } from "@/components/inbox/ConversationView";
import { InboxHeader } from "@/components/inbox/InboxHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRealTimeMessages } from "@/hooks/use-real-time-messages";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation } from "@/types/inbox";

// Mock data - replace with actual data from your backend
const mockConversations: Conversation[] = [
  {
    id: 1,
    sender: {
      name: "Alice Cooper",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
    ideaTitle: "Smart Home Automation",
    lastMessage: "I'd love to collaborate on your idea!",
    timestamp: "2 hours ago",
    unread: true,
    type: "request",
  },
  {
    id: 2,
    sender: {
      name: "Bob Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    },
    ideaTitle: "Mobile App Design",
    lastMessage: "Thanks for accepting my request!",
    timestamp: "1 day ago",
    unread: false,
    type: "message",
  },
];

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | undefined>(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: { user } } = await supabase.auth.getUser();
  const messages = useRealTimeMessages(user?.id);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const handleCollaborationResponse = (accept: boolean) => {
    console.log(accept ? "Accepting collaboration" : "Declining collaboration");
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)]">
      <div className="flex h-full gap-4 bg-white rounded-lg shadow-sm">
        {/* Left Panel - Conversations List */}
        <div className={`${isMobile ? 'hidden' : 'w-1/3'} border-r`}>
          <InboxHeader filter={filter} onFilterChange={setFilter} />
          <ConversationList
            conversations={mockConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Mobile View - Conversations List in Sheet */}
        {isMobile && (
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="mb-4">
                View Conversations
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[100vw] sm:w-[540px]">
              <InboxHeader filter={filter} onFilterChange={setFilter} />
              <ConversationList
                conversations={mockConversations}
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
              />
            </SheetContent>
          </Sheet>
        )}

        {/* Right Panel - Messages */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <ConversationView
              conversation={selectedConversation}
              messages={messages}
              newMessage={newMessage}
              onNewMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
              onCollaborationResponse={handleCollaborationResponse}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}