
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, MapPin, Camera, Share, Zap, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
  isPopular?: boolean;
}

export interface QuickActionCardsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  {
    id: 'add-recipe',
    title: 'Create Recipe',
    description: 'Share your mocktail creation',
    icon: <Plus className="h-5 w-5" />,
    onClick: () => console.log('Create recipe'),
    color: 'from-purple-500 to-pink-500',
    isPopular: true
  },
  {
    id: 'find-places',
    title: 'Find Places',
    description: 'Discover nearby establishments',
    icon: <MapPin className="h-5 w-5" />,
    onClick: () => console.log('Find places'),
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'check-in',
    title: 'Check In',
    description: 'Log your visit',
    icon: <Camera className="h-5 w-5" />,
    onClick: () => console.log('Check in'),
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'share',
    title: 'Share Experience',
    description: 'Tell friends about your visit',
    icon: <Share className="h-5 w-5" />,
    onClick: () => console.log('Share'),
    color: 'from-orange-500 to-yellow-500'
  }
];

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({ 
  actions = defaultActions 
}) => {
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleActionClick = async (action: QuickAction) => {
    setIsLoading(action.id);
    
    // Simulate loading state
    setTimeout(() => {
      setIsLoading(null);
      setSelectedAction(action);
    }, 800);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Zap className="h-5 w-5 text-primary animate-pulse" />
            Quick Actions
            <Clock className="h-4 w-4 text-muted-foreground ml-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="grid grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {actions.map((action) => (
              <motion.div key={action.id} variants={itemVariants}>
                <Button
                  variant="outline"
                  className={`
                    h-auto p-0 overflow-hidden group relative border-2
                    hover:border-primary/50 hover:shadow-xl transition-all duration-300
                    ${isLoading === action.id ? 'pointer-events-none' : ''}
                  `}
                  onClick={() => handleActionClick(action)}
                  disabled={isLoading === action.id}
                >
                  <div className={`
                    w-full h-full p-4 flex flex-col items-center gap-3 relative
                    bg-gradient-to-br ${action.color || 'from-gray-100 to-gray-200'}
                    dark:from-gray-800 dark:to-gray-700 group-hover:scale-105 transition-transform duration-300
                  `}>
                    {action.isPopular && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
                        Popular
                      </div>
                    )}
                    
                    <div className={`
                      p-3 rounded-full bg-white/20 backdrop-blur-sm
                      group-hover:bg-white/30 transition-all duration-300
                      ${isLoading === action.id ? 'animate-spin' : 'group-hover:scale-110'}
                    `}>
                      {action.icon}
                    </div>
                    
                    <div className="text-center text-white">
                      <div className="font-semibold text-sm mb-1">{action.title}</div>
                      <div className="text-xs opacity-90 leading-tight">{action.description}</div>
                    </div>

                    {isLoading === action.id && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedAction} onOpenChange={() => setSelectedAction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAction?.icon}
              {selectedAction?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedAction?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              This action will help you {selectedAction?.title.toLowerCase()}. 
              Would you like to continue?
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setSelectedAction(null)}>
                Cancel
              </Button>
              <Button onClick={() => {
                selectedAction?.onClick();
                setSelectedAction(null);
              }}>
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
