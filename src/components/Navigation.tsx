
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Calendar, BookOpen, Users, Shield, Brain, Settings, Stethoscope } from 'lucide-react';
import { useTherapistAuth } from '@/context/TherapistAuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isTherapist } = useTherapistAuth();

  const navigationItems = [
    { path: '/', label: 'Chat', icon: MessageSquare },
    { path: '/ai-features', label: 'AI', icon: Brain },
    { path: '/mood-tracker', label: 'Mood', icon: Heart },
    isTherapist 
      ? { path: '/therapist-dashboard', label: 'Dashboard', icon: Stethoscope }
      : { path: '/appointments', label: 'Book', icon: Calendar },
    { path: '/resources', label: 'Help', icon: BookOpen },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 z-50 md:hidden safe-area-inset-bottom shadow-lg" aria-label="Mobile bottom navigation">
      <div className="flex justify-around items-center py-1 px-1 max-w-screen-sm mx-auto" role="navigation">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className="flex-1 max-w-[16.66%]"
              aria-label={`Navigate to ${item.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center justify-center gap-0.5 h-14 w-full py-1 px-1 min-w-0 min-h-[56px] rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isActive 
                    ? 'text-chetna-primary bg-chetna-primary/10 border-t-2 border-chetna-primary shadow-sm scale-105' 
                    : 'text-slate-600 hover:text-chetna-primary dark:text-slate-400 dark:hover:text-chetna-primary hover:bg-chetna-primary/5 hover:scale-102'
                }`}
                aria-label={`${item.label} ${isActive ? '(current page)' : ''}`}
              >
                <IconComponent className={`h-5 w-5 shrink-0 ${isActive ? 'animate-pulse' : ''}`} aria-hidden="true" />
                <span className={`text-xs font-medium leading-tight truncate w-full text-center ${
                  isActive ? 'font-semibold' : ''
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 bg-chetna-primary rounded-full mt-0.5" aria-hidden="true"></div>
                )}
              </Button>
            </Link>
          );
        })}
      </div>
      
      {/* Add a subtle gradient overlay for better visual separation */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent dark:via-slate-600/50"></div>
    </nav>
  );
};

export default Navigation;
