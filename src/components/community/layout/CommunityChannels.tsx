import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare, Building, Laptop, Heart, Palette, Smartphone } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface Channel {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
}

const channels: Channel[] = [
  { 
    id: "general-ideas", 
    name: "General Ideas", 
    path: "/community/general-ideas",
    icon: <MessageSquare className="h-4 w-4" />
  },
  { 
    id: "startups-business", 
    name: "Startups & Business", 
    path: "/community/startups-business",
    icon: <Building className="h-4 w-4" />
  },
  { 
    id: "tech-innovation", 
    name: "Tech & Innovation", 
    path: "/community/tech-innovation",
    icon: <Laptop className="h-4 w-4" />
  },
  { 
    id: "lifestyle-wellness", 
    name: "Lifestyle & Wellness", 
    path: "/community/lifestyle-wellness",
    icon: <Heart className="h-4 w-4" />
  },
  { 
    id: "design-creativity", 
    name: "Design & Creativity", 
    path: "/community/design-creativity",
    icon: <Palette className="h-4 w-4" />
  },
  { 
    id: "apps-tech-tools", 
    name: "Apps & Tech Tools", 
    path: "/community/apps-tech-tools",
    icon: <Smartphone className="h-4 w-4" />
  },
];

interface ChannelListProps {
  onChannelSelect?: () => void;
}

export const CommunityChannels = ({ onChannelSelect }: ChannelListProps) => {
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
          Channels
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