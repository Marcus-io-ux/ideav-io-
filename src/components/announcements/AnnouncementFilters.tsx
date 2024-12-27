import { Button } from "@/components/ui/button";
import { Settings, Users, Lightbulb } from "lucide-react";

interface AnnouncementFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: any) => void;
}

export const AnnouncementFilters = ({ selectedCategory, onCategoryChange }: AnnouncementFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === "all" ? "default" : "outline"}
        onClick={() => onCategoryChange("all")}
      >
        All Updates
      </Button>
      <Button
        variant={selectedCategory === "platform_update" ? "default" : "outline"}
        onClick={() => onCategoryChange("platform_update")}
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Platform Updates
      </Button>
      <Button
        variant={selectedCategory === "community_news" ? "default" : "outline"}
        onClick={() => onCategoryChange("community_news")}
        className="flex items-center gap-2"
      >
        <Users className="h-4 w-4" />
        Community News
      </Button>
      <Button
        variant={selectedCategory === "featured_idea" ? "default" : "outline"}
        onClick={() => onCategoryChange("featured_idea")}
        className="flex items-center gap-2"
      >
        <Lightbulb className="h-4 w-4" />
        Featured Ideas
      </Button>
    </div>
  );
};