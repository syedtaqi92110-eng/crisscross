import React from 'react';
import { X, Volume2, VolumeX, Smartphone, RotateCcw, Trash2, Download } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetTour: () => void;
  onClearSavedGame: () => void;
  hasSavedGame: boolean;
  onOpenInstall: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetTour,
  onClearSavedGame,
  hasSavedGame,
  onOpenInstall,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-4.5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <span className="text-xs text-slate-400">Game preferences & sound</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-3">
          {/* Sound Toggle */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 cursor-pointer hover:border-amber-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-900 text-slate-300">
                {settings.sound ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Sound Effects</span>
                <span className="text-xs text-slate-400">Moves, limit buzz, and victory</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={(e) => onUpdateSettings({ sound: e.target.checked })}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </label>

          {/* Vibration Toggle */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 cursor-pointer hover:border-amber-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-900 text-slate-300">
                <Smartphone className={`w-4 h-4 ${settings.vibration ? 'text-amber-400' : 'text-slate-500'}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Vibration</span>
                <span className="text-xs text-slate-400">Buzz when a slide hits its limit</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.vibration}
              onChange={(e) => onUpdateSettings({ vibration: e.target.checked })}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
          <button
            onClick={() => {
              onClose();
              onOpenInstall();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 border border-amber-500/35 transition-colors"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Install on Phone / Get APK</span>
          </button>

          <button
            onClick={() => {
              onResetTour();
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Show Onboarding Tour Again</span>
          </button>

          {hasSavedGame && (
            <button
              onClick={() => {
                if (window.confirm('Delete your unfinished saved puzzle?')) {
                  onClearSavedGame();
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 border border-rose-900/50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Discard Saved In-Progress Puzzle</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all mt-1"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
