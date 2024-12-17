import { Pin } from "lucide-react";
import { IdeaBadge } from "../badges/IdeaBadge";

interface IdeaCardHeaderProps {
  title: string;
  isPinned?: boolean;
  category?: string;
  feedbackType?: string;
}

export const IdeaCardHeader = ({
  title,
  isPinned,
  category,
  feedbackType,
}: IdeaCardHeaderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2 flex-wrap">
        <h3 className="text-xl font-semibold break-words">{title}</h3>
        {isPinned && <Pin className="h-4 w-4 text-primary flex-shrink-0" />}
      </div>
      <div className="flex flex-wrap gap-2">
        {category && <IdeaBadge type="category" label={category} />}
        {feedbackType && <IdeaBadge type="feedback" label={feedbackType} />}
      </div>
    </div>
  );
};