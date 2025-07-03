
import React, { memo, ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

const LazySection = memo(({ children, fallback, className = '' }: LazySectionProps) => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  return (
    <div ref={elementRef} className={className}>
      {hasIntersected ? children : (fallback || <div className="h-32" />)}
    </div>
  );
});

LazySection.displayName = 'LazySection';

export default LazySection;
