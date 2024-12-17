import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
}

interface IdeaCommentsProps {
  comments: Comment[];
  newComment: string;
  onNewCommentChange: (value: string) => void;
  onAddComment: () => void;
}

export const IdeaComments = ({
  comments,
  newComment,
  onNewCommentChange,
  onAddComment,
}: IdeaCommentsProps) => {
  return (
    <div className="mt-4 space-y-4">
      <div className="max-h-48 overflow-y-auto space-y-2">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{comment.author.name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm mt-1 ml-8">{comment.content}</p>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => onNewCommentChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onAddComment()}
          className="flex-1"
        />
        <Button onClick={onAddComment} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};