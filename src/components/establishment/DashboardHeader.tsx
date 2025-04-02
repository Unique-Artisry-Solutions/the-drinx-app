
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  establishmentName: string;
  onAddMocktail?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ establishmentName, onAddMocktail }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Welcome, {establishmentName}</h1>
        <p className="text-material-on-surface-variant">Here's what's happening at your establishment</p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => navigate('/establishment/profile')}>
          Manage Profile
        </Button>
        <Button variant="gradient" onClick={onAddMocktail}>
          Add New Mocktail
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
