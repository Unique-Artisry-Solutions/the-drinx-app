
import React from 'react';
import { Copy, Code, Component } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ComponentCatalogItem } from './types';
import { useToast } from '@/hooks/use-toast';

interface ComponentDetailsProps {
  component: ComponentCatalogItem | null;
}

const ComponentDetails: React.FC<ComponentDetailsProps> = ({ component }) => {
  const { toast } = useToast();
  
  if (!component) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Component Details</CardTitle>
          <CardDescription>Select a component to view its details and Lovable prompt</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No component selected</p>
        </CardContent>
      </Card>
    );
  }
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: message,
    });
  };
  
  const generateLovablePrompt = (component: ComponentCatalogItem) => {
    return `Modify the ${component.name} component in ${component.filePath} which has the following selectors: ${component.selectors.join(', ')}`;
  };
  
  // Function to render the appropriate preview based on the component's preview property
  const renderPreview = () => {
    if (!component.preview) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <Component size={36} className="mb-2" />
          <span className="text-xs">No Preview Available</span>
        </div>
      );
    }
    
    if (component.preview.startsWith('http') || component.preview.startsWith('/')) {
      return (
        <img 
          src={component.preview} 
          alt={`Preview of ${component.name}`} 
          className="max-w-full max-h-full object-contain"
        />
      );
    }
    
    return (
      <div className="flex items-center justify-center h-full">
        <div dangerouslySetInnerHTML={{ __html: component.preview }} />
      </div>
    );
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      {/* Preview Section - This will stick to viewport */}
      <div className="md:w-1/2 lg:w-2/5">
        <div className="sticky top-4">
          <Card className="shadow-md mb-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{component.name}</CardTitle>
                <Badge>{component.type}</Badge>
              </div>
              <CardDescription>{component.filePath}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-3 bg-gray-50">
                <h4 className="font-medium mb-2 text-sm">Preview</h4>
                <div className="flex items-center justify-center p-2 bg-white rounded border h-48">
                  {renderPreview()}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Lovable Prompt Section - Also sticky as part of the left column */}
          <Card className="shadow-md">
            <CardContent className="pt-4">
              <h4 className="font-medium mb-2">Lovable Prompt</h4>
              <div className="bg-gray-50 p-3 rounded text-sm relative">
                <code className="text-xs whitespace-pre-wrap">
                  {generateLovablePrompt(component)}
                </code>
                <div className="absolute top-2 right-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(
                      generateLovablePrompt(component), 
                      'Lovable prompt copied!'
                    )}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Scrollable Details Section */}
      <div className="md:w-1/2 lg:w-3/5">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="mb-6">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm">{component.description}</p>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Selectors</h4>
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {component.selectors.map((selector, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                    <code className="text-xs">{selector}</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(selector, 'Selector copied!')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => {
                  window.open(`/${component.filePath.replace('src/', '')}`, '_blank');
                }}
              >
                <Code className="mr-2 h-4 w-4" />
                View Source
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentDetails;
