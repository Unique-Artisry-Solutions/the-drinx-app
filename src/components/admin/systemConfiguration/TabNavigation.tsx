
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, Mail, Shield, Key, CreditCard, 
  ToggleRight, Layers, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TabNavigationProps {
  currentCategory: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ currentCategory }) => {
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    navigate(`/admin/system-configuration?tab=${tab}`, { replace: true });
  };

  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
      <TabsTrigger 
        value="general" 
        className="flex items-center gap-2"
        onClick={() => handleTabChange('general')}
      >
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">General</span>
      </TabsTrigger>
      <TabsTrigger 
        value="email" 
        className="flex items-center gap-2"
        onClick={() => handleTabChange('email')}
      >
        <Mail className="h-4 w-4" />
        <span className="hidden sm:inline">Email</span>
      </TabsTrigger>
      <TabsTrigger 
        value="security" 
        className="flex items-center gap-2"
        onClick={() => handleTabChange('security')}
      >
        <Shield className="h-4 w-4" />
        <span className="hidden sm:inline">Security</span>
      </TabsTrigger>
      <TabsTrigger 
        value="api" 
        className="flex items-center gap-2"
        onClick={() => handleTabChange('api')}
      >
        <Key className="h-4 w-4" />
        <span className="hidden sm:inline">API</span>
      </TabsTrigger>
      <TabsTrigger 
        value="payment" 
        className="flex items-center gap-2"
        onClick={() => handleTabChange('payment')}
      >
        <CreditCard className="h-4 w-4" />
        <span className="hidden sm:inline">Payment</span>
      </TabsTrigger>
      <TabsTrigger 
        value="features" 
        className="flex items-center gap-2"
        onClick={() => handleTabChange('features')}
      >
        <ToggleRight className="h-4 w-4" />
        <span className="hidden sm:inline">Features</span>
      </TabsTrigger>
      <TabsTrigger 
        value="feature-tiers" 
        className="flex items-center gap-2"
        onClick={() => handleTabChange('feature-tiers')}
      >
        <Layers className="h-4 w-4" />
        <span className="hidden sm:inline">Tiers</span>
      </TabsTrigger>
      <TabsTrigger 
        value="feature-analytics" 
        className="flex items-center gap-2"
        onClick={() => handleTabChange('feature-analytics')}
      >
        <BarChart3 className="h-4 w-4" />
        <span className="hidden sm:inline">Analytics</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default TabNavigation;
