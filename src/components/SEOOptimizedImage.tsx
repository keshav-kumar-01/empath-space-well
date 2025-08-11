
import React from 'react';

interface SEOOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

const SEOOptimizedImage: React.FC<SEOOptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  priority = false
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : loading}
      decoding="async"
      // Add structured data for images
      itemProp="image"
    />
  );
};

export default SEOOptimizedImage;
