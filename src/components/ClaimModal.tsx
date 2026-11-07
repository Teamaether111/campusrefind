import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  FileText,
  Building2,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampusItem, Claim, ClaimVerificationResponse } from '../types';
import { UserProfile } from '../utils/storage';

interface Props {
  item: CampusItem | null;
  user: UserProfile;
  onClose: () => void;
  onSubmitClaim: (claim: Claim) => void;
}

export const ClaimModal: React.FC<Props> = ({ item, user, onClose, onSubmitClaim }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [additionalProof, setAdditionalProof] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user.phone);
  const [rollNumber, setRollNumber] = useState(user.rollNo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [submittedClaim, setSubmittedClaim] = useState<Claim | null>(null);

  if (!item) return null;

  // Fallback verification questions if none were defined by finder
  const questions = (item.verificationQuestions && item.verificationQuestions.length > 0)
    ? item.verificationQuestions
    : [
        {
          id: 'gen-q1',
          question: 'Describe any private identifying mark, scratch, sticker, or engraving on this item.',
          hint: 'Distinguishing features known only to the genuine owner',
        },
        {
          id: 'gen-q2',
          question: 'What additional contents, accessories, or specifics were stored with this item?',
          hint: 'e.g. pouch color, cable type, notes inside, lockscreen background',
        },
      ];

  const handleAnswerChange = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
    if (validationError) setValidationError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check that at least the first question is answered
    const firstQ = questions[0];
    if (!answers[firstQ.id] || answers[firstQ.id].trim().length < 4) {
      setValidationError('Please answer the ownership verification question with specific identifying details.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const responseList: ClaimVerificationResponse[] = questions.map(q => ({
        questionId: q.id,
        question: q.question,
        userAnswer: answers[q.id] || 'Not specified',
      }));

      const newClaim: Claim = {
        id: `claim-${Date.now().toString().slice(-6)}`,
        itemId: item.id,
        itemTitle: item.title,
        itemType: item.type,
        itemImageUrl: item.imageUrl,
        claimantName: user.name,
        claimantEmail: user.email,
        claimantRollNo: rollNumber || user.rollNo,
        claimantPhone: phoneNumber || user.phone,
        status: 'Under Review',
        answers: responseList,
        additionalProof: additionalProof.trim() || undefined,
        submittedAt: new Date().toISOString(),
        handoverLocation: 'Central Security Post (Gate 1) - Student Verification Counter',
      };

      onSubmitClaim(newClaim);
      setSubmittedClaim(newClaim);
      setIsSubmitting(false);
      setStep('success');

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col relative">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Ownership Claim Request</h2>
              <p className="text-xs text-slate-300">Confidential verification with campus authority</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Target Item Mini Banner */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                    Found Item
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">{item.locationDetail}</p>
                </div>
              </div>

              {/* Security Banner */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
                <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Confidential Verification Guarantee:</span>
                  <span className="text-blue-800 leading-relaxed">
                    Your answers are encrypted and transmitted exclusively to the campus lost & found administrator. No other student can see your proof answers.
                  </span>
                </div>
              </div>

              {/* Verification Questions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Ownership Questions
                  </h4>
                  <span className="text-[11px] text-rose-500 font-medium">* Required</span>
                </div>

                {questions.map((q, idx) => (
                  <div key={q.id} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-800">
                      {idx + 1}. {q.question}
                    </label>
                    {q.hint && (
                      <p className="text-[11px] text-slate-500 italic">Hint: {q.hint}</p>
                    )}
                    <textarea
                      rows={2}
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Type your precise private answer..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 resize-none"
                      required={idx === 0}
                    />
                  </div>
                ))}
              </div>

              {/* Additional Proof / Receipt */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-800">
                  Additional Proof or Context (Optional)
                </label>
                <textarea
                  rows={2}
                  value={additionalProof}
                  onChange={(e) => setAdditionalProof(e.target.value)}
                  placeholder="e.g. Purchase bill receipt number, photo with the item, exact time lost..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 resize-none"
                />
              </div>

              {/* Claimant Contact Details */}
              <div className="space-y-3 border-t border-slate-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Your Campus Credentials
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Student Roll No</label>
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-mono text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-mono text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              {validationError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-60 shadow-sm"
                >
                  {isSubmitting ? (
                    <span>Verifying and Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Secure Claim</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Success Confirmation Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Claim Submitted Successfully!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Your verification details have been received and logged under Claim ID:
                </p>
                <div className="mt-2 inline-block px-3 py-1 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-800">
                  {submittedClaim?.id}
                </div>
              </div>

              {/* Status Timeline Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Current Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Under Review
                  </span>
                </div>

                <div className="border-t border-slate-200/80 pt-2.5 space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Collection Point:</span>
                      <span>Central Security Post (Gate 1) - Student Verification Counter</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Expected Review Time:</span>
                      <span>Usually reviewed within 2 to 4 business hours</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 text-[11px] text-blue-900 text-left border border-blue-100">
                <p className="font-semibold mb-1">Next Step for Collection:</p>
                <p className="text-blue-800 leading-relaxed">
                  Bring your original Campus Student Identity Card ({user.rollNo}) to the Gate 1 Security Desk once your claim is marked <strong>Approved</strong>.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
              >
                Done · View My Claims
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
