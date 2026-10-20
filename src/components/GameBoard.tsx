import React, { useEffect, useRef, useState } from 'react';
import { GameState, Tile } from '../types';
import { ARM_LENGTH, canMove, inBoard } from '../game/engine';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface GameBoardProps {
  game: GameState;
  onArrowClick: (tile: Tile) => void;
  shuffling?: boolean;
  hintTileId?: number | null;
  shakingLane?: { kind: 'r' | 'c'; lane: number } | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  game,
  onArrowClick,
  shuffling = false,
  hintTileId = null,
  shakingLane = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardPx, setBoardPx] = useState(380);

  // Responsive calculation of board size based on container
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth - 16;
      const height = window.innerHeight - 230;
      const maxDim = Math.min(width, height, 500);
      const minDim = 310;
      setBoardPx(Math.max(minDim, maxDim));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const L = game.L;
  const cellSize = Math.floor(boardPx / L);
  const totalBoardSize = cellSize * L;
  const N = game.N;

  // Always compute fresh tile positions directly from current game.grid on every render!
  const tilePositions = new Map<number, { r: number; c: number }>();
  for (let r = 0; r < L; r++) {
    for (let c = 0; c < L; c++) {
      const id = game.grid[r][c];
      if (id !== null && id >= 0) {
        tilePositions.set(id, { r, c });
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full flex items-center justify-center p-2 relative overflow-hidden select-none"
    >
      <div
        className={`relative ${game.solved ? 'animate-win-flash' : ''}`}
        style={{
          width: totalBoardSize,
          height: totalBoardSize,
        }}
      >
        {/* Track Grid Background with recessed luxury appearance */}
        {Array.from({ length: L }).map((_, r) =>
          Array.from({ length: L }).map((_, c) => {
            if (!inBoard(N, r, c)) return null;
            return (
              <div
                key={`bg-${r}-${c}`}
                className="absolute border border-dashed border-cyan-500/15 bg-slate-950/70 pointer-events-none rounded-[2px]"
                style={{
                  left: c * cellSize,
                  top: r * cellSize,
                  width: cellSize,
                  height: cellSize,
                }}
              />
            );
          })
        )}

        {/* Center Target Frame with illuminated gold/emerald luxury border */}
        <div
          className={`absolute pointer-events-none z-10 rounded-lg transition-all duration-300 ${
            game.solved
              ? 'border-4 border-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.9)] bg-amber-400/10'
              : 'border-2 border-amber-400/90 shadow-[0_0_20px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/30'
          }`}
          style={{
            left: ARM_LENGTH * cellSize - 3,
            top: ARM_LENGTH * cellSize - 3,
            width: N * cellSize + 6,
            height: N * cellSize + 6,
          }}
        >
          {/* Corner accents */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-300" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-300" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-300" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-300" />
        </div>

        {/* Moving Tiles */}
        {game.tiles.map((tile) => {
          const pos = tilePositions.get(tile.id);
          if (!pos) return null;

          const isArrow = tile.type === 'arrow';
          const isPic = tile.type === 'pic';
          const isBlank = tile.type === 'blank';

          const isLaneShaking =
            shakingLane &&
            ((shakingLane.kind === 'r' &&
              ((tile.kind === 'r' && tile.lane === shakingLane.lane) ||
                (isPic && pos.r === ARM_LENGTH + shakingLane.lane) ||
                (isBlank && pos.r === ARM_LENGTH + shakingLane.lane))) ||
              (shakingLane.kind === 'c' &&
                ((tile.kind === 'c' && tile.lane === shakingLane.lane) ||
                  (isPic && pos.c === ARM_LENGTH + shakingLane.lane) ||
                  (isBlank && pos.c === ARM_LENGTH + shakingLane.lane))));

          const canSlide = isArrow && canMove(game, tile.kind!, tile.lane!, tile.d!);
          const isHinted = hintTileId === tile.id;

          const transformStyle = `translate(${pos.c * cellSize}px, ${pos.r * cellSize}px)`;

          return (
            <div
              key={`tile-${tile.id}`}
              className={`absolute top-0 left-0 will-change-transform ${
                shuffling
                  ? 'transition-transform duration-500 ease-in-out'
                  : 'transition-transform duration-140 ease-out'
              } ${isLaneShaking ? 'animate-shake' : ''} ${isArrow ? 'z-20' : 'z-0'}`}
              style={{
                width: cellSize,
                height: cellSize,
                transform: transformStyle,
              }}
            >
              {/* Picture Tile with luxury drop-shadow and bevel border */}
              {isPic && (
                <div
                  className="w-full h-full rounded-sm overflow-hidden ring-1 ring-white/20 shadow-md shadow-black/60 relative"
                  style={
                    game.mode === 'practice'
                      ? {
                          backgroundColor: tile.pi === 1 ? '#0f172a' : '#f8fafc',
                          border: tile.pi === 1 ? '1.5px solid #38bdf8' : '1.5px solid #cbd5e1',
                          boxShadow: tile.pi === 1 ? '0 0 8px rgba(56,189,248,0.4)' : 'none',
                        }
                      : {
                          backgroundImage: `url("${game.img}")`,
                          backgroundSize: `${N * cellSize}px ${N * cellSize}px`,
                          backgroundPosition: `${-(tile.pj ?? 0) * cellSize}px ${-(tile.pi ?? 0) * cellSize}px`,
                          backgroundRepeat: 'no-repeat',
                        }
                  }
                >
                  {/* Subtle top bevel highlight */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-white/25 pointer-events-none" />
                </div>
              )}

              {/* Blank Tile with luxury textured diagonal weave */}
              {isBlank && (
                <div className="w-full h-full bg-puzzle-blank rounded-sm ring-1 ring-slate-800/80 shadow-inner" />
              )}

              {/* Directional Arrow Jewel Button with generous touch hit area */}
              {isArrow && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onArrowClick(tile);
                    }}
                    disabled={game.solved}
                    aria-label={`Slide ${tile.kind === 'r' ? 'row' : 'column'} ${
                      (tile.lane ?? 0) + 1
                    } ${tile.dir}`}
                    className={`relative z-10 flex items-center justify-center rounded-full transition-all group active:scale-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 touch-manipulation cursor-pointer ${
                      canSlide
                        ? 'text-slate-950 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_2px_10px_rgba(245,158,11,0.5)] ring-1 ring-amber-200/80'
                        : 'text-slate-500 bg-slate-800/80 cursor-not-allowed opacity-35 hover:opacity-60 ring-1 ring-slate-700'
                    } ${isHinted ? 'animate-hint-pulse ring-4 ring-cyan-400 !opacity-100 !bg-cyan-400 !text-slate-950' : ''}`}
                    style={{
                      width: Math.max(cellSize - 2, 24),
                      height: Math.max(cellSize - 2, 24),
                    }}
                  >
                    {/* Invisible touch expander for mobile ease */}
                    <span className="absolute -inset-2.5 z-20" />

                    {tile.dir === 'up' && <ArrowUp className="w-3/5 h-3/5 stroke-[3.5]" />}
                    {tile.dir === 'down' && <ArrowDown className="w-3/5 h-3/5 stroke-[3.5]" />}
                    {tile.dir === 'left' && <ArrowLeft className="w-3/5 h-3/5 stroke-[3.5]" />}
                    {tile.dir === 'right' && <ArrowRight className="w-3/5 h-3/5 stroke-[3.5]" />}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
