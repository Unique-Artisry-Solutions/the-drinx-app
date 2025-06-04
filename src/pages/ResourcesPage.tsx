import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, BookOpen, Users, HelpCircle } from 'lucide-react';
import { Layout } from '@/components/Layout';

const ResourcesPage = () => {
  const resources = [
    {
      title: "Beginner's Guide to Mocktails",
      description: "Learn the basics of crafting delicious non-alcoholic drinks.",
      link: "https://example.com/mocktail-guide",
      icon: BookOpen
    },
    {
      title: "Community Forum",
      description: "Connect with other mocktail enthusiasts and share your creations.",
      link: "https://example.com/mocktail-forum",
      icon: Users
    },
    {
      title: "FAQ",
      description: "Find answers to frequently asked questions about non-alcoholic beverages.",
      link: "https://example.com/mocktail-faq",
      icon: HelpCircle
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Resources</h1>
          <p className="text-muted-foreground">Helpful links and information</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <resource.icon className="h-4 w-4" />
                  {resource.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{resource.description}</p>
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                  Learn More
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage;
