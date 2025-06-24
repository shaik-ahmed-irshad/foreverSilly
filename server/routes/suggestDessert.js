const express = require('express');
const router = express.Router();
const { suggestDessert } = require('../controllers/recipeController');
const { validateRequest, suggestDessertSchema } = require('../utils/validation');

// POST /api/suggest-dessert
router.post('/', validateRequest(suggestDessertSchema), suggestDessert);

module.exports = router; 