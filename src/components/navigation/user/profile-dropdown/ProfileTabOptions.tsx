
import React from 'react';

interface TabOption {
  value: string;
  label: string;
}

interface ProfileTabOptionsProps {
  tabOptions: TabOption[];
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  isDarkTheme: boolean;
}

const ProfileTabOptions: React.FC<ProfileTabOptionsProps> = ({
  tabOptions,
  activeTab,
  handleTabChange,
  isDarkTheme
}) => {
  if (!handleTabChange || tabOptions.length === 0) {
    return null;
  }

  return (
    <div className={`px-2 py-1 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="text-xs font-medium mb-1 text-muted-foreground">Tabs</div>
      <div className="flex flex-col gap-1">
        {tabOptions.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`text-sm px-2 py-1 rounded-md transition-colors ${
              activeTab === tab.value
                ? isDarkTheme
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-900'
                : isDarkTheme
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabOptions;
