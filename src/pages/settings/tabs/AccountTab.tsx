
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import PhotoUploadField from '@/components/PhotoUploadField';
import { UserProfile } from '../hooks/useProfileData';
import { useProfileFormContext } from '../hooks/useProfileFormContext';

interface AccountTabProps {
  profile: UserProfile;
  isLightTheme: boolean;
  avatarFile: File | null;
  onPhotoSelect: (file: File) => void;
}

const AccountTab: React.FC<AccountTabProps> = ({ profile, isLightTheme, avatarFile, onPhotoSelect }) => {
  const { handleChange } = useProfileFormContext();
  
  return (
    <TabsContent value="account">
      <Card className={isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""}>
        <CardHeader>
          <CardTitle className={isLightTheme ? "text-gray-800" : ""}>
            Account Information
          </CardTitle>
          <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
            Update your personal information
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avatar" className={isLightTheme ? "text-gray-700" : ""}>
              Profile Picture
            </Label>
            <div className="flex items-center gap-4">
              {profile.avatar_url && (
                <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-200">
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    className="h-full w-full object-cover" 
                  />
                </div>
              )}
              <div className="flex-1">
                <PhotoUploadField onPhotoSelect={onPhotoSelect} />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="display_name" className={isLightTheme ? "text-gray-700" : ""}>
              Display Name
            </Label>
            <Input
              id="display_name"
              name="display_name"
              value={profile.display_name}
              onChange={handleChange}
              placeholder="Your display name"
              className={isLightTheme ? "bg-white border-gray-200" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username" className={isLightTheme ? "text-gray-700" : ""}>
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              placeholder="Your username"
              className={isLightTheme ? "bg-white border-gray-200" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className={isLightTheme ? "text-gray-700" : ""}>
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              className={cn(
                "h-24",
                isLightTheme ? "bg-white border-gray-200" : ""
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className={isLightTheme ? "text-gray-700" : ""}>
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={profile.email}
              disabled
              className={cn(
                isLightTheme ? "bg-gray-100 text-gray-500 border-gray-200" : "text-muted-foreground"
              )}
            />
            <p className={cn(
              "text-xs", 
              isLightTheme ? "text-gray-500" : "text-muted-foreground"
            )}>
              Email cannot be changed here
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className={isLightTheme ? "text-gray-700" : ""}>
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Your phone number"
              className={isLightTheme ? "bg-white border-gray-200" : ""}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AccountTab;
