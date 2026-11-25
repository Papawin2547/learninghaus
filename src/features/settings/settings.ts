// หน้า Settings: จัดการการเปลี่ยนภาษา ธีมสี ขนาดตัวอักษร เสียงเอฟเฟกต์ควิซ และทางลัดระบบ
namespace LearningHausSettings {
  export type ThemeMode = "light" | "warm" | "contrast";
  export type TextScale = "compact" | "normal" | "large";
  export type EyeCareMode = "off" | "warm" | "sepia" | "dim";
  export type QuizMusicTrackId = "clockwork" | "think-fast" | "brainwave" | "final-round";

  export type Preferences = {
    theme: ThemeMode;
    scale: TextScale;
    eyeCareMode: EyeCareMode;
    eyeCareIntensity: number;
    reduceMotion: boolean;
    soundEffects: boolean;
    backgroundMusic: boolean;
    quizMusicTrack: QuizMusicTrackId;
    showAnswerReview: boolean;
  };

  const STORAGE_KEY = "learninghaus.settings.v1";
  const DEMO_UNLOCK_KEY = "learninghaus.pixelCat.demoUnlock.v1";
  const DEMO_COMPLETE_CHAPTERS_KEY = "learninghaus.quiz.demoCompleteAllChapters.v1";

  const defaultPreferences = (): Preferences => ({
    theme: "light",
    scale: "normal",
    eyeCareMode: "off",
    eyeCareIntensity: 55,
    reduceMotion: false,
    soundEffects: true,
    backgroundMusic: true,
    quizMusicTrack: "clockwork",
    showAnswerReview: true
  });

  let prefs: Preferences = defaultPreferences();
  let sharedAudioCtx: AudioContext | null = null;
  let lastClickSoundAt = 0;

  export const getPreferences = (): Preferences => ({ ...prefs });

  const getAudioContext = (): AudioContext | null => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
        sharedAudioCtx = new AudioCtx();
      }
      if (sharedAudioCtx.state === "suspended") {
        void sharedAudioCtx.resume().catch(() => {});
      }
      return sharedAudioCtx;
    } catch {
      return null;
    }
  };

  // ===========================================================================
  // CHAPTER BACKGROUND MUSIC (8 Distinct Multi-Voice Procedural Soundtracks)
  // Cross-fades smoothly to match the chapter currently scrolled into view!
  // ===========================================================================
  type ChapterBgmTrack = {
    chapter: number;
    title: string;
    stepMs: number;
    leadWave: OscillatorType;
    bassWave: OscillatorType;
    padWave: OscillatorType;
    leadGain: number;
    bassGain: number;
    padGain: number;
    leadDecay: number;
    filterCutoff: number;
    hasTick?: boolean;
    // 16-step melody & bass in MIDI note numbers (0 = rest)
    melody: readonly number[];
    bass: readonly number[];
    padChord: readonly number[];
  };

  const CHAPTER_BGM_TRACKS: Record<number, ChapterBgmTrack> = {
    1: {
      // Chapter 1: Sunflower Meadow — Warm sunny harp/lyre arpeggio & gentle flute (C Major Pentatonic)
      chapter: 1,
      title: "Sunflower Meadow Breeze",
      stepMs: 360,
      leadWave: "sine",
      bassWave: "triangle",
      padWave: "sine",
      leadGain: 0.032,
      bassGain: 0.025,
      padGain: 0.014,
      leadDecay: 0.55,
      filterCutoff: 1800,
      melody: [72, 76, 79, 81, 79, 76, 74, 72, 76, 79, 84, 81, 79, 76, 74, 0],
      bass: [48, 0, 55, 0, 57, 0, 52, 0, 53, 0, 48, 0, 50, 0, 55, 0],
      padChord: [60, 64, 67]
    },
    2: {
      // Chapter 2: Obsidian Underworld — Ominous dark dungeon bass ostinato & tension bells (D Harmonic Minor)
      chapter: 2,
      title: "Forbidden Obsidian Vault",
      stepMs: 390,
      leadWave: "triangle",
      bassWave: "sawtooth",
      padWave: "triangle",
      leadGain: 0.026,
      bassGain: 0.028,
      padGain: 0.015,
      leadDecay: 0.42,
      filterCutoff: 780,
      melody: [62, 0, 63, 62, 0, 69, 68, 0, 65, 0, 63, 62, 0, 61, 62, 0],
      bass: [38, 38, 45, 38, 39, 38, 37, 38, 38, 38, 45, 38, 43, 41, 37, 38],
      padChord: [50, 53, 57]
    },
    3: {
      // Chapter 3: Siege Fortress — Heroic knight fanfare & marching war-drums (G Dorian)
      chapter: 3,
      title: "Amber Citadel March",
      stepMs: 300,
      leadWave: "triangle",
      bassWave: "sawtooth",
      padWave: "triangle",
      leadGain: 0.03,
      bassGain: 0.026,
      padGain: 0.013,
      leadDecay: 0.34,
      filterCutoff: 1450,
      melody: [67, 0, 67, 70, 74, 0, 72, 70, 74, 77, 79, 74, 76, 72, 74, 0],
      bass: [43, 50, 43, 50, 46, 53, 46, 53, 48, 55, 48, 55, 43, 50, 43, 0],
      padChord: [55, 58, 62]
    },
    4: {
      // Chapter 4: Prism Observatory — Crystalline music-box celesta chimes & starlight echo (A Lydian)
      chapter: 4,
      title: "Twilight Prism Chimes",
      stepMs: 340,
      leadWave: "sine",
      bassWave: "sine",
      padWave: "sine",
      leadGain: 0.034,
      bassGain: 0.022,
      padGain: 0.015,
      leadDecay: 0.65,
      filterCutoff: 2400,
      melody: [81, 85, 88, 87, 85, 80, 81, 76, 81, 85, 92, 88, 87, 85, 80, 81],
      bass: [57, 0, 64, 0, 59, 0, 66, 0, 57, 0, 64, 0, 52, 0, 59, 0],
      padChord: [69, 73, 76]
    },
    5: {
      // Chapter 5: Cyber-Arcane Void — Pulsing synthwave arpeggiator & astral lead (E Phrygian Dominant)
      chapter: 5,
      title: "Astral Neural Pulse",
      stepMs: 220,
      leadWave: "sawtooth",
      bassWave: "sawtooth",
      padWave: "triangle",
      leadGain: 0.022,
      bassGain: 0.026,
      padGain: 0.014,
      leadDecay: 0.24,
      filterCutoff: 1150,
      melody: [64, 68, 71, 72, 71, 68, 76, 71, 64, 68, 71, 74, 72, 71, 68, 65],
      bass: [40, 40, 52, 40, 41, 41, 53, 41, 40, 40, 52, 40, 43, 43, 41, 40],
      padChord: [52, 56, 59]
    },
    6: {
      // Chapter 6: Emerald Conservatory — Bouncy woodland pizzicato & warm marimba (F Major)
      chapter: 6,
      title: "Emerald Forest Canopy",
      stepMs: 270,
      leadWave: "triangle",
      bassWave: "triangle",
      padWave: "sine",
      leadGain: 0.032,
      bassGain: 0.025,
      padGain: 0.012,
      leadDecay: 0.22,
      filterCutoff: 1750,
      melody: [65, 69, 72, 0, 74, 72, 69, 0, 70, 74, 77, 76, 74, 72, 69, 67],
      bass: [53, 0, 60, 0, 50, 0, 57, 0, 46, 0, 53, 0, 48, 0, 55, 0],
      padChord: [65, 69, 72]
    },
    7: {
      // Chapter 7: Riverside Village — Warm flowing classical river counterpoint (Bb Major)
      chapter: 7,
      title: "Riverside Village Dawn",
      stepMs: 350,
      leadWave: "triangle",
      bassWave: "triangle",
      padWave: "sine",
      leadGain: 0.03,
      bassGain: 0.025,
      padGain: 0.015,
      leadDecay: 0.48,
      filterCutoff: 1650,
      melody: [70, 74, 77, 75, 74, 72, 70, 65, 67, 70, 75, 74, 72, 70, 69, 70],
      bass: [46, 0, 53, 0, 55, 0, 50, 0, 51, 0, 46, 0, 48, 53, 46, 0],
      padChord: [58, 62, 65]
    },
    8: {
      // Chapter 8: Snowy Peak — Shimmering alpine aurora finale hymn (D Major)
      chapter: 8,
      title: "Snowy Peak Aurora",
      stepMs: 330,
      leadWave: "triangle",
      bassWave: "triangle",
      padWave: "sine",
      leadGain: 0.033,
      bassGain: 0.026,
      padGain: 0.016,
      leadDecay: 0.56,
      filterCutoff: 2100,
      melody: [74, 78, 81, 86, 85, 81, 79, 78, 76, 79, 83, 81, 78, 76, 74, 0],
      bass: [50, 0, 57, 0, 59, 0, 54, 0, 55, 0, 50, 0, 57, 0, 50, 0],
      padChord: [62, 66, 69]
    }
  };

  // เพลงประกอบเกมตอบคำถาม (Quiz Multiple-Choice Game Tracks) — เพลงหลัก: Clockwork Logic (Puzzle Sprint)
  type QuizGameBgmTrack = ChapterBgmTrack & { id: QuizMusicTrackId };

  const QUIZ_GAME_BGM_TRACKS: readonly QuizGameBgmTrack[] = [
    {
      id: "clockwork",
      chapter: 0,
      title: "Clockwork Logic (Puzzle Sprint)",
      stepMs: 195,
      leadWave: "sine",
      bassWave: "triangle",
      padWave: "sine",
      leadGain: 0.034,
      bassGain: 0.024,
      padGain: 0.011,
      leadDecay: 0.22,
      filterCutoff: 2350,
      hasTick: true,
      // Crisp clever pizzicato puzzle thinking rhythm (G Major) — เพลงหลักหน้ามัลติช้อย
      melody: [79, 76, 74, 79, 0, 81, 79, 74, 76, 79, 83, 81, 79, 76, 74, 0],
      bass: [43, 0, 50, 0, 47, 0, 50, 0, 48, 0, 52, 0, 50, 47, 45, 0],
      padChord: [55, 59, 62]
    },
    {
      id: "think-fast",
      chapter: 0,
      title: "Think Fast! (Trivia Groove)",
      stepMs: 185,
      leadWave: "triangle",
      bassWave: "triangle",
      padWave: "sine",
      leadGain: 0.03,
      bassGain: 0.026,
      padGain: 0.011,
      leadDecay: 0.2,
      filterCutoff: 2100,
      hasTick: true,
      // Upbeat game-show marimba pluck groove (C Major / A Minor)
      melody: [72, 0, 76, 79, 0, 76, 74, 72, 74, 0, 77, 81, 79, 76, 74, 0],
      bass: [48, 0, 55, 0, 57, 0, 52, 0, 50, 0, 57, 0, 55, 0, 55, 48],
      padChord: [60, 64, 67]
    },
    {
      id: "brainwave",
      chapter: 0,
      title: "Brainwave Pulse (Arcade Quiz)",
      stepMs: 165,
      leadWave: "square",
      bassWave: "triangle",
      padWave: "sine",
      leadGain: 0.015,
      bassGain: 0.025,
      padGain: 0.01,
      leadDecay: 0.16,
      filterCutoff: 1750,
      hasTick: true,
      // Energetic bright arcade trivia arpeggio (D Major)
      melody: [74, 78, 81, 0, 78, 81, 86, 0, 83, 81, 78, 76, 78, 81, 74, 0],
      bass: [50, 0, 57, 50, 54, 0, 57, 54, 55, 0, 59, 55, 57, 55, 54, 50],
      padChord: [62, 66, 69]
    },
    {
      id: "final-round",
      chapter: 0,
      title: "Final Round (Boss Challenge)",
      stepMs: 160,
      leadWave: "sawtooth",
      bassWave: "sawtooth",
      padWave: "triangle",
      leadGain: 0.018,
      bassGain: 0.025,
      padGain: 0.012,
      leadDecay: 0.18,
      filterCutoff: 1450,
      hasTick: true,
      // Driving high-stakes final-round game-show pulse (E Minor)
      melody: [76, 0, 79, 76, 83, 0, 81, 79, 78, 0, 79, 81, 83, 81, 79, 76],
      bass: [40, 40, 47, 40, 43, 43, 47, 43, 45, 45, 48, 45, 47, 47, 45, 43],
      padChord: [52, 55, 59]
    }
  ];

  const getQuizTrackIndexById = (trackId: QuizMusicTrackId | string | undefined): number => {
    const idx = QUIZ_GAME_BGM_TRACKS.findIndex((track) => track.id === trackId);
    return idx >= 0 ? idx : 0;
  };

  const midiToHz = (midi: number): number => 440 * Math.pow(2, (midi - 69) / 12);

  let activeBgmChapter = 1;
  let bgmMode: "map" | "quiz-game" = "map";
  let activeQuizTrackIndex = 0;
  let bgmSceneActive = false;
  let bgmStepIndex = 0;
  let bgmTimerId: number | null = null;
  let bgmMasterGain: GainNode | null = null;
  let bgmFilterNode: BiquadFilterNode | null = null;

  const getActiveTrack = (): ChapterBgmTrack => {
    if (bgmMode === "quiz-game") {
      return QUIZ_GAME_BGM_TRACKS[activeQuizTrackIndex % QUIZ_GAME_BGM_TRACKS.length] || QUIZ_GAME_BGM_TRACKS[0];
    }
    return CHAPTER_BGM_TRACKS[activeBgmChapter] || CHAPTER_BGM_TRACKS[1];
  };

  const dispatchBgmUpdated = (): void => {
    const track = getActiveTrack();
    window.dispatchEvent(
      new CustomEvent("learninghaus:bgm-updated", {
        detail: {
          mode: bgmMode,
          chapter: activeBgmChapter,
          quizTrackIndex: activeQuizTrackIndex,
          quizTrackCount: QUIZ_GAME_BGM_TRACKS.length,
          title: track.title,
          enabled: prefs.backgroundMusic
        }
      })
    );
  };

  const ensureBgmBus = (ctx: AudioContext): { master: GainNode; filter: BiquadFilterNode } => {
    if (!bgmMasterGain || !bgmFilterNode) {
      bgmFilterNode = ctx.createBiquadFilter();
      bgmFilterNode.type = "lowpass";
      bgmFilterNode.frequency.setValueAtTime(1600, ctx.currentTime);

      bgmMasterGain = ctx.createGain();
      bgmMasterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      bgmFilterNode.connect(bgmMasterGain);
      bgmMasterGain.connect(ctx.destination);
    }
    return { master: bgmMasterGain, filter: bgmFilterNode };
  };

  const triggerBgmStep = (): void => {
    if (!prefs.backgroundMusic || !bgmSceneActive) return;
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== "running") return;

    const track = getActiveTrack();
    const { filter } = ensureBgmBus(ctx);
    const now = ctx.currentTime;

    filter.frequency.setTargetAtTime(track.filterCutoff, now, 0.15);

    const step = bgmStepIndex % 16;
    const leadMidi = track.melody[step];
    const bassMidi = track.bass[step];

    // Optional soft rhythmic trivia-game pulse tick on off-beats/beats
    if (track.hasTick && step % 2 === 0) {
      const tickOsc = ctx.createOscillator();
      const tickGain = ctx.createGain();
      tickOsc.type = "triangle";
      tickOsc.frequency.setValueAtTime(step % 4 === 0 ? 1320 : 1980, now);
      tickGain.gain.setValueAtTime(0.0001, now);
      tickGain.gain.linearRampToValueAtTime(step % 4 === 0 ? 0.0075 : 0.0045, now + 0.004);
      tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
      tickOsc.connect(tickGain);
      tickGain.connect(filter);
      tickOsc.start(now);
      tickOsc.stop(now + 0.055);
    }

    // 1. Lead melody note with soft fade-in and smooth exponential decay
    if (leadMidi > 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = track.leadWave;
      osc.frequency.setValueAtTime(midiToHz(leadMidi), now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(track.leadGain, now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + track.leadDecay);
      osc.connect(gain);
      gain.connect(filter);
      osc.start(now);
      osc.stop(now + track.leadDecay + 0.02);
    }

    // 2. Bass note
    if (bassMidi > 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = track.bassWave;
      osc.frequency.setValueAtTime(midiToHz(bassMidi), now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(track.bassGain, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
      osc.connect(gain);
      gain.connect(filter);
      osc.start(now);
      osc.stop(now + 0.38);
    }

    // 3. Warm harmonic pad chord every 4 steps
    if (step % 4 === 0) {
      const chordNote = track.padChord[(step / 4) % track.padChord.length];
      if (chordNote > 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = track.padWave;
        osc.frequency.setValueAtTime(midiToHz(chordNote), now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(track.padGain, now + 0.14);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (track.stepMs * 4) / 1000);
        osc.connect(gain);
        gain.connect(filter);
        osc.start(now);
        osc.stop(now + (track.stepMs * 4) / 1000 + 0.04);
      }
    }

    bgmStepIndex = (bgmStepIndex + 1) % 16;
  };

  const scheduleBgmLoop = (): void => {
    if (bgmTimerId !== null) {
      window.clearInterval(bgmTimerId);
      bgmTimerId = null;
    }
    if (!prefs.backgroundMusic || !bgmSceneActive) return;
    const track = getActiveTrack();
    const ctx = getAudioContext();
    if (ctx) {
      const { master } = ensureBgmBus(ctx);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), ctx.currentTime);
      master.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.38);
    }
    triggerBgmStep();
    bgmTimerId = window.setInterval(triggerBgmStep, track.stepMs);
  };

  export const stopBgm = (): void => {
    bgmSceneActive = false;
    if (bgmTimerId !== null) {
      window.clearInterval(bgmTimerId);
      bgmTimerId = null;
    }
    if (sharedAudioCtx && bgmMasterGain && sharedAudioCtx.state === "running") {
      const now = sharedAudioCtx.currentTime;
      bgmMasterGain.gain.cancelScheduledValues(now);
      bgmMasterGain.gain.setValueAtTime(Math.max(0.0001, bgmMasterGain.gain.value), now);
      bgmMasterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    }
  };

  const crossFadeAndRestartBgm = (): void => {
    bgmStepIndex = 0;
    if (sharedAudioCtx && bgmMasterGain && sharedAudioCtx.state === "running") {
      const now = sharedAudioCtx.currentTime;
      bgmMasterGain.gain.cancelScheduledValues(now);
      bgmMasterGain.gain.setValueAtTime(0.12, now);
      bgmMasterGain.gain.linearRampToValueAtTime(1.0, now + 0.4);
    }
    scheduleBgmLoop();
  };

  export const setBgmChapter = (chapter: number, forceStart = false): void => {
    const clamped = Math.max(1, Math.min(8, Math.round(chapter) || 1));
    const chapterChanged = clamped !== activeBgmChapter;
    activeBgmChapter = clamped;
    bgmSceneActive = true;
    if (bgmMode === "quiz-game") {
      // Do not interrupt active quiz-game soundtrack when background map scrolls
      return;
    }
    dispatchBgmUpdated();
    if (!prefs.backgroundMusic) return;
    if (chapterChanged || forceStart || bgmTimerId === null) {
      if (chapterChanged) crossFadeAndRestartBgm();
      else scheduleBgmLoop();
    }
  };

  export const setQuizGameBgm = (_stageIndex = 0, _isBossStage = false): void => {
    const nextTrackIdx = getQuizTrackIndexById(prefs.quizMusicTrack);
    const changed = bgmMode !== "quiz-game" || activeQuizTrackIndex !== nextTrackIdx;
    bgmMode = "quiz-game";
    activeQuizTrackIndex = nextTrackIdx;
    bgmSceneActive = true;
    dispatchBgmUpdated();
    if (!prefs.backgroundMusic) return;
    if (changed || bgmTimerId === null) {
      crossFadeAndRestartBgm();
    }
  };

  export const setQuizMusicTrack = (trackId: QuizMusicTrackId): void => {
    const nextIdx = getQuizTrackIndexById(trackId);
    const resolvedId = QUIZ_GAME_BGM_TRACKS[nextIdx].id;
    prefs.quizMusicTrack = resolvedId;
    activeQuizTrackIndex = nextIdx;
    LearningHausAccountStorage.writeJson(STORAGE_KEY, prefs);
    dispatchBgmUpdated();
    if (bgmMode === "quiz-game" && prefs.backgroundMusic && bgmSceneActive) {
      crossFadeAndRestartBgm();
    }
  };

  export const nextQuizGameTrack = (): { title: string; index: number } => {
    bgmMode = "quiz-game";
    activeQuizTrackIndex = (activeQuizTrackIndex + 1) % QUIZ_GAME_BGM_TRACKS.length;
    prefs.quizMusicTrack = QUIZ_GAME_BGM_TRACKS[activeQuizTrackIndex].id;
    LearningHausAccountStorage.writeJson(STORAGE_KEY, prefs);
    bgmSceneActive = true;
    dispatchBgmUpdated();
    if (prefs.backgroundMusic) {
      crossFadeAndRestartBgm();
    }
    const track = getActiveTrack();
    return { title: track.title, index: activeQuizTrackIndex };
  };

  export const setPartyBgm = (phase: "hub" | "lobby" | "play" | "final" | "off"): void => {
    if (phase === "off") {
      const quizView = document.getElementById("quiz-view");
      if (quizView && !quizView.hidden) {
        returnToMapBgm();
      } else {
        bgmSceneActive = false;
        stopBgm();
        dispatchBgmUpdated();
      }
      return;
    }
    const targetTrack: QuizMusicTrackId =
      phase === "final" ? "final-round" : phase === "play" ? "brainwave" : "think-fast";
    const nextIdx = getQuizTrackIndexById(targetTrack);
    const changed = bgmMode !== "quiz-game" || activeQuizTrackIndex !== nextIdx;
    bgmMode = "quiz-game";
    activeQuizTrackIndex = nextIdx;
    bgmSceneActive = true;
    dispatchBgmUpdated();
    if (!prefs.backgroundMusic) return;
    if (changed || bgmTimerId === null) {
      crossFadeAndRestartBgm();
    }
  };

  export const toggleSoundEffects = (): boolean => {
    prefs.soundEffects = !prefs.soundEffects;
    LearningHausAccountStorage.writeJson(STORAGE_KEY, prefs);
    return prefs.soundEffects;
  };

  export const returnToMapBgm = (): void => {
    const alreadyPlayingMap = bgmMode === "map" && bgmSceneActive && bgmTimerId !== null;
    if (alreadyPlayingMap) return;
    bgmMode = "map";
    bgmSceneActive = true;
    dispatchBgmUpdated();
    if (prefs.backgroundMusic) {
      crossFadeAndRestartBgm();
    }
  };

  export const toggleBackgroundMusic = (): boolean => {
    prefs.backgroundMusic = !prefs.backgroundMusic;
    LearningHausAccountStorage.writeJson(STORAGE_KEY, prefs);
    if (prefs.backgroundMusic) {
      bgmSceneActive = true;
      scheduleBgmLoop();
    } else {
      stopBgm();
      bgmSceneActive = true;
    }
    dispatchBgmUpdated();
    return prefs.backgroundMusic;
  };

  export const getBgmState = (): {
    mode: "map" | "quiz-game";
    chapter: number;
    quizTrackIndex: number;
    title: string;
    enabled: boolean;
  } => ({
    mode: bgmMode,
    chapter: activeBgmChapter,
    quizTrackIndex: activeQuizTrackIndex,
    title: getActiveTrack().title,
    enabled: prefs.backgroundMusic
  });

  // สร้างเสียงเอฟเฟกต์แบบ Retro Pixel Synth ด้วย Web Audio API โดยไม่ต้องพึ่งไฟล์เสียงภายนอก
  export const playTone = (
    kind: "click" | "correct" | "wrong" | "complete" | "victory" | "notify" | "notify-important" | "ready" | "react" | "start" | "double" | "tick"
  ): void => {
    const isNotif = kind === "notify" || kind === "notify-important";
    if (!isNotif && !prefs.soundEffects) return;
    if (kind === "click") {
      const nowMs = performance.now();
      if (nowMs - lastClickSoundAt < 35) return;
      lastClickSoundAt = nowMs;
    }
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      if (isNotif) {
        const scheduleBell = (): void => {
          const t0 = ctx.currentTime + 0.01;
          const playBellNote = (
            freq: number,
            startOffset: number,
            duration: number,
            peakGain: number,
            wave: OscillatorType = "sine"
          ): void => {
            const bOsc = ctx.createOscillator();
            const bGain = ctx.createGain();
            bOsc.type = wave;
            bOsc.frequency.setValueAtTime(freq, t0 + startOffset);
            bGain.gain.setValueAtTime(0.0001, t0 + startOffset);
            bGain.gain.linearRampToValueAtTime(peakGain, t0 + startOffset + 0.012);
            bGain.gain.exponentialRampToValueAtTime(0.0001, t0 + startOffset + duration);
            bOsc.connect(bGain);
            bGain.connect(ctx.destination);
            bOsc.start(t0 + startOffset);
            bOsc.stop(t0 + startOffset + duration + 0.04);
          };

          if (kind === "notify-important") {
            // Golden important alert: bright shimmering 3-note chime (E5 -> G#5 -> B5 + E6 bell harmonic)
            playBellNote(659.25, 0.0, 0.24, 0.22, "triangle");
            playBellNote(830.61, 0.09, 0.26, 0.24, "triangle");
            playBellNote(987.77, 0.18, 0.48, 0.26, "sine");
            playBellNote(1318.51, 0.19, 0.52, 0.12, "sine");
            playBellNote(1975.53, 0.2, 0.36, 0.06, "sine");
          } else {
            // Standard alert: crisp gentle 2-note ding (G5 -> C6)
            playBellNote(783.99, 0.0, 0.2, 0.2, "sine");
            playBellNote(1046.5, 0.09, 0.36, 0.22, "sine");
            playBellNote(1567.98, 0.095, 0.26, 0.07, "triangle");
          }
        };

        if (ctx.state === "suspended") {
          void ctx.resume().then(scheduleBell).catch(() => {});
        } else {
          scheduleBell();
        }
        return;
      }

      const now = ctx.currentTime;

      const fireNote = (
        freq: number,
        startOffset: number,
        duration: number,
        peakGain: number,
        wave: OscillatorType = "triangle"
      ): void => {
        const vOsc = ctx.createOscillator();
        const vGain = ctx.createGain();
        vOsc.type = wave;
        vOsc.frequency.setValueAtTime(freq, now + startOffset);
        vGain.gain.setValueAtTime(0.0001, now + startOffset);
        vGain.gain.linearRampToValueAtTime(peakGain, now + startOffset + 0.014);
        vGain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration);
        vOsc.connect(vGain);
        vGain.connect(ctx.destination);
        vOsc.start(now + startOffset);
        vOsc.stop(now + startOffset + duration + 0.03);
      };

      if (kind === "ready") {
        fireNote(523.25, 0.0, 0.12, 0.1, "triangle");
        fireNote(783.99, 0.07, 0.18, 0.11, "sine");
        return;
      }
      if (kind === "react") {
        const rOsc = ctx.createOscillator();
        const rGain = ctx.createGain();
        rOsc.type = "sine";
        rOsc.frequency.setValueAtTime(587.33, now);
        rOsc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.085);
        rGain.gain.setValueAtTime(0.0001, now);
        rGain.gain.linearRampToValueAtTime(0.11, now + 0.012);
        rGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
        rOsc.connect(rGain);
        rGain.connect(ctx.destination);
        rOsc.start(now);
        rOsc.stop(now + 0.14);
        return;
      }
      if (kind === "start") {
        fireNote(523.25, 0.0, 0.11, 0.11, "triangle");
        fireNote(659.25, 0.08, 0.11, 0.115, "triangle");
        fireNote(783.99, 0.16, 0.12, 0.12, "triangle");
        fireNote(1046.5, 0.24, 0.28, 0.13, "sine");
        return;
      }
      if (kind === "double") {
        fireNote(698.46, 0.0, 0.14, 0.11, "triangle");
        fireNote(880.0, 0.08, 0.16, 0.12, "triangle");
        fireNote(1046.5, 0.16, 0.22, 0.13, "sine");
        fireNote(1396.91, 0.22, 0.34, 0.1, "sine");
        return;
      }
      if (kind === "tick") {
        fireNote(920, 0.0, 0.045, 0.065, "triangle");
        return;
      }

      if (kind === "complete" || kind === "victory") {
        // เสียงชนะ / เล่นจบด่าน (Triumphant Victory Fanfare) — เมโลดี้สดใสพร้อมคอร์ดประสานและประกายระฆัง
        // Fanfare lead: C5 -> E5 -> G5 -> C6 (hold), G5 -> C6 (triumphant finish!)
        const leadNotes: readonly [number, number, number, number][] = [
          [523.25, 0.0, 0.14, 0.12],
          [659.25, 0.11, 0.14, 0.125],
          [783.99, 0.22, 0.16, 0.13],
          [1046.5, 0.34, 0.26, 0.14],
          [783.99, 0.56, 0.14, 0.115],
          [1046.5, 0.68, 0.62, 0.15]
        ];
        leadNotes.forEach(([freq, offset, dur, peak]) => {
          fireNote(freq, offset, dur, peak, "triangle");
        });

        // Sparkling high chime overtone on the final triumphant chord
        fireNote(1318.51, 0.69, 0.56, 0.055, "sine");
        fireNote(1567.98, 0.72, 0.52, 0.04, "sine");

        // Warm C-major bass/harmony foundation
        fireNote(261.63, 0.34, 0.26, 0.065, "sine");
        fireNote(261.63, 0.68, 0.62, 0.075, "sine");
        fireNote(392.0, 0.68, 0.6, 0.06, "sine");
        fireNote(523.25, 0.68, 0.58, 0.055, "sine");
        return;
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (kind === "click") {
        // Soft envelope ramp-in (fade in) and smooth exponential fade-out so there is no abrupt cut/pop
        osc.type = "sine";
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.08);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.075, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.115);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (kind === "correct") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.07);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.11, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.285);
      } else {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(164.81, now + 0.09);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.09, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.29);
        osc.start(now);
        osc.stop(now + 0.295);
      }
    } catch {
      // Ignore audio context restrictions.
    }
  };

  let clickSoundListenerBound = false;
  const bindGlobalButtonClickSound = (): void => {
    if (clickSoundListenerBound) return;
    clickSoundListenerBound = true;
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target as HTMLElement | null;
        if (!target) return;
        const clickable = target.closest<HTMLElement>(
          'button, [role="button"], [role="tab"], a.home-nav__link, a.quiz-nav__link, a.quiz-node, a.lesson-page__play, a.quiz-card__view-all, a.landing__cta, a.landing-topbar__cta, .settings-switch, .profile-page__editable-item'
        );
        if (!clickable) return;
        if (clickable instanceof HTMLButtonElement && clickable.disabled) return;
        // Skip quiz/party action buttons that play dedicated SFX immediately
        if (
          clickable.closest("[data-quiz-answers]") ||
          clickable.closest("[data-party-answer-dock]") ||
          clickable.matches("[data-party-react], [data-party-ready], [data-party-start], [data-party-fill4], [data-party-bots]")
        ) {
          return;
        }
        playTone("click");
      },
      true
    );
  };

  const applyEyeCareOverlay = (): void => {
    const overlay = document.getElementById("lh-eyecare-overlay");
    if (!overlay) return;
    const mode = prefs.eyeCareMode || "off";
    const pct = Math.max(20, Math.min(100, Number(prefs.eyeCareIntensity) || 55)) / 100;
    overlay.dataset.eyecareMode = mode;
    if (mode === "off") {
      overlay.style.opacity = "0";
      overlay.style.background = "transparent";
      overlay.style.mixBlendMode = "normal";
      overlay.style.backdropFilter = "none";
      return;
    }
    if (mode === "warm") {
      // Warm amber blue-light filter overlay
      overlay.style.background = "rgba(255, 168, 54, 0.28)";
      overlay.style.mixBlendMode = "multiply";
      overlay.style.backdropFilter = "none";
      overlay.style.opacity = String(Number((0.35 + pct * 0.65).toFixed(2)));
    } else if (mode === "sepia") {
      // Soft book-paper sepia reading filter overlay
      overlay.style.background = "rgba(218, 186, 132, 0.30)";
      overlay.style.mixBlendMode = "multiply";
      overlay.style.backdropFilter = `sepia(${(pct * 0.28).toFixed(2)})`;
      overlay.style.opacity = String(Number((0.35 + pct * 0.65).toFixed(2)));
    } else {
      // Night Dim anti-glare overlay (soft dark amber tint, preserves page colors)
      overlay.style.background = "rgba(18, 16, 12, 0.42)";
      overlay.style.mixBlendMode = "normal";
      overlay.style.backdropFilter = "none";
      overlay.style.opacity = String(Number((0.28 + pct * 0.62).toFixed(2)));
    }
  };

  const applyPreferencesToDom = (): void => {
    document.body.dataset.workspaceTheme = "light";
    document.documentElement.dataset.textScale = prefs.scale;
    document.body.classList.toggle("is-reduced-motion", prefs.reduceMotion);
    document.body.classList.toggle("hide-quiz-review", !prefs.showAnswerReview);
    applyEyeCareOverlay();
  };

  const init = (): void => {
    bindGlobalButtonClickSound();
    const stored = LearningHausAccountStorage.readJson<Partial<Preferences>>(STORAGE_KEY, {});
    prefs = { ...defaultPreferences(), ...(stored || {}), theme: "light" };
    activeQuizTrackIndex = getQuizTrackIndexById(prefs.quizMusicTrack);
    prefs.quizMusicTrack = QUIZ_GAME_BGM_TRACKS[activeQuizTrackIndex].id;
    applyPreferencesToDom();

    const page = document.querySelector<HTMLElement>('[data-home-panel="settings"]');
    if (!page) return;

    const statusNode = page.querySelector<HTMLElement>("[data-settings-status]");
    let statusTimer: number | undefined;
    const showStatus = (message: string): void => {
      if (!statusNode) return;
      statusNode.textContent = message;
      statusNode.hidden = false;
      window.clearTimeout(statusTimer);
      statusTimer = window.setTimeout(() => {
        statusNode.hidden = true;
      }, 3000);
    };

    const savePrefs = (): void => {
      LearningHausAccountStorage.writeJson(STORAGE_KEY, prefs);
      applyPreferencesToDom();
    };

    const syncControls = (): void => {
      const currentLang = document.documentElement.lang === "th" ? "th" : "en";
      page.querySelectorAll<HTMLElement>("[data-settings-lang]").forEach((btn) => {
        const active = btn.dataset.settingsLang === currentLang;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", String(active));
      });
      page.querySelectorAll<HTMLElement>("[data-settings-scale]").forEach((btn) => {
        btn.classList.toggle("is-selected", btn.dataset.settingsScale === prefs.scale);
      });
      page.querySelectorAll<HTMLElement>("[data-settings-eyecare]").forEach((btn) => {
        const active = btn.dataset.settingsEyecare === prefs.eyeCareMode;
        btn.classList.toggle("is-selected", active);
        btn.setAttribute("aria-pressed", String(active));
      });
      const eyeWrap = page.querySelector<HTMLElement>("[data-settings-eyecare-slider-wrap]");
      const eyeSlider = page.querySelector<HTMLInputElement>("[data-settings-eyecare-intensity]");
      const eyeLabel = page.querySelector<HTMLElement>("[data-settings-eyecare-label]");
      if (eyeWrap) eyeWrap.hidden = prefs.eyeCareMode === "off";
      if (eyeSlider) eyeSlider.value = String(prefs.eyeCareIntensity);
      if (eyeLabel) eyeLabel.textContent = `${prefs.eyeCareIntensity}%`;

      const reduceMotionInput = page.querySelector<HTMLInputElement>('[data-setting-toggle="reduceMotion"]');
      const soundInput = page.querySelector<HTMLInputElement>('[data-setting-toggle="soundEffects"]');
      const bgmInput = page.querySelector<HTMLInputElement>('[data-setting-toggle="backgroundMusic"]');
      const quizTrackSelect = page.querySelector<HTMLSelectElement>("[data-setting-quiz-track]");
      const quizTrackPreviewBtn = page.querySelector<HTMLButtonElement>("[data-setting-quiz-track-preview]");
      const reviewInput = page.querySelector<HTMLInputElement>('[data-setting-toggle="showAnswerReview"]');
      const demoPropsInput = page.querySelector<HTMLInputElement>('[data-setting-toggle="demoUnlockProps"]');
      const demoAllChaptersInput = page.querySelector<HTMLInputElement>('[data-setting-toggle="demoCompleteAllChapters"]');

      if (reduceMotionInput) reduceMotionInput.checked = prefs.reduceMotion;
      if (soundInput) soundInput.checked = prefs.soundEffects;
      if (bgmInput) bgmInput.checked = prefs.backgroundMusic;
      if (quizTrackSelect) quizTrackSelect.value = prefs.quizMusicTrack;
      if (quizTrackPreviewBtn) {
        const previewing = bgmMode === "quiz-game" && bgmSceneActive && prefs.backgroundMusic && !page.hidden;
        quizTrackPreviewBtn.classList.toggle("is-playing", previewing);
        quizTrackPreviewBtn.setAttribute("aria-pressed", String(previewing));
        quizTrackPreviewBtn.textContent = previewing
          ? LearningHausI18n.t("Stop", "หยุดฟัง")
          : LearningHausI18n.t("Preview", "ฟังตัวอย่าง");
      }
      if (reviewInput) reviewInput.checked = prefs.showAnswerReview;
      if (demoPropsInput) {
        demoPropsInput.checked = Boolean(LearningHausAccountStorage.readJson<boolean>(DEMO_UNLOCK_KEY, false));
      }
      if (demoAllChaptersInput) {
        const enabled =
          window.LearningHausQuiz?.isDemoCompleteAllChapters?.() ??
          Boolean(LearningHausAccountStorage.readJson<boolean>(DEMO_COMPLETE_CHAPTERS_KEY, false));
        demoAllChaptersInput.checked = enabled;
      }
    };

    window.addEventListener("learninghaus:bgm-updated", syncControls);
    window.addEventListener("learninghaus:stage-progress-updated", syncControls);
    window.addEventListener("learninghaus:social-session", syncControls);

    const stopSettingsPreview = (): void => {
      if (bgmMode !== "quiz-game") return;
      const quizFlow = document.getElementById("quiz-flow");
      if (quizFlow && !quizFlow.hidden) return;
      bgmMode = "map";
      stopBgm();
      dispatchBgmUpdated();
    };

    const quizTrackSelect = page.querySelector<HTMLSelectElement>("[data-setting-quiz-track]");
    const quizTrackPreviewBtn = page.querySelector<HTMLButtonElement>("[data-setting-quiz-track-preview]");
    quizTrackSelect?.addEventListener("change", () => {
      const nextId = (quizTrackSelect.value as QuizMusicTrackId) || "clockwork";
      setQuizMusicTrack(nextId);
      syncControls();
      const chosen = QUIZ_GAME_BGM_TRACKS[getQuizTrackIndexById(nextId)];
      showStatus(LearningHausI18n.t(`Quiz music set to ${chosen.title}.`, `ตั้งเพลงหน้าควิซเป็น ${chosen.title} แล้ว`));
    });
    quizTrackPreviewBtn?.addEventListener("click", () => {
      const isPreviewing = bgmMode === "quiz-game" && bgmSceneActive && prefs.backgroundMusic && !page.hidden;
      if (isPreviewing) {
        stopSettingsPreview();
      } else {
        if (!prefs.backgroundMusic) {
          prefs.backgroundMusic = true;
          savePrefs();
        }
        setQuizGameBgm(0, false);
      }
      syncControls();
    });
    window.addEventListener("hashchange", () => {
      if (page.hidden) stopSettingsPreview();
    });
    const settingsVisibilityObserver = new MutationObserver(() => {
      if (page.hidden) stopSettingsPreview();
    });
    settingsVisibilityObserver.observe(page, { attributes: true, attributeFilter: ["hidden"] });

    // ปุ่มเลือกภาษาในหน้า Settings
    page.querySelectorAll<HTMLElement>("[data-settings-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.settingsLang === "th" ? "th" : "en";
        window.dispatchEvent(new CustomEvent("learninghaus:set-language", { detail: { lang } }));
        syncControls();
        showStatus(lang === "th" ? "เปลี่ยนภาษาเป็น ภาษาไทย เรียบร้อยแล้ว" : "Language switched to English.");
      });
    });

    window.addEventListener("learninghaus:language-changed", syncControls);

    // ปุ่มเลือกขนาดตัวอักษร
    page.querySelectorAll<HTMLElement>("[data-settings-scale]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const scale = (btn.dataset.settingsScale as TextScale) || "normal";
        prefs.scale = scale;
        savePrefs();
        syncControls();
        showStatus(LearningHausI18n.t("Text size updated.", "อัปเดตขนาดตัวอักษรเรียบร้อยแล้ว"));
      });
    });

    // โหมดถนอมสายตา (Screen Filter Overlay) + สไลเดอร์ความเข้ม
    page.querySelectorAll<HTMLElement>("[data-settings-eyecare]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = (btn.dataset.settingsEyecare as EyeCareMode) || "off";
        prefs.eyeCareMode = mode;
        savePrefs();
        syncControls();
        showStatus(
          mode === "off"
            ? LearningHausI18n.t("Eye-care filter turned off.", "ปิดฟิลเตอร์ถนอมสายตาแล้ว")
            : LearningHausI18n.t("Eye-care filter updated.", "เปิดใช้ฟิลเตอร์ถนอมสายตาเรียบร้อยแล้ว")
        );
      });
    });
    const eyeIntensityInput = page.querySelector<HTMLInputElement>("[data-settings-eyecare-intensity]");
    eyeIntensityInput?.addEventListener("input", () => {
      prefs.eyeCareIntensity = Math.max(20, Math.min(100, Number(eyeIntensityInput.value) || 55));
      savePrefs();
      syncControls();
    });

    // สวิตช์เปิด-ปิดการตั้งค่าต่างๆ
    page.querySelectorAll<HTMLInputElement>("[data-setting-toggle]").forEach((input) => {
      input.addEventListener("change", () => {
        const key = input.dataset.settingToggle;
        if (key === "reduceMotion") prefs.reduceMotion = input.checked;
        else if (key === "soundEffects") {
          prefs.soundEffects = input.checked;
          if (input.checked) playTone("correct");
        } else if (key === "backgroundMusic") {
          prefs.backgroundMusic = input.checked;
          if (input.checked) {
            bgmSceneActive = true;
            scheduleBgmLoop();
          } else {
            stopBgm();
          }
          dispatchBgmUpdated();
        } else if (key === "showAnswerReview") prefs.showAnswerReview = input.checked;
        else if (key === "demoUnlockProps") {
          LearningHausAccountStorage.writeJson(DEMO_UNLOCK_KEY, input.checked);
          const dialogCheckbox = document.querySelector<HTMLInputElement>("[data-pixel-cat-demo-unlock]");
          if (dialogCheckbox) {
            dialogCheckbox.checked = input.checked;
            dialogCheckbox.dispatchEvent(new Event("change"));
          }
          showStatus(
            input.checked
              ? LearningHausI18n.t("Demo unlock enabled for all Pixel Cat props.", "เปิดโหมดปลดล็อกพร็อพแมว Pixel ทั้งหมดแล้ว")
              : LearningHausI18n.t("Demo unlock disabled.", "ปิดโหมดปลดล็อกพร็อพทดสอบแล้ว")
          );
          return;
        } else if (key === "demoCompleteAllChapters") {
          LearningHausAccountStorage.writeJson(DEMO_COMPLETE_CHAPTERS_KEY, input.checked);
          window.LearningHausQuiz?.setDemoCompleteAllChapters?.(input.checked);
          if (input.checked) playTone("victory");
          syncControls();
          showStatus(
            input.checked
              ? LearningHausI18n.t(
                  "Test Mode enabled: All 8 chapters (80 stages) are unlocked and completed.",
                  "เปิดโหมดทดสอบสำเร็จทุก Chapter (ปลดล็อกครบ 80 ด่าน) แล้ว"
                )
              : LearningHausI18n.t(
                  "Test Mode disabled: Restored your saved chapter progress.",
                  "ปิดโหมดทดสอบและคืนค่าความคืบหน้าเดิมเรียบร้อยแล้ว"
                )
          );
          return;
        }
        savePrefs();
        syncControls();
        showStatus(LearningHausI18n.t("Settings saved.", "บันทึกการตั้งค่าเรียบร้อยแล้ว"));
      });
    });

    // ปุ่มรีเซ็ตการตั้งค่าทั้งหมด
    page.querySelector<HTMLElement>("[data-settings-reset]")?.addEventListener("click", () => {
      stopSettingsPreview();
      prefs = defaultPreferences();
      activeQuizTrackIndex = getQuizTrackIndexById(prefs.quizMusicTrack);
      LearningHausAccountStorage.writeJson(DEMO_UNLOCK_KEY, false);
      LearningHausAccountStorage.writeJson(DEMO_COMPLETE_CHAPTERS_KEY, false);
      window.LearningHausQuiz?.setDemoCompleteAllChapters?.(false);
      const dialogCheckbox = document.querySelector<HTMLInputElement>("[data-pixel-cat-demo-unlock]");
      if (dialogCheckbox) {
        dialogCheckbox.checked = false;
        dialogCheckbox.dispatchEvent(new Event("change"));
      }
      savePrefs();
      window.dispatchEvent(new CustomEvent("learninghaus:settings-reset"));
      window.dispatchEvent(new CustomEvent("learninghaus:set-language", { detail: { lang: "en" } }));
      syncControls();
      showStatus(LearningHausI18n.t("All settings reset to defaults.", "คืนค่าการตั้งค่าเริ่มต้นทั้งหมดเรียบร้อยแล้ว"));
    });

    const accountRemovalToggle = page.querySelector<HTMLButtonElement>("[data-account-removal-toggle]");
    const accountRemovalActions = page.querySelector<HTMLElement>("[data-account-removal-actions]");
    const syncAccountRemovalLabel = (): void => {
      if (!accountRemovalToggle || !accountRemovalActions) return;
      accountRemovalToggle.textContent = accountRemovalActions.hidden
        ? LearningHausI18n.t("Show", "แสดง")
        : LearningHausI18n.t("Hide", "ซ่อน");
      accountRemovalToggle.setAttribute("aria-expanded", String(!accountRemovalActions.hidden));
    };
    accountRemovalToggle?.addEventListener("click", () => {
      if (!accountRemovalActions) return;
      accountRemovalActions.hidden = !accountRemovalActions.hidden;
      syncAccountRemovalLabel();
    });
    window.addEventListener("learninghaus:language-changed", syncAccountRemovalLabel);
    syncAccountRemovalLabel();

    syncControls();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}
Object.assign(window, { LearningHausSettings });
