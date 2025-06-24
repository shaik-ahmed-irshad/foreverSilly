import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Order from "./pages/Order";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import AIGenerator from "./pages/AIGenerator";
import AISuggestion from "./pages/AISuggestion";
import AIIngredients from "./pages/AIIngredients";
import NotFound from "./pages/NotFound";
import AIIngredientRecipeDetail from './pages/AIIngredientRecipeDetail';
import AISuggestionRecipeDetail from './pages/AISuggestionRecipeDetail';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/order" element={<Order />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/ai/generator" element={<AIGenerator />} />
          <Route path="/ai/suggestion" element={<AISuggestion />} />
          <Route path="/ai/ingredients" element={<AIIngredients />} />
          <Route path="/ai/ingredient-recipe/:index" element={<AIIngredientRecipeDetail />} />
          <Route path="/ai/suggestion-recipe/:index" element={<AISuggestionRecipeDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
