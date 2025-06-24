const { generateRecipe, suggestDesserts, ingredientsToRecipe } = require('../utils/gemini');
const { getRecipesFromSpoonacular, searchRecipesByIngredients, getRandomRecipes } = require('../utils/recipeApi');
const { saveRecipe, saveAIRecipe, saveAISuggestion, saveAIIngredientMatch } = require('../utils/supabase');

// Generate AI recipe
const generateARecipe = async (req, res) => {
  try {
    const { ingredients, texture, dietary, sweetness, cookingTime } = req.body;
    
    // Map frontend fields to backend expectations
    const mappedData = {
      ingredients: ingredients || '',
      texture: texture || 'any',
      diet: dietary || 'none'
    };
    
    const recipe = await generateRecipe(mappedData.ingredients, mappedData.texture, mappedData.diet);
    await saveAIRecipe(recipe);
    
    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Recipe generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate recipe'
    });
  }
};

// Suggest desserts
const suggestDessert = async (req, res) => {
  try {
    const { mood, timeAvailable, skillLevel, dietaryPreference } = req.body;
    
    // Map frontend fields to backend expectations
    const mappedData = {
      mood: mood || 'cozy',
      time: timeAvailable || 'medium',
      diet: dietaryPreference || 'none'
    };
    
    const suggestions = await suggestDesserts(mappedData.mood, mappedData.time, mappedData.diet);
    for (const suggestion of suggestions) {
      await saveAISuggestion(suggestion);
    }
    
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Dessert suggestion error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to suggest desserts'
    });
  }
};

// Create recipe from ingredients
const createRecipeFromIngredients = async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    const recipe = await ingredientsToRecipe(ingredients);
    await saveAIRecipe(recipe);
    
    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Ingredients to recipe error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create recipe from ingredients'
    });
  }
};

// Get recipes from Spoonacular API
const getRecipes = async (req, res) => {
  try {
    const { query, number = 20, type = 'cookie' } = req.query;
    
    let recipes;
    
    if (query) {
      // Search for specific recipes
      recipes = await getRecipesFromSpoonacular(query, parseInt(number));
    } else if (type === 'random') {
      // Get random recipes
      recipes = await getRandomRecipes(parseInt(number), 'dessert');
    } else {
      // Get default cookie recipes
      recipes = await getRecipesFromSpoonacular('cookie', parseInt(number));
    }
    
    // Save each recipe to the recipes table
    for (const recipe of recipes) {
      await saveRecipe(recipe);
    }
    
    res.json({
      success: true,
      data: recipes
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recipes'
    });
  }
};

// Search recipes by ingredients (for the "What's in my kitchen" feature)
const searchRecipesByIngredientsAPI = async (req, res) => {
  try {
    const { ingredients, number = 10 } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Ingredients array is required'
      });
    }
    
    const recipes = await searchRecipesByIngredients(ingredients, parseInt(number));
    
    // Convert to the format expected by the frontend
    const matchedRecipes = recipes.map((recipe, index) => ({
      title: recipe.title,
      description: recipe.description,
      image: recipe.image,
      time: recipe.totalTime,
      servings: recipe.servings,
      matchPercentage: Math.max(70, 100 - (index * 5)), // Simple scoring
      missingIngredients: [] // This would need more complex logic to determine
    }));
    
    res.json({
      success: true,
      data: matchedRecipes
    });
  } catch (error) {
    console.error('Search recipes by ingredients error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search recipes by ingredients'
    });
  }
};

module.exports = {
  generateARecipe,
  suggestDessert,
  createRecipeFromIngredients,
  getRecipes,
  searchRecipesByIngredientsAPI
}; 