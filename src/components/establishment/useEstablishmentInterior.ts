
import { useState, useCallback } from 'react';

interface BusinessHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

interface EstablishmentData {
  name: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  businessHours: BusinessHour[];
  images: string[];
}

export const useEstablishmentInterior = (initialData?: Partial<EstablishmentData>) => {
  const [establishment, setEstablishment] = useState<EstablishmentData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    website: initialData?.website || '',
    businessHours: initialData?.businessHours || [
      { day: 'Monday', open: '09:00', close: '17:00', closed: false },
      { day: 'Tuesday', open: '09:00', close: '17:00', closed: false },
      { day: 'Wednesday', open: '09:00', close: '17:00', closed: false },
      { day: 'Thursday', open: '09:00', close: '17:00', closed: false },
      { day: 'Friday', open: '09:00', close: '17:00', closed: false },
      { day: 'Saturday', open: '10:00', close: '16:00', closed: false },
      { day: 'Sunday', open: '10:00', close: '16:00', closed: true },
    ],
    images: initialData?.images || [],
  });

  const updateEstablishment = useCallback((field: keyof EstablishmentData, value: any) => {
    setEstablishment((prev: EstablishmentData) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updateBusinessHours = useCallback((dayIndex: number, field: string, value: string | boolean) => {
    setEstablishment((prev: EstablishmentData) => ({
      ...prev,
      businessHours: prev.businessHours.map((hour: BusinessHour, index: number) => 
        index === dayIndex ? { ...hour, [field]: value } : hour
      ),
    }));
  }, []);

  const addImage = useCallback((imageUrl: string) => {
    setEstablishment((prev: EstablishmentData) => ({
      ...prev,
      images: [...prev.images, imageUrl],
    }));
  }, []);

  const removeImage = useCallback((index: number) => {
    setEstablishment((prev: EstablishmentData) => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== index),
    }));
  }, []);

  return {
    establishment,
    updateEstablishment,
    updateBusinessHours,
    addImage,
    removeImage,
  };
};
