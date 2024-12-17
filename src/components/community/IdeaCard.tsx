import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IdeaCardHeader } from "./idea-card/IdeaCardHeader";
import { IdeaCardContent } from "./IdeaCardContent";
import { IdeaCardActions } from "./IdeaCardActions";
import { IdeaCardMetadata } from "./idea-card/IdeaCardMetadata";
import { IdeaCardStats } from "./idea-card/IdeaCardStats";

interface IdeaCardProps {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  tags: string[];
  category?: string;
  feedbackType?: string;
  createdAt: Date;
  isPinned?: boolean;
  emojiReactions?: Record<string, number>;
}

export const IdeaCard = ({
  id,
  title,
  content,
  author,
  likes,
  comments,
  tags,
  category,
  feedbackType,
  createdAt,
  isPinned,
  emojiReactions = {},
}: IdeaCardProps) => {
  return (
    <Card className="w-full transition-shadow duration-300 animate-fade-in hover:shadow-lg">
      <CardHeader className="space-y-2 pb-3">
        <IdeaCardHeader
          title={title}
          isPinned={isPinned}
          category={category}
          feedbackType={feedbackType}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <IdeaCardMetadata author={author} createdAt={createdAt} />
          <IdeaCardStats likes={likes} comments={comments} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <IdeaCardContent
          content={content}
          tags={tags}
          category={category}
          feedbackType={feedbackType}
          emojiReactions={emojiReactions}
        />
        
        <div className="pt-2 -mx-2 sm:mx-0">
          <IdeaCardActions
            postId={id}
            ownerId={author.id}
            isLiked={false}
            likeCount={likes}
            comments={comments}
            onLike={() => {}}
            onComment={() => {}}
            currentUserId={null}
            authorName={author.name}
            isFavorite={false}
            onFavoriteChange={() => {}}
          />
        </div>
      </CardContent>
    </Card>
  );
};