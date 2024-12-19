import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/inbox";

export function useRealTimeMessages(userId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            username,
            avatar_url
          ),
          recipient:profiles!messages_recipient_id_fkey (
            username,
            avatar_url
          )
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      const formattedMessages: Message[] = data.map(msg => ({
        id: msg.id,
        sender_id: msg.sender_id,
        recipient_id: msg.recipient_id,
        content: msg.content,
        created_at: msg.created_at,
        is_read: msg.is_read,
        sender: {
          username: msg.sender?.username || "Unknown",
          avatar_url: msg.sender?.avatar_url
        },
        recipient: {
          username: msg.recipient?.username || "Unknown",
          avatar_url: msg.recipient?.avatar_url
        }
      }));

      setMessages(formattedMessages);
    };

    fetchMessages();

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${userId},recipient_id=eq.${userId}`,
        },
        () => {
          console.log("Real-time message update received");
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