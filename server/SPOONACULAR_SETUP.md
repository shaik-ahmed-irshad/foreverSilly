# Spoonacular API Setup Guide

## What is Spoonacular?

Spoonacular is a free recipe API that provides access to thousands of recipes. The free plan includes:
- **150 requests per day** (perfect for development and small projects)
- Access to recipe search, ingredients search, and recipe information
- No credit card required for free plan

## Step 1: Get Your API Key

1. Go to [https://spoonacular.com/food-api](https://spoonacular.com/food-api)
2. Click "Get a Free API Key"
3. Fill out the registration form:
   - Name
   - Email
   - Password
   - How you plan to use the API (select "Personal Project" or "Learning")
4. Verify your email
5. Log in to your account
6. Copy your API key from the dashboard

## Step 2: Add to Environment Variables

Add your API key to your `.env` file:

```env
SPOONACULAR_API_KEY=your_actual_spoonacular_api_key_here
```

## Step 3: Test the API

You can test if your API key works by running:

```bash
curl "https://api.spoonacular.com/recipes/complexSearch?apiKey=YOUR_API_KEY&query=cookie&number=1"
```

## API Features We're Using

### 1. Recipe Search
- **Endpoint**: `/recipes/complexSearch`
- **Purpose**: Get cookie and dessert recipes for the recipe library
- **Usage**: 1 request per page load

### 2. Recipe by Ingredients
- **Endpoint**: `/recipes/findByIngredients`
- **Purpose**: Find recipes based on available ingredients
- **Usage**: 1 request per search

### 3. Random Recipes
- **Endpoint**: `/recipes/random`
- **Purpose**: Get random dessert recipes
- **Usage**: 1 request per page load

### 4. Recipe Information
- **Endpoint**: `/recipes/informationBulk`
- **Purpose**: Get detailed recipe information
- **Usage**: 1 request per recipe detail view

## Rate Limits

- **Free Plan**: 150 requests per day
- **Requests per feature**:
  - Recipe library: ~1 request
  - Search by ingredients: ~2 requests (search + details)
  - Random recipes: ~1 request
  - Recipe details: ~1 request

## Fallback System

If the API key is not provided or quota is exceeded:
- The system will use built-in fallback recipes
- No errors will be shown to users
- The app continues to work normally

## Cost Considerations

- **Free Plan**: 150 requests/day (sufficient for development)
- **Paid Plans**: Start at $10/month for 1,500 requests/day
- **Enterprise**: Custom pricing for high-volume usage

## Troubleshooting

### "API key not found" error
- Check that `SPOONACULAR_API_KEY` is set in your `.env` file
- Make sure there are no spaces around the `=` sign
- Restart the server after adding the key

### "Quota exceeded" error
- Check your daily usage in the Spoonacular dashboard
- Wait until the next day for quota reset
- Consider upgrading to a paid plan for production

### "Invalid API key" error
- Verify the API key is correct
- Make sure you've activated your account
- Check if the key has been regenerated

## Production Considerations

For production deployment:
1. **Monitor usage**: Track API calls to stay within limits
2. **Caching**: Consider caching popular recipes
3. **Fallback**: Ensure fallback recipes are comprehensive
4. **Upgrade plan**: Consider paid plan for higher traffic

## Alternative APIs

If you need more requests or different features:
- **Edamam**: Another free recipe API
- **Recipe Puppy**: Simple recipe search API
- **TheMealDB**: Free recipe database

## Quick Test

Test your setup by visiting:
- `http://localhost:3000/api/recipes` - Should return cookie recipes
- `http://localhost:3000/api/recipes?type=random` - Should return random dessert recipes 