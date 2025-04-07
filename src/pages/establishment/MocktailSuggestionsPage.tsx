
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useMocktailSuggestions } from '@/hooks/useMocktailSuggestions';
import { MocktailSuggestion } from '@/types/DatabaseTypes';

const MocktailSuggestionsPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedSuggestion, setSelectedSuggestion] = useState<MocktailSuggestion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isApprove, setIsApprove] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get current establishment ID from the user profile
  const [establishmentId, setEstablishmentId] = useState<string | null>(null);
  
  // Use the custom hook to get suggestion data
  const { 
    getEstablishmentSuggestions,
    updateSuggestionStatus
  } = useMocktailSuggestions();
  
  // Fetch suggestions for this establishment
  const { 
    data: suggestions = [], 
    isLoading, 
    refetch 
  } = getEstablishmentSuggestions(establishmentId || '');
  
  useEffect(() => {
    const fetchEstablishmentId = async () => {
      // In a real app, you would get the establishment ID from the user profile or session
      // For this demo, we'll set a placeholder value
      setEstablishmentId('est1');
    };
    
    fetchEstablishmentId();
  }, [user]);
  
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
  const approvedSuggestions = suggestions.filter(s => s.status === 'approved');
  const rejectedSuggestions = suggestions.filter(s => s.status === 'rejected');

  const handleAccept = (suggestion: MocktailSuggestion) => {
    setSelectedSuggestion(suggestion);
    setIsApprove(true);
    setFeedback("Thank you for your suggestion! We've added it to our menu.");
    setIsDialogOpen(true);
  };

  const handleReject = (suggestion: MocktailSuggestion) => {
    setSelectedSuggestion(suggestion);
    setIsApprove(false);
    setFeedback("Thank you for your suggestion, but we won't be able to add it to our menu at this time.");
    setIsDialogOpen(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedSuggestion) return;

    try {
      await updateSuggestionStatus.mutateAsync({
        id: selectedSuggestion.id,
        status: isApprove ? 'approved' : 'rejected',
        feedback
      });
      
      toast({
        title: `Suggestion ${isApprove ? 'approved' : 'rejected'}`,
        description: `You have ${isApprove ? 'approved' : 'rejected'} the "${selectedSuggestion.name}" suggestion.`,
      });
      
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating suggestion:', error);
      toast({
        title: 'Error',
        description: 'Failed to update suggestion status. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text">Mocktail Suggestions</h1>
          <p className="text-material-on-surface-variant">Review and manage mocktail suggestions from users</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending">
                Pending
                {pendingSuggestions.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{pendingSuggestions.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
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

            <TabsContent value="approved" className="space-y-4">
              {approvedSuggestions.length > 0 ? (
                approvedSuggestions.map(suggestion => (
                  <SuggestionCard 
                    key={suggestion.id} 
                    suggestion={suggestion} 
                    showActions={false}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center py-10">
                    <p className="text-material-on-surface-variant">No approved suggestions</p>
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
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Provide Feedback</DialogTitle>
              <DialogDescription>
                Let the user know why you've {isApprove ? 'approved' : 'rejected'} their suggestion.
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
                variant={isApprove ? 'default' : 'destructive'}
                onClick={handleFeedbackSubmit}
                disabled={updateSuggestionStatus.isPending}
              >
                {updateSuggestionStatus.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isApprove ? 'Approve & Send' : 'Reject & Send'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

interface SuggestionCardProps {
  suggestion: MocktailSuggestion & { user_name?: string };
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
  // Format ingredients array for display
  const ingredients = suggestion.ingredients.map(ing => 
    typeof ing === 'string' ? ing : `${ing.name} ${ing.amount ? `(${ing.amount})` : ''}`
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{suggestion.name}</CardTitle>
            <CardDescription>
              Suggested by {suggestion.user_name || 'Anonymous'} on {new Date(suggestion.created_at || '').toLocaleDateString()}
            </CardDescription>
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
            <Badge variant={suggestion.status === 'approved' ? 'default' : 'destructive'}>
              {suggestion.status === 'approved' ? 'Approved' : 'Rejected'}
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
              {ingredients.map((ingredient, index) => (
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
