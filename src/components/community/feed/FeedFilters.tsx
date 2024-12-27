import { ChannelSelector } from "../ChannelSelector";

interface FeedFiltersProps {
  selectedChannel: string;
  onChannelSelect: (channel: string) => void;
}

export const FeedFilters = ({
  selectedChannel,
  onChannelSelect,
}: FeedFiltersProps) => {
  return (
    <div className="space-y-6">
      <ChannelSelector 
        selectedChannel={selectedChannel}
        onChannelSelect={onChannelSelect}
      />
    </div>
  );
};