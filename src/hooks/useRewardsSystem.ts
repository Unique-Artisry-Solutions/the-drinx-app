
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface UserStats {
  swigCircuitsCompleted: number;
  establishmentsVisited: number;
  mocktailsTried: number;
  reviewsWritten: number;
  mocktailsCreated: number;
  mocktailsTryCount: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  requirement: {
    type: 'swigCircuits' | 'establishments' | 'mocktails' | 'reviews' | 'mocktailsCreated' | 'mocktailsTryCount' | 'custom';
    count: number;
  };
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  tier: number;
  requirement: {
    type: 'swigCircuits' | 'establishments' | 'mocktails' | 'tier' | 'mocktailsCreated' | 'mocktailsTryCount';
    count: number;
  };
  unlockedAt: string | null;
  code?: string;
}

export const useRewardsSystem = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    swigCircuitsCompleted: 0,
    establishmentsVisited: 0,
    mocktailsTried: 0,
    reviewsWritten: 0,
    mocktailsCreated: 0,
    mocktailsTryCount: 0
  });
  
  const [badges, setBadges] = useState<Badge[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [currentTier, setCurrentTier] = useState(1);
  const { toast } = useToast();
  
  // Load user stats and rewards from localStorage on initial load
  useEffect(() => {
    const loadUserStats = () => {
      const storedStats = localStorage.getItem('user_rewards_stats');
      if (storedStats) {
        setUserStats(JSON.parse(storedStats));
      } else {
        // Set some default stats for demo purposes
        const defaultStats: UserStats = {
          swigCircuitsCompleted: 7,
          establishmentsVisited: 12,
          mocktailsTried: 15,
          reviewsWritten: 3,
          mocktailsCreated: 2,
          mocktailsTryCount: 8
        };
        localStorage.setItem('user_rewards_stats', JSON.stringify(defaultStats));
        setUserStats(defaultStats);
      }
    };
    
    const loadBadges = () => {
      const storedBadges = localStorage.getItem('user_badges');
      if (storedBadges) {
        setBadges(JSON.parse(storedBadges));
      } else {
        // Set default badges
        const defaultBadges: Badge[] = [
          {
            id: 'badge-1',
            name: 'First Crawl',
            description: 'Complete your first bar crawl',
            icon: 'Route',
            unlockedAt: null,
            requirement: { type: 'swigCircuits', count: 1 }
          },
          {
            id: 'badge-2',
            name: 'Explorer',
            description: 'Visit 5 different establishments',
            icon: 'MapPin',
            unlockedAt: null,
            requirement: { type: 'establishments', count: 5 }
          },
          {
            id: 'badge-3',
            name: 'Mocktail Maven',
            description: 'Try 10 different mocktails',
            icon: 'GlassWater',
            unlockedAt: null,
            requirement: { type: 'mocktails', count: 10 }
          },
          {
            id: 'badge-4',
            name: 'Review Star',
            description: 'Write 3 establishment reviews',
            icon: 'Star',
            unlockedAt: null,
            requirement: { type: 'reviews', count: 3 }
          },
          {
            id: 'badge-5',
            name: 'Crawl Enthusiast',
            description: 'Complete 5 bar crawls',
            icon: 'Sparkles',
            unlockedAt: null,
            requirement: { type: 'swigCircuits', count: 5 }
          },
          {
            id: 'badge-6',
            name: 'VIP Crawler',
            description: 'Complete 15 bar crawls',
            icon: 'Trophy',
            unlockedAt: null,
            requirement: { type: 'swigCircuits', count: 15 }
          },
          {
            id: 'badge-7',
            name: 'Mixology Friend',
            description: 'Attend a mixology workshop',
            icon: 'Award',
            unlockedAt: null,
            requirement: { type: 'custom', count: 1 }
          },
          {
            id: 'badge-8',
            name: 'Social Butterfly',
            description: 'Invite 3 friends to bar crawls',
            icon: 'Gift',
            unlockedAt: null,
            requirement: { type: 'custom', count: 3 }
          },
          {
            id: 'badge-9',
            name: 'Mocktail Creator',
            description: 'Create your first mocktail recipe',
            icon: 'Wine',
            unlockedAt: null,
            requirement: { type: 'mocktailsCreated', count: 1 }
          },
          {
            id: 'badge-10',
            name: 'Recipe Master',
            description: 'Have 5 users try your mocktails',
            icon: 'ThumbsUp',
            unlockedAt: null,
            requirement: { type: 'mocktailsTryCount', count: 5 }
          }
        ];
        localStorage.setItem('user_badges', JSON.stringify(defaultBadges));
        setBadges(defaultBadges);
      }
    };
    
    const loadRewards = () => {
      const storedRewards = localStorage.getItem('user_rewards');
      if (storedRewards) {
        setRewards(JSON.parse(storedRewards));
      } else {
        // Set default rewards
        const defaultRewards: Reward[] = [
          {
            id: 'reward-1',
            name: '10% Off Signature Mocktails',
            description: 'Get 10% off signature mocktails at participating establishments',
            tier: 2,
            requirement: { type: 'swigCircuits', count: 5 },
            unlockedAt: null,
            code: 'MOCKTAIL10'
          },
          {
            id: 'reward-2',
            name: 'Free Mocktail',
            description: 'Get a free mocktail every 3rd establishment visit',
            tier: 2,
            requirement: { type: 'establishments', count: 9 },
            unlockedAt: null
          },
          {
            id: 'reward-3',
            name: 'Priority Reservations',
            description: 'Get priority reservations at participating establishments',
            tier: 2,
            requirement: { type: 'swigCircuits', count: 8 },
            unlockedAt: null
          },
          {
            id: 'reward-4',
            name: 'Exclusive Tasting Events',
            description: 'Access to exclusive tasting events',
            tier: 3,
            requirement: { type: 'swigCircuits', count: 15 },
            unlockedAt: null
          },
          {
            id: 'reward-5',
            name: 'VIP Bar Crawl Access',
            description: 'Access to VIP-only bar crawls',
            tier: 3,
            requirement: { type: 'tier', count: 3 },
            unlockedAt: null
          },
          {
            id: 'reward-6',
            name: 'Mixology Workshops',
            description: 'Free access to mocktail mixing workshops',
            tier: 3,
            requirement: { type: 'swigCircuits', count: 20 },
            unlockedAt: null
          },
          {
            id: 'reward-7',
            name: 'Featured Creator Badge',
            description: 'Get a special badge for your profile',
            tier: 2,
            requirement: { type: 'mocktailsCreated', count: 3 },
            unlockedAt: null
          },
          {
            id: 'reward-8',
            name: 'Recipe Spotlight',
            description: 'Your recipes featured on the homepage',
            tier: 3,
            requirement: { type: 'mocktailsTryCount', count: 10 },
            unlockedAt: null
          }
        ];
        localStorage.setItem('user_rewards', JSON.stringify(defaultRewards));
        setRewards(defaultRewards);
      }
    };
    
    loadUserStats();
    loadBadges();
    loadRewards();
  }, []);
  
  // Calculate current tier based on bar crawls completed
  useEffect(() => {
    if (userStats.swigCircuitsCompleted >= 15) {
      setCurrentTier(3);
    } else if (userStats.swigCircuitsCompleted >= 5) {
      setCurrentTier(2);
    } else {
      setCurrentTier(1);
    }
  }, [userStats.swigCircuitsCompleted]);
  
  // Check for newly unlocked badges and rewards
  useEffect(() => {
    // Check badges
    const updatedBadges = badges.map(badge => {
      if (badge.unlockedAt === null) {
        let isUnlocked = false;
        
        switch (badge.requirement.type) {
          case 'swigCircuits':
            isUnlocked = userStats.swigCircuitsCompleted >= badge.requirement.count;
            break;
          case 'establishments':
            isUnlocked = userStats.establishmentsVisited >= badge.requirement.count;
            break;
          case 'mocktails':
            isUnlocked = userStats.mocktailsTried >= badge.requirement.count;
            break;
          case 'reviews':
            isUnlocked = userStats.reviewsWritten >= badge.requirement.count;
            break;
          case 'mocktailsCreated':
            isUnlocked = userStats.mocktailsCreated >= badge.requirement.count;
            break;
          case 'mocktailsTryCount':
            isUnlocked = userStats.mocktailsTryCount >= badge.requirement.count;
            break;
          default:
            isUnlocked = false;
        }
        
        if (isUnlocked) {
          // This is a newly unlocked badge
          toast({
            title: 'New Badge Unlocked!',
            description: `You've earned the "${badge.name}" badge!`,
          });
          
          return {
            ...badge,
            unlockedAt: new Date().toISOString()
          };
        }
      }
      
      return badge;
    });
    
    if (JSON.stringify(updatedBadges) !== JSON.stringify(badges)) {
      setBadges(updatedBadges);
      localStorage.setItem('user_badges', JSON.stringify(updatedBadges));
    }
    
    // Check rewards
    const updatedRewards = rewards.map(reward => {
      if (reward.unlockedAt === null) {
        let isUnlocked = false;
        
        switch (reward.requirement.type) {
          case 'swigCircuits':
            isUnlocked = userStats.swigCircuitsCompleted >= reward.requirement.count;
            break;
          case 'establishments':
            isUnlocked = userStats.establishmentsVisited >= reward.requirement.count;
            break;
          case 'mocktails':
            isUnlocked = userStats.mocktailsTried >= reward.requirement.count;
            break;
          case 'tier':
            isUnlocked = currentTier >= reward.requirement.count;
            break;
          case 'mocktailsCreated':
            isUnlocked = userStats.mocktailsCreated >= reward.requirement.count;
            break;
          case 'mocktailsTryCount':
            isUnlocked = userStats.mocktailsTryCount >= reward.requirement.count;
            break;
          default:
            isUnlocked = false;
        }
        
        if (isUnlocked) {
          // This is a newly unlocked reward
          toast({
            title: 'New Reward Unlocked!',
            description: `You've unlocked "${reward.name}"!`,
          });
          
          return {
            ...reward,
            unlockedAt: new Date().toISOString()
          };
        }
      }
      
      return reward;
    });
    
    if (JSON.stringify(updatedRewards) !== JSON.stringify(rewards)) {
      setRewards(updatedRewards);
      localStorage.setItem('user_rewards', JSON.stringify(updatedRewards));
    }
  }, [userStats, badges, rewards, currentTier, toast]);
  
  // Update user stats when a bar crawl is completed
  const completeSwigCircuit = () => {
    const newStats = {
      ...userStats,
      swigCircuitsCompleted: userStats.swigCircuitsCompleted + 1
    };
    
    setUserStats(newStats);
    localStorage.setItem('user_rewards_stats', JSON.stringify(newStats));
  };
  
  // Update user stats when an establishment is visited
  const visitEstablishment = () => {
    const newStats = {
      ...userStats,
      establishmentsVisited: userStats.establishmentsVisited + 1
    };
    
    setUserStats(newStats);
    localStorage.setItem('user_rewards_stats', JSON.stringify(newStats));
  };
  
  // Update user stats when a mocktail is tried
  const tryMocktail = () => {
    const newStats = {
      ...userStats,
      mocktailsTried: userStats.mocktailsTried + 1
    };
    
    setUserStats(newStats);
    localStorage.setItem('user_rewards_stats', JSON.stringify(newStats));
  };
  
  // Update user stats when a review is written
  const writeReview = () => {
    const newStats = {
      ...userStats,
      reviewsWritten: userStats.reviewsWritten + 1
    };
    
    setUserStats(newStats);
    localStorage.setItem('user_rewards_stats', JSON.stringify(newStats));
  };

  // Update user stats when a mocktail is created
  const createMocktail = () => {
    const newStats = {
      ...userStats,
      mocktailsCreated: userStats.mocktailsCreated + 1
    };
    
    setUserStats(newStats);
    localStorage.setItem('user_rewards_stats', JSON.stringify(newStats));
  };

  // Update user stats when a user's mocktail is tried by someone
  const incrementMocktailTries = () => {
    const newStats = {
      ...userStats,
      mocktailsTryCount: userStats.mocktailsTryCount + 1
    };
    
    setUserStats(newStats);
    localStorage.setItem('user_rewards_stats', JSON.stringify(newStats));
  };
  
  return {
    userStats,
    badges,
    rewards,
    currentTier,
    completeSwigCircuit,
    visitEstablishment,
    tryMocktail,
    writeReview,
    createMocktail,
    incrementMocktailTries
  };
};
