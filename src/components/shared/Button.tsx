import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'rainbow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  onClick,
  type = 'button',
  disabled = false,
  icon
}: ButtonProps) {
  // Variant styles
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-primary-light text-primary hover:bg-primary-light/80',
    outline: 'border border-border-light text-text-dark hover:bg-gray-50',
    rainbow: `relative z-10 bg-primary text-white overflow-hidden 
              before:absolute before:-z-10 before:inset-0 before:bg-gradient-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 before:animate-rainbow 
              before:bg-[length:200%_auto] before:opacity-0 hover:before:opacity-100 before:transition-opacity
              border border-transparent hover:border-purple-300 shadow-sm`
  };
  
  // Size styles
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-md',
    md: 'text-sm px-4 py-2 rounded-lg',
    lg: 'text-base px-5 py-2.5 rounded-lg'
  };
  
  const baseClasses = `font-medium inline-flex items-center justify-center transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`;
  
  let wrapperClasses = '';
  let wrapperElement = null;

  // For rainbow button, add a glowing border effect with animation
  if (variant === 'rainbow' && !disabled) {
    wrapperClasses = 'relative inline-block rounded-lg group';
    wrapperElement = (
      <div className={wrapperClasses}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-75 group-hover:opacity-100 animate-rainbow-border rounded-lg blur-sm group-hover:blur transition duration-200"></div>
        {href && !disabled ? (
          <Link href={href} className={baseClasses}>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </Link>
        ) : (
          <button
            type={type}
            className={baseClasses}
            onClick={onClick}
            disabled={disabled}
          >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </button>
        )}
      </div>
    );
    return wrapperElement;
  }
  
  const content = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );
  
  if (href && !disabled) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }
  
  return (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
} 