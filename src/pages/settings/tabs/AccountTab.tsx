
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import PhotoUploadField from '@/components/PhotoUploadField';
import { UserProfileFormData } from '../hooks/useProfileData';
import { useProfileFormContext } from '../hooks/useProfileFormContext';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';

interface AccountTabProps {
  profile: UserProfileFormData;
  isLightTheme: boolean;
  avatarFile: File | null;
  onPhotoSelect: (file: File) => void;
}

const AccountTab: React.FC<AccountTabProps> = ({ profile, isLightTheme, avatarFile, onPhotoSelect }) => {
  const form = useProfileFormContext();
  
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
          
          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={isLightTheme ? "text-gray-700" : ""}>
                  Display Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Your display name"
                    className={isLightTheme ? "bg-white border-gray-200" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={isLightTheme ? "text-gray-700" : ""}>
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Your username"
                    className={isLightTheme ? "bg-white border-gray-200" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={isLightTheme ? "text-gray-700" : ""}>
                  Bio
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Tell us about yourself"
                    className={cn(
                      "h-24",
                      isLightTheme ? "bg-white border-gray-200" : ""
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={isLightTheme ? "text-gray-700" : ""}>
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled
                    className={cn(
                      isLightTheme ? "bg-gray-100 text-gray-500 border-gray-200" : "text-muted-foreground"
                    )}
                  />
                </FormControl>
                <p className={cn(
                  "text-xs", 
                  isLightTheme ? "text-gray-500" : "text-muted-foreground"
                )}>
                  Email cannot be changed here
                </p>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={isLightTheme ? "text-gray-700" : ""}>
                  Phone
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Your phone number"
                    className={isLightTheme ? "bg-white border-gray-200" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AccountTab;
