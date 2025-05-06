
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
  MoreVertical,
  Edit,
  Trash2,
  Users,
  BarChart3,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { AudienceSegment } from '@/types/AudienceTypes';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface AudienceSegmentListProps {
  segments: AudienceSegment[];
  isLoading: boolean;
  onEdit: (segment: AudienceSegment) => void;
  onDelete: (segmentId: string) => void;
}

export const AudienceSegmentList: React.FC<AudienceSegmentListProps> = ({ 
  segments, 
  isLoading,
  onEdit,
  onDelete
}) => {
  const handleEdit = (segment: AudienceSegment, e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(segment);
  };

  const handleDelete = (segmentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    onDelete(segmentId);
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

  if (segments.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md bg-muted/20">
        <h3 className="text-lg font-medium">No segments found</h3>
        <p className="text-muted-foreground mt-2">
          Create your first audience segment to start targeted marketing
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
          <TableHead>Members</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {segments.map((segment) => (
          <TableRow key={segment.id}>
            <TableCell className="font-medium">
              <div>
                {segment.name}
                {segment.description && (
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {segment.description}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell>
              {segment.is_active ? (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500">
                  <XCircle className="h-3 w-3 mr-1" />
                  Inactive
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span>{segment.memberCount || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              {segment.created_at && format(new Date(segment.created_at), 'MMM d, yyyy')}
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
                  <DropdownMenuItem onClick={(e) => handleEdit(segment, e)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Members
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Segment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this segment? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={(e) => handleDelete(segment.id, e)}>
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
