const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface RecipeGenerationRequest {
  ingredients?: string;
  texture?: string;
  dietary?: string;
  sweetness?: string;
  cookingTime?: string;
}

export interface DessertSuggestionRequest {
  mood?: string;
  timeAvailable?: string;
  skillLevel?: string;
  dietaryPreference?: string;
}

export interface IngredientsToRecipeRequest {
  ingredients: string[];
}

export interface Recipe {
  id?: number;
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: string;
  description?: string;
  image?: string;
  difficulty?: string;
  tags?: string[];
}

export interface DessertSuggestion {
  title: string;
  description: string;
  image: string;
  time: string;
  difficulty: string;
  servings: string;
}

export interface MatchedRecipe {
  title: string;
  description: string;
  image: string;
  time: string;
  servings: string;
  matchPercentage: number;
  missingIngredients: string[];
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText || `HTTP error! status: ${response.status}`);
  }
  
  try {
    const data = await response.json();
    // Handle backend response format (data is wrapped in success/data structure)
    return data.data || data;
  } catch (error) {
    throw new ApiError(response.status, 'Invalid JSON response');
  }
}

export const api = {
  // Generate custom recipe based on preferences
  async generateRecipe(data: RecipeGenerationRequest): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/api/generate-recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse<Recipe>(response);
  },

  // Get dessert suggestions based on mood and preferences
  async getDessertSuggestions(data: DessertSuggestionRequest): Promise<DessertSuggestion[]> {
    const response = await fetch(`${API_BASE_URL}/api/suggest-dessert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse<DessertSuggestion[]>(response);
  },

  // Find recipes based on available ingredients
  async findRecipesByIngredients(data: IngredientsToRecipeRequest): Promise<MatchedRecipe[]> {
    const response = await fetch(`${API_BASE_URL}/api/recipes/search-by-ingredients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse<MatchedRecipe[]>(response);
  },

  // Get static recipes
  async getRecipes(): Promise<Recipe[]> {
    const response = await fetch(`${API_BASE_URL}/api/recipes`);
    return handleResponse<Recipe[]>(response);
  },

  // Create order (fixed endpoint)
  async createOrder(orderData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    return handleResponse<any>(response);
  },
};

export { ApiError }; 