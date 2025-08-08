
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Calendar, BookOpen, Users, Shield, Brain } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Chat', icon: MessageSquare },
    { path: '/ai-features', label: 'AI', icon: Brain },
    { path: '/mood-tracker', label: 'Mood', icon: Heart },
    { path: '/appointments', label: 'Book', icon: Calendar },
    { path: '/resources', label: 'Help', icon: BookOpen },
    { path: '/crisis-support', label: 'Crisis', icon: Shield },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 z-50 md:hidden safe-area-inset-bottom">
      <div className="flex justify-around items-center py-1 px-2 max-w-screen-sm mx-auto">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center justify-center gap-0.5 h-12 w-full py-1 px-1 min-w-0 ${
                  isActive 
                    ? 'text-chetna-primary bg-chetna-primary/10 border-t-2 border-chetna-primary' 
                    : 'text-slate-600 hover:text-chetna-primary dark:text-slate-400 dark:hover:text-chetna-primary hover:bg-chetna-primary/5'
                }`}
              >
                <IconComponent className="h-4 w-4 shrink-0" />
                <span className="text-xs font-medium leading-tight truncate w-full text-center">
                  {item.label}
                </span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
