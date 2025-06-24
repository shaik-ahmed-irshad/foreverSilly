const fs = require('fs');
const path = require('path');

console.log('🍪 ForeverCookie Backend Setup\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  
  const envTemplate = `# Server Configuration
PORT=3000
NODE_ENV=development

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Optional: Production domain for CORS
# PRODUCTION_DOMAIN=https://yourdomain.com
`;
  
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created! Please update it with your actual API keys.\n');
} else {
  console.log('✅ .env file already exists.\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  console.log('   Run: npm install\n');
} else {
  console.log('✅ Dependencies already installed.\n');
}

console.log('🚀 Next steps:');
console.log('1. Update .env file with your API keys');
console.log('2. Run: npm install (if not done already)');
console.log('3. Run: npm run dev (to start development server)');
console.log('4. Run: npm test (to test the API endpoints)');
console.log('\n📚 Check README.md for detailed documentation!'); 