
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Search, Filter } from 'lucide-react';
import { EventAttendee } from '@/types/EventTypes';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface GuestListManagementProps {
  eventId: string;
  attendees: EventAttendee[];
  onCheckIn: (attendeeId: string) => Promise<void>;
}

const GuestListManagement: React.FC<GuestListManagementProps> = ({ eventId, attendees, onCheckIn }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['registered', 'checked_in']);
  const [vipOnly, setVipOnly] = useState(false);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleCheckIn = async (attendeeId: string) => {
    try {
      setIsLoading(prev => ({ ...prev, [attendeeId]: true }));
      await onCheckIn(attendeeId);
      toast({
        title: "Check-in Successful",
        description: "Attendee has been checked in"
      });
    } catch (error) {
      toast({
        title: "Check-in Failed",
        description: "Failed to check in attendee",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [attendeeId]: false }));
    }
  };
  
  // Filter attendees based on search, status and VIP filter
  const filteredAttendees = attendees
    .filter(attendee => {
      // Search filter
      const matchesSearch = 
        attendee.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        attendee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.ticket_code?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter.includes(attendee.status);
      
      // VIP filter - check if custom fields has isVip: true
      const isVip = attendee.custom_fields && 
        (attendee.custom_fields.isVip === true || 
         attendee.custom_fields.isVIP === true || 
         attendee.custom_fields.vip === true);
         
      const matchesVip = vipOnly ? isVip : true;
      
      return matchesSearch && matchesStatus && matchesVip;
    })
    .sort((a, b) => {
      // Sort by status, with registered first
      if (a.status !== b.status) {
        return a.status === 'registered' ? -1 : 1;
      }
      
      // Then sort by VIP status
      const aIsVip = a.custom_fields && (
        a.custom_fields.isVip === true || 
        a.custom_fields.isVIP === true || 
        a.custom_fields.vip === true
      );
      const bIsVip = b.custom_fields && (
        b.custom_fields.isVip === true || 
        b.custom_fields.isVIP === true || 
        b.custom_fields.vip === true
      );
      
      if (aIsVip !== bIsVip) {
        return aIsVip ? -1 : 1;
      }
      
      // Finally sort by name
      return (a.name || '').localeCompare(b.name || '');
    });

  return (
    <div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Guest List</CardTitle>
          <CardDescription>Manage and check in attendees for your event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, email or ticket code..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes('registered')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, 'registered']);
                      } else {
                        setStatusFilter(statusFilter.filter(s => s !== 'registered'));
                      }
                    }}
                  >
                    Registered
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes('checked_in')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, 'checked_in']);
                      } else {
                        setStatusFilter(statusFilter.filter(s => s !== 'checked_in'));
                      }
                    }}
                  >
                    Checked In
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={vipOnly}
                    onCheckedChange={setVipOnly}
                  >
                    VIP Only
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Ticket</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendees.length > 0 ? (
                  filteredAttendees.map((attendee) => {
                    const isVip = attendee.custom_fields && (
                      attendee.custom_fields.isVip === true || 
                      attendee.custom_fields.isVIP === true || 
                      attendee.custom_fields.vip === true
                    );
                    
                    return (
                      <TableRow key={attendee.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {attendee.name || 'Unnamed'}
                              {isVip && (
                                <Badge className="ml-2 bg-amber-500">VIP</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{attendee.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={attendee.status === 'checked_in' ? 'default' : 'outline'}>
                            {attendee.status === 'registered' && 'Not Checked In'}
                            {attendee.status === 'checked_in' && 'Checked In'}
                            {attendee.status === 'cancelled' && 'Cancelled'}
                            {attendee.status === 'no_show' && 'No Show'}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="font-mono text-xs">{attendee.ticket_code}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant={attendee.status === 'checked_in' ? 'outline' : 'default'}
                            disabled={attendee.status === 'checked_in' || isLoading[attendee.id!]}
                            onClick={() => handleCheckIn(attendee.id!)}
                          >
                            {attendee.status === 'checked_in' ? (
                              <><Check className="mr-1 h-4 w-4" /> Checked In</>
                            ) : (
                              isLoading[attendee.id!] ? 'Checking in...' : 'Check In'
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No attendees match the current filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestListManagement;
