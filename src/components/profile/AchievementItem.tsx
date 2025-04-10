
import React from 'react';
import { format } from 'date-fns';
import { Award, Map, ThumbsUp, Trophy, Smile } from 'lucide-react';
import { UserVisitAchievement } from '@/types/VisitTypes';

interface AchievementItemProps {
  achievement: UserVisitAchievement;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement }) => {
  const getAchievementIcon = () => {
    switch (achievement.achievement_type) {
      case 'first_visit':
        return <Smile className="h-6 w-6 text-blue-500" />;
      case 'visit_milestone':
        return <Trophy className="h-6 w-6 text-amber-500" />;
      case 'explorer':
        return <Map className="h-6 w-6 text-green-500" />;
      default:
        return <Award className="h-6 w-6 text-purple-500" />;
    }
  };
  
  const getAchievementTitle = () => {
    switch (achievement.achievement_type) {
      case 'first_visit':
        return 'First Visit';
      case 'visit_milestone':
        const count = achievement.achievement_data.count;
        return `${count} Visits`;
      case 'explorer':
        const uniqueCount = achievement.achievement_data.unique_count;
        return `Explorer (${uniqueCount} Establishments)`;
      default:
        return 'Achievement Unlocked';
    }
  };
  
  const getAchievementDescription = () => {
    switch (achievement.achievement_type) {
      case 'first_visit':
        return `First visit to ${achievement.achievement_data.establishment_name || 'an establishment'}`;
      case 'visit_milestone':
        return `You've visited ${achievement.achievement_data.count} establishments!`;
      case 'explorer':
        return `You've explored ${achievement.achievement_data.unique_count} different places`;
      default:
        return 'You unlocked a new achievement';
    }
  };

  return (
    <div className="flex items-center p-3 border rounded-lg bg-white hover:bg-gray-50">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-50 mr-3">
        {getAchievementIcon()}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{getAchievementTitle()}</h3>
        <p className="text-sm text-gray-600">{getAchievementDescription()}</p>
        <p className="text-xs text-gray-500 mt-1">
          Earned on {format(new Date(achievement.earned_at), 'MMM d, yyyy')}
        </p>
      </div>
    </div>
  );
};

export default AchievementItem;
