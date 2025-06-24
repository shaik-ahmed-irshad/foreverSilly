require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testRecipeData = {
  ingredients: ['flour', 'butter', 'chocolate chips'],
  texture: 'chewy',
  diet: 'none'
};

const testDessertData = {
  mood: 'happy',
  time: 'quick',
  diet: 'vegetarian'
};

const testIngredientsData = {
  ingredients: ['eggs', 'milk', 'flour', 'sugar']
};

const testOrderData = {
  name: 'Test User',
  email: 'test@example.com',
  date: '2024-12-25',
  type: 'Chocolate Chip',
  note: 'Test order'
};

// Test functions
async function testHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Make sure the server is running on port 3000');
    }
    return false;
  }
}

async function testRecipes() {
  try {
    const response = await axios.get(`${BASE_URL}/api/recipes`);
    console.log('✅ Recipes endpoint:', response.data.success ? 'Success' : 'Failed');
    console.log(`   Found ${response.data.data.length} recipes`);
    return true;
  } catch (error) {
    console.error('❌ Recipes endpoint failed:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
    return false;
  }
}

async function testGenerateRecipe() {
  try {
    console.log('   Testing with:', JSON.stringify(testRecipeData));
    const response = await axios.post(`${BASE_URL}/api/generate-recipe`, testRecipeData);
    console.log('✅ Generate recipe endpoint:', response.data.success ? 'Success' : 'Failed');
    if (response.data.success) {
      console.log(`   Generated: ${response.data.data.title}`);
    } else {
      console.log(`   Error: ${response.data.error}`);
    }
    return true;
  } catch (error) {
    console.error('❌ Generate recipe endpoint failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Response:', error.response.data);
    }
    return false;
  }
}

async function testSuggestDessert() {
  try {
    console.log('   Testing with:', JSON.stringify(testDessertData));
    const response = await axios.post(`${BASE_URL}/api/suggest-dessert`, testDessertData);
    console.log('✅ Suggest dessert endpoint:', response.data.success ? 'Success' : 'Failed');
    if (response.data.success) {
      console.log(`   Suggested ${response.data.data.length} desserts`);
    } else {
      console.log(`   Error: ${response.data.error}`);
    }
    return true;
  } catch (error) {
    console.error('❌ Suggest dessert endpoint failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Response:', error.response.data);
    }
    return false;
  }
}

async function testIngredientsToRecipe() {
  try {
    console.log('   Testing with:', JSON.stringify(testIngredientsData));
    const response = await axios.post(`${BASE_URL}/api/ingredients-to-recipe`, testIngredientsData);
    console.log('✅ Ingredients to recipe endpoint:', response.data.success ? 'Success' : 'Failed');
    if (response.data.success) {
      console.log(`   Created: ${response.data.data.title}`);
    } else {
      console.log(`   Error: ${response.data.error}`);
    }
    return true;
  } catch (error) {
    console.error('❌ Ingredients to recipe endpoint failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Response:', error.response.data);
    }
    return false;
  }
}

async function testCreateOrder() {
  try {
    console.log('   Testing with:', JSON.stringify(testOrderData));
    const response = await axios.post(`${BASE_URL}/api/order`, testOrderData);
    console.log('✅ Create order endpoint:', response.data.success ? 'Success' : 'Failed');
    if (response.data.success) {
      console.log(`   Order ID: ${response.data.data.id}`);
    } else {
      console.log(`   Error: ${response.data.error}`);
    }
    return true;
  } catch (error) {
    console.error('❌ Create order endpoint failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Response:', error.response.data);
    }
    return false;
  }
}

// Check environment variables
function checkEnvironment() {
  console.log('🔧 Environment Check:');
  
  const requiredVars = ['OPENROUTER_API_KEY', 'SUPABASE_URL', 'SUPABASE_KEY'];
  const missing = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
      console.log(`   ❌ ${varName}: Missing`);
    } else {
      console.log(`   ✅ ${varName}: Set`);
    }
  });
  
  if (missing.length > 0) {
    console.log(`\n⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.log('   Please check your .env file');
  }
  
  return missing.length === 0;
}

// Run all tests
async function runTests() {
  console.log('🧪 Testing ForeverCookie API...\n');
  
  // Check environment first
  const envOk = checkEnvironment();
  console.log('');
  
  if (!envOk) {
    console.log('⚠️  Some environment variables are missing. Some tests may fail.\n');
  }
  
  const results = [];
  
  results.push(await testHealth());
  results.push(await testRecipes());
  results.push(await testGenerateRecipe());
  results.push(await testSuggestDessert());
  results.push(await testIngredientsToRecipe());
  results.push(await testCreateOrder());
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n🏁 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Your backend is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testHealth,
  testRecipes,
  testGenerateRecipe,
  testSuggestDessert,
  testIngredientsToRecipe,
  testCreateOrder,
  runTests
}; 