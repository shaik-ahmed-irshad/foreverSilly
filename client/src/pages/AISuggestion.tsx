import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sparkles, ArrowLeft, Clock, Users } from 'lucide-react';
import Layout from '@/components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { api, DessertSuggestionRequest, DessertSuggestion, ApiError } from '@/lib/api';

const AISuggestion = () => {
  const [formData, setFormData] = useState({
    mood: '',
    timeAvailable: '',
    skillLevel: '',
    dietaryPreference: ''
  });
  const [suggestions, setSuggestions] = useState<DessertSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    
    try {
      // Prepare request data
      const requestData: DessertSuggestionRequest = {
        mood: formData.mood || undefined,
        timeAvailable: formData.timeAvailable || undefined,
        skillLevel: formData.skillLevel || undefined,
        dietaryPreference: formData.dietaryPreference || undefined,
      };

      // Call the real API
      const dessertSuggestions = await api.getDessertSuggestions(requestData);
      setSuggestions(dessertSuggestions);
    } catch (err) {
      console.error('Error getting dessert suggestions:', err);
      if (err instanceof ApiError) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Failed to get dessert suggestions. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (suggestions.length > 0) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/ai/suggestion" onClick={() => setSuggestions([])} className="flex items-center text-gray-600 hover:text-pink-500">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Get New Suggestions
            </Link>
          </Button>

          <div className="text-center mb-8">
            <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Your Perfect Dessert Matches</h1>
            <p className="text-lg text-gray-600">Based on your mood and preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="p-0">
                  <img
                    src={suggestion.image}
                    alt={suggestion.title}
                    className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl text-gray-800 mb-2 group-hover:text-purple-500 transition-colors">
                    {suggestion.title}
                  </CardTitle>
                  <p className="text-gray-600 mb-4">{suggestion.description}</p>
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {suggestion.time}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {suggestion.servings}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-600">
                      {suggestion.difficulty}
                    </span>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={() => navigate(`/ai/suggestion-recipe/${index}`, { state: { suggestion } })}
                  >
                    Get Recipe
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/" className="flex items-center text-gray-600 hover:text-pink-500">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="text-center">
            <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">AI Dessert Suggestions</h1>
            <p className="text-lg text-gray-600">Tell us your mood and we'll suggest the perfect dessert</p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">What's your vibe today?</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mood">Current Mood</Label>
                <Select onValueChange={(value) => handleInputChange('mood', value)}>
                  <SelectTrigger className="border-pink-200 focus:border-pink-500">
                    <SelectValue placeholder="How are you feeling?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cozy">Cozy & Comfortable</SelectItem>
                    <SelectItem value="festive">Festive & Celebratory</SelectItem>
                    <SelectItem value="energetic">Energetic & Upbeat</SelectItem>
                    <SelectItem value="relaxed">Relaxed & Peaceful</SelectItem>
                    <SelectItem value="adventurous">Adventurous & Bold</SelectItem>
                    <SelectItem value="nostalgic">Nostalgic & Sentimental</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeAvailable">Time Available</Label>
                <Select onValueChange={(value) => handleInputChange('timeAvailable', value)}>
                  <SelectTrigger className="border-pink-200 focus:border-pink-500">
                    <SelectValue placeholder="How much time do you have?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quick">Quick (15-30 minutes)</SelectItem>
                    <SelectItem value="moderate">Moderate (30-60 minutes)</SelectItem>
                    <SelectItem value="leisurely">Leisurely (1+ hours)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillLevel">Baking Skill Level</Label>
                <Select onValueChange={(value) => handleInputChange('skillLevel', value)}>
                  <SelectTrigger className="border-pink-200 focus:border-pink-500">
                    <SelectValue placeholder="What's your baking experience?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (Simple recipes)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (Some experience)</SelectItem>
                    <SelectItem value="advanced">Advanced (Bring on the challenge!)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietaryPreference">Dietary Preferences</Label>
                <Select onValueChange={(value) => handleInputChange('dietaryPreference', value)}>
                  <SelectTrigger className="border-pink-200 focus:border-pink-500">
                    <SelectValue placeholder="Any dietary needs?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No restrictions</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="gluten-free">Gluten-free</SelectItem>
                    <SelectItem value="dairy-free">Dairy-free</SelectItem>
                    <SelectItem value="sugar-free">Sugar-free</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Finding Perfect Desserts...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get Dessert Suggestions
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AISuggestion;
