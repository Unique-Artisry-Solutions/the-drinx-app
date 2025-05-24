
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Megaphone, Shield, User, ExternalLink } from 'lucide-react';

const DevBypassLinks: React.FC = () => {
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('preview--');

  if (!isDevelopment) return null;

  const baseUrl = window.location.origin;

  const bypassLinks = [
    {
      type: 'individual',
      label: 'Individual View',
      icon: User,
      url: `${baseUrl}/login?dev_mode=individual`,
      color: 'text-spiritless-pink'
    },
    {
      type: 'establishment',
      label: 'Business View',
      icon: Store,
      url: `${baseUrl}/login?dev_mode=establishment`,
      color: 'text-spiritless-green'
    },
    {
      type: 'promoter',
      label: 'Promoter View',
      icon: Megaphone,
      url: `${baseUrl}/login?dev_mode=promoter`,
      color: 'text-purple-600'
    },
    {
      type: 'admin',
      label: 'Admin View',
      icon: Shield,
      url: `${baseUrl}/login?dev_mode=admin`,
      color: 'text-gray-800'
    }
  ];

  return (
    <Card className="mt-8 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-sm text-orange-800">Development Bypass Links</CardTitle>
        <CardDescription className="text-xs text-orange-600">
          Click these links to bypass authentication and go directly to each interface
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {bypassLinks.map((link) => (
            <Button
              key={link.type}
              variant="outline"
              size="sm"
              asChild
              className={`justify-start ${link.color} border-current hover:bg-current/10`}
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {React.createElement(link.icon, { className: "h-4 w-4 mr-2" })}
                {link.label}
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-orange-600 bg-white p-3 rounded border border-orange-200">
          <strong>How it works:</strong> These links add a <code>?dev_mode=usertype</code> parameter 
          that automatically navigates to the appropriate dashboard without requiring authentication.
        </div>
      </CardContent>
    </Card>
  );
};

export default DevBypassLinks;
