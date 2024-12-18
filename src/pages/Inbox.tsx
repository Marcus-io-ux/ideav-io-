import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Check, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ConversationList } from "@/components/inbox/ConversationList";
import { MessageList } from "@/components/inbox/MessageList";
import { MessageInput } from "@/components/inbox/MessageInput";
import { useIsMobile } from "@/hooks/use-mobile";
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

const mockMessages = [
  {
    id: 1,
    senderId: 1,
    content: "Hi! I saw your idea about Smart Home Automation and I think I can contribute with my experience in IoT development.",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    senderId: "me",
    content: "That sounds great! What specific areas would you like to focus on?",
    timestamp: "1 hour ago",
  },
];

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | undefined>(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const ConversationView = () => (
    <>
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <img
              src={selectedConversation.sender.avatar}
              alt={selectedConversation.sender.name}
            />
          </Avatar>
          <div>
            <h2 className="font-medium">{selectedConversation.sender.name}</h2>
            <p className="text-sm text-muted-foreground">
              {selectedConversation.ideaTitle}
            </p>
          </div>
        </div>
      </div>

      {selectedConversation.type === "request" ? (
        <div className="bg-accent p-4 rounded-lg m-4">
          <p className="mb-4">{selectedConversation.lastMessage}</p>
          <div className="flex gap-2">
            <Button
              onClick={() => handleCollaborationResponse(true)}
              className="gap-2"
            >
              <Check className="h-4 w-4" /> Accept
            </Button>
            <Button
              variant="outline"
              onClick={() => handleCollaborationResponse(false)}
              className="gap-2"
            >
              <X className="h-4 w-4" /> Decline
            </Button>
          </div>
        </div>
      ) : (
        <MessageList messages={mockMessages} />
      )}

      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSendMessage}
      />
    </>
  );

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)]">
      <div className="flex h-full gap-4 bg-white rounded-lg shadow-sm">
        {/* Left Panel - Conversations List */}
        <div className={`${isMobile ? 'hidden' : 'w-1/3'} border-r`}>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9" />
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
              >
                Unread
              </Button>
              <Button
                variant={filter === "requests" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("requests")}
              >
                Requests
              </Button>
            </div>
          </div>
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
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-9" />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "unread" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("unread")}
                  >
                    Unread
                  </Button>
                  <Button
                    variant={filter === "requests" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("requests")}
                  >
                    Requests
                  </Button>
                </div>
              </div>
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
            <ConversationView />
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