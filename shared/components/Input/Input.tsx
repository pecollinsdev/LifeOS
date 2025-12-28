import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Input component with iOS-style design.
 * 
 * Features:
 * - iOS-style rounded corners (12px)
 * - Smooth focus transitions
 * - Proper label spacing
 * - Error and helper text states
 * - Touch-optimized sizing (48px min height)
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-text-secondary mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3.5 text-base bg-surface border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background focus:border-transparent min-h-[48px] text-text-primary ${
          error
            ? 'border-error-dark focus:ring-error-dark'
            : 'border-gray-300 focus:border-transparent'
        } ${className}`}
        {...props}
      />
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

