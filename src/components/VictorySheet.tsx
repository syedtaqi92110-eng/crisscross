import React from 'react';
import { Trophy, RotateCcw, Image, Home, Sparkles } from 'lucide-react';

interface VictorySheetProps {
  isOpen: boolean;
  onPlayAgain: () => void;
  onNewPhoto: () => void;
  onGoHome: () => void;
  elapsedMs: number;
  moves: number;
  pieceCount: number;
  isNewBestTime?: boolean;
  isNewBestMoves?: boolean;
  isPractice?: boolean;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const VictorySheet: React.FC<VictorySheetProps> = ({
  isOpen,
  onPlayAgain,
  onNewPhoto,
  onGoHome,
  elapsedMs,
  moves,
  pieceCount,
  isNewBestTime = false,
  isNewBestMoves = false,
  isPractice = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-5 animate-in slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab indicator */}
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto sm:hidden" />

        {/* Victory Icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Trophy className="w-8 h-8 stroke-[2.2]" />
          </div>
          <Sparkles className="w-5 h-5 text-emerald-400 absolute -top-1 -right-1 animate-bounce" />
        </div>

        {/* Title */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-black text-white">
            {isPractice ? "You've Got It!" : 'Solved!'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isPractice
              ? 'You successfully aligned the stripe. Ready for a real photo?'
              : `All ${pieceCount} pieces restored inside the frame.`}
          </p>
        </div>

        {/* Stats card */}
        <div className="w-full grid grid-cols-2 gap-3 p-4 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl text-center">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-900/60">
            <span className="text-xs text-zinc-400 font-medium">Time</span>
            <span className="text-2xl font-mono font-bold text-white tabular-nums mt-0.5">
              {formatTime(elapsedMs)}
            </span>
            {isNewBestTime && !isPractice && (
              <span className="text-[10px] font-bold text-emerald-400 mt-0.5 uppercase tracking-wider">
                New Record!
              </span>
            )}
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-900/60">
            <span className="text-xs text-zinc-400 font-medium">Moves</span>
            <span className="text-2xl font-mono font-bold text-emerald-400 tabular-nums mt-0.5">
              {moves}
            </span>
            {isNewBestMoves && !isPractice && (
              <span className="text-[10px] font-bold text-emerald-400 mt-0.5 uppercase tracking-wider">
                Fewest Moves!
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={isPractice ? onNewPhoto : onPlayAgain}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-98 transition-all"
          >
            {isPractice ? <Image className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
            <span>{isPractice ? 'Play with a Photo' : 'Play Again'}</span>
          </button>

          {!isPractice && (
            <button
              onClick={onNewPhoto}
              className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-semibold flex items-center justify-center gap-2 border border-zinc-700/60 active:scale-98 transition-all"
            >
              <Image className="w-4 h-4 text-zinc-400" />
              <span>Choose Another Photo</span>
            </button>
          )}

          <button
            onClick={onGoHome}
            className="w-full py-2.5 px-4 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Start Screen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
