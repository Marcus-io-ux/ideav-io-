import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Users, Tag, Layout } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
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
                <Link to="/signup">Sign Up</Link>
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

      {/* Hero Section with Get Started Button */}
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

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "Idea Vault",
                description: "Securely store and organize all your creative ideas in one place.",
              },
              {
                icon: Users,
                title: "Community Collaboration",
                description: "Connect with like-minded creators and get valuable feedback.",
              },
              {
                icon: Tag,
                title: "Smart Organization",
                description: "Tag and categorize your ideas for easy access and management.",
              },
              {
                icon: Layout,
                title: "Personal Dashboard",
                description: "Track your progress and manage your ideas efficiently.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Trusted by Creators Worldwide</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "This platform has completely transformed how I manage my creative projects.",
                author: "Sarah J.",
                role: "Product Designer",
              },
              {
                quote: "The community feedback has been invaluable for refining my ideas.",
                author: "Michael R.",
                role: "Entrepreneur",
              },
              {
                quote: "Finally, a place where I can organize all my thoughts effectively.",
                author: "Lisa M.",
                role: "Content Creator",
              },
            ].map((testimonial) => (
              <div key={testimonial.author} className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8">Join thousands of creators already using our platform.</p>
          <Link to="/signup">
            <Button size="lg" variant="secondary">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/roadmap" className="hover:text-white">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/guides" className="hover:text-white">Guides</Link></li>
                <li><Link to="/api" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link to="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p>&copy; 2024 Your Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;