import { GameMode, GameState, Tile } from '../types';

export const ARM_LENGTH = 5; // A = 5: 2 empty buffer + 1 arrow + 2 blanks

export function inBoard(N: number, r: number, c: number): boolean {
  return (r >= ARM_LENGTH && r < ARM_LENGTH + N) || (c >= ARM_LENGTH && c < ARM_LENGTH + N);
}

export function createNewGame(N: number, img: string | null, mode: GameMode = 'play'): GameState {
  const L = N + 2 * ARM_LENGTH;
  const tiles: Tile[] = [];
  const grid: (number | null)[][] = [];

  for (let r = 0; r < L; r++) {
    const row: (number | null)[] = [];
    for (let c = 0; c < L; c++) {
      row.push(inBoard(N, r, c) ? -1 : null);
    }
    grid.push(row);
  }

  const addTile = (tile: Omit<Tile, 'id'>): number => {
    const id = tiles.length;
    const fullTile: Tile = { ...tile, id };
    tiles.push(fullTile);
    return id;
  };

  // Center picture tiles inside the target frame
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      grid[ARM_LENGTH + i][ARM_LENGTH + j] = addTile({
        type: 'pic',
        pi: i,
        pj: j,
      });
    }
  }

  // Row tracks (horizontal arrows and blanks)
  for (let i = 0; i < N; i++) {
    const r = ARM_LENGTH + i;
    for (let c = 2; c <= L - 3; c++) {
      if (c >= ARM_LENGTH && c < ARM_LENGTH + N) continue;
      if (c === 2) {
        grid[r][c] = addTile({
          type: 'arrow',
          kind: 'r',
          lane: i,
          d: -1,
          dir: 'left',
        });
      } else if (c === L - 3) {
        grid[r][c] = addTile({
          type: 'arrow',
          kind: 'r',
          lane: i,
          d: 1,
          dir: 'right',
        });
      } else {
        grid[r][c] = addTile({
          type: 'blank',
        });
      }
    }
  }

  // Column tracks (vertical arrows and blanks)
  for (let j = 0; j < N; j++) {
    const c = ARM_LENGTH + j;
    for (let r = 2; r <= L - 3; r++) {
      if (r >= ARM_LENGTH && r < ARM_LENGTH + N) continue;
      if (r === 2) {
        grid[r][c] = addTile({
          type: 'arrow',
          kind: 'c',
          lane: j,
          d: -1,
          dir: 'up',
        });
      } else if (r === L - 3) {
        grid[r][c] = addTile({
          type: 'arrow',
          kind: 'c',
          lane: j,
          d: 1,
          dir: 'down',
        });
      } else {
        grid[r][c] = addTile({
          type: 'blank',
        });
      }
    }
  }

  return {
    N,
    L,
    img,
    mode,
    tiles,
    grid,
    off: {
      r: Array(N).fill(0),
      c: Array(N).fill(0),
    },
    elapsed: 0,
    moves: 0,
    running: false,
    solved: false,
    stack: [],
  };
}

export function canMove(game: GameState, kind: 'r' | 'c', lane: number, d: number): boolean {
  return Math.abs(game.off[kind][lane] + d) <= 2;
}

export function rawMove(game: GameState, kind: 'r' | 'c', lane: number, d: number): void {
  const L = game.L;
  if (kind === 'r') {
    const r = ARM_LENGTH + lane;
    const row = game.grid[r];
    const newRow = Array(L).fill(-1);
    for (let c = 0; c < L; c++) {
      const id = row[c];
      if (id !== null && id >= 0) {
        newRow[c + d] = id;
      }
    }
    game.grid[r] = newRow;
  } else {
    const c = ARM_LENGTH + lane;
    const col: (number | null)[] = [];
    for (let r = 0; r < L; r++) {
      col.push(game.grid[r][c]);
    }
    const newCol = Array(L).fill(-1);
    for (let r = 0; r < L; r++) {
      const id = col[r];
      if (id !== null && id >= 0) {
        newCol[r + d] = id;
      }
    }
    for (let r = 0; r < L; r++) {
      game.grid[r][c] = newCol[r];
    }
  }
  game.off[kind][lane] += d;
}

export function pushStack(game: GameState, kind: 'r' | 'c', lane: number, d: number): void {
  const stack = game.stack;
  const top = stack[stack.length - 1];
  if (top && top[0] === kind && top[1] === lane && top[2] === -d) {
    stack.pop();
  } else {
    stack.push([kind, lane, d]);
  }
}

export function applyMoveSteps(game: GameState, kind: 'r' | 'c', lane: number, steps: number): void {
  const d = Math.sign(steps);
  const count = Math.abs(steps);
  for (let i = 0; i < count; i++) {
    rawMove(game, kind, lane, d);
    pushStack(game, kind, lane, d);
  }
}

/**
 * Pure and immutable move execution for React state:
 * Clones all arrays so React re-renders instantaneously with fresh tile positions.
 */
export function executeSlideMove(
  game: GameState,
  kind: 'r' | 'c',
  lane: number,
  d: number
): { nextGame: GameState; moved: boolean } {
  if (!canMove(game, kind, lane, d)) {
    return { nextGame: game, moved: false };
  }

  const L = game.L;
  const newGrid = game.grid.map((row) => [...row]);
  const newOff = { r: [...game.off.r], c: [...game.off.c] };
  const newStack: ['r' | 'c', number, number][] = [...game.stack];

  if (kind === 'r') {
    const r = ARM_LENGTH + lane;
    const row = newGrid[r];
    const newRow = Array(L).fill(-1);
    for (let c = 0; c < L; c++) {
      const id = row[c];
      if (id !== null && id >= 0) {
        newRow[c + d] = id;
      }
    }
    newGrid[r] = newRow;
  } else {
    const c = ARM_LENGTH + lane;
    const col: (number | null)[] = [];
    for (let r = 0; r < L; r++) {
      col.push(newGrid[r][c]);
    }
    const newCol = Array(L).fill(-1);
    for (let r = 0; r < L; r++) {
      const id = col[r];
      if (id !== null && id >= 0) {
        newCol[r + d] = id;
      }
    }
    for (let r = 0; r < L; r++) {
      newGrid[r][c] = newCol[r];
    }
  }

  newOff[kind][lane] += d;

  const top = newStack[newStack.length - 1];
  if (top && top[0] === kind && top[1] === lane && top[2] === -d) {
    newStack.pop();
  } else {
    newStack.push([kind, lane, d]);
  }

  const nextGame: GameState = {
    ...game,
    grid: newGrid,
    off: newOff,
    stack: newStack,
    moves: game.moves + 1,
  };

  nextGame.solved = checkIsSolved(nextGame);
  if (nextGame.solved) {
    nextGame.running = false;
  }

  return { nextGame, moved: true };
}

export function getCenterTile(game: GameState, i: number, j: number): Tile | null {
  const id = game.grid[ARM_LENGTH + i][ARM_LENGTH + j];
  if (id !== null && id >= 0) {
    return game.tiles[id];
  }
  return null;
}

export function centerAllPics(game: GameState): boolean {
  for (let i = 0; i < game.N; i++) {
    for (let j = 0; j < game.N; j++) {
      const tile = getCenterTile(game, i, j);
      if (!tile || tile.type !== 'pic') return false;
    }
  }
  return true;
}

export function isCellOk(game: GameState, i: number, j: number): boolean {
  const tile = getCenterTile(game, i, j);
  if (!tile || tile.type !== 'pic') return false;

  if (game.mode === 'practice') {
    return (tile.pi === 1) === (i === 1);
  }
  return tile.pi === i && tile.pj === j;
}

export function checkIsSolved(game: GameState): boolean {
  for (let i = 0; i < game.N; i++) {
    for (let j = 0; j < game.N; j++) {
      if (!isCellOk(game, i, j)) return false;
    }
  }
  return true;
}

export function countMisplaced(game: GameState): number {
  let count = 0;
  for (let i = 0; i < game.N; i++) {
    for (let j = 0; j < game.N; j++) {
      if (!isCellOk(game, i, j)) count++;
    }
  }
  return count;
}

export function scrambleGame(game: GameState): void {
  const N = game.N;
  const isPractice = game.mode === 'practice';
  const targetCommutators = isPractice ? 2 : N === 3 ? 16 : 24;
  const offsets = [-2, -1, 1, 2];
  let guard = 0;

  while (guard < 60000) {
    let applied = 0;
    while (applied < targetCommutators && guard < 60000) {
      guard++;
      const i = Math.floor(Math.random() * N);
      const j = Math.floor(Math.random() * N);
      const a = offsets[Math.floor(Math.random() * offsets.length)];
      const b = offsets[Math.floor(Math.random() * offsets.length)];

      const seq: ['r' | 'c', number, number][] =
        Math.random() < 0.5
          ? [
              ['c', j, a],
              ['r', i, b],
              ['c', j, -a],
              ['r', i, -b],
            ]
          : [
              ['r', i, b],
              ['c', j, a],
              ['r', i, -b],
              ['c', j, -a],
            ];

      seq.forEach(([k, l, s]) => applyMoveSteps(game, k, l, s));

      if (centerAllPics(game)) {
        applied++;
      } else {
        // Revert commutator if a blank ended up inside frame
        seq
          .slice()
          .reverse()
          .forEach(([k, l, s]) => applyMoveSteps(game, k, l, -s));
      }
    }

    if (guard >= 60000) break;
    const minMisplaced = isPractice ? 2 : Math.ceil(N * N * 0.7);
    if (!checkIsSolved(game) && countMisplaced(game) >= minMisplaced) {
      break;
    }
  }

  // Ensure fresh array instances
  game.grid = game.grid.map((r) => [...r]);
  game.off = { r: [...game.off.r], c: [...game.off.c] };
  game.stack = [...game.stack];
}

export function getNextHintTile(game: GameState): Tile | null {
  if (game.solved || game.stack.length === 0) return null;
  const top = game.stack[game.stack.length - 1];
  const [kind, lane, d] = top;
  return game.tiles.find((t) => t.type === 'arrow' && t.kind === kind && t.lane === lane && t.d === -d) || null;
}
