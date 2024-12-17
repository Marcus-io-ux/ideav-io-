import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Store Your Ideas.{" "}
          <span className="text-blue-600">
            Share Your Vision.
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Turn your thoughts into reality. Save ideas privately or share them with a community ready to collaborate and inspire.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full 
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
              className="px-8 py-6 rounded-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Explore Community
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};