import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/inbox";

export function useRealTimeMessages(userId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*, sender:profiles!sender_id(*), recipient:profiles!recipient_id(*)")
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages
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
        (payload) => {
          console.log("Real-time message update:", payload);
          fetchMessages(); // Refetch messages when there's an update
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return messages;
}