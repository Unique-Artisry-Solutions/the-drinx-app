
import React from 'react';
import Layout from '@/components/Layout';
import ThemeCustomizer from '@/components/admin/theme/ThemeCustomizer';
import ThemePreview from '@/components/admin/theme/ThemePreview';

const ThemeCustomizationPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Theme Customization</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ThemeCustomizer />
          </div>
          <div>
            <ThemePreview />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThemeCustomizationPage;
