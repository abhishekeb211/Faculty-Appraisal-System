import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const RouteLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size={60} />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default RouteLoader;

