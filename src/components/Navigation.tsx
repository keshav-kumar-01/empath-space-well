
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Calendar, BookOpen, Users, Shield, Brain } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Chat', icon: MessageSquare },
    { path: '/ai-features', label: 'AI Features', icon: Brain },
    { path: '/mood-tracker', label: 'Mood', icon: Heart },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/crisis-support', label: 'Crisis', icon: Shield },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-white/50 dark:border-slate-700/50 z-50 md:hidden">
      <div className="flex justify-around items-center py-2 px-4">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  isActive 
                    ? 'text-chetna-primary bg-chetna-primary/10' 
                    : 'text-muted-foreground hover:text-chetna-primary'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
