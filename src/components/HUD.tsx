import React from 'react';
import { Pause, Eye, RotateCcw } from 'lucide-react';

interface HUDProps {
  elapsedMs: number;
  moves: number;
  pieceCount: number;
  isPractice: boolean;
  onPause: () => void;
  onPeek: () => void;
  isPeeking: boolean;
  onRestart?: () => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const HUD: React.FC<HUDProps> = ({
  elapsedMs,
  moves,
  pieceCount,
  isPractice,
  onPause,
  onPeek,
  isPeeking,
  onRestart,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 text-slate-100 z-20 shadow-lg">
      {/* Left: Pause & Restart Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPause}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 active:scale-90 transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Pause Game"
          title="Pause"
        >
          <Pause className="w-4 h-4 fill-current" />
        </button>

        {onRestart && (
          <button
            onClick={onRestart}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 active:scale-90 transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Restart Puzzle"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Center: Timer & Moves */}
      <div className="flex flex-col items-center justify-center">
        <div className="px-3.5 py-0.5 rounded-full bg-slate-950/80 border border-amber-500/30 shadow-inner">
          <span className="text-xl md:text-2xl font-mono font-black tracking-tight text-amber-300 tabular-nums">
            {formatTime(elapsedMs)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
          <span className="font-semibold text-slate-300">{isPractice ? 'Practice' : `${pieceCount} pieces`}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono tabular-nums text-cyan-400 font-bold">{moves} moves</span>
        </div>
      </div>

      {/* Right: Peek reference button */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPeek}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all active:scale-90 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            isPeeking
              ? 'bg-amber-400 text-slate-950 shadow-amber-400/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
          title="Peek Reference Photo"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Peek</span>
        </button>
      </div>
    </header>
  );
};
