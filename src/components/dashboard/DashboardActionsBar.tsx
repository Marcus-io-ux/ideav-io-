import { Button } from "@/components/ui/button";
import { Filter, Grid, List, Search, Star } from "lucide-react";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DashboardActionsBarProps {
  totalIdeas: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  handleIdeaSubmit: () => Promise<void>;
}

export const DashboardActionsBar = ({
  totalIdeas,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  showFavorites,
  setShowFavorites,
  handleIdeaSubmit,
}: DashboardActionsBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="text-muted-foreground">
        You have {totalIdeas} idea{totalIdeas !== 1 ? 's' : ''} stored
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          className="hidden md:flex h-10 w-10"
        >
          {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Search className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <Input
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </PopoverContent>
        </Popover>
        <Button
          variant={showFavorites ? "default" : "outline"}
          size="icon"
          className="h-10 w-10"
          onClick={() => setShowFavorites(!showFavorites)}
        >
          <Star className={cn("h-4 w-4", showFavorites && "fill-current")} />
        </Button>
        <AddIdeaDialog onIdeaSubmit={handleIdeaSubmit} />
      </div>
    </div>
  );
};