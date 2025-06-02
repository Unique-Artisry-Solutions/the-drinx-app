
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showGlow?: boolean;
  color?: 'default' | 'success' | 'warning' | 'error';
  animate?: boolean;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  value,
  max = 100,
  className = "",
  showGlow = false,
  color = 'default',
  animate = true
}) => {
  const percentage = Math.min(value / max * 100, 100);
  
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };
  
  const getGlowColor = () => {
    switch (color) {
      case 'success':
        return 'shadow-green-400';
      case 'warning':
        return 'shadow-amber-400';
      case 'error':
        return 'shadow-red-400';
      default:
        return 'shadow-primary';
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div 
          className={`h-full rounded-full ${getColorClasses()} ${showGlow ? `shadow-lg ${getGlowColor()}` : ''}`}
          initial={animate ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animate ? 1.2 : 0,
            ease: "easeOut",
            delay: animate ? 0.2 : 0
          }}
        />
        
        {showGlow && percentage > 0 && (
          <motion.div 
            className={`absolute top-0 h-full w-2 rounded-full ${getColorClasses()} opacity-60 blur-sm`}
            style={{ left: `${Math.max(0, percentage - 2)}%` }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
      
      {animate && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="absolute -top-8 left-0 text-xs font-medium text-muted-foreground py-0 my-0"
        >
          {value} / {max}
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedProgressBar;
