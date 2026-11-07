import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  variant?: 'compact' | 'prominent' | 'card';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  const handleAction = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowIOSGuide(true);
    }
  };

  if (variant === 'card') {
    return (
      <>
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Download className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Install ReFind Campus</p>
              <p className="text-xs text-blue-200">Instant access to campus lost & found on your home screen.</p>
            </div>
          </div>
          <button
            onClick={handleAction}
            className="shrink-0 px-3.5 py-2 rounded-xl bg-white text-blue-900 text-xs font-semibold hover:bg-blue-50 active:scale-95 transition"
          >
            {isInstallable ? 'Install PWA' : 'Add to Phone'}
          </button>
        </div>

        {/* Modal for iOS / Browser guide */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Install ReFind Campus</h3>
                  <p className="text-xs text-slate-500">Fast, offline-ready progressive web app</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600 border-y border-slate-100 py-4 my-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      Tap the <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> Share button
                    </p>
                    <p className="text-slate-500">In Safari or Chrome bottom/top toolbar</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      Select <PlusSquare className="w-3.5 h-3.5 inline text-blue-600" /> "Add to Home Screen"
                    </p>
                    <p className="text-slate-500">Creates an app icon with instant full-screen experience</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleAction}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition"
        title="Install ReFind to your device"
      >
        <Download className="w-3.5 h-3.5 text-blue-600" />
        <span className="whitespace-nowrap">Install App</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Install ReFind Campus</h3>
                <p className="text-xs text-slate-500">Run as standalone mobile app</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 border-y border-slate-100 py-4 my-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 text-xs">
                  1
                </div>
                <div>
                  <p className="font-medium text-slate-800">
                    Tap the <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> Share icon
                  </p>
                  <p className="text-slate-500">In your mobile browser navigation bar</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 text-xs">
                  2
                </div>
                <div>
                  <p className="font-medium text-slate-800">
                    Choose <PlusSquare className="w-3.5 h-3.5 inline text-blue-600" /> Add to Home Screen
                  </p>
                  <p className="text-slate-500">Opens ReFind Campus as a native app</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
