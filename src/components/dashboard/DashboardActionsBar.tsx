import { SearchBar } from "@/components/SearchBar";
import { AddIdeaDialog } from "@/components/dashboard/AddIdeaDialog";
import { Button } from "@/components/ui/button";
import { Grid, List, Star, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardActionsBarProps {
  totalIdeas: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  showDrafts: boolean;
  setShowDrafts: (show: boolean) => void;
  handleIdeaSubmit: () => void;
}

export const DashboardActionsBar = ({
  totalIdeas,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  showFavorites,
  setShowFavorites,
  showDrafts,
  setShowDrafts,
  handleIdeaSubmit,
}: DashboardActionsBarProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto flex-1">
          <SearchBar 
            value={searchQuery}
            onSearch={setSearchQuery}
            placeholder="Search ideas..."
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <AddIdeaDialog onIdeaSubmit={handleIdeaSubmit} />
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-9 w-9"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-9 w-9"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={showFavorites ? "default" : "outline"}
              size="icon"
              onClick={() => setShowFavorites(!showFavorites)}
              className={cn(
                "h-9 w-9",
                showFavorites && "text-primary"
              )}
              title={showFavorites ? "Show All Ideas" : "Show Favorites"}
            >
              <Star className={cn("h-4 w-4", showFavorites && "fill-current")} />
            </Button>
            <Button
              variant={showDrafts ? "default" : "outline"}
              size="icon"
              onClick={() => setShowDrafts(!showDrafts)}
              className="h-9 w-9"
              title={showDrafts ? "Show Published" : "Show Drafts"}
            >
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-sm text-muted-foreground ml-auto">
          {totalIdeas} {totalIdeas === 1 ? 'idea' : 'ideas'}
        </span>
      </div>
    </div>
  );
};