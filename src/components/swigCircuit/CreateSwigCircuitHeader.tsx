
import React from 'react';
import BackButton from '@/components/navigation/BackButton';

const CreateSwigCircuitHeader: React.FC = () => {
  return (
    <>
      <BackButton />
      <h1 className="text-2xl font-medium text-material-on-background mb-4">Create Swig Circuit</h1>
    </>
  );
};

export default CreateSwigCircuitHeader;
