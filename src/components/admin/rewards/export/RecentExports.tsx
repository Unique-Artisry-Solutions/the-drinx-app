
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { RecentExport } from './exportUtils';

interface RecentExportsProps {
  exports: RecentExport[];
}

export const RecentExports: React.FC<RecentExportsProps> = ({ exports }) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Recent Exports</h3>
      {exports.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exports.map(export_ => (
                <TableRow key={export_.id}>
                  <TableCell>{export_.type}</TableCell>
                  <TableCell>{export_.date}</TableCell>
                  <TableCell className="font-mono text-xs">{export_.fileName}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No recent exports</p>
      )}
    </div>
  );
};
