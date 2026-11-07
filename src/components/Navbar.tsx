import React from 'react';
import { Bell, Sparkles, PlusCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { PWAInstallButton } from './PWAInstallButton';
import { UserProfile } from '../utils/storage';

interface Props {
  activeTab: 'home' | 'explore' | 'report' | 'matches' | 'profile';
  onTabChange: (tab: 'home' | 'explore' | 'report' | 'matches' | 'profile') => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  matchesCount: number;
  user: UserProfile;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  unreadCount,
  onOpenNotifications,
  matchesCount,
  user,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <button
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2 text-left focus:outline-none"
        >
          <BrandLogo size="md" />
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onTabChange('home')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'home'
                ? 'bg-slate-100 text-blue-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onTabChange('explore')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'explore'
                ? 'bg-slate-100 text-blue-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => onTabChange('matches')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'matches'
                ? 'bg-blue-50 text-blue-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>SmartMatch</span>
            {matchesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                {matchesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange('profile')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'profile'
                ? 'bg-slate-100 text-blue-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            My Activity
          </button>
        </nav>

        {/* Actions Zone: Notifications, PWA Install & Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="hidden sm:block">
            <PWAInstallButton variant="compact" />
          </div>

          {/* Desktop Prominent Report CTA */}
          <button
            onClick={() => onTabChange('report')}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Item</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Student Profile Avatar */}
          <button
            onClick={() => onTabChange('profile')}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-slate-200 hover:border-slate-300 transition bg-slate-50"
            title="View Student Profile"
          >
            <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-800">
              {user.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
