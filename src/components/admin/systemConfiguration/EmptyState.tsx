
import React from 'react';
import { LucideIcon, Settings, Mail, Shield, Code, CreditCard, ToggleLeft, Layers, BarChart3 } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon }) => {
  // Map icon string to Lucide component
  const IconComponent: LucideIcon = (() => {
    switch (icon) {
      case 'Settings': return Settings;
      case 'Mail': return Mail;
      case 'Shield': return Shield;
      case 'Code': return Code;
      case 'CreditCard': return CreditCard;
      case 'ToggleLeft': return ToggleLeft;
      case 'Layers': return Layers;
      case 'BarChart': return BarChart3;
      default: return Settings;
    }
  })();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="p-4 rounded-full bg-muted mb-4">
        <IconComponent className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-sm">{description}</p>
    </div>
  );
};

export default EmptyState;
