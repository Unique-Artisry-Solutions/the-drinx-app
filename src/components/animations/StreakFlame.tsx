
import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakFlameProps {
  streakCount: number;
  className?: string;
  size?: number;
}

export const StreakFlame: React.FC<StreakFlameProps> = ({
  streakCount,
  className = "",
  size = 24
}) => {
  const getIntensity = () => {
    if (streakCount === 0) return 'cold';
    if (streakCount < 3) return 'warm';
    if (streakCount < 7) return 'hot';
    if (streakCount < 14) return 'blazing';
    return 'inferno';
  };

  const getFlameConfig = () => {
    const intensity = getIntensity();
    
    switch (intensity) {
      case 'cold':
        return {
          color: 'text-gray-400',
          glowColor: 'drop-shadow-none',
          animation: { scale: [1, 1.05, 1], duration: 3 }
        };
      case 'warm':
        return {
          color: 'text-orange-400',
          glowColor: 'drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]',
          animation: { scale: [1, 1.1, 1], duration: 2.5 }
        };
      case 'hot':
        return {
          color: 'text-orange-500',
          glowColor: 'drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]',
          animation: { scale: [1, 1.15, 1], duration: 2 }
        };
      case 'blazing':
        return {
          color: 'text-red-500',
          glowColor: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]',
          animation: { scale: [1, 1.2, 1], duration: 1.5 }
        };
      case 'inferno':
        return {
          color: 'text-red-600',
          glowColor: 'drop-shadow-[0_0_16px_rgba(220,38,38,1)]',
          animation: { scale: [1, 1.3, 1], duration: 1 }
        };
    }
  };

  const config = getFlameConfig();
  const intensity = getIntensity();

  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={config.animation}
        transition={{
          repeat: Infinity,
          ease: "easeInOut",
          duration: config.animation.duration
        }}
        className={`${config.glowColor}`}
      >
        <Flame 
          size={size} 
          className={`${config.color} ${intensity !== 'cold' ? 'fill-current' : ''}`}
        />
      </motion.div>
      
      {/* Additional particle effects for higher streaks */}
      {intensity === 'blazing' || intensity === 'inferno' ? (
        <div className="absolute inset-0">
          {Array.from({ length: intensity === 'inferno' ? 4 : 2 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full"
              style={{
                left: `${30 + i * 15}%`,
                top: `${20 + (i % 2) * 40}%`
              }}
              animate={{
                y: [-5, -15, -5],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
