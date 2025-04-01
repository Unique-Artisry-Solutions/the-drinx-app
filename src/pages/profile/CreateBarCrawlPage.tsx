
import React from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';

const CreateBarCrawlPage: React.FC = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Bar Crawl Created',
      description: 'Your new bar crawl has been created successfully!',
    });
  };

  return (
    <Layout>
      <div className="py-4 animate-fade-in max-w-3xl mx-auto">
        <h1 className="text-2xl font-medium text-material-on-background mb-4">Create Bar Crawl</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-spiritless-pink" />
              New Bar Crawl Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="crawlName">Bar Crawl Name</Label>
                <Input id="crawlName" placeholder="Weekend Mocktail Tour" required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Description of your bar crawl" required />
              </div>
              
              <div className="space-y-2">
                <Label>Establishments</Label>
                <p className="text-sm text-gray-500 mb-2">Select establishments from the map</p>
                
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <span>No establishments selected</span>
                    <Button type="button" variant="outline" size="sm" asChild>
                      <a href="/map">Select from Map</a>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="submit" className="bg-spiritless-pink hover:bg-spiritless-pink/90">
                  Create Bar Crawl
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateBarCrawlPage;
