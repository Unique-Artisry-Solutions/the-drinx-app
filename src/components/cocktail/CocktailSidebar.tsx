
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface SimilarCocktail {
  id: string;
  name: string;
  image?: string;
  establishment: string | { name: string };
}

interface CocktailSidebarProps {
  likeCount: number;
  lastOrdered: string | null;
  similarCocktails: SimilarCocktail[];
}

const CocktailSidebar: React.FC<CocktailSidebarProps> = ({ 
  likeCount, 
  lastOrdered, 
  similarCocktails 
}) => {
  return (
    <div>
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="text-center mb-4">
            <div className="flex justify-center">
              <div className="bg-material-primary/10 rounded-full h-20 w-20 flex items-center justify-center">
                <Heart size={32} className="text-material-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-2">{likeCount}</h3>
            <p className="text-material-on-surface-variant">People love this mocktail</p>
          </div>
          
          {lastOrdered && (
            <div className="text-center pt-4 border-t">
              <p className="text-material-on-surface-variant">Last ordered</p>
              <p className="font-medium">{lastOrdered}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Similar Mocktails</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {similarCocktails.map(cocktail => (
              <Link key={cocktail.id} to={`/cocktail/${cocktail.id}`}>
                <div className="flex items-center p-2 rounded-lg hover:bg-material-primary/5 transition-colors">
                  <div 
                    className="h-12 w-12 rounded-md bg-cover bg-center mr-3"
                    style={{ backgroundImage: `url(${cocktail.image || '/placeholder.svg'})` }}
                  />
                  <div>
                    <h4 className="font-medium">{cocktail.name}</h4>
                    <p className="text-xs text-material-on-surface-variant">
                      {typeof cocktail.establishment === 'object' 
                        ? cocktail.establishment.name 
                        : cocktail.establishment}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CocktailSidebar;
