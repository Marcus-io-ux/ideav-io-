import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send, Users } from "lucide-react";
import { CollaborationRequestDialog } from "./CollaborationRequestDialog";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  isRead?: boolean;
}

interface MessageThreadProps {
  currentUserId: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export const MessageThread = ({
  currentUserId,
  recipientId,
  recipientName,
  recipientAvatar,
  messages,
  onSendMessage,
}: MessageThreadProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isCollaborationOpen, setIsCollaborationOpen] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={recipientAvatar} />
            <AvatarFallback>
              {recipientName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{recipientName}</h3>
            <p className="text-sm text-muted-foreground">Active now</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setIsCollaborationOpen(true)}
        >
          <Users className="h-4 w-4" />
          <span>Collaborate</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isSender = message.sender.id === currentUserId;

            return (
              <div
                key={message.id}
                className={cn("flex gap-3", isSender && "justify-end")}
              >
                {!isSender && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.avatar} />
                    <AvatarFallback>
                      {message.sender.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "space-y-1",
                    isSender && "items-end text-right"
                  )}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{message.sender.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm",
                      isSender
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.content}
                  </div>
                  {isSender && message.isRead && (
                    <span className="text-xs text-muted-foreground">Seen</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Write your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CollaborationRequestDialog
        open={isCollaborationOpen}
        onOpenChange={setIsCollaborationOpen}
        recipientId={recipientId}
        recipientName={recipientName}
      />
    </div>
  );
};