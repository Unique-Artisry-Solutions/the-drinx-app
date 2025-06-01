import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';

interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  size: number;
  criteria: Record<string, any>;
  status: 'active' | 'inactive';
}

interface AudienceRelationship {
  sourceSegment: string;
  targetSegment: string;
  type: 'overlap' | 'correlation' | 'causation';
  strength: number;
  description: string;
}

interface AudienceRelationshipMapProps {
  segments: AudienceSegment[];
  _onSelectSegment: (segmentId: string) => void;
}

const AudienceRelationshipMap = ({ 
  segments, 
  _onSelectSegment 
}: AudienceRelationshipMapProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRelationshipType, setSelectedRelationshipType] = useState('all');
  const [_filterThreshold, setFilterThreshold] = useState(0.1);

  const relationships: AudienceRelationship[] = [
    {
      sourceSegment: 'High Value Customers',
      targetSegment: 'Loyal Customers',
      type: 'overlap',
      strength: 0.75,
      description: 'Significant overlap between high value and loyal customers'
    },
    {
      sourceSegment: 'New Users',
      targetSegment: 'Active Users',
      type: 'correlation',
      strength: 0.6,
      description: 'New users are highly correlated with active users'
    },
    {
      sourceSegment: 'Discount Seekers',
      targetSegment: 'Churn Risk',
      type: 'causation',
      strength: 0.8,
      description: 'Discount seekers have a high causation with churn risk'
    },
    {
      sourceSegment: 'High Value Customers',
      targetSegment: 'VIP Subscribers',
      type: 'overlap',
      strength: 0.9,
      description: 'High overlap between high value customers and VIP subscribers'
    },
    {
      sourceSegment: 'Mobile App Users',
      targetSegment: 'In-Store Shoppers',
      type: 'correlation',
      strength: 0.4,
      description: 'Moderate correlation between mobile app users and in-store shoppers'
    },
    {
      sourceSegment: 'Inactive Users',
      targetSegment: 'Email Unsubscribers',
      type: 'causation',
      strength: 0.7,
      description: 'Inactive users have a strong causation with email unsubscribers'
    },
    {
      sourceSegment: 'High Spenders',
      targetSegment: 'Frequent Buyers',
      type: 'overlap',
      strength: 0.85,
      description: 'Significant overlap between high spenders and frequent buyers'
    },
    {
      sourceSegment: 'Social Media Engagers',
      targetSegment: 'Brand Advocates',
      type: 'correlation',
      strength: 0.65,
      description: 'Social media engagers are highly correlated with brand advocates'
    }
  ];

  const filteredRelationships = relationships.filter(rel => {
    const matchesSearch = rel.sourceSegment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rel.targetSegment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedRelationshipType === 'all' || rel.type === selectedRelationshipType;
    return matchesSearch && matchesType;
  });

  const NetworkVisualization = () => {
    const nodeRadius = 30;
    const centerX = 200;
    const centerY = 150;
    const radius = 100;

    const segmentNodes = segments.slice(0, 6).map((segment, index) => {
      const angle = (index / 6) * 2 * Math.PI;
      return {
        ...segment,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    });

    return (
      <svg width="400" height="300" className="border rounded">
        {/* Connections */}
        {filteredRelationships.slice(0, 8).map((rel, _i) => {
          const source = segmentNodes.find(n => n.name === rel.sourceSegment);
          const target = segmentNodes.find(n => n.name === rel.targetSegment);
          if (!source || !target) return null;

          return (
            <line
              key={`${rel.sourceSegment}-${rel.targetSegment}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="#cbd5e1"
              strokeWidth={Math.max(1, rel.strength * 5)}
              opacity={0.7}
            />
          );
        })}

        {/* Nodes */}
        {segmentNodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={nodeRadius}
              fill="#3b82f6"
              opacity={0.8}
              className="cursor-pointer hover:opacity-100"
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dy="0.35em"
              fill="white"
              fontSize="10"
              className="pointer-events-none"
            >
              {node.name.length > 8 ? `${node.name.substring(0, 8)}...` : node.name}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Audience Relationship Map</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
        <p className="text-muted-foreground">
          Visualize relationships between audience segments to identify opportunities and risks
        </p>
        
        <div className="flex items-center space-x-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search relationships..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={selectedRelationshipType} onValueChange={setSelectedRelationshipType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="overlap">Overlap</SelectItem>
              <SelectItem value="correlation">Correlation</SelectItem>
              <SelectItem value="causation">Causation</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Button variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Relationship Network</CardTitle>
          </CardHeader>
          <CardContent>
            <NetworkVisualization />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Relationship List</CardTitle>
              <Badge variant="secondary">
                {filteredRelationships.length} relationships
              </Badge>
            </div>
            <CardDescription>
              Detailed list of relationships between audience segments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredRelationships.map((rel) => (
              <div key={`${rel.sourceSegment}-${rel.targetSegment}`} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {rel.sourceSegment} ➔ {rel.targetSegment}
                  </div>
                  <Badge variant="outline">{rel.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{rel.description}</p>
                <Progress value={rel.strength * 100} className="mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudienceRelationshipMap;
