import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Megaphone, Lightbulb, MessageSquare, Handshake, MessagesSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface Channel {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
}

const channels: Channel[] = [
  { 
    id: "announcements", 
    name: "Announcements", 
    icon: <Megaphone className="h-4 w-4" />,
    path: "/community/announcements"
  },
  { 
    id: "showcase", 
    name: "Idea Showcase", 
    icon: <Lightbulb className="h-4 w-4" />,
    path: "/community/showcase"
  },
  { 
    id: "feedback", 
    name: "Feedback Requests", 
    icon: <MessageSquare className="h-4 w-4" />,
    path: "/community/feedback"
  },
  { 
    id: "collaboration", 
    name: "Collaboration Requests", 
    icon: <Handshake className="h-4 w-4" />,
    path: "/community/collaboration"
  },
  { 
    id: "general", 
    name: "General Discussion", 
    icon: <MessagesSquare className="h-4 w-4" />,
    path: "/community/general"
  },
];

interface CommunityChannelsProps {
  onChannelSelect?: () => void;
}

export const CommunityChannels = ({ onChannelSelect }: CommunityChannelsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChannelClick = (path: string) => {
    navigate(path);
    onChannelSelect?.();
  };

  return (
    <ScrollArea className="h-full py-6 px-4">
      <div className="mb-4">
        <h2 className="px-2 mb-2 text-lg font-semibold tracking-tight">
          Community
        </h2>
      </div>
      <div className="space-y-1">
        {channels.map((channel) => (
          <Button
            key={channel.id}
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start gap-2",
              location.pathname === channel.path && 
              "bg-accent text-accent-foreground"
            )}
            onClick={() => handleChannelClick(channel.path)}
          >
            {channel.icon}
            <span>{channel.name}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};