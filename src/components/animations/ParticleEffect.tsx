
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

interface ParticleEffectProps {
  trigger: boolean;
  points?: number;
  origin?: { x: number; y: number };
  onComplete?: () => void;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  trigger,
  points = 25,
  origin = { x: 50, y: 50 },
  onComplete
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: origin.x,
      y: origin.y,
      color: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 5)],
      size: Math.random() * 6 + 4,
      velocity: {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200
      }
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [trigger, origin.x, origin.y, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
            initial={{
              scale: 0,
              opacity: 1
            }}
            animate={{
              x: particle.velocity.x,
              y: particle.velocity.y,
              scale: [0, 1.2, 0],
              opacity: [1, 1, 0]
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut"
            }}
          />
        ))}
      </AnimatePresence>
      
      {trigger && points && (
        <motion.div
          className="absolute text-2xl font-bold text-amber-500 pointer-events-none"
          style={{
            left: `${origin.x}%`,
            top: `${origin.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ scale: 0, y: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.3, 1], 
            y: -50, 
            opacity: [0, 1, 0] 
          }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          +{points}
        </motion.div>
      )}
    </div>
  );
};
