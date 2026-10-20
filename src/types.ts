export type GameMode = 'play' | 'practice';

export type ScreenId =
  | 'splash'
  | 'home'
  | 'difficulty'
  | 'photo'
  | 'crop'
  | 'game'
  | 'learn'
  | 'settings'
  | 'records';

export interface Tile {
  id: number;
  type: 'pic' | 'arrow' | 'blank';
  pi?: number; // Target row index inside frame (0..N-1)
  pj?: number; // Target column index inside frame (0..N-1)
  kind?: 'r' | 'c';
  lane?: number;
  d?: number; // -1 (slide left/up) or +1 (slide right/down)
  dir?: 'up' | 'down' | 'left' | 'right';
}

export interface GameState {
  N: number; // 3 or 4
  L: number; // N + 2*A (where A=5, so 13 or 14)
  img: string | null;
  mode: GameMode;
  tiles: Tile[];
  grid: (number | null)[][];
  off: {
    r: number[];
    c: number[];
  };
  elapsed: number;
  moves: number;
  running: boolean;
  solved: boolean;
  stack: [ 'r' | 'c', number, number ][];
  savedAt?: number;
}

export interface PlayerRecords {
  bestTime3: number | null;
  bestMoves3: number | null;
  bestTime4: number | null;
  bestMoves4: number | null;
  gamesCompleted: number;
}

export interface AppSettings {
  sound: boolean;
  vibration: boolean;
  tourSeen: boolean;
  darkMode: boolean;
}

export interface SamplePhoto {
  id: string;
  name: string;
  category: string;
  url: string;
}
