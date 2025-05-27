
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, MoreHorizontal } from 'lucide-react';
import { useAffiliatePrograms } from '@/hooks/promotional/useAffiliatePrograms';
import { CreateProgramModal } from './CreateProgramModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AffiliateProgramsProps {
  promoterId: string;
}

export const AffiliatePrograms: React.FC<AffiliateProgramsProps> = ({ promoterId }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { programs, isLoading, createProgram, updateProgram } = useAffiliatePrograms(promoterId);

  if (isLoading) {
    return <div>Loading affiliate programs...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Affiliate Programs</h2>
          <p className="text-muted-foreground">Create and manage your affiliate programs</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Program
        </Button>
      </div>

      <div className="grid gap-4">
        {programs.map((program) => (
          <Card key={program.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={program.is_active ? 'default' : 'secondary'}>
                    {program.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Program
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {program.is_active ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">Commission Type</p>
                  <p className="text-sm text-muted-foreground capitalize">{program.commission_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Commission Rate</p>
                  <p className="text-sm text-muted-foreground">
                    {program.commission_type === 'percentage' ? `${program.commission_rate}%` : `$${program.commission_rate}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Min Payout</p>
                  <p className="text-sm text-muted-foreground">${program.min_payout_amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Cookie Duration</p>
                  <p className="text-sm text-muted-foreground">{program.cookie_duration_days} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {programs.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">No affiliate programs yet</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Program
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateProgramModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProgram={createProgram}
        promoterId={promoterId}
      />
    </div>
  );
};
