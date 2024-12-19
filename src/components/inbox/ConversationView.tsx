import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Conversation } from "@/types/inbox";

interface ConversationViewProps {
  conversation: Conversation;
  messages: any[];
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onCollaborationResponse: (accept: boolean) => void;
}

export function ConversationView({
  conversation,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onCollaborationResponse,
}: ConversationViewProps) {
  return (
    <>
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <img
              src={conversation.sender.avatar}
              alt={conversation.sender.name}
            />
          </Avatar>
          <div>
            <h2 className="font-medium">{conversation.sender.name}</h2>
            <p className="text-sm text-muted-foreground">
              {conversation.ideaTitle}
            </p>
          </div>
        </div>
      </div>

      {conversation.type === "request" ? (
        <div className="bg-accent p-4 rounded-lg m-4">
          <p className="mb-4">{conversation.lastMessage}</p>
          <div className="flex gap-2">
            <Button
              onClick={() => onCollaborationResponse(true)}
              className="gap-2"
            >
              <Check className="h-4 w-4" /> Accept
            </Button>
            <Button
              variant="outline"
              onClick={() => onCollaborationResponse(false)}
              className="gap-2"
            >
              <X className="h-4 w-4" /> Decline
            </Button>
          </div>
        </div>
      ) : (
        <MessageList messages={messages} />
      )}

      <MessageInput
        value={newMessage}
        onChange={onNewMessageChange}
        onSend={onSendMessage}
      />
    </>
  );
}