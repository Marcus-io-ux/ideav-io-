import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

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
  const filters = [
    { label: "Unread", value: "unread" },
    { label: "Has Attachments", value: "has_attachments" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
        <Button
          onClick={onNewMessage}
          className="w-full md:w-auto"
        >
          New Message
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search messages..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {filters.map((filter) => (
              <DropdownMenuCheckboxItem
                key={filter.value}
                checked={activeFilters.includes(filter.value)}
                onCheckedChange={(checked) => {
                  const newFilters = checked
                    ? [...activeFilters, filter.value]
                    : activeFilters.filter((f) => f !== filter.value);
                  onFilterChange(newFilters);
                }}
              >
                {filter.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};