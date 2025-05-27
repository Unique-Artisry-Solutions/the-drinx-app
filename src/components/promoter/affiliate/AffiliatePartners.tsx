
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Check, X, Eye } from 'lucide-react';
import { useAffiliatePrograms } from '@/hooks/promotional/useAffiliatePrograms';

interface AffiliatePartnersProps {
  promoterId: string;
}

export const AffiliatePartners: React.FC<AffiliatePartnersProps> = ({ promoterId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { programs } = useAffiliatePrograms(promoterId);

  // Mock partner data - replace with actual API call
  const mockPartners = [
    {
      id: '1',
      user_id: 'user1',
      affiliate_program_id: 'prog1',
      status: 'pending',
      affiliate_code: 'AF123456',
      total_earnings: 0,
      total_clicks: 0,
      total_conversions: 0,
      created_at: '2024-01-15T10:00:00Z',
      user_name: 'John Doe',
      user_email: 'john@example.com',
      program_name: 'Marketing Program'
    },
    {
      id: '2',
      user_id: 'user2',
      affiliate_program_id: 'prog1',
      status: 'approved',
      affiliate_code: 'AF789012',
      total_earnings: 1240,
      total_clicks: 450,
      total_conversions: 42,
      created_at: '2024-01-10T15:30:00Z',
      user_name: 'Jane Smith',
      user_email: 'jane@example.com',
      program_name: 'Marketing Program'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'suspended': return 'destructive';
      case 'rejected': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredPartners = mockPartners.filter(partner =>
    partner.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.affiliate_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Affiliate Partners</h2>
          <p className="text-muted-foreground">Manage partner applications and performance</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredPartners.map((partner) => (
          <Card key={partner.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{partner.user_name}</CardTitle>
                  <CardDescription>{partner.user_email}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(partner.status)}>
                    {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                  </Badge>
                  {partner.status === 'pending' && (
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm font-medium">Affiliate Code</p>
                  <p className="text-sm text-muted-foreground font-mono">{partner.affiliate_code}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Program</p>
                  <p className="text-sm text-muted-foreground">{partner.program_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Clicks</p>
                  <p className="text-sm text-muted-foreground">{partner.total_clicks.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Conversions</p>
                  <p className="text-sm text-muted-foreground">{partner.total_conversions}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Earnings</p>
                  <p className="text-sm text-muted-foreground">${partner.total_earnings.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPartners.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No partners found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
