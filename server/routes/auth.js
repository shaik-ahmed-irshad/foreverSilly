const express = require('express');
const router = express.Router();
const { 
  signup, 
  login, 
  googleLogin, 
  logout, 
  getCurrentUserInfo, 
  oauthCallback 
} = require('../controllers/authController');
const { validateRequest, signupSchema, loginSchema } = require('../utils/validation');

// POST /api/auth/signup - User registration
router.post('/signup', validateRequest(signupSchema), signup);

// POST /api/auth/login - User login
router.post('/login', validateRequest(loginSchema), login);

// POST /api/auth/google - Google OAuth login
router.post('/google', googleLogin);

// POST /api/auth/logout - User logout
router.post('/logout', logout);

// GET /api/auth/me - Get current user info
router.get('/me', getCurrentUserInfo);

// GET /api/auth/callback - OAuth callback
router.get('/callback', oauthCallback);

module.exports = router; 