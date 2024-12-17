import { format } from "date-fns";

interface IdeaCardMetadataProps {
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
}

export const IdeaCardMetadata = ({ author, createdAt }: IdeaCardMetadataProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>{author.name}</span>
      <span>•</span>
      <span>{format(createdAt, 'MMM d, yyyy')}</span>
    </div>
  );
};