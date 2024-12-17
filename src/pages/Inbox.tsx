import { useEffect, useState } from "react";
import { ConversationList } from "@/components/inbox/ConversationList";
import { MessageThread } from "@/components/inbox/MessageThread";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  isRead?: boolean;
}

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    isRead: boolean;
  };
  isPinned?: boolean;
}

const Inbox = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setCurrentUser({ ...user, profile });
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchConversations = async () => {
      // First, get all messages for the current user
      const { data: messages, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(user_id, username, avatar_url),
          recipient:profiles!messages_recipient_id_fkey(user_id, username, avatar_url)
        `)
        .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
        return;
      }

      // Group messages by conversation
      const conversationsMap = new Map();
      messages?.forEach((message: any) => {
        const otherUser =
          message.sender.user_id === currentUser.id ? message.recipient : message.sender;
        const conversationId = `${Math.min(
          parseInt(message.sender_id),
          parseInt(message.recipient_id)
        )}-${Math.max(
          parseInt(message.sender_id),
          parseInt(message.recipient_id)
        )}`;

        if (!conversationsMap.has(conversationId)) {
          conversationsMap.set(conversationId, {
            id: conversationId,
            user: {
              id: otherUser.user_id,
              name: otherUser.username,
              avatar: otherUser.avatar_url,
            },
            lastMessage: {
              content: message.content,
              timestamp: new Date(message.created_at),
              isRead: message.is_read,
            },
          });
        }
      });

      setConversations(Array.from(conversationsMap.values()));
    };

    fetchConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, toast]);

  useEffect(() => {
    if (!currentUser || !activeConversation) return;

    const fetchMessages = async () => {
      const [user1Id, user2Id] = activeConversation.split("-");
      const { data: messages, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(user_id, username, avatar_url)
        `)
        .or(
          `and(sender_id.eq.${user1Id},recipient_id.eq.${user2Id}),and(sender_id.eq.${user2Id},recipient_id.eq.${user1Id})`
        )
        .order("created_at", { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
        return;
      }

      setMessages(
        messages?.map((message: any) => ({
          id: message.id,
          content: message.content,
          timestamp: new Date(message.created_at),
          sender: {
            id: message.sender.user_id,
            name: message.sender.username,
            avatar: message.sender.avatar_url,
          },
          isRead: message.is_read,
        })) || []
      );
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${activeConversation}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, activeConversation, toast]);

  const handleSendMessage = async (content: string) => {
    if (!currentUser || !activeConversation) return;

    const [user1Id, user2Id] = activeConversation.split("-");
    const recipientId =
      user1Id === currentUser.id.toString() ? user2Id : user1Id;

    const { error } = await supabase.from("messages").insert({
      sender_id: currentUser.id,
      recipient_id: recipientId,
      content,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Please sign in to view messages</p>
      </div>
    );
  }

  const activeConversationData = conversations.find(
    (conv) => conv.id === activeConversation
  );

  return (
    <div className="flex h-screen bg-background">
      <div className="w-80 flex-shrink-0">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversation || undefined}
          onConversationSelect={setActiveConversation}
        />
      </div>
      <div className="flex-1">
        {activeConversation && activeConversationData ? (
          <MessageThread
            currentUserId={currentUser.id}
            recipientId={activeConversationData.user.id}
            recipientName={activeConversationData.user.name}
            recipientAvatar={activeConversationData.user.avatar}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              Select a conversation to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;