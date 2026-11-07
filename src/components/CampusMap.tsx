import React, { useState } from 'react';
import { 
  Building2, 
  BookOpen, 
  Coffee, 
  Monitor, 
  Drama, 
  Trophy, 
  Home, 
  ShieldCheck, 
  MapPin, 
  ChevronRight, 
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CampusItem, CampusLocation, CampusBuildingId } from '../types';
import { CAMPUS_LOCATIONS } from '../data/mockData';

interface Props {
  items: CampusItem[];
  onSelectItem: (item: CampusItem) => void;
  onExploreLocation?: (locId: CampusBuildingId) => void;
}

export const CampusMap: React.FC<Props> = ({ items, onSelectItem, onExploreLocation }) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<CampusBuildingId>('library');
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');

  const selectedLocation = CAMPUS_LOCATIONS.find(loc => loc.id === selectedBuildingId) || CAMPUS_LOCATIONS[0];

  // Items at selected building
  const buildingItems = items.filter(item => {
    if (item.locationId !== selectedBuildingId) return false;
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const getItemCount = (buildingId: CampusBuildingId, type?: 'lost' | 'found') => {
    return items.filter(i => {
      if (i.locationId !== buildingId) return false;
      if (!type) return true;
      return i.type === type;
    }).length;
  };

  const getBuildingIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Building2': return <Building2 className="w-4 h-4" />;
      case 'Coffee': return <Coffee className="w-4 h-4" />;
      case 'Monitor': return <Monitor className="w-4 h-4" />;
      case 'Drama': return <Drama className="w-4 h-4" />;
      case 'Trophy': return <Trophy className="w-4 h-4" />;
      case 'Home': return <Home className="w-4 h-4" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Map Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Interactive Campus Map
            </h2>
            <p className="text-xs text-slate-500">Tap any campus zone to view active lost & found items</p>
          </div>

          {/* Quick filter segmented control */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('lost')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterType === 'lost' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost
            </button>
            <button
              onClick={() => setFilterType('found')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterType === 'found' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found
            </button>
          </div>
        </div>
      </div>

      {/* Illustrative Campus Map SVG Canvas */}
      <div className="relative w-full h-80 sm:h-96 bg-[#EFF6FF] overflow-hidden select-none border-b border-slate-200">
        {/* Background Stylized Campus Grid & Grounds */}
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="lawnGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DCFCE7" />
              <stop offset="100%" stopColor="#BBF7D0" />
            </linearGradient>
            <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.8" strokeOpacity="0.6"/>
            </pattern>
          </defs>

          {/* Grid pattern */}
          <rect width="1000" height="600" fill="#F8FAFC" />
          <rect width="1000" height="600" fill="url(#campusGrid)" />

          {/* Green Lawns and Campus Parks */}
          {/* Central Lawn Quad */}
          <rect x="220" y="160" width="420" height="220" rx="24" fill="url(#lawnGrad)" opacity="0.85" />
          {/* North Library Garden */}
          <circle cx="180" cy="120" r="90" fill="url(#lawnGrad)" opacity="0.7" />
          {/* Sports field */}
          <rect x="80" y="380" width="220" height="140" rx="30" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="3" />
          {/* Running track loop */}
          <rect x="100" y="400" width="180" height="100" rx="20" fill="none" stroke="#F97316" strokeWidth="3" strokeDasharray="6,4" />

          {/* University Paths / Walkways */}
          {/* Main Diagonal Boulevard */}
          <path d="M 500 580 L 500 280 L 260 200 L 160 100" fill="none" stroke="#CBD5E1" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 500 280 L 760 260 L 860 380" fill="none" stroke="#CBD5E1" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 280 200 L 280 440 L 500 480" fill="none" stroke="#CBD5E1" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />

          {/* Central Water Fountain in Quad */}
          <circle cx="430" cy="270" r="32" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="4" />
          <circle cx="430" cy="270" r="14" fill="#38BDF8" />
          <circle cx="430" cy="270" r="4" fill="#FFFFFF" />

          {/* Trees cluster decorations */}
          <g fill="#22C55E" opacity="0.65">
            <circle cx="270" cy="140" r="14" />
            <circle cx="295" cy="150" r="12" />
            <circle cx="340" cy="180" r="10" />
            <circle cx="620" cy="190" r="15" />
            <circle cx="645" cy="205" r="12" />
            <circle cx="480" cy="360" r="14" />
            <circle cx="510" cy="370" r="12" />
            <circle cx="680" cy="460" r="16" />
          </g>

          {/* Stylized Building Footprint Blocks */}
          {/* Library */}
          <rect x="160" y="70" width="160" height="110" rx="14" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
          {/* Main Academic Building */}
          <rect x="420" y="60" width="220" height="120" rx="14" fill="#FFFFFF" stroke="#1E3A8A" strokeWidth="4" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
          {/* Canteen & Cafeteria */}
          <rect x="680" y="160" width="160" height="110" rx="14" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
          {/* CS & Engineering Labs */}
          <rect x="220" y="320" width="180" height="120" rx="14" fill="#FFFFFF" stroke="#6366F1" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
          {/* Auditorium */}
          <path d="M 720 360 L 880 340 L 920 460 L 760 480 Z" fill="#FFFFFF" stroke="#EC4899" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
          {/* Security Gate 1 */}
          <rect x="440" y="520" width="120" height="60" rx="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
        </svg>

        {/* Interactive Hotspot Overlay Pins */}
        {CAMPUS_LOCATIONS.map((loc) => {
          const isSelected = loc.id === selectedBuildingId;
          const count = getItemCount(loc.id, filterType === 'all' ? undefined : filterType);

          return (
            <button
              key={loc.id}
              onClick={() => setSelectedBuildingId(loc.id)}
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 z-10 flex flex-col items-center ${
                isSelected ? 'scale-110 z-20' : 'hover:scale-105'
              }`}
            >
              {/* Badge pin */}
              <div
                className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-full shadow-md text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-900 text-white ring-4 ring-blue-500/30'
                    : 'bg-white text-slate-800 border border-slate-200 hover:border-blue-400'
                }`}
              >
                <span className={isSelected ? 'text-blue-300' : 'text-blue-600'}>
                  {getBuildingIcon(loc.iconName)}
                </span>
                <span className="hidden sm:inline max-w-[100px] truncate">{loc.name}</span>
                {count > 0 && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </div>

              {/* Pin point anchor */}
              <div
                className={`w-2 h-2 rounded-full -mt-0.5 ${
                  isSelected ? 'bg-blue-900 ring-2 ring-white' : 'bg-slate-400'
                }`}
              />
            </button>
          );
        })}

        {/* Map Legend Overlay */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-200/80 shadow-xs text-[10px] text-slate-600 flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span> Selected Zone
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span> Campus Landmark
          </span>
        </div>
      </div>

      {/* Selected Building Details Drawer */}
      <div className="p-4 bg-white flex-1 overflow-y-auto">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                {getBuildingIcon(selectedLocation.iconName)}
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedLocation.name}</h3>
                <span className="text-xs text-slate-500">{selectedLocation.zone}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">{selectedLocation.description}</p>
          </div>

          {onExploreLocation && (
            <button
              onClick={() => onExploreLocation(selectedLocation.id)}
              className="shrink-0 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
            >
              Filter Feed
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Count Stats Bar */}
        <div className="grid grid-cols-2 gap-2 my-3 p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs">
          <div className="flex items-center justify-between px-2">
            <span className="text-slate-500">Lost Reports:</span>
            <span className="font-bold text-rose-600 tabular-nums">
              {getItemCount(selectedLocation.id, 'lost')}
            </span>
          </div>
          <div className="flex items-center justify-between px-2 border-l border-slate-200">
            <span className="text-slate-500">Found Items:</span>
            <span className="font-bold text-emerald-600 tabular-nums">
              {getItemCount(selectedLocation.id, 'found')}
            </span>
          </div>
        </div>

        {/* Items List at this Location */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">
              Items Reported at {selectedLocation.name} ({buildingItems.length})
            </span>
          </div>

          {buildingItems.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
              <p className="text-xs text-slate-400">No {filterType !== 'all' ? filterType : ''} items recorded at this building yet.</p>
            </div>
          ) : (
            buildingItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          item.type === 'lost'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-400 truncate">{item.category}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{item.locationDetail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 text-slate-400 group-hover:text-blue-600 pl-2">
                  <span className="text-xs font-medium hidden sm:inline">Details</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
