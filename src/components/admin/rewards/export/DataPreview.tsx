
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info } from "lucide-react";

interface DataPreviewProps {
  preview: any[];
}

export const DataPreview: React.FC<DataPreviewProps> = ({ preview }) => {
  if (!preview.length) return null;

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted py-2 px-4 font-medium">
          Data Preview
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(preview[0]).map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.values(row).map((value: any, cellIndex) => (
                    <TableCell key={cellIndex}>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Alert variant="default" className="bg-muted/50">
        <Info className="h-4 w-4" />
        <AlertDescription>
          This is a preview showing up to 5 records. Export the full report to get all data.
        </AlertDescription>
      </Alert>
    </>
  );
};
