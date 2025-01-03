interface CommunityHeroProps {
  onPostClick?: () => void;
  onExploreClick?: () => void;
}

export const CommunityHero = ({ onPostClick, onExploreClick }: CommunityHeroProps) => {
  return (
    <section className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to the IdeaVault Community!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Share your ideas, collaborate with like-minded innovators, and get valuable feedback to refine your vision.
      </p>
    </section>
  );
};