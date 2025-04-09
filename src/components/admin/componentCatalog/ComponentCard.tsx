
import React from 'react';
import { Code } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ComponentCatalogItem } from './types';
import { useToast } from '@/hooks/use-toast';

interface ComponentCardProps {
  component: ComponentCatalogItem;
  onSelectComponent: (component: ComponentCatalogItem) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component, onSelectComponent }) => {
  const { toast } = useToast();
  
  const copyLovablePrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prompt = `Modify the ${component.name} component in ${component.filePath} which has the following selectors: ${component.selectors.join(', ')}`;
    navigator.clipboard.writeText(prompt);
    toast({
      title: 'Copied!',
      description: 'Lovable prompt copied to clipboard',
    });
  };
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelectComponent(component)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{component.name}</CardTitle>
          <Badge variant={component.type === 'page' ? 'default' : 'outline'}>
            {component.type}
          </Badge>
        </div>
        <CardDescription className="text-xs truncate">
          {component.filePath}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm">{component.description}</div>
        <div className="flex mt-4">
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full"
            onClick={copyLovablePrompt}
          >
            <Code className="mr-2 h-4 w-4" />
            Copy Prompt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentCard;
