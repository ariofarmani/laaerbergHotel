import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHome, FaChevronRight } from 'react-icons/fa';

interface BreadcrumbsProps {
  className?: string;
  showHome?: boolean;
  homeIcon?: boolean;
  separator?: React.ReactNode;
  items?: Array<{
    label: string;
    href?: string;
  }>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  className = '',
  showHome = true,
  homeIcon = true,
  separator = <FaChevronRight className="mx-2 text-gray-400" size={10} />,
  items = [],
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  
  // If no items are provided, generate them from the current path
  const breadcrumbItems = items.length
    ? items
    : location.pathname
        .split('/')
        .filter(Boolean)
        .map((path, index, array) => {
          // Start building the path
          let href = '';
          for (let i = 0; i <= index; i++) {
            href += `/${array[i]}`;
          }
          
          // Format the label (capitalize first letter, replace hyphens with spaces)
          const label = path
            .replace(/-/g, ' ')
            .replace(/^\w/, (c) => c.toUpperCase());
          
          return {
            label,
            href,
          };
        });
  
  // Add home if requested
  const allItems = showHome
    ? [{ label: homeIcon ? '' : t('breadcrumbs.home', 'Home'), href: '/' }, ...breadcrumbItems]
    : breadcrumbItems;
  
  if (allItems.length === 0) return null;
  
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
      <ol className="flex flex-wrap items-center">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && separator}
              
              {isLast ? (
                <span className="font-medium text-gray-500" aria-current="page">
                  {item.label === '' && homeIcon ? (
                    <FaHome className="text-gray-500" aria-label={t('breadcrumbs.home', 'Home')} />
                  ) : (
                    item.label
                  )}
                </span>
              ) : (
                <Link
                  to={item.href || '#'}
                  className="text-gray-600 hover:text-primary"
                >
                  {item.label === '' && homeIcon ? (
                    <FaHome aria-label={t('breadcrumbs.home', 'Home')} />
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;