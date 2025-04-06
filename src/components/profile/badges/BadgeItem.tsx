
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';

interface BadgeItemProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

const BadgeItem: React.FC<BadgeItemProps> = ({ 
  icon, 
  name, 
  description, 
  unlocked, 
  progress, 
  maxProgress 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={`p-4 border rounded-lg ${unlocked 
      ? (isDark ? 'bg-gray-800 border-gray-700' : 'bg-white')
      : (isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50')}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${unlocked 
          ? (isDark ? 'bg-green-900' : 'bg-green-100') 
          : (isDark ? 'bg-gray-800' : 'bg-gray-200')}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{name}</h3>
            {unlocked && (
              <Badge variant="secondary" className={isDark 
                ? "bg-green-900 text-green-100" 
                : "bg-green-100 text-green-800"}>
                Unlocked
              </Badge>
            )}
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
          
          {progress !== undefined && maxProgress !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{progress}/{maxProgress}</span>
              </div>
              <Progress value={(progress / maxProgress) * 100} className="h-2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadgeItem;
