
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const EventManagementPage = () => {
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-purple-600">Event Management</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create and manage your events
            </p>
          </div>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link to="/promoter/events/create" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {/* Events will be listed here in the next implementation step */}
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No events created yet. Start by creating your first event.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default EventManagementPage;
