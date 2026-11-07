import React from 'react';
import { MapPin, Calendar, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { CampusItem } from '../types';

interface Props {
  item: CampusItem;
  onViewDetails: (item: CampusItem) => void;
  onQuickClaim?: (item: CampusItem) => void;
}

export const ItemCard: React.FC<Props> = ({ item, onViewDetails, onQuickClaim }) => {
  const isLost = item.type === 'lost';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image Container with Badges */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Elegant CSS/SVG Fallback
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="%23f1f5f9"><rect width="400" height="300" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%2394a3b8">Campus Item Photo</text></svg>';
          }}
        />

        {/* Status Chip */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs ${
              isLost
                ? 'bg-rose-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {item.type}
          </span>
          {item.status === 'claimed' && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500 text-white">
              Claim in Progress
            </span>
          )}
          {item.status === 'recovered' && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-600 text-white flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Recovered
            </span>
          )}
        </div>

        {/* Category Pill Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/75 backdrop-blur-xs text-white">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Date & Location */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.date}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{item.locationDetail.split(',')[0]}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Action Bottom Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onViewDetails(item)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-98 transition"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {!isLost && item.status !== 'recovered' && onQuickClaim && (
            <button
              onClick={() => onQuickClaim(item)}
              className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1 active:scale-98 transition shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Claim</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
