import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";

interface StatsProps {
  totalIdeas: number;
  highPriorityCount: number;
  followersCount: number;
  followingCount: number;
}

export const Stats = ({ totalIdeas, highPriorityCount, followersCount, followingCount }: StatsProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-600 mb-4">Quick Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold">{totalIdeas}</p>
          <p className="text-sm text-gray-500">Total Ideas</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{highPriorityCount}</p>
          <p className="text-sm text-gray-500">High Priority</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-2xl font-bold">{followersCount}</p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-2xl font-bold">{followingCount}</p>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
};