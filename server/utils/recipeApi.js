const axios = require('axios');

// Spoonacular API configuration
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

// Fallback recipes if API is not available
const fallbackRecipes = [
  {
    id: 1,
    title: "Classic Chocolate Chip Cookies",
    description: "The perfect chocolate chip cookie - crispy edges, chewy center",
    image: "/cookie1.jpg",
    prepTime: "15 minutes",
    cookTime: "10 minutes",
    totalTime: "25 minutes",
    servings: "24 cookies",
    difficulty: "Easy",
    tags: ["classic", "chocolate", "family-friendly"],
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup packed brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups chocolate chips"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C)",
      "Mix flour, baking soda, and salt in a bowl",
      "Cream butter and sugars until light and fluffy",
      "Beat in eggs and vanilla",
      "Gradually blend in flour mixture",
      "Stir in chocolate chips",
      "Drop rounded tablespoons onto ungreased cookie sheets",
      "Bake 9-11 minutes until golden brown",
      "Cool on baking sheet for 2 minutes; remove to wire rack"
    ]
  },
  {
    id: 2,
    title: "Oatmeal Raisin Cookies",
    description: "Hearty and wholesome cookies perfect for breakfast or snacks",
    image: "/cookie2.jpeg",
    prepTime: "15 minutes",
    cookTime: "12 minutes",
    totalTime: "27 minutes",
    servings: "36 cookies",
    difficulty: "Easy",
    tags: ["healthy", "oats", "raisins"],
    ingredients: [
      "1 cup butter, softened",
      "1 cup packed brown sugar",
      "1/2 cup granulated sugar",
      "2 eggs",
      "1 tsp vanilla",
      "1 1/2 cups flour",
      "1 tsp baking soda",
      "1 tsp cinnamon",
      "1/2 tsp salt",
      "3 cups old-fashioned oats",
      "1 cup raisins"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C)",
      "Beat butter and sugars until creamy",
      "Add eggs and vanilla; beat well",
      "Combine flour, baking soda, cinnamon, and salt",
      "Add to butter mixture; mix well",
      "Stir in oats and raisins",
      "Drop by rounded tablespoonfuls onto ungreased cookie sheets",
      "Bake 10-12 minutes until golden brown",
      "Cool 1 minute; remove to wire rack"
    ]
  }
];

// Convert Spoonacular recipe to our format
const convertSpoonacularRecipe = (recipe) => {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 'Delicious recipe',
    image: recipe.image || "/cookie1.jpg",
    prepTime: `${recipe.preparationMinutes || 15} minutes`,
    cookTime: `${recipe.cookingMinutes || 10} minutes`,
    totalTime: `${recipe.readyInMinutes || 25} minutes`,
    servings: `${recipe.servings || 4} servings`,
    difficulty: recipe.readyInMinutes > 60 ? "Hard" : recipe.readyInMinutes > 30 ? "Medium" : "Easy",
    tags: recipe.dishTypes || recipe.cuisines || ["dessert"],
    ingredients: recipe.extendedIngredients?.map(ing => `${ing.amount} ${ing.unit} ${ing.name}`) || [],
    instructions: recipe.analyzedInstructions?.[0]?.steps?.map(step => step.step) || []
  };
};

// Get recipes from Spoonacular API
const getRecipesFromSpoonacular = async (query = 'cookie', number = 20) => {
  try {
    if (!SPOONACULAR_API_KEY) {
      console.warn('⚠️  SPOONACULAR_API_KEY not found, using fallback recipes');
      return fallbackRecipes;
    }

    const response = await axios.get(`${SPOONACULAR_BASE_URL}/complexSearch`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        query: query,
        number: number,
        addRecipeInformation: true,
        fillIngredients: true,
        instructionsRequired: true,
        addRecipeNutrition: false,
        type: 'dessert'
      },
      timeout: 10000 // 10 second timeout
    });

    if (response.data && response.data.results) {
      return response.data.results.map(convertSpoonacularRecipe);
    }

    return fallbackRecipes;
  } catch (error) {
    console.error('Spoonacular API error:', error.message);
    
    // If it's a quota exceeded error, return fallback
    if (error.response?.status === 402) {
      console.warn('⚠️  Spoonacular API quota exceeded, using fallback recipes');
    }
    
    return fallbackRecipes;
  }
};

// Search recipes by ingredients
const searchRecipesByIngredients = async (ingredients, number = 10) => {
  try {
    if (!SPOONACULAR_API_KEY) {
      return fallbackRecipes.slice(0, number);
    }

    const ingredientsString = ingredients.join(',');
    
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/findByIngredients`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        ingredients: ingredientsString,
        number: number,
        ranking: 2, // Maximize used ingredients
        ignorePantry: true
      },
      timeout: 10000
    });

    if (response.data && response.data.length > 0) {
      // Get full recipe information for each result
      const recipeIds = response.data.map(recipe => recipe.id).join(',');
      const fullRecipesResponse = await axios.get(`${SPOONACULAR_BASE_URL}/informationBulk`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          ids: recipeIds
        },
        timeout: 10000
      });

      return fullRecipesResponse.data.map(convertSpoonacularRecipe);
    }

    return fallbackRecipes.slice(0, number);
  } catch (error) {
    console.error('Spoonacular search error:', error.message);
    return fallbackRecipes.slice(0, number);
  }
};

// Get random recipes
const getRandomRecipes = async (number = 10, tags = 'dessert') => {
  try {
    if (!SPOONACULAR_API_KEY) {
      return fallbackRecipes.slice(0, number);
    }

    const response = await axios.get(`${SPOONACULAR_BASE_URL}/random`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        number: number,
        tags: tags
      },
      timeout: 10000
    });

    if (response.data && response.data.recipes) {
      return response.data.recipes.map(convertSpoonacularRecipe);
    }

    return fallbackRecipes.slice(0, number);
  } catch (error) {
    console.error('Spoonacular random recipes error:', error.message);
    return fallbackRecipes.slice(0, number);
  }
};

module.exports = {
  getRecipesFromSpoonacular,
  searchRecipesByIngredients,
  getRandomRecipes,
  fallbackRecipes
}; 