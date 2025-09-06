import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = "Loading...", 
  className = "min-h-[400px]" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className} space-y-4`}>
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      <p className="text-muted-foreground animate-pulse text-sm">{text}</p>
    </div>
  );
};

export default LoadingSpinner;