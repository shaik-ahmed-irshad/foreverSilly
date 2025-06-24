
import { Cookie, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-100 to-orange-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Cookie className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                ForeverCookie
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Bake. Discover. Delight. Your AI-powered companion for all things cookies and desserts.
            </p>
            <p className="text-sm text-gray-500">
              Made with <Heart className="inline h-4 w-4 text-red-500" /> for cookie lovers everywhere
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/order" className="hover:text-pink-500">Pre-order Cookies</a></li>
              <li><a href="/recipes" className="hover:text-pink-500">Recipe Library</a></li>
              <li><a href="/ai/generator" className="hover:text-pink-500">AI Recipe Generator</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">AI Tools</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/ai/suggestion" className="hover:text-pink-500">Dessert Suggestions</a></li>
              <li><a href="/ai/ingredients" className="hover:text-pink-500">Kitchen Assistant</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-pink-200 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2024 ForeverCookie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
