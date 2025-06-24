# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `forevercookie` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to you
6. Click "Create new project"
7. Wait for project to be created (2-3 minutes)

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. Add them to your `.env` file:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 3: Create Database Tables

### Option A: Using SQL Editor (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New query"
3. Paste and run this SQL:

```sql
-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  order_date DATE NOT NULL,
  cookie_type VARCHAR(100) NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (for authentication)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name VARCHAR(100),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Orders are viewable by everyone" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Orders can be created by everyone" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders can be updated by admin" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by owner" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profiles can be updated by owner" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


```

### Option B: Using Table Editor

1. Go to **Table Editor** in your Supabase dashboard
2. Click "Create a new table"
3. Create the `orders` table with these columns:

| Column Name | Type | Default Value | Primary Key |
|-------------|------|---------------|-------------|
| id | uuid | gen_random_uuid() | ✅ |
| customer_name | varchar(100) | - | - |
| email | varchar(255) | - | - |
| order_date | date | - | - |
| cookie_type | varchar(100) | - | - |
| notes | text | - | - |
| status | varchar(20) | 'pending' | - |
| created_at | timestamptz | now() | - |

## Step 4: Configure Authentication (Optional)

### Enable Google OAuth

1. Go to **Authentication** → **Providers**
2. Enable **Google**
3. Get Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Add Google credentials to Supabase:
   - **Client ID**: Your Google OAuth client ID
   - **Client Secret**: Your Google OAuth client secret

### Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize the email templates for:
   - Confirm signup
   - Magic link
   - Change email address
   - Reset password

## Step 5: Test Your Setup

### Test Database Connection

Run this in your server directory:
```bash
npm run debug
```

### Test Order Creation

```bash
curl -X POST http://localhost:3000/api/order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "date": "2024-12-25",
    "type": "Chocolate Chip",
    "note": "Test order"
  }'
```

### Check Database

1. Go to **Table Editor** in Supabase
2. Click on the `orders` table
3. You should see your test order

## Step 6: Environment Variables Format

Make sure your `.env` file has the correct format:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Gemini AI Configuration
GEMINI_API_KEY=AIzaSyC...your_actual_gemini_key_here

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_actual_supabase_key_here
```

**Important**: No spaces around the `=` sign!

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check that you copied the `anon public` key, not the `service_role` key
   - Verify the key starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

2. **"Table does not exist" error**
   - Make sure you ran the SQL commands in the SQL Editor
   - Check that the table name is exactly `orders`

3. **CORS errors**
   - The backend is already configured for CORS
   - Make sure your frontend is running on the correct port

4. **Authentication errors**
   - Check that you enabled the authentication providers you want to use
   - Verify OAuth redirect URIs are correct

### Getting Help

1. Check Supabase logs in the dashboard
2. Use the debug script: `npm run debug`
3. Check the troubleshooting guide: `TROUBLESHOOTING.md`

## ForeverCookie AI Tables (for Personal Recipe Database)

### 1. AI Recipes Table
```sql
CREATE TABLE ai_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  ingredients JSONB,
  instructions JSONB,
  prep_time VARCHAR(50),
  cook_time VARCHAR(50),
  servings VARCHAR(50),
  difficulty VARCHAR(50),
  tags JSONB,
  image VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. AI Suggestions Table
```sql
CREATE TABLE ai_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  time VARCHAR(50),
  difficulty VARCHAR(50),
  servings VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. AI Ingredient Matches Table
```sql
CREATE TABLE ai_ingredient_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  time VARCHAR(50),
  servings VARCHAR(50),
  match_percentage INTEGER,
  missing_ingredients JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spoonacular_id INTEGER, -- Optional: original API ID if available
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  prep_time VARCHAR(50),
  cook_time VARCHAR(50),
  total_time VARCHAR(50),
  servings VARCHAR(50),
  difficulty VARCHAR(50),
  tags JSONB,
  ingredients JSONB,
  instructions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

**Run these queries in your Supabase SQL editor to create the necessary tables for storing all AI-generated data.** 