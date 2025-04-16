
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles } from 'lucide-react';
import VipPackageWizard from './VipPackageWizard';
import { TicketTier } from '@/hooks/swigCircuit/types';

interface CreateVipPackageButtonProps {
  onSaveVipPackage: (vipPackage: TicketTier) => void;
  className?: string;
}

const CreateVipPackageButton: React.FC<CreateVipPackageButtonProps> = ({ 
  onSaveVipPackage,
  className = ''
}) => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsWizardOpen(true)}
        className={`bg-gradient-to-r from-purple-600 to-spiritless-pink hover:opacity-90 text-white ${className}`}
      >
        <Crown className="mr-2 h-4 w-4" />
        Create VIP Package
        <Sparkles className="ml-2 h-3 w-3" />
      </Button>
      
      <VipPackageWizard
        open={isWizardOpen}
        onOpenChange={setIsWizardOpen}
        onSave={onSaveVipPackage}
      />
    </>
  );
};

export default CreateVipPackageButton;
