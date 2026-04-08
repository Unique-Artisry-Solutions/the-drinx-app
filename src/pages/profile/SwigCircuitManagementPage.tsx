
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import BackButton from '@/components/navigation/BackButton';
import { useSwigCircuitManagement } from '@/hooks/useSwigCircuitManagement';

// Import our components
import LoadingState from '@/components/swigCircuit/management/LoadingState';
import NotFoundState from '@/components/swigCircuit/management/NotFoundState';
import DetailsTab from '@/components/swigCircuit/management/DetailsTab';
import EstablishmentsTab from '@/components/swigCircuit/management/EstablishmentsTab';
import InvitationsTab from '@/components/swigCircuit/management/InvitationsTab';
import SocialSharingTab from '@/components/swigCircuit/management/SocialSharingTab';

const SwigCircuitManagementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const {
    swigCircuit,
    isLoading,
    name,
    setName,
    description,
    setDescription,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    inviteeEmail,
    setInviteeEmail,
    showInviteForm,
    setShowInviteForm,
    availableEstablishments,
    saveSwigCircuitChanges,
    addEstablishment,
    removeEstablishment,
    inviteUser,
    copyShareLink,
    shareToSocialMedia
  } = useSwigCircuitManagement(id || '');

  if (isLoading) {
    return <LoadingState />;
  }

  if (!swigCircuit) {
    return <NotFoundState />;
  }

  return (
    <Layout>
      <div className="py-4 max-w-5xl mx-auto">
        <BackButton fallbackPath="/profile/my-creations" />
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium">{swigCircuit.name}</h1>
            <p className="text-material-on-surface-variant">
              Manage your Swig Circuit details and participants
            </p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={copyShareLink}
          >
            <Share2 size={16} />
            Share
          </Button>
        </div>
        
        <Tabs defaultValue="details">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="establishments">Establishments</TabsTrigger>
            <TabsTrigger value="invites">Invitations</TabsTrigger>
            <TabsTrigger value="sharing">Social Sharing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <DetailsTab 
              swigCircuit={swigCircuit}
              name={name}
              setName={setName}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              description={description}
              setDescription={setDescription}
              saveSwigCircuitChanges={saveSwigCircuitChanges}
            />
          </TabsContent>
          
          <TabsContent value="establishments">
            <EstablishmentsTab 
              currentEstablishments={swigCircuit.establishments}
              availableEstablishments={availableEstablishments}
              addEstablishment={addEstablishment}
              removeEstablishment={removeEstablishment}
            />
          </TabsContent>
          
          <TabsContent value="invites">
            <InvitationsTab 
              showInviteForm={showInviteForm}
              setShowInviteForm={setShowInviteForm}
              inviteeEmail={inviteeEmail}
              setInviteeEmail={setInviteeEmail}
              inviteUser={inviteUser}
              copyShareLink={copyShareLink}
              swigCircuitId={id || ''}
            />
          </TabsContent>
          
          <TabsContent value="sharing">
            <SocialSharingTab 
              swigCircuit={swigCircuit}
              copyShareLink={copyShareLink}
              shareToSocialMedia={shareToSocialMedia}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SwigCircuitManagementPage;
