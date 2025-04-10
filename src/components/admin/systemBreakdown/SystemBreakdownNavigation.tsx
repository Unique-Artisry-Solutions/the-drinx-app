
import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  FileBarChart2, 
  Award, 
  Layers, 
  Megaphone, 
  BookOpen,
  LineChart,
  GitPullRequest,
  Kanban
} from 'lucide-react';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

interface SystemBreakdownNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SystemBreakdownNavigation: React.FC<SystemBreakdownNavigationProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <NavigationMenu className="mb-6">
      <NavigationMenuList className="flex-wrap">
        {/* System Overview Group */}
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={cn(
              "bg-white px-4 py-2 rounded-t-md",
              activeTab === 'overview' && "bg-blue-50 text-blue-600"
            )}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            System Overview
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px]">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      activeTab === 'overview' ? "bg-blue-50" : "bg-white"
                    )}
                  >
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      <div className="text-sm font-medium">Overview</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      System implementation status and progress metrics
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    onClick={(e) => { e.preventDefault(); setActiveTab('showcase'); }}
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      activeTab === 'showcase' ? "bg-blue-50" : "bg-white"
                    )}
                  >
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      <div className="text-sm font-medium">Feature Showcase</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Highlight completed and signature features
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Feature Management Group */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "bg-white px-4 py-2 rounded-t-md",
              (activeTab === 'admin' || activeTab === 'establishment' || 
               activeTab === 'individual' || activeTab === 'promoter' || 
               activeTab === 'promoter-requirements') && "bg-purple-50 text-purple-600"
            )}
          >
            <Layers className="h-4 w-4 mr-2" />
            Feature Management
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-2 gap-3 p-4 w-[500px]">
              <ul className="grid gap-3">
                <li className="mb-2">
                  <h4 className="text-sm font-medium leading-none mb-2 text-gray-500">User Type Features</h4>
                  <NavigationMenuLink asChild>
                    <a
                      onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        activeTab === 'admin' ? "bg-purple-50" : "bg-white"
                      )}
                    >
                      <div className="flex items-center">
                        <FileBarChart2 className="h-4 w-4 mr-2" />
                        <div className="text-sm font-medium">Admin Features</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a
                      onClick={(e) => { e.preventDefault(); setActiveTab('establishment'); }}
                      className={cn(
                        "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        activeTab === 'establishment' ? "bg-purple-50" : "bg-white"
                      )}
                    >
                      <div className="flex items-center">
                        <FileBarChart2 className="h-4 w-4 mr-2" />
                        <div className="text-sm font-medium">Establishment Features</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a
                      onClick={(e) => { e.preventDefault(); setActiveTab('individual'); }}
                      className={cn(
                        "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        activeTab === 'individual' ? "bg-purple-50" : "bg-white"
                      )}
                    >
                      <div className="flex items-center">
                        <FileBarChart2 className="h-4 w-4 mr-2" />
                        <div className="text-sm font-medium">Individual Features</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
              <ul className="grid gap-3">
                <li className="mb-2">
                  <h4 className="text-sm font-medium leading-none mb-2 text-gray-500">Promoter System</h4>
                  <NavigationMenuLink asChild>
                    <a
                      onClick={(e) => { e.preventDefault(); setActiveTab('promoter'); }}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        activeTab === 'promoter' ? "bg-purple-50" : "bg-white"
                      )}
                    >
                      <div className="flex items-center">
                        <FileBarChart2 className="h-4 w-4 mr-2" />
                        <div className="text-sm font-medium">Promoter Features</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a
                      onClick={(e) => { e.preventDefault(); setActiveTab('promoter-requirements'); }}
                      className={cn(
                        "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        activeTab === 'promoter-requirements' ? "bg-purple-50" : "bg-white"
                      )}
                    >
                      <div className="flex items-center">
                        <Megaphone className="h-4 w-4 mr-2" />
                        <div className="text-sm font-medium">Promoter Requirements</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Planning & Releases Group */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "bg-white px-4 py-2 rounded-t-md",
              (activeTab === 'improvements' || activeTab === 'releases') && "bg-green-50 text-green-600"
            )}
          >
            <GitPullRequest className="h-4 w-4 mr-2" />
            Planning & Releases
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px]">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    onClick={(e) => { e.preventDefault(); setActiveTab('improvements'); }}
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      activeTab === 'improvements' ? "bg-green-50" : "bg-white"
                    )}
                  >
                    <div className="flex items-center">
                      <LineChart className="h-4 w-4 mr-2" />
                      <div className="text-sm font-medium">Proposed Improvements</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Review planned system enhancements and feature requests
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    onClick={(e) => { e.preventDefault(); setActiveTab('releases'); }}
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      activeTab === 'releases' ? "bg-green-50" : "bg-white"
                    )}
                  >
                    <div className="flex items-center">
                      <Kanban className="h-4 w-4 mr-2" />
                      <div className="text-sm font-medium">Release Management</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Schedule and manage feature releases and deployment plans
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// For mobile view, we create a simpler tab-based navigation
export const MobileSystemBreakdownNavigation: React.FC<SystemBreakdownNavigationProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="overview" className="flex items-center gap-1">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden md:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="admin" className="flex items-center gap-1">
          <Layers className="h-4 w-4" />
          <span className="hidden md:inline">Features</span>
        </TabsTrigger>
        <TabsTrigger value="releases" className="flex items-center gap-1">
          <GitPullRequest className="h-4 w-4" />
          <span className="hidden md:inline">Releases</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SystemBreakdownNavigation;
