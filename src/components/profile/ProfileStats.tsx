import { Button } from "@/components/ui/button";
import { useProfileStats } from "@/hooks/use-profile-stats";
import { useState } from "react";
import { FollowersDialog } from "./FollowersDialog";

interface ProfileStatsProps {
  userId: string;
}

export function ProfileStats({ userId }: ProfileStatsProps) {
  const { data: stats } = useProfileStats(userId);
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    type: "followers" | "following";
  }>({
    isOpen: false,
    type: "followers",
  });

  return (
    <div className="flex gap-4 items-center">
      <Button
        variant="ghost"
        onClick={() =>
          setDialogConfig({ isOpen: true, type: "followers" })
        }
      >
        <span className="font-bold">{stats?.followers || 0}</span>
        <span className="ml-1">Followers</span>
      </Button>
      <div>
        <span className="font-bold">{stats?.ideas || 0}</span>
        <span className="ml-1">Ideas</span>
      </div>
      <div>
        <span className="font-bold">{stats?.collaborations || 0}</span>
        <span className="ml-1">Collaborations</span>
      </div>

      <FollowersDialog
        isOpen={dialogConfig.isOpen}
        onClose={() => setDialogConfig({ ...dialogConfig, isOpen: false })}
        userId={userId}
        type={dialogConfig.type}
      />
    </div>
  );
}