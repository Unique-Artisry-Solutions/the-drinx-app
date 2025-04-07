
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FeatureItem } from './types';
import { renderAccessIcon, renderStatusBadge } from './utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FeaturesTableProps {
  features: FeatureItem[];
  title: string;
}

const FeaturesTable: React.FC<FeaturesTableProps> = ({ features, title }) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRow = (index: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px]"></TableHead>
          <TableHead className="w-1/5">Feature</TableHead>
          <TableHead className="w-1/3">Description</TableHead>
          <TableHead>Implementation Status</TableHead>
          <TableHead>Database Status</TableHead>
          <TableHead>User Access</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {features.map((feature, index) => (
          <React.Fragment key={index}>
            <TableRow>
              <TableCell>
                {(feature.testSteps && feature.testSteps.length > 0) && (
                  <button 
                    onClick={() => toggleRow(index)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    {expandedRows[index] ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </button>
                )}
              </TableCell>
              <TableCell className="font-medium">{feature.name}</TableCell>
              <TableCell>{feature.description}</TableCell>
              <TableCell>{renderStatusBadge(feature.status)}</TableCell>
              <TableCell>{renderDatabaseStatusBadge(feature.databaseStatus)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">Admin</span>
                    {renderAccessIcon(feature.adminAccess)}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">Est.</span>
                    {renderAccessIcon(feature.establishmentAccess)}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">User</span>
                    {renderAccessIcon(feature.individualAccess)}
                  </div>
                </div>
              </TableCell>
            </TableRow>
            {expandedRows[index] && feature.testSteps && (
              <TableRow className="bg-gray-50">
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={5} className="p-4">
                  <div className="mb-2 font-medium">Test Steps:</div>
                  <ol className="list-decimal pl-5 space-y-1">
                    {feature.testSteps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

// Function to render database status badges
const renderDatabaseStatusBadge = (status?: 'completed' | 'in-progress' | 'not-started') => {
  switch (status) {
    case 'completed':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
    case 'in-progress':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In Progress</span>;
    case 'not-started':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Not Started</span>;
    default:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
  }
};

export default FeaturesTable;
