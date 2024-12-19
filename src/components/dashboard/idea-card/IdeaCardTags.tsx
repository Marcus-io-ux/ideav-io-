interface IdeaCardTagsProps {
  tags: string[];
}

export const IdeaCardTags = ({ tags }: IdeaCardTagsProps) => {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-sm"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};