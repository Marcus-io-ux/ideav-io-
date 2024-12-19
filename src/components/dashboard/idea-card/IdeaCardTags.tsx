interface IdeaCardTagsProps {
  tags: string[];
  isEditing: boolean;
  onTagsChange: (value: string) => void;
}

export const IdeaCardTags = ({
  tags,
  isEditing,
  onTagsChange,
}: IdeaCardTagsProps) => {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium text-muted-foreground">
          Tags
        </label>
        <input
          id="tags"
          type="text"
          value={tags.join(', ')}
          onChange={(e) => onTagsChange(e.target.value)}
          placeholder="Enter tags separated by commas"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};