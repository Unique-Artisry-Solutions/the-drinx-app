
import { SegmentConnectionStrength, CrossSegmentEngagement } from '@/types/AudienceTypes';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RelationshipMatrixProps {
  connections: SegmentConnectionStrength[];
  crossEngagement: CrossSegmentEngagement[];
  filterThreshold: number;
}

export const RelationshipMatrix: React.FC<RelationshipMatrixProps> = ({
  connections,
  crossEngagement
  // filterThreshold - preserved for future filtering functionality
}) => {
  // Group segments to get a unique list
  const segments = Array.from(
    new Set([
      ...connections.map(conn => conn.source_segment_id),
      ...connections.map(conn => conn.target_segment_id)
    ])
  );

  // Format a percentage value
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Get relationship strength between two segments
  const getConnectionStrength = (source: string, target: string) => {
    const connection = connections.find(
      conn => 
        (conn.source_segment_id === source && conn.target_segment_id === target) ||
        (conn.source_segment_id === target && conn.target_segment_id === source)
    );
    
    return connection ? connection.connection_strength : 0;
  };

  // Get cell color based on strength
  const getCellColor = (strength: number) => {
    if (strength >= 0.7) return "bg-green-100 text-green-800";
    if (strength >= 0.4) return "bg-blue-50 text-blue-800";
    if (strength >= 0.2) return "bg-gray-50 text-gray-800";
    return "bg-white text-gray-500";
  };

  // Format segment name (for demo purposes)
  const formatSegmentName = (segmentId: string) => {
    const segmentNumber = segmentId.split('-')[1];
    switch (segmentNumber) {
      case '1': return 'Regular Visitors';
      case '2': return 'New Customers';
      case '3': return 'VIP Members';
      default: return segmentId;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Segment</TableHead>
              {segments.map(segment => (
                <TableHead key={segment}>
                  {formatSegmentName(segment)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {segments.map(sourceSegment => (
              <TableRow key={sourceSegment}>
                <TableCell className="font-medium">
                  {formatSegmentName(sourceSegment)}
                </TableCell>
                {segments.map(targetSegment => {
                  const strength = getConnectionStrength(sourceSegment, targetSegment);
                  const colorClass = getCellColor(strength);
                  
                  return (
                    <TableCell key={targetSegment} className={colorClass}>
                      {sourceSegment === targetSegment ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <div className="text-center">
                          {formatPercent(strength)}
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <h3 className="text-lg font-medium mt-6 mb-2">Cross-Segment Engagement</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crossEngagement.map((item, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">
                  {formatSegmentName(item.primary_segment_id)} / {formatSegmentName(item.secondary_segment_id)}
                </h4>
                <p className="text-sm text-gray-500">Past {item.timeframe}</p>
              </div>
              <Badge variant={item.correlation_score > 0.5 ? "default" : "secondary"}>
                {item.correlation_score > 0.5 ? "Strong Correlation" : "Weak Correlation"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Engagement Rate</p>
                <p className="text-lg font-medium">{formatPercent(item.engagement_rate)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-lg font-medium">{formatPercent(item.conversion_rate)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Overlap</p>
                <p className="text-lg font-medium">{formatPercent(item.overlap_percentage)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Correlation</p>
                <p className="text-lg font-medium">{item.correlation_score.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
