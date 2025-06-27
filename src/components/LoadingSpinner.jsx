import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'large':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${getSizeClasses()} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
      {message && <p className="mt-2 text-gray-600 text-sm">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;