import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, UserX, ArrowLeft, Move, User } from 'lucide-react';
import { useImpersonationState } from '@/hooks/useImpersonationState';
import { restoreImpersonation } from '@/utils/impersonation';
import { useToast } from '@/hooks/use-toast';

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const ImpersonationWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState<Position>('bottom-left');
  const { toast } = useToast();
  
  // Impersonation state
  const { isImpersonating, currentUser, adminUserId, isLoading: impersonationLoading } = useImpersonationState();

  // Don't render if not impersonating
  if (!isImpersonating || impersonationLoading) return null;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'bottom-4 left-4';
    }
  };

  const cyclePosition = () => {
    const positions: Position[] = ['bottom-left', 'top-left', 'top-right', 'bottom-right'];
    const currentIndex = positions.indexOf(position);
    const nextIndex = (currentIndex + 1) % positions.length;
    setPosition(positions[nextIndex]);
  };

  const handleEndImpersonation = async () => {
    try {
      toast({
        title: "Ending impersonation...",
        description: "Returning to admin account",
      });
      await restoreImpersonation();
    } catch (error) {
      console.error('Failed to end impersonation:', error);
      toast({
        title: "Failed to end impersonation",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-[9998] max-w-sm`}>
      {/* Collapsed Header */}
      <div 
        className="shadow-lg border-2 border-red-400 bg-red-50 p-2 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserX className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Impersonating</span>
            <span className="text-xs text-red-600 truncate max-w-24">
              {currentUser?.email?.split('@')[0] || 'User'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                cyclePosition();
              }}
              className="p-1 h-auto hover:bg-red-200"
              title="Change position"
            >
              <Move className="h-3 w-3 text-red-600" />
            </Button>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-red-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-red-600" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <Card className="mt-2 border-2 border-red-300 bg-red-50 max-w-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-red-800 flex items-center gap-2">
              🎭 User Impersonation
            </CardTitle>
            <div className="text-sm text-red-700">
              <div>Status: Active</div>
              <div className="text-xs text-red-600 mt-1">Position: {position}</div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {/* Impersonation Details */}
            <div className="p-3 bg-white border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <UserX className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Session Details</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="text-red-700">Target User:</div>
                <div className="font-mono text-red-800 truncate">
                  {currentUser?.email || 'Unknown'}
                </div>
                <div className="text-red-700">Target ID:</div>
                <div className="font-mono text-red-800 truncate">
                  {currentUser?.id?.slice(0, 8) || 'Unknown'}...
                </div>
                <div className="text-red-700">Admin ID:</div>
                <div className="font-mono text-red-800 truncate">
                  {adminUserId?.slice(0, 8) || 'Unknown'}...
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEndImpersonation}
                className="w-full text-xs border-red-300 text-red-700 hover:bg-red-100"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Return to Admin Account
              </Button>
              
              <div className="text-xs text-red-600 bg-red-100 p-2 rounded border">
                <strong>Note:</strong> You are viewing the app as {currentUser?.email}. All actions are performed as this user.
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImpersonationWidget;