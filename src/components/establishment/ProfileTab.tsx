
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PenIcon } from 'lucide-react';
import { Establishment } from '@/types/ProfileTypes';
import FileUploader from '@/components/common/FileUploader';

interface ProfileTabProps {
  establishment: Establishment | null;
  updateEstablishment: (updatedData: any) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ establishment, updateEstablishment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: establishment?.name || '',
    address: establishment?.address || '',
    phone: establishment?.phone || '',
    website: establishment?.website || '',
    description: establishment?.description || '',
    email: establishment?.email || '',
    socialMedia: {
      facebook: establishment?.socialMedia?.facebook || '',
      instagram: establishment?.socialMedia?.instagram || '',
      twitter: establishment?.socialMedia?.twitter || '',
    },
    hours: establishment?.hours || {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      socialMedia: { ...formData.socialMedia, [name]: value } 
    });
  };

  const handleSubmit = () => {
    updateEstablishment(formData);
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
                <label className="text-sm font-medium">Name</label>
                <Input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>

              <div>
                <label className="text-sm font-medium">Address</label>
                <Input 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                />
              </div>

              <div>
                <label className="text-sm font-medium">Website</label>
                <Input 
                  name="website" 
                  value={formData.website} 
                  onChange={handleChange} 
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Facebook</label>
                <Input 
                  name="facebook" 
                  value={formData.socialMedia.facebook} 
                  onChange={handleSocialChange} 
                />
              </div>

              <div>
                <label className="text-sm font-medium">Instagram</label>
                <Input 
                  name="instagram" 
                  value={formData.socialMedia.instagram} 
                  onChange={handleSocialChange} 
                />
              </div>

              <div>
                <label className="text-sm font-medium">Twitter</label>
                <Input 
                  name="twitter" 
                  value={formData.socialMedia.twitter} 
                  onChange={handleSocialChange} 
                />
              </div>

              <div className="col-span-2 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p>{establishment?.name || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p>{establishment?.email || 'N/A'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p>{establishment?.address || 'N/A'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p>{establishment?.phone || 'N/A'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Website</h3>
                {establishment?.website ? (
                  <a 
                    href={establishment.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {establishment.website}
                  </a>
                ) : (
                  <p>N/A</p>
                )}
              </div>

              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="whitespace-pre-wrap">{establishment?.description || 'No description available.'}</p>
              </div>

              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Social Media</h3>
                <div className="flex space-x-4 mt-1">
                  {establishment?.socialMedia?.facebook && (
                    <a 
                      href={establishment.socialMedia.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Facebook
                    </a>
                  )}
                  {establishment?.socialMedia?.instagram && (
                    <a 
                      href={establishment.socialMedia.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Instagram
                    </a>
                  )}
                  {establishment?.socialMedia?.twitter && (
                    <a 
                      href={establishment.socialMedia.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Twitter
                    </a>
                  )}
                  {!establishment?.socialMedia?.facebook && 
                   !establishment?.socialMedia?.instagram && 
                   !establishment?.socialMedia?.twitter && (
                    <p>No social media links available.</p>
                  )}
                </div>
              </div>

              <div className="col-span-2 mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Establishment Photos</h3>
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
