
import React, { useState } from 'react';
import { AudienceSegment } from '@/types/AudienceTypes';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Label } from '@/components/ui/label';

interface SegmentOverlapAnalysisProps {
  segments: AudienceSegment[];
  selectedSegments: string[];
  onSegmentToggle: (segmentId: string) => void;
  isLoading: boolean;
}

export function SegmentOverlapAnalysis({ 
  segments, 
  selectedSegments, 
  onSegmentToggle, 
  isLoading 
}: SegmentOverlapAnalysisProps) {
  const [view, setView] = useState<'chart' | 'matrix'>('chart');
  
  // Mock data - In a real application, this would come from an API
  const getOverlapData = () => {
    // Create overlap data for visualization (limited to 3 segments for clarity)
    if (selectedSegments.length === 0) return [];
    
    const displaySegments = selectedSegments.slice(0, 3);
    
    // Create data for each segment
    return displaySegments.map(id => {
      const segment = segments.find(s => s.id === id);
      return {
        id,
        name: segment?.name || 'Unknown',
        value: Math.floor(Math.random() * 500) + 200,
        color: getSegmentColor(id, displaySegments)
      };
    });
  };
  
  // Simple function to get different colors based on segment position
  const getSegmentColor = (id: string, displaySegments: string[]) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];
    const index = displaySegments.indexOf(id);
    return colors[index % colors.length];
  };

  const generateOverlapMatrix = () => {
    const matrix: Array<{id: string, name: string, overlaps: {id: string, name: string, count: number}[]}> = [];
    
    selectedSegments.forEach(segId => {
      const segment = segments.find(s => s.id === segId);
      if (!segment) return;
      
      const overlaps = selectedSegments
        .filter(otherId => otherId !== segId)
        .map(otherId => {
          const otherSegment = segments.find(s => s.id === otherId);
          return {
            id: otherId,
            name: otherSegment?.name || 'Unknown',
            count: Math.floor(Math.random() * 200) + 50
          };
        });
      
      matrix.push({
        id: segId,
        name: segment.name,
        overlaps
      });
    });
    
    return matrix;
  };
  
  if (isLoading) {
    return <div className="py-8 text-center">Loading segment data...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Tabs value={view} onValueChange={(v) => setView(v as 'chart' | 'matrix')}>
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Chart View</TabsTrigger>
                <TabsTrigger value="matrix">Matrix View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="min-h-[300px]">
                {selectedSegments.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">Select segments to visualize overlap</p>
                  </div>
                ) : selectedSegments.length > 3 ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">Chart visualization limited to 3 segments. Using first 3 selected.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getOverlapData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => entry.name}
                      >
                        {getOverlapData().map((entry) => (
                          <Cell key={entry.id} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </TabsContent>
              
              <TabsContent value="matrix" className="min-h-[300px]">
                {selectedSegments.length < 2 ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">Select at least 2 segments to view overlap matrix</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left p-2 border-b">Segment</th>
                          <th className="text-left p-2 border-b">Overlaps With</th>
                          <th className="text-right p-2 border-b">Overlap Count</th>
                          <th className="text-right p-2 border-b">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generateOverlapMatrix().map(row => (
                          row.overlaps.map((overlap, idx) => (
                            <tr key={`${row.id}-${overlap.id}`} className={idx === 0 ? "" : "border-t border-dashed"}>
                              {idx === 0 && (
                                <td className="p-2 font-medium" rowSpan={row.overlaps.length}>
                                  {row.name}
                                </td>
                              )}
                              <td className="p-2">{overlap.name}</td>
                              <td className="p-2 text-right">{overlap.count.toLocaleString()}</td>
                              <td className="p-2 text-right">
                                {Math.round(Math.random() * 60 + 10)}%
                              </td>
                            </tr>
                          ))
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-4">Select Segments to Compare</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {segments.map(segment => (
                <div key={segment.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`segment-${segment.id}`}
                    checked={selectedSegments.includes(segment.id)}
                    onCheckedChange={() => onSegmentToggle(segment.id)}
                  />
                  <Label 
                    htmlFor={`segment-${segment.id}`}
                    className="cursor-pointer"
                  >
                    {segment.name}
                  </Label>
                </div>
              ))}
            </div>
            {view === 'chart' && selectedSegments.length > 3 && (
              <p className="text-xs text-muted-foreground mt-4">
                Note: Chart visualization is limited to 3 segments for clarity
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
