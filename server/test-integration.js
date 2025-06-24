require('dotenv').config();
const axios = require('axios');

const BACKEND_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:8080';

console.log('🔗 Testing Frontend-Backend Integration...\n');

// Test backend health
async function testBackendHealth() {
  try {
    const response = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Backend is running:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Backend is not running:', error.message);
    return false;
  }
}

// Test frontend accessibility
async function testFrontendAccess() {
  try {
    const response = await axios.get(`${FRONTEND_URL}`, { timeout: 5000 });
    console.log('✅ Frontend is accessible (status:', response.status + ')');
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Frontend is not running on port 8080');
    } else {
      console.error('❌ Frontend access issue:', error.message);
    }
    return false;
  }
}

// Test CORS configuration
async function testCORS() {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/generate-recipe`, {
      ingredients: ['flour'],
      texture: 'chewy',
      diet: 'none'
    }, {
      headers: {
        'Origin': FRONTEND_URL,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ CORS is properly configured');
    return true;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.error('❌ CORS is blocking requests from frontend');
    } else {
      console.log('⚠️  CORS test inconclusive (API error, not CORS)');
    }
    return false;
  }
}

// Test API endpoints that frontend will use
async function testFrontendEndpoints() {
  const endpoints = [
    { name: 'Recipes', method: 'GET', url: '/api/recipes' },
    { name: 'Generate Recipe', method: 'POST', url: '/api/generate-recipe', data: {
      ingredients: ['flour', 'butter'],
      texture: 'chewy',
      diet: 'none'
    }},
    { name: 'Suggest Dessert', method: 'POST', url: '/api/suggest-dessert', data: {
      mood: 'happy',
      time: 'quick',
      diet: 'vegetarian'
    }},
    { name: 'Ingredients to Recipe', method: 'POST', url: '/api/ingredients-to-recipe', data: {
      ingredients: ['eggs', 'milk']
    }},
    { name: 'Create Order', method: 'POST', url: '/api/order', data: {
      name: 'Test User',
      email: 'test@example.com',
      date: '2024-12-25',
      type: 'Chocolate Chip',
      note: 'Test order'
    }}
  ];

  let passed = 0;
  let total = endpoints.length;

  for (const endpoint of endpoints) {
    try {
      const config = {
        method: endpoint.method,
        url: `${BACKEND_URL}${endpoint.url}`,
        headers: {
          'Content-Type': 'application/json',
          'Origin': FRONTEND_URL
        }
      };

      if (endpoint.data) {
        config.data = endpoint.data;
      }

      const response = await axios(config);
      
      if (response.status >= 200 && response.status < 300) {
        console.log(`✅ ${endpoint.name}: Working`);
        passed++;
      } else {
        console.log(`⚠️  ${endpoint.name}: Unexpected status ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${endpoint.name}: ${error.response.status} - ${error.response.data?.error || 'Error'}`);
      } else {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    }
  }

  console.log(`\n📊 Endpoint Test Results: ${passed}/${total} working`);
  return passed === total;
}

// Generate curl commands for manual testing
function generateCurlCommands() {
  console.log('\n📋 Manual Testing Commands:');
  console.log('You can test these endpoints manually:');
  console.log('');
  
  console.log('# Health check');
  console.log(`curl ${BACKEND_URL}/health`);
  console.log('');
  
  console.log('# Get recipes');
  console.log(`curl ${BACKEND_URL}/api/recipes`);
  console.log('');
  
  console.log('# Generate recipe');
  console.log(`curl -X POST ${BACKEND_URL}/api/generate-recipe \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"ingredients":["flour","butter"],"texture":"chewy","diet":"none"}\'');
  console.log('');
  
  console.log('# Create order');
  console.log(`curl -X POST ${BACKEND_URL}/api/order \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"name":"Test User","email":"test@example.com","date":"2024-12-25","type":"Chocolate Chip","note":"Test"}\'');
}

// Main integration test
async function runIntegrationTests() {
  console.log('🔧 Checking environment...');
  
  // Check if environment variables are set
  const requiredVars = ['GEMINI_API_KEY', 'SUPABASE_URL', 'SUPABASE_KEY'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.log(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.log('   Please check your .env file');
    console.log('   Make sure there are no spaces around the = sign');
    console.log('   Example: GEMINI_API_KEY=your_key_here\n');
  } else {
    console.log('✅ All environment variables are set\n');
  }

  const results = [];
  
  results.push(await testBackendHealth());
  results.push(await testFrontendAccess());
  results.push(await testCORS());
  results.push(await testFrontendEndpoints());
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n🏁 Integration Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 Frontend and backend are properly integrated!');
  } else {
    console.log('⚠️  Some integration issues found. Check the errors above.');
  }
  
  generateCurlCommands();
}

// Run if called directly
if (require.main === module) {
  runIntegrationTests().catch(console.error);
}

module.exports = {
  testBackendHealth,
  testFrontendAccess,
  testCORS,
  testFrontendEndpoints,
  runIntegrationTests
}; 