interface IdeaCardTagsProps {
  tags: string[];
}

export const IdeaCardTags = ({ tags }: IdeaCardTagsProps) => {
  if (!tags.length) return null;
  return null; // Remove tags display while keeping the component for future use
};