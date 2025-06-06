
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useWelcomeAutomation } from '@/hooks/useWelcomeAutomation';
import { CheckCircle, Clock, Play, Users, TrendingUp } from 'lucide-react';
import type { FollowerOnboardingProgress } from '@/types/welcomeAutomation';

interface OnboardingProgressTrackerProps {
  promoterId: string;
}

const OnboardingProgressTracker: React.FC<OnboardingProgressTrackerProps> = ({ promoterId }) => {
  const { onboardingProgress, progressLoading, advanceOnboardingStep } = useWelcomeAutomation(promoterId);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'not_started': return 'gray';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      default: return 'gray';
    }
  };

  const getProgressPercentage = (progress: FollowerOnboardingProgress & { promoter_followers: any }) => {
    const completedSteps = Array.isArray(progress.completed_steps) ? progress.completed_steps.length : 0;
    const totalSteps = 6; // Default total steps
    return (completedSteps / totalSteps) * 100;
  };

  const handleAdvanceStep = async (followerId: string) => {
    try {
      await advanceOnboardingStep.mutateAsync(followerId);
    } catch (error) {
      console.error('Error advancing onboarding step:', error);
    }
  };

  if (progressLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading onboarding data...</div>
        </CardContent>
      </Card>
    );
  }

  const activeOnboarding = onboardingProgress.filter(p => !p.is_completed);
  const completedOnboarding = onboardingProgress.filter(p => p.is_completed);

  const stats = {
    total: onboardingProgress.length,
    active: activeOnboarding.length,
    completed: completedOnboarding.length,
    averageEngagement: onboardingProgress.reduce((acc, p) => acc + p.engagement_score, 0) / Math.max(onboardingProgress.length, 1)
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Followers</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Avg Engagement</p>
              <p className="text-2xl font-bold">{stats.averageEngagement.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Onboarding */}
      {activeOnboarding.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Onboarding ({activeOnboarding.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeOnboarding.map((progress) => {
                const follower = progress.promoter_followers;
                const progressPercentage = getProgressPercentage(progress);
                
                return (
                  <div key={progress.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">
                          {follower?.promoter_name || `Follower ${follower?.subscriber_id?.slice(0, 8)}...`}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Started {new Date(progress.started_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" color={getStageColor(follower?.onboarding_stage)}>
                          Step {progress.current_step}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAdvanceStep(progress.follower_id)}
                          disabled={advanceOnboardingStep.isPending}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Advance
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progressPercentage.toFixed(0)}% complete</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Engagement Score:</span>
                        <span className="ml-2 font-medium">{progress.engagement_score.toFixed(1)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Completed Steps:</span>
                        <span className="ml-2 font-medium">
                          {Array.isArray(progress.completed_steps) ? progress.completed_steps.length : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Onboarding */}
      {completedOnboarding.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Onboarding ({completedOnboarding.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedOnboarding.slice(0, 5).map((progress) => {
                const follower = progress.promoter_followers;
                
                return (
                  <div key={progress.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">
                        {follower?.promoter_name || `Follower ${follower?.subscriber_id?.slice(0, 8)}...`}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Completed {progress.completed_at ? new Date(progress.completed_at).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" color="green">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Score: {progress.engagement_score.toFixed(1)}
                      </div>
                    </div>
                  </div>
                );
              })}
              {completedOnboarding.length > 5 && (
                <div className="text-center text-sm text-muted-foreground">
                  +{completedOnboarding.length - 5} more completed
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OnboardingProgressTracker;
