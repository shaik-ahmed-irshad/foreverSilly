const { 
  signUpUser, 
  signInUser, 
  signInWithGoogle, 
  signOutUser, 
  getCurrentUser 
} = require('../utils/supabase');

// User signup
const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const userData = name ? { full_name: name } : {};
    const result = await signUpUser(email, password, userData);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        session: result.session
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to register user'
    });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await signInUser(email, password);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        session: result.session
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: error.message || 'Invalid credentials'
    });
  }
};

// Google OAuth login
const googleLogin = async (req, res) => {
  try {
    const result = await signInWithGoogle();
    
    res.json({
      success: true,
      message: 'Google OAuth initiated',
      data: result
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to initiate Google login'
    });
  }
};

// User logout
const logout = async (req, res) => {
  try {
    await signOutUser();
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to logout'
    });
  }
};

// Get current user
const getCurrentUserInfo = async (req, res) => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name,
          created_at: user.created_at
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get user info'
    });
  }
};

// OAuth callback handler
const oauthCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    
    // This would handle the OAuth callback
    // Implementation depends on your frontend routing
    res.json({
      success: true,
      message: 'OAuth callback received',
      data: { code, state }
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({
      success: false,
      error: 'OAuth callback failed'
    });
  }
};

module.exports = {
  signup,
  login,
  googleLogin,
  logout,
  getCurrentUserInfo,
  oauthCallback
}; 