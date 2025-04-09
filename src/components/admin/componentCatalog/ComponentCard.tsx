
import React from 'react';
import { Code, Component } from 'lucide-react';
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
  
  // Function to render the appropriate preview based on the component's preview property
  const renderPreview = () => {
    // If no preview property, render a default preview with the component icon
    if (!component.preview) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <Component size={24} className="mb-1" />
          <span className="text-xs">Component Preview</span>
        </div>
      );
    }
    
    // If the preview is a URL, render an image
    if (component.preview.startsWith('http') || component.preview.startsWith('/')) {
      return (
        <img 
          src={component.preview} 
          alt={`Preview of ${component.name}`} 
          className="max-w-full max-h-full object-contain"
        />
      );
    }
    
    // If the preview is something else (like JSX or SVG as string), render it as-is
    return (
      <div className="flex items-center justify-center h-full">
        <div dangerouslySetInnerHTML={{ __html: component.preview }} />
      </div>
    );
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
        {/* Always show preview container, but content differs based on component.preview */}
        <div className="mb-3 border rounded-md p-2 bg-gray-50 h-24 flex items-center justify-center overflow-hidden">
          {renderPreview()}
        </div>
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
