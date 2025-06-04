import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';

const ComponentCatalogPage: React.FC = () => {
  const components = [
    {
      name: "Card",
      description: "A versatile container for grouping related content.",
      status: "Stable"
    },
    {
      name: "Button",
      description: "Interactive element for triggering actions.",
      status: "Stable"
    },
    {
      name: "Badge",
      description: "Displays a status or category label.",
      status: "Stable"
    },
    {
      name: "Input",
      description: "Text field for user input.",
      status: "Beta"
    },
    {
      name: "Select",
      description: "Dropdown menu for selecting options.",
      status: "Alpha"
    },
    {
      name: "Textarea",
      description: "Multi-line text field for longer input.",
      status: "Alpha"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">Component Catalog</h1>
        <p className="text-muted-foreground mb-4">
          A comprehensive list of reusable components available in the design system.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map((component) => (
            <Card key={component.name} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{component.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{component.description}</p>
                <Badge variant="secondary">{component.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8">
          <Button>View Component Documentation</Button>
        </div>
      </div>
    </Layout>
  );
};

export default ComponentCatalogPage;
