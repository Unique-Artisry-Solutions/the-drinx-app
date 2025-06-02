
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedProgressBarProps {
  value: number;
  max: number;
  className?: string;
  color?: string;
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  value,
  max,
  className = "",
  color = "#10b981"
}) => {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <motion.div
        className="h-2 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

export default AnimatedProgressBar;
