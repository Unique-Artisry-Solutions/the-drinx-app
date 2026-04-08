
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FeedbackMechanismProps {
  enabledOptions: string[];
  onToggleOption: (option: string) => void;
}

const FeedbackMechanism: React.FC<FeedbackMechanismProps> = ({ enabledOptions, onToggleOption }) => {
  const feedbackOptions = [
    {
      id: 'ratings',
      label: 'Star Ratings',
      description: 'Let participants rate each venue and drink on a 5-star scale'
    },
    {
      id: 'reviews',
      label: 'Written Reviews',
      description: 'Allow participants to leave detailed written feedback'
    },
    {
      id: 'photos',
      label: 'Photo Uploads',
      description: 'Enable photo sharing at each stop along the circuit'
    },
    {
      id: 'checkins',
      label: 'Digital Check-ins',
      description: 'Track progress through the circuit with digital check-ins'
    },
    {
      id: 'achievements',
      label: 'Achievements & Badges',
      description: 'Reward participants with digital badges for completed activities'
    }
  ];

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium">Feedback & Engagement</h3>
        <p className="text-sm text-muted-foreground">
          Choose how participants can engage with and provide feedback on your Swig Circuit
        </p>
      </div>
      
      <div className="space-y-3">
        {feedbackOptions.map(option => (
          <div key={option.id} className="flex justify-between items-center bg-muted/20 p-3 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor={option.id} className="font-medium">
                {option.label}
              </Label>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
            <Switch
              id={option.id}
              checked={enabledOptions.includes(option.id)}
              onCheckedChange={() => onToggleOption(option.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackMechanism;
