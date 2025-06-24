const Joi = require('joi');

// Recipe generation validation - updated to match frontend
const generateRecipeSchema = Joi.object({
  ingredients: Joi.string().optional().allow(''),
  texture: Joi.string().valid('soft', 'crunchy', 'fudgy', 'light').optional().allow(''),
  dietary: Joi.string().valid('none', 'vegan', 'gluten-free', 'dairy-free', 'sugar-free').optional().allow(''),
  sweetness: Joi.string().valid('low', 'medium', 'high').optional().allow(''),
  cookingTime: Joi.string().valid('quick', 'medium', 'long').optional().allow('')
});

// Dessert suggestion validation - updated to match frontend
const suggestDessertSchema = Joi.object({
  mood: Joi.string().valid('cozy', 'festive', 'energetic', 'relaxed', 'adventurous', 'nostalgic').optional().allow(''),
  timeAvailable: Joi.string().valid('quick', 'moderate', 'leisurely').optional().allow(''),
  skillLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').optional().allow(''),
  dietaryPreference: Joi.string().valid('none', 'vegan', 'gluten-free', 'dairy-free', 'sugar-free').optional().allow('')
});

// Ingredients to recipe validation - updated to match frontend
const ingredientsToRecipeSchema = Joi.object({
  ingredients: Joi.array().items(Joi.string().min(1)).min(1).required()
    .messages({
      'array.min': 'At least one ingredient is required',
      'any.required': 'Ingredients are required'
    })
});

// Order validation - updated to match frontend
const orderSchema = Joi.object({
  customerName: Joi.string().min(2).max(100).required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name is too long',
      'any.required': 'Name is required'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  phone: Joi.string().min(7).max(20).required()
    .messages({
      'string.min': 'Phone number is too short',
      'string.max': 'Phone number is too long',
      'any.required': 'Phone number is required'
    }),
  cookieType: Joi.string().min(1).max(100).required()
    .messages({
      'string.min': 'Cookie type is required',
      'string.max': 'Cookie type is too long',
      'any.required': 'Cookie type is required'
    }),
  quantity: Joi.number().integer().min(1).required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be a whole number',
      'number.min': 'Quantity must be at least 1',
      'any.required': 'Quantity is required'
    }),
  deliveryDate: Joi.string().optional().allow(''),
  customMessage: Joi.string().max(500).optional().allow(''),
  status: Joi.string().optional().allow('')
});

// Authentication validation
const signupSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string().min(8).required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    }),
  name: Joi.string().min(2).max(100).optional()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name is too long'
    })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string().required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};

module.exports = {
  generateRecipeSchema,
  suggestDessertSchema,
  ingredientsToRecipeSchema,
  orderSchema,
  signupSchema,
  loginSchema,
  validateRequest
}; 