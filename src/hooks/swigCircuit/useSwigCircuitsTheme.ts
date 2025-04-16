
import React from 'react';
import { Star } from 'lucide-react';

export const useSwigCircuitsTheme = () => {
  // Get theme color based on category
  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Urban Exploration':
        return 'from-blue-500 to-blue-600';
      case 'Weekend Getaway':
        return 'from-purple-500 to-purple-600';
      case 'Cocktail Masters':
        return 'from-amber-500 to-amber-600';
      case 'Local Gems':
        return 'from-green-500 to-green-600';
      default:
        return 'from-spiritless-pink to-spiritless-orange';
    }
  };

  // Get theme border color
  const getThemeBorderColor = (theme: string) => {
    switch (theme) {
      case 'Urban Exploration':
        return 'border-blue-500';
      case 'Weekend Getaway':
        return 'border-purple-500';
      case 'Cocktail Masters':
        return 'border-amber-500';
      case 'Local Gems':
        return 'border-green-500';
      default:
        return 'border-spiritless-pink';
    }
  };
  
  // Get theme image pattern based on theme
  const getThemeImage = (theme: string) => {
    switch (theme) {
      case 'Urban Exploration':
        return "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234299e1' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";
      case 'Weekend Getaway':
        return "url(\"data:image/svg+xml,%3Csvg width='48' height='32' viewBox='0 0 48 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a78bfa' fill-opacity='0.15'%3E%3Cpath d='M27 32c0-3.314 2.686-6 6-6 5.523 0 10-4.477 10-10S38.523 6 33 6c-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 6.627 0 12 5.373 12 12s-5.373 12-12 12c-2.21 0-4 1.79-4 4h-2zm-6 0c0-3.314-2.686-6-6-6-5.523 0-10-4.477-10-10S9.477 6 15 6c3.314 0 6-2.686 6-6h-2c0 2.21-1.79 4-4 4C8.373 4 3 9.373 3 16s5.373 12 12 12c2.21 0 4 1.79 4 4h2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";
      case 'Cocktail Masters':
        return "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.15'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";
      case 'Local Gems':
        return "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.15'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";
      default:
        return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23FF719A' fill-opacity='0.15'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";
    }
  };
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Moderate':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Challenging':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  // Get difficulty icon
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return <Star className="mr-1 h-3 w-3" />;
      case 'Moderate':
        return (
          <>
            <Star className="mr-0 h-3 w-3" />
            <Star className="mr-1 h-3 w-3" />
          </>
        );
      case 'Challenging':
        return (
          <>
            <Star className="mr-0 h-3 w-3" />
            <Star className="mr-0 h-3 w-3" />
            <Star className="mr-1 h-3 w-3" />
          </>
        );
      default:
        return <Star className="mr-1 h-3 w-3" />;
    }
  };

  return {
    getThemeColor,
    getThemeBorderColor,
    getThemeImage,
    getDifficultyColor,
    getDifficultyIcon
  };
};

export default useSwigCircuitsTheme;
