
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Copy } from 'lucide-react';

interface InvitationsTabProps {
  showInviteForm: boolean;
  setShowInviteForm: (show: boolean) => void;
  inviteeEmail: string;
  setInviteeEmail: (email: string) => void;
  inviteUser: () => void;
  copyShareLink: () => void;
  swigCircuitId: string;
}

const InvitationsTab: React.FC<InvitationsTabProps> = ({
  showInviteForm,
  setShowInviteForm,
  inviteeEmail,
  setInviteeEmail,
  inviteUser,
  copyShareLink,
  swigCircuitId
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Invite Friends</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowInviteForm(!showInviteForm)}
          >
            <PlusCircle size={16} className="mr-2" />
            New Invitation
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showInviteForm && (
          <div className="mb-6 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium mb-3">Send Invitation</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={inviteeEmail}
                onChange={(e) => setInviteeEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={inviteUser}>
                Send
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="text-sm text-gray-500 mb-2">
            No invitations sent yet
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Invite by Link</h3>
            <div className="flex gap-2">
              <Input
                value={`${window.location.origin}/swig-circuit/${swigCircuitId}`}
                readOnly
                className="flex-1 bg-gray-50"
              />
              <Button variant="outline" onClick={copyShareLink}>
                <Copy size={16} className="mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvitationsTab;
