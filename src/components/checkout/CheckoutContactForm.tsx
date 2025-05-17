
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
}

interface CheckoutContactFormProps {
  defaultValues?: {
    id?: string;
    email?: string;
  };
  onNext?: () => void;
}

const CheckoutContactForm: React.FC<CheckoutContactFormProps> = ({ 
  defaultValues = {},
  onNext
}) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: '',
    lastName: '',
    email: defaultValues.email || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default CheckoutContactForm;
