import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Filter, 
  ShieldCheck, 
  Info,
  SlidersHorizontal,
  Flame,
  ArrowRight
} from 'lucide-react';
import { SmartMatchPair, CampusItem } from '../types';
import { SmartMatchCard } from '../components/SmartMatchCard';
import { UserProfile } from '../utils/storage';

interface Props {
  user: UserProfile;
  matches: SmartMatchPair[];
  onInitiateClaim: (item: CampusItem) => void;
  onViewDetails: (item: CampusItem) => void;
  onNavigateToReport: () => void;
}

export const MatchesScreen: React.FC<Props> = ({
  user,
  matches,
  onInitiateClaim,
  onViewDetails,
  onNavigateToReport,
}) => {
  const [filterScope, setFilterScope] = useState<'all' | 'my_reports'>('all');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);

  // Filter matches
  const filteredMatches = matches.filter(m => {
    if (filterScope === 'my_reports') {
      const isMyLost = m.lostItem.reporterEmail === user.email || m.lostItem.isUserItem;
      const isMyFound = m.foundItem.reporterEmail === user.email || m.foundItem.isUserItem;
      if (!isMyLost && !isMyFound) return false;
    }
    if (m.totalScore < minScoreFilter) return false;
    return true;
  });

  const highConfidenceCount = matches.filter(m => m.totalScore >= 80).length;

  return (
    <div className="space-y-5 pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              SmartMatch Engine v1.0
            </span>
            <span className="text-xs text-slate-300">Deterministic Rule-Based</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Automated Lost & Found Cross-Matching
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Compares keywords, campus buildings, reporting dates, and item categories to detect likely matches across student reports.
          </p>
        </div>

        {/* Micro Scoreboard */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Total Potential Matches:</span>
            <span className="text-base font-bold text-white tabular-nums">{matches.length} pairs</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">High Confidence (≥80%):</span>
            <span className="text-base font-bold text-emerald-400 tabular-nums">{highConfidenceCount} detected</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-slate-400 block text-[11px]">Matching Basis:</span>
            <span className="text-xs font-semibold text-blue-300">Keywords · Location · Date</span>
          </div>
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Scope selector */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setFilterScope('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterScope === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Campus Matches ({matches.length})
          </button>
          <button
            onClick={() => setFilterScope('my_reports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              filterScope === 'my_reports'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Lost Belongings</span>
          </button>
        </div>

        {/* Confidence filter tabs */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium text-[11px] hidden sm:inline">Score:</span>
          <button
            onClick={() => setMinScoreFilter(0)}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              minScoreFilter === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Scores
          </button>
          <button
            onClick={() => setMinScoreFilter(75)}
            className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
              minScoreFilter === 75 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>≥75%</span>
          </button>
          <button
            onClick={() => setMinScoreFilter(90)}
            className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
              minScoreFilter === 90 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>≥90% High</span>
          </button>
        </div>
      </div>

      {/* Explanatory Note on Algorithm Transparency */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-800">Deterministic Scoring Logic</p>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            SmartMatch scores are computed transparently based on matching category taxonomy (+30%), textual title & description keyword overlap (+40%), physical campus location proximity (+20%), and report date alignment (+10%).
          </p>
        </div>
      </div>

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching pairs meet this criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterScope === 'my_reports'
              ? "You haven't reported any lost items that match currently found listings, or match score is below filter threshold."
              : 'Try clearing the minimum score filter to inspect moderate confidence pairs.'}
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToReport}
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
            >
              Report a Missing Item
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((pair) => (
            <SmartMatchCard
              key={pair.id}
              match={pair}
              onInitiateClaim={onInitiateClaim}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
