import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { Cookie, BookOpen, Bot, Sparkles, ChefHat, Heart } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Cookie,
      title: 'Pre-order Cookies',
      description: 'Fresh-baked cookies delivered to your door',
      link: '/order',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: BookOpen,
      title: 'Recipe Library',
      description: 'Discover hundreds of tested cookie recipes',
      link: '/recipes',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Bot,
      title: 'AI Recipe Generator',
      description: 'Create custom recipes with AI',
      link: '/ai/generator',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const aiTools = [
    {
      icon: Sparkles,
      title: 'Dessert Suggestions',
      description: 'Get AI-powered dessert recommendations based on your mood',
      link: '/ai/suggestion'
    },
    {
      icon: ChefHat,
      title: 'Kitchen Assistant',
      description: 'Find recipes based on ingredients you have',
      link: '/ai/ingredients'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Cookie className="h-16 w-16 text-pink-500 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-6">
              ForeverCookie
            </h1>
            <p className="text-lg md:text-2xl text-gray-600 mb-8 font-light">
              Bake. Discover. Delight.
            </p>
            <p className="text-base text-gray-500 mb-8 max-w-2xl mx-auto italic">
              ForeverCookie.com – More than a cookie shop. A dessert-loving space to explore, experiment, and pre-order artisanal cookies. With AI tools, hundreds of recipes, and playful features, you don't just buy — you bake, learn, and grow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white">
                <Link to="/order">Start Your Order</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-pink-300 text-pink-600 hover:bg-pink-50">
                <Link to="/recipes">Browse Recipes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Everything You Need for Perfect Cookies
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From ordering fresh cookies to creating your own recipes with AI assistance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
                    <Link to={feature.link}>Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-16 bg-gradient-to-r from-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              AI-Powered Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Let artificial intelligence help you discover new flavors and create amazing desserts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {aiTools.map((tool, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <tool.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{tool.title}</h3>
                      <p className="text-gray-600 mb-4">{tool.description}</p>
                      <Button asChild variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                        <Link to={tool.link}>Try Now</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-3xl p-12 text-white">
            <Heart className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Baking?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of cookie lovers who trust ForeverCookie for their sweet needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                <Link to="/order">Order Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-pink-600 hover:bg-white/10">
                <Link to="/ai/generator">Try AI Generator</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
