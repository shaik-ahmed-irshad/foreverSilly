| Stage | Description          | Status          |
| ----- | -------------------- | --------------- |
| 0     | Tooling & Setup      | 🟡 In Progress  |
| 1     | Recipe Library       | 🔲 Not Started  |
| 2     | Pre-Order Page       | 🔲 Not Started  |
| 3     | AI Generator         | 🔲 Not Started  |
| 4     | Dessert Suggestion   | 🔲 Not Started  |
| 5     | What’s in My Kitchen | 🔲 Not Started  |
| 6     | Story Mode + Upload  | ⏳ Future (v2.0) |


🌱 STAGE 0: Foundation Setup
Goal: Set up the tools, repo, and layout needed to build fast.
| ✅ | Task                                                                                                   |
| - | ------------------------------------------------------------------------------------------------------ |
| ⬜ | Sign up & explore [Lovable.dev](https://lovable.dev/) – check free plan features/templates             |
| ⬜ | Try generating base UI via Lovable prompt: “AI-powered cookie store with recipe library and generator” |
| ⬜ | If limited, fallback to **Cursor** template → set up a fullstack app (Next.js or Node/React)           |
| ⬜ | Initialize **GitHub Repo**                                                                             |
| ⬜ | Connect project to **Vercel** (frontend) or **Render** (backend)                                       |
| ⬜ | Set up environment variables support (for Gemini, etc.)                                                |
| ⬜ | Setup project folder structure with placeholder pages:                                                 |

pages/
  └── index.tsx                  // landing
  └── order.tsx                  // cookie pre-order form
  └── recipes.tsx                // library
  └── ai/
        ├── generator.tsx        // recipe generator
        ├── suggestion.tsx       // “what to bake”
        └── ingredients.tsx      // “what’s in my kitchen?”
public/
  └── data/
        └── recipes.json         // seed file


🍪 STAGE 1: Static Recipe Library
Goal: Fill the app with content people care about.
| ✅ | Task                                                                      |
| - | ------------------------------------------------------------------------- |
| ⬜ | Use **GPT-4 (ChatGPT Plus)** to generate 100–200 cookie + dessert recipes |
| ⬜ | Format into structured `recipes.json`:                                    |
| ⬜ | Place recipes.json in public/data/ folder
| ⬜ | Build /recipes page to display the list with search & filters
{
  "title": "Chocolate Chip Cookies",
  "category": "Cookies",
  "ingredients": [...],
  "steps": [...],
  "time": "25 mins",
  "tags": ["eggless", "kids", "holiday"],
  "image_url": ""
}

📦 STAGE 2: Cookie Pre-Order Form
Goal: Let users place cookie orders simply and attractively.
| ✅ | Task                                                                    |
| - | ----------------------------------------------------------------------- |
| ⬜ | Build `/order` form (Name, Email, Delivery Date, Cookie Type, Quantity) |
| ⬜ | Add custom message field (e.g., “Happy Birthday John!”)                 |
| ⬜ | On submit, save to local file (dev) or Supabase/Firebase (prod)         |
| ⬜ | Optional: Send email confirmation (using EmailJS or SMTP)               |

🧠 STAGE 3: AI Recipe Generator
Goal: Users generate recipes on-the-fly via preferences.
| ✅ | Task                                                  |
| - | ----------------------------------------------------- |
| ⬜ | Setup **Gemini API** (Google AI Studio → get API Key) |
| ⬜ | Create prompt template:                               |
| ⬜ | Build UI: form for preference input (texture, ingredients, dietary)
| ⬜ | Call Gemini API, parse response, display recipe dynamically
| ⬜ | Optionally allow users to save it to their library
Generate a cookie recipe with [crunchy texture], [oats, honey], no eggs. Return title, ingredients, and steps.

🎯 STAGE 4: AI Dessert Suggestions
Goal: Help undecided users pick something sweet to make.
| ✅ | Task                                                |
| - | --------------------------------------------------- |
| ⬜ | Build form: Mood, available time, skill level, diet |
| ⬜ | Create Gemini prompt:                               |
| ⬜ | Show 1–3 suggestions with link to matching recipes (local)
Suggest a dessert for someone with 20 mins, gluten-free preference, beginner level, wants something cozy.

🥣 STAGE 5: What’s In My Kitchen?
Goal: AI helps users bake with what they have.
| ✅ | Task                                                                |
| - | ------------------------------------------------------------------- |
| ⬜ | Form for ingredients input                                          |
| ⬜ | Match against local `recipes.json` with fuzzy logic                 |
| ⬜ | If nothing matches well, fallback to Gemini to create custom recipe |
| ⬜ | Display best options sorted by match percentage                     |

🎬 STAGE 6: (v2.0 Optional Features)
Build these when your base app is stable.
| ✅ | Task                                                                                    |
| - | --------------------------------------------------------------------------------------- |
| ⬜ | **Story Mode Recipes** → Like Instagram stories for steps                               |
| ⬜ | **Upload Image to Recipe** → Use Replicate/HuggingFace to detect cookie & return recipe |
| ⬜ | Recipe feedback & ratings                                                               |
| ⬜ | Save/favorite recipes (user login)                                                      |
| ⬜ | Admin panel to view/manage pre-orders                                                   |
