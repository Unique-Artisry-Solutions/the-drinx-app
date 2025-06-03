
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Database, Loader2, BarChart3 } from 'lucide-react';

interface SystemHeaderProps {
  onAnalyzeFeatures: () => void;
  onExportCSV: () => void;
  analyzing: boolean;
}

const SystemHeader: React.FC<SystemHeaderProps> = ({
  onAnalyzeFeatures,
  onExportCSV,
  analyzing
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">System Functionality Breakdown</h1>
        <p className="text-gray-500">Comprehensive overview of all features, implementation status, and system analytics</p>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onAnalyzeFeatures} 
          className="flex items-center gap-2"
          disabled={analyzing}
          variant="secondary"
        >
          {analyzing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Database className="h-4 w-4" />
          )}
          {analyzing ? 'Analyzing...' : 'Analyze Implementation'}
        </Button>
        <Button onClick={onExportCSV} className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Export to CSV
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          View Analytics
        </Button>
      </div>
    </div>
  );
};

export default SystemHeader;
