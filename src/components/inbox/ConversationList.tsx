import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Pin } from "lucide-react";
import { NewMessageDialog } from "./NewMessageDialog";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    isRead: boolean;
  };
  isPinned?: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
}

export const ConversationList = ({
  conversations,
  activeConversationId,
  onConversationSelect,
}: ConversationListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

  const filteredConversations = conversations
    .sort((a, b) => {
      // Sort pinned conversations first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then sort by timestamp
      return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
    })
    .filter(
      (conv) =>
        conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="flex h-full flex-col border-r">
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsNewMessageOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onConversationSelect(conversation.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent",
                activeConversationId === conversation.id && "bg-accent",
                !conversation.lastMessage.isRead && "font-medium"
              )}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.user.avatar} />
                <AvatarFallback>
                  {conversation.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {conversation.user.name}
                  </span>
                  <div className="flex items-center gap-1">
                    {conversation.isPinned && (
                      <Pin className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {conversation.lastMessage.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {conversation.lastMessage.content}
                </p>
              </div>
              {!conversation.lastMessage.isRead && (
                <div className="mt-2 h-2 w-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </ScrollArea>

      <NewMessageDialog
        open={isNewMessageOpen}
        onOpenChange={setIsNewMessageOpen}
      />
    </div>
  );
};