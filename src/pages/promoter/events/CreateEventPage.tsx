
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import EventCreationWizard from '@/components/promoter/events/wizard/EventCreationWizard';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('edit');
  
  const isEditMode = !!eventId;

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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-purple-600">
              {isEditMode ? 'Edit Event' : 'Create New Event'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEditMode 
                ? 'Update the details of your event below.'
                : 'Fill out the form below to create a new event for your audiences.'}
            </p>
          </div>
          
          <div className="p-6">
            <EventCreationWizard eventId={eventId || undefined} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEventPage;
