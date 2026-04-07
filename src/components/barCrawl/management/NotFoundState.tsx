
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/navigation/BackButton';

const NotFoundState: React.FC = () => {
  return (
    <Layout>
      <div className="py-4 max-w-5xl mx-auto">
        <BackButton fallbackPath="/profile/swig-circuits" />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Bar Crawl Not Found</h1>
          <p className="text-gray-600 mb-6">The bar crawl you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/profile/swig-circuits">Go Back to Bar Crawls</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundState;
