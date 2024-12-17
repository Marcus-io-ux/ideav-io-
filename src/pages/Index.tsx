import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Lock, Search, LogIn, HelpCircle, Users, Lightbulb, Network } from "lucide-react";
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100"
          style={{
            animation: "gradient 15s ease infinite",
            backgroundSize: "400% 400%",
          }}
        />
        {/* Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full bg-blue-200/20 backdrop-blur-3xl
                         animate-float-${i + 1}`}
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10 bg-white/80 backdrop-blur-sm">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700 font-display">
          IdeaVault
        </h1>
        <div className="flex gap-4 items-center">
          <Button
            variant="ghost"
            onClick={scrollToFAQ}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 font-medium"
          >
            <HelpCircle className="w-4 h-4" />
            FAQ
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 border-blue-500 text-blue-700 hover:bg-blue-50"
          >
            <LogIn className="w-4 h-4" />
            Log In
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 relative z-10">
        {/* Hero Section with Illustrations */}
        <div className="text-center mb-16 pt-16">
          <div className="flex justify-center gap-8 mb-8">
            <Brain className="w-16 h-16 text-blue-500 animate-float-1" />
            <Users className="w-16 h-16 text-blue-600 animate-float-2" />
            <Lightbulb className="w-16 h-16 text-blue-700 animate-float-3" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Capture Your Brilliant Ideas
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personal space for collecting, organizing, and nurturing ideas. Never let a moment of inspiration slip away.
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full 
                     shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <Brain className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Effortless Capture</h3>
            <p className="text-gray-600">
              Quickly save your ideas with our intuitive interface. Add tags, notes, and attachments.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <Search className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Smart Organization</h3>
            <p className="text-gray-600">
              Powerful search and filtering tools help you find and organize your ideas effortlessly.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <Lock className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
            <p className="text-gray-600">
              Your ideas are precious. We ensure they stay private and secure.
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="w-full mb-16">
          <TestimonialsCarousel />
        </div>

        {/* FAQ Section */}
        <div id="faq-section" className="max-w-3xl mx-auto mb-16 scroll-mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
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