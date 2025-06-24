require('dotenv').config();
const axios = require('axios');

console.log('🧪 Testing OpenRouter API Directly...\n');

// Check environment
console.log('🔧 Environment Check:');
const openrouterKey = process.env.OPENROUTER_API_KEY;
if (!openrouterKey) {
  console.log('❌ OPENROUTER_API_KEY not found in environment');
  process.exit(1);
}

if (!openrouterKey.startsWith('sk-or-')) {
  console.log('⚠️  OPENROUTER_API_KEY format may be incorrect (should start with sk-or-)');
}

console.log('✅ OPENROUTER_API_KEY found');

// Test OpenRouter API
async function testOpenRouter() {
  try {
    console.log('\n🚀 Testing OpenRouter API...');
    
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: 'Say "Hello from ForeverCookie!" and nothing else.'
        }
      ],
      temperature: 0.7,
      max_tokens: 50
    }, {
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'ForeverCookie AI'
      }
    });
    
    const content = response.data.choices[0].message.content;
    
    console.log('✅ OpenRouter API working!');
    console.log(`   Response: "${content}"`);
    
    return true;
  } catch (error) {
    console.error('❌ OpenRouter API test failed:');
    console.error('   Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.error('   This looks like an API key issue');
    } else if (error.response?.status === 429) {
      console.error('   This looks like a rate limit issue');
    } else if (error.response?.status === 400) {
      console.error('   This looks like a request format issue');
    }
    
    return false;
  }
}

// Run test
testOpenRouter().then(success => {
  if (success) {
    console.log('\n🎉 OpenRouter API is working correctly!');
  } else {
    console.log('\n⚠️  OpenRouter API has issues. Check the error above.');
  }
}).catch(console.error); 