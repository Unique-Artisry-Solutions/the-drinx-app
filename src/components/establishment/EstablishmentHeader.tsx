
import React from 'react';
import EstablishmentHero from './EstablishmentHero';
import EstablishmentActions from './EstablishmentActions';

interface EstablishmentHeaderProps {
  establishment: any;
  hasCheckedIn: boolean;
  isPromoter: boolean;
  onCheckIn: () => void;
  onBarCrawlRequest: () => void;
}

const EstablishmentHeader: React.FC<EstablishmentHeaderProps> = ({
  establishment,
  hasCheckedIn,
  isPromoter,
  onCheckIn,
  onBarCrawlRequest
}) => {
  return (
    <div className="relative mb-6">
      <EstablishmentHero establishment={establishment} />
      <div className="absolute bottom-6 right-6">
        <EstablishmentActions 
          hasCheckedIn={hasCheckedIn}
          isPromoter={isPromoter}
          onCheckIn={onCheckIn}
          onBarCrawlRequest={onBarCrawlRequest}
        />
      </div>
    </div>
  );
};

export default EstablishmentHeader;
