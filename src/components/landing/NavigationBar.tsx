import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const NavigationBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              IdeaVault
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-600 hover:text-primary transition-colors text-lg"
            >
              How it Works
            </button>
            <button 
              onClick={() => scrollToSection('community')}
              className="text-gray-600 hover:text-primary transition-colors text-lg"
            >
              Community
            </button>
            <button 
              onClick={() => scrollToSection('about-us')}
              className="text-gray-600 hover:text-primary transition-colors text-lg"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('pricing-section')}
              className="text-gray-600 hover:text-primary transition-colors text-lg"
            >
              Pricing
            </button>
            <Link to="/signup">
              <Button variant="default" className="bg-primary text-white hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};