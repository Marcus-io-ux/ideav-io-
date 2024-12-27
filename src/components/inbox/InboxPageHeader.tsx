import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface InboxPageHeaderProps {
  onSearch: (query: string) => void;
}

export const InboxPageHeader = ({
  onSearch,
}: InboxPageHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
      </div>

      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search messages..."
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
    </div>
  );
};