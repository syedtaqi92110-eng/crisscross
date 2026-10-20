import React from 'react';
import { Play, HelpCircle, Trophy, Settings as SettingsIcon, ArrowRight, Sparkles, Download } from 'lucide-react';
import { GameState } from '../types';
import { MiniDiagram } from '../components/MiniDiagram';

interface HomeScreenProps {
  savedGame: GameState | null;
  onResumeSaved: () => void;
  onNewPuzzle: () => void;
  onHowToPlay: () => void;
  onOpenRecords: () => void;
  onOpenSettings: () => void;
  onOpenInstall: () => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  savedGame,
  onResumeSaved,
  onNewPuzzle,
  onHowToPlay,
  onOpenRecords,
  onOpenSettings,
  onOpenInstall,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-6 select-none max-w-md mx-auto">
      {/* Top Hero Section */}
      <div className="flex flex-col items-center text-center mt-2">
        <div className="relative p-3.5 bg-slate-900/90 border border-amber-500/30 rounded-3xl shadow-[0_0_30px_rgba(245,158,11,0.2)] mb-3">
          <MiniDiagram
            N={3}
            moves={[
              ['c', 1, -1],
              ['r', 0, -1],
              ['c', 1, 1],
              ['r', 0, 1],
            ]}
            size={105}
          />
          <div className="absolute -top-1 -right-1 p-1 bg-amber-400 rounded-full shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-md">
          CrissCross
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-xs leading-relaxed">
          The Luxury Photo Sliding Puzzle Game
        </p>
      </div>

      {/* Middle: Continue Saved Game slot if active */}
      <div className="my-2">
        {savedGame && (
          <div className="p-3.5 bg-slate-900/90 border border-amber-400/50 rounded-2xl shadow-xl flex items-center gap-3.5 animate-in slide-in-from-bottom-2 duration-200">
            <div className="w-13 h-13 rounded-xl overflow-hidden bg-slate-950 border border-amber-500/30 flex-shrink-0 relative">
              {savedGame.img ? (
                <img
                  src={savedGame.img}
                  alt="Saved puzzle preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <MiniDiagram N={savedGame.N} size={52} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Saved Puzzle
              </span>
              <span className="text-sm font-bold text-white truncate block">
                {savedGame.N * savedGame.N} Pieces
              </span>
              <span className="text-xs text-slate-400">
                {formatTime(savedGame.elapsed)} · {savedGame.moves} moves
              </span>
            </div>

            <button
              onClick={onResumeSaved}
              className="px-3.5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-amber-500/30 active:scale-95 transition-all"
            >
              <span>Resume</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onNewPuzzle}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base flex items-center justify-center gap-2.5 shadow-[0_6px_25px_rgba(245,158,11,0.35)] active:scale-98 transition-all"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>New Puzzle</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onHowToPlay}
            className="py-3 px-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 border border-white/10 active:scale-98 transition-all shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>How to Play</span>
          </button>

          <button
            onClick={onOpenInstall}
            className="py-3 px-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 border border-amber-500/40 active:scale-98 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Install / APK</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenRecords}
            className="py-2.5 px-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 border border-white/10 active:scale-98 transition-all shadow-sm"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Records</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="py-2.5 px-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 border border-white/10 active:scale-98 transition-all shadow-sm"
          >
            <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Settings</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500 text-center mt-1 font-medium">
          No account needed. Your puzzle progress stays on this device.
        </p>
      </div>
    </div>
  );
};
