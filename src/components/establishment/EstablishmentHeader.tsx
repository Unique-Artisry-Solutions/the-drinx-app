
import React from 'react';
import { MapPin, Globe, Phone, Clock } from 'lucide-react';
import CheckInButton from './CheckInButton';

interface EstablishmentHeaderProps {
  name: string;
  address?: string;
  website?: string;
  phone?: string;
  id: string;
}

const EstablishmentHeader: React.FC<EstablishmentHeaderProps> = ({
  name,
  address,
  website,
  phone,
  id
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b">
      <div>
        <h1 className="text-2xl font-semibold">{name}</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-1 text-sm text-gray-600">
          {address && (
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              <span>{address}</span>
            </div>
          )}
          
          {website && (
            <div className="flex items-center">
              <Globe size={16} className="mr-1" />
              <a 
                href={website.startsWith('http') ? website : `https://${website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-material-primary"
              >
                {website.replace(/^(https?:\/\/)?(www\.)?/, '')}
              </a>
            </div>
          )}
          
          {phone && (
            <div className="flex items-center">
              <Phone size={16} className="mr-1" />
              <a href={`tel:${phone}`} className="hover:text-material-primary">
                {phone}
              </a>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <CheckInButton establishmentId={id} establishmentName={name} />
      </div>
    </div>
  );
};

export default EstablishmentHeader;
