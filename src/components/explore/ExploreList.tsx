
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Establishment, Cocktail } from '@/types/ProfileTypes';

interface ExploreListProps {
  establishments: Establishment[];
  cocktails: Cocktail[];
  searchEstablishments: (term: string) => void;
  searchCocktails: (term: string) => void;
}

export const ExploreList: React.FC<ExploreListProps> = ({ 
  establishments, 
  cocktails, 
  searchEstablishments, 
  searchCocktails 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Establishments ({establishments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the explore list component.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Cocktails ({cocktails.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the cocktails list.</p>
        </CardContent>
      </Card>
    </div>
  );
};
