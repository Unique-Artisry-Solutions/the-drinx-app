
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Map } from 'lucide-react';
import EstablishmentCard from '@/components/EstablishmentCard';

interface Establishment {
  id: string;
  name: string;
  address: string;
  image?: string;
  distance?: string;
  cocktailCount: number;
}

interface FeaturedEstablishmentsSectionProps {
  establishments: Establishment[];
}

const FeaturedEstablishmentsSection: React.FC<FeaturedEstablishmentsSectionProps> = ({ 
  establishments 
}) => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  // Mock reward data generator for demonstrations
  const generateRewardData = (index: number) => {
    const basePoints = 20 + (index * 5);
    const hasStreak = Math.random() > 0.5;
    const hasAchievement = Math.random() > 0.6;
    
    return {
      potentialPoints: basePoints,
      streakBonus: hasStreak ? Math.floor(basePoints * 0.3) : undefined,
      achievementProgress: hasAchievement ? {
        name: index % 2 === 0 ? 'Social Explorer' : 'Venue Hopper',
        current: Math.floor(Math.random() * 8) + 2,
        total: 10
      } : undefined,
      visitContribution: {
        weeklyGoal: Math.floor(Math.random() * 15) + 10,
        monthlyGoal: Math.floor(Math.random() * 8) + 5
      }
    };
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4 px-3">
        <h2 className="text-xl font-semibold flex items-center text-foreground">
          <Building className="h-5 w-5 mr-2 text-spiritless-pink" />
          Featured Establishments
        </h2>
        <Link 
          to="/map" 
          className="flex items-center justify-center h-8 w-8 rounded-full bg-spiritless-pink/10 text-spiritless-pink hover:bg-spiritless-pink/20" 
          onClick={scrollToTop}
          aria-label="View all on map"
        >
          <Map className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="flex flex-col space-y-3 px-3">
        {establishments.slice(0, 4).map((establishment, index) => {
          const rewardData = generateRewardData(index);
          
          return (
            <EstablishmentCard 
              key={establishment.id}
              id={establishment.id}
              name={establishment.name}
              address={establishment.address}
              image={establishment.image}
              distance={establishment.distance}
              cocktailCount={establishment.cocktailCount}
              {...rewardData}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedEstablishmentsSection;
