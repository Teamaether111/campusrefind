import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Map, 
  SlidersHorizontal, 
  X, 
  ArrowUpDown,
  Tag,
  Building2,
  Calendar
} from 'lucide-react';
import { CampusItem, Category, CampusBuildingId } from '../types';
import { CAMPUS_LOCATIONS } from '../data/mockData';
import { ItemCard } from '../components/ItemCard';
import { CampusMap } from '../components/CampusMap';

interface Props {
  items: CampusItem[];
  initialSearchQuery?: string;
  initialLocationFilter?: CampusBuildingId | null;
  onViewDetails: (item: CampusItem) => void;
  onInitiateClaim: (item: CampusItem) => void;
}

const CATEGORIES: ('All' | Category)[] = [
  'All',
  'Electronics',
  'Student ID Cards',
  'Books & Notebooks',
  'Stationery',
  'Bags',
  'Accessories',
  'Personal Belongings',
];

export const ExploreScreen: React.FC<Props> = ({
  items,
  initialSearchQuery = '',
  initialLocationFilter = null,
  onViewDetails,
  onInitiateClaim,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [typeFilter, setTypeFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocationFilter || 'all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Sync if initial props change
  React.useEffect(() => {
    if (initialSearchQuery) setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  React.useEffect(() => {
    if (initialLocationFilter) setSelectedLocation(initialLocationFilter);
  }, [initialLocationFilter]);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Type filter
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

      // Location filter
      if (selectedLocation !== 'all' && item.locationId !== selectedLocation) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesLoc = item.locationDetail.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });
  }, [items, typeFilter, selectedCategory, selectedLocation, searchQuery, sortBy]);

  const activeFiltersCount = 
    (typeFilter !== 'all' ? 1 : 0) + 
    (selectedCategory !== 'All' ? 1 : 0) + 
    (selectedLocation !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setTypeFilter('all');
    setSelectedCategory('All');
    setSelectedLocation('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Search & Map Switch Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore Campus Lost & Found
            </h1>
            <p className="text-xs text-slate-500">
              Browse, filter, and trace belongings reported across university grounds
            </p>
          </div>

          {/* Toggle between Grid/List and Interactive Campus Map */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Listings
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Campus Map</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Filters Trigger */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location, or brand..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFiltersModal(true)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition shrink-0 ${
              activeFiltersCount > 0
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Lost / Found Segmented Control */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setTypeFilter('lost')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                typeFilter === 'lost'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Lost ({items.filter(i => i.type === 'lost').length})</span>
            </button>
            <button
              onClick={() => setTypeFilter('found')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                typeFilter === 'found'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Found ({items.filter(i => i.type === 'found').length})</span>
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 ml-auto text-xs text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Horizontal Category Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Area: Either Campus Map OR Items Grid */}
      {viewMode === 'map' ? (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
          <CampusMap
            items={items}
            onSelectItem={onViewDetails}
            onExploreLocation={(locId) => {
              setSelectedLocation(locId);
              setViewMode('list');
            }}
          />
        </div>
      ) : (
        <>
          {/* Active Filter Chips Bar */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
              <span className="text-slate-400 font-medium">Active filters:</span>
              {selectedLocation !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-medium flex items-center gap-1 border border-blue-200">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span>{CAMPUS_LOCATIONS.find(l => l.id === selectedLocation)?.name}</span>
                  <button onClick={() => setSelectedLocation('all')} className="ml-1 hover:text-blue-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium flex items-center gap-1">
                  <span>{selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('All')} className="ml-1 hover:text-slate-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline underline-offset-2 ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              Showing <strong className="text-slate-800 font-bold tabular-nums">{filteredItems.length}</strong> items
            </span>
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No matching campus items found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters, checking different spelling, or exploring the interactive campus map.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onViewDetails={onViewDetails}
                  onQuickClaim={onInitiateClaim}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Slide-over / Modal for Location & Advanced Filters */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                Filter Feed
              </h3>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Location Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Campus Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              >
                <option value="all">All Campus Locations</option>
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as 'All' | Category)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Direction */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Sort By Date</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  resetFilters();
                  setShowFiltersModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
