import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  homeLabel?: string;
  homePath?: string;
  separator?: React.ReactNode;
  className?: string;
  maxItems?: number;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHome = true,
  homeLabel = 'Home',
  homePath = '/',
  separator = <FaChevronRight className="mx-2 text-gray-400 text-xs" />,
  className = '',
  maxItems = 0,
}) => {
  const location = useLocation();
  
  // If no items provided, generate from current path
  const breadcrumbs = items || generateBreadcrumbs(location.pathname);
  
  // Add home item if showHome is true
  const allItems = showHome 
    ? [{ label: homeLabel, path: homePath, icon: <FaHome /> }, ...breadcrumbs] 
    : breadcrumbs;
  
  // Limit items if maxItems is provided
  const displayedItems = maxItems > 0 && allItems.length > maxItems
    ? [
        ...allItems.slice(0, maxItems - 1),
        allItems[allItems.length - 1]
      ]
    : allItems;
  
  // If truncated, add ellipsis
  const isTruncated = maxItems > 0 && allItems.length > maxItems;
  
  return (
    <nav className={`flex items-center text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap">
        {displayedItems.map((item, index) => {
          const isLast = index === displayedItems.length - 1;
          
          // If truncated and this is the first item after truncation, show ellipsis
          const showEllipsis = isTruncated && index === maxItems - 1 && index !== 0;
          
          return (
            <React.Fragment key={item.path}>
              {showEllipsis && (
                <li className="flex items-center">
                  {separator}
                  <span className="text-gray-500 mx-2">...</span>
                </li>
              )}
              <li className="flex items-center">
                {index > 0 && separator}
                {isLast ? (
                  <span className="font-medium text-gray-800 flex items-center">
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    to={item.path} 
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumbs from path
const generateBreadcrumbs = (path: string): BreadcrumbItem[] => {
  // Remove trailing slash
  const cleanPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  
  // Split path into segments
  const segments = cleanPath.split('/').filter(Boolean);
  
  // Build breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    // Build current path
    currentPath += `/${segment}`;
    
    // Format label (capitalize and replace hyphens with spaces)
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbs.push({
      label,
      path: currentPath,
    });
  });
  
  return breadcrumbs;
};

export default Breadcrumbs;