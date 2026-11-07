import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  User, 
  AlertCircle, 
  CheckCircle2,
  Building2,
  Share2
} from 'lucide-react';
import { CampusItem } from '../types';
import { CAMPUS_LOCATIONS } from '../data/mockData';

interface Props {
  item: CampusItem | null;
  onClose: () => void;
  onInitiateClaim: (item: CampusItem) => void;
  onFindMatches?: (item: CampusItem) => void;
}

export const ItemDetailModal: React.FC<Props> = ({ 
  item, 
  onClose, 
  onInitiateClaim,
  onFindMatches 
}) => {
  if (!item) return null;

  const isLost = item.type === 'lost';
  const building = CAMPUS_LOCATIONS.find(b => b.id === item.locationId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col relative">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition active:scale-90"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {/* Header Image with Overlay */}
          <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%23f1f5f9"><rect width="600" height="400" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%2394a3b8">Photo unavailable</text></svg>';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-3 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    isLost ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {item.type}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/20 backdrop-blur-xs">
                  {item.category}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold leading-snug drop-shadow-xs">
                {item.title}
              </h2>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-4 sm:p-6 space-y-5">
            {/* Metadata Pills */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5 font-medium">Date {isLost ? 'Lost' : 'Found'}</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{item.date}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5 font-medium">Campus Location</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 truncate">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="truncate">{building ? building.name : item.locationDetail}</span>
                </div>
              </div>
            </div>

            {/* Exact Location Detail */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold block text-blue-950">Specific Spot Description:</span>
                <span>{item.locationDetail}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Item Description
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                {item.description}
              </p>
            </div>

            {/* Reporter Info */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Reported By
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm shrink-0">
                  {item.reporterName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.reporterName}</p>
                  <p className="text-xs text-slate-500">
                    {item.reporterRollNo ? `Roll No: ${item.reporterRollNo} · ` : ''}Verified Campus Reporter
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Security Notice */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Protected Ownership Verification</p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  To prevent fraudulent claims, claimants must answer specific private ownership questions set by the finder or campus authority before pickup.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom CTA Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2.5 shrink-0">
          {onFindMatches && (
            <button
              onClick={() => {
                onClose();
                onFindMatches(item);
              }}
              className="flex-1 py-3 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-98 transition"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>SmartMatch Scan</span>
            </button>
          )}

          {!isLost && item.status !== 'recovered' && (
            <button
              onClick={() => {
                onClose();
                onInitiateClaim(item);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Claim Belonging</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
