import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { KeyFeaturesSection } from "@/components/landing/KeyFeaturesSection";
import { JoinCommunitySection } from "@/components/landing/JoinCommunitySection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { TestimonialsCarousel } from "@/components/testimonials/TestimonialsCarousel";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <main>
        <HeroSection />
        <div id="how-it-works">
          <HowItWorksSection />
          <KeyFeaturesSection />
        </div>
        <div id="community">
          <JoinCommunitySection />
        </div>
        <TestimonialsCarousel />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;