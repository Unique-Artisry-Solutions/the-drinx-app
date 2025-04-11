
// Import the existing Explore component from its current location and add RedirectMessage
import React from 'react';
import ExplorePage from '@/components/explore/ExplorePage';
import RedirectMessage from '@/components/ui/RedirectMessage';

const Explore = () => {
  return (
    <>
      <RedirectMessage />
      <ExplorePage />
    </>
  );
};

export default Explore;
