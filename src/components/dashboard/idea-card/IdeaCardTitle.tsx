interface IdeaCardTitleProps {
  title: string;
  isEditing: boolean;
  editedTitle: string;
  onTitleChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isDraft?: boolean;
}

export const IdeaCardTitle = ({
  title,
  isEditing,
  editedTitle,
  onTitleChange,
  onKeyDown,
  isDraft = false,
}: IdeaCardTitleProps) => {
  if (isEditing) {
    return (
      <div className="space-y-2 w-full">
        <label htmlFor="title" className="text-sm font-medium text-muted-foreground">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={editedTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  return (
    <h3 className="text-lg font-semibold">
      {isDraft && <span className="text-muted-foreground">[Draft] </span>}
      {title}
    </h3>
  );
};