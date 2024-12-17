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
    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-primary/10">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick Stats</h3>
      <div className="flex justify-between items-center space-x-4">
        <div>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-primary">{totalIdeas}</p>
          <p className="text-sm text-muted-foreground">Total Ideas</p>
        </div>
        <div>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-primary">{highPriorityCount}</p>
          <p className="text-sm text-muted-foreground">High Priority</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <div>
            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-primary">{followersCount}</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-primary" />
          <div>
            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-primary">{followingCount}</p>
            <p className="text-sm text-muted-foreground">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
};