import React from 'react';
import { ARM_LENGTH, createNewGame, inBoard, rawMove } from '../game/engine';

interface MiniDiagramProps {
  N: number;
  moves?: ['r' | 'c', number, number][];
  isPractice?: boolean;
  size?: number;
  pulseArrow?: ['r' | 'c', number, number];
  className?: string;
}

let miniIdCounter = 0;

export const MiniDiagram: React.FC<MiniDiagramProps> = ({
  N,
  moves = [],
  isPractice = false,
  size = 120,
  pulseArrow,
  className = '',
}) => {
  const patternId = React.useMemo(() => `mini-pat-${++miniIdCounter}`, []);

  const game = React.useMemo(() => {
    const g = createNewGame(N, null, isPractice ? 'practice' : 'play');
    moves.forEach(([k, l, s]) => {
      const d = Math.sign(s);
      for (let n = 0; n < Math.abs(s); n++) {
        rawMove(g, k, l, d);
      }
    });
    return g;
  }, [N, moves, isPractice]);

  const L = game.L;
  const cellSize = 10;
  const totalDim = cellSize * L;

  return (
    <svg
      viewBox={`0 0 ${totalDim} ${totalDim}`}
      width={size}
      height={size}
      className={`select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patternId}
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="4" height="4" fill="#27272a" />
          <rect width="1.5" height="4" fill="#3f3f46" />
        </pattern>
      </defs>

      {/* Grid tracks */}
      {Array.from({ length: L }).map((_, r) =>
        Array.from({ length: L }).map((_, c) => {
          if (!inBoard(N, r, c)) return null;
          return (
            <rect
              key={`track-${r}-${c}`}
              x={c * cellSize + 0.5}
              y={r * cellSize + 0.5}
              width={cellSize - 1}
              height={cellSize - 1}
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="0.5"
              strokeDasharray="1.5 1.5"
            />
          );
        })
      )}

      {/* Tiles */}
      {Array.from({ length: L }).map((_, r) =>
        Array.from({ length: L }).map((_, c) => {
          const tileId = game.grid[r][c];
          if (tileId === null || tileId < 0) return null;
          const tile = game.tiles[tileId];

          if (tile.type === 'blank') {
            return (
              <rect
                key={`tile-${tileId}`}
                x={c * cellSize + 0.5}
                y={r * cellSize + 0.5}
                width={cellSize - 1}
                height={cellSize - 1}
                fill={`url(#${patternId})`}
                stroke="#3f3f46"
                strokeWidth="0.5"
              />
            );
          }

          if (tile.type === 'pic') {
            let fillColor = '#10b981';
            let strokeColor = '#059669';

            if (isPractice) {
              fillColor = tile.pi === 1 ? '#09090b' : '#f4f4f5';
              strokeColor = tile.pi === 1 ? '#27272a' : '#d4d4d8';
            } else {
              const shade = Math.round(50 + (tile.pi! * N + tile.pj!) * (180 / (N * N - 1)));
              fillColor = `rgb(${shade}, ${shade}, ${shade})`;
              strokeColor = '#52525b';
            }

            return (
              <rect
                key={`tile-${tileId}`}
                x={c * cellSize + 0.5}
                y={r * cellSize + 0.5}
                width={cellSize - 1}
                height={cellSize - 1}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="0.5"
                rx="1"
              />
            );
          }

          if (tile.type === 'arrow') {
            const isPulsed =
              pulseArrow &&
              pulseArrow[0] === tile.kind &&
              pulseArrow[1] === tile.lane &&
              pulseArrow[2] === tile.d;

            return (
              <g key={`tile-${tileId}`}>
                <circle
                  cx={c * cellSize + cellSize / 2}
                  cy={r * cellSize + cellSize / 2}
                  r={cellSize * 0.38}
                  fill="#10b981"
                />
                {isPulsed && (
                  <circle
                    cx={c * cellSize + cellSize / 2}
                    cy={r * cellSize + cellSize / 2}
                    r={cellSize * 0.65}
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="1.2"
                  >
                    <animate
                      attributeName="r"
                      values={`${cellSize * 0.4};${cellSize * 0.7}`}
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="1;0"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          }

          return null;
        })
      )}

      {/* Center Target Frame */}
      <rect
        x={ARM_LENGTH * cellSize - 1}
        y={ARM_LENGTH * cellSize - 1}
        width={N * cellSize + 2}
        height={N * cellSize + 2}
        fill="none"
        stroke="#10b981"
        strokeWidth="1.8"
        rx="2"
      />
    </svg>
  );
};
