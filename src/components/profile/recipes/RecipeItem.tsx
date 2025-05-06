
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, PenSquare, Trash2, Building2 } from 'lucide-react';
import { RecipeItemProps } from './types';

const RecipeItem: React.FC<RecipeItemProps> = ({
  recipe,
  onEdit,
  onDelete,
  onShare,
  onSuggestToEstablishment,
  isDeleting,
  deletingId
}) => {
  if (!recipe) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(recipe);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    onDelete(recipe.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    onShare(recipe);
  };

  const handleSuggestToEstablishment = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSuggestToEstablishment) {
      onSuggestToEstablishment(recipe);
    }
  };

  const ingredients = recipe.ingredients || [];

  return (
    <Card key={recipe.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="sm:flex">
        <div className="sm:w-1/3">
          <img 
            src={recipe.image_url || 'https://placehold.co/300x200/CCCCCC/666666?text=Recipe+Image'} 
            alt={recipe.name || 'Recipe'} 
            className="h-40 sm:h-full w-full object-cover"
          />
        </div>
        <div className="sm:w-2/3">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{recipe.name || 'Untitled Recipe'}</CardTitle>
              <Badge variant="outline" className={`${recipe.is_public ? 'bg-green-50 text-green-700' : 'bg-spiritless-pink/10 text-spiritless-pink'}`}>
                {recipe.is_public ? 'Public' : 'Private'}
              </Badge>
            </div>
            <CardDescription>{recipe.description || 'No description'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Ingredients:</h4>
                {ingredients.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {ingredients.map((ingredient, idx) => (
                      <li key={idx}>
                        {ingredient.amount} {ingredient.unit || ''} {ingredient.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No ingredients added</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Instructions:</h4>
                <p className="text-sm text-muted-foreground">
                  {recipe.instructions || 'No instructions provided'}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4 pb-4">
            <div className="text-xs text-muted-foreground">
              Created: {formatDate(recipe.created_at)}
              {recipe.updated_at && recipe.updated_at !== recipe.created_at && (
                <> · Updated: {formatDate(recipe.updated_at)}</>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleShare}
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSuggestToEstablishment}
                title="Suggest to Establishment"
              >
                <Building2 className="h-4 w-4 text-spiritless-green" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleEdit}
                title="Edit"
              >
                <PenSquare className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDelete}
                disabled={isDeleting && deletingId === recipe.id}
                title="Delete"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default RecipeItem;
