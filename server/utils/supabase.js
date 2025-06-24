const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase credentials not found. Some features may not work.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Order management
const createOrder = async (orderData) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        customer_name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        order_date: orderData.date,
        cookie_type: orderData.type,
        notes: orderData.note,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create order');
    }

    return data[0];
  } catch (error) {
    console.error('Order creation error:', error);
    throw error;
  }
};

const getOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch orders');
    }

    return data;
  } catch (error) {
    console.error('Order fetch error:', error);
    throw error;
  }
};

// User authentication
const signUpUser = async (email, password, userData = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    if (error) {
      console.error('Supabase signup error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('User signup error:', error);
    throw error;
  }
};

const signInUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Supabase signin error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('User signin error:', error);
    throw error;
  }
};

const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: process.env.NODE_ENV === 'production' 
          ? 'https://yourdomain.com/auth/callback'
          : 'http://localhost:5173/auth/callback'
      }
    });

    if (error) {
      console.error('Supabase Google OAuth error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Google OAuth error:', error);
    throw error;
  }
};

const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Supabase signout error:', error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('User signout error:', error);
    throw error;
  }
};

const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Supabase get user error:', error);
      throw new Error(error.message);
    }

    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// Save a normal recipe to the recipes table
const saveRecipe = async (recipe) => {
  try {
    // Check for existing recipe by title
    const { data: existing, error: selectError } = await supabase
      .from('recipes')
      .select('*')
      .eq('title', recipe.title)
      .limit(1);
    if (selectError) throw new Error(selectError.message);
    if (existing && existing.length > 0) {
      // Already exists, do not insert duplicate
      return existing[0];
    }
    // Insert new recipe
    const { data, error } = await supabase
      .from('recipes')
      .insert([
        {
          spoonacular_id: recipe.id || null,
          title: recipe.title,
          description: recipe.description,
          image: recipe.image,
          prep_time: recipe.prepTime,
          cook_time: recipe.cookTime,
          total_time: recipe.totalTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          tags: recipe.tags ? JSON.stringify(recipe.tags) : null,
          ingredients: recipe.ingredients ? JSON.stringify(recipe.ingredients) : null,
          instructions: recipe.instructions ? JSON.stringify(recipe.instructions) : null,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    if (error) throw new Error(error.message);
    return data[0];
  } catch (error) {
    console.error('Save recipe error:', error);
    return null;
  }
};

// Save an AI-generated recipe
const saveAIRecipe = async (recipe) => {
  try {
    const { data, error } = await supabase
      .from('ai_recipes')
      .insert([
        {
          title: recipe.title,
          description: recipe.description,
          image: recipe.image,
          prep_time: recipe.prepTime,
          cook_time: recipe.cookTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          tags: recipe.tags ? JSON.stringify(recipe.tags) : null,
          ingredients: recipe.ingredients ? JSON.stringify(recipe.ingredients) : null,
          instructions: recipe.instructions ? JSON.stringify(recipe.instructions) : null,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    if (error) throw new Error(error.message);
    return data[0];
  } catch (error) {
    console.error('Save AI recipe error:', error);
    return null;
  }
};

// Save an AI suggestion
const saveAISuggestion = async (suggestion) => {
  try {
    const { data, error } = await supabase
      .from('ai_suggestions')
      .insert([
        {
          title: suggestion.title,
          description: suggestion.description,
          image: suggestion.image,
          time: suggestion.time,
          difficulty: suggestion.difficulty,
          servings: suggestion.servings,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    if (error) throw new Error(error.message);
    return data[0];
  } catch (error) {
    console.error('Save AI suggestion error:', error);
    return null;
  }
};

// Save an AI ingredient match
const saveAIIngredientMatch = async (match) => {
  try {
    const { data, error } = await supabase
      .from('ai_ingredient_matches')
      .insert([
        {
          title: match.title,
          description: match.description,
          image: match.image,
          time: match.time,
          servings: match.servings,
          match_percentage: match.matchPercentage,
          missing_ingredients: match.missingIngredients ? JSON.stringify(match.missingIngredients) : null,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    if (error) throw new Error(error.message);
    return data[0];
  } catch (error) {
    console.error('Save AI ingredient match error:', error);
    return null;
  }
};

module.exports = {
  createOrder,
  getOrders,
  signUpUser,
  signInUser,
  signInWithGoogle,
  signOutUser,
  getCurrentUser,
  saveRecipe,
  saveAIRecipe,
  saveAISuggestion,
  saveAIIngredientMatch
}; 