
/**
 * Definitions for common reward program funnels to ensure consistent tracking
 */

export interface FunnelDefinition {
  id: string;
  name: string;
  stages: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

/**
 * The reward redemption funnel tracks the user journey from
 * viewing rewards to successfully redeeming a reward
 */
export const REWARD_REDEMPTION_FUNNEL: FunnelDefinition = {
  id: 'reward_redemption',
  name: 'Reward Redemption',
  stages: [
    { 
      id: 'view_rewards_catalog',
      name: 'View Rewards Catalog',
      description: 'User views the rewards catalog'
    },
    { 
      id: 'view_reward_detail',
      name: 'View Reward Detail',
      description: 'User views the details of a specific reward'
    },
    { 
      id: 'initiate_redemption',
      name: 'Initiate Redemption',
      description: 'User clicks the "Redeem" button'
    },
    { 
      id: 'confirm_redemption',
      name: 'Confirm Redemption',
      description: 'User confirms their intention to redeem points'
    },
    { 
      id: 'redemption_complete',
      name: 'Redemption Complete',
      description: 'Redemption was processed successfully'
    }
  ]
};

/**
 * The enrollment funnel tracks the user journey from
 * first learning about the rewards program to signing up
 */
export const ENROLLMENT_FUNNEL: FunnelDefinition = {
  id: 'program_enrollment',
  name: 'Program Enrollment',
  stages: [
    { 
      id: 'view_program_info',
      name: 'View Program Info',
      description: 'User views information about the rewards program'
    },
    { 
      id: 'opt_in_start',
      name: 'Start Opt-In',
      description: 'User initiates the opt-in process'
    },
    { 
      id: 'accept_terms',
      name: 'Accept Terms',
      description: 'User accepts the program terms'
    },
    { 
      id: 'set_preferences',
      name: 'Set Preferences',
      description: 'User sets their notification and display preferences'
    },
    { 
      id: 'enrollment_complete',
      name: 'Enrollment Complete',
      description: 'User completes enrollment and is now a program member'
    }
  ]
};

/**
 * The achievement completion funnel tracks the user journey
 * from discovering achievements to completing them
 */
export const ACHIEVEMENT_FUNNEL: FunnelDefinition = {
  id: 'achievement_completion',
  name: 'Achievement Completion',
  stages: [
    { 
      id: 'view_achievements',
      name: 'View Achievements',
      description: 'User views the achievements list'
    },
    { 
      id: 'view_achievement_detail',
      name: 'View Achievement Detail',
      description: 'User views the details of a specific achievement'
    },
    { 
      id: 'progress_update',
      name: 'Progress Update',
      description: 'User makes progress toward the achievement'
    },
    { 
      id: 'achievement_complete',
      name: 'Achievement Complete',
      description: 'User completes the achievement'
    },
    { 
      id: 'claim_reward',
      name: 'Claim Achievement Reward',
      description: 'User claims the reward for completing the achievement'
    }
  ]
};

/**
 * Helper function to get a stage index by its ID
 * @param funnel The funnel definition
 * @param stageId The ID of the stage
 * @returns The index of the stage, or -1 if not found
 */
export function getStageIndex(funnel: FunnelDefinition, stageId: string): number {
  return funnel.stages.findIndex(stage => stage.id === stageId);
}

/**
 * Helper function to get a stage by its ID
 * @param funnel The funnel definition
 * @param stageId The ID of the stage
 * @returns The stage, or undefined if not found
 */
export function getStage(funnel: FunnelDefinition, stageId: string) {
  return funnel.stages.find(stage => stage.id === stageId);
}
