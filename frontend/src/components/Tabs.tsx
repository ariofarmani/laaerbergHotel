import React, { useState, useEffect } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
  onChange?: (tabId: string) => void;
  size?: 'sm' | 'md' | 'lg';
  stretch?: boolean;
  contentClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  orientation = 'horizontal',
  variant = 'default',
  className = '',
  onChange,
  size = 'md',
  stretch = false,
  contentClassName = '',
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab || (tabs.length > 0 ? tabs[0].id : ''));

  useEffect(() => {
    if (defaultActiveTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab]);

  const handleTabClick = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)?.disabled) {
      return;
    }
    
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  // Size-based classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  // Variant-based classes
  const getTabClasses = (tabId: string, disabled?: boolean) => {
    const isActive = activeTab === tabId;
    const baseClasses = `focus:outline-none transition-colors font-medium ${sizeClasses[size]} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`;
    
    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-full ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'}`;
      case 'underline':
        return `${baseClasses} ${isActive ? 'border-b-2 border-primary text-primary' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'}`;
      default: // 'default'
        return `${baseClasses} rounded-t-lg ${isActive ? 'bg-white border-b-2 border-primary text-primary' : 'bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`;
    }
  };

  // Flexbox container direction class
  const containerClass = orientation === 'vertical' 
    ? 'flex flex-col sm:flex-row' 
    : 'flex flex-col';

  // Tab list classes
  const tabListClasses = orientation === 'vertical'
    ? 'flex flex-col space-y-1 sm:w-48 sm:mr-4 border-r border-gray-200'
    : `flex ${stretch ? 'w-full' : ''} ${variant === 'default' ? 'border-b border-gray-200' : ''}`;

  // Tab content classes
  const tabContentContainerClasses = orientation === 'vertical'
    ? 'flex-1'
    : 'pt-4';

  // Get active tab content
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={`${containerClass} ${className}`}>
      {/* Tab List */}
      <div className={tabListClasses}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${getTabClasses(tab.id, tab.disabled)} flex items-center ${stretch && orientation === 'horizontal' ? 'flex-1 justify-center' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`${tabContentContainerClasses} ${contentClassName}`} role="tabpanel">
        {activeTabContent}
      </div>
    </div>
  );
};

export default Tabs;