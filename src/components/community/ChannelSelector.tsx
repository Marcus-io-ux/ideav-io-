import { Button } from "@/components/ui/button";
import { Database, Building, Cpu, Leaf, Palette, Smartphone } from "lucide-react";

interface ChannelSelectorProps {
  selectedChannel: string;
  onChannelSelect: (channel: string) => void;
}

export const ChannelSelector = ({ selectedChannel, onChannelSelect }: ChannelSelectorProps) => {
  const channels = [
    { id: "general", icon: Database, label: "General" },
    { id: "business", icon: Building, label: "Business" },
    { id: "tech", icon: Cpu, label: "Tech" },
    { id: "lifestyle", icon: Leaf, label: "Life" },
    { id: "design", icon: Palette, label: "Design" },
    { id: "apps", icon: Smartphone, label: "Apps" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
      {channels.map((channel) => {
        const Icon = channel.icon;
        return (
          <Button
            key={channel.id}
            variant={selectedChannel === channel.id ? "default" : "outline"}
            className="w-full h-8 px-2 text-sm flex items-center gap-1.5"
            onClick={() => onChannelSelect(channel.id)}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{channel.label}</span>
          </Button>
        );
      })}
    </div>
  );
};