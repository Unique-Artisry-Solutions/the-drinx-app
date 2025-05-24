
import React from 'react';
import { Input } from '@/components/ui/input';

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
}

interface CheckoutContactFormProps {
  contactInfo: ContactInfo;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckoutContactForm: React.FC<CheckoutContactFormProps> = ({ 
  contactInfo, 
  onInputChange 
}) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Contact Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="firstName">
            First Name
          </label>
          <Input 
            id="firstName" 
            placeholder="First Name" 
            required 
            value={contactInfo.firstName}
            onChange={onInputChange}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="lastName">
            Last Name
          </label>
          <Input 
            id="lastName" 
            placeholder="Last Name" 
            required 
            value={contactInfo.lastName}
            onChange={onInputChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <Input 
          id="email" 
          type="email" 
          placeholder="Email" 
          required 
          value={contactInfo.email}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
};

export default CheckoutContactForm;
