interface IdeaCardContentProps {
  content: string;
  tags: string[];
  emojiReactions?: Record<string, number>;
}

export const IdeaCardContent = ({
  content,
  tags,
  emojiReactions = {},
}: IdeaCardContentProps) => {
  return (
    <>
      <p className="text-gray-600 mb-4">{content}</p>
      
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

      {Object.keys(emojiReactions).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(emojiReactions).map(([emoji, count]) => (
            <span
              key={emoji}
              className="inline-flex items-center gap-1 px-2 py-1 bg-accent rounded-full text-sm"
            >
              {emoji} <span className="text-xs">{count}</span>
            </span>
          ))}
        </div>
      )}
    </>
  );
};