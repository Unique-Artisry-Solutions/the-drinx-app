
import React from 'react';
import BaseCard from '@/components/cards/BaseCard';

interface CocktailCardProps {
  id: string;
  name: string;
  price: string;
  description: string;
  ingredients?: string[];
  image?: string;
  establishment: {
    id: string;
    name: string;
    distance?: string;
  } | undefined;
  className?: string;
  
  // Reward-related props
  potentialPoints?: number;
  streakBonus?: number;
  achievementProgress?: {
    name: string;
    current: number;
    total: number;
  };
  mocktailContribution?: {
    weeklyGoal: number;
    monthlyGoal: number;
  };
}

const CocktailCard: React.FC<CocktailCardProps> = ({
  id,
  name,
  price,
  description,
  ingredients,
  image,
  establishment,
  className,
  potentialPoints = 15,
  streakBonus,
  achievementProgress,
  mocktailContribution
}) => {
  const establishmentName = establishment?.name || 'Unknown Venue';
  const establishmentDistance = establishment?.distance;
  
  const subtitle = establishmentDistance 
    ? `${establishmentName} · ${establishmentDistance}`
    : establishmentName;

  return (
    <BaseCard
      id={id}
      title={name}
      subtitle={subtitle}
      description={description}
      price={price}
      image={image}
      linkPath={`/cocktail/${id}`}
      className={className}
      potentialPoints={potentialPoints}
      streakBonus={streakBonus}
      achievementProgress={achievementProgress}
      tags={ingredients}
      variant="vertical"
      imageHeight="h-48"
    />
  );
};

export default CocktailCard;
