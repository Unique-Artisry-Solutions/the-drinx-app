
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, DollarSign, Link } from 'lucide-react';

const PromoterAffiliatePage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Affiliate Management</h1>
            <p className="text-muted-foreground">Manage your affiliate partners and track performance</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">New Feature</Badge>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <div className="text-sm font-medium">Active Affiliates</div>
              </div>
              <div className="text-2xl font-bold mt-1">12</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-green-500" />
                <div className="text-sm font-medium">Total Clicks</div>
              </div>
              <div className="text-2xl font-bold mt-1">1,247</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <div className="text-sm font-medium">Conversions</div>
              </div>
              <div className="text-2xl font-bold mt-1">156</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-500" />
                <div className="text-sm font-medium">Total Commissions</div>
              </div>
              <div className="text-2xl font-bold mt-1">$2,840</div>
            </CardContent>
          </Card>
        </div>

        {/* Affiliate Management Content */}
        <Card>
          <CardHeader>
            <CardTitle>Affiliate Management Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Comprehensive affiliate management tools for tracking partners, commissions, and performance metrics.
              </p>
              <Badge variant="outline">Advanced Analytics Available</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PromoterAffiliatePage;
