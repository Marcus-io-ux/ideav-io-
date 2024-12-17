import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pin, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { IdeaBadge } from "./badges/IdeaBadge";

interface IdeaCardHeaderProps {
  title: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  isPinned?: boolean;
  currentUserId: string | null;
  onDelete: () => void;
  category?: string;
  feedbackType?: string;
}

export const IdeaCardHeader = ({
  title,
  author,
  createdAt,
  isPinned,
  currentUserId,
  onDelete,
  category,
  feedbackType,
}: IdeaCardHeaderProps) => {
  return (
    <div className="flex flex-row items-start justify-between space-y-0">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={author.avatar} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-semibold">{title}</h3>
            {isPinned && <Pin className="h-4 w-4 text-primary" />}
            {category && (
              <IdeaBadge type="category" label={category} />
            )}
            {feedbackType && (
              <IdeaBadge type="feedback" label={feedbackType} />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600">{author.name}</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600">
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {currentUserId === author.id && (
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive/90"
            onClick={onDelete}
            title="Delete post"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};