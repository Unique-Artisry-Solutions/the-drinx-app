
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Snowflake, Sun, Leaf, Flower } from 'lucide-react';

interface SeasonalTemplate {
  id: string;
  name: string;
  season: string;
  description: string;
  icon: any;
  bonusMultiplier: number;
  specialRewards: string[];
}

interface SeasonalTemplateSelectorProps {
  onTemplateSelect: (template: SeasonalTemplate) => void;
}

export function SeasonalTemplateSelector({ onTemplateSelect }: SeasonalTemplateSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState('all');

  const seasonalTemplates: SeasonalTemplate[] = [
    {
      id: 'winter-wonderland',
      name: 'Winter Wonderland',
      season: 'winter',
      description: 'Double points on warm drinks and holiday specials',
      icon: Snowflake,
      bonusMultiplier: 2.0,
      specialRewards: ['Free hot chocolate', 'Holiday merchandise', 'Warm beverage upgrade']
    },
    {
      id: 'spring-fresh',
      name: 'Spring Fresh',
      season: 'spring',
      description: 'Bonus points for fresh ingredients and light drinks',
      icon: Flower,
      bonusMultiplier: 1.5,
      specialRewards: ['Fresh fruit smoothie', 'Garden salad', 'Herbal tea selection']
    },
    {
      id: 'summer-cool',
      name: 'Summer Cool',
      season: 'summer',
      description: 'Extra rewards for cold drinks and outdoor seating',
      icon: Sun,
      bonusMultiplier: 1.8,
      specialRewards: ['Iced drink upgrade', 'Outdoor seating priority', 'Summer cocktail special']
    },
    {
      id: 'autumn-harvest',
      name: 'Autumn Harvest',
      season: 'autumn',
      description: 'Seasonal flavors and harvest-themed rewards',
      icon: Leaf,
      bonusMultiplier: 1.6,
      specialRewards: ['Pumpkin spice drinks', 'Harvest pastries', 'Seasonal merchandise']
    }
  ];

  const filteredTemplates = selectedSeason === 'all' 
    ? seasonalTemplates 
    : seasonalTemplates.filter(template => template.season === selectedSeason);

  const handleTemplateSelect = (template: SeasonalTemplate) => {
    onTemplateSelect(template);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Seasonal Templates
        </CardTitle>
        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Seasons</SelectItem>
            <SelectItem value="spring">Spring</SelectItem>
            <SelectItem value="summer">Summer</SelectItem>
            <SelectItem value="autumn">Autumn</SelectItem>
            <SelectItem value="winter">Winter</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <template.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{template.name}</h3>
                      <Badge variant="outline" className="capitalize">
                        {template.season}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Bonus:</span>
                        <Badge variant="default">
                          {template.bonusMultiplier}x points
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          Special Rewards:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {template.specialRewards.slice(0, 2).map((reward, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {reward}
                            </Badge>
                          ))}
                          {template.specialRewards.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.specialRewards.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      Apply Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
