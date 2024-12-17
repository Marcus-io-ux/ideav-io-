import { Stats } from "@/components/dashboard/Stats";
import { IdeasList } from "@/components/dashboard/IdeasList";

interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  isFavorite?: boolean;
  sharedToCommunity?: boolean;
  deleted?: boolean;
}

interface IdeasSectionProps {
  ideas: Idea[];
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  onEditIdea: (id: string) => void;
  onDeleteIdeas: (ids: string[]) => void;
  onRestoreIdeas: (ids: string[]) => void;
}

export const IdeasSection = ({
  ideas,
  showFavoritesOnly,
  onToggleFavorites,
  onEditIdea,
  onDeleteIdeas,
  onRestoreIdeas,
}: IdeasSectionProps) => {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Your Ideas</h3>
      <Stats
        totalIdeas={ideas.filter(i => !i.deleted).length}
        favoritesCount={ideas.filter((idea) => idea.isFavorite).length}
      />
      <div className="mt-8">
        <IdeasList
          ideas={ideas}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={onToggleFavorites}
          onEditIdea={onEditIdea}
          onDeleteIdeas={onDeleteIdeas}
          onRestoreIdeas={onRestoreIdeas}
        />
      </div>
    </div>
  );
};