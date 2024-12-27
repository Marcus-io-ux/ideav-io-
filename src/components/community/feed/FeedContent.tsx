import { PostCard } from "../PostCard";

interface FeedContentProps {
  posts: any[];
  currentUserId: string | null;
  expandedPost: string | null;
  onToggleComments: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export const FeedContent = ({
  posts,
  currentUserId,
  expandedPost,
  onToggleComments,
  onDelete,
}: FeedContentProps) => {
  return (
    <div className="space-y-6">
      {posts?.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          isExpanded={expandedPost === post.id}
          onToggleComments={onToggleComments}
          onDelete={onDelete}
        />
      ))}
      {posts?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found</p>
        </div>
      )}
    </div>
  );
};