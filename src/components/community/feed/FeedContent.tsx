import { PostCard } from "../PostCard";

interface FeedContentProps {
  posts: any[];
  currentUserId: string | null;
  expandedPost: string | null;
  onToggleComments: (postId: string) => void;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export const FeedContent = ({
  posts,
  currentUserId,
  expandedPost,
  onToggleComments,
  onLike,
  onDelete,
}: FeedContentProps) => {
  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {posts?.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          isExpanded={expandedPost === post.id}
          onToggleComments={onToggleComments}
          onLike={onLike}
          onDelete={onDelete}
        />
      ))}
      {posts?.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <p className="text-muted-foreground">No posts found</p>
        </div>
      )}
    </div>
  );
};