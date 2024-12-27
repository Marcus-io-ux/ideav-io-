import { CreatePost } from "./CreatePost";
import { FeedFilters } from "./feed/FeedFilters";
import { FeedContent } from "./feed/FeedContent";
import { useCommunityFeed } from "./feed/useCommunityFeed";

export const CommunityFeed = () => {
  const {
    posts,
    isLoading,
    currentUserId,
    expandedPost,
    selectedChannel,
    showOnlyMyPosts,
    setShowOnlyMyPosts,
    setSelectedChannel,
    setExpandedPost,
    likePost,
    deletePost,
  } = useCommunityFeed();

  const toggleComments = (postId: string) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  return (
    <div className="space-y-6">
      <FeedFilters
        selectedChannel={selectedChannel}
        showOnlyMyPosts={showOnlyMyPosts}
        onChannelSelect={setSelectedChannel}
        onToggleMyPosts={setShowOnlyMyPosts}
      />

      <CreatePost selectedChannel={selectedChannel} />

      {isLoading ? (
        <div>Loading posts...</div>
      ) : (
        <FeedContent
          posts={posts || []}
          currentUserId={currentUserId}
          expandedPost={expandedPost}
          onToggleComments={toggleComments}
          onLike={(postId) => likePost.mutate(postId)}
          onDelete={(postId) => deletePost.mutate(postId)}
        />
      )}
    </div>
  );
};