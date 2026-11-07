import React from 'react';
import { Home, Compass, Plus, Sparkles, User } from 'lucide-react';

interface Props {
  activeTab: 'home' | 'explore' | 'report' | 'matches' | 'profile';
  onTabChange: (tab: 'home' | 'explore' | 'report' | 'matches' | 'profile') => void;
  matchesCount: number;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onTabChange, matchesCount }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 pb-safe shadow-lg">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {/* 1. Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition ${
            activeTab === 'home' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Home</span>
        </button>

        {/* 2. Explore */}
        <button
          onClick={() => onTabChange('explore')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition ${
            activeTab === 'explore' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Explore</span>
        </button>

        {/* 3. Report (Visually Prominent Elevated Button) */}
        <div className="flex flex-col items-center justify-center -mt-5">
          <button
            onClick={() => onTabChange('report')}
            className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              activeTab === 'report'
                ? 'bg-blue-900 text-white ring-4 ring-blue-200'
                : 'bg-blue-600 text-white shadow-blue-500/30'
            }`}
            aria-label="Report lost or found item"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
          <span className="text-[10px] font-bold text-slate-800 mt-1">Report</span>
        </div>

        {/* 4. Matches */}
        <button
          onClick={() => onTabChange('matches')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] transition ${
            activeTab === 'matches' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Sparkles className={`w-5 h-5 ${activeTab === 'matches' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {matchesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 min-w-[15px] h-[15px] rounded-full text-[9px] font-extrabold bg-blue-600 text-white flex items-center justify-center ring-2 ring-white">
                {matchesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1">Matches</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition ${
            activeTab === 'profile' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};
