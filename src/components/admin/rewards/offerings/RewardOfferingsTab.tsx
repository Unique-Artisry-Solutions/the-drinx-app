
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Changed from default export to named export to match how it's imported in RewardsAdminPage.tsx
export const RewardOfferingsTab: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Reward Offerings</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Offering
        </Button>
      </div>
      <p className="text-muted-foreground">
        Manage the rewards that users can redeem with their points.
      </p>
    </div>
  );
};
