import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Tile } from '../types';
import {
  canMove,
  executeSlideMove,
  getNextHintTile,
  scrambleGame,
} from '../game/engine';
import { playBuzzSound, playMoveSound, playVictorySound, triggerVibration } from '../utils/sound';
import { recordGameWin } from '../utils/storage';
import { HUD } from '../components/HUD';
import { GameBoard } from '../components/GameBoard';
import { PeekModal } from '../components/PeekModal';
import { PauseSheet } from '../components/PauseSheet';
import { VictorySheet } from '../components/VictorySheet';
import { MiniDiagram } from '../components/MiniDiagram';
import { Lightbulb, Sparkles } from 'lucide-react';

interface GameScreenProps {
  game: GameState;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  onUpdateGame: (updated: GameState) => void;
  onRestartSame: () => void;
  onChooseNewPhoto: () => void;
  onSaveAndExit: () => void;
  onGoHome: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  game,
  soundEnabled,
  vibrationEnabled,
  onUpdateGame,
  onRestartSame,
  onChooseNewPhoto,
  onSaveAndExit,
  onGoHome,
  onOpenHowToPlay,
  onOpenSettings,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [shakingLane, setShakingLane] = useState<{ kind: 'r' | 'c'; lane: number } | null>(null);
  const [hintTileId, setHintTileId] = useState<number | null>(null);
  const [winRecord, setWinRecord] = useState<{ isNewBestTime: boolean; isNewBestMoves: boolean } | null>(null);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [nowElapsed, setNowElapsed] = useState(game.elapsed);

  // Show Toast
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg(null);
    }, 2200);
  }, []);

  // Timer Tick
  useEffect(() => {
    if (game.running && !game.solved && !isPaused) {
      const startTime = performance.now();
      const baseElapsed = game.elapsed;

      timerRef.current = setInterval(() => {
        const delta = performance.now() - startTime;
        setNowElapsed(baseElapsed + delta);
      }, 250);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      setNowElapsed(game.elapsed);
    }
  }, [game.running, game.solved, game.elapsed, isPaused]);

  // Initial auto-start if unstarted
  useEffect(() => {
    if (!game.running && !game.solved) {
      if (game.moves === 0 && game.stack.length === 0) {
        scrambleGame(game);
      }
      onUpdateGame({
        ...game,
        running: true,
      });
    }
  }, []);

  // Handle Pause
  const handlePause = () => {
    if (game.solved) return;
    setIsPaused(true);
    onUpdateGame({
      ...game,
      running: false,
      elapsed: nowElapsed,
    });
  };

  const handleResume = () => {
    setIsPaused(false);
    onUpdateGame({
      ...game,
      running: true,
      elapsed: nowElapsed,
    });
  };

  // Arrow click handler
  const handleArrowClick = (tile: Tile) => {
    if (game.solved || isPaused) return;

    setHintTileId(null);
    const kind = tile.kind!;
    const lane = tile.lane!;
    const d = tile.d!;

    if (!canMove(game, kind, lane, d)) {
      // Reached limit!
      playBuzzSound(soundEnabled);
      triggerVibration(vibrationEnabled, 120);
      setShakingLane({ kind, lane });
      setTimeout(() => setShakingLane(null), 360);
      showToast('Limit reached · each slide moves 2 spaces each way');
      return;
    }

    // Execute slide move with guaranteed immutable state
    const { nextGame, moved } = executeSlideMove(game, kind, lane, d);
    if (!moved) return;

    playMoveSound(soundEnabled);
    nextGame.elapsed = nowElapsed;

    if (nextGame.solved) {
      playVictorySound(soundEnabled);
      triggerVibration(vibrationEnabled, 250);
      let records = { isNewBestTime: false, isNewBestMoves: false };
      if (nextGame.mode === 'play') {
        records = recordGameWin(nextGame.N, nowElapsed, nextGame.moves);
      }
      setWinRecord(records);
    }

    onUpdateGame(nextGame);
  };

  // Practice Hint Handler
  const handleShowHint = () => {
    const hint = getNextHintTile(game);
    if (hint) {
      setHintTileId(hint.id);
      showToast('Hint: tap the pulsing glowing arrow');
    } else {
      showToast('No hint moves available');
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between select-none relative overflow-hidden bg-slate-950">
      {/* Top HUD */}
      <HUD
        elapsedMs={nowElapsed}
        moves={game.moves}
        pieceCount={game.N * game.N}
        isPractice={game.mode === 'practice'}
        onPause={handlePause}
        onPeek={() => setIsPeeking(true)}
        isPeeking={isPeeking}
        onRestart={onRestartSame}
      />

      {/* Main Board Center */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 relative">
        <GameBoard
          game={game}
          onArrowClick={handleArrowClick}
          hintTileId={hintTileId}
          shakingLane={shakingLane}
        />
      </div>

      {/* Footer Instructions / Practice Goal */}
      <div className="w-full px-6 py-3.5 bg-slate-900/90 backdrop-blur-md border-t border-white/10 text-center text-xs text-slate-300">
        {game.mode === 'practice' ? (
          <div className="flex items-center justify-between max-w-sm mx-auto">
            <div className="flex items-center gap-2.5 text-left">
              <div className="p-1 bg-slate-950 rounded-lg border border-slate-800">
                <MiniDiagram N={3} isPractice={true} size={32} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-xs">Target Goal</span>
                <span className="text-[11px] text-amber-400">Dark stripe across middle</span>
              </div>
            </div>

            <button
              onClick={handleShowHint}
              className="py-1.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Lightbulb className="w-3.5 h-3.5 fill-current" />
              <span>Hint</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tap any perimeter arrow to slide · Rebuild inside the gold frame</span>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-amber-500/40 text-amber-200 text-xs font-bold shadow-2xl z-40 animate-in fade-in slide-in-from-bottom-2 duration-150 pointer-events-none">
          {toastMsg}
        </div>
      )}

      {/* Peek Reference Modal */}
      <PeekModal
        isOpen={isPeeking}
        onClose={() => setIsPeeking(false)}
        imageUrl={game.img}
        N={game.N}
      />

      {/* Pause Menu Sheet */}
      <PauseSheet
        isOpen={isPaused}
        onResume={handleResume}
        onRestart={() => {
          setIsPaused(false);
          onRestartSame();
        }}
        onNewPhoto={() => {
          setIsPaused(false);
          onChooseNewPhoto();
        }}
        onSaveExit={() => {
          setIsPaused(false);
          onSaveAndExit();
        }}
        onHowToPlay={() => {
          setIsPaused(false);
          onOpenHowToPlay();
        }}
        onSettings={() => {
          setIsPaused(false);
          onOpenSettings();
        }}
        elapsedMs={nowElapsed}
        moves={game.moves}
        pieceCount={game.N * game.N}
      />

      {/* Victory Celebration Sheet */}
      <VictorySheet
        isOpen={game.solved}
        onPlayAgain={onRestartSame}
        onNewPhoto={onChooseNewPhoto}
        onGoHome={onGoHome}
        elapsedMs={nowElapsed}
        moves={game.moves}
        pieceCount={game.N * game.N}
        isNewBestTime={winRecord?.isNewBestTime}
        isNewBestMoves={winRecord?.isNewBestMoves}
        isPractice={game.mode === 'practice'}
      />
    </div>
  );
};
