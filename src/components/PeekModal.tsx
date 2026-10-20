import React from 'react';
import { X } from 'lucide-react';

interface PeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  N: number;
}

export const PeekModal: React.FC<PeekModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  N,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex flex-col">
            <h3 className="font-bold text-white text-base">Reference Image</h3>
            <span className="text-xs text-zinc-400">Target goal ({N} × {N} grid)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Square Image Preview with grid overlay */}
        <div className="relative w-64 h-64 rounded-xl overflow-hidden border-2 border-emerald-500/80 shadow-md">
          <img
            src={imageUrl}
            alt="Reference target"
            className="w-full h-full object-cover"
          />

          {/* Slicing grid overlay lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.7) 1px, transparent 1px)',
              backgroundSize: `${100 / N}% ${100 / N}%`,
            }}
          />
        </div>

        <p className="text-xs text-zinc-400 text-center">
          Slide the outer rows and columns to reassemble all {N * N} pieces inside the frame.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl active:scale-98 transition-all"
        >
          Return to Puzzle
        </button>
      </div>
    </div>
  );
};
