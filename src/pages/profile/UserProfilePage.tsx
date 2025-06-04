import React from 'react';
import { Layout } from '@/components/Layout';
import UserProfileDetails from '@/components/profile/UserProfileDetails';

const UserProfilePage: React.FC = () => {
  return (
    <Layout>
      <UserProfileDetails />
    </Layout>
  );
};

export default UserProfilePage;
