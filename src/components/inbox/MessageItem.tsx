import { Message } from "@/types/inbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface MessageItemProps {
  message: Message;
}

export const MessageItem = ({ message }: MessageItemProps) => {
  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <div className="flex items-start space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={message.sender.avatar_url} />
          <AvatarFallback>
            {message.sender.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{message.sender.username}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(message.created_at), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
          {message.title && (
            <h3 className="font-medium mt-2">{message.title}</h3>
          )}
          <div className="mt-2 text-sm">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};