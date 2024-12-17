import { IdeaCard } from "@/components/IdeaCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  priority?: "high" | "medium" | "low";
  isFavorite?: boolean;
  sharedToCommunity?: boolean;
}

interface IdeasListProps {
  ideas: Idea[];
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

export const IdeasList = ({
  ideas,
  showFavoritesOnly,
  onToggleFavorites,
}: IdeasListProps) => {
  const filteredIdeas = ideas.filter((idea) =>
    showFavoritesOnly ? idea.isFavorite : true
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Your Ideas</h3>
        <Button
          variant="ghost"
          onClick={onToggleFavorites}
          className={cn("text-sm", showFavoritesOnly && "text-primary")}
        >
          {showFavoritesOnly ? "Show All" : "Show Favorites"}
        </Button>
      </div>

      <Tabs defaultValue="recent" className="mb-8">
        <TabsList>
          <TabsTrigger value="recent">Recent Ideas</TabsTrigger>
          <TabsTrigger value="all">All Ideas</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <div className="grid gap-6">
            {filteredIdeas.slice(0, 5).map((idea) => (
              <IdeaCard key={idea.id} {...idea} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="all">
          <div className="grid gap-6">
            {filteredIdeas.map((idea) => (
              <IdeaCard key={idea.id} {...idea} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};