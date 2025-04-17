
import React from 'react';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EstablishmentInbox from '@/components/establishment/communication/EstablishmentInbox';

const EstablishmentCommunicationPage: React.FC = () => {
  return (
    <ResponsiveLayout>
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-6xl">
        <h1 className="text-2xl font-bold">Communication Hub</h1>
        <p className="text-gray-600">
          Manage your conversations with promoters interested in your venue.
        </p>
        
        <EstablishmentInbox />
      </div>
    </ResponsiveLayout>
  );
};

export default EstablishmentCommunicationPage;
