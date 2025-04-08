
import React from 'react';

interface JsonViewProps {
  data: any;
}

export const JsonView: React.FC<JsonViewProps> = ({ data }) => {
  const formatValue = (value: any): string => {
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    
    if (Array.isArray(value)) {
      return `[${value.length} items]`;
    }
    
    if (typeof value === 'object' && value !== null) {
      return '{...}';
    }
    
    return String(value);
  };
  
  if (Array.isArray(data)) {
    return <span className="text-blue-600">[{data.length} items]</span>;
  }
  
  if (typeof data === 'object' && data !== null) {
    return <span className="text-emerald-600">{JSON.stringify(data).substring(0, 40)}{JSON.stringify(data).length > 40 ? '...' : ''}</span>;
  }
  
  if (typeof data === 'string') {
    return <span className="text-amber-600">"{data}"</span>;
  }
  
  if (typeof data === 'number') {
    return <span className="text-purple-600">{data}</span>;
  }
  
  if (typeof data === 'boolean') {
    return <span className="text-red-600">{data ? 'true' : 'false'}</span>;
  }
  
  return <span>{String(data)}</span>;
};
