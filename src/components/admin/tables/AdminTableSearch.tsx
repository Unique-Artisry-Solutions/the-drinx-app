
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AdminTableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const AdminTableSearch: React.FC<AdminTableSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search...'
}) => {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};
