
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RewardUser } from './UserManagementTab';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight } from 'lucide-react';

interface UserRewardsListProps {
  users: RewardUser[];
  selectedUserId: string | null;
  onUserSelect: (userId: string) => void;
}

export const UserRewardsList = ({ users, selectedUserId, onUserSelect }: UserRewardsListProps) => {
  if (!users.length) {
    return (
      <div className="p-4 border rounded-md bg-muted/20">
        <p className="text-center text-muted-foreground">No reward users found</p>
      </div>
    );
  }
  
  return (
    <div className="mt-4 border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow 
              key={user.id}
              className={selectedUserId === user.user_id ? 'bg-muted' : ''}
            >
              <TableCell className="font-medium">
                {user.username || `User ${user.user_id.substring(0, 6)}`}
              </TableCell>
              <TableCell>{user.points}</TableCell>
              <TableCell>{user.tier_name || 'None'}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUserSelect(user.user_id)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
