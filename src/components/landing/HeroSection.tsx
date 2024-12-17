import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden animate-gradient">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full mix-blend-multiply filter blur-xl animate-float"
              style={{
                background: "linear-gradient(90deg, #1EAEDB, #0EA5E9)",
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
          Store Your Ideas.{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            Share Your Vision.
          </span>
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
          Turn your thoughts into reality. Save ideas privately or share them with a community ready to collaborate and inspire.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-white hover:bg-blue-50 text-[#1EAEDB] px-8 py-6 rounded-full 
                       shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Start for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/community">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 rounded-full border-2 border-white text-white hover:bg-white/10"
            >
              Explore Community
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};