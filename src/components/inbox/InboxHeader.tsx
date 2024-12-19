import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InboxHeaderProps {
  filter: string;
  onFilterChange: (filter: string) => void;
}

export function InboxHeader({ filter, onFilterChange }: InboxHeaderProps) {
  return (
    <div className="p-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search messages..." className="pl-9" />
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("unread")}
        >
          Unread
        </Button>
        <Button
          variant={filter === "requests" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("requests")}
        >
          Requests
        </Button>
      </div>
    </div>
  );
}