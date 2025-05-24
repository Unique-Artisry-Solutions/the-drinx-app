
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PromoCodeGenerator from '@/components/promoter/marketing/PromoCodeGenerator';
import SocialMediaSharing from '@/components/promoter/marketing/SocialMediaSharing';
import { Megaphone, BarChart3, Share2, Ticket, Mail, Globe } from 'lucide-react';

const PromotionalToolsPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-start mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Megaphone className="mr-2 h-5 w-5" />
            Promotional Tools
          </h1>
          <p className="text-muted-foreground">
            Create and manage promotional campaigns to increase event attendance
          </p>
        </div>
        
        <Tabs defaultValue="promo-codes" className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="promo-codes" className="flex items-center">
              <Ticket className="h-4 w-4 mr-2" />
              Promo Codes
            </TabsTrigger>
            <TabsTrigger value="social-sharing" className="flex items-center">
              <Share2 className="h-4 w-4 mr-2" />
              Social Sharing
            </TabsTrigger>
            <TabsTrigger value="email-campaigns" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email Campaigns
            </TabsTrigger>
            <TabsTrigger value="landing-pages" className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Landing Pages
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="promo-codes" className="space-y-6">
            <PromoCodeGenerator />
          </TabsContent>
          
          <TabsContent value="social-sharing" className="space-y-6">
            <SocialMediaSharing />
          </TabsContent>
          
          <TabsContent value="email-campaigns" className="space-y-6">
            <div className="bg-muted/20 p-8 rounded-lg border border-dashed text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">Email Campaign Manager</h3>
              <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
                Create email marketing campaigns to promote your events and track their effectiveness.
                This feature is coming soon!
              </p>
              <div className="text-xs text-muted-foreground">Coming in the next release</div>
            </div>
          </TabsContent>
          
          <TabsContent value="landing-pages" className="space-y-6">
            <div className="bg-muted/20 p-8 rounded-lg border border-dashed text-center">
              <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">Custom Landing Pages</h3>
              <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
                Create custom landing pages for your events with unique designs and targeted messaging.
                This feature is coming soon!
              </p>
              <div className="text-xs text-muted-foreground">Coming in the next release</div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="bg-muted/20 p-8 rounded-lg border border-dashed text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">Promotional Analytics</h3>
              <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
                Track the performance of all your marketing efforts in one place.
                This feature is coming soon!
              </p>
              <div className="text-xs text-muted-foreground">Coming in the next release</div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PromotionalToolsPage;
