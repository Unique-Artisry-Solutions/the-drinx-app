
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter, X } from 'lucide-react';

export interface FilterConfig<T> {
  key: keyof T;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { value: any; label: string }[];
}

interface AdminTableFiltersProps<T> {
  filters: FilterConfig<T>[];
  values: Record<string, any>;
  onChange: (filters: Record<string, any>) => void;
  onClear: () => void;
}

export function AdminTableFilters<T>({
  filters,
  values,
  onChange,
  onClear
}: AdminTableFiltersProps<T>) {
  const activeFilters = Object.entries(values).filter(([_, value]) => 
    value !== undefined && value !== null && value !== ''
  );

  const updateFilter = (key: string, value: any) => {
    onChange({ ...values, [key]: value });
  };

  const removeFilter = (key: string) => {
    const newValues = { ...values };
    delete newValues[key];
    onChange(newValues);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilters.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {activeFilters.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {activeFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClear}
                >
                  Clear all
                </Button>
              )}
            </div>
            
            {filters.map((filter) => (
              <div key={String(filter.key)} className="space-y-2">
                <label className="text-sm font-medium">{filter.label}</label>
                {filter.type === 'select' ? (
                  <Select
                    value={values[String(filter.key)] || ''}
                    onValueChange={(value) => updateFilter(String(filter.key), value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${filter.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options?.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={filter.type}
                    placeholder={`Filter by ${filter.label}`}
                    value={values[String(filter.key)] || ''}
                    onChange={(e) => updateFilter(String(filter.key), e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Active filters */}
      {activeFilters.map(([key, value]) => {
        const filter = filters.find(f => String(f.key) === key);
        if (!filter) return null;

        return (
          <div
            key={key}
            className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
          >
            <span className="font-medium">{filter.label}:</span>
            <span>{String(value)}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeFilter(key)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
