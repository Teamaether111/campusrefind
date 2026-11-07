import React from 'react';
import { 
  Search, 
  HelpCircle, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  MapPin,
  CheckCircle2,
  Package
} from 'lucide-react';
import { CampusItem, SmartMatchPair, CampusActivity } from '../types';
import { ItemCard } from '../components/ItemCard';
import { SmartMatchCard } from '../components/SmartMatchCard';
import { UserProfile } from '../utils/storage';
import { PWAInstallButton } from '../components/PWAInstallButton';

interface Props {
  user: UserProfile;
  items: CampusItem[];
  smartMatches: SmartMatchPair[];
  activities: CampusActivity[];
  onNavigateTab: (tab: 'home' | 'explore' | 'report' | 'matches' | 'profile') => void;
  onStartReport: (type: 'lost' | 'found') => void;
  onSearchQuery: (query: string) => void;
  onViewItemDetails: (item: CampusItem) => void;
  onInitiateClaim: (item: CampusItem) => void;
}

export const HomeScreen: React.FC<Props> = ({
  user,
  items,
  smartMatches,
  activities,
  onNavigateTab,
  onStartReport,
  onSearchQuery,
  onViewItemDetails,
  onInitiateClaim,
}) => {
  const [searchInput, setSearchInput] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchQuery(searchInput.trim());
      onNavigateTab('explore');
    }
  };

  // Calculations for stats
  const totalReported = items.length + 42; // realistic campus total
  const totalRecovered = items.filter(i => i.status === 'recovered').length + 38;
  const activeListings = items.filter(i => i.status !== 'recovered').length;

  const recentItems = items.slice(0, 4);
  const featuredMatch = smartMatches[0];

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Greeting & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hey, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Let's reunite lost things with their owners.
          </p>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5 self-start sm:self-auto bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-700">Verified Campus Network</span>
        </div>
      </div>

      {/* Hero Campus Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white shadow-md">
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src="/src/assets/images/refind_hero_banner_1794074126903.jpg"
            alt="Campus Quad"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-5 sm:p-7 max-w-2xl">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30 mb-2">
            ReFind Campus
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            "Lost it on campus? Let's bring it back."
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 leading-relaxed">
            Report missing items, explore found belongings logged at campus security, and match reports with transparent SmartMatch.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for your lost belongings (e.g. calculator, AirPods, ID card)..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {/* Quick Action Cards: I Lost Something & I Found Something */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* I Lost Something */}
        <button
          onClick={() => onStartReport('lost')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-200/80 shadow-xs hover:shadow-md hover:border-rose-400 text-left transition group active:scale-98 flex flex-col justify-between"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
              I Lost Something
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              File a lost item report & scan for matches
            </p>
          </div>
          <div className="mt-3 flex items-center text-xs font-semibold text-rose-600">
            <span>Report Lost</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* I Found Something */}
        <button
          onClick={() => onStartReport('found')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-xs hover:shadow-md hover:border-emerald-400 text-left transition group active:scale-98 flex flex-col justify-between"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              I Found Something
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Help a classmate recover their property
            </p>
          </div>
          <div className="mt-3 flex items-center text-xs font-semibold text-emerald-600">
            <span>Report Found</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Statistics Row */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            Campus Recovery Pulse
          </span>
          <span className="text-xs text-slate-500 font-medium">This Semester</span>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
          <div className="px-2">
            <p className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
              {totalReported}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Items Reported</p>
          </div>
          <div className="px-2">
            <p className="text-xl sm:text-2xl font-black text-emerald-600 tabular-nums">
              {totalRecovered}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Items Recovered</p>
          </div>
          <div className="px-2">
            <p className="text-xl sm:text-2xl font-black text-blue-600 tabular-nums">
              {activeListings}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Active Listings</p>
          </div>
        </div>
      </div>

      {/* SmartMatch Spotlight Section */}
      {featuredMatch && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  SmartMatch Detection
                </h3>
                <p className="text-xs text-slate-500">Possible matching reports detected</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('matches')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All ({smartMatches.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <SmartMatchCard
            match={featuredMatch}
            onInitiateClaim={onInitiateClaim}
            onViewDetails={onViewItemDetails}
          />
        </div>
      )}

      {/* Recently Reported Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Recently Reported Belongings
            </h3>
            <p className="text-xs text-slate-500">Latest lost & found items on campus</p>
          </div>
          <button
            onClick={() => onNavigateTab('explore')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recentItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onViewDetails={onViewItemDetails}
              onQuickClaim={onInitiateClaim}
            />
          ))}
        </div>
      </div>

      {/* Campus Activity Section: Recent Recoveries */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Recent Campus Activity & Handshakes
          </h3>
          <span className="text-[11px] text-slate-400">Live Campus Feed</span>
        </div>

        <div className="space-y-2.5 divide-y divide-slate-100">
          {activities.map((act) => (
            <div key={act.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{act.itemTitle}</p>
                  <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{act.location}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {act.badge}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">{act.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PWA Promotion Card */}
      <PWAInstallButton variant="card" />
    </div>
  );
};
