const express = require('express');
const router = express.Router();
const { getRecipes, searchRecipesByIngredientsAPI } = require('../controllers/recipeController');
const { validateRequest, ingredientsToRecipeSchema } = require('../utils/validation');

// GET /api/recipes - Get recipes (with optional query parameters)
router.get('/', getRecipes);

// POST /api/recipes/search-by-ingredients - Search recipes by ingredients
router.post('/search-by-ingredients', validateRequest(ingredientsToRecipeSchema), searchRecipesByIngredientsAPI);

module.exports = router; 