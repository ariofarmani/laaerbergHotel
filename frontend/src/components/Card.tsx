import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  shadow = 'md',
  padding = 'md',
  border = true,
  rounded = 'md',
  onClick,
}) => {
  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };

  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  // Rounded classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Border class
  const borderClass = border ? 'border border-gray-200' : '';

  // Interactive class
  const interactiveClass = onClick ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';

  return (
    <div
      className={`
        bg-white
        ${shadowClasses[shadow]}
        ${paddingClasses[padding]}
        ${roundedClasses[rounded]}
        ${borderClass}
        ${interactiveClass}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;