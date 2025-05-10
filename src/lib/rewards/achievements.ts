
import { Achievement } from './types';

export const achievementCategories = [
  { id: 'visits', name: 'Visits' },
  { id: 'mocktails', name: 'Mocktails' },
  { id: 'reviews', name: 'Reviews' },
  { id: 'social', name: 'Social' },
  { id: 'special', name: 'Special' }
];

export const getAchievementsByCategory = (achievements: Achievement[]): Record<string, Achievement[]> => {
  return achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);
};
