
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/promoter/events')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-purple-600 mb-6">
            Event Details
          </h1>

          {/* Event details content will be implemented in the next step */}
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Event ID: {eventId}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailsPage;
