
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FeatureItem } from './types';
import { renderAccessIcon, renderStatusBadge } from './utils';

interface FeaturesTableProps {
  features: FeatureItem[];
  title: string;
}

const FeaturesTable: React.FC<FeaturesTableProps> = ({ features, title }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/4">Feature</TableHead>
          <TableHead className="w-1/2">Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>User Access</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {features.map((feature, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{feature.name}</TableCell>
            <TableCell>{feature.description}</TableCell>
            <TableCell>{renderStatusBadge(feature.status)}</TableCell>
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
        ))}
      </TableBody>
    </Table>
  );
};

export default FeaturesTable;
