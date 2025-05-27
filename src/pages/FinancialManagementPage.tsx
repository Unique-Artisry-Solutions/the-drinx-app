
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinancialDashboard from '@/components/financial/FinancialDashboard';
import TaxInfoForm from '@/components/financial/TaxInfoForm';
import { useAuth } from '@/hooks/useAuth';

export default function FinancialManagementPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please sign in to access financial management.</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your payouts, view financial reports, and handle tax information
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tax-info">Tax Information</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <FinancialDashboard />
        </TabsContent>

        <TabsContent value="tax-info">
          <TaxInfoForm organizerId={user.id} />
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-4">Payout Settings</h3>
              <p className="text-gray-600 text-sm">
                Configure your default payout methods and preferences
              </p>
              {/* Add payout settings form here */}
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-4">Notification Preferences</h3>
              <p className="text-gray-600 text-sm">
                Choose how you want to be notified about payouts and financial updates
              </p>
              {/* Add notification settings here */}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
