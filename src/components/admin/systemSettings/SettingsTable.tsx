
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ArrowUpDown, Search } from 'lucide-react';
import { SystemSetting, SettingsUpdatePayload } from '@/types/SystemSettingsTypes';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import SettingValueEditor from './SettingValueEditor';

interface SettingsTableProps {
  settings: SystemSetting[];
  onUpdateSetting: (payload: SettingsUpdatePayload) => Promise<boolean>;
  categoryLabel: string;
}

const SettingsTable: React.FC<SettingsTableProps> = ({ 
  settings, 
  onUpdateSetting,
  categoryLabel
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  const filteredSettings = settings
    .filter(setting => 
      setting.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (setting.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const compareResult = a.key.localeCompare(b.key);
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  
  if (settings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No {categoryLabel.toLowerCase()} settings found.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${categoryLabel.toLowerCase()} settings...`}
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredSettings.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <div className="flex items-center gap-2">
                  <span>Setting Key</span>
                  <Button variant="ghost" size="sm" onClick={toggleSortDirection} className="p-0 h-auto">
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSettings.map((setting) => (
              <TableRow key={setting.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {setting.is_protected && (
                      <Badge variant="outline" className="gap-1 text-amber-500 border-amber-200">
                        <Shield className="h-3 w-3" />
                        <span>Protected</span>
                      </Badge>
                    )}
                    <span>{setting.key}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {setting.description || <span className="text-muted-foreground italic">No description</span>}
                </TableCell>
                <TableCell className="text-right">
                  <SettingValueEditor 
                    setting={setting}
                    onUpdate={onUpdateSetting}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No settings found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SettingsTable;
