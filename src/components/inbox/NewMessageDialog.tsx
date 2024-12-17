import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMessageDialog = ({ open, onOpenChange }: NewMessageDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", `%${query}%`)
      .limit(10);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to search users. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setUsers(data || []);
  };

  const handleSelectUser = async (userId: string, username: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send messages",
        variant: "destructive",
      });
      return;
    }

    // Check if a conversation already exists
    const { data: existingMessages } = await supabase
      .from("messages")
      .select()
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .limit(1);

    if (!existingMessages?.length) {
      // Create initial message
      const { error: messageError } = await supabase.from("messages").insert({
        sender_id: user.id,
        recipient_id: userId,
        content: "👋 Hello!",
      });

      if (messageError) {
        toast({
          title: "Error",
          description: "Failed to start conversation. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "Success",
      description: `Started a conversation with ${username}`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <ScrollArea className="h-[300px] pr-4">
          {users.map((user) => (
            <Button
              key={user.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleSelectUser(user.user_id, user.username)}
            >
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>
                  {user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{user.username}</span>
            </Button>
          ))}
          {searchQuery && !users.length && (
            <p className="text-center text-sm text-muted-foreground py-4">
              No users found
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};