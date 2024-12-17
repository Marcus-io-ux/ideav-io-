interface IdeaCardStatsProps {
  likes: number;
  comments: number;
}

export const IdeaCardStats = ({ likes, comments }: IdeaCardStatsProps) => {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span>{likes} likes</span>
      <span>{comments} comments</span>
    </div>
  );
};