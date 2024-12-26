import { Button } from "@/components/ui/button";

interface CommunityHeroProps {
  onPostClick: () => void;
  onExploreClick: () => void;
}

export const CommunityHero = ({ onPostClick, onExploreClick }: CommunityHeroProps) => {
  return (
    <section className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">Welcome to the IdeaVault Community!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Share your ideas, collaborate with like-minded innovators, and get valuable feedback to refine your vision.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button size="lg" onClick={onPostClick}>Post an Idea</Button>
        <Button size="lg" variant="outline" onClick={onExploreClick}>
          Join a Discussion
        </Button>
        <Button size="lg" variant="outline" onClick={onExploreClick}>
          Explore Trending Ideas
        </Button>
      </div>
    </section>
  );
};