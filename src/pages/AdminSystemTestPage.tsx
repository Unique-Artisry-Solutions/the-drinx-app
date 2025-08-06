import React from 'react';
import AdminSystemTestComponent from '@/components/test/AdminSystemTestComponent';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminSystemTestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Admin System Testing</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive testing dashboard for admin system components, authentication, 
              and configuration management functionality.
            </p>
          </div>
        </div>
        
        <AdminSystemTestComponent />
        
        <div className="mt-8 text-center">
          <div className="text-sm text-muted-foreground">
            <p>This testing dashboard verifies admin system functionality.</p>
            <p>Only accessible to authenticated admin users.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemTestPage;