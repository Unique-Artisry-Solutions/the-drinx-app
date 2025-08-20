import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, X } from 'lucide-react';

interface NotificationFiltersProps {
  selectedFilters: {
    priority: string[];
    type: string[];
    dateRange: string;
  };
  onFiltersChange: (filters: {
    priority: string[];
    type: string[];
    dateRange: string;
  }) => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  selectedFilters,
  onFiltersChange
}) => {
  const priorityOptions = [
    { value: 'urgent', label: 'Urgent', color: 'destructive' },
    { value: 'high', label: 'High', color: 'default' },
    { value: 'medium', label: 'Medium', color: 'secondary' },
    { value: 'low', label: 'Low', color: 'outline' }
  ];

  const typeOptions = [
    { value: 'success', label: 'Success' },
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Past Week' },
    { value: 'month', label: 'Past Month' }
  ];

  const handlePriorityChange = (priority: string, checked: boolean) => {
    const newPriorities = checked
      ? [...selectedFilters.priority, priority]
      : selectedFilters.priority.filter(p => p !== priority);
    
    onFiltersChange({
      ...selectedFilters,
      priority: newPriorities
    });
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...selectedFilters.type, type]
      : selectedFilters.type.filter(t => t !== type);
    
    onFiltersChange({
      ...selectedFilters,
      type: newTypes
    });
  };

  const handleDateRangeChange = (dateRange: string) => {
    onFiltersChange({
      ...selectedFilters,
      dateRange
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priority: [],
      type: [],
      dateRange: 'all'
    });
  };

  const hasActiveFilters = 
    selectedFilters.priority.length > 0 ||
    selectedFilters.type.length > 0 ||
    selectedFilters.dateRange !== 'all';

  const activeFilterCount = 
    selectedFilters.priority.length + 
    selectedFilters.type.length + 
    (selectedFilters.dateRange !== 'all' ? 1 : 0);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-3 w-3 mr-1" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {priorityOptions.map(option => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedFilters.priority.includes(option.value)}
              onCheckedChange={(checked) => handlePriorityChange(option.value, checked)}
            >
              <Badge variant={option.color as any} className="mr-2">
                {option.label}
              </Badge>
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Type</DropdownMenuLabel>
          {typeOptions.map(option => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedFilters.type.includes(option.value)}
              onCheckedChange={(checked) => handleTypeChange(option.value, checked)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Date Range</DropdownMenuLabel>
          {dateRangeOptions.map(option => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedFilters.dateRange === option.value}
              onCheckedChange={() => handleDateRangeChange(option.value)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active filter badges */}
      {selectedFilters.priority.map(priority => (
        <Badge
          key={`priority-${priority}`}
          variant="secondary"
          className="text-xs flex items-center gap-1"
        >
          Priority: {priority}
          <X
            className="h-3 w-3 cursor-pointer hover:bg-muted-foreground/20 rounded"
            onClick={() => handlePriorityChange(priority, false)}
          />
        </Badge>
      ))}

      {selectedFilters.type.map(type => (
        <Badge
          key={`type-${type}`}
          variant="secondary"
          className="text-xs flex items-center gap-1"
        >
          Type: {type}
          <X
            className="h-3 w-3 cursor-pointer hover:bg-muted-foreground/20 rounded"
            onClick={() => handleTypeChange(type, false)}
          />
        </Badge>
      ))}

      {selectedFilters.dateRange !== 'all' && (
        <Badge variant="secondary" className="text-xs flex items-center gap-1">
          Date: {dateRangeOptions.find(d => d.value === selectedFilters.dateRange)?.label}
          <X
            className="h-3 w-3 cursor-pointer hover:bg-muted-foreground/20 rounded"
            onClick={() => handleDateRangeChange('all')}
          />
        </Badge>
      )}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          Clear All
        </Button>
      )}
    </div>
  );
};