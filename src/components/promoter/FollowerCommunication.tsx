
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface FollowerCommunicationProps {
  promoterId: string;
}

const FollowerCommunication: React.FC<FollowerCommunicationProps> = ({ promoterId }) => {
  const { sendNotification, sendFlyer, sendDiscountCode } = useSubscriptions(promoterId);

  const handleSendNotification = async () => {
    try {
      await sendNotification.mutateAsync({ followerId: 'sample-follower-id', message: 'Sample notification' });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleSendFlyer = async () => {
    try {
      await sendFlyer.mutateAsync({ followerId: 'sample-follower-id', flyerUrl: 'https://example.com/flyer.pdf' });
    } catch (error) {
      console.error('Failed to send flyer:', error);
    }
  };

  const handleSendDiscountCode = async () => {
    try {
      await sendDiscountCode.mutateAsync({ followerId: 'sample-follower-id', discountCode: 'DISCOUNT20' });
    } catch (error) {
      console.error('Failed to send discount code:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follower Communication</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <button 
            onClick={handleSendNotification}
            disabled={sendNotification.isPending}
            className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {sendNotification.isPending ? 'Sending...' : 'Send Notification'}
          </button>
          <button 
            onClick={handleSendFlyer}
            disabled={sendFlyer.isPending}
            className="w-full p-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {sendFlyer.isPending ? 'Sending...' : 'Send Flyer'}
          </button>
          <button 
            onClick={handleSendDiscountCode}
            disabled={sendDiscountCode.isPending}
            className="w-full p-2 bg-purple-500 text-white rounded disabled:opacity-50"
          >
            {sendDiscountCode.isPending ? 'Sending...' : 'Send Discount Code'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerCommunication;
