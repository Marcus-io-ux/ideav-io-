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
            avatar_url,
            user_id
          ),
          recipient:profiles!messages_recipient_id_fkey (
            username,
            avatar_url,
            user_id
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
        parent_id: msg.parent_id,
        thread_id: msg.thread_id,
        sender: {
          username: msg.sender?.username || "Unknown",
          avatar_url: msg.sender?.avatar_url,
          user_id: msg.sender?.user_id
        },
        recipient: {
          username: msg.recipient?.username || "Unknown",
          avatar_url: msg.recipient?.avatar_url,
          user_id: msg.recipient?.user_id
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