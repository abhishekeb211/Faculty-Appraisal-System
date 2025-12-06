import React from 'react';
import { ClipLoader } from 'react-spinners';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 50, 
  color = '#4f46e5',
  fullScreen = false 
}) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <ClipLoader size={size} color={color} loading={true} />
    </div>
  );
};

export default LoadingSpinner;

