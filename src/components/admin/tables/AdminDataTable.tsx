
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AdminTablePagination } from './AdminTablePagination';
import { AdminTableSearch } from './AdminTableSearch';
import { AdminTableFilters, FilterConfig } from './AdminTableFilters';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'boolean' | 'date' | 'badge';
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableAction<T> {
  label: string;
  action: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: (item: T) => void;
}

export interface BulkAction<T> {
  label: string;
  action: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: (selectedItems: T[]) => void;
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
  state: {
    items: T[];
    isLoading: boolean;
    error: string | null;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    searchQuery: string;
    sortBy?: string;
    sortOrder: 'asc' | 'desc';
    filters: Record<string, any>;
  };
  actions: {
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setSearch: (query: string) => void;
    setSort: (field: string, order: 'asc' | 'desc') => void;
    setFilters: (filters: Record<string, any>) => void;
    refreshData: () => void;
    deleteItem: (id: string) => void;
    bulkDelete: (ids: string[]) => void;
  };
  title: string;
  description?: string;
}

function renderCellValue<T>(value: any, column: TableColumn<T>, item: T): React.ReactNode {
  // Use custom render function if provided
  if (column.render) {
    return column.render(value, item);
  }

  // Handle null/undefined values
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">-</span>;
  }

  // Handle different column types
  switch (column.type) {
    case 'boolean':
      return (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      );
    case 'date':
      return new Date(value).toLocaleDateString();
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : String(value);
    case 'badge':
      return <Badge variant="outline">{String(value)}</Badge>;
    case 'text':
    default:
      return String(value);
  }
}

export function AdminDataTable<T extends Record<string, any>>({
  config,
  state,
  actions,
  title,
  description
}: AdminDataTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleSort = (field: string) => {
    if (!config.sortable) return;
    
    const newOrder = state.sortBy === field && state.sortOrder === 'asc' ? 'desc' : 'asc';
    actions.setSort(field, newOrder);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = state.items.map(item => item.id).filter(Boolean);
      setSelectedItems(new Set(allIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  const selectedItemsArray = useMemo(() => {
    return state.items.filter(item => selectedItems.has(item.id));
  }, [state.items, selectedItems]);

  const isAllSelected = state.items.length > 0 && selectedItems.size === state.items.length;
  const isPartiallySelected = selectedItems.size > 0 && selectedItems.size < state.items.length;

  if (state.error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Error loading data: {state.error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            {selectedItems.size > 0 && config.bulkActions && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedItems.size} selected
                </span>
                {config.bulkActions.map((action) => (
                  <Button
                    key={action.action}
                    variant={action.variant || 'outline'}
                    size="sm"
                    onClick={() => action.onClick(selectedItemsArray)}
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
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

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  {config.selectable && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isPartiallySelected}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                  )}
                  {config.columns.map((column) => (
                    <TableHead
                      key={String(column.key)}
                      className={column.sortable ? 'cursor-pointer select-none' : ''}
                      onClick={() => column.sortable && handleSort(String(column.key))}
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && state.sortBy === String(column.key) && (
                          state.sortOrder === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        )}
                      </div>
                    </TableHead>
                  ))}
                  {config.actions && config.actions.length > 0 && (
                    <TableHead className="w-12">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {config.selectable && (
                        <TableCell>
                          <Skeleton className="h-4 w-4" />
                        </TableCell>
                      )}
                      {config.columns.map((column) => (
                        <TableCell key={String(column.key)}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                      {config.actions && config.actions.length > 0 && (
                        <TableCell>
                          <Skeleton className="h-8 w-8" />
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : state.items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={
                        config.columns.length +
                        (config.selectable ? 1 : 0) +
                        (config.actions && config.actions.length > 0 ? 1 : 0)
                      }
                      className="text-center py-8 text-muted-foreground"
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  state.items.map((item) => (
                    <TableRow key={item.id}>
                      {config.selectable && (
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.has(item.id)}
                            onCheckedChange={(checked) =>
                              handleSelectItem(item.id, checked as boolean)
                            }
                          />
                        </TableCell>
                      )}
                      {config.columns.map((column) => (
                        <TableCell key={String(column.key)}>
                          {renderCellValue(item[column.key], column, item)}
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
                                  className={
                                    action.variant === 'destructive'
                                      ? 'text-destructive focus:text-destructive'
                                      : ''
                                  }
                                >
                                  {action.icon && (
                                    <action.icon className="h-4 w-4 mr-2" />
                                  )}
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
            pagination={state.pagination}
            onPageChange={actions.setPage}
            onLimitChange={actions.setLimit}
          />
        </div>
      </CardContent>
    </Card>
  );
}
