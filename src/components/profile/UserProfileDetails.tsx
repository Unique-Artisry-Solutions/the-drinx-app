
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserProfileDetails: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the user profile details component.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileDetails;
