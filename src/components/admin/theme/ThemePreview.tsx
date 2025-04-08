
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { Check, X, AlertCircle } from 'lucide-react';

const ThemePreview: React.FC = () => {
  const { palette } = useTheme();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Theme Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-4">
          <h3 className="font-medium">Buttons</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-medium">Cards</h3>
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sample Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">This is how cards will appear.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card className="border border-spiritless-pink">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Primary Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">A card with primary border.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-medium">Status</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.success }}></div>
              <span className="text-sm flex items-center gap-1">
                <Check size={14} style={{ color: palette.success }} /> Success
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.warning }}></div>
              <span className="text-sm flex items-center gap-1">
                <AlertCircle size={14} style={{ color: palette.warning }} /> Warning
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.error }}></div>
              <span className="text-sm flex items-center gap-1">
                <X size={14} style={{ color: palette.error }} /> Error
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-medium">Badges</h3>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-medium">Typography</h3>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Heading 1</h1>
            <h2 className="text-xl font-semibold">Heading 2</h2>
            <h3 className="text-lg font-medium">Heading 3</h3>
            <p>This is regular text that shows the main text color.</p>
            <p className="text-sm text-muted-foreground">This is muted text for less important information.</p>
            <a href="#" className="text-primary hover:underline">This is a hyperlink</a>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default ThemePreview;
