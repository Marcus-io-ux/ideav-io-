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
    <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto pb-6">
      <FeedFilters
        selectedChannel={selectedChannel}
        onChannelSelect={setSelectedChannel}
      />

      <CreatePost 
        selectedChannel={selectedChannel}
        showOnlyMyPosts={showOnlyMyPosts}
        onToggleMyPosts={setShowOnlyMyPosts}
      />

      {isLoading ? (
        <div className="text-center py-8">Loading posts...</div>
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