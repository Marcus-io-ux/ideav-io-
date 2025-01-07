import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { KeyFeaturesSection } from "@/components/landing/KeyFeaturesSection";
import { JoinCommunitySection } from "@/components/landing/JoinCommunitySection";
import { AboutUsSection } from "@/components/landing/AboutUsSection";
import { Footer } from "@/components/landing/Footer";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { TestimonialsCarousel } from "@/components/testimonials/TestimonialsCarousel";
import { FAQSection } from "@/components/landing/FAQSection";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main>
        <HeroSection />
        <div id="how-it-works" className="how-it-works">
          <HowItWorksSection />
        </div>
        <div id="about-us" className="about-us">
          <AboutUsSection />
        </div>
        <div id="community" className="community">
          <JoinCommunitySection />
          <TestimonialsCarousel />
        </div>
        <div id="faq" className="faq-section">
          <FAQSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;