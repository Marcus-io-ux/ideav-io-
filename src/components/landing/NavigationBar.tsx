import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

export const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`.${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false); // Close mobile menu after clicking
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light hover:opacity-80 transition-opacity"
          >
            IdeaVault
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              How it Works
            </button>
            <button 
              onClick={() => scrollToSection('about-us')}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('community')}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Community
            </button>
            <button 
              onClick={() => scrollToSection('faq-section')}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              FAQ
            </button>
            <Button 
              asChild
              size="sm"
              className="bg-primary hover:bg-primary-hover text-white px-6 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="flex items-center px-2 py-3 text-lg font-medium transition-colors hover:text-primary"
                >
                  How it Works
                </button>
                <button
                  onClick={() => scrollToSection('about-us')}
                  className="flex items-center px-2 py-3 text-lg font-medium transition-colors hover:text-primary"
                >
                  About Us
                </button>
                <button
                  onClick={() => scrollToSection('community')}
                  className="flex items-center px-2 py-3 text-lg font-medium transition-colors hover:text-primary"
                >
                  Community
                </button>
                <button
                  onClick={() => scrollToSection('faq-section')}
                  className="flex items-center px-2 py-3 text-lg font-medium transition-colors hover:text-primary"
                >
                  FAQ
                </button>
                <Button 
                  asChild
                  className="w-full mt-4 bg-primary hover:bg-primary-hover text-white rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Link to="/login">Login</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};