import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types/inbox";
import { formatDistanceToNow } from "date-fns";
import { PaperclipIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";
import { QuickReplies } from "./QuickReplies";

interface MessageThreadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMessage: Message | null;
}

export const MessageThread = ({ open, onOpenChange, selectedMessage }: MessageThreadProps) => {
  const [reply, setReply] = useState("");
  const [title, setTitle] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && selectedMessage) {
      fetchThreadMessages();
      markMessageAsRead();
      // Set default reply title
      setTitle(`Re: ${selectedMessage.title || 'No title'}`);
    }
  }, [open, selectedMessage]);

  if (!selectedMessage) return null;

  const fetchThreadMessages = async () => {
    try {
      setIsLoading(true);
      const threadId = selectedMessage.thread_id || selectedMessage.id;
      
      if (!threadId) {
        console.error('No thread ID available');
        return;
      }

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

      if (error) throw error;
      setThreadMessages(data || []);
    } catch (error) {
      console.error('Error fetching thread messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markMessageAsRead = async () => {
    if (!selectedMessage.is_read) {
      try {
        const { error } = await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('id', selectedMessage.id);

        if (error) throw error;
        await queryClient.invalidateQueries({ queryKey: ['messages'] });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim() || !title.trim()) return;

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
          title: title,
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
      setTitle(`Re: ${selectedMessage.title || 'No title'}`);
      await queryClient.invalidateQueries({ queryKey: ['messages'] });
      await fetchThreadMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {threadMessages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="mt-4 space-y-4">
          <QuickReplies onSelect={setReply} />

          <div className="space-y-2">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-foreground">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter message title..."
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="reply" className="text-sm font-medium text-foreground">
                Message
              </label>
              <Textarea
                id="reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write your reply here..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <PaperclipIcon className="h-4 w-4 mr-2" />
                Attach files
              </Button>
              <Button
                onClick={handleSendReply}
                disabled={!reply.trim() || !title.trim() || isLoading}
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