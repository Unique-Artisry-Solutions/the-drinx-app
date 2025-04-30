
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Calendar,
  ChartBar, 
  MoreVertical,
  PauseCircle,
  Play,
  TrashIcon,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { RewardCampaign } from '@/lib/rewards/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface CampaignListProps {
  campaigns: RewardCampaign[];
  isLoading: boolean;
  onEdit: (campaign: RewardCampaign) => void;
  onDelete: (campaignId: string) => void;
  onToggleActivation: (campaign: RewardCampaign) => void;
}

export const CampaignList = ({ 
  campaigns, 
  isLoading,
  onEdit,
  onDelete,
  onToggleActivation
}: CampaignListProps) => {

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-500">Paused</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md bg-muted/20">
        <h3 className="text-lg font-medium">No campaigns found</h3>
        <p className="text-muted-foreground mt-2">
          Create your first reward campaign to start engaging with your users
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Timeline</TableHead>
          <TableHead>Audience</TableHead>
          <TableHead>Rewards</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow key={campaign.id}>
            <TableCell className="font-medium">
              <div>
                {campaign.name}
                {campaign.description && (
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {campaign.description}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(campaign.status)}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {format(new Date(campaign.start_date), 'MMM d')} - {format(new Date(campaign.end_date), 'MMM d, yyyy')}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{campaign.audience_filters?.length || 0} filters</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{campaign.rewards?.length || 0} rewards</Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(campaign)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  
                  {campaign.status !== 'completed' && campaign.status !== 'cancelled' && (
                    <DropdownMenuItem onClick={() => onToggleActivation(campaign)}>
                      {campaign.is_active ? (
                        <>
                          <PauseCircle className="mr-2 h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem>
                    <ChartBar className="mr-2 h-4 w-4" />
                    View Performance
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this campaign? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(campaign.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
