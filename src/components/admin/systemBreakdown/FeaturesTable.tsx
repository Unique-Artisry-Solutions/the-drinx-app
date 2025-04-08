
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Database } from 'lucide-react';
import { FeatureItem } from './types';
import { renderStatusBadge, renderDatabaseStatusBadge, renderAccessIcon } from './utils/statusRenderers';
import DatabaseAnalysisPanel from './DatabaseAnalysisPanel';

interface FeaturesTableProps {
  features: FeatureItem[];
  title: string;
}

const FeaturesTable: React.FC<FeaturesTableProps> = ({ features, title }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Feature</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Admin Access</TableHead>
            <TableHead className="hidden md:table-cell">Establishment Access</TableHead>
            <TableHead className="hidden md:table-cell">Individual Access</TableHead>
            <TableHead className="hidden md:table-cell">Database Status</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature) => (
            <React.Fragment key={feature.id}>
              <TableRow className={feature.statusUpdated ? 'bg-amber-50' : ''}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{feature.name}</span>
                    {feature.statusUpdated && (
                      <span className="text-xs text-amber-600 mt-1">
                        Updated from {feature.originalStatus}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{renderStatusBadge(feature.status)}</TableCell>
                <TableCell className="hidden md:table-cell">{renderAccessIcon(feature.adminAccess)}</TableCell>
                <TableCell className="hidden md:table-cell">{renderAccessIcon(feature.establishmentAccess)}</TableCell>
                <TableCell className="hidden md:table-cell">{renderAccessIcon(feature.individualAccess)}</TableCell>
                <TableCell className="hidden md:table-cell">{renderDatabaseStatusBadge(feature.databaseStatus)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => toggleRow(feature.id)}>
                    {expandedRows[feature.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRows[feature.id] && (
                <TableRow key={`${feature.id}-details`}>
                  <TableCell colSpan={7} className="bg-slate-50 p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Description</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                      
                      {feature.testSteps && feature.testSteps.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-1">Testing Steps</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            {feature.testSteps.map((step, i) => (
                              <li key={i} className="text-gray-600">{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {feature.databaseAnalysis && (
                        <div>
                          <h4 className="font-medium mb-1 flex items-center">
                            <Database className="h-4 w-4 mr-1" />
                            Database Analysis
                          </h4>
                          <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
                            <div className="whitespace-pre-wrap">{feature.databaseAnalysis}</div>
                            <DatabaseAnalysisPanel analysisText={feature.databaseAnalysis} />
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FeaturesTable;
