import { MessageSquare, Trash2 } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Latest Messages</h2>
        <Badge variant="secondary">
          {messages.filter(m => !m.is_read).length} unread
        </Badge>
      </div>
      
      <div className="space-y-4 bg-background rounded-lg border">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className="p-6 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => onReply(message)}
          >
            <div className="flex items-start space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={message.sender.avatar_url} />
                <AvatarFallback>
                  {message.sender.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-x-2">
                  <div>
                    <p className="font-semibold text-foreground">
                      {message.sender.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div 
                    className="flex items-center gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()} // Prevent triggering the parent onClick
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReply(message)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(message.id)}
                      disabled={deletingMessageId === message.id}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-sm leading-6 text-foreground">
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};