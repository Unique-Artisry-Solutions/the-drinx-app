import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { BarChart4, Store, Route, Utensils, Tag, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface QuickNavigationProps {
  activeSection: string | null;
  activeTab: string;
  handleTabChange: (tab: string) => void;
  handleQuickLinkClick: (section: string) => void;
  establishmentId?: string;
}

const QuickNavigation: React.FC<QuickNavigationProps> = ({
  activeSection,
  activeTab,
  handleTabChange,
  handleQuickLinkClick,
  establishmentId
}) => {
  const navigate = useNavigate();

  // Quick navigation links for establishment
  const quickLinks = [
    { label: 'All Actions', section: 'allActions', icon: Store, path: '/establishment/all-actions' },
    { label: 'Analytics', section: 'analytics', icon: BarChart4, path: '/establishment/analytics' },
    { label: 'Mocktail Menu', section: 'menu', icon: Utensils, tab: 'menu' },
    { label: 'Promotions', section: 'promotions', icon: Tag, tab: 'promotions' },
    { label: 'Bar Crawls', section: 'barCrawls', icon: Route, tab: 'barCrawls' },
    { label: 'Settings', section: 'settings', icon: Settings }
  ];

  const handleLinkClick = (link: any) => {
    // If it has a tab property, use the tab change handler
    if (link.tab) {
      handleTabChange(link.tab);
    }
    // If it has a path property, use navigation
    else if (link.path) {
      navigate(link.path);
    }
    // Otherwise use the section click handler
    else {
      handleQuickLinkClick(link.section);
    }
  };

  return (
    <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
      <CardContent className="py-4">
        <h2 className="text-lg font-medium mb-3">Quick Navigation</h2>
        <div className="flex flex-wrap gap-3">
          {quickLinks.map((link) => (
            <button 
              key={link.section}
              onClick={() => handleLinkClick(link)}
              className={cn(
                buttonVariants({ variant: (activeSection === link.section || activeTab === link.tab) ? "default" : "outline" }),
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
  );
};

export default QuickNavigation;
