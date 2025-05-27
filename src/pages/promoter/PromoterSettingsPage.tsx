
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Bell, Shield } from 'lucide-react';

const PromoterSettingsPage = () => {
  const settingsCategories = [
    {
      title: "Account Settings",
      icon: User,
      description: "Manage your promoter profile and preferences",
      status: "Available"
    },
    {
      title: "Notification Settings", 
      icon: Bell,
      description: "Configure alerts and notification preferences",
      status: "Available"
    },
    {
      title: "Security Settings",
      icon: Shield,
      description: "Manage security and privacy settings",
      status: "Available"
    },
    {
      title: "Advanced Settings",
      icon: Settings,
      description: "Advanced configuration options",
      status: "Coming Soon"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your promoter account and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsCategories.map((category) => (
            <Card key={category.title} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{category.description}</p>
                <Badge variant={category.status === "Available" ? "default" : "outline"}>
                  {category.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PromoterSettingsPage;
