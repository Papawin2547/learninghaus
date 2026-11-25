// โครงสร้างข้อมูลและชนิดตัวแปรกลางที่ใช้ร่วมกันทุกโมดูลใน LearningHaus
namespace LearningHausTypes {
  export type ProfileData = {
    name: string;
    level: string;
    exp: number;
    totalXp: number;
    username: string;
    email: string;
    phoneCountry: string;
    phone: string;
    phoneVerified: boolean;
    emailVerified: boolean;
    about: string;
    facebook: string;
    facebookUrl: string;
    instagram: string;
    instagramUrl: string;
    x: string;
    xUrl: string;
    avatar: string;
    catConfig?: string;
    catPresets?: string;
    featuredAchievements?: string[] | null;
    accountState: string;
  };

  export type ServerAccountPerson = {
    id: number;
    name: string;
    avatar: string;
    catConfig?: string;
    catPresets?: string;
    featuredAchievements?: string[] | null;
    email?: string;
    totalXp?: number;
    about?: string;
    facebookName?: string;
    facebookUrl?: string;
    instagramName?: string;
    instagramUrl?: string;
    xName?: string;
    xUrl?: string;
    accountState?: "active" | "disabled";
    status?: string;
    direction?: string;
  };

  export type ChapterProgressSummary = {
    chapter: number;
    videoCompleted: boolean;
    videoWatched: boolean;
    highestUnlocked: number;
    highestPassed: number;
  };

  export type QuizProgressSummary = {
    highestUnlocked: number;
    highestPassed: number;
    chapterTwoHighestUnlocked: number;
    chapterTwoHighestPassed: number;
    chapterTwoVideoCompleted: boolean;
    chapters: ChapterProgressSummary[];
    totalStages: number;
  };

  export type AchievementSnapshot = {
    metrics: LearningHausAchievementEngine.Metrics;
    unlocked?: { id: string; unlockedAt: string }[];
    legacyUnlockedIds?: string[];
    completedStages?: number[];
  };

  export type YouTubePlayer = {
    destroy?: () => void;
    stopVideo?: () => void;
    playVideo?: () => void;
    loadVideoById?: (videoId: string) => void;
    getCurrentTime?: () => number;
    getPlayerState?: () => number;
    seekTo?: (seconds: number, allowSeekAhead?: boolean) => void;
  };
}

interface Window {
  LearningHausProfile?: {
    getProfile: () => LearningHausTypes.ProfileData;
    setAvatar: (avatarDataUrl: string, catConfigJson?: string, catPresetsJson?: string) => Promise<boolean>;
    setFeaturedAchievements: (achievementIds: string[] | null) => Promise<boolean>;
    switchAccount: () => void;
    syncAccount: (account: LearningHausTypes.ServerAccountPerson) => void;
  };
  LearningHausPixelCat?: typeof LearningHausPixelCat;
  LearningHausQuests?: typeof LearningHausQuests;
  LearningHausLearnHub?: typeof LearningHausLearnHub;
  LearningHausPartyArena?: {
    open: () => Promise<void>;
    close: () => void;
  };
  LearningHausSettings?: typeof LearningHausSettings;
  LearningHausSocial?: typeof LearningHausSocial;
  LearningHausQuiz?: {
    unlockStage: (index: number) => void;
    passStage: (index: number) => void;
    getProgress: () => LearningHausTypes.QuizProgressSummary;
    setDemoCompleteAllChapters?: (enabled: boolean) => void;
    isDemoCompleteAllChapters?: () => boolean;
  };
  LearningHausQuizFlow?: {
    open: (index: number) => void;
    getState: () => {
      stageIndex: number;
      questionIndex: number;
      correctCount: number;
      screen: string;
    };
  };
  YT?: {
    Player?: new (
      element: string | HTMLElement,
      options: {
        videoId: string;
        playerVars?: Record<string, number | string>;
        events?: {
          onReady?: (event: { target: LearningHausTypes.YouTubePlayer }) => void;
          onStateChange?: (event: { data: number }) => void;
          onError?: () => void;
        };
      }
    ) => LearningHausTypes.YouTubePlayer;
    PlayerState?: { ENDED?: number };
  };
  onYouTubeIframeAPIReady?: () => void;
}
