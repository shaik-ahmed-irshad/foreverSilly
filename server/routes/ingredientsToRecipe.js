const express = require('express');
const router = express.Router();
const { createRecipeFromIngredients } = require('../controllers/recipeController');
const { validateRequest, ingredientsToRecipeSchema } = require('../utils/validation');

// POST /api/ingredients-to-recipe
router.post('/', validateRequest(ingredientsToRecipeSchema), createRecipeFromIngredients);

module.exports = router; 