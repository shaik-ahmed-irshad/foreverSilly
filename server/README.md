# ForeverCookie Backend API

A full Express.js backend for the ForeverCookie AI-powered cookie store application.

## Features

- 🍪 AI-powered recipe generation using OpenRouter (GPT-3.5)
- 🧁 Dessert suggestions based on mood, time, and diet
- 📝 Recipe creation from available ingredients
- 📦 Cookie pre-order management with Supabase
- 🔐 User authentication (email/password + Google OAuth)
- 🛡️ Input validation and security middleware
- 🚀 Rate limiting and CORS support

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenRouter API key
- Supabase project (optional, for orders and auth)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your actual values:
   ```env
   PORT=3000
   NODE_ENV=development
   OPENROUTER_API_KEY=your_actual_openrouter_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

3. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### AI Recipe Generation

#### `POST /api/generate-recipe`
Generate a custom cookie recipe using AI.

**Request Body:**
```json
{
  "ingredients": ["flour", "butter", "chocolate chips"],
  "texture": "chewy",
  "diet": "none"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Chocolate Chip Cookie Recipe",
    "description": "Delicious chewy chocolate chip cookies",
    "ingredients": {
      "dry": ["2 1/4 cups flour", "1 tsp baking soda"],
      "wet": ["1 cup butter", "3/4 cup sugar"]
    },
    "instructions": ["Preheat oven to 375°F", "Cream butter and sugar"],
    "bakingTime": "10-12 minutes",
    "temperature": "375°F",
    "yield": "24 cookies",
    "difficulty": "easy",
    "tags": ["chocolate", "chewy"]
  }
}
```

#### `POST /api/suggest-dessert`
Get AI-powered dessert suggestions.

**Request Body:**
```json
{
  "mood": "happy",
  "time": "quick",
  "diet": "vegetarian"
}
```

#### `POST /api/ingredients-to-recipe`
Create a recipe from available ingredients.

**Request Body:**
```json
{
  "ingredients": ["eggs", "milk", "flour", "sugar"]
}
```

### Recipe Library

#### `GET /api/recipes`
Get static recipe library (loads from `client/src/data/recipes.json`).

### Order Management

#### `POST /api/order`
Create a new cookie pre-order.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "date": "2024-01-15",
  "type": "Chocolate Chip",
  "note": "Extra crispy please"
}
```

#### `GET /api/order`
Get all orders (admin endpoint).

#### `GET /api/order/:id`
Get specific order details.

#### `PUT /api/order/:id/status`
Update order status.

### Authentication

#### `POST /api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### `POST /api/auth/login`
User login.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### `POST /api/auth/google`
Initiate Google OAuth login.

#### `POST /api/auth/logout`
User logout.

#### `GET /api/auth/me`
Get current user information.

## Database Schema

### Orders Table (Supabase)
```sql
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
```

## Project Structure

```
server/
├── controllers/          # Request handlers
│   ├── recipeController.js
│   ├── orderController.js
│   └── authController.js
├── routes/              # API route definitions
│   ├── generateRecipe.js
│   ├── suggestDessert.js
│   ├── ingredientsToRecipe.js
│   ├── recipes.js
│   ├── order.js
│   └── auth.js
├── utils/               # Utility functions
│   ├── gemini.js        # AI integration (OpenRouter)
│   ├── supabase.js      # Database operations
│   └── validation.js    # Input validation
├── server.js            # Main server file
├── package.json
├── env.example
└── README.md
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `OPENROUTER_API_KEY` | OpenRouter API key | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes (for orders/auth) |
| `SUPABASE_KEY` | Supabase anon key | Yes (for orders/auth) |

## Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend at `localhost:5173`
- **Input Validation**: Joi schemas for all endpoints
- **Error Handling**: Centralized error responses

## Development

### Running in Development
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### API Testing
You can test the API using tools like:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [curl](https://curl.se/)

Example curl command:
```bash
curl -X POST http://localhost:3000/api/generate-recipe \
  -H "Content-Type: application/json" \
  -d '{"ingredients":["flour","butter"],"texture":"chewy","diet":"none"}'
```

## Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Update CORS origins in `server.js`
3. Use environment variables for all secrets
4. Consider using PM2 or similar for process management

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **OpenRouter API errors**: Check your API key and quota
2. **Supabase connection issues**: Verify URL and key
3. **CORS errors**: Ensure frontend origin is correct
4. **Validation errors**: Check request body format

### Logs
The server logs all errors and API requests. Check the console for detailed error messages.

## Contributing

1. Follow the existing code structure
2. Add validation for new endpoints
3. Update this README for new features
4. Test thoroughly before submitting

## License

ISC License

## Order Notification Setup

### Email Notifications (Gmail + Nodemailer)

1. **Generate a Gmail App Password:**
   - Go to your Google Account > Security > 2-Step Verification (enable if not already).
   - Under 'App passwords', generate a new app password for 'Mail'.
   - Copy the generated password (it will look like 'abcd efgh ijkl mnop').

2. **Update your `.env` file:**
   - Add these lines (see `env.example`):
     ```env
     NOTIFY_EMAILS=youradmin@example.com
     GMAIL_USER=yourgmail@gmail.com
     GMAIL_PASS=your_gmail_app_password
     ```
   - You can add multiple emails separated by commas in `NOTIFY_EMAILS`.

3. **Restart your server** after updating the `.env` file.

4. **How it works:**
   - When a new order is placed, an email is sent to all addresses in `NOTIFY_EMAILS` with the order details.

### SMS Notifications (Planned)
- The backend has a placeholder for SMS notifications (e.g., Twilio). You can add phone numbers to `NOTIFY_PHONES` in your `.env` file, but SMS is not active yet.
- To enable in the future, add your Twilio credentials and logic in `orderController.js`. 