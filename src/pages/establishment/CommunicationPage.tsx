
import React from 'react';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent } from '@/components/ui/card';
import EstablishmentInbox from '@/components/establishment/communication/EstablishmentInbox';
import { useUserEstablishment } from '@/hooks/establishment/useUserEstablishment';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EstablishmentCommunicationPage: React.FC = () => {
  const { establishmentId, isLoading, error } = useUserEstablishment();

  return (
    <ResponsiveLayout>
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-6xl">
        <h1 className="text-2xl font-bold">Communication Hub</h1>
        <p className="text-gray-600">
          Manage your conversations with promoters interested in your venue.
        </p>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}. The system will use a sample establishment where available.
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Loading your communications...</p>
            </CardContent>
          </Card>
        ) : (
          <EstablishmentInbox />
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default EstablishmentCommunicationPage;
