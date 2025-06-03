
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, ArrowUpDown } from 'lucide-react';

export interface AdminTableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'number' | 'badge';
  render?: (value: any, item: T) => React.ReactNode;
}

export interface AdminTableAction<T = any> {
  label: string;
  action: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  onClick: (item: T) => void;
}

export interface AdminTableFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: { value: string; label: string }[];
}

export interface AdminTableConfig<T = any> {
  columns: AdminTableColumn<T>[];
  actions?: AdminTableAction<T>[];
  bulkActions?: AdminTableAction<T[]>[];
  filters?: AdminTableFilter[];
  searchable?: boolean;
  selectable?: boolean;
  sortable?: boolean;
}

interface AdminDataTableProps<T = any> {
  config: AdminTableConfig<T>;
  state: {
    items: T[];
    isLoading: boolean;
    error: string;
    total: number;
    page: number;
    limit: number;
  };
  actions: {
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setSearch: (query: string) => void;
    refresh: () => void;
  };
  title?: string;
  description?: string;
}

export const AdminDataTable = <T extends Record<string, any>>({
  config,
  state,
  actions,
  title,
  description
}: AdminDataTableProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? state.items : []);
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    setSelectedItems(prev => 
      checked 
        ? [...prev, item]
        : prev.filter(selected => selected.id !== item.id)
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    actions.setSearch(searchQuery);
  };

  const handleSort = (field: string) => {
    if (!config.sortable) return;
    
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
  };

  const renderCellContent = (column: AdminTableColumn<T>, item: T) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(value, item);
    }

    switch (column.type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-';
      case 'badge':
        return <Badge variant="secondary">{value || '-'}</Badge>;
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : '-';
      default:
        return value || '-';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {selectedItems.length > 0 && config.bulkActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Actions ({selectedItems.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {config.bulkActions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => action.onClick(selectedItems)}
                    className={action.variant === 'destructive' ? 'text-red-600' : ''}
                  >
                    {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Button variant="outline" size="sm" onClick={actions.refresh}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Search */}
      {config.searchable && (
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {config.selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === state.items.length && state.items.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {config.columns.map((column) => (
                <TableHead key={column.key}>
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && config.sortable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort(column.key)}
                        className="h-4 w-4 p-0"
                      >
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableHead>
              ))}
              {config.actions && <TableHead className="w-20">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.isLoading ? (
              <TableRow>
                <TableCell colSpan={config.columns.length + (config.selectable ? 1 : 0) + (config.actions ? 1 : 0)}>
                  <div className="text-center py-4">Loading...</div>
                </TableCell>
              </TableRow>
            ) : state.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={config.columns.length + (config.selectable ? 1 : 0) + (config.actions ? 1 : 0)}>
                  <div className="text-center py-4 text-muted-foreground">No items found</div>
                </TableCell>
              </TableRow>
            ) : (
              state.items.map((item) => (
                <TableRow key={item.id}>
                  {config.selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.some(selected => selected.id === item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item, !!checked)}
                      />
                    </TableCell>
                  )}
                  {config.columns.map((column) => (
                    <TableCell key={column.key}>
                      {renderCellContent(column, item)}
                    </TableCell>
                  ))}
                  {config.actions && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {config.actions.map((action, index) => (
                            <DropdownMenuItem
                              key={index}
                              onClick={() => action.onClick(item)}
                              className={action.variant === 'destructive' ? 'text-red-600' : ''}
                            >
                              {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{state.error}</p>
        </div>
      )}

      {/* Pagination Info */}
      <div className="text-sm text-muted-foreground">
        Showing {state.items.length} of {state.total} items
      </div>
    </div>
  );
};
