
import React from 'react';
import PromoCodeGenerator from '@/components/promoter/marketing/PromoCodeGenerator';

// Define props interface for PromoCodeGenerator
interface PromoCodeGeneratorProps {
  onCodesGenerated: (codes: any[]) => void;
  onCancel: () => void;
}

const PromotionalToolsPage: React.FC = () => {
  // Handle generated codes
  const handleCodesGenerated = (codes: any[]) => {
    console.log('Generated codes:', codes);
    // Additional logic here
  };

  // Handle cancel
  const handleCancel = () => {
    console.log('Code generation cancelled');
    // Additional logic here
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Promotional Tools</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Promotion Code Generator</h2>
          <p className="text-gray-600 mb-6">
            Create custom promotion codes to share with your audience for events and venues.
          </p>
          
          <PromoCodeGenerator 
            onCodesGenerated={handleCodesGenerated} 
            onCancel={handleCancel} 
          />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Marketing Materials</h2>
          <p className="text-gray-600 mb-6">
            Create and manage marketing materials for your events and promotions.
          </p>
          
          {/* Marketing materials component would go here */}
          <div className="text-center py-8 text-gray-400">
            Coming soon!
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalToolsPage;
