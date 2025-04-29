
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FilePlus, FileUp, Check, List, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { rewardsApi } from "@/lib/rewards/api";

interface BulkOperation {
  userId: string;
  points: number;
  source: string;
  metadata?: Record<string, any>;
}

// Extended response type to match what the API actually returns
interface ExtendedRewardOperationResponse {
  success: boolean;
  message?: string;
  error?: string;
  userId?: string;
  pointsChanged?: number;
  newBalance?: number;
}

export function BulkOperationsInterface() {
  const { toast } = useToast();
  const [operationType, setOperationType] = useState('add');
  const [isLoading, setIsLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [bulkData, setBulkData] = useState<string>('');
  const [results, setResults] = useState<Array<{ userId: string; success: boolean; message: string }> | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBulkData(event.target.result as string);
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };
  
  const parseBulkData = (): BulkOperation[] => {
    const lines = bulkData.trim().split('\n');
    const operations: BulkOperation[] = [];
    
    // Skip header if present
    const startIndex = lines[0].includes('userId') || lines[0].includes('user_id') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = line.split(',');
      if (parts.length >= 3) {
        operations.push({
          userId: parts[0].trim(),
          points: parseInt(parts[1].trim()),
          source: parts[2].trim(),
          metadata: parts[3] ? JSON.parse(parts[3].trim()) : {}
        });
      }
    }
    
    return operations;
  };
  
  const executeBulkOperation = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const operations = parseBulkData();
      if (operations.length === 0) {
        toast({
          title: "No valid operations found",
          description: "Please check your CSV format and try again",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // For add/subtract operations, use the batchUpdatePoints API
      if (operationType === 'add' || operationType === 'subtract') {
        const modifiedOperations = operations.map(op => ({
          ...op,
          points: operationType === 'subtract' ? -Math.abs(op.points) : Math.abs(op.points)
        }));
        
        const apiResults = await rewardsApi.batchUpdatePoints(modifiedOperations) as ExtendedRewardOperationResponse[];
        
        setResults(apiResults.map(result => ({
          userId: result.userId?.toString() || 'unknown',
          success: result.success,
          message: result.success 
            ? `Points ${operationType === 'add' ? 'added' : 'subtracted'}: ${Math.abs(result.pointsChanged || 0)}. New balance: ${result.newBalance || 0}` 
            : `Error: ${result.error || 'Unknown error'}`
        })));
        
        toast({
          title: "Bulk operation completed",
          description: `Processed ${apiResults.length} operations: ${apiResults.filter(r => r.success).length} succeeded, ${apiResults.filter(r => !r.success).length} failed`,
        });
      }
    } catch (error) {
      console.error("Error in bulk operation:", error);
      toast({
        title: "Operation failed",
        description: "There was an error processing the bulk operations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5 text-primary" />
          Bulk Reward Operations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Operation Type</label>
              <Select value={operationType} onValueChange={setOperationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Points</SelectItem>
                  <SelectItem value="subtract">Subtract Points</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Upload CSV File</label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                />
              </div>
            </div>
          </div>

          <Alert variant="default" className="bg-muted/50">
            <Info className="h-4 w-4" />
            <AlertDescription>
              CSV format: <code>userId,points,source,metadata</code><br/>
              Example: <code>user-123,100,promotion,{"{\"campaign\":\"summer\"}"}</code>
            </AlertDescription>
          </Alert>
          
          <div>
            <label className="block text-sm font-medium mb-2">Manual Entry (CSV Format)</label>
            <Textarea
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
              placeholder="userId,points,source,metadata (optional)"
              rows={6}
            />
          </div>
          
          <Button 
            onClick={executeBulkOperation} 
            disabled={isLoading || (!csvFile && !bulkData)} 
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">Processing <Loader2 className="h-4 w-4 animate-spin" /></span>
            ) : (
              <span className="flex items-center gap-2">Execute Bulk Operation <FileUp className="h-4 w-4" /></span>
            )}
          </Button>
          
          {results && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Results</h3>
              <div className="bg-muted p-3 rounded-md max-h-60 overflow-auto">
                <div className="space-y-1">
                  {results.map((result, index) => (
                    <div key={index} className={`text-sm p-1 rounded ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                      <span className="flex items-center gap-1">
                        {result.success ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Info className="h-3.5 w-3.5" />
                        )}
                        <span><strong>{result.userId}:</strong> {result.message}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
