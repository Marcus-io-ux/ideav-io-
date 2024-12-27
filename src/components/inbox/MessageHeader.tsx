import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

interface MessageHeaderProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: string[]) => void;
  activeFilters: string[];
}

export const MessageHeader = ({ onSearch, onFilterChange, activeFilters }: MessageHeaderProps) => {
  const filters = [
    { label: "Unread", value: "unread" },
    { label: "Starred", value: "starred" },
    { label: "Has Attachments", value: "has_attachments" },
    { label: "Collaborations", value: "collaborations" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Your Inbox</h1>
        <p className="text-muted-foreground mt-2">
          Manage your conversations and collaboration requests
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search messages, users, or keywords..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
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