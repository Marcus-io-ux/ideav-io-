import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ value, onSearch, placeholder = "Search your ideas...", className }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
      <Input
        type="text"
        value={value}
        placeholder={placeholder}
        className={`pl-10 w-full ${className}`}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};