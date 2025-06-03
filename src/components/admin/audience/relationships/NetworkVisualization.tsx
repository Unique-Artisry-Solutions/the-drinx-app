
import React, { useEffect, useRef } from 'react';
import { AudienceNetwork } from '@/types/AudienceTypes';

interface NetworkVisualizationProps {
  network: AudienceNetwork | null;
  zoomLevel: number;
  filterThreshold: number;
  onNodeSelect: (nodeId: string) => void;
}

export const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({
  network,
  zoomLevel,
  filterThreshold,
  onNodeSelect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!network || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom and center
    ctx.save();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-centerX, -centerY);
    
    // Filter edges based on weight threshold
    const filteredEdges = network.edges.filter(edge => edge.weight >= filterThreshold);
    
    // Draw edges
    filteredEdges.forEach(edge => {
      const sourceNode = network.nodes.find(node => node.id === edge.source);
      const targetNode = network.nodes.find(node => node.id === edge.target);
      
      if (!sourceNode || !targetNode) return;
      
      const startX = sourceNode.position?.x || 0;
      const startY = sourceNode.position?.y || 0;
      const endX = targetNode.position?.x || 0;
      const endY = targetNode.position?.y || 0;
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      
      // Line style based on relationship type and weight
      const alpha = Math.max(0.1, edge.weight);
      
      if (edge.relationship_type === 'influence') {
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`; // Blue for influence
        ctx.lineWidth = 1 + edge.weight * 3;
      } else {
        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`; // Indigo for interaction
        ctx.lineWidth = 1 + edge.weight * 2;
      }
      
      ctx.stroke();
    });
    
    // Draw nodes
    network.nodes.forEach(node => {
      const x = node.position?.x || 0;
      const y = node.position?.y || 0;
      const radius = 5 + (node.influence_score || 0);
      
      // Determine node color based on segment
      let nodeColor = '#6366F1'; // Default indigo
      
      if (node.segment_ids?.includes('segment-1')) {
        nodeColor = '#3B82F6'; // Blue for segment 1
      } else if (node.segment_ids?.includes('segment-2')) {
        nodeColor = '#10B981'; // Green for segment 2
      } else if (node.segment_ids?.includes('segment-3')) {
        nodeColor = '#F59E0B'; // Amber for segment 3
      }
      
      // Draw node
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = nodeColor;
      ctx.fill();
      
      // Draw border
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    });
    
    ctx.restore();
    
    // Add event listener for node selection
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoomLevel;
      const y = (e.clientY - rect.top) / zoomLevel;
      
      // Find clicked node
      const clickedNode = network.nodes.find(node => {
        const nodeX = node.position?.x || 0;
        const nodeY = node.position?.y || 0;
        const radius = 5 + (node.influence_score || 0);
        
        const distance = Math.sqrt(Math.pow(nodeX - x, 2) + Math.pow(nodeY - y, 2));
        return distance <= radius;
      });
      
      if (clickedNode) {
        onNodeSelect(clickedNode.id);
      }
    };
    
    canvas.addEventListener('click', handleClick);
    
    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [network, zoomLevel, filterThreshold, onNodeSelect]);
  
  if (!network) {
    return <div className="h-full flex items-center justify-center">No network data available</div>;
  }
  
  return (
    <div className="h-full relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
        style={{ background: '#f8fafc' }}
      />
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-sm border text-xs">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Segment 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Segment 2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Segment 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
