
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
import { MoreHorizontal, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdminEntityState, AdminEntityActions } from '@/hooks/admin/useAdminService';

export interface AdminTableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean';
  render?: (value: any, item: T) => React.ReactNode;
}

export interface AdminTableAction<T = any> {
  label: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: (item: T) => void;
}

export interface AdminTableFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: Array<{ value: string; label: string }>;
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
  state: AdminEntityState<T>;
  actions: AdminEntityActions<T>;
  title: string;
  description?: string;
}

export function AdminDataTable<T = any>({ 
  config, 
  state, 
  actions, 
  title, 
  description 
}: AdminDataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? state.items.map((item: any) => item.id) : []);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedIds(prev => 
      checked 
        ? [...prev, id]
        : prev.filter(selectedId => selectedId !== id)
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    actions.setSearch(searchQuery);
  };

  const handleBulkAction = (action: AdminTableAction<T[]>) => {
    const selectedItems = state.items.filter((item: any) => selectedIds.includes(item.id));
    action.onClick(selectedItems);
    setSelectedIds([]);
  };

  const renderCellValue = (column: AdminTableColumn<T>, item: T) => {
    const value = (item as any)[column.key];
    
    if (column.render) {
      return column.render(value, item);
    }

    switch (column.type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-';
      case 'boolean':
        return (
          <Badge variant={value ? 'default' : 'secondary'}>
            {value ? 'Yes' : 'No'}
          </Badge>
        );
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value || '-';
      default:
        return value || '-';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        
        {selectedIds.length > 0 && config.bulkActions && (
          <div className="flex gap-2">
            {config.bulkActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={() => handleBulkAction(action)}
                className="flex items-center gap-2"
              >
                <action.icon className="h-4 w-4" />
                {action.label} ({selectedIds.length})
              </Button>
            ))}
          </div>
        )}
      </div>

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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {config.selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.length === state.items.length && state.items.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {config.columns.map((column) => (
                <TableHead key={column.key}>
                  {column.label}
                </TableHead>
              ))}
              {config.actions && config.actions.length > 0 && (
                <TableHead className="w-20">Actions</TableHead>
              )}
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
              state.items.map((item: any) => (
                <TableRow key={item.id}>
                  {config.selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, !!checked)}
                      />
                    </TableCell>
                  )}
                  {config.columns.map((column) => (
                    <TableCell key={column.key}>
                      {renderCellValue(column, item)}
                    </TableCell>
                  ))}
                  {config.actions && config.actions.length > 0 && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {config.actions.map((action, actionIndex) => (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={() => action.onClick(item)}
                              className="flex items-center gap-2"
                            >
                              <action.icon className="h-4 w-4" />
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

      {/* Simple pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {state.items.length} of {state.pagination.total} items
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => actions.setPage(state.pagination.page - 1)}
            disabled={state.pagination.page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm">
            Page {state.pagination.page} of {state.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => actions.setPage(state.pagination.page + 1)}
            disabled={state.pagination.page >= state.pagination.totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {state.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{state.error}</p>
        </div>
      )}
    </div>
  );
}
