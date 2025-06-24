require('dotenv').config();
const axios = require('axios');

const BACKEND_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:8080';

console.log('🛡️  Safe Testing (Minimal API Usage)...\n');

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

// Test non-AI endpoints
async function testNonAIEndpoints() {
  console.log('\n📋 Testing Non-AI Endpoints...');
  
  const endpoints = [
    { name: 'Recipes', method: 'GET', url: '/api/recipes' },
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

  console.log(`📊 Non-AI Results: ${passed}/${total} working`);
  return passed === total;
}

// Test ONE AI endpoint (with confirmation)
async function testOneAIEndpoint() {
  console.log('\n🤖 Testing ONE AI Endpoint (1 API call)...');
  console.log('⚠️  This will use 1 Gemini API call. Continue? (y/N)');
  
  // In a real scenario, you'd wait for user input
  // For now, we'll skip unless explicitly requested
  const shouldTest = process.argv.includes('--test-ai');
  
  if (!shouldTest) {
    console.log('⏭️  Skipping AI test (use --test-ai flag to test)');
    return true;
  }
  
  try {
    console.log('🚀 Testing recipe generation...');
    const response = await axios.post(`${BACKEND_URL}/api/generate-recipe`, {
      ingredients: ['flour', 'butter'],
      texture: 'chewy',
      diet: 'none'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': FRONTEND_URL
      }
    });
    
    if (response.status >= 200 && response.status < 300) {
      console.log('✅ AI endpoint working!');
      console.log(`   Generated: ${response.data.data.title}`);
      return true;
    } else {
      console.log(`⚠️  AI endpoint: Unexpected status ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.response) {
      console.log(`❌ AI endpoint: ${error.response.status} - ${error.response.data?.error || 'Error'}`);
    } else {
      console.log(`❌ AI endpoint: ${error.message}`);
    }
    return false;
  }
}

// Show frontend testing instructions
function showFrontendInstructions() {
  console.log('\n🎯 Frontend Testing Instructions:');
  console.log('=====================================');
  console.log('1. Make sure both servers are running:');
  console.log('   Backend:  cd server && npm run dev');
  console.log('   Frontend: cd client && npm run dev');
  console.log('');
  console.log('2. Open your browser to: http://localhost:8080');
  console.log('');
  console.log('3. Test AI features through the UI:');
  console.log('   • Go to /ai/generator - Test recipe generation (1 API call)');
  console.log('   • Go to /ai/suggestion - Test dessert suggestions (1 API call)');
  console.log('   • Go to /ai/ingredients - Test ingredients to recipe (1 API call)');
  console.log('');
  console.log('4. Each feature test = 1 Gemini API call (much safer!)');
  console.log('');
  console.log('5. Monitor server logs to see API calls and responses');
  console.log('');
  console.log('💡 This approach is much more realistic and quota-friendly!');
}

// Main test
async function runSafeTests() {
  console.log('🔧 Checking environment...');
  
  const requiredVars = ['GEMINI_API_KEY', 'SUPABASE_URL', 'SUPABASE_KEY'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.log(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.log('   Please check your .env file\n');
  } else {
    console.log('✅ All environment variables are set\n');
  }

  const results = [];
  
  results.push(await testBackendHealth());
  results.push(await testFrontendAccess());
  results.push(await testNonAIEndpoints());
  
  // Only test AI if explicitly requested
  const testAI = process.argv.includes('--test-ai');
  if (testAI) {
    results.push(await testOneAIEndpoint());
  }
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n🏁 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 Backend is ready for frontend testing!');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
  
  showFrontendInstructions();
}

// Run if called directly
if (require.main === module) {
  runSafeTests().catch(console.error);
}

module.exports = {
  testBackendHealth,
  testFrontendAccess,
  testNonAIEndpoints,
  testOneAIEndpoint,
  runSafeTests
}; 