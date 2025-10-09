
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];
    
    const routeLabels: Record<string, string> = {
      'about': 'About',
      'blog': 'Blog',
      'community': 'Community',
      'journal': 'Journal',
      'mood-tracker': 'Mood Tracker',
      'appointments': 'Appointments',
      'resources': 'Resources',
      'crisis-support': 'Crisis Support',
      'quiz': 'Psychological Tests',
      'psych-tests': 'Test',
      'feedback': 'Feedback',
      'privacy': 'Privacy Policy',
      'terms': 'Terms of Service',
      'login': 'Login',
      'signup': 'Sign Up',
      'settings': 'Settings',
      'profile': 'Profile'
    };
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      if (index === pathSegments.length - 1) {
        // Last item is current page (no link)
        breadcrumbs.push({ label });
      } else {
        breadcrumbs.push({ label, href: currentPath });
      }
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  if (breadcrumbs.length <= 1) return null;
  
  return (
    <nav aria-label="Breadcrumb" className="mb-6 px-4">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground max-w-7xl mx-auto">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 mx-2" aria-hidden="true" />}
              {item.href ? (
                <Link
                  to={item.href}
                  className="hover:text-chetna-primary transition-colors flex items-center min-h-[32px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-1"
                  aria-label={index === 0 ? 'Go to home page' : `Go to ${item.label}`}
                >
                  {index === 0 && <Home className="w-4 h-4 mr-1" aria-hidden="true" />}
                  {item.label}
                </Link>
              ) : (
                <span 
                  className="text-foreground font-medium flex items-center"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {index === 0 && <Home className="w-4 h-4 mr-1" aria-hidden="true" />}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
