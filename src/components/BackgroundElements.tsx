
import React, { memo } from "react";

const BackgroundElements: React.FC = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform">
    <div className="absolute top-20 left-10 w-60 h-60 bg-gradient-to-br from-violet-400/20 to-purple-600/20 dark:from-violet-500/30 dark:to-purple-700/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
    <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
    <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-gradient-to-br from-emerald-400/15 to-teal-500/15 dark:from-emerald-500/25 dark:to-teal-600/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
    <div className="absolute bottom-20 right-10 w-52 h-52 bg-gradient-to-br from-pink-400/20 to-rose-500/20 dark:from-pink-500/30 dark:to-rose-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '3s' }}></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300/10 to-purple-400/10 dark:from-indigo-400/20 dark:to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1.5s' }}></div>
  </div>
));

BackgroundElements.displayName = 'BackgroundElements';

export default BackgroundElements;
