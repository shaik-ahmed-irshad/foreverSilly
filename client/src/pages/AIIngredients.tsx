import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChefHat, ArrowLeft, Plus, X, Clock, Users } from 'lucide-react';
import Layout from '@/components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { api, IngredientsToRecipeRequest, MatchedRecipe, ApiError } from '@/lib/api';

const AIIngredients = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [matchedRecipes, setMatchedRecipes] = useState<MatchedRecipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(item => item !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const findRecipes = async () => {
    if (ingredients.length === 0) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      // Prepare request data
      const requestData: IngredientsToRecipeRequest = {
        ingredients: ingredients,
      };

      // Call the real API
      const recipes = await api.findRecipesByIngredients(requestData);
      setMatchedRecipes(recipes);
    } catch (err) {
      console.error('Error finding recipes:', err);
      if (err instanceof ApiError) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Failed to find recipes. Please try again.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  if (matchedRecipes.length > 0) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/ai/ingredients" onClick={() => setMatchedRecipes([])} className="flex items-center text-gray-600 hover:text-pink-500">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Search Again
            </Link>
          </Button>

          <div className="text-center mb-8">
            <ChefHat className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Perfect Recipe Matches</h1>
            <p className="text-lg text-gray-600">Based on your available ingredients</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Ingredients:</h3>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedRecipes.map((recipe, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="p-0">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full text-sm font-semibold text-green-600">
                    {recipe.matchPercentage}% match
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl text-gray-800 mb-2 group-hover:text-green-500 transition-colors">
                    {recipe.title}
                  </CardTitle>
                  <p className="text-gray-600 mb-4">{recipe.description}</p>
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {recipe.time}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {recipe.servings}
                    </div>
                  </div>

                  {recipe.missingIngredients.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">You'll also need:</p>
                      <div className="flex flex-wrap gap-1">
                        {recipe.missingIngredients.map((ingredient: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-600"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    onClick={() => navigate(`/ai/ingredient-recipe/${index}`, { state: { recipe } })}
                  >
                    Get Full Recipe
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
            <ChefHat className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Kitchen Assistant</h1>
            <p className="text-lg text-gray-600">Find recipes based on ingredients you already have</p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">What's in your kitchen?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="ingredient">Add Ingredients</Label>
              <div className="flex gap-2">
                <Input
                  id="ingredient"
                  placeholder="e.g., flour, eggs, chocolate chips..."
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-green-200 focus:border-green-500"
                />
                <Button
                  type="button"
                  onClick={addIngredient}
                  disabled={!currentIngredient.trim()}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {ingredients.length > 0 && (
              <div className="space-y-2">
                <Label>Your Ingredients</Label>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                    >
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={findRecipes}
              disabled={isSearching || ingredients.length === 0}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3"
            >
              {isSearching ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Finding Recipes...
                </div>
              ) : (
                <div className="flex items-center">
                  <ChefHat className="h-4 w-4 mr-2" />
                  Find Recipes
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AIIngredients;
