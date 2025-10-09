import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  aspectRatio?: string;
  placeholderColor?: string;
}

/**
 * OptimizedImage - A performance-optimized image component with:
 * - Lazy loading by default
 * - Intersection Observer for progressive loading
 * - Blur-up placeholder effect
 * - Proper aspect ratio preservation
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  loading = 'lazy',
  aspectRatio,
  placeholderColor = 'hsl(var(--muted))',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: placeholderColor }}
          aria-hidden="true"
        />
      )}
      
      {/* Actual Image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
