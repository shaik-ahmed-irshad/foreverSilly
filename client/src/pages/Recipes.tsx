import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Clock, Tag, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { api, Recipe, ApiError } from '@/lib/api';

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to extract categories from recipe (simplified)
  const extractCategoriesFromRecipe = (recipe: Recipe): string[] => {
    const title = recipe.title.toLowerCase();
    const ingredients = recipe.ingredients.join(' ').toLowerCase();
    const text = `${title} ${ingredients}`;
    
    const categories: string[] = [];
    if (text.includes('chocolate')) categories.push('chocolate');
    if (text.includes('vegan') || text.includes('plant-based')) categories.push('vegan');
    if (text.includes('gluten-free') || text.includes('gluten free')) categories.push('gluten-free');
    if (text.includes('nut') || text.includes('almond') || text.includes('peanut')) categories.push('nuts');
    if (text.includes('sugar') || text.includes('classic')) categories.push('classic');
    if (text.includes('simple') || text.includes('easy')) categories.push('kids');
    
    return categories;
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const recipesData = await api.getRecipes();
      setRecipes(recipesData);
    } catch (err) {
      console.error('Error loading recipes:', err);
      if (err instanceof ApiError) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Failed to load recipes. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Extract categories from recipe tags (assuming recipes have tags)
  const categories = ['all', 'classic', 'vegan', 'gluten-free', 'chocolate', 'nuts', 'kids'];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    // For now, we'll use a simple category matching based on title/keywords
    // In a real app, recipes would have explicit category/tag fields
    const recipeCategories = extractCategoriesFromRecipe(recipe);
    const matchesCategory = filterCategory === 'all' || recipeCategories.includes(filterCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading recipes...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/" className="flex items-center text-gray-600 hover:text-pink-500">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-pink-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Recipe Library</h1>
            <p className="text-lg text-gray-600">Discover hundreds of tested cookie and dessert recipes</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <Button 
              onClick={loadRecipes} 
              variant="outline" 
              size="sm" 
              className="ml-4"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-pink-200 focus:border-pink-500"
            />
          </div>
          <div className="sm:w-48">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="border-pink-200 focus:border-pink-500">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-0">
                <img
                  src={recipe.image || "/cookie1.jpg"}
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl text-gray-800 mb-2 group-hover:text-pink-500 transition-colors">
                  {recipe.title}
                </CardTitle>
                <p className="text-gray-600 mb-4">
                  {recipe.description || recipe.ingredients.slice(0, 3).join(', ') + '...'}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{recipe.cookTime}</span>
                  </div>
                  <div className="flex gap-1">
                    {extractCategoriesFromRecipe(recipe).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-600"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
                  <Link to={`/recipe/${recipe.id}`}>View Full Recipe</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No recipes found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Recipes;
