
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { TicketTier } from '@/hooks/swigCircuit/types';
import VipPackageWizard from './VipPackageWizard';

interface CreateVipPackageButtonProps {
  onSaveVipPackage: (vipPackage: TicketTier) => void;
  initialPackage?: TicketTier | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CreateVipPackageButton: React.FC<CreateVipPackageButtonProps> = ({
  onSaveVipPackage,
  initialPackage,
  isOpen = false,
  onOpenChange
}) => {
  const [open, setOpen] = useState(isOpen);

  // Sync with parent component's open state if provided
  React.useEffect(() => {
    if (onOpenChange && isOpen !== open) {
      setOpen(isOpen);
    }
  }, [isOpen, open, onOpenChange]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <>
      <Button
        onClick={() => handleOpenChange(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Crown className="mr-2 h-4 w-4" />
        Create VIP Package
      </Button>
      
      <VipPackageWizard
        open={open}
        onOpenChange={handleOpenChange}
        onSave={onSaveVipPackage}
        initialPackage={initialPackage}
      />
    </>
  );
};

export default CreateVipPackageButton;
