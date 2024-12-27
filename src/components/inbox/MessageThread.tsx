import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types/inbox";
import { formatDistanceToNow, format } from "date-fns";
import { PaperclipIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageThreadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMessage: Message | null;
}

export const MessageThread = ({ open, onOpenChange, selectedMessage }: MessageThreadProps) => {
  const [reply, setReply] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (open && selectedMessage) {
      fetchThreadMessages();
      markMessageAsRead();
    }
  }, [open, selectedMessage]);

  if (!selectedMessage) return null;

  const fetchThreadMessages = async () => {
    const threadId = selectedMessage.thread_id || selectedMessage.id;
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey (
          username,
          avatar_url,
          user_id
        ),
        recipient:profiles!messages_recipient_id_fkey (
          username,
          avatar_url,
          user_id
        )
      `)
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching thread messages:', error);
      return;
    }

    setThreadMessages(data || []);
  };

  const markMessageAsRead = async () => {
    if (!selectedMessage.is_read) {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', selectedMessage.id);

      if (error) {
        console.error('Error marking message as read:', error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['messages'] });
      }
    }
  };

  const handleSendReply = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const threadId = selectedMessage.thread_id || selectedMessage.id;

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedMessage.sender.user_id,
          content: reply,
          parent_id: selectedMessage.id,
          thread_id: threadId,
          is_read: false
        });

      if (error) throw error;

      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully",
      });

      setReply("");
      await queryClient.invalidateQueries({ queryKey: ['messages'] });
      await fetchThreadMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    }
  };

  const quickReplies = [
    "Thanks for your input!",
    "Let's set up a time to discuss further.",
    "I'll get back to you soon.",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Conversation with {selectedMessage.sender.username}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Started {formatDistanceToNow(new Date(selectedMessage.created_at), { addSuffix: true })}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {threadMessages.map((message) => (
              <div key={message.id} className="bg-muted/30 rounded-lg p-4">
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
                    <div className="mt-2 text-sm">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((quickReply) => (
              <Button
                key={quickReply}
                variant="secondary"
                size="sm"
                onClick={() => setReply(quickReply)}
              >
                {quickReply}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your reply here..."
              className="min-h-[100px]"
            />
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <PaperclipIcon className="h-4 w-4 mr-2" />
                Attach files
              </Button>
              <Button
                onClick={handleSendReply}
                disabled={!reply.trim()}
              >
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};