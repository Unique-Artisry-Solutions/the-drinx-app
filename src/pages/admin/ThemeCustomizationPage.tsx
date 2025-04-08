
import React from 'react';
import Layout from '@/components/Layout';
import ThemeCustomizer from '@/components/admin/theme/ThemeCustomizer';
import ThemePreview from '@/components/admin/theme/ThemePreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Download, Upload, Paintbrush } from 'lucide-react';

const ThemeCustomizationPage: React.FC = () => {
  const { palette, resetPalette } = useTheme();
  const { toast } = useToast();

  const handleApplyGlobally = () => {
    // In a real implementation, this would save the theme to a database or global state
    toast({
      title: 'Theme Applied Globally',
      description: 'The current theme has been applied to the entire application.',
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ThemeCustomizer />
          </div>
          <div>
            <ThemePreview />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThemeCustomizationPage;
