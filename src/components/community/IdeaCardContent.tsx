import { IdeaBadge } from "./badges/IdeaBadge";

interface IdeaCardContentProps {
  content: string;
  tags: string[];
  category?: string;
  feedbackType?: string;
  emojiReactions?: Record<string, number>;
}

export const IdeaCardContent = ({
  content,
  tags,
  category,
  feedbackType,
  emojiReactions = {},
}: IdeaCardContentProps) => {
  return (
    <>
      <p className="text-gray-600 mb-4 break-words whitespace-pre-wrap">{content}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {category && (
          <IdeaBadge type="category" label={category} />
        )}
        {feedbackType && (
          <IdeaBadge type="feedback" label={feedbackType} />
        )}
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-sm break-words"
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