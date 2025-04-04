import React, { useState, useEffect } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'buttons';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  contentClassName?: string;
  children?: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab: externalActiveTab,
  onChange,
  variant = 'underline',
  size = 'md',
  fullWidth = false,
  className = '',
  contentClassName = '',
  children,
}) => {
  // If no activeTab is provided, use the first tab
  const [activeTabState, setActiveTabState] = useState(externalActiveTab || tabs[0]?.id || '');
  
  // Update internal state when external activeTab changes
  useEffect(() => {
    if (externalActiveTab && externalActiveTab !== activeTabState) {
      setActiveTabState(externalActiveTab);
    }
  }, [externalActiveTab]);

  // Handler for tab change
  const handleTabChange = (tabId: string) => {
    // Check if tab is disabled
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.disabled) return;
    
    setActiveTabState(tabId);
    onChange(tabId);
  };

  // Determine style based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'pills':
        return {
          container: 'p-1 bg-gray-100 rounded-lg',
          tab: 'rounded-md',
          active: 'bg-white shadow',
          hover: 'hover:bg-white/50',
          disabled: 'opacity-50 cursor-not-allowed',
        };
      case 'buttons':
        return {
          container: 'space-x-2',
          tab: 'border rounded-md',
          active: 'border-blue-500 bg-blue-50 text-blue-600',
          hover: 'hover:bg-gray-50',
          disabled: 'opacity-50 cursor-not-allowed border-gray-200',
        };
      case 'underline':
      default:
        return {
          container: 'border-b border-gray-200',
          tab: 'border-b-2 border-transparent -mb-px',
          active: 'border-blue-500 text-blue-600',
          hover: 'hover:border-gray-300 hover:text-gray-600',
          disabled: 'opacity-50 cursor-not-allowed',
        };
    }
  };

  // Determine size
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-sm px-2 py-1';
      case 'lg':
        return 'text-base px-5 py-3';
      case 'md':
      default:
        return 'text-sm px-4 py-2';
    }
  };

  const styles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <div className={className}>
      {/* Tab navigation */}
      <div className={`flex ${fullWidth ? 'w-full' : ''} ${styles.container}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`
              ${fullWidth ? 'flex-1' : ''}
              ${sizeStyles}
              ${styles.tab}
              ${tab.id === activeTabState ? styles.active : styles.hover}
              ${tab.disabled ? styles.disabled : ''}
              flex items-center justify-center gap-2 transition-colors
            `}
            onClick={() => handleTabChange(tab.id)}
            disabled={tab.disabled}
            aria-selected={tab.id === activeTabState}
            role="tab"
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-medium rounded-full bg-gray-200">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {children && (
        <div className={`mt-4 ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Tabs;