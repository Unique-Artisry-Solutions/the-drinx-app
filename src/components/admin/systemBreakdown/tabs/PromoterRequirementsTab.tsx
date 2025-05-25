
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const PromoterRequirementsTab: React.FC = () => {
  const requirements = [
    {
      id: 1,
      title: "Event Creation & Management",
      description: "Ability to create, edit, and manage events with detailed information",
      status: "implemented",
      priority: "high"
    },
    {
      id: 2,
      title: "Venue Communication System", 
      description: "Direct messaging system with establishments for event coordination",
      status: "implemented",
      priority: "high"
    },
    {
      id: 3,
      title: "Ticket Management",
      description: "Create ticket tiers, set pricing, and manage ticket sales",
      status: "in_progress",
      priority: "high"
    },
    {
      id: 4,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics for event performance and attendance",
      status: "planned",
      priority: "medium"
    },
    {
      id: 5,
      title: "Promotional Tools",
      description: "Marketing and promotional features for event promotion",
      status: "planned",
      priority: "medium"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'planned':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800';
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Promoter Requirements</h2>
        <p className="text-gray-600">
          Detailed requirements and specifications for promoter functionality and capabilities.
        </p>
      </div>

      <div className="grid gap-4">
        {requirements.map((requirement) => (
          <Card key={requirement.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(requirement.status)}
                  <h3 className="font-semibold">{requirement.title}</h3>
                  <Badge className={getStatusColor(requirement.status)}>
                    {requirement.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-2">{requirement.description}</p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {requirement.priority} priority
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Development Status</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">2</div>
            <div className="text-gray-600">Implemented</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">1</div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">2</div>
            <div className="text-gray-600">Planned</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoterRequirementsTab;
