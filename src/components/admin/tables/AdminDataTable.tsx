
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AdminTablePagination } from './AdminTablePagination';
import { AdminEntityState, AdminEntityActions } from '@/hooks/admin/useAdminService';

// Type definitions
export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'boolean' | 'badge';
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableAction<T> {
  label: string;
  action: string;
  icon?: React.ComponentType<any>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: (item: T) => void;
}

export interface BulkAction<T> {
  label: string;
  action: string;
  icon?: React.ComponentType<any>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: (selectedItems: T[]) => void;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'text' | 'date';
  options?: Array<{ value: string; label: string }>;
}

export interface AdminTableConfig<T> {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  bulkActions?: BulkAction<T>[];
  filters?: FilterConfig[];
  searchable?: boolean;
  selectable?: boolean;
  sortable?: boolean;
}

interface AdminDataTableProps<T> {
  config: AdminTableConfig<T>;
  state: AdminEntityState<T>;
  actions: AdminEntityActions<T>;
  title?: string;
  description?: string;
}

export function AdminDataTable<T extends Record<string, any>>({
  config,
  state,
  actions,
  title,
  description
}: AdminDataTableProps<T>) {
  const [selectedItems, setSelectedItems] = React.useState<T[]>([]);

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(state.items);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, item]);
    } else {
      setSelectedItems(prev => prev.filter(selected => selected.id !== item.id));
    }
  };

  const renderCellValue = (column: TableColumn<T>, item: T) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(value, item);
    }

    switch (column.type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '';
      case 'boolean':
        return (
          <Badge variant={value ? 'default' : 'secondary'}>
            {value ? 'Yes' : 'No'}
          </Badge>
        );
      case 'badge':
        return <Badge>{value}</Badge>;
      default:
        return String(value || '');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      {(title || description) && (
        <div className="space-y-2">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {config.searchable && (
            <Input
              placeholder="Search..."
              value={state.searchQuery}
              onChange={(e) => actions.setSearch(e.target.value)}
              className="w-64"
            />
          )}
        </div>
        <div className="flex items-center space-x-2">
          {selectedItems.length > 0 && config.bulkActions && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedItems.length} selected
              </span>
              {config.bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={() => action.onClick(selectedItems)}
                >
                  {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          <Button variant="outline" onClick={actions.refreshData}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {config.selectable && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === state.items.length && state.items.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableHead>
              )}
              {config.columns.map((column, index) => (
                <TableHead key={index}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => actions.setSort(column.key, state.sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {column.label}
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
              {config.actions && config.actions.length > 0 && (
                <TableHead>Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={config.columns.length + (config.selectable ? 1 : 0) + (config.actions ? 1 : 0)} className="text-center py-8">
                  {state.error ? `Error: ${state.error}` : 'No data available'}
                </TableCell>
              </TableRow>
            ) : (
              state.items.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  {config.selectable && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedItems.some(selected => selected.id === item.id)}
                        onChange={(e) => handleSelectItem(item, e.target.checked)}
                      />
                    </TableCell>
                  )}
                  {config.columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {renderCellValue(column, item)}
                    </TableCell>
                  ))}
                  {config.actions && config.actions.length > 0 && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {config.actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant={action.variant || 'outline'}
                            size="sm"
                            onClick={() => action.onClick(item)}
                          >
                            {action.icon && <action.icon className="h-4 w-4" />}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <AdminTablePagination
        pagination={state.pagination}
        onPageChange={actions.setPage}
        onLimitChange={actions.setLimit}
      />
    </div>
  );
}
