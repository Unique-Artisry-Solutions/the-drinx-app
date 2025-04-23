
import React from 'react';
import { TestCredentialsData } from '../types/testCredentials';

interface TestCredentialsListProps {
  credentials: TestCredentialsData;
}

const TestCredentialsList: React.FC<TestCredentialsListProps> = ({ credentials }) => {
  return (
    <div className="text-xs text-muted-foreground space-y-1">
      <p>
        <strong>User:</strong> {credentials.individual.email} / {credentials.individual.password} (Phone: {credentials.individual.phone})
      </p>
      <p>
        <strong>Business:</strong> {credentials.establishment.email} / {credentials.establishment.password} (Phone: {credentials.establishment.phone})
      </p>
      <p>
        <strong>Promoter:</strong> {credentials.promoter.email} / {credentials.promoter.password} (Phone: {credentials.promoter.phone})
      </p>
    </div>
  );
};

export default TestCredentialsList;
