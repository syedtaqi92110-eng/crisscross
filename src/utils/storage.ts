import { AppSettings, GameState, PlayerRecords } from '../types';

const STORAGE_KEYS = {
  SAVED_GAME: 'crisscross_v1_saved_game',
  SETTINGS: 'crisscross_v1_settings',
  RECORDS: 'crisscross_v1_records',
};

export const DEFAULT_SETTINGS: AppSettings = {
  sound: true,
  vibration: true,
  tourSeen: false,
  darkMode: true,
};

export const DEFAULT_RECORDS: PlayerRecords = {
  bestTime3: null,
  bestMoves3: null,
  bestTime4: null,
  bestMoves4: null,
  gamesCompleted: 0,
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // Ignore storage quota error
  }
}

export function loadRecords(): PlayerRecords {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) return DEFAULT_RECORDS;
    return { ...DEFAULT_RECORDS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_RECORDS;
  }
}

export function recordGameWin(N: number, elapsed: number, moves: number): { isNewBestTime: boolean; isNewBestMoves: boolean } {
  const current = loadRecords();
  let isNewBestTime = false;
  let isNewBestMoves = false;

  if (N === 3) {
    if (current.bestTime3 === null || elapsed < current.bestTime3) {
      current.bestTime3 = elapsed;
      isNewBestTime = true;
    }
    if (current.bestMoves3 === null || moves < current.bestMoves3) {
      current.bestMoves3 = moves;
      isNewBestMoves = true;
    }
  } else if (N === 4) {
    if (current.bestTime4 === null || elapsed < current.bestTime4) {
      current.bestTime4 = elapsed;
      isNewBestTime = true;
    }
    if (current.bestMoves4 === null || moves < current.bestMoves4) {
      current.bestMoves4 = moves;
      isNewBestMoves = true;
    }
  }

  current.gamesCompleted += 1;

  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(current));
  } catch {
    // Ignore error
  }

  return { isNewBestTime, isNewBestMoves };
}

export function loadSavedGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_GAME);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCurrentGame(game: GameState): void {
  try {
    const snapshot: GameState = {
      ...game,
      running: false,
      savedAt: Date.now(),
      grid: game.grid.map((row) => [...row]),
      off: {
        r: [...game.off.r],
        c: [...game.off.c],
      },
    };
    localStorage.setItem(STORAGE_KEYS.SAVED_GAME, JSON.stringify(snapshot));
  } catch {
    // Ignore error
  }
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVED_GAME);
  } catch {
    // Ignore error
  }
}

export function clearAllGameData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVED_GAME);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
  } catch {
    // Ignore error
  }
}
