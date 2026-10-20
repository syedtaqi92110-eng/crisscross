import React from 'react';
import { Play, RotateCcw, Image, Save, HelpCircle, Settings as SettingsIcon } from 'lucide-react';

interface PauseSheetProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onNewPhoto: () => void;
  onSaveExit: () => void;
  onHowToPlay: () => void;
  onSettings: () => void;
  elapsedMs: number;
  moves: number;
  pieceCount: number;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const PauseSheet: React.FC<PauseSheetProps> = ({
  isOpen,
  onResume,
  onRestart,
  onNewPhoto,
  onSaveExit,
  onHowToPlay,
  onSettings,
  elapsedMs,
  moves,
  pieceCount,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onResume}
    >
      <div
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl flex flex-col gap-5 animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab indicator */}
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto sm:hidden" />

        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-2xl font-extrabold text-white">Paused</h2>
          <div className="text-4xl font-mono font-bold text-white tracking-tight tabular-nums mt-1">
            {formatTime(elapsedMs)}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
            <span>{pieceCount} pieces</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="font-mono tabular-nums">{moves} moves</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>Timer stopped</span>
          </div>
        </div>

        {/* Action list */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-semibold flex items-center justify-center gap-2 border border-zinc-700/60 active:scale-98 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-zinc-400" />
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-semibold">Restart Puzzle</span>
              <span className="text-xs text-zinc-400 font-normal">Same photo, new scramble</span>
            </div>
          </button>

          <button
            onClick={onNewPhoto}
            className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-semibold flex items-center justify-center gap-2 border border-zinc-700/60 active:scale-98 transition-all"
          >
            <Image className="w-4 h-4 text-zinc-400" />
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-semibold">Choose Another Photo</span>
              <span className="text-xs text-zinc-400 font-normal">Pick from gallery or samples</span>
            </div>
          </button>

          <button
            onClick={onSaveExit}
            className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-semibold flex items-center justify-center gap-2 border border-zinc-700/60 active:scale-98 transition-all"
          >
            <Save className="w-4 h-4 text-zinc-400" />
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-semibold">Save & Exit</span>
              <span className="text-xs text-zinc-400 font-normal">Continue later from the start screen</span>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={onHowToPlay}
              className="py-2.5 px-3 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-zinc-800 active:scale-98 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
              <span>How to play</span>
            </button>

            <button
              onClick={onSettings}
              className="py-2.5 px-3 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-zinc-800 active:scale-98 transition-all"
            >
              <SettingsIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
