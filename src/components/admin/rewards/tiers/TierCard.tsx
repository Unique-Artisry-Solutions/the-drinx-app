
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Crown, Check } from 'lucide-react';
import { RewardTier } from '@/lib/rewards/types';

interface TierCardProps {
  tier: RewardTier;
  onEdit: () => void;
  onDelete: () => void;
}

export const TierCard = ({ tier, onEdit, onDelete }: TierCardProps) => {
  // Generate a contrasting text color based on background color
  const getContrastColor = (hexColor: string): string => {
    if (!hexColor || !hexColor.startsWith('#')) return '#ffffff';
    
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate brightness (YIQ equation)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return black or white based on brightness
    return brightness > 125 ? '#000000' : '#ffffff';
  };

  const getBenefitIcon = (benefitType: string) => {
    switch (benefitType) {
      case 'discount':
        return '💰';
      case 'free_item':
        return '🎁';
      case 'priority_service':
        return '⭐';
      case 'exclusive_access':
        return '🔑';
      default:
        return '✓';
    }
  };

  const backgroundColor = tier.color || '#4f46e5';
  const textColor = getContrastColor(backgroundColor);

  return (
    <Card className="overflow-hidden">
      <CardHeader 
        className="flex flex-row items-center justify-between p-4"
        style={{ backgroundColor, color: textColor }}
      >
        <div className="flex items-center space-x-2">
          <Crown className="h-5 w-5" />
          <h3 className="text-lg font-bold">{tier.name}</h3>
        </div>
        <Badge 
          variant="outline" 
          className="font-bold"
          style={{ borderColor: textColor, color: textColor }}
        >
          {tier.points_required} pts
        </Badge>
      </CardHeader>
      
      <CardContent className="p-4">
        {tier.description && (
          <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
        )}
        
        <h4 className="text-sm font-medium mb-2">Benefits:</h4>
        {tier.benefits && Array.isArray(tier.benefits) && tier.benefits.length > 0 ? (
          <ul className="space-y-1">
            {tier.benefits.map((benefit: any, index: number) => (
              <li key={index} className="text-sm flex items-start">
                <span className="mr-2">
                  {benefit.type ? getBenefitIcon(benefit.type) : '✓'}
                </span>
                <span>{benefit.description}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No benefits defined</p>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 bg-muted/20 border-t">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
