import { Button } from "@/components/ui/button";

interface StatsProps {
  totalIdeas: number;
  highPriorityCount: number;
}

export const Stats = ({ totalIdeas, highPriorityCount }: StatsProps) => {
  return (
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
  );
};