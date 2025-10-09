import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Breadcrumbs from '@/components/Breadcrumbs';

interface PageLayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  className?: string;
}

/**
 * PageLayout - A wrapper component that provides consistent layout structure
 * Includes Header, Footer, BackToTop button, and optional Breadcrumbs
 */
const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  showBreadcrumbs = true,
  className = "min-h-screen flex flex-col bg-gradient-to-br from-background to-primary/5"
}) => {
  return (
    <div className={className}>
      <Header />
      {showBreadcrumbs && <Breadcrumbs />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default PageLayout;
