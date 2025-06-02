
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface UserTypeSelectorProps {
  userType: 'individual' | 'establishment' | 'promoter';
  onUserTypeChange: (userType: 'individual' | 'establishment' | 'promoter') => void;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  userType,
  onUserTypeChange
}) => {
  return (
    <RadioGroup value={userType} onValueChange={onUserTypeChange as (value: string) => void}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="individual" id="individual" />
        <Label htmlFor="individual">Individual</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="establishment" id="establishment" />
        <Label htmlFor="establishment">Establishment</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="promoter" id="promoter" />
        <Label htmlFor="promoter">Promoter</Label>
      </div>
    </RadioGroup>
  );
};

export default UserTypeSelector;
