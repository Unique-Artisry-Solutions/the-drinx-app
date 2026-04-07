
import React from 'react';
import EstablishmentHero from './EstablishmentHero';
import EstablishmentActions from './EstablishmentActions';

interface EstablishmentHeaderProps {
  establishment: any;
  hasCheckedIn: boolean;
  isPromoter: boolean;
  onCheckIn: () => void;
  onSwigCircuitRequest: () => void;
}

const EstablishmentHeader: React.FC<EstablishmentHeaderProps> = ({
  establishment,
  hasCheckedIn,
  isPromoter,
  onCheckIn,
  onSwigCircuitRequest
}) => {
  return (
    <div className="relative mb-6">
      <EstablishmentHero establishment={establishment} />
      <div className="absolute bottom-6 right-6">
        <EstablishmentActions 
          hasCheckedIn={hasCheckedIn}
          isPromoter={isPromoter}
          onCheckIn={onCheckIn}
          onSwigCircuitRequest={onSwigCircuitRequest}
        />
      </div>
    </div>
  );
};

export default EstablishmentHeader;
