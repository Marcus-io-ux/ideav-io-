import { CommunityHero } from "@/components/community/CommunityHero";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { CommunityFooter } from "@/components/community/CommunityFooter";

const Community = () => {
  const scrollToFeed = () => {
    const feedElement = document.getElementById('community-feed');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CommunityHero onPostClick={scrollToFeed} onExploreClick={scrollToFeed} />
      
      <main className="max-w-3xl mx-auto" id="community-feed">
        <CommunityFeed />
      </main>

      <section className="text-center mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-4">Start Sharing Your Ideas Today!</h2>
        <div className="flex justify-center gap-4">
          <button className="text-lg" onClick={scrollToFeed}>Join the Conversation</button>
          <button className="text-lg" onClick={scrollToFeed}>Share Your First Idea</button>
        </div>
      </section>

      <CommunityFooter />
    </div>
  );
};

export default Community;