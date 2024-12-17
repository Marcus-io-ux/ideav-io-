import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

export const HeroSection = () => {
  const [currentHeadline, setCurrentHeadline] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  
  const headlines = [
    'Store Your Ideas.',
    'Share Your Vision.',
    'Collaborate with Innovators.',
    'Turn Thoughts Into Action.'
  ];

  const scrollToPricing = () => {
    const pricingSection = document.querySelector('.pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentHeadline((prev) => (prev + 1) % headlines.length);
        setIsFlipping(false);
      }, 1000);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full mix-blend-multiply filter blur-xl animate-float"
              style={{
                background: "linear-gradient(90deg, #60A5FA, #818CF8)",
                width: `${Math.random() * 400 + 100}px`,
                height: `${Math.random() * 400 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                willChange: 'transform'
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="space-y-8">
          {/* Dynamic headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="block mb-2">Welcome to IdeaVault</span>
            <span
              className={`block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 ${
                isFlipping ? 'animate-flip' : ''
              }`}
            >
              {headlines[currentHeadline]}
            </span>
          </h1>

          {/* Static supportive subheadline */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
            A space to capture, organize, and share your ideas effortlessly. Join our community of innovators and bring your ideas to life.
          </p>

          {/* CTAs */}
          <div className="flex justify-center items-center gap-4 animate-fade-in">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full 
                       shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              onClick={scrollToPricing}
            >
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};