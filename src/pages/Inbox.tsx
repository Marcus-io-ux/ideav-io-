import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data - replace with actual data from your backend
const mockConversations = [
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
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [filter, setFilter] = useState("all");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const handleCollaborationResponse = (accept: boolean) => {
    console.log(accept ? "Accepting collaboration" : "Declining collaboration");
  };

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)]">
      <div className="flex h-full gap-4 bg-white rounded-lg shadow-sm">
        {/* Left Panel */}
        <div className="w-1/3 border-r">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-9"
              />
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
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-2 p-4">
              {mockConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 rounded-lg cursor-pointer hover:bg-accent ${
                    selectedConversation?.id === conversation.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <img src={conversation.sender.avatar} alt={conversation.sender.name} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${conversation.unread ? "text-primary" : ""}`}>
                          {conversation.sender.name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.ideaTitle}
                      </p>
                      <p className="text-sm truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread && (
                        <Badge variant="default" className="mt-1">New</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
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

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.type === "request" ? (
                    <div className="bg-accent p-4 rounded-lg">
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
                    mockMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === "me" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === "me"
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent"
                          }`}
                        >
                          <p>{message.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Write your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
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