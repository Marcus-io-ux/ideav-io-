import { MessageSquare, Pin, Archive, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Message } from "@/types/inbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface MessageThreadListProps {
  messages: Message[];
  onReply: (message: Message) => void;
}

export const MessageThreadList = ({ messages, onReply }: MessageThreadListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);

  const handleDelete = async (messageId: string) => {
    try {
      setDeletingMessageId(messageId);
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['messages'] });

      toast({
        title: "Message deleted",
        description: "The message has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setDeletingMessageId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Latest Messages</h2>
        <Badge variant="secondary">
          {messages.filter(m => !m.is_read).length} unread
        </Badge>
      </div>
      
      {messages.map((message) => (
        <Card key={message.id} className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage src={message.sender.avatar_url} />
              <AvatarFallback>
                {message.sender.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{message.sender.username}</p>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="mt-1">{message.content}</p>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReply(message)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(message.id)}
                  disabled={deletingMessageId === message.id}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};