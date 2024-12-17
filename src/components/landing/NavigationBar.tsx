import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NavigationBar = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`.${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-80 transition-opacity"
          >
            IdeaVault
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              How it Works
            </button>
            <button 
              onClick={() => scrollToSection('community')}
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              Community
            </button>
            <button 
              onClick={() => scrollToSection('pricing-section')}
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              Pricing
            </button>
            <Link to="#about" className="text-gray-600 hover:text-blue-500 transition-colors">
              About Us
            </Link>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              FAQ
            </button>
            <Button 
              asChild
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-600 hover:text-blue-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};