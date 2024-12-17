import { MessageSquare, Users, Star, MessageCircleQuestion, Handshake, Lightbulb, Laptop, Heart, Palette, Smartphone } from "lucide-react";
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
  { id: "general-ideas", name: "General Ideas", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "startups-business", name: "Startups & Business Ideas", icon: <Lightbulb className="h-4 w-4" /> },
  { id: "tech-innovation", name: "Tech & Innovation", icon: <Laptop className="h-4 w-4" /> },
  { id: "lifestyle-wellness", name: "Lifestyle & Wellness", icon: <Heart className="h-4 w-4" /> },
  { id: "design-creativity", name: "Design & Creativity", icon: <Palette className="h-4 w-4" /> },
  { id: "apps-tech-tools", name: "Apps & Tech Tools", icon: <Smartphone className="h-4 w-4" /> },
  { id: "user-feedback", name: "User Feedback", icon: <MessageCircleQuestion className="h-4 w-4" /> },
  { id: "collaboration", name: "Collaboration Corner", icon: <Handshake className="h-4 w-4" /> },
  { id: "favorites", name: "Favorites", icon: <Star className="h-4 w-4" /> },
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