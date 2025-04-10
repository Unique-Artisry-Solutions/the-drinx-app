
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Server, Bell, Shield, CreditCard, ToggleLeft } from 'lucide-react';

interface TabNavigationProps {
  currentCategory: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ currentCategory }) => {
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-6">
      <TabsTrigger value="general" className="flex items-center gap-2">
        <Settings size={16} />
        <span className="hidden sm:inline">General</span>
      </TabsTrigger>
      <TabsTrigger value="email" className="flex items-center gap-2">
        <Bell size={16} />
        <span className="hidden sm:inline">Notifications</span>
      </TabsTrigger>
      <TabsTrigger value="security" className="flex items-center gap-2">
        <Shield size={16} />
        <span className="hidden sm:inline">Security</span>
      </TabsTrigger>
      <TabsTrigger value="api" className="flex items-center gap-2">
        <Server size={16} />
        <span className="hidden sm:inline">API</span>
      </TabsTrigger>
      <TabsTrigger value="payment" className="flex items-center gap-2">
        <CreditCard size={16} />
        <span className="hidden sm:inline">Payment</span>
      </TabsTrigger>
      <TabsTrigger value="features" className="flex items-center gap-2">
        <ToggleLeft size={16} />
        <span className="hidden sm:inline">Features</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default TabNavigation;
