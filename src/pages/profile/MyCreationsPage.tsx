import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';

const MyCreationsPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Creations</h1>
          <p className="text-muted-foreground">Manage your created content</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Swig Circuits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Manage your created Swig Circuits</p>
              <Button asChild className="mt-4">
                <Link to="/profile/bar-crawls">View Swig Circuits</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Mocktail Recipes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Manage your created mocktail recipes</p>
              <Button asChild className="mt-4">
                <Link to="/profile/user-recipes">View Mocktail Recipes</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Manage your created events</p>
              <Button asChild className="mt-4">
                <Link to="/events">View Events</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MyCreationsPage;
