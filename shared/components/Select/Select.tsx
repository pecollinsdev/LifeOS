import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Select component with iOS-style design.
 * 
 * Matches Input component styling for consistency.
 * Features iOS-style rounded corners and smooth transitions.
 */
export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  children,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-semibold text-text-secondary mb-2"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-4 py-3.5 text-base bg-surface border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background focus:border-transparent min-h-[48px] text-text-primary ${
          error
            ? 'border-error-dark focus:ring-error-dark'
            : 'border-gray-300 focus:border-transparent'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-2 text-sm font-medium text-error-text" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-text-tertiary">{helperText}</p>
      )}
    </div>
  );
};

