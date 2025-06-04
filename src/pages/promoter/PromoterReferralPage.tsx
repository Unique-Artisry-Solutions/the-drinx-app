
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, Target, Users, TrendingUp } from 'lucide-react';

const PromoterReferralPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Referral Campaigns</h1>
            <p className="text-muted-foreground">Track and optimize your referral programs</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">New Feature</Badge>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-blue-500" />
                <div className="text-sm font-medium">Active Campaigns</div>
              </div>
              <div className="text-2xl font-bold mt-1">5</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <div className="text-sm font-medium">Total Referrals</div>
              </div>
              <div className="text-2xl font-bold mt-1">284</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                <div className="text-sm font-medium">Conversion Rate</div>
              </div>
              <div className="text-2xl font-bold mt-1">8.2%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <div className="text-sm font-medium">Growth Rate</div>
              </div>
              <div className="text-2xl font-bold mt-1">+12.5%</div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Campaign Content */}
        <Card>
          <CardHeader>
            <CardTitle>Referral Campaign Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Comprehensive referral campaign tools for creating, tracking, and optimizing referral programs.
              </p>
              <Badge variant="outline">Multi-tier Tracking Available</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PromoterReferralPage;
