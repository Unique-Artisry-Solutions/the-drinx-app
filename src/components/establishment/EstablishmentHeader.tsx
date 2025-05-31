
import React from 'react';
import EstablishmentHero from './EstablishmentHero';
import EstablishmentActions from './EstablishmentActions';

interface EstablishmentHeaderProps {
  establishment?: any;
  hasCheckedIn?: boolean;
  isPromoter?: boolean;
  onCheckIn?: () => void;
  onBarCrawlRequest?: () => void;
}

const EstablishmentHeader: React.FC<EstablishmentHeaderProps> = ({
  establishment = null,
  hasCheckedIn = false,
  isPromoter = false,
  onCheckIn = () => console.warn('No check-in handler provided'),
  onBarCrawlRequest = () => console.warn('No bar crawl request handler provided')
}) => {
  // Fallback UI when establishment data is missing
  if (!establishment) {
    return (
      <div className="relative mb-6">
        <div className="h-48 md:h-64 bg-gray-200 rounded-xl flex items-center justify-center">
          <p className="text-gray-500">Establishment information not available</p>
        </div>
      </div>
    );
  }

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
