
import React from 'react';
import BaseCard from '@/components/cards/BaseCard';

interface EstablishmentCardProps {
  id: string;
  name: string;
  address: string;
  distance?: string;
  cocktailCount: number;
  image?: string;
  className?: string;
  onClick?: () => void;
  
  // Reward-related props
  potentialPoints?: number;
  streakBonus?: number;
  achievementProgress?: {
    name: string;
    current: number;
    total: number;
  };
  visitContribution?: {
    weeklyGoal: number;
    monthlyGoal: number;
  };
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({
  id,
  name,
  address,
  distance,
  cocktailCount,
  image,
  className,
  onClick,
  potentialPoints = 25,
  streakBonus,
  achievementProgress,
  visitContribution
}) => {
  return (
    <BaseCard
      id={id}
      title={name}
      subtitle={address}
      distance={distance}
      image={image}
      linkPath={`/establishment/${id}`}
      className={className}
      onClick={onClick}
      potentialPoints={potentialPoints}
      streakBonus={streakBonus}
      achievementProgress={achievementProgress}
      extraInfo={`${cocktailCount} ${cocktailCount === 1 ? 'cocktail' : 'cocktails'} available`}
      variant="horizontal"
    />
  );
};

export default EstablishmentCard;
