import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Info,
  ChevronDown,
  ChevronUp,
  Building2,
  Clock
} from 'lucide-react';
import { SmartMatchPair, CampusItem } from '../types';

interface Props {
  match: SmartMatchPair;
  onInitiateClaim: (item: CampusItem) => void;
  onViewDetails: (item: CampusItem) => void;
}

export const SmartMatchCard: React.FC<Props> = ({ 
  match, 
  onInitiateClaim,
  onViewDetails 
}) => {
  const [showReasons, setShowReasons] = useState(false);
  const { lostItem, foundItem, totalScore, reasons } = match;

  // Color scale for score
  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', ring: 'text-emerald-600', fill: '#16A34A' };
    if (score >= 75) return { bg: 'bg-blue-50 text-blue-700 border-blue-200', ring: 'text-blue-600', fill: '#2563EB' };
    return { bg: 'bg-amber-50 text-amber-700 border-amber-200', ring: 'text-amber-600', fill: '#F59E0B' };
  };

  const scoreTheme = getScoreColor(totalScore);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Top Match Header Bar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-wide uppercase text-slate-200">
            SmartMatch Comparison
          </span>
        </div>

        {/* Score Pill */}
        <div className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 border ${scoreTheme.bg}`}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: scoreTheme.fill }} />
          <span>{totalScore}% Match Score</span>
        </div>
      </div>

      {/* Side-by-Side Comparison Container */}
      <div className="p-4 grid grid-cols-2 gap-3 border-b border-slate-100 bg-slate-50/50">
        {/* Left: Lost Item */}
        <div className="flex flex-col bg-white p-3 rounded-xl border border-rose-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              Lost Report
            </span>
            <span className="text-[10px] text-slate-400">{lostItem.date}</span>
          </div>

          <div className="aspect-4/3 w-full bg-slate-100 rounded-lg overflow-hidden mb-2 relative">
            <img
              src={lostItem.imageUrl}
              alt={lostItem.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150" fill="%23f1f5f9"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%2394a3b8">Lost Item</text></svg>';
              }}
            />
          </div>

          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
            {lostItem.title}
          </h4>
          <p className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{lostItem.locationDetail.split(',')[0]}</span>
          </p>
          <button
            onClick={() => onViewDetails(lostItem)}
            className="mt-2 text-[11px] font-semibold text-rose-600 hover:text-rose-800 text-left"
          >
            Inspect Lost Report →
          </button>
        </div>

        {/* Right: Found Item */}
        <div className="flex flex-col bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Found Item
            </span>
            <span className="text-[10px] text-slate-400">{foundItem.date}</span>
          </div>

          <div className="aspect-4/3 w-full bg-slate-100 rounded-lg overflow-hidden mb-2 relative">
            <img
              src={foundItem.imageUrl}
              alt={foundItem.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150" fill="%23f1f5f9"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%2394a3b8">Found Item</text></svg>';
              }}
            />
          </div>

          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
            {foundItem.title}
          </h4>
          <p className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{foundItem.locationDetail.split(',')[0]}</span>
          </p>
          <button
            onClick={() => onViewDetails(foundItem)}
            className="mt-2 text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 text-left"
          >
            Inspect Found Item →
          </button>
        </div>
      </div>

      {/* Transparent Match Reasons Section */}
      <div className="p-4 bg-white space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            Transparent Match Factors
          </span>
          <button
            onClick={() => setShowReasons(!showReasons)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <span>{showReasons ? 'Hide Details' : 'View Breakdown'}</span>
            {showReasons ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Highlight Summary Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {reasons.slice(0, 3).map((r, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1"
            >
              <Check className="w-3 h-3 text-emerald-600" />
              <span>{r.label}</span>
            </span>
          ))}
        </div>

        {/* Detailed Expandable Reasons */}
        {showReasons && (
          <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-xs animate-in fade-in duration-150">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800">{reason.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{reason.explanation}</p>
                </div>
                <span className="text-[11px] font-mono font-bold text-blue-700 shrink-0">
                  +{reason.score}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(foundItem)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 transition"
          >
            <span>View Match</span>
          </button>

          <button
            onClick={() => onInitiateClaim(foundItem)}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs active:scale-98"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Submit Claim</span>
          </button>
        </div>
      </div>
    </div>
  );
};
