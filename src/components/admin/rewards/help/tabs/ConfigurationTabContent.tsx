
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Zap, Star, Gift } from 'lucide-react';

export function ConfigurationTabContent() {
  const configSections = [
    {
      icon: Settings,
      title: 'Basic Program Settings',
      description: 'Configure fundamental reward program parameters',
      items: ['Points per dollar', 'Welcome bonus', 'Minimum redemption', 'Program name']
    },
    {
      icon: Star,
      title: 'Tier Configuration',
      description: 'Set up reward tiers and progression rules',
      items: ['Tier thresholds', 'Benefits per tier', 'Progression rules', 'Tier colors']
    },
    {
      icon: Zap,
      title: 'Advanced Options',
      description: 'Configure advanced features and automation',
      items: ['Points expiry', 'Fraud protection', 'Auto-tier progression', 'Daily limits']
    },
    {
      icon: Gift,
      title: 'Reward Offerings',
      description: 'Manage available rewards and redemption options',
      items: ['Reward catalog', 'Pricing rules', 'Availability limits', 'Special offers']
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Configure your reward program settings to match your business objectives and customer engagement strategy.
          </p>
          
          <div className="space-y-6">
            {configSections.map((section) => (
              <Card key={section.title}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <section.icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">{section.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {section.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {section.items.map((item) => (
                          <Badge key={item} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
