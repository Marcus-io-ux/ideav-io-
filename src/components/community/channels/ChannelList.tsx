import { MessageSquare, Megaphone, Users, Bookmark, MessageCircleQuestion, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Channel {
  id: string;
  name: string;
  icon: React.ReactNode;
  unreadCount?: number;
}

const channels: Channel[] = [
  { id: "announcements", name: "Announcements", icon: <Megaphone className="h-4 w-4" /> },
  { id: "general", name: "General Discussion", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "shared-ideas", name: "Shared Ideas", icon: <Users className="h-4 w-4" /> },
  { id: "feedback", name: "Feedback Requests", icon: <MessageCircleQuestion className="h-4 w-4" /> },
  { id: "collaboration", name: "Collaboration Corner", icon: <Handshake className="h-4 w-4" /> },
  { id: "favorites", name: "Favorites", icon: <Bookmark className="h-4 w-4" /> },
];

interface ChannelListProps {
  activeChannel: string;
  onChannelSelect: (channelId: string) => void;
}

export const ChannelList = ({ activeChannel, onChannelSelect }: ChannelListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-4 p-4">
        <div className="py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Channels</h2>
          <div className="space-y-1">
            {channels.map((channel) => (
              <Button
                key={channel.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start",
                  activeChannel === channel.id && "bg-accent text-accent-foreground"
                )}
                onClick={() => onChannelSelect(channel.id)}
              >
                {channel.icon}
                <span className="ml-2">{channel.name}</span>
                {channel.unreadCount && (
                  <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                    {channel.unreadCount}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
        <Separator />
      </div>
    </ScrollArea>
  );
};