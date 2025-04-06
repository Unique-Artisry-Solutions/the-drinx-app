
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BusinessHour } from '@/components/establishment/BusinessHoursEditor';

export const useEstablishmentProfileData = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    // Simulating API call to fetch establishment profile data
    setTimeout(() => {
      setName("Your Establishment");
      setEmail(localStorage.getItem('user_email') || '');
      setDescription("We serve the best mocktails in town!");
      setAddress("123 Main St, Anytown USA");
      setPhone("555-123-4567");
      setWebsite("www.yourestablishment.com");
      setBusinessHours([
        { day: 'Monday', openTime: '11:00', closeTime: '22:00' },
        { day: 'Tuesday', openTime: '11:00', closeTime: '22:00' },
        { day: 'Wednesday', openTime: '11:00', closeTime: '22:00' },
        { day: 'Thursday', openTime: '11:00', closeTime: '22:00' },
        { day: 'Friday', openTime: '11:00', closeTime: '00:00' },
        { day: 'Saturday', openTime: '11:00', closeTime: '00:00' },
        { day: 'Sunday', openTime: '12:00', closeTime: '21:00' }
      ]);
    }, 500);
  }, []);

  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simulate API call to save profile data
    setTimeout(() => {
      toast({
        title: 'Profile updated',
        description: 'Your establishment profile has been updated successfully',
      });
      setIsLoading(false);
    }, 1000);
  };

  return {
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
  };
};
