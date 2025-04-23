
import React from 'react';
import { Button } from '@/components/ui/button';
import { TEST_CREDENTIALS } from './constants/testUsers';
import { useTestUserCreation } from './hooks/useTestUserCreation';
import TestCredentialsList from './components/TestCredentialsList';

const TestCredentials: React.FC = () => {
  const { isCreating, createAllTestUsers } = useTestUserCreation();

  const handleCreateTestUsers = () => {
    createAllTestUsers(TEST_CREDENTIALS);
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-sm font-medium mb-2">Test Credentials</h3>
      <div className="space-y-2">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full text-xs"
          onClick={handleCreateTestUsers}
          disabled={isCreating}
        >
          {isCreating ? 'Creating Users...' : 'Create Test Users'}
        </Button>
        <TestCredentialsList credentials={TEST_CREDENTIALS} />
      </div>
    </div>
  );
};

export default TestCredentials;
