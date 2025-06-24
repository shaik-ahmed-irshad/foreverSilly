const express = require('express');
const router = express.Router();
const { generateARecipe } = require('../controllers/recipeController');
const { validateRequest, generateRecipeSchema } = require('../utils/validation');

// POST /api/generate-recipe
router.post('/', validateRequest(generateRecipeSchema), generateARecipe);

module.exports = router; 