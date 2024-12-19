import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IdeaCardActions } from "./IdeaCardActions";
import { formatDistanceToNow } from "date-fns";
import { Author } from "@/types/author";

interface IdeaCardProps {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  userId?: string;
  isPinned?: boolean;
  category?: string;
  feedbackType?: string;
  emojiReactions?: Record<string, number>;
  onLike?: () => void;
  onComment?: () => void;
}

export const IdeaCard = ({
  id,
  title,
  content,
  author,
  createdAt,
  likes,
  comments,
  isLiked = false,
  userId,
  isPinned,
  category,
  feedbackType,
  emojiReactions,
  onLike,
  onComment,
}: IdeaCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={author.avatar} />
          <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold">{author.name}</p>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{content}</p>
        <div className="border-t pt-4">
          <IdeaCardActions
            postId={id}
            ownerId={userId || ''}
            isLiked={isLiked}
            likeCount={likes}
            comments={comments}
            onLike={onLike || (() => {})}
            onComment={onComment || (() => {})}
            currentUserId={userId || null}
            authorName={author.name}
          />
        </div>
      </CardContent>
    </Card>
  );
};