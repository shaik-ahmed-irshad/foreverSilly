# Troubleshooting Guide

## Common Issues and Solutions

### 1. OpenRouter API Errors

**Error**: `401 Unauthorized`

**Solution**: 
- Check that your OpenRouter API key is valid
- Make sure the API key starts with `sk-or-`
- Get your API key from: https://openrouter.ai/keys

**Error**: `Failed to generate recipe`

**Solution**:
- Check if your OpenRouter API key is valid
- Verify you have sufficient quota (10,000 requests/month free)
- Check the API key format (should start with `sk-or-`)

**Error**: `429 Too Many Requests`

**Solution**:
- OpenRouter free tier allows 10,000 requests/month
- Check your usage in the OpenRouter dashboard
- Consider upgrading to a paid plan for higher limits

### 2. Supabase Connection Issues

**Error**: `Supabase credentials not found`

**Solution**:
- Add your Supabase URL and key to `.env` file
- Get credentials from your Supabase project dashboard
- Format: `https://your-project.supabase.co` and `your-anon-key`

### 3. Validation Errors

**Error**: `Validation failed`

**Solution**:
- Check the request body format matches the expected schema
- Ensure all required fields are provided
- Check data types (arrays, strings, etc.)

### 4. CORS Issues

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:
- Backend is configured for `localhost:5173` (frontend)
- Make sure frontend is running on the correct port
- Check if the origin is properly set in the CORS configuration

### 5. Port Conflicts

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
- Kill the process using port 3000: `lsof -ti:3000 | xargs kill -9`
- Or change the port in `.env`: `PORT=3001`

## Testing Your Setup

### 1. Environment Check
```bash
cd server
npm run setup
```

### 2. Backend Tests
```bash
npm test
```

### 3. Integration Tests
```bash
npm run test:integration
```

### 4. Manual API Testing
```bash
# Health check
curl http://localhost:3000/health

# Get recipes
curl http://localhost:3000/api/recipes

# Generate recipe
curl -X POST http://localhost:3000/api/generate-recipe \
  -H "Content-Type: application/json" \
  -d '{"ingredients":["flour","butter"],"texture":"chewy","diet":"none"}'
```

## Debug Mode

Enable debug logging by setting:
```bash
DEBUG=* npm run dev
```

## Common Frontend-Backend Issues

### 1. Frontend Can't Connect to Backend

**Symptoms**: 
- Network errors in browser console
- "Failed to fetch" errors

**Solutions**:
- Ensure backend is running on port 3000
- Check CORS configuration
- Verify API endpoints are correct

### 2. API Calls Returning Errors

**Symptoms**:
- 400, 500 status codes
- Validation errors

**Solutions**:
- Check request format in browser dev tools
- Verify all required fields are sent
- Check backend logs for detailed errors

### 3. Environment Variables Not Loading

**Symptoms**:
- API keys not found
- Missing configuration

**Solutions**:
- Restart the server after changing `.env`
- Check `.env` file format (no spaces around `=`)
- Verify file is in the server directory

## Performance Issues

### 1. Slow API Responses

**Solutions**:
- Check OpenRouter API response times
- Consider caching for static data
- Optimize database queries

### 2. Memory Issues

**Solutions**:
- Monitor memory usage
- Restart server periodically
- Check for memory leaks in long-running processes

## Production Deployment Issues

### 1. Environment Variables

**Solutions**:
- Set `NODE_ENV=production`
- Use proper production API keys
- Configure CORS for production domain

### 2. Port Configuration

**Solutions**:
- Use environment variable for port: `PORT=process.env.PORT || 3000`
- Configure reverse proxy if needed

## Getting Help

1. **Check the logs**: Look at server console output
2. **Test endpoints**: Use the provided test scripts
3. **Verify configuration**: Check `.env` file and API keys
4. **Check documentation**: Review README.md for setup instructions

## Quick Fixes

### Reset Everything
```bash
# Stop all processes
pkill -f node

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Restart with fresh environment
npm run dev
```

### Check All Services
```bash
# Backend health
curl http://localhost:3000/health

# Frontend accessibility
curl http://localhost:5173

# Test integration
npm run test:integration
``` 