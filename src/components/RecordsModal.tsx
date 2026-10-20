import React from 'react';
import { X, Trophy, Clock, Move, Award } from 'lucide-react';
import { PlayerRecords } from '../types';

interface RecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PlayerRecords;
}

function formatTime(ms: number | null): string {
  if (ms === null) return '--:--';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const RecordsModal: React.FC<RecordsModalProps> = ({
  isOpen,
  onClose,
  records,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Personal Bests</h2>
              <span className="text-xs text-zinc-400">Fastest times & fewest moves</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3x3 Stats Card */}
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">9 Pieces (3 × 3)</span>
            <span className="text-xs text-emerald-400 font-semibold">Standard</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-zinc-900 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>Best Time</span>
              </div>
              <span className="text-lg font-mono font-bold text-white tabular-nums mt-1">
                {formatTime(records.bestTime3)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <Move className="w-3 h-3 text-zinc-500" />
                <span>Fewest Moves</span>
              </div>
              <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums mt-1">
                {records.bestMoves3 !== null ? records.bestMoves3 : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* 4x4 Stats Card */}
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">16 Pieces (4 × 4)</span>
            <span className="text-xs text-amber-400 font-semibold">Advanced</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-zinc-900 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>Best Time</span>
              </div>
              <span className="text-lg font-mono font-bold text-white tabular-nums mt-1">
                {formatTime(records.bestTime4)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <Move className="w-3 h-3 text-zinc-500" />
                <span>Fewest Moves</span>
              </div>
              <span className="text-lg font-mono font-bold text-amber-400 tabular-nums mt-1">
                {records.bestMoves4 !== null ? records.bestMoves4 : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="flex items-center justify-between px-2 pt-1 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Total Completed Puzzles</span>
          </div>
          <span className="font-mono font-bold text-white text-sm">
            {records.gamesCompleted}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all mt-1"
        >
          Close
        </button>
      </div>
    </div>
  );
};
