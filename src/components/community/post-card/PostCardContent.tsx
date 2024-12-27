import { Badge } from "@/components/ui/badge";

interface PostCardContentProps {
  post: any;
}

export const PostCardContent = ({ post }: PostCardContentProps) => {
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