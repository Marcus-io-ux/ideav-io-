import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { KeyFeaturesSection } from "@/components/landing/KeyFeaturesSection";
import { JoinCommunitySection } from "@/components/landing/JoinCommunitySection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { TestimonialsCarousel } from "@/components/testimonials/TestimonialsCarousel";
import { FAQSection } from "@/components/landing/FAQSection";

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
          <TestimonialsCarousel />
        </div>
        <PricingSection />
        <div id="faq">
          <FAQSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;