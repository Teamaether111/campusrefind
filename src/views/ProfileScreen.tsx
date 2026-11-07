import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  RotateCcw,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CampusItem, Claim, ClaimStatus } from '../types';
import { UserProfile } from '../utils/storage';

interface Props {
  user: UserProfile;
  items: CampusItem[];
  claims: Claim[];
  onViewItemDetails: (item: CampusItem) => void;
  onUpdateClaimStatus: (claimId: string, newStatus: ClaimStatus, notes?: string) => void;
  onResetDemo: () => void;
  onNavigateToReport: () => void;
}

export const ProfileScreen: React.FC<Props> = ({
  user,
  items,
  claims,
  onViewItemDetails,
  onUpdateClaimStatus,
  onResetDemo,
  onNavigateToReport,
}) => {
  const [activeTab, setActiveTab] = useState<'claims' | 'reports' | 'security_desk'>('claims');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  // My reported items
  const myReports = items.filter(i => i.isUserItem || i.reporterEmail === user.email);

  // Status badge helper
  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'Approved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
      case 'Recovered':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Recovered</span>;
      case 'Under Review':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><Clock className="w-3 h-3" /> Under Review</span>;
      case 'Rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  return (
    <div className="space-y-5 pb-8 max-w-2xl mx-auto">
      {/* Student Identity Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-blue-950 text-white font-extrabold text-xl flex items-center justify-center shrink-0 border-2 border-blue-500/30 shadow-xs">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Roll No: {user.rollNo}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                {user.department} · {user.semester}
              </p>
            </div>
          </div>

          {/* Campus Trust Score */}
          <div className="sm:text-right bg-blue-50/70 p-3 rounded-2xl border border-blue-100 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block">
              Campus Trust Score
            </span>
            <div className="flex items-baseline gap-1 mt-0.5 sm:justify-end">
              <span className="text-2xl font-black text-blue-600 tabular-nums">
                {user.trustScore}
              </span>
              <span className="text-xs text-blue-900/60 font-semibold">/100</span>
            </div>
            <span className="text-[10px] text-blue-700 block mt-0.5">
              Top 2% reliable campus finder
            </span>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{user.phone}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl">
        <button
          onClick={() => setActiveTab('claims')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'claims'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Claims ({claims.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'reports'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Reports ({myReports.length})
        </button>
        <button
          onClick={() => setActiveTab('security_desk')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'security_desk'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Security Desk
        </button>
      </div>

      {/* Tab 1: Claims Workflow & Status Tracking */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tracking status for filed ownership claims</span>
            <span className="font-semibold text-slate-700">Central Verification Gate 1</span>
          </div>

          {claims.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No active claims filed yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Found your lost belongings in Explore or SmartMatch? Tap "Claim Belonging" to submit ownership proof.
              </p>
            </div>
          ) : (
            claims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={claim.itemImageUrl}
                      alt={claim.itemTitle}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Claim #{claim.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {claim.itemTitle}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        Submitted: {new Date(claim.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">{getStatusBadge(claim.status)}</div>
                </div>

                {/* Handover location instructions */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pickup Location:</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{claim.handoverLocation}</p>
                </div>

                {/* Answers inspection toggle */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedClaim(selectedClaim?.id === claim.id ? null : claim)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {selectedClaim?.id === claim.id ? 'Hide Submitted Proof' : 'View Submitted Proof →'}
                  </button>

                  {/* Interactive status transition for testing claim approval */}
                  <div className="flex items-center gap-1.5">
                    {claim.status === 'Under Review' && (
                      <button
                        onClick={() => onUpdateClaimStatus(claim.id, 'Approved', 'Verification answers confirmed at desk.')}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                      >
                        Simulate Approval
                      </button>
                    )}
                    {claim.status === 'Approved' && (
                      <button
                        onClick={() => onUpdateClaimStatus(claim.id, 'Recovered', 'Item physically handed over to student.')}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Mark Recovered
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Answers */}
                {selectedClaim?.id === claim.id && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2 text-xs animate-in fade-in duration-150">
                    <span className="font-bold text-blue-950 block">Your Private Responses:</span>
                    {claim.answers.map((ans, i) => (
                      <div key={i} className="space-y-0.5">
                        <p className="font-semibold text-slate-700 text-[11px]">{ans.question}</p>
                        <p className="text-slate-600 bg-white p-2 rounded-lg border border-slate-200/80 text-[11px]">
                          {ans.userAnswer}
                        </p>
                      </div>
                    ))}
                    {claim.additionalProof && (
                      <div className="pt-1">
                        <span className="font-semibold text-slate-700 text-[11px]">Extra notes:</span>
                        <p className="text-slate-600 text-[11px] italic">{claim.additionalProof}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: My Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Items reported by you on ReFind</span>
            <button
              onClick={onNavigateToReport}
              className="font-bold text-blue-600 hover:text-blue-800"
            >
              + File New Report
            </button>
          </div>

          {myReports.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
              <h3 className="text-base font-bold text-slate-800">You haven't filed any reports yet</h3>
              <p className="text-xs text-slate-500">
                Report a lost personal belonging or register an item you found on campus.
              </p>
              <button
                onClick={onNavigateToReport}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Report Item
              </button>
            </div>
          ) : (
            myReports.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        item.type === 'lost' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-400">{item.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{item.locationDetail}</p>
                  </div>
                </div>

                <button
                  onClick={() => onViewItemDetails(item)}
                  className="shrink-0 p-2 text-slate-400 hover:text-blue-600 transition"
                  title="View Item"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Security Desk & Central Lost & Found Contact */}
      {activeTab === 'security_desk' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Campus Security Lost & Found Desk</h3>
              <p className="text-xs text-slate-500">Official university repository for lost property</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Physical Location:</span>
                <span>Main Gate 1 Checkpost, Ground Floor Security Control Room</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Operating Hours:</span>
                <span>Monday – Saturday: 08:30 AM – 06:30 PM (Closed on University Holidays)</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Campus Hotline:</span>
                <span className="font-mono text-slate-900 font-semibold">+91 11 2659 1000 / Ext 4412</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold block">Physical Handover Policy:</span>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Found high-value electronics (phones, calculators, laptops, wallets) must be deposited within 24 hours. Claimants must show their official College RFID Smart Card for identity verification upon pickup.
            </p>
          </div>
        </div>
      )}

      {/* Demo Controls Section */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-400">Testing & Reset Utilities</span>
        <button
          onClick={onResetDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
