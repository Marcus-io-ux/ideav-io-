import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChannelSelector } from "../ChannelSelector";

interface FeedFiltersProps {
  selectedChannel: string;
  showOnlyMyPosts: boolean;
  onChannelSelect: (channel: string) => void;
  onToggleMyPosts: (show: boolean) => void;
}

export const FeedFilters = ({
  selectedChannel,
  showOnlyMyPosts,
  onChannelSelect,
  onToggleMyPosts,
}: FeedFiltersProps) => {
  return (
    <div className="space-y-6">
      <ChannelSelector 
        selectedChannel={selectedChannel}
        onChannelSelect={onChannelSelect}
      />
      
      <div className="flex items-center space-x-2">
        <Switch
          id="show-my-posts"
          checked={showOnlyMyPosts}
          onCheckedChange={onToggleMyPosts}
        />
        <Label htmlFor="show-my-posts">Show only my shared ideas</Label>
      </div>
    </div>
  );
};