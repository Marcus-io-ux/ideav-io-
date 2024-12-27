import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types/inbox";
import { ThreadHeader } from "./thread/ThreadHeader";
import { ThreadMessages } from "./thread/ThreadMessages";
import { ThreadReplyForm } from "./thread/ThreadReplyForm";

interface MessageThreadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMessage: Message | null;
}

export const MessageThread = ({ open, onOpenChange, selectedMessage }: MessageThreadProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && selectedMessage) {
      fetchThreadMessages();
      markMessageAsRead();
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

  const handleSendReply = async (reply: string, attachedFile: File | null) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const threadId = selectedMessage.thread_id || selectedMessage.id;

      let fileUrl = null;
      if (attachedFile) {
        const fileExt = attachedFile.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('message-attachments')
          .upload(filePath, attachedFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('message-attachments')
          .getPublicUrl(filePath);
          
        fileUrl = publicUrl;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedMessage.sender.user_id,
          content: reply,
          parent_id: selectedMessage.id,
          thread_id: threadId,
          is_read: false,
          title: selectedMessage.title,
          attachment_url: fileUrl
        });

      if (error) throw error;

      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully",
      });

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
        <ThreadHeader message={selectedMessage} />
        <ThreadMessages messages={threadMessages} isLoading={isLoading} />
        <ThreadReplyForm onSendReply={handleSendReply} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
};