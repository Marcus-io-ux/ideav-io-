import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
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
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 text-center">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Dynamic headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900">
            <span className="block mb-2">Welcome to IdeaVault</span>
            <div className="min-h-[60px] sm:min-h-[80px]">
              <TypeAnimation
                sequence={[
                  'Store Your Ideas.',
                  4000,
                  'Share Your Vision.',
                  4000,
                  'Collaborate with Innovators.',
                  4000,
                  'Turn Thoughts Into Action.',
                  4000,
                ]}
                wrapper="span"
                speed={75}
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 text-2xl sm:text-3xl lg:text-5xl"
                repeat={Infinity}
              />
            </div>
          </h1>

          {/* Static supportive subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
            A space to capture, organize, and share your ideas effortlessly. Join our community of innovators and bring your ideas to life.
          </p>

          {/* CTAs */}
          <div className="flex justify-center items-center gap-4 animate-fade-in">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-4 sm:py-6 rounded-full 
                         shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};