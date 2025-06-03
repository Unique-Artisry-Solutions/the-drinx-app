
import React from 'react';
import { AudienceSegment } from '@/types/AudienceTypes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, MoreHorizontal, Trash2, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface AudienceSegmentListProps {
  segments: AudienceSegment[];
  isLoading: boolean;
  onEdit: (segment: AudienceSegment) => void;
  onDelete: (segmentId: string) => void;
  onSelect?: (segment: AudienceSegment) => void;
}

export const AudienceSegmentList: React.FC<AudienceSegmentListProps> = ({ 
  segments, 
  isLoading,
  onEdit,
  onDelete,
  onSelect
}) => {
  const [segmentToDelete, setSegmentToDelete] = React.useState<string | null>(null);
  
  const handleDeleteClick = (segmentId: string) => {
    setSegmentToDelete(segmentId);
  };
  
  const confirmDelete = () => {
    if (segmentToDelete) {
      onDelete(segmentToDelete);
      setSegmentToDelete(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (segments.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No segments found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Create your first audience segment to get started.
        </p>
      </div>
    );
  }
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {segments.map((segment) => (
            <TableRow key={segment.id} className={onSelect ? "cursor-pointer hover:bg-muted/50" : ""} onClick={() => onSelect?.(segment)}>
              <TableCell className="font-medium">
                <div>
                  {segment.name}
                  {segment.description && (
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">
                      {segment.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={segment.is_active ? "default" : "secondary"}>
                  {segment.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                {segment.memberCount !== undefined ? segment.memberCount.toLocaleString() : '-'}
              </TableCell>
              <TableCell>
                {format(new Date(segment.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                {format(new Date(segment.updated_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center space-x-1">
                  {onSelect && (
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      onSelect(segment);
                    }}>
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onEdit(segment);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(segment.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <AlertDialog open={!!segmentToDelete} onOpenChange={() => setSegmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this audience segment and remove all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
