import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  username: string;
  avatar_url?: string;
  status: "online" | "offline";
}

export const CommunityUserPanel = () => {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const { data: presenceData } = await supabase
        .from("user_presence")
        .select(`
          user_id,
          status,
          profiles!user_presence_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq("status", "online");

      if (presenceData) {
        const users = presenceData.map((presence) => ({
          id: presence.user_id || "",
          username: presence.profiles?.username || "Anonymous",
          avatar_url: presence.profiles?.avatar_url,
          status: presence.status as "online" | "offline",
        }));
        setActiveUsers(users);
      }
    };

    fetchActiveUsers();

    const channel = supabase
      .channel("presence_updates")
      .on("postgres_changes", 
        { event: "*", schema: "public", table: "user_presence" },
        () => {
          fetchActiveUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ScrollArea className="h-full py-6 px-4">
      <div className="mb-4">
        <h2 className="px-2 mb-2 text-lg font-semibold tracking-tight">
          Active Users
        </h2>
      </div>
      <div className="space-y-2">
        {activeUsers.map((user) => (
          <div key={user.id} className="flex items-center space-x-2 px-2 py-1.5">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
            </div>
            <span className="text-sm font-medium">{user.username}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};