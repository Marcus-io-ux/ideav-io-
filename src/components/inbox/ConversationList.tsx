import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Conversation } from "@/types/inbox";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation?: Conversation;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-2 p-4">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-4 rounded-lg cursor-pointer hover:bg-accent ${
              selectedConversation?.id === conversation.id ? "bg-accent" : ""
            }`}
            onClick={() => onSelectConversation(conversation)}
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
                <p className="text-sm truncate">{conversation.lastMessage}</p>
                {conversation.unread && (
                  <Badge variant="default" className="mt-1">
                    New
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}