import { CardContent, CardHeader } from "@/components/ui/card";
import { IdeaCardContainer } from "@/components/dashboard/idea-card/IdeaCardContainer";
import { IdeaCardHeader } from "@/components/dashboard/idea-card/IdeaCardHeader";
import { IdeaCardContent } from "@/components/dashboard/idea-card/IdeaCardContent";
import { IdeaCardActions } from "@/components/dashboard/idea-card/IdeaCardActions";
import { IdeaCardMetadata } from "@/components/dashboard/idea-card/IdeaCardMetadata";
import { IdeaCardTitle } from "@/components/dashboard/idea-card/IdeaCardTitle";
import { IdeaCardSelection } from "@/components/dashboard/idea-card/IdeaCardSelection";
import { IdeaCardFooter } from "@/components/dashboard/idea-card/IdeaCardFooter";
import { IdeaCardTags } from "@/components/dashboard/idea-card/IdeaCardTags";
import { IdeaCardComments } from "@/components/dashboard/idea-card/IdeaCardComments";
import { useIdeaCard } from "@/components/dashboard/idea-card/useIdeaCard";
import { useIdeaInteractions } from "@/components/dashboard/idea-card/useIdeaInteractions";

interface IdeaCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isFavorite?: boolean;
  isSelected?: boolean;
  isDraft?: boolean;
  tags?: string[];
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  userId?: string;
  sharedToCommunity?: boolean;
  hideInteractions?: boolean;
}

export const IdeaCard = ({ 
  id,
  title, 
  content, 
  createdAt, 
  isFavorite = false,
  isSelected = false,
  isDraft = false,
  tags = [],
  onSelect,
  onDelete,
  onToggleFavorite,
  userId,
  sharedToCommunity = false,
  hideInteractions = false
}: IdeaCardProps) => {
  const {
    isCurrentlyFavorite,
    isEditing,
    editedTitle,
    editedContent,
    editedTags,
    setIsEditing,
    setEditedTitle,
    setEditedContent,
    setEditedTags,
    handleToggleFavorite,
    handleSaveEdit,
    handleKeyDown,
  } = useIdeaCard({
    id,
    title,
    content,
    tags,
    isFavorite,
    isDraft,
    onToggleFavorite,
  });

  const {
    isLiked,
    likesCount,
    commentsCount,
    comments,
    isCommentsExpanded,
    handleLike,
    toggleComments,
    fetchComments,
  } = useIdeaInteractions(id, userId);

  const handleDelete = () => {
    onDelete?.(id);
  };

  const handleTagsChange = (value: string) => {
    const newTags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setEditedTags(newTags);
  };

  return (
    <IdeaCardContainer
      isSelected={isSelected}
      isDraft={isDraft}
      onClick={() => setIsEditing(true)}
      sharedToCommunity={sharedToCommunity}
      className="w-full"
    >
      <CardHeader>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <IdeaCardTitle
                title={title}
                isEditing={isEditing}
                editedTitle={editedTitle}
                onTitleChange={setEditedTitle}
                onKeyDown={handleKeyDown}
                isDraft={isDraft}
              />
            </div>
            <div className="flex items-center gap-2">
              <IdeaCardMetadata createdAt={createdAt} />
              <IdeaCardSelection
                isSelected={isSelected}
                onSelect={onSelect}
                id={id}
              />
            </div>
          </div>
          <IdeaCardTags 
            tags={isEditing ? editedTags : tags}
            isEditing={isEditing}
            onTagsChange={handleTagsChange}
          />
        </div>
      </CardHeader>
      <CardContent className="relative pb-16">
        <IdeaCardContent
          content={content}
          isEditing={isEditing}
          editedContent={editedContent}
          onContentChange={setEditedContent}
          onKeyDown={handleKeyDown}
        />
        
        <IdeaCardFooter
          isCurrentlyFavorite={isCurrentlyFavorite}
          onToggleFavorite={handleToggleFavorite}
          onDelete={onDelete ? handleDelete : undefined}
          userId={userId}
          sharedToCommunity={sharedToCommunity}
          isLiked={isLiked}
          likesCount={likesCount}
          onLike={handleLike}
          commentsCount={commentsCount}
          isCommentsExpanded={isCommentsExpanded}
          onToggleComments={toggleComments}
          hideInteractions={hideInteractions}
        />
        
        {isCommentsExpanded && !hideInteractions && (
          <IdeaCardComments
            ideaId={id}
            comments={comments}
            onCommentAdded={fetchComments}
          />
        )}
        
        {isEditing && (
          <IdeaCardActions
            isEditing={isEditing}
            onSave={handleSaveEdit}
            onCancel={() => {
              setIsEditing(false);
              setEditedTitle(title);
              setEditedContent(content);
              setEditedTags(tags);
            }}
          />
        )}
      </CardContent>
    </IdeaCardContainer>
  );
};