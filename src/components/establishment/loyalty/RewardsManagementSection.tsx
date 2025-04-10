
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import RewardModal from './RewardModal';

interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  isActive: boolean;
  imageUrl?: string;
  expirationDays?: number;
}

interface RewardsManagementSectionProps {
  rewards: LoyaltyReward[];
  onAddReward: (reward: Omit<LoyaltyReward, 'id'>) => void;
  onUpdateReward: (reward: LoyaltyReward) => void;
  onDeleteReward: (id: string) => void;
}

const RewardsManagementSection: React.FC<RewardsManagementSectionProps> = ({
  rewards,
  onAddReward,
  onUpdateReward,
  onDeleteReward
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);
  
  const handleOpenEditModal = (reward: LoyaltyReward) => {
    setSelectedReward(reward);
    setIsEditModalOpen(true);
  };
  
  const handleAddReward = (reward: Omit<LoyaltyReward, 'id'>) => {
    onAddReward(reward);
    setIsAddModalOpen(false);
  };
  
  const handleUpdateReward = (reward: LoyaltyReward) => {
    onUpdateReward(reward);
    setIsEditModalOpen(false);
    setSelectedReward(null);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedReward) {
      onDeleteReward(selectedReward.id);
      setIsEditModalOpen(false);
      setSelectedReward(null);
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Available Rewards</h3>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Reward
        </Button>
      </div>
      
      {rewards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="rounded-full bg-muted p-3 mb-4">
              <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No Rewards Available</h3>
            <p className="text-muted-foreground text-center mb-6">
              Get started by adding your first reward for your customers to redeem with their points.
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Reward
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map(reward => (
            <Card key={reward.id} className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                {reward.imageUrl ? (
                  <img 
                    src={reward.imageUrl} 
                    alt={reward.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={reward.isActive ? "success" : "secondary"} className="px-2 py-0">
                    {reward.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium mb-1">{reward.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{reward.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {reward.pointsRequired} Points
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleOpenEditModal(reward)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => {
                        setSelectedReward(reward);
                        handleDeleteConfirm();
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <RewardModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleAddReward}
        title="Add New Reward"
      />
      
      {selectedReward && (
        <RewardModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSave={handleUpdateReward}
          onDelete={handleDeleteConfirm}
          title="Edit Reward"
          reward={selectedReward}
        />
      )}
    </>
  );
};

export default RewardsManagementSection;
