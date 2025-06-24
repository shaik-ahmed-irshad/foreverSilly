import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, ChefHat, ArrowLeft, Tag } from 'lucide-react';
import Layout from '@/components/Layout';
import { api, Recipe, ApiError } from '@/lib/api';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      const recipes = await api.getRecipes();
      const foundRecipe = recipes.find(r => r.id === parseInt(id || '0'));
      
      if (foundRecipe) {
        setRecipe(foundRecipe);
      } else {
        setError('Recipe not found');
      }
    } catch (err) {
      console.error('Error loading recipe:', err);
      if (err instanceof ApiError) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Failed to load recipe. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading recipe...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !recipe) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Recipe not found'}</p>
            <Button asChild>
              <Link to="/recipes">Back to Recipes</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/recipes" className="flex items-center text-gray-600 hover:text-pink-500">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Link>
        </Button>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <img
              src={recipe.image || "/cookie1.jpg"}
              alt={recipe.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <CardTitle className="text-3xl text-gray-800 mb-4">{recipe.title}</CardTitle>
            <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>Prep: {recipe.prepTime}</span>
              </div>
              <div className="flex items-center">
                <ChefHat className="h-4 w-4 mr-2" />
                <span>Cook: {recipe.cookTime}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>Serves: {recipe.servings}</span>
              </div>
              {recipe.difficulty && (
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-600">
                    {recipe.difficulty}
                  </span>
                </div>
              )}
            </div>

            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h3>
              <ol className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="text-center">
                <Button asChild className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
                  <Link to="/order">Order This Recipe</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RecipeDetail; 