interface IdeaCardContentProps {
  content: string;
  isEditing: boolean;
  editedContent: string;
  onContentChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const IdeaCardContent = ({
  content,
  isEditing,
  editedContent,
  onContentChange,
  onKeyDown,
}: IdeaCardContentProps) => {
  if (isEditing) {
    return (
      <textarea
        value={editedContent}
        onChange={(e) => onContentChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full min-h-[100px] p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <p className="text-muted-foreground whitespace-pre-wrap">
      {content}
    </p>
  );
};