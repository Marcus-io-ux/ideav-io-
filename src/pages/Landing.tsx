import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { KeyFeaturesSection } from "@/components/landing/KeyFeaturesSection";
import { CommunityShowcase } from "@/components/landing/CommunityShowcase";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { NavigationBar } from "@/components/landing/NavigationBar";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <KeyFeaturesSection />
        <CommunityShowcase />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;