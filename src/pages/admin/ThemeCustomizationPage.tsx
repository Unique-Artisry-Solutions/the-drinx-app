
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ThemeCustomizer from '@/components/admin/theme/ThemeCustomizer';
import ThemePreview from '@/components/admin/theme/ThemePreview';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Download, Upload, Paintbrush, CheckCircle2, List } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AccessibilityChecker from '@/components/admin/theme/AccessibilityChecker';
import ThemeScheduler from '@/components/admin/theme/ThemeScheduler';
import ThemeAnalytics from '@/components/admin/theme/ThemeAnalytics';

const ThemeCustomizationPage: React.FC = () => {
  const { palette, resetPalette } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('customize');

  const handleApplyGlobally = () => {
    // In a real implementation, this would save the theme to a database or global state
    toast({
      title: 'Theme Applied Globally',
      description: 'The current theme has been applied to the entire application.',
      action: (
        <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-white" />
        </div>
      )
    });
  };

  const handleExportTheme = () => {
    try {
      const themeData = JSON.stringify(palette, null, 2);
      const blob = new Blob([themeData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `spiritless-theme-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Theme Exported',
        description: 'Your theme has been exported successfully.',
      });
    } catch (error) {
      console.error('Error exporting theme:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your theme.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Theme Customization</h1>
            <p className="text-muted-foreground mt-1">Customize the look and feel of your application</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleExportTheme}>
              <Download className="mr-1 h-4 w-4" /> Export Theme
            </Button>
            <Button variant="outline" size="sm" onClick={() => resetPalette()}>
              <Paintbrush className="mr-1 h-4 w-4" /> Reset
            </Button>
            <Button onClick={handleApplyGlobally}>
              Apply to Site
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg mx-auto mb-6">
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customize" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ThemeCustomizer />
              </div>
              <div>
                <ThemePreview />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="accessibility" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AccessibilityChecker />
              </div>
              <div>
                <ThemePreview />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ThemeScheduler />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>About Theme Scheduling</CardTitle>
                    <CardDescription>Understanding how scheduled themes work</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">How It Works</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Theme scheduling allows you to automatically change your site's appearance based on dates,
                        seasons, or special events. Schedule multiple themes in advance to keep your site fresh and relevant.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Scheduling Options</h4>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                        <li>Set exact start and end dates</li>
                        <li>Schedule themes for specific times</li>
                        <li>Create recurring seasonal themes</li>
                        <li>Preview themes before scheduling</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Best Practices</h4>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                        <li>Create themes that maintain accessibility standards</li>
                        <li>Schedule changes during off-peak hours</li>
                        <li>Use consistent branding elements across themes</li>
                        <li>Test themes across different devices</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <ThemeAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ThemeCustomizationPage;
