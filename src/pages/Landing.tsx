import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { KeyFeaturesSection } from "@/components/landing/KeyFeaturesSection";
import { JoinCommunitySection } from "@/components/landing/JoinCommunitySection";
import { PricingSection } from "@/components/landing/PricingSection";
import { AboutUsSection } from "@/components/landing/AboutUsSection";
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
        <div id="about-us">
          <AboutUsSection />
        </div>
        <div id="community">
          <JoinCommunitySection />
          <TestimonialsCarousel />
        </div>
        <div id="pricing" className="pricing-section">
          <PricingSection />
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