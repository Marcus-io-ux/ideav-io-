import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PostCardContentProps {
  post: any;
  isEditing: boolean;
  editedTitle: string;
  editedContent: string;
  editedTags: string[];
  setEditedTitle: (value: string) => void;
  setEditedContent: (value: string) => void;
  handleTagsChange: (value: string) => void;
  handleSaveEdit: () => void;
  setIsEditing: (value: boolean) => void;
}

export const PostCardContent = ({
  post,
  isEditing,
  editedTitle,
  editedContent,
  editedTags,
  setEditedTitle,
  setEditedContent,
  handleTagsChange,
  handleSaveEdit,
  setIsEditing,
}: PostCardContentProps) => {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="mb-2"
            placeholder="Title"
          />
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px]"
            placeholder="Content"
          />
        </div>
        <div>
          <Input
            value={editedTags.join(', ')}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="Tags (comma-separated)"
            className="mb-2"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveEdit}>Save</Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsEditing(false);
              setEditedTitle(post.title);
              setEditedContent(post.content);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
      <p className="mb-4">{post.content}</p>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag: string, index: number) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="px-2 md:px-3 py-1 text-xs md:text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </>
  );
};