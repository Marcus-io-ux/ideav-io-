import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare, Lightbulb, Building, Heart, Palette, Smartphone, MessageCircleQuestion, Handshake } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface Channel {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
}

const channels: Channel[] = [
  { 
    id: "general-ideas", 
    name: "General Ideas", 
    icon: <MessageSquare className="h-4 w-4" />,
    path: "/community/general-ideas"
  },
  { 
    id: "startups-business", 
    name: "Startups & Business", 
    icon: <Building className="h-4 w-4" />,
    path: "/community/startups-business"
  },
  { 
    id: "tech-innovation", 
    name: "Tech & Innovation", 
    icon: <Lightbulb className="h-4 w-4" />,
    path: "/community/tech-innovation"
  },
  { 
    id: "lifestyle-wellness", 
    name: "Lifestyle & Wellness", 
    icon: <Heart className="h-4 w-4" />,
    path: "/community/lifestyle-wellness"
  },
  { 
    id: "design-creativity", 
    name: "Design & Creativity", 
    icon: <Palette className="h-4 w-4" />,
    path: "/community/design-creativity"
  },
  { 
    id: "apps-tech-tools", 
    name: "Apps & Tech Tools", 
    icon: <Smartphone className="h-4 w-4" />,
    path: "/community/apps-tech-tools"
  },
  { 
    id: "user-feedback", 
    name: "User Feedback", 
    icon: <MessageCircleQuestion className="h-4 w-4" />,
    path: "/community/user-feedback"
  },
  { 
    id: "collaboration", 
    name: "Collaboration Corner", 
    icon: <Handshake className="h-4 w-4" />,
    path: "/community/collaboration"
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