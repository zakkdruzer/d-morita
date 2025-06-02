import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  id,
  ...rest
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          block px-3 py-2 bg-white border rounded-md shadow-sm
          border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
          ${error ? 'border-red-500' : ''}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;