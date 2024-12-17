import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-gray-600 hover:text-blue-500 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-blue-500 transition-colors">Pricing</Link></li>
              <li><Link to="/roadmap" className="text-gray-600 hover:text-blue-500 transition-colors">Roadmap</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-blue-500 transition-colors">About</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-blue-500 transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-blue-500 transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-600 hover:text-blue-500 transition-colors">Help Center</Link></li>
              <li><Link to="/guides" className="text-gray-600 hover:text-blue-500 transition-colors">Guides</Link></li>
              <li><Link to="/api" className="text-gray-600 hover:text-blue-500 transition-colors">API</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-600 hover:text-blue-500 transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-blue-500 transition-colors">Terms</Link></li>
              <li><Link to="/security" className="text-gray-600 hover:text-blue-500 transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">&copy; 2024 IdeaVault. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};