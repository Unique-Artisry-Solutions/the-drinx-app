
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ProfileTabProps {
  name: string;
  email: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  isLoading: boolean;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setDescription: (value: string) => void;
  setAddress: (value: string) => void;
  setPhone: (value: string) => void;
  setWebsite: (value: string) => void;
  handleSaveProfile: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  name,
  email,
  description,
  address,
  phone,
  website,
  isLoading,
  setName,
  setEmail,
  setDescription,
  setAddress,
  setPhone,
  setWebsite,
  handleSaveProfile
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Establishment Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            rows={4} 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Address</label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Website</label>
          <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <Button 
          className="w-full mt-4" 
          onClick={handleSaveProfile}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Profile'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
