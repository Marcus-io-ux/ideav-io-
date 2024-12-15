import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Capture. Organize. Transform Your Ideas.
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Store your ideas, collaborate with others, and turn sparks of inspiration into actionable plans.
        </p>
        <div className="flex flex-col items-center gap-6">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary-hover text-white text-lg px-8 py-6 rounded-full 
                       shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300
                       animate-fade-in"
            aria-label="Get Started with IdeaVault"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm text-gray-500">Create your account in just a few seconds</p>
        </div>
      </div>
    </section>
  );
};