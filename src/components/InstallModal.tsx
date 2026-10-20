import React, { useState } from 'react';
import { X, Download, Smartphone, Copy, Check, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Smartphone className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Get Android App / APK</h2>
              <span className="text-xs text-amber-400/90 font-medium">Install natively or download APK</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option 1: Direct 1-Click Native Install on Android */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-amber-400/40 shadow-lg flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-amber-400 rounded-lg text-slate-950 font-bold text-xs flex-shrink-0">
              Method 1
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                Install Directly on Your Phone
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-current" />
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Installs CrissCross directly onto your Android device home screen and app launcher with zero file downloading needed.
              </p>
            </div>
          </div>

          {isInstalled ? (
            <div className="py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Already installed on this device!</span>
            </div>
          ) : isInstallable ? (
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>Install Native App Now</span>
            </button>
          ) : (
            <div className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-white/5">
              💡 <strong>On Android Chrome:</strong> Tap the browser menu (<strong className="text-white">⋮</strong>) at top-right, then tap <strong className="text-amber-300">"Install app"</strong> or <strong className="text-amber-300">"Add to Home screen"</strong>.
            </div>
          )}
        </div>

        {/* Option 2: Build Official .APK File via PWABuilder */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-slate-800 rounded-lg text-slate-300 font-bold text-xs flex-shrink-0">
              Method 2
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                Download Standalone .APK File
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Generate a ready-to-install signed Android <strong className="text-slate-200">.apk / .aab</strong> package using Microsoft's free official PWA Builder:
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="truncate max-w-[240px] text-slate-400 font-mono text-[11px]">
                {currentUrl}
              </span>
              <button
                onClick={handleCopy}
                className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-bold flex items-center gap-1 transition-colors flex-shrink-0"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy URL'}</span>
              </button>
            </div>

            <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-[11px] pl-1">
              <li>Copy the app URL above.</li>
              <li>Go to <strong className="text-white">PWABuilder.com</strong> (by Microsoft).</li>
              <li>Paste this URL and click <strong className="text-amber-300">Start</strong>.</li>
              <li>Click <strong className="text-amber-300">Package for Android</strong> & download the <strong className="text-white">.apk</strong> file!</li>
            </ol>
          </div>

          <a
            href="https://www.pwabuilder.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
          >
            <span>Open PWABuilder.com</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        {/* iOS Notice if viewing on iPhone */}
        {isIOS && (
          <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-400">
            🍎 <strong>For iPhone / iPad:</strong> Tap Safari's <strong>Share</strong> button, then tap <strong>Add to Home Screen</strong>.
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
