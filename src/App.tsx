import React, { useState, useEffect, useCallback } from 'react';
import { GameState, ScreenId, AppSettings, PlayerRecords } from './types';
import { createNewGame, scrambleGame } from './game/engine';
import { generateSamples } from './utils/photos';
import {
  loadSavedGame,
  saveCurrentGame,
  clearSavedGame,
  loadSettings,
  saveSettings,
  loadRecords,
} from './utils/storage';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { DifficultyScreen } from './screens/DifficultyScreen';
import { PhotoScreen } from './screens/PhotoScreen';
import { CropScreen } from './screens/CropScreen';
import { GameScreen } from './screens/GameScreen';
import { TourModal } from './components/TourModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SettingsModal } from './components/SettingsModal';
import { RecordsModal } from './components/RecordsModal';
import { InstallModal } from './components/InstallModal';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('splash');
  const [navHistory, setNavHistory] = useState<ScreenId[]>([]);
  const [savedGame, setSavedGame] = useState<GameState | null>(null);
  const [currentGame, setCurrentGame] = useState<GameState | null>(null);
  const [pendingN, setPendingN] = useState<number>(3);
  const [pendingImg, setPendingImg] = useState<string | null>(null);

  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [records, setRecords] = useState<PlayerRecords>(loadRecords);

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRecordsOpen, setIsRecordsOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);

  // Desktop view preference: Phone Mockup Frame vs Adaptive Screen
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(false);

  // Load initial saved game and samples
  useEffect(() => {
    const saved = loadSavedGame();
    if (saved) setSavedGame(saved);

    const defaultSamples = generateSamples();
    if (defaultSamples.length > 0) {
      setPendingImg(defaultSamples[0].url);
    }
  }, []);

  // Navigation Helper
  const navigateTo = (screen: ScreenId, pushHistory = true) => {
    if (pushHistory && activeScreen !== screen) {
      setNavHistory((prev) => [...prev, activeScreen]);
    }
    setActiveScreen(screen);
  };

  const handleBack = () => {
    setNavHistory((prev) => {
      const copy = [...prev];
      const previous = copy.pop();
      if (previous) {
        setActiveScreen(previous);
      } else {
        setActiveScreen('home');
      }
      return copy;
    });
  };

  // Splash auto-proceed after 1.6s
  useEffect(() => {
    if (activeScreen === 'splash') {
      const timer = setTimeout(() => {
        proceedFromSplash();
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [activeScreen]);

  const proceedFromSplash = () => {
    setActiveScreen('home');
    if (!settings.tourSeen) {
      setIsTourOpen(true);
    }
  };

  // Auto-save & Auto-pause on tab switch or page close
  const autoSaveIfPlaying = useCallback(() => {
    if (currentGame && !currentGame.solved && currentGame.mode === 'play') {
      saveCurrentGame(currentGame);
      setSavedGame(loadSavedGame());
    }
  }, [currentGame]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        autoSaveIfPlaying();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', autoSaveIfPlaying);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', autoSaveIfPlaying);
    };
  }, [autoSaveIfPlaying]);

  // Update Settings Helper
  const handleUpdateSettings = (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleCloseTour = () => {
    setIsTourOpen(false);
    handleUpdateSettings({ tourSeen: true });
  };

  // Resume saved game
  const handleResumeSaved = () => {
    if (!savedGame) return;
    const restored: GameState = {
      ...savedGame,
      running: true,
      grid: savedGame.grid.map((r) => [...r]),
      off: { r: [...savedGame.off.r], c: [...savedGame.off.c] },
      stack: [...savedGame.stack],
    };
    setCurrentGame(restored);
    clearSavedGame();
    setSavedGame(null);
    navigateTo('game');
  };

  // Start new puzzle flow
  const handleStartNewFlow = () => {
    if (savedGame) {
      const confirmNew = window.confirm(
        'Starting a new puzzle will discard your saved unfinished puzzle. Continue?'
      );
      if (!confirmNew) return;
      clearSavedGame();
      setSavedGame(null);
    }
    navigateTo('difficulty');
  };

  const handleSelectDifficulty = (n: number) => {
    setPendingN(n);
    navigateTo('photo');
  };

  const handleSelectPhoto = (imgUrl: string) => {
    setPendingImg(imgUrl);
    navigateTo('crop');
  };

  // Immediate scramble so game is ready on frame 1
  const handleStartPuzzle = () => {
    const newG = createNewGame(pendingN, pendingImg, 'play');
    scrambleGame(newG);
    newG.running = true;
    setCurrentGame(newG);
    navigateTo('game');
  };

  const handleStartPractice = () => {
    const practiceG = createNewGame(3, null, 'practice');
    scrambleGame(practiceG);
    practiceG.running = true;
    setCurrentGame(practiceG);
    navigateTo('game');
  };

  const handleRestartSame = () => {
    if (!currentGame) return;
    const restarted = createNewGame(currentGame.N, currentGame.img, currentGame.mode);
    scrambleGame(restarted);
    restarted.running = true;
    setCurrentGame(restarted);
  };

  const handleSaveAndExit = () => {
    if (currentGame && !currentGame.solved && currentGame.mode === 'play') {
      saveCurrentGame(currentGame);
      setSavedGame(loadSavedGame());
    }
    setCurrentGame(null);
    setNavHistory([]);
    setActiveScreen('home');
  };

  const handleClearSaved = () => {
    clearSavedGame();
    setSavedGame(null);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#070b14] text-slate-100 overflow-hidden relative selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Premium Multi-layer Cosmic Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-amber-400/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Main Viewport Container */}
      <main
        className={`w-full h-full flex flex-col relative transition-all duration-300 z-10 ${
          deviceFrameMode
            ? 'max-w-[420px] max-h-[860px] rounded-[52px] border-[10px] border-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden bg-slate-950 ring-1 ring-white/10'
            : 'max-w-md mx-auto shadow-2xl bg-slate-950/95 backdrop-blur-2xl md:border-x md:border-white/10'
        }`}
      >
        {/* Device frame simulated home bar indicator on desktop frame mode */}
        {deviceFrameMode && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30 pointer-events-none border border-white/5" />
        )}

        {/* Dynamic Screen Renderer */}
        <div className="w-full h-full flex-1 relative overflow-hidden flex flex-col">
          {activeScreen === 'splash' && (
            <SplashScreen onProceed={proceedFromSplash} />
          )}

          {activeScreen === 'home' && (
            <HomeScreen
              savedGame={savedGame}
              onResumeSaved={handleResumeSaved}
              onNewPuzzle={handleStartNewFlow}
              onHowToPlay={() => setIsHowToPlayOpen(true)}
              onOpenRecords={() => {
                setRecords(loadRecords());
                setIsRecordsOpen(true);
              }}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenInstall={() => setIsInstallOpen(true)}
            />
          )}

          {activeScreen === 'difficulty' && (
            <DifficultyScreen
              onSelectDifficulty={handleSelectDifficulty}
              onBack={handleBack}
            />
          )}

          {activeScreen === 'photo' && (
            <PhotoScreen
              N={pendingN}
              onSelectImage={handleSelectPhoto}
              onBack={handleBack}
            />
          )}

          {activeScreen === 'crop' && pendingImg && (
            <CropScreen
              imageUrl={pendingImg}
              N={pendingN}
              onStartGame={handleStartPuzzle}
              onBack={handleBack}
            />
          )}

          {activeScreen === 'game' && currentGame && (
            <GameScreen
              game={currentGame}
              soundEnabled={settings.sound}
              vibrationEnabled={settings.vibration}
              onUpdateGame={(updated) => setCurrentGame({ ...updated })}
              onRestartSame={handleRestartSame}
              onChooseNewPhoto={() => {
                setCurrentGame(null);
                navigateTo('photo');
              }}
              onSaveAndExit={handleSaveAndExit}
              onGoHome={() => {
                setCurrentGame(null);
                setNavHistory([]);
                setActiveScreen('home');
              }}
              onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Desktop Mode Toggle Button for large screens */}
      <div className="hidden lg:flex fixed bottom-5 right-5 z-40 items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <button
          onClick={() => setDeviceFrameMode(false)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            !deviceFrameMode
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Adaptive Full-View"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Adaptive</span>
        </button>

        <button
          onClick={() => setDeviceFrameMode(true)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            deviceFrameMode
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Phone Frame Preview"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Device Frame</span>
        </button>
      </div>

      {/* Global Modals */}
      <TourModal isOpen={isTourOpen} onClose={handleCloseTour} />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        onStartPractice={handleStartPractice}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetTour={() => setIsTourOpen(true)}
        onClearSavedGame={handleClearSaved}
        hasSavedGame={savedGame !== null}
        onOpenInstall={() => setIsInstallOpen(true)}
      />

      <RecordsModal
        isOpen={isRecordsOpen}
        onClose={() => setIsRecordsOpen(false)}
        records={records}
      />

      <InstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />
    </div>
  );
}
