
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, MessageSquare } from 'lucide-react';
import { MocktailSuggestion } from '@/types/MocktailTypes';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

// Sample data
const SAMPLE_SUGGESTIONS: MocktailSuggestion[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Smith',
    establishmentId: 'est1',
    name: 'Virgin Mojito Twist',
    description: 'A refreshing twist on the classic mojito, with cucumber and basil.',
    ingredients: ['Lime juice', 'Fresh mint', 'Cucumber', 'Basil', 'Soda water', 'Sugar syrup'],
    instructions: 'Muddle mint, cucumber, and basil. Add lime juice and sugar syrup. Top with soda water.',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Emily Johnson',
    establishmentId: 'est1',
    name: 'Spicy Mango Delight',
    description: 'A sweet and spicy mocktail with fresh mango and a hint of chili.',
    ingredients: ['Mango puree', 'Lime juice', 'Chili syrup', 'Ginger beer', 'Fresh mint'],
    instructions: 'Mix mango puree with lime juice and chili syrup. Top with ginger beer and garnish with mint.',
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Michael Brown',
    establishmentId: 'est1',
    name: 'Berry Fusion',
    description: 'A mixed berry mocktail with a hint of rosemary.',
    ingredients: ['Mixed berries', 'Lemon juice', 'Rosemary syrup', 'Soda water', 'Fresh rosemary'],
    instructions: 'Muddle berries with lemon juice. Add rosemary syrup and top with soda water. Garnish with fresh rosemary.',
    status: 'accepted',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    feedback: "Great suggestion! We've added it to our menu."
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Sarah Miller',
    establishmentId: 'est1',
    name: 'Lavender Lemonade',
    description: 'A soothing lavender-infused lemonade.',
    ingredients: ['Lemon juice', 'Lavender syrup', 'Soda water', 'Fresh lavender', 'Honey'],
    instructions: 'Mix lemon juice with lavender syrup and honey. Top with soda water. Garnish with fresh lavender.',
    status: 'rejected',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    feedback: "Thanks for your suggestion, but we currently don't have access to fresh lavender for our bar."
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'David Wilson',
    establishmentId: 'est1',
    name: 'Cucumber Basil Cooler',
    description: 'A refreshing cooler perfect for hot summer days.',
    ingredients: ['Cucumber', 'Basil', 'Lime juice', 'Simple syrup', 'Soda water'],
    instructions: 'Muddle cucumber and basil. Add lime juice and simple syrup. Top with soda water.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const MocktailSuggestionsPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedSuggestion, setSelectedSuggestion] = useState<MocktailSuggestion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [suggestions, setSuggestions] = useState<MocktailSuggestion[]>(SAMPLE_SUGGESTIONS);
  const { toast } = useToast();

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
  const acceptedSuggestions = suggestions.filter(s => s.status === 'accepted');
  const rejectedSuggestions = suggestions.filter(s => s.status === 'rejected');

  const handleAccept = (suggestion: MocktailSuggestion) => {
    setSelectedSuggestion(suggestion);
    setFeedback("Thank you for your suggestion! We've added it to our menu.");
    setIsDialogOpen(true);
  };

  const handleReject = (suggestion: MocktailSuggestion) => {
    setSelectedSuggestion(suggestion);
    setFeedback("Thank you for your suggestion, but we won't be able to add it to our menu at this time.");
    setIsDialogOpen(true);
  };

  const handleFeedbackSubmit = (status: 'accepted' | 'rejected') => {
    if (!selectedSuggestion) return;

    const updatedSuggestions = suggestions.map(s => 
      s.id === selectedSuggestion.id 
        ? { ...s, status, feedback } 
        : s
    );
    
    setSuggestions(updatedSuggestions);
    setIsDialogOpen(false);
    
    toast({
      title: `Suggestion ${status === 'accepted' ? 'accepted' : 'rejected'}`,
      description: `You have ${status === 'accepted' ? 'accepted' : 'rejected'} the "${selectedSuggestion.name}" suggestion.`,
    });

    // In a real app, this would update the database and potentially notify the user
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text">Mocktail Suggestions</h1>
          <p className="text-material-on-surface-variant">Review and manage mocktail suggestions from users</p>
        </div>

        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              Pending
              {pendingSuggestions.length > 0 && (
                <Badge variant="secondary" className="ml-2">{pendingSuggestions.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingSuggestions.length > 0 ? (
              pendingSuggestions.map(suggestion => (
                <SuggestionCard 
                  key={suggestion.id} 
                  suggestion={suggestion} 
                  onAccept={handleAccept} 
                  onReject={handleReject} 
                />
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-10">
                  <p className="text-material-on-surface-variant">No pending suggestions</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {acceptedSuggestions.length > 0 ? (
              acceptedSuggestions.map(suggestion => (
                <SuggestionCard 
                  key={suggestion.id} 
                  suggestion={suggestion} 
                  showActions={false}
                />
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-10">
                  <p className="text-material-on-surface-variant">No accepted suggestions</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedSuggestions.length > 0 ? (
              rejectedSuggestions.map(suggestion => (
                <SuggestionCard 
                  key={suggestion.id} 
                  suggestion={suggestion} 
                  showActions={false} 
                />
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-10">
                  <p className="text-material-on-surface-variant">No rejected suggestions</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Provide Feedback</DialogTitle>
              <DialogDescription>
                Let the user know why you{"'"}ve {selectedSuggestion?.status === 'accepted' ? 'accepted' : 'rejected'} their suggestion.
              </DialogDescription>
            </DialogHeader>
            
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your feedback to the user..."
              className="min-h-[120px]"
            />
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button 
                variant={selectedSuggestion?.status === 'accepted' ? 'default' : 'destructive'}
                onClick={() => handleFeedbackSubmit(selectedSuggestion?.status as 'accepted' | 'rejected')}
              >
                {selectedSuggestion?.status === 'accepted' ? 'Accept & Send' : 'Reject & Send'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

interface SuggestionCardProps {
  suggestion: MocktailSuggestion;
  onAccept?: (suggestion: MocktailSuggestion) => void;
  onReject?: (suggestion: MocktailSuggestion) => void;
  showActions?: boolean;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ 
  suggestion, 
  onAccept, 
  onReject, 
  showActions = true 
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{suggestion.name}</CardTitle>
            <CardDescription>Suggested by {suggestion.userName} on {new Date(suggestion.createdAt).toLocaleDateString()}</CardDescription>
          </div>
          {showActions && (
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-green-500 border-green-500 hover:bg-green-50"
                onClick={() => onAccept?.(suggestion)}
              >
                <Check className="mr-1 h-4 w-4" />
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-500 border-red-500 hover:bg-red-50"
                onClick={() => onReject?.(suggestion)}
              >
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
          {!showActions && suggestion.status && (
            <Badge variant={suggestion.status === 'accepted' ? 'default' : 'destructive'}>
              {suggestion.status === 'accepted' ? 'Accepted' : 'Rejected'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold">Description</h4>
            <p className="text-gray-600">{suggestion.description}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold">Ingredients</h4>
            <ul className="list-disc pl-5 text-gray-600">
              {suggestion.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold">Instructions</h4>
            <p className="text-gray-600">{suggestion.instructions}</p>
          </div>

          {suggestion.feedback && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center text-sm font-medium mb-1">
                <MessageSquare className="h-4 w-4 mr-1" />
                Your Feedback
              </div>
              <p className="text-gray-600 text-sm">{suggestion.feedback}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MocktailSuggestionsPage;
