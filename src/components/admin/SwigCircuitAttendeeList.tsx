import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  XCircle, 
  Filter, 
  Download, 
  Search,
  UserCheck,
  UserX
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SwigCircuitTicket } from '@/types/TicketTypes';

interface SwigCircuitAttendeeListProps {
  swigCircuitId: string;
}

const SwigCircuitAttendeeList: React.FC<SwigCircuitAttendeeListProps> = ({ swigCircuitId }) => {
  const [attendees, setAttendees] = useState<SwigCircuitTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Load attendees
  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('swig_circuit_attendees')
          .select(`
            *,
            ticket_tier: ticket_type_id (
              id,
              name,
              price
            )
          `)
          .eq('swig_circuit_id', swigCircuitId);
          
        if (error) throw error;
        
        // Transform the data to match the SwigCircuitTicket type
        const formattedAttendees = data.map((item: any): SwigCircuitTicket => {
          // Ensure purchaser_info is properly formatted
          const purchaserInfo = typeof item.purchaser_info === 'object' ? item.purchaser_info : {
            name: 'Unknown',
            email: 'unknown@example.com'
          };
          
          return {
            id: item.id,
            swig_circuit_id: item.swig_circuit_id,
            user_id: item.user_id,
            ticket_type_id: item.ticket_type_id,
            quantity: item.quantity || 1,
            purchase_date: item.purchase_date,
            checked_in_at: item.checked_in_at,
            first_check_in: item.first_check_in,
            status: item.status,
            ticket_code: item.ticket_code,
            created_at: item.created_at,
            updated_at: item.updated_at,
            purchaser_info: purchaserInfo,
            ticket_tier: item.ticket_tier
          };
        });
        
        setAttendees(formattedAttendees);
      } catch (err) {
        console.error('Error fetching attendees:', err);
        setError(err instanceof Error ? err.message : 'Failed to load attendees');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendees();
  }, [swigCircuitId]);
  
  // Filter attendees
  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = searchTerm === '' || 
      (attendee.purchaser_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       attendee.purchaser_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === null || attendee.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Export attendee data
  const exportAttendees = () => {
    const exportData = filteredAttendees.map(a => ({
      Name: a.purchaser_info?.name || 'N/A',
      Email: a.purchaser_info?.email || 'N/A',
      Phone: a.purchaser_info?.phone || 'N/A',
      Status: a.status,
      TicketType: a.ticket_tier?.name || 'Standard',
      PurchaseDate: new Date(a.purchase_date).toLocaleString(),
      CheckedIn: a.checked_in_at ? new Date(a.checked_in_at).toLocaleString() : 'No'
    }));
    
    const replacer = (key: string, value: any) => value === null ? '' : value;
    const header = Object.keys(exportData[0] || {});
    let csv = exportData.map(row => 
      header.map(fieldName => 
        JSON.stringify((row as any)[fieldName], replacer)
      ).join(',')
    );
    csv.unshift(header.join(','));
    const csvString = csv.join('\r\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `swig-circuit-attendees-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'registered':
        return <Badge variant="outline">Registered</Badge>;
      case 'attended':
        return <Badge variant="default" className="bg-green-500">Attended</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  if (loading) {
    return <div className="text-center p-6">Loading attendees...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search attendees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Button 
            variant="outline"
            onClick={() => setStatusFilter(statusFilter === null ? 'registered' : null)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {statusFilter ? `Filtered: ${statusFilter}` : 'All Statuses'}
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setStatusFilter('registered')}
            className={statusFilter === 'registered' ? 'bg-blue-50' : ''}
          >
            <UserCheck className="h-4 w-4 mr-1" /> Not Checked In
          </Button>
          <Button
            variant="outline"
            onClick={() => setStatusFilter('attended')}
            className={statusFilter === 'attended' ? 'bg-green-50' : ''}
          >
            <UserCheck className="h-4 w-4 mr-1 text-green-500" /> Checked In
          </Button>
        </div>
        
        <Button
          variant="outline"
          onClick={exportAttendees}
          disabled={attendees.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ticket Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Check-in Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No attendees found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAttendees.map(attendee => (
                <TableRow key={attendee.id}>
                  <TableCell>{attendee.purchaser_info?.name || 'N/A'}</TableCell>
                  <TableCell>{attendee.purchaser_info?.email || 'N/A'}</TableCell>
                  <TableCell>{attendee.ticket_tier?.name || 'Standard'}</TableCell>
                  <TableCell>
                    <StatusBadge status={attendee.status} />
                  </TableCell>
                  <TableCell>{new Date(attendee.purchase_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {attendee.checked_in_at ? (
                      <>
                        <Check className="h-4 w-4 text-green-500 inline-block mr-1" />
                        {new Date(attendee.checked_in_at).toLocaleString()}
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-gray-300 inline-block mr-1" />
                        Not checked in
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SwigCircuitAttendeeList;
