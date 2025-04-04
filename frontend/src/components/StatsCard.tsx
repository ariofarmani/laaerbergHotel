import React from 'react';
import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<IconType>;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period?: string;
  };
  isLoading?: boolean;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  change,
  isLoading = false,
  className = '',
}) => {
  // Color variants
  const colorVariants = {
    primary: 'bg-blue-50 text-blue-500 border-blue-100',
    secondary: 'bg-purple-50 text-purple-500 border-purple-100',
    success: 'bg-green-50 text-green-500 border-green-100',
    danger: 'bg-red-50 text-red-500 border-red-100',
    warning: 'bg-amber-50 text-amber-500 border-amber-100',
  };

  // Icon background color variants
  const iconBgVariants = {
    primary: 'bg-blue-100',
    secondary: 'bg-purple-100',
    success: 'bg-green-100',
    danger: 'bg-red-100',
    warning: 'bg-amber-100',
  };

  // Change indicator text colors
  const changeColorVariants = {
    increase: 'text-green-500',
    decrease: 'text-red-500',
  };

  // Loading UI
  if (isLoading) {
    return (
      <div className={`p-6 bg-white rounded-xl border shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-2/3 mt-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
        </div>
      </div>
    );
  }

  // Render change indicator if provided
  const renderChange = () => {
    if (!change) return null;

    const { value: changeValue, type, period = 'vs last period' } = change;
    const formattedChange = `${changeValue > 0 ? '+' : ''}${changeValue}%`;

    return (
      <div className="flex items-center mt-1 text-sm">
        <span className={changeColorVariants[type]}>{formattedChange}</span>
        <span className="text-gray-500 ml-1">{period}</span>
      </div>
    );
  };

  return (
    <div className={`p-6 bg-white rounded-xl border shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className={`p-2 rounded-full ${iconBgVariants[color]}`}>
          {React.cloneElement(icon, {
            className: `h-5 w-5 ${colorVariants[color].split(' ')[1]}`,
          })}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-semibold">{value}</p>
        {renderChange()}
      </div>
    </div>
  );
};

export default StatsCard;