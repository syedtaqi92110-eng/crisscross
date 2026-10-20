import React from 'react';
import { ChevronLeft, Play, RefreshCw } from 'lucide-react';

interface CropScreenProps {
  imageUrl: string;
  N: number;
  onStartGame: () => void;
  onBack: () => void;
}

export const CropScreen: React.FC<CropScreenProps> = ({
  imageUrl,
  N,
  onStartGame,
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
          <h2 className="text-lg font-bold text-white tracking-wide">Your Puzzle</h2>
          <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full shadow-inner">
            {N * N} pieces
          </span>
        </div>

        {/* Cropped Photo Preview with luxury frame */}
        <div className="flex flex-col items-center mt-6">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
            <img
              src={imageUrl}
              alt="Cropped puzzle preview"
              className="w-full h-full object-cover"
            />

            {/* Slicing grid overlay lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.75) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(255,255,255,0.75) 1.5px, transparent 1.5px)',
                backgroundSize: `${100 / N}% ${100 / N}%`,
              }}
            />
          </div>

          <div className="text-center mt-5">
            <p className="text-sm text-slate-200 font-bold">
              Automatically cropped to a perfect square.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              It will be sliced into <strong className="text-amber-300">{N * N} pieces</strong> and
              scrambled inside the frame.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 mt-6">
        <button
          onClick={onStartGame}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(245,158,11,0.35)] active:scale-98 transition-all"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start Puzzle</span>
        </button>

        <button
          onClick={onBack}
          className="w-full py-3 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Choose Another Photo</span>
        </button>
      </div>
    </div>
  );
};
