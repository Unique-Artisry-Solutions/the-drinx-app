
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PenIcon } from 'lucide-react';
import FileUploader from '@/components/common/FileUploader';
import BusinessHoursEditor, { BusinessHour } from './BusinessHoursEditor';

interface ProfileTabProps {
  name: string;
  email: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  isLoading: boolean;
  businessHours: BusinessHour[];
  setName: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  setWebsite: React.Dispatch<React.SetStateAction<string>>;
  setBusinessHours: React.Dispatch<React.SetStateAction<BusinessHour[]>>;
  handleSaveProfile: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  name,
  email,
  description,
  address,
  phone,
  website,
  businessHours,
  isLoading,
  setName,
  setEmail,
  setDescription,
  setAddress,
  setPhone,
  setWebsite,
  setBusinessHours,
  handleSaveProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = () => {
    handleSaveProfile();
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Establishment Profile</CardTitle>
        <Button 
          variant={isEditing ? "secondary" : "outline"} 
          size="sm" 
          onClick={() => setIsEditing(!isEditing)}
        >
          <PenIcon className="h-4 w-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-left block">Name</label>
                <Input 
                  name="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-left block">Email</label>
                <Input 
                  name="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-left block">Address</label>
                <Input 
                  name="address" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-left block">Phone</label>
                <Input 
                  name="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-left block">Website</label>
                <Input 
                  name="website" 
                  value={website} 
                  onChange={(e) => setWebsite(e.target.value)} 
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium text-left block">Description</label>
                <Textarea 
                  name="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="col-span-2">
                <BusinessHoursEditor 
                  hours={businessHours}
                  setHours={setBusinessHours}
                  isEditing={true}
                />
              </div>

              <div className="col-span-2 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 text-left">Name</h3>
                <p>{name || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 text-left">Email</h3>
                <p>{email || 'N/A'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 text-left">Address</h3>
                <p>{address || 'N/A'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 text-left">Phone</h3>
                <p>{phone || 'N/A'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 text-left">Website</h3>
                {website ? (
                  <a 
                    href={website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {website}
                  </a>
                ) : (
                  <p>N/A</p>
                )}
              </div>

              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500 text-left">Description</h3>
                <p className="whitespace-pre-wrap">{description || 'No description available.'}</p>
              </div>

              <div className="col-span-2">
                <BusinessHoursEditor 
                  hours={businessHours}
                  setHours={setBusinessHours}
                  isEditing={false}
                />
              </div>

              <div className="col-span-2 mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2 text-left">Establishment Photos</h3>
                <div className="border rounded-md p-4">
                  <FileUploader />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
