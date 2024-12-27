import { Message } from "@/types/inbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "../MessageItem";

interface ThreadMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export const ThreadMessages = ({ messages, isLoading }: ThreadMessagesProps) => {
  return (
    <ScrollArea className="flex-1 pr-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      )}
    </ScrollArea>
  );
};