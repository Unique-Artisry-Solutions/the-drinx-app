import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Layout } from '@/components/Layout';

const LegalPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Legal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Terms of Service</h2>
              <p>
                These terms govern your use of our service. Please read them carefully.
              </p>
              <Separator className="my-2" />
              <p>
                Last updated: January 1, 2024
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Privacy Policy</h2>
              <p>
                Our privacy policy explains how we collect, use, and share your information.
              </p>
              <Separator className="my-2" />
              <p>
                Last updated: January 1, 2024
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Disclaimer</h2>
              <p>
                This app is intended for informational and entertainment purposes only.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LegalPage;
