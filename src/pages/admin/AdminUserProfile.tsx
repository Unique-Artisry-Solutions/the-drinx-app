import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminUserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>User ID: {id}</p>
          <p>This page displays detailed information about a specific user.</p>
        </CardContent>
      </Card>
      
      {/* Additional user profile content would go here */}
    </div>
  );
};

export default AdminUserProfile;
