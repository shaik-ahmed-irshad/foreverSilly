const path = require('path');
const fs = require('fs');

console.log('🔍 Environment Variable Debug\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file exists');
  
  // Read and parse .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  console.log('\n📝 .env file contents:');
  lines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    console.log(`   ${key}=${value ? '***' : '(empty)'}`);
  });
  
  // Check for common issues
  console.log('\n🔧 Checking for common issues:');
  
  const issues = [];
  
  // Check for spaces around =
  lines.forEach((line, index) => {
    if (line.includes(' = ') || line.includes('= ')) {
      issues.push(`Line ${index + 1}: Has spaces around = sign`);
    }
  });
  
  // Check for missing values
  lines.forEach((line, index) => {
    const [key, value] = line.split('=');
    if (!value || value.trim() === '') {
      issues.push(`Line ${index + 1}: ${key} has no value`);
    }
  });
  
  if (issues.length > 0) {
    console.log('❌ Issues found:');
    issues.forEach(issue => console.log(`   - ${issue}`));
  } else {
    console.log('✅ No obvious formatting issues found');
  }
  
} else {
  console.log('❌ .env file does not exist');
  console.log('   Run: npm run setup');
}

// Load dotenv and check environment
console.log('\n🌍 Environment after dotenv load:');
require('dotenv').config();

const requiredVars = ['OPENROUTER_API_KEY', 'SUPABASE_URL', 'SUPABASE_KEY'];
const missing = [];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    missing.push(varName);
    console.log(`   ❌ ${varName}: Not set`);
  } else {
    console.log(`   ✅ ${varName}: Set (${value.substring(0, 10)}...)`);
  }
});

if (missing.length > 0) {
  console.log(`\n⚠️  Missing variables: ${missing.join(', ')}`);
  console.log('\n💡 Solutions:');
  console.log('1. Make sure .env file exists in the server directory');
  console.log('2. Check that variable names are correct (no typos)');
  console.log('3. Ensure no spaces around = sign');
  console.log('4. Restart the server after changing .env');
  console.log('5. Example format:');
  console.log('   OPENROUTER_API_KEY=sk-or-...');
  console.log('   SUPABASE_URL=https://your-project.supabase.co');
  console.log('   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
} else {
  console.log('\n🎉 All environment variables are properly loaded!');
}

// Test OpenRouter API key format
const openrouterKey = process.env.OPENROUTER_API_KEY;
if (openrouterKey) {
  if (openrouterKey.startsWith('sk-or-')) {
    console.log('✅ OpenRouter API key format looks correct');
  } else {
    console.log('⚠️  OpenRouter API key format may be incorrect (should start with sk-or-)');
  }
}

// Test Supabase URL format
const supabaseUrl = process.env.SUPABASE_URL;
if (supabaseUrl) {
  if (supabaseUrl.includes('supabase.co')) {
    console.log('✅ Supabase URL format looks correct');
  } else {
    console.log('⚠️  Supabase URL format may be incorrect (should contain supabase.co)');
  }
} 