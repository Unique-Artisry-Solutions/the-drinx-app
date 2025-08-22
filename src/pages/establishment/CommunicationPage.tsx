
import React from 'react';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import MessagingSplitView from '@/components/establishment/communication/MessagingSplitView';
import { useUserEstablishment } from '@/hooks/establishment/useUserEstablishment';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EstablishmentCommunicationPage: React.FC = () => {
  const { establishmentId, isLoading, error } = useUserEstablishment();

  return (
    <ResponsiveLayout>
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
        <h1 className="text-2xl font-bold">Communication Hub</h1>
        <p className="text-muted-foreground">
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
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading your communications...</span>
          </div>
        ) : (
          <MessagingSplitView />
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default EstablishmentCommunicationPage;
