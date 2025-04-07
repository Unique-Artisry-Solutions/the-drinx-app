
import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface StepsNavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  tabs: Tab[];
  isTabComplete: (tabName: string) => boolean;
}

const StepsNavigation: React.FC<StepsNavigationProps> = ({ 
  currentTab, 
  setCurrentTab, 
  tabs,
  isTabComplete
}) => {
  const getCompletionStatus = (tabName: string): React.ReactNode => {
    const isMandatory = ["basics", "theme", "venues"].includes(tabName);
    
    if (isTabComplete(tabName)) {
      return <span className="ml-2 text-xs bg-green-500/20 text-green-700 px-1.5 py-0.5 rounded-full">Complete</span>;
    }
    
    return (
      <span className={`ml-2 text-xs ${isMandatory ? "bg-red-500/20 text-red-700" : "bg-amber-500/20 text-amber-700"} px-1.5 py-0.5 rounded-full`}>
        {isMandatory ? "Required" : "Optional"}
      </span>
    );
  };

  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Creation Steps</h2>
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors flex justify-between items-center ${
                currentTab === tab.id 
                  ? "bg-spiritless-pink/10 border-l-4 border-spiritless-pink" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span className="font-medium truncate">{tab.label}</span>
              <div className="flex-shrink-0">
                {getCompletionStatus(tab.id)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepsNavigation;
