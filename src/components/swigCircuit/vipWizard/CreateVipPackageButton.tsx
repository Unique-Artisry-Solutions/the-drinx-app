
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles } from 'lucide-react';
import VipPackageWizard from './VipPackageWizard';
import { TicketTier } from '@/hooks/swigCircuit/types';

interface CreateVipPackageButtonProps {
  onSaveVipPackage: (vipPackage: TicketTier) => void;
  className?: string;
  initialPackage?: TicketTier | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CreateVipPackageButton: React.FC<CreateVipPackageButtonProps> = ({ 
  onSaveVipPackage,
  className = '',
  initialPackage = null,
  isOpen = false,
  onOpenChange
}) => {
  const [isWizardOpen, setIsWizardOpen] = useState(isOpen);

  // Sync external isOpen prop with internal state
  React.useEffect(() => {
    if (isWizardOpen !== isOpen) {
      setIsWizardOpen(isOpen);
    }
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsWizardOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return (
    <>
      <Button 
        onClick={() => handleOpenChange(true)}
        className={`bg-gradient-to-r from-purple-600 to-spiritless-pink hover:opacity-90 text-white ${className}`}
      >
        <Crown className="mr-2 h-4 w-4" />
        Create VIP Package
        <Sparkles className="ml-2 h-3 w-3" />
      </Button>
      
      <VipPackageWizard
        open={isWizardOpen}
        onOpenChange={handleOpenChange}
        onSave={onSaveVipPackage}
        initialPackage={initialPackage}
      />
    </>
  );
};

export default CreateVipPackageButton;
