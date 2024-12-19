import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/inbox";

export function useRealTimeMessages(userId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`recipient_id.eq.${userId},sender_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formattedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          senderId: msg.sender_id,
          recipientId: msg.recipient_id,
          content: msg.content,
          timestamp: new Date(msg.created_at).toLocaleString(),
          isRead: msg.is_read
        }));
        setMessages(formattedMessages);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${userId}`,
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return messages;
}