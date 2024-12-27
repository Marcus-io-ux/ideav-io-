import { Message } from "@/types/inbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MessageItemProps {
  message: Message;
}

export const MessageItem = ({ message }: MessageItemProps) => {
  return (
    <div className={cn(
      "bg-muted/30 rounded-lg p-4",
      !message.is_read && "bg-blue-50/30 dark:bg-blue-950/20"
    )}>
      <div className="flex items-start space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={message.sender.avatar_url} />
          <AvatarFallback>
            {message.sender.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{message.sender.username}</p>
              {!message.is_read && (
                <Badge 
                  variant="default" 
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2"
                >
                  New
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(message.created_at), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
          {message.title && (
            <h3 className={cn(
              "font-medium mt-2",
              !message.is_read && "font-semibold text-blue-600 dark:text-blue-400"
            )}>
              {message.title}
            </h3>
          )}
          <div className="mt-2 text-sm">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};