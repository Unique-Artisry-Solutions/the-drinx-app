
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Beaker, ArrowRight } from 'lucide-react';

interface MocktailSuggestionsCardProps {
  pendingSuggestionCount: number;
}

const MocktailSuggestionsCard: React.FC<MocktailSuggestionsCardProps> = ({ 
  pendingSuggestionCount 
}) => {
  const navigate = useNavigate();
  
  const handleViewSuggestions = () => {
    navigate('/establishment/mocktail-suggestions');
  };
  
  return (
    <Card className="shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Beaker className="mr-2 h-5 w-5 text-spiritless-green" />
          Mocktail Suggestions
        </CardTitle>
        <CardDescription>Review and manage user suggestions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Pending suggestions</span>
            <span className="font-medium">
              {pendingSuggestionCount}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={handleViewSuggestions}
          >
            View all suggestions
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MocktailSuggestionsCard;
