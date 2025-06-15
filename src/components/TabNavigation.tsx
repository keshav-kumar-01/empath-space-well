
import React, { memo } from "react";
import { MessageSquare, Users, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface TabNavigationProps {
  activeTab: 'chat' | 'community';
  setActiveTab: (tab: 'chat' | 'community') => void;
  t: any;
}

const TabNavigation: React.FC<TabNavigationProps> = memo(({ activeTab, setActiveTab, t }) => (
  <div className="flex justify-center mb-8 relative">
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-3 shadow-xl border border-white/50 dark:border-slate-700/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-blue-500/5 dark:from-violet-400/10 dark:via-transparent dark:to-blue-400/10"></div>
      
      <div className="flex space-x-2 relative z-10">
        <Button
          variant={activeTab === 'chat' ? 'default' : 'ghost'}
          className={`rounded-xl px-8 py-4 transition-all duration-300 font-medium will-change-transform ${
            activeTab === 'chat' 
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25 dark:shadow-violet-400/25 transform scale-105 text-white' 
              : 'hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-900/20 dark:hover:to-purple-900/20 text-slate-700 dark:text-slate-300 hover:text-violet-700 dark:hover:text-violet-300'
          }`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare className="mr-3 h-5 w-5" />
          {t('intro.chatWithChetna')}
          {activeTab === 'chat' && <Sparkles className="ml-3 h-5 w-5 animate-pulse" />}
        </Button>
        
        <Link to="/community">
          <Button 
            variant="ghost" 
            className="rounded-xl px-8 py-4 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 font-medium will-change-transform"
          >
            <Users className="mr-3 h-5 w-5" />
            {t('intro.community')}
          </Button>
        </Link>
        
        <Link to="/quiz">
          <Button 
            variant="ghost" 
            className="rounded-xl px-8 py-4 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 hover:text-amber-700 dark:hover:text-amber-300 transition-all duration-300 font-medium will-change-transform"
          >
            <Star className="mr-3 h-5 w-5" />
            {t('intro.chetnaQuest')}
          </Button>
        </Link>
      </div>
    </div>
  </div>
));

TabNavigation.displayName = 'TabNavigation';

export default TabNavigation;
