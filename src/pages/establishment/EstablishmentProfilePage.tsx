
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ProfileTab from '@/components/establishment/ProfileTab';
import PromotionsTab from '@/components/establishment/PromotionsTab';
import MocktailMenuTab from '@/components/establishment/MocktailMenuTab';
import VisitorStatsTab from '@/components/establishment/VisitorStatsTab';
import BarCrawlsTab from '@/components/establishment/BarCrawlsTab';
import { useEstablishmentProfile } from '@/hooks/establishment/useEstablishmentProfile';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { BarChart4, Store, Route, Utensils, Tag, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const EstablishmentProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('profile');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const {
    profileState,
    promotionsState,
    drinksState,
    visitorStats,
    barCrawlsState
  } = useEstablishmentProfile();
  
  useEffect(() => {
    if (tabParam && ['profile', 'promotions', 'menu', 'visitors', 'barCrawls'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else {
      setSearchParams({ tab: 'profile' });
    }
  }, [tabParam, setSearchParams]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setActiveSection(null); // Reset section when changing tabs
    setSearchParams({ tab: value });
  };
  
  const tabOptions = [
    { value: 'profile', label: isMobile ? 'Profile' : 'Profile' },
    { value: 'promotions', label: isMobile ? 'Promos' : 'Promotions' },
    { value: 'menu', label: isMobile ? 'Menu' : 'Mocktail Menu' },
    { value: 'visitors', label: isMobile ? 'Stats' : 'Visitor Stats' },
    { value: 'barCrawls', label: isMobile ? 'Crawls' : 'Bar Crawl Requests' }
  ];

  // Quick navigation links for establishment - without dashboard link
  const quickLinks = [
    { label: 'All Actions', section: 'allActions', icon: Store },
    { label: 'Analytics', section: 'analytics', icon: BarChart4 },
    { label: 'Mocktail Menu', section: 'menu', icon: Utensils },
    { label: 'Promotions', section: 'promotions', icon: Tag },
    { label: 'Bar Crawls', section: 'barCrawls', icon: Route },
    { label: 'Settings', section: 'settings', icon: Settings },
  ];

  // Handle quick link click
  const handleQuickLinkClick = (section: string) => {
    setActiveSection(section);
    
    // Map sections to tabs when appropriate
    if (section === 'menu') {
      setActiveTab('menu');
      setSearchParams({ tab: 'menu' });
    } else if (section === 'promotions') {
      setActiveTab('promotions');
      setSearchParams({ tab: 'promotions' });
    } else if (section === 'barCrawls') {
      setActiveTab('barCrawls');
      setSearchParams({ tab: 'barCrawls' });
    }
  };

  // Render section content based on activeSection
  const renderSectionContent = () => {
    if (!activeSection) return null;
    
    switch (activeSection) {
      case 'allActions':
        return (
          <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
            <CardContent className="py-6">
              <h1 className="text-2xl font-bold mb-4">All Actions</h1>
              <p>Quick access to all establishment management actions.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <Card className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleQuickLinkClick('menu')}>
                  <h3 className="font-medium flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    Update Menu
                  </h3>
                </Card>
                <Card className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleQuickLinkClick('promotions')}>
                  <h3 className="font-medium flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Manage Promotions
                  </h3>
                </Card>
                <Card className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleQuickLinkClick('barCrawls')}>
                  <h3 className="font-medium flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    Review Bar Crawl Requests
                  </h3>
                </Card>
              </div>
            </CardContent>
          </Card>
        );
      case 'analytics':
        return (
          <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
            <CardContent className="py-6">
              <h1 className="text-2xl font-bold mb-4">Analytics</h1>
              <p>Visitor statistics and performance metrics.</p>
              <div className="mt-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Visitor Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-blue-50">
                      <h3 className="font-medium">Total Visits</h3>
                      <p className="text-2xl font-bold">{visitorStats?.totalVisits || 278}</p>
                    </Card>
                    <Card className="p-4 bg-green-50">
                      <h3 className="font-medium">Unique Visitors</h3>
                      <p className="text-2xl font-bold">{visitorStats?.uniqueVisitors || 153}</p>
                    </Card>
                    <Card className="p-4 bg-amber-50">
                      <h3 className="font-medium">Returning Visitors</h3>
                      <p className="text-2xl font-bold">{visitorStats?.returningVisitors || 62}</p>
                    </Card>
                  </div>
                </div>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <p className="text-gray-500">Visitor trend chart would display here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
          <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
            <CardContent className="py-6">
              <h1 className="text-2xl font-bold mb-4">Settings</h1>
              <p>Account settings, preferences, and configuration options.</p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h3 className="font-medium">Account Information</h3>
                    <p className="text-sm text-gray-500">Update your establishment details</p>
                  </div>
                  <button className="text-blue-600" onClick={() => { setActiveSection(null); setActiveTab('profile'); setSearchParams({ tab: 'profile' }); }}>
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h3 className="font-medium">Notification Preferences</h3>
                    <p className="text-sm text-gray-500">Manage your notification settings</p>
                  </div>
                  <button className="text-blue-600">Edit</button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h3 className="font-medium">Privacy Settings</h3>
                    <p className="text-sm text-gray-500">Control your privacy options</p>
                  </div>
                  <button className="text-blue-600">Edit</button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };
  
  return (
    <Layout 
      activeTab={activeTab} 
      handleTabChange={handleTabChange}
      tabOptions={tabOptions}
    >
      <div className="py-4 animate-fade-in w-full">
        {/* Quick Navigation Links */}
        <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
          <CardContent className="py-4">
            <h2 className="text-lg font-medium mb-3">Quick Navigation</h2>
            <div className="flex flex-wrap gap-3">
              {quickLinks.map((link) => (
                <button 
                  key={link.section}
                  onClick={() => handleQuickLinkClick(link.section)}
                  className={cn(
                    buttonVariants({ variant: activeSection === link.section ? "default" : "outline" }),
                    "flex items-center gap-2"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Show section content if a quick link is active */}
        {activeSection && renderSectionContent()}
        
        {/* Show tab content only if no section is active */}
        {!activeSection && (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className={isMobile ? "px-3" : "px-4 py-2 md:px-6 lg:mx-[10%]"}>
              <TabsContent value="profile">
                <ProfileTab 
                  name={profileState.name} 
                  email={profileState.email} 
                  description={profileState.description} 
                  address={profileState.address} 
                  phone={profileState.phone} 
                  website={profileState.website} 
                  businessHours={profileState.businessHours || []}
                  isLoading={profileState.isLoading} 
                  setName={profileState.setName} 
                  setEmail={profileState.setEmail} 
                  setDescription={profileState.setDescription} 
                  setAddress={profileState.setAddress} 
                  setPhone={profileState.setPhone} 
                  setWebsite={profileState.setWebsite}
                  setBusinessHours={profileState.setBusinessHours}
                  handleSaveProfile={profileState.handleSaveProfile} 
                />
              </TabsContent>

              <TabsContent value="promotions">
                <PromotionsTab 
                  promotions={promotionsState.promotions} 
                  newPromoCode={promotionsState.newPromoCode} 
                  newPromoDescription={promotionsState.newPromoDescription} 
                  setNewPromoCode={promotionsState.setNewPromoCode} 
                  setNewPromoDescription={promotionsState.setNewPromoDescription} 
                  handleAddPromotion={promotionsState.handleAddPromotion} 
                  handleDeletePromotion={promotionsState.handleDeletePromotion} 
                />
              </TabsContent>

              <TabsContent value="menu">
                <MocktailMenuTab 
                  drinks={drinksState.drinks} 
                  onAddDrink={drinksState.handleAddDrink} 
                  onUpdateDrink={drinksState.handleUpdateDrink} 
                  onDeleteDrink={drinksState.handleDeleteDrink} 
                />
              </TabsContent>

              <TabsContent value="visitors">
                <VisitorStatsTab visitorStats={visitorStats} />
              </TabsContent>

              <TabsContent value="barCrawls">
                <BarCrawlsTab 
                  barCrawls={barCrawlsState.barCrawls} 
                  handleEndParticipation={barCrawlsState.handleEndParticipation} 
                  handleAcceptRequest={barCrawlsState.handleAcceptRequest} 
                />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default EstablishmentProfilePage;
