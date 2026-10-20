import React from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onProceed: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onProceed }) => {
  return (
    <div
      onClick={onProceed}
      className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none bg-slate-950 text-white animate-in fade-in duration-300 relative overflow-hidden"
    >
      {/* Background glow behind logo */}
      <div className="absolute w-64 h-64 bg-amber-500/15 blur-[90px] rounded-full pointer-events-none" />

      {/* Animated Brand Mark */}
      <div className="relative mb-6">
        <svg width="108" height="108" viewBox="0 0 30 30" className="drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
          <path
            d="M10 0h10v10h10v10H20v10H10V20H0V10h10z"
            fill="#f59e0b"
            className="animate-pulse"
          />
          <rect
            x="10"
            y="10"
            width="10"
            height="10"
            fill="#090d16"
            stroke="#ffffff"
            strokeWidth="0.8"
          />
          <path
            d="M13.33 10v10M16.66 10v10M10 13.33h10M10 16.66h10"
            stroke="#f59e0b"
            strokeWidth="0.6"
          />
        </svg>
        <Sparkles className="w-5 h-5 text-amber-300 absolute -top-2 -right-2 animate-bounce" />
      </div>

      <h1 className="text-4xl sm:text-5xl font-black tracking-widest uppercase bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
        CrissCross
      </h1>
      <p className="text-sm font-bold text-cyan-300 mt-2 tracking-widest uppercase text-[12px]">
        Luxury Photo Sliding Puzzle
      </p>

      <div className="mt-16 px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-[11px] text-slate-400 font-semibold tracking-wider">
        Tap anywhere to enter
      </div>
    </div>
  );
};
