import React from 'react';

interface LoadingFallbackProps {
  text?: string;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-chetna-primary border-t-transparent"></div>
      <p className="text-muted-foreground animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingFallback;