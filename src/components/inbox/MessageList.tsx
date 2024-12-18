import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/inbox";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
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
        ))}
      </div>
    </ScrollArea>
  );
}