import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Beaker, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';

const EstablishmentMocktailSuggestionsPage: React.FC = () => {
  // Sample data - in a real implementation, this would come from Supabase
  const suggestions = [
    {
      id: '1',
      name: 'Tropical Sunset',
      description: 'A refreshing blend of pineapple, orange, and grenadine with a splash of coconut water',
      suggestedBy: 'Sarah M.',
      date: '2023-11-29',
      status: 'pending',
      ingredients: 'Pineapple juice, Orange juice, Grenadine, Coconut water, Ice'
    },
    {
      id: '2', 
      name: 'Garden Fresh',
      description: 'Cucumber, mint, and lime with a hint of elderflower',
      suggestedBy: 'Mike R.',
      date: '2023-11-28',
      status: 'pending',
      ingredients: 'Cucumber, Fresh mint, Lime juice, Elderflower cordial, Soda water'
    },
    {
      id: '3',
      name: 'Berry Blast',
      description: 'Mixed berries with lemonade and a touch of rosemary',
      suggestedBy: 'Emma L.',
      date: '2023-11-27',
      status: 'approved',
      ingredients: 'Mixed berries, Lemonade, Fresh rosemary, Honey, Ice'
    }
  ];

  const handleApprove = (suggestionId: string) => {
    console.log('Approving suggestion:', suggestionId);
    // Implementation would update Supabase
  };

  const handleReject = (suggestionId: string) => {
    console.log('Rejecting suggestion:', suggestionId);
    // Implementation would update Supabase
  };

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
  const approvedSuggestions = suggestions.filter(s => s.status === 'approved');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Beaker className="text-spiritless-green" />
            Mocktail Suggestions
          </h1>
          <p className="text-gray-600 mt-2">Review and manage customer mocktail suggestions</p>
        </div>

        {/* Pending Suggestions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-orange-500" />
            Pending Suggestions ({pendingSuggestions.length})
          </h2>
          <div className="grid gap-4">
            {pendingSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="border-l-4 border-l-orange-400">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{suggestion.name}</span>
                    <span className="text-sm text-gray-500">by {suggestion.suggestedBy}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">{suggestion.description}</p>
                  <div className="mb-4">
                    <h4 className="font-medium mb-1">Ingredients:</h4>
                    <p className="text-sm text-gray-600">{suggestion.ingredients}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleApprove(suggestion.id)}
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Approve & Add to Menu
                    </Button>
                    <Button 
                      onClick={() => handleReject(suggestion.id)}
                      variant="outline"
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Approved Suggestions */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <ThumbsUp className="h-6 w-6 text-green-500" />
            Approved & Added ({approvedSuggestions.length})
          </h2>
          <div className="grid gap-4">
            {approvedSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="border-l-4 border-l-green-400">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{suggestion.name}</span>
                    <span className="text-sm text-gray-500">by {suggestion.suggestedBy}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">{suggestion.description}</p>
                  <div className="mb-2">
                    <h4 className="font-medium mb-1">Ingredients:</h4>
                    <p className="text-sm text-gray-600">{suggestion.ingredients}</p>
                  </div>
                  <p className="text-sm text-green-600 font-medium">✓ Added to menu on {suggestion.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EstablishmentMocktailSuggestionsPage;