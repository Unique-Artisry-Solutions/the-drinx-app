
import React from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CircuitRequestsHeader from '@/components/establishment/CircuitRequestsHeader';
import PendingRequestsTab from '@/components/establishment/PendingRequestsTab';
import AcceptedRequestsTab from '@/components/establishment/AcceptedRequestsTab';
import { useSwigCircuitRequests } from '@/hooks/useSwigCircuitRequests';

const SwigCircuitRequestsPage: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    formattedPendingRequests,
    formattedAcceptedRequests,
    handleAcceptRequest,
    handleDeclineRequest,
    handleEndParticipation
  } = useSwigCircuitRequests();

  return (
    <Layout>
      <div className="animate-fade-in p-6 max-w-7xl mx-auto">
        <CircuitRequestsHeader />

        <Tabs 
          defaultValue="pending" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <TabsList className="mb-4 bg-gray-100/80 w-full justify-start gap-2 p-1">
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-spiritless-pink/20 data-[state=active]:to-spiritless-orange/20 data-[state=active]:text-spiritless-pink font-medium"
            >
              Pending Requests
            </TabsTrigger>
            <TabsTrigger 
              value="accepted" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-spiritless-pink/20 data-[state=active]:to-spiritless-orange/20 data-[state=active]:text-spiritless-pink font-medium"
            >
              Accepted Circuits
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            <PendingRequestsTab 
              pendingRequests={formattedPendingRequests}
              handleAcceptRequest={handleAcceptRequest}
              handleDeclineRequest={handleDeclineRequest}
            />
          </TabsContent>
          
          <TabsContent value="accepted" className="mt-6">
            <AcceptedRequestsTab 
              acceptedRequests={formattedAcceptedRequests}
              handleEndParticipation={handleEndParticipation}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SwigCircuitRequestsPage;
