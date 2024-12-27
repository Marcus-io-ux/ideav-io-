import { Button } from "@/components/ui/button";
import { MessageHeader } from "./MessageHeader";

interface InboxPageHeaderProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: string[]) => void;
  activeFilters: string[];
  onNewMessage: () => void;
}

export const InboxPageHeader = ({
  onSearch,
  onFilterChange,
  activeFilters,
  onNewMessage,
}: InboxPageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <MessageHeader
        onSearch={onSearch}
        onFilterChange={onFilterChange}
        activeFilters={activeFilters}
      />
      <Button
        onClick={onNewMessage}
        className="w-full md:w-auto gap-2"
      >
        New Message
      </Button>
    </div>
  );
};