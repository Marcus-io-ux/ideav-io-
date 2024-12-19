import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
      <Input
        type="text"
        placeholder="Search your ideas..."
        className="pl-10 w-full"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};