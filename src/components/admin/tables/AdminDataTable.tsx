
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash, Eye } from 'lucide-react';
import { AdminTablePagination } from './AdminTablePagination';
import { AdminTableSearch } from './AdminTableSearch';
import { AdminTableFilters } from './AdminTableFilters';
import type { AdminEntityState, AdminEntityActions } from '@/hooks/admin/useAdminService';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'date' | 'badge' | 'boolean';
  width?: string;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableAction<T> {
  label: string;
  action: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: (item: T) => boolean;
  onClick: (item: T) => void;
}

export interface BulkAction<T> {
  label: string;
  action: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: (selectedItems: T[]) => void;
}

export interface FilterConfig<T> {
  key: keyof T;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { value: any; label: string }[];
}

export interface AdminTableConfig<T> {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  bulkActions?: BulkAction<T>[];
  filters?: FilterConfig<T>[];
  searchable?: boolean;
  selectable?: boolean;
  sortable?: boolean;
}

interface AdminDataTableProps<T extends { id: string }> {
  config: AdminTableConfig<T>;
  state: AdminEntityState<T>;
  actions: AdminEntityActions<T>;
  title?: string;
  description?: string;
}

export function AdminDataTable<T extends { id: string }>({
  config,
  state,
  actions,
  title,
  description
}: AdminDataTableProps<T>) {
  const { items, selectedIds, isLoading, pagination, filters, searchQuery } = state;
  const selectedItems = items.filter(item => selectedIds.has(item.id));

  const renderCellValue = (column: TableColumn<T>, item: T) => {
    const value = item[column.key as keyof T];

    if (column.render) {
      return column.render(value, item);
    }

    switch (column.type) {
      case 'badge':
        return <Badge variant="secondary">{String(value)}</Badge>;
      case 'boolean':
        return <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Yes' : 'No'}
        </Badge>;
      case 'date':
        return value ? new Date(String(value)).toLocaleDateString() : '-';
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      default:
        return String(value || '-');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      {(title || description) && (
        <div>
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {config.searchable && (
          <AdminTableSearch
            value={searchQuery}
            onChange={actions.setSearchQuery}
            placeholder="Search..."
          />
        )}
        {config.filters && config.filters.length > 0 && (
          <AdminTableFilters
            filters={config.filters}
            values={filters}
            onChange={actions.setFilters}
            onClear={actions.clearFilters}
          />
        )}
      </div>

      {/* Bulk Actions */}
      {config.bulkActions && selectedItems.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedItems.length} item(s) selected
          </span>
          <div className="flex gap-2">
            {config.bulkActions.map((bulkAction) => (
              <Button
                key={bulkAction.action}
                variant={bulkAction.variant || 'outline'}
                size="sm"
                onClick={() => bulkAction.onClick(selectedItems)}
              >
                {bulkAction.icon && <bulkAction.icon className="h-4 w-4 mr-2" />}
                {bulkAction.label}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.deselectAll}
            className="ml-auto"
          >
            Clear selection
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {config.selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.size === items.length && items.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        actions.selectAll();
                      } else {
                        actions.deselectAll();
                      }
                    }}
                  />
                </TableHead>
              )}
              {config.columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className={column.sortable ? 'cursor-pointer hover:bg-muted' : ''}
                >
                  {column.label}
                </TableHead>
              ))}
              {config.actions && config.actions.length > 0 && (
                <TableHead className="w-12">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {config.selectable && <TableCell><div className="h-4 bg-muted animate-pulse rounded" /></TableCell>}
                  {config.columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                  {config.actions && <TableCell><div className="h-4 bg-muted animate-pulse rounded" /></TableCell>}
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={
                    config.columns.length + 
                    (config.selectable ? 1 : 0) + 
                    (config.actions ? 1 : 0)
                  }
                  className="text-center py-8 text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  {config.selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            actions.selectItem(item.id);
                          } else {
                            actions.deselectItem(item.id);
                          }
                        }}
                      />
                    </TableCell>
                  )}
                  {config.columns.map((column) => (
                    <TableCell key={String(column.key)}>
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
                        <DropdownMenuContent align="end">
                          {config.actions.map((action) => (
                            <DropdownMenuItem
                              key={action.action}
                              onClick={() => action.onClick(item)}
                              disabled={action.disabled?.(item)}
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

      {/* Pagination */}
      <AdminTablePagination
        pagination={pagination}
        onPageChange={actions.setPage}
        onLimitChange={actions.setLimit}
      />
    </div>
  );
}
