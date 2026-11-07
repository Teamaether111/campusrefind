import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Calendar, 
  HelpCircle, 
  Package, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Trash2, 
  Lock, 
  ArrowRight,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampusItem, Category, CampusBuildingId, VerificationQuestion } from '../types';
import { CAMPUS_LOCATIONS } from '../data/mockData';
import { UserProfile } from '../utils/storage';

interface Props {
  user: UserProfile;
  initialType?: 'lost' | 'found';
  onItemCreated: (newItem: CampusItem) => void;
  onNavigateToMatches: () => void;
  onNavigateToExplore: () => void;
}

const CATEGORIES: Category[] = [
  'Electronics',
  'Student ID Cards',
  'Books & Notebooks',
  'Stationery',
  'Bags',
  'Accessories',
  'Personal Belongings',
];

// Presets for quick realistic testing
const SAMPLE_PRESETS = [
  {
    name: 'Casio Calculator',
    url: '/src/assets/images/item_casio_calculator_1794074127715.jpg',
    category: 'Electronics' as Category,
  },
  {
    name: 'AirPods Case',
    url: '/src/assets/images/item_airpods_case_1794074128307.jpg',
    category: 'Electronics' as Category,
  },
  {
    name: 'Student ID Card',
    url: '/src/assets/images/item_college_id_card_1794074128058.jpg',
    category: 'Student ID Cards' as Category,
  },
  {
    name: 'College Backpack',
    url: '/src/assets/images/item_blue_backpack_1794074128914.jpg',
    category: 'Bags' as Category,
  },
];

export const ReportScreen: React.FC<Props> = ({
  user,
  initialType = 'lost',
  onItemCreated,
  onNavigateToMatches,
  onNavigateToExplore,
}) => {
  const [reportType, setReportType] = useState<'lost' | 'found'>(initialType);
  const [step, setStep] = useState<'type_selection' | 'form' | 'success'>('form');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Electronics');
  const [description, setDescription] = useState('');
  const [locationId, setLocationId] = useState<CampusBuildingId>('library');
  const [locationDetail, setLocationDetail] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState('/src/assets/images/item_casio_calculator_1794074127715.jpg');
  
  // Specific clues / questions
  const [privateClues, setPrivateClues] = useState('');
  const [verificationQuestions, setVerificationQuestions] = useState<VerificationQuestion[]>([
    {
      id: 'q-1',
      question: 'What distinctive engraving, sticker, scratch or color mark is on this item?',
      hint: 'Visible only to genuine owner',
      privateAnswer: '',
    },
  ]);

  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdItem, setCreatedItem] = useState<CampusItem | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addVerificationQuestion = () => {
    if (verificationQuestions.length >= 3) return;
    setVerificationQuestions([
      ...verificationQuestions,
      {
        id: `q-${Date.now()}`,
        question: '',
        hint: '',
        privateAnswer: '',
      },
    ]);
  };

  const removeVerificationQuestion = (index: number) => {
    setVerificationQuestions(verificationQuestions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof VerificationQuestion, val: string) => {
    const updated = [...verificationQuestions];
    updated[index] = { ...updated[index], [field]: val };
    setVerificationQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setValidationError('Please enter a clear item title.');
      return;
    }
    if (!description.trim() || description.length < 10) {
      setValidationError('Please provide a descriptive explanation (at least 10 characters).');
      return;
    }
    if (!locationDetail.trim()) {
      setValidationError('Please specify where on campus this occurred (room, floor, or bench).');
      return;
    }

    setIsSubmitting(true);
    setValidationError('');

    setTimeout(() => {
      const selectedLoc = CAMPUS_LOCATIONS.find(l => l.id === locationId);
      const fullLocDetail = `${selectedLoc ? selectedLoc.name : 'Campus'}, ${locationDetail}`;

      const newItem: CampusItem = {
        id: `item-${reportType}-${Date.now()}`,
        type: reportType,
        title: title.trim(),
        category,
        description: description.trim(),
        locationId,
        locationDetail: fullLocDetail,
        date,
        imageUrl,
        reporterName: user.name,
        reporterEmail: user.email,
        reporterRollNo: user.rollNo,
        status: reportType === 'lost' ? 'lost' : 'found',
        createdAt: new Date().toISOString(),
        isUserItem: true,
        privateClues: reportType === 'lost' ? privateClues.trim() : undefined,
        verificationQuestions: reportType === 'found' ? verificationQuestions.filter(q => q.question.trim().length > 0) : undefined,
      };

      onItemCreated(newItem);
      setCreatedItem(newItem);
      setIsSubmitting(false);
      setStep('success');

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }, 500);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocationDetail('');
    setPrivateClues('');
    setStep('form');
    setCreatedItem(null);
  };

  return (
    <div className="max-w-xl mx-auto pb-8">
      {/* Success Confirmation Screen */}
      {step === 'success' && createdItem ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-center space-y-5 shadow-sm animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 mb-2">
              Report Published
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {createdItem.type === 'lost' ? 'Lost Item Reported' : 'Found Item Registered!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
              Your item report for <strong>"{createdItem.title}"</strong> is now live on the ReFind Campus network.
            </p>
          </div>

          {/* Item Preview Card */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
            <img
              src={createdItem.imageUrl}
              alt={createdItem.title}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {createdItem.category}
              </span>
              <h4 className="text-sm font-bold text-slate-900 truncate">{createdItem.title}</h4>
              <p className="text-xs text-slate-500 truncate">{createdItem.locationDetail}</p>
            </div>
          </div>

          {/* SmartMatch Auto-Trigger Card */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 text-left space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>SmartMatch Auto-Scan Completed</span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              Our rule-based engine has compared your report against current campus listings. Check the SmartMatch tab for potential matches!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onNavigateToMatches}
              className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>View Matches</span>
            </button>
            <button
              onClick={onNavigateToExplore}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center transition"
            >
              <span>Explore Marketplace</span>
            </button>
          </div>

          <button
            onClick={resetForm}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium underline underline-offset-2 pt-2 block mx-auto"
          >
            File Another Report
          </button>
        </div>
      ) : (
        /* Form View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Report an Item
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow our quick reporting flow to reconnect belongings on campus
            </p>

            {/* Prompt Question: "What happened to your item?" */}
            <div className="mt-4 pt-3 border-t border-slate-200/80">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                What happened to your item?
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setReportType('lost')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                    reportType === 'lost'
                      ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 text-rose-900 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    reportType === 'lost' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">I Lost Something</p>
                    <p className="text-[11px] text-slate-500">I am the owner looking for it</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setReportType('found')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                    reportType === 'found'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    reportType === 'found' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">I Found Something</p>
                    <p className="text-[11px] text-slate-500">I discovered it on campus</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {/* Item Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Item Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  reportType === 'lost'
                    ? "e.g. Casio fx-991EX Scientific Calculator"
                    : "e.g. White Apple AirPods 2 Case with Earbuds"
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 bg-white"
                required
              />
            </div>

            {/* Category & Date Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Item Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Date {reportType === 'lost' ? 'Lost' : 'Found'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 bg-white"
                  required
                />
              </div>
            </div>

            {/* Campus Building & Specific Spot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Campus Zone / Building <span className="text-rose-500">*</span>
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value as CampusBuildingId)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 bg-white"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Specific Location Spot <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                  placeholder="e.g. 2nd floor desk #14, near water cooler"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 bg-white"
                  required
                />
              </div>
            </div>

            {/* Item Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Item Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brand, color, approximate wear, general contents or condition..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 bg-white resize-none"
                required
              />
            </div>

            {/* Upload Photograph & Instant Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Upload Photograph
              </label>

              {/* Current Preview */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <img
                  src={imageUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200 bg-white"
                />
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-slate-600">
                    Provide a clear photo to help the owner or finder verify the item.
                  </p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer transition shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload Custom Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Quick Preset Selector for instant realistic testing */}
              <div className="pt-1">
                <p className="text-[11px] font-semibold text-slate-400 mb-1.5">
                  Or pick a realistic demo campus photo:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImageUrl(p.url);
                        setCategory(p.category);
                      }}
                      className={`p-1.5 rounded-xl border text-center transition ${
                        imageUrl === p.url
                          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={p.url}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-12 rounded-lg object-cover mb-1"
                      />
                      <span className="text-[10px] font-medium text-slate-700 block truncate">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Section: For Found items -> Private verification questions */}
            {reportType === 'found' ? (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                    <Lock className="w-4 h-4 text-amber-700" />
                    <span>Private Ownership Verification Questions</span>
                  </div>
                  {verificationQuestions.length < 3 && (
                    <button
                      type="button"
                      onClick={addVerificationQuestion}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Question</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Ask questions that only the genuine owner can answer. Claimants will submit their answers privately before handover.
                </p>

                <div className="space-y-3 pt-1">
                  {verificationQuestions.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded-xl bg-white border border-amber-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">Question {idx + 1}</span>
                        {verificationQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVerificationQuestion(idx)}
                            className="text-rose-500 hover:text-rose-700 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuestion(idx, 'question', e.target.value)}
                        placeholder="e.g. What is the lockscreen wallpaper or engraving?"
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 text-slate-900 bg-white"
                        required
                      />

                      <input
                        type="text"
                        value={q.privateAnswer || ''}
                        onChange={(e) => updateQuestion(idx, 'privateAnswer', e.target.value)}
                        placeholder="Expected secret answer (only seen by you & campus admin)"
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 text-slate-800 bg-slate-50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* For Lost items -> Private identifying clues */
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Private Identifying Clues (Encrypted)</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Provide unique hidden clues (e.g. serial number suffix, sticker inside case, initial carvings). Kept confidential for SmartMatch and verification.
                </p>
                <textarea
                  rows={2}
                  value={privateClues}
                  onChange={(e) => setPrivateClues(e.target.value)}
                  placeholder="e.g. Has initials 'YS' lightly carved on the back lid, and a blue pen mark..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 bg-white resize-none"
                />
              </div>
            )}

            {/* Error Message */}
            {validationError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition disabled:opacity-60 shadow-sm"
              >
                {isSubmitting ? (
                  <span>Publishing Report & Scanning Matches...</span>
                ) : (
                  <>
                    <span>Submit & Publish {reportType === 'lost' ? 'Lost Report' : 'Found Item'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
