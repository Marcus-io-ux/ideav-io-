import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface StatsProps {
  totalIdeas: number;
  favoritesCount: number;
  followersCount: number;
}

export const Stats = ({ totalIdeas, favoritesCount, followersCount }: StatsProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-600 mb-4">Quick Stats</h3>
      <div className="flex justify-between items-center space-x-4">
        <div>
          <p className="text-2xl font-bold">{totalIdeas}</p>
          <p className="text-sm text-gray-500">Total Ideas</p>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-2xl font-bold">{favoritesCount}</p>
            <p className="text-sm text-gray-500">Favorites</p>
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold">{followersCount}</p>
          <p className="text-sm text-gray-500">Followers</p>
        </div>
      </div>
    </div>
  );
};