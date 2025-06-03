
import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminTableSearch } from './AdminTableSearch';
import { AdminTableFilters } from './AdminTableFilters';
import { AdminTablePagination } from './AdminTablePagination';
import type { AdminEntityState, AdminEntityActions } from '@/hooks/admin/useAdminService';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'badge';
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableAction<T> {
  label: string;
  action: string;
  icon: LucideIcon;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: (item: T) => void;
}

export interface BulkAction<T> {
  label: string;
  action: string;
  icon: LucideIcon;
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

interface AdminDataTableProps<T> {
  config: AdminTableConfig<T>;
  state: AdminEntityState<T>;
  actions: AdminEntityActions<T>;
  title: string;
  description?: string;
}

export function AdminDataTable<T extends Record<string, any>>({
  config,
  state,
  actions,
  title,
  description
}: AdminDataTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectItem = (item: T, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, item]);
    } else {
      setSelectedItems(prev => prev.filter(selected => selected.id !== item.id));
      setSelectAll(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(state.items);
      setSelectAll(true);
    } else {
      setSelectedItems([]);
      setSelectAll(false);
    }
  };

  const renderCellValue = (column: TableColumn<T>, value: any, item: T) => {
    if (column.render) {
      return column.render(value, item);
    }

    switch (column.type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-';
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'badge':
        return <span className="px-2 py-1 bg-muted rounded text-sm">{value}</span>;
      default:
        return value || '-';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {config.searchable && (
              <AdminTableSearch
                value={state.searchQuery}
                onChange={actions.setSearch}
                placeholder={`Search ${title.toLowerCase()}...`}
              />
            )}
            {config.filters && config.filters.length > 0 && (
              <AdminTableFilters
                filters={config.filters}
                values={state.filters}
                onChange={actions.setFilters}
                onClear={() => actions.setFilters({})}
              />
            )}
          </div>
          
          {/* Bulk Actions */}
          {config.bulkActions && selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedItems.length} selected
              </span>
              {config.bulkActions.map((bulkAction, index) => (
                <Button
                  key={index}
                  variant={bulkAction.variant || 'outline'}
                  size="sm"
                  onClick={() => bulkAction.onClick(selectedItems)}
                >
                  <bulkAction.icon className="h-4 w-4 mr-2" />
                  {bulkAction.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                {config.selectable && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                {config.columns.map((column, index) => (
                  <TableHead key={index}>
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const newOrder = 
                            state.sortBy === column.key && state.sortOrder === 'asc' 
                              ? 'desc' 
                              : 'asc';
                          actions.setSort(String(column.key), newOrder);
                        }}
                      >
                        {column.label}
                      </Button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
                {config.actions && config.actions.length > 0 && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.isLoading ? (
                <TableRow>
                  <TableCell 
                    colSpan={
                      config.columns.length + 
                      (config.selectable ? 1 : 0) + 
                      (config.actions ? 1 : 0)
                    }
                    className="text-center py-8"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : state.items.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={
                      config.columns.length + 
                      (config.selectable ? 1 : 0) + 
                      (config.actions ? 1 : 0)
                    }
                    className="text-center py-8"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                state.items.map((item, rowIndex) => (
                  <TableRow key={item.id || rowIndex}>
                    {config.selectable && (
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.some(selected => selected.id === item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item, !!checked)}
                        />
                      </TableCell>
                    )}
                    {config.columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        {renderCellValue(column, item[column.key], item)}
                      </TableCell>
                    ))}
                    {config.actions && config.actions.length > 0 && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {config.actions.map((action, actionIndex) => (
                            <Button
                              key={actionIndex}
                              variant={action.variant || 'ghost'}
                              size="sm"
                              onClick={() => action.onClick(item)}
                            >
                              <action.icon className="h-4 w-4" />
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
          currentPage={state.pagination.page}
          totalPages={state.pagination.totalPages}
          pageSize={state.pagination.limit}
          totalItems={state.pagination.total}
          onPageChange={actions.setPage}
          onPageSizeChange={actions.setLimit}
        />

        {/* Error Display */}
        {state.error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
            <p className="text-destructive text-sm">{state.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
