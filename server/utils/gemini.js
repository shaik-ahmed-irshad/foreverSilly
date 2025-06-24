const axios = require('axios');
const { geminiRateLimiter } = require('./rateLimiter');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

const generateRecipe = async (ingredients, texture, diet) => {
  return geminiRateLimiter.execute(async () => {
    try {
      // Handle ingredients parameter - it might be a string or array
      const ingredientsList = Array.isArray(ingredients) ? ingredients : (ingredients ? [ingredients] : []);
      const ingredientsText = ingredientsList.join(', ');
      
      const prompt = `You are a master pastry chef specializing in cookie recipes. Create a DELICIOUS and CREATIVE cookie recipe with the following requirements:

Ingredients available: ${ingredientsText || 'Standard baking ingredients'}
Desired texture: ${texture || 'any'}
Dietary restrictions: ${diet || 'none'}

IMPORTANT: Return ONLY a valid JSON object with this EXACT structure:
{
  "title": "Creative and appealing recipe name",
  "description": "A mouthwatering 2-3 sentence description that makes people want to bake this immediately",
  "ingredients": [
    "2 1/4 cups all-purpose flour",
    "1 cup butter, softened",
    "3/4 cup granulated sugar",
    "3/4 cup packed brown sugar",
    "2 large eggs",
    "2 tsp vanilla extract",
    "1 tsp baking soda",
    "1 tsp salt",
    "2 cups chocolate chips"
  ],
  "instructions": [
    "Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.",
    "In a large bowl, cream together butter and both sugars until light and fluffy.",
    "Beat in eggs one at a time, then stir in vanilla extract.",
    "In a separate bowl, whisk together flour, baking soda, and salt.",
    "Gradually blend the flour mixture into the butter mixture.",
    "Stir in chocolate chips until evenly distributed.",
    "Drop rounded tablespoons of dough onto prepared baking sheets, spacing 2 inches apart.",
    "Bake for 9-11 minutes until edges are golden brown but centers are still soft.",
    "Cool on baking sheets for 2 minutes, then transfer to wire racks to cool completely."
  ],
  "prepTime": "15 minutes",
  "cookTime": "10 minutes",
  "servings": "24 cookies",
  "difficulty": "easy",
  "tags": ["chocolate", "classic", "family-friendly"]
}

Make the recipe:
- Creative and unique while being practical
- Delicious and well-tested
- Respect dietary restrictions completely
- Include precise measurements and clear instructions
- Add appealing tags that describe the recipe`;

      const response = await axios.post(`${OPENROUTER_BASE_URL}/chat/completions`, {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1200
      }, {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'ForeverCookie AI'
        }
      });

      const content = response.data.choices[0].message.content;
      
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from OpenRouter');
      }
      
      const recipe = JSON.parse(jsonMatch[0]);
      if (!recipe.image) recipe.image = '/cookie1.jpg';
      return recipe;
    } catch (error) {
      console.error('OpenRouter API error:', error.response?.data || error.message);
      throw new Error('Failed to generate recipe');
    }
  });
};

const suggestDesserts = async (mood, time, diet) => {
  return geminiRateLimiter.execute(async () => {
    try {
      const prompt = `You are a dessert expert who knows exactly what people want to bake based on their mood and situation. Suggest 3 AMAZING dessert ideas (not just cookies) that would be perfect for:

Mood: ${mood || 'cozy'}
Time available: ${time || 'medium'}
Dietary restrictions: ${diet || 'none'}

IMPORTANT: Return ONLY a valid JSON array with this EXACT structure:
[
  {
    "title": "Creative dessert name",
    "description": "A tempting 2-3 sentence description that makes people excited to bake this",
    "image": "/cookie1.jpg",
    "time": "25 minutes",
    "difficulty": "easy",
    "servings": "8 servings",
    "ingredients": ["ingredient 1", "ingredient 2", ...],
    "instructions": ["step 1", "step 2", ...]
  },
  {
    "title": "Another creative dessert name",
    "description": "Another mouthwatering description",
    "image": "/cookie2.jpeg",
    "time": "45 minutes",
    "difficulty": "medium",
    "servings": "12 servings"
  },
  {
    "title": "Third creative dessert name",
    "description": "Third exciting description",
    "image": "/cookie1.jpg",
    "time": "60 minutes",
    "difficulty": "hard",
    "servings": "6 servings"
  }
]

Make suggestions that are:
- Perfectly matched to the mood and time constraints
- Respect dietary restrictions completely
- Include a mix of difficulty levels
- Creative and exciting, not boring
- Practical and achievable
- Each suggestion MUST include a realistic list of ingredients and clear step-by-step instructions.`;

      const response = await axios.post(`${OPENROUTER_BASE_URL}/chat/completions`, {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      }, {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'ForeverCookie AI'
        }
      });

      const content = response.data.choices[0].message.content;
      
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from OpenRouter');
      }
      
      const suggestions = JSON.parse(jsonMatch[0]);
      for (const suggestion of suggestions) {
        if (!suggestion.image) suggestion.image = '/cookie1.jpg';
        if (!suggestion.ingredients) suggestion.ingredients = [];
        if (!suggestion.instructions) suggestion.instructions = [];
      }
      return suggestions;
    } catch (error) {
      console.error('OpenRouter API error:', error.response?.data || error.message);
      throw new Error('Failed to suggest desserts');
    }
  });
};

const ingredientsToRecipe = async (ingredients) => {
  return geminiRateLimiter.execute(async () => {
    try {
      // Ensure ingredients is an array
      const ingredientsList = Array.isArray(ingredients) ? ingredients : [ingredients];
      const ingredientsText = ingredientsList.join(', ');
      
      const prompt = `You are a creative chef who can make amazing recipes from any combination of ingredients. Create a DELICIOUS recipe using these ingredients: ${ingredientsText}

IMPORTANT: Return ONLY a valid JSON object with this EXACT structure:
{
  "title": "Creative recipe name that highlights the key ingredients",
  "description": "A mouthwatering 2-3 sentence description explaining what makes this recipe special",
  "ingredients": [
    "2 cups all-purpose flour",
    "1 cup butter, softened",
    "3/4 cup granulated sugar",
    "2 large eggs",
    "1 tsp vanilla extract",
    "1 tsp baking soda",
    "1/2 tsp salt"
  ],
  "instructions": [
    "Preheat oven to 350°F (175°C). Grease a 9x13 inch baking pan.",
    "In a large bowl, cream together butter and sugar until light and fluffy.",
    "Beat in eggs one at a time, then stir in vanilla extract.",
    "In a separate bowl, whisk together flour, baking soda, and salt.",
    "Gradually blend the flour mixture into the butter mixture.",
    "Pour batter into prepared pan and spread evenly.",
    "Bake for 25-30 minutes until a toothpick inserted in center comes out clean.",
    "Cool in pan for 10 minutes, then cut into squares and serve."
  ],
  "prepTime": "15 minutes",
  "cookTime": "25 minutes",
  "servings": "12 servings",
  "difficulty": "easy",
  "tags": ["quick", "easy", "delicious"]
}

Make the recipe:
- Creative and uses the provided ingredients effectively
- Practical and achievable with standard kitchen equipment
- Delicious and well-balanced
- Include any additional common ingredients needed
- Clear, step-by-step instructions
- Appropriate cooking times and serving sizes`;

      const response = await axios.post(`${OPENROUTER_BASE_URL}/chat/completions`, {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1200
      }, {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'ForeverCookie AI'
        }
      });

      const content = response.data.choices[0].message.content;
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from OpenRouter');
      }
      
      const recipe = JSON.parse(jsonMatch[0]);
      if (!recipe.image) recipe.image = '/cookie1.jpg';
      return recipe;
    } catch (error) {
      console.error('OpenRouter API error:', error.response?.data || error.message);
      throw new Error('Failed to create recipe from ingredients');
    }
  });
};

module.exports = {
  generateRecipe,
  suggestDesserts,
  ingredientsToRecipe
}; 