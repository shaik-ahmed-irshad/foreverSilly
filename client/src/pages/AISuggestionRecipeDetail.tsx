import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, Users } from 'lucide-react';

const AISuggestionRecipeDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const suggestion = location.state?.suggestion;

  if (!suggestion) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-red-600 mb-4">No suggestion data found.</p>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button asChild variant="ghost" className="mb-6">
          <span onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-purple-500 cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Suggestions
          </span>
        </Button>
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <img
              src={suggestion.image || "/cookie1.jpg"}
              alt={suggestion.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <CardTitle className="text-3xl text-gray-800 mb-4">{suggestion.title}</CardTitle>
            <p className="text-lg text-gray-600 mb-6">{suggestion.description}</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{suggestion.time}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>{suggestion.servings}</span>
              </div>
              {suggestion.difficulty && (
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-600">
                    {suggestion.difficulty}
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {suggestion.ingredients && suggestion.ingredients.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ingredients</h3>
                <ul className="space-y-2">
                  {suggestion.ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {suggestion.instructions && suggestion.instructions.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h3>
                <ol className="space-y-3">
                  {suggestion.instructions.map((instruction: string, index: number) => (
                    <li key={index} className="flex">
                      <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AISuggestionRecipeDetail; 