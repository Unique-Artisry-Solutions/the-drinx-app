
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import QuickNavigation from '@/components/establishment/QuickNavigation';
import EstablishmentInbox from '@/components/establishment/communication/EstablishmentInbox';
import { useUserEstablishment } from '@/hooks/establishment/useUserEstablishment';
import { useIsMobile } from '@/hooks/use-mobile';

const EstablishmentProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { establishmentId } = useUserEstablishment();
  const isMobile = useIsMobile();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setActiveSection(null);
  };

  const handleQuickLinkClick = (section: string) => {
    setActiveSection(null);
    setActiveSection(section);
  };

  const tabOptions = [
    { value: 'profile', label: isMobile ? 'Profile' : 'Profile Management' },
    { value: 'messaging', label: isMobile ? 'Messages' : 'Communication Hub' },
  ];

  return (
    <Layout 
      activeTab={activeTab} 
      handleTabChange={handleTabChange}
      tabOptions={tabOptions}
    >
      <div className="py-4 animate-fade-in w-full">
        {/* Quick Navigation Links */}
        <QuickNavigation 
          activeSection={activeSection} 
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          handleQuickLinkClick={handleQuickLinkClick}
          establishmentId={establishmentId}
        />

        {/* Profile Tab Content */}
        {activeTab === 'profile' && !activeSection && (
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Establishment Profile</h1>
              <p className="text-gray-600 mt-2">Manage your establishment information</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>Update your establishment details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Establishment Name</Label>
                        <Input id="name" placeholder="Enter establishment name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Input id="type" placeholder="Bar, Restaurant, Cafe..." />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe your establishment..." />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="contact@establishment.com" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="123 Main St, City, State 12345" />
                    </div>
                    
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Summary</CardTitle>
                    <CardDescription>Quick overview of your establishment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">The Spiritless Lounge</p>
                        <p className="text-sm text-muted-foreground">Non-alcoholic Bar</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm">123 Main Street</p>
                        <p className="text-sm text-muted-foreground">Downtown, CA 90210</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm">+1 (555) 123-4567</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm">contact@spiritlesslounge.com</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Messaging Tab Content */}
        {activeTab === 'messaging' && !activeSection && (
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-8 w-8" />
                Communication Hub
              </h1>
              <p className="text-gray-600 mt-2">Manage your conversations with promoters and partners</p>
            </div>
            
            <EstablishmentInbox />
          </div>
        )}

        {/* Section Content for Quick Links */}
        {activeSection && (
          <div className="container mx-auto px-4">
            {activeSection === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Configure your establishment preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Settings configuration coming soon...</p>
                </CardContent>
              </Card>
            )}
            
            {activeSection === 'analytics' && (
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>View your establishment performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
                </CardContent>
              </Card>
            )}
            
            {activeSection === 'allActions' && (
              <Card>
                <CardHeader>
                  <CardTitle>All Actions</CardTitle>
                  <CardDescription>Quick access to all establishment functions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="outline" onClick={() => handleTabChange('profile')}>
                      <Building2 className="h-4 w-4 mr-2" />
                      Profile Management
                    </Button>
                    <Button variant="outline" onClick={() => handleTabChange('messaging')}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Communications
                    </Button>
                    <Button variant="outline" onClick={() => handleQuickLinkClick('analytics')}>
                      <Building2 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EstablishmentProfile;
