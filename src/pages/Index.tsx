import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Lock, Search, LogIn } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">IdeaVault</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Log In
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Capture Your Brilliant Ideas
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personal space for collecting, organizing, and nurturing ideas. Never let a moment of inspiration slip away.
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-primary hover:bg-primary-hover text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Brain className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Effortless Capture</h3>
            <p className="text-gray-600">
              Quickly save your ideas with our intuitive interface. Add tags, notes, and attachments.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Search className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Smart Organization</h3>
            <p className="text-gray-600">
              Powerful search and filtering tools help you find and organize your ideas effortlessly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Lock className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
            <p className="text-gray-600">
              Your ideas are precious. We ensure they stay private and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;