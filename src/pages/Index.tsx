import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Lock, Search, LogIn, HelpCircle } from "lucide-react";
import { TestimonialsCarousel } from "@/components/testimonials/TestimonialsCarousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const navigate = useNavigate();

  const scrollToFAQ = () => {
    document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="container mx-auto px-4 py-4 sm:py-6 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-primary">IdeaVault</h1>
        <div className="flex gap-2 sm:gap-4 items-center">
          <Button
            variant="ghost"
            onClick={scrollToFAQ}
            className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">FAQ</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <LogIn className="w-4 h-4" />
            <span>Log In</span>
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 pt-8 sm:pt-16">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Capture Your Brilliant Ideas
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Your personal space for collecting, organizing, and nurturing ideas. Never let a moment of inspiration slip away.
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-primary hover:bg-primary-hover text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-3">Effortless Capture</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Quickly save your ideas with our intuitive interface. Add tags, notes, and attachments.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-3">Smart Organization</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Powerful search and filtering tools help you find and organize your ideas effortlessly.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-3">Secure & Private</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Your ideas are precious. We ensure they stay private and secure.
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="w-full mb-12 sm:mb-16">
          <TestimonialsCarousel />
        </div>

        {/* FAQ Section */}
        <div id="faq-section" className="max-w-3xl mx-auto mb-12 sm:mb-16 scroll-mt-20 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How secure are my ideas?</AccordionTrigger>
              <AccordionContent>
                Your ideas are encrypted and stored securely. Only you can access your private ideas, and we use industry-standard security measures to protect your data.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I collaborate with others?</AccordionTrigger>
              <AccordionContent>
                Yes! You can choose to share specific ideas with collaborators while keeping others private. Our platform makes it easy to work together on shared projects.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is there a free plan available?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer a free plan that includes all essential features. Premium plans are available for users who need advanced collaboration tools and increased storage.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How can I organize my ideas?</AccordionTrigger>
              <AccordionContent>
                You can use tags, folders, and our powerful search feature to organize and find your ideas quickly. We also provide customizable categories and filters.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </div>
  );
};

export default Index;