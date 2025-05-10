import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FEATURES } from '@/lib/features/registry';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Layout from '@/components/Layout';
import { Callout } from '@/components/ui/callout';
import { Info } from 'lucide-react';

const FeatureAccessDocumentationPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Feature Access Documentation</CardTitle>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed information about available features and their access levels.
              </p>
            </CardContent>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                {Object.values(FEATURES).map((feature) => (
                  <TabsTrigger key={feature} value={feature}>
                    {feature}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="overview" className="space-y-2">
                <Callout icon={Info}>
                  <p>
                    This documentation provides a comprehensive overview of all features and their
                    access requirements.
                  </p>
                </Callout>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Access Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.values(FEATURES).map((feature) => (
                      <TableRow key={feature}>
                        <TableCell>{feature}</TableCell>
                        <TableCell>Description for {feature}</TableCell>
                        <TableCell>Subscription Required</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              {Object.values(FEATURES).map((feature) => (
                <TabsContent key={feature} value={feature} className="space-y-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{feature}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Detailed documentation for the {feature} feature.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FeatureAccessDocumentationPage;
