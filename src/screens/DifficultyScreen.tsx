import React from 'react';
import { ChevronLeft, ChevronRight, Zap, Flame } from 'lucide-react';
import { MiniDiagram } from '../components/MiniDiagram';

interface DifficultyScreenProps {
  onSelectDifficulty: (N: number) => void;
  onBack: () => void;
}

export const DifficultyScreen: React.FC<DifficultyScreenProps> = ({
  onSelectDifficulty,
  onBack,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-6 select-none max-w-md mx-auto">
      {/* Topbar */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-white tracking-wide">Select Difficulty</h2>
          <div className="w-10" />
        </div>

        <div className="mt-6 mb-4">
          <p className="text-base text-slate-200 font-semibold">
            How many pieces should your photo be cut into?
          </p>
        </div>

        {/* Difficulty Selection Cards */}
        <div className="flex flex-col gap-4 mt-5">
          {/* 9 pieces: 3x3 */}
          <button
            onClick={() => onSelectDifficulty(3)}
            className="w-full p-4.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-emerald-500/30 hover:border-emerald-400/70 flex items-center gap-4 text-left transition-all group active:scale-98 shadow-xl hover:shadow-emerald-500/10"
          >
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex-shrink-0 group-hover:border-emerald-500/50 transition-colors">
              <MiniDiagram N={3} size={56} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">9 pieces</span>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-0.5">
                  <Zap className="w-3 h-3 fill-current" />
                  Standard
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                3 × 3 grid · Fast & satisfying solve
              </span>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </button>

          {/* 16 pieces: 4x4 */}
          <button
            onClick={() => onSelectDifficulty(4)}
            className="w-full p-4.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-amber-500/30 hover:border-amber-400/70 flex items-center gap-4 text-left transition-all group active:scale-98 shadow-xl hover:shadow-amber-500/10"
          >
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex-shrink-0 group-hover:border-amber-500/50 transition-colors">
              <MiniDiagram N={4} size={56} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">16 pieces</span>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-0.5">
                  <Flame className="w-3 h-3 fill-current" />
                  Expert
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                4 × 4 grid · Advanced spatial challenge
              </span>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      {/* Footer hint */}
      <p className="text-xs text-slate-400 text-center mt-6 font-medium">
        Same rules for both. Each slide moves up to 2 spaces in either direction.
      </p>
    </div>
  );
};
