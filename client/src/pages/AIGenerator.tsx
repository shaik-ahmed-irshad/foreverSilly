import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Bot, ArrowLeft, Sparkles } from 'lucide-react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { api, RecipeGenerationRequest, Recipe, ApiError } from '@/lib/api';

const AIGenerator = () => {
  const [formData, setFormData] = useState({
    ingredients: '',
    texture: '',
    dietary: '',
    sweetness: '',
    cookingTime: ''
  });
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    
    try {
      // Prepare request data
      const requestData: RecipeGenerationRequest = {
        ingredients: formData.ingredients || undefined,
        texture: formData.texture || undefined,
        dietary: formData.dietary || undefined,
        sweetness: formData.sweetness || undefined,
        cookingTime: formData.cookingTime || undefined,
      };

      // Call the real API
      const recipe = await api.generateRecipe(requestData);
      setGeneratedRecipe(recipe);
    } catch (err) {
      console.error('Error generating recipe:', err);
      if (err instanceof ApiError) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Failed to generate recipe. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (generatedRecipe) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/ai/generator" onClick={() => setGeneratedRecipe(null)} className="flex items-center text-gray-600 hover:text-pink-500">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Generate Another Recipe
            </Link>
          </Button>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle className="text-2xl text-gray-800">{generatedRecipe.title}</CardTitle>
              <div className="flex justify-center gap-4 text-sm text-gray-600 mt-4">
                <span>Prep: {generatedRecipe.prepTime}</span>
                <span>Cook: {generatedRecipe.cookTime}</span>
                <span>Serves: {generatedRecipe.servings}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h3>
                <ul className="space-y-2">
                  {generatedRecipe.ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Instructions</h3>
                <ol className="space-y-3">
                  {generatedRecipe.instructions.map((instruction: string, index: number) => (
                    <li key={index} className="flex">
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
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
            <Bot className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">AI Recipe Generator</h1>
            <p className="text-lg text-gray-600">Create custom cookie recipes tailored to your preferences</p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Tell us your preferences</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ingredients">Preferred Ingredients</Label>
                <Input
                  id="ingredients"
                  placeholder="e.g., chocolate chips, nuts, dried fruit..."
                  value={formData.ingredients}
                  onChange={(e) => handleInputChange('ingredients', e.target.value)}
                  className="border-pink-200 focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="texture">Texture Preference</Label>
                  <Select onValueChange={(value) => handleInputChange('texture', value)}>
                    <SelectTrigger className="border-pink-200 focus:border-pink-500">
                      <SelectValue placeholder="Select texture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soft">Soft & Chewy</SelectItem>
                      <SelectItem value="crunchy">Crunchy & Crisp</SelectItem>
                      <SelectItem value="fudgy">Fudgy & Dense</SelectItem>
                      <SelectItem value="light">Light & Airy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietary">Dietary Needs</Label>
                  <Select onValueChange={(value) => handleInputChange('dietary', value)}>
                    <SelectTrigger className="border-pink-200 focus:border-pink-500">
                      <SelectValue placeholder="Select dietary needs" />
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sweetness">Sweetness Level</Label>
                  <Select onValueChange={(value) => handleInputChange('sweetness', value)}>
                    <SelectTrigger className="border-pink-200 focus:border-pink-500">
                      <SelectValue placeholder="Select sweetness" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Lightly Sweet</SelectItem>
                      <SelectItem value="medium">Moderately Sweet</SelectItem>
                      <SelectItem value="high">Very Sweet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cookingTime">Available Time</Label>
                  <Select onValueChange={(value) => handleInputChange('cookingTime', value)}>
                    <SelectTrigger className="border-pink-200 focus:border-pink-500">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quick">Under 30 minutes</SelectItem>
                      <SelectItem value="medium">30-60 minutes</SelectItem>
                      <SelectItem value="long">Over 1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Recipe...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Recipe
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

export default AIGenerator;
