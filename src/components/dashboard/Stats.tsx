import { Button } from "@/components/ui/button";

interface StatsProps {
  totalIdeas: number;
  highPriorityCount: number;
  popularTags: string[];
  onTagClick: (tag: string) => void;
}

export const Stats = ({ totalIdeas, highPriorityCount, popularTags, onTagClick }: StatsProps) => {
  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Quick Stats</h3>
        <div className="flex justify-between">
          <div>
            <p className="text-2xl font-bold">{totalIdeas}</p>
            <p className="text-sm text-gray-500">Total Ideas</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{highPriorityCount}</p>
            <p className="text-sm text-gray-500">High Priority</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              className="hover:bg-primary hover:text-white"
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};