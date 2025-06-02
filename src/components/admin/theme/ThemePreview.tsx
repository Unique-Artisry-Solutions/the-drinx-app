
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { Check, X, AlertCircle, Bell, MessageSquare } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ThemePreview: React.FC = () => {
  const { palette, theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Theme Preview
          <Badge variant="outline">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">UI Components</h3>
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Buttons</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="default" size="sm">Primary</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="destructive" size="sm">Destructive</Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Badges</h4>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Tabs</h4>
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="tab1">Account</TabsTrigger>
                <TabsTrigger value="tab2">Password</TabsTrigger>
                <TabsTrigger value="tab3">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Card Example</h3>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sample Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This is how cards will appear in your application.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button size="sm" variant="ghost">Cancel</Button>
              <Button size="sm">Save</Button>
            </CardFooter>
          </Card>
        </section>

        <section className="space-y-3">
          <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Color Indicators</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Brand Colors</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.primary }}></div>
                  <span className="text-xs">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.secondary }}></div>
                  <span className="text-xs">Secondary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.accent }}></div>
                  <span className="text-xs">Accent</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Status Colors</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.success }}></div>
                  <span className="text-xs flex items-center gap-1">
                    <Check size={10} style={{ color: palette.success }} /> Success
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.warning }}></div>
                  <span className="text-xs flex items-center gap-1">
                    <AlertCircle size={10} style={{ color: palette.warning }} /> Warning
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.error }}></div>
                  <span className="text-xs flex items-center gap-1">
                    <X size={10} style={{ color: palette.error }} /> Error
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Typography</h3>
          <div className="space-y-2 border-l-2 pl-3" style={{ borderColor: palette.primary }}>
            <h1 className="text-xl font-bold">Heading 1</h1>
            <h2 className="text-lg font-semibold">Heading 2</h2>
            <h3 className="text-base font-medium">Heading 3</h3>
            <p className="text-sm">This is regular text that shows the main text color.</p>
            <p className="text-xs" style={{ color: palette.mutedText }}>This is muted text for less important information.</p>
            <a href="#" className="text-sm hover:underline" style={{ color: palette.primary }}>This is a hyperlink</a>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default ThemePreview;
