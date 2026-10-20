import React, { useState } from 'react';
import { MiniDiagram } from './MiniDiagram';

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOUR_CARDS: {
  title: string;
  description: string;
  diagram: React.ReactNode;
}[] = [
  {
    title: 'Pick Any Photo',
    description:
      'Turn any picture from your device or our preset library into a 9 or 16-piece geometric sliding challenge.',
    diagram: (
      <MiniDiagram
        N={3}
        moves={[
          ['c', 1, -1],
          ['r', 0, -1],
          ['c', 1, 1],
          ['r', 0, 1],
          ['c', 2, 1],
          ['r', 2, 1],
          ['c', 2, -1],
          ['r', 2, -1],
        ]}
        size={140}
      />
    ),
  },
  {
    title: 'Tap an Arrow to Slide',
    description:
      'The entire row or column shifts one space along its track. Each lane can slide up to 2 spaces in either direction.',
    diagram: (
      <MiniDiagram
        N={3}
        moves={[['r', 1, -1]]}
        pulseArrow={['r', 1, -1]}
        size={140}
      />
    ),
  },
  {
    title: 'Rebuild the Picture',
    description:
      'Move pieces out into the buffer arms, shift other lanes, and weave them back into place inside the central frame.',
    diagram: <MiniDiagram N={3} moves={[]} size={140} />,
  },
];

export const TourModal: React.FC<TourModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const current = TOUR_CARDS[step];
  const isLast = step === TOUR_CARDS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Diagram illustration */}
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 shadow-inner flex items-center justify-center">
          {current.diagram}
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-1.5">
          <h3 className="text-xl font-bold text-white">{current.title}</h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
            {current.description}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {TOUR_CARDS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === step ? 'w-6 bg-emerald-500' : 'w-1.5 bg-zinc-700'
              }`}
            />
          ))}
        </div>

        {/* Action row */}
        <div className="w-full flex items-center justify-between gap-3 pt-1">
          {!isLast ? (
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Skip
            </button>
          ) : (
            <div className="w-12" />
          )}

          <button
            onClick={handleNext}
            className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all ml-auto"
          >
            {isLast ? "Let's Play" : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
