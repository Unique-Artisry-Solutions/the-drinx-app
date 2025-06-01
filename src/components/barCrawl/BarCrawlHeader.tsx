
import React from 'react';
import BarCrawlDetails from './BarCrawlDetails';
import JoinBarCrawlButton from './JoinBarCrawlButton';

interface BarCrawlHeaderProps {
  name: string;
  organizer: string;
  date: string;
  stops: number;
  description?: string;
  id?: string;
  showJoinButton?: boolean;
}

const BarCrawlHeader: React.FC<BarCrawlHeaderProps> = ({
  name,
  organizer,
  date,
  stops,
  description,
  id,
  showJoinButton = true
}) => {
  return (
    <div className="mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{name}</h1>
          <BarCrawlDetails
            organizer={organizer}
            date={date}
            stops={stops}
          />
        </div>
        {id && showJoinButton && (
          <JoinBarCrawlButton barCrawlId={id} />
        )}
      </div>
      
      {description && (
        <p className="text-gray-700 mb-3">{description}</p>
      )}
    </div>
  );
};

export default BarCrawlHeader;
