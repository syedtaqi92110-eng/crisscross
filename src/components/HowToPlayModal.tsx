import React from 'react';
import { X, PlayCircle } from 'lucide-react';
import { MiniDiagram } from './MiniDiagram';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPractice: () => void;
}

const STEPS = [
  {
    title: 'Your Photo, Mixed Up',
    desc: 'The image is sliced into pieces and shuffled using legal sliding commutators inside the central frame.',
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
        size={54}
      />
    ),
  },
  {
    title: 'Tap an Arrow to Slide',
    desc: 'Tapping an outer arrow slides that entire row or column by one space into the track.',
    diagram: <MiniDiagram N={3} moves={[['r', 1, -1]]} pulseArrow={['r', 1, -1]} size={54} />,
  },
  {
    title: 'Up to 2 Spaces Limit',
    desc: 'Each lane can slide at most 2 spaces in either direction from its home center. At the limit, the lane shakes and buzzes.',
    diagram: <MiniDiagram N={3} moves={[['r', 1, -2]]} size={54} />,
  },
  {
    title: 'Use the Patterned Blanks',
    desc: 'Diagonal striped squares are blanks. Temporarily push tiles out into the arms to swap lanes, then weave them back in.',
    diagram: <MiniDiagram N={3} moves={[['r', 1, -2], ['c', 2, 1]]} size={54} />,
  },
  {
    title: 'Rebuild Inside the Frame',
    desc: 'Restore the entire picture inside the green perimeter frame. The timer and move counter track your performance.',
    diagram: <MiniDiagram N={3} moves={[]} size={54} />,
  },
];

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  onStartPractice,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white">How to Play</h2>
            <span className="text-xs text-zinc-400">Rules & sliding mechanics</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Steps */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
          {STEPS.map((s, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80"
            >
              <div className="flex-shrink-0 p-1.5 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center">
                {s.diagram}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-white">{s.title}</span>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
          <button
            onClick={() => {
              onClose();
              onStartPractice();
            }}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
          >
            <PlayCircle className="w-4 h-4 fill-current" />
            <span>Try Practice Puzzle</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
