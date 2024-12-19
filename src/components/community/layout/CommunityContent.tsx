import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CommunityContentHeaderProps {
  title: string;
  unreadCount?: number;
  onSearch?: (query: string) => void;
}

export const CommunityContentHeader = ({ 
  title, 
  unreadCount, 
  onSearch 
}: CommunityContentHeaderProps) => {
  return (
    <div className="border-b p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <h1 className="text-xl font-semibold">{title}</h1>
      
      <div className="flex items-center gap-4 w-full sm:w-auto sm:max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search..."
            className="pl-9"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount && unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
};