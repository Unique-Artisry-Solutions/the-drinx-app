
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AudienceNetwork, SegmentConnectionStrength, InfluentialUser, CrossSegmentEngagement } from '@/types/AudienceTypes';
import { NetworkVisualization } from './NetworkVisualization';
import { InfluencerList } from './InfluencerList';
import { RelationshipMatrix } from './RelationshipMatrix';
import { Download, Filter, Settings, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface AudienceRelationshipMapProps {
  selectedSegmentId?: string;
  onSelectSegment?: (segmentId: string) => void;
}

export const AudienceRelationshipMap: React.FC<AudienceRelationshipMapProps> = ({ 
  selectedSegmentId,
  onSelectSegment
}) => {
  const [networkData, setNetworkData] = useState<AudienceNetwork | null>(null);
  const [connectionStrengths, setConnectionStrengths] = useState<SegmentConnectionStrength[]>([]);
  const [influencers, setInfluencers] = useState<InfluentialUser[]>([]);
  const [crossEngagement, setCrossEngagement] = useState<CrossSegmentEngagement[]>([]);
  const [viewMode, setViewMode] = useState<'network' | 'matrix' | 'influencers'>('network');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterThreshold, setFilterThreshold] = useState(0.3);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRelationshipData(selectedSegmentId);
  }, [selectedSegmentId]);

  const loadRelationshipData = async (segmentId?: string) => {
    setIsLoading(true);
    try {
      // This would be replaced with actual API calls to fetch relationship data
      // For now we'll use mock data
      setTimeout(() => {
        setNetworkData(generateMockNetworkData());
        setConnectionStrengths(generateMockConnectionStrengths());
        setInfluencers(generateMockInfluencers());
        setCrossEngagement(generateMockCrossEngagement());
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error loading relationship data:', error);
      setIsLoading(false);
    }
  };

  // Mock data generators for demonstration
  const generateMockNetworkData = (): AudienceNetwork => {
    return {
      nodes: Array.from({ length: 12 }, (_, i) => ({
        id: `node-${i}`,
        user_id: `user-${i}`,
        segment_ids: [Math.random() > 0.5 ? 'segment-1' : 'segment-2'],
        influence_score: Math.random() * 10,
        position: { x: Math.random() * 800, y: Math.random() * 600 },
        metadata: { activity: Math.random() * 100 }
      })),
      edges: Array.from({ length: 20 }, (_, i) => ({
        source: `node-${Math.floor(Math.random() * 12)}`,
        target: `node-${Math.floor(Math.random() * 12)}`,
        weight: Math.random(),
        relationship_type: Math.random() > 0.5 ? 'influence' : 'interaction'
      })),
      metadata: {
        density: 0.4,
        centrality: { 'node-1': 0.8, 'node-2': 0.6 },
        clusters: [
          { id: 'cluster-1', members: ['node-1', 'node-3', 'node-5'] },
          { id: 'cluster-2', members: ['node-2', 'node-4', 'node-6'] }
        ]
      }
    };
  };

  const generateMockConnectionStrengths = (): SegmentConnectionStrength[] => {
    return Array.from({ length: 6 }, (_, i) => ({
      source_segment_id: `segment-${i % 3 + 1}`,
      target_segment_id: `segment-${(i + 1) % 3 + 1}`,
      connection_strength: Math.random(),
      shared_members: Math.floor(Math.random() * 100),
      interaction_frequency: Math.random() * 10,
      conversion_rate: Math.random(),
      similarity_score: Math.random()
    }));
  };

  const generateMockInfluencers = (): InfluentialUser[] => {
    return Array.from({ length: 8 }, (_, i) => ({
      user_id: `user-${i}`,
      display_name: `Influencer ${i + 1}`,
      influence_score: Math.random() * 10,
      follower_count: Math.floor(Math.random() * 1000),
      engagement_rate: Math.random(),
      connected_segments: Math.floor(Math.random() * 5) + 1,
      expertise_areas: ['Food', 'Drinks', 'Nightlife'].slice(0, Math.floor(Math.random() * 3) + 1)
    }));
  };

  const generateMockCrossEngagement = (): CrossSegmentEngagement[] => {
    return Array.from({ length: 4 }, (_, i) => ({
      primary_segment_id: `segment-${i % 2 + 1}`,
      secondary_segment_id: `segment-${(i + 1) % 2 + 1}`,
      timeframe: '30d',
      engagement_rate: Math.random(),
      conversion_rate: Math.random(),
      overlap_percentage: Math.random(),
      correlation_score: Math.random() * 2 - 1
    }));
  };

  const handleRefresh = () => {
    loadRelationshipData(selectedSegmentId);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleFilterChange = (value: number[]) => {
    setFilterThreshold(value[0]);
  };

  const handleExportData = () => {
    // In a real implementation, this would generate and download a report
    alert('Data export functionality would be implemented here');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Audience Relationship Mapping</CardTitle>
            <CardDescription>
              Visualize connections between audience segments and identify key influencers
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="default" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="network">Network View</TabsTrigger>
              <TabsTrigger value="matrix">Matrix View</TabsTrigger>
              <TabsTrigger value="influencers">Key Influencers</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ZoomOut className="h-4 w-4 text-gray-500" onClick={handleZoomOut} />
                <Slider
                  value={[zoomLevel]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-24"
                  onValueChange={([val]) => setZoomLevel(val)}
                />
                <ZoomIn className="h-4 w-4 text-gray-500" onClick={handleZoomIn} />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select 
                  value={filterThreshold.toString()} 
                  onValueChange={(val) => setFilterThreshold(parseFloat(val))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.1">Low (0.1)</SelectItem>
                    <SelectItem value="0.3">Medium (0.3)</SelectItem>
                    <SelectItem value="0.5">High (0.5)</SelectItem>
                    <SelectItem value="0.7">Very High (0.7)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div ref={containerRef} style={{ height: '500px', position: 'relative' }}>
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="flex flex-col items-center">
                  <RefreshCw className="animate-spin h-8 w-8 text-primary" />
                  <p className="mt-2 text-sm text-gray-500">Loading relationship data...</p>
                </div>
              </div>
            ) : (
              <>
                <TabsContent value="network" className="h-full">
                  <NetworkVisualization 
                    network={networkData}
                    zoomLevel={zoomLevel}
                    filterThreshold={filterThreshold}
                    onNodeSelect={(nodeId) => console.log('Node selected:', nodeId)}
                  />
                </TabsContent>
                
                <TabsContent value="matrix" className="h-full overflow-auto">
                  <RelationshipMatrix 
                    connections={connectionStrengths}
                    crossEngagement={crossEngagement}
                    filterThreshold={filterThreshold}
                  />
                </TabsContent>
                
                <TabsContent value="influencers" className="h-full overflow-auto">
                  <InfluencerList 
                    influencers={influencers.sort((a, b) => b.influence_score - a.influence_score)}
                    onSelectUser={(userId) => console.log('Influencer selected:', userId)}
                  />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
