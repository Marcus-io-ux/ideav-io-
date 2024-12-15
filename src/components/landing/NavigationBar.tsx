import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NavigationBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            IdeaVault
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="#features" className="text-gray-600 hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="#community" className="text-gray-600 hover:text-primary transition-colors">
              Community
            </Link>
            <Link to="#pricing" className="text-gray-600 hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="#about" className="text-gray-600 hover:text-primary transition-colors">
              About Us
            </Link>
            <Button 
              asChild
              size="sm"
              className="bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg transition-all"
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};