import React, { memo } from "react";

const OptimizedLoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-chetna-primary border-t-transparent"></div>
      <p className="text-sm text-gray-600 animate-pulse">Loading...</p>
    </div>
  </div>
);

export default memo(OptimizedLoadingSpinner);
