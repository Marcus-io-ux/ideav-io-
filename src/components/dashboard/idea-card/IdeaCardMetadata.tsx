import { format } from "date-fns";

interface IdeaCardMetadataProps {
  createdAt: Date;
}

export const IdeaCardMetadata = ({ createdAt }: IdeaCardMetadataProps) => {
  return (
    <span className="text-sm text-muted-foreground">
      {format(createdAt, 'MMM d, yyyy')}
    </span>
  );
};