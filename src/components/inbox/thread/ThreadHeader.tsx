import { Message } from "@/types/inbox";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";

interface ThreadHeaderProps {
  message: Message;
}

export const ThreadHeader = ({ message }: ThreadHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-xl">
        Conversation with {message.sender.username}
      </DialogTitle>
      <div className="text-sm text-muted-foreground">
        Started {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
      </div>
    </DialogHeader>
  );
};