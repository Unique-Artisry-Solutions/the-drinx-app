
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface GuideTab {
  value: string;
  label: string;
  badge?: string;
}

interface GuideTabsListProps {
  tabs: GuideTab[];
  _activeTab?: string;
}

export function GuideTabsList({ tabs }: GuideTabsListProps) {
  return (
    <TabsList className="grid w-full grid-cols-6">
      {tabs.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value} className="relative">
          <span>{tab.label}</span>
          {tab.badge && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {tab.badge}
            </Badge>
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
