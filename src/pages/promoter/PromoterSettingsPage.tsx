
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Bell, Shield, CreditCard, Globe } from 'lucide-react';

const PromoterSettingsPage = () => {
  const settingsCategories = [
    {
      title: "Account Settings",
      icon: User,
      description: "Manage your promoter profile and account details",
      status: "Available"
    },
    {
      title: "Notification Preferences", 
      icon: Bell,
      description: "Configure alerts and notification preferences",
      status: "Available"
    },
    {
      title: "Security Settings",
      icon: Shield,
      description: "Manage password, 2FA, and security settings",
      status: "Available"
    },
    {
      title: "Payment Settings",
      icon: CreditCard,
      description: "Manage payment methods and billing information",
      status: "Available"
    },
    {
      title: "API & Integrations",
      icon: Globe,
      description: "Manage third-party integrations and API access",
      status: "Coming Soon"
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
          <h1 className="text-3xl font-bold text-purple-700">Promoter Settings</h1>
          <p className="text-muted-foreground">Configure your promoter account and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsCategories.map((category) => (
            <Card key={category.title} className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <category.icon className="h-5 w-5" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{category.description}</p>
                <Badge variant={category.status === "Available" ? "default" : "outline"} className={category.status === "Available" ? "bg-purple-100 text-purple-700 hover:bg-purple-200" : ""}>
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
