
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Megaphone, Shield, User, ExternalLink } from 'lucide-react';

const DevBypassLinks: React.FC = () => {
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('preview--') ||
                       window.location.hostname.includes('lovable');

  console.log('DevBypassLinks render, isDevelopment:', isDevelopment);

  if (!isDevelopment) return null;

  const baseUrl = window.location.origin;

  const bypassLinks = [
    {
      type: 'individual',
      label: 'Individual View',
      icon: User,
      url: `${baseUrl}/login?dev_mode=individual`,
      color: 'text-spiritless-pink hover:bg-spiritless-pink/10'
    },
    {
      type: 'establishment',
      label: 'Business View',
      icon: Store,
      url: `${baseUrl}/login?dev_mode=establishment`,
      color: 'text-spiritless-green hover:bg-spiritless-green/10'
    },
    {
      type: 'promoter',
      label: 'Promoter View',
      icon: Megaphone,
      url: `${baseUrl}/login?dev_mode=promoter`,
      color: 'text-purple-600 hover:bg-purple-100'
    },
    {
      type: 'admin',
      label: 'Admin View',
      icon: Shield,
      url: `${baseUrl}/login?dev_mode=admin`,
      color: 'text-gray-800 hover:bg-gray-100'
    }
  ];

  return (
    <Card className="mt-8 border-2 border-orange-300 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-base text-orange-800 flex items-center gap-2">
          🛠️ Development Bypass Links
        </CardTitle>
        <CardDescription className="text-sm text-orange-700">
          Click these links to bypass authentication and go directly to each interface
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {bypassLinks.map((link) => (
            <Button
              key={link.type}
              variant="outline"
              size="sm"
              asChild
              className={`justify-start border-2 ${link.color} font-medium`}
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {React.createElement(link.icon, { className: "h-4 w-4 mr-2" })}
                {link.label}
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-orange-700 bg-orange-100 p-3 rounded border border-orange-300">
          <strong>How it works:</strong> These links add a <code className="bg-orange-200 px-1 rounded">?dev_mode=usertype</code> parameter 
          that automatically navigates to the appropriate dashboard without requiring authentication.
        </div>
      </CardContent>
    </Card>
  );
};

export default DevBypassLinks;
