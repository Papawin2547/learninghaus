// ข้อมูล Leaderboard ตัวอย่าง: แสดงเฉพาะด่านที่มีผู้ทำคะแนนแล้ว และเรียงจากคะแนนด่านสูงสุด
namespace LearningHausLeaderboardData {
  export type Entry = {
    userId?: number;
    name: string;
    avatar: string;
    catConfig?: string;
    score: number;
    correct: number;
    total: number;
    timeSeconds: number;
    totalXp: number;
    message?: string;
    about?: string;
    facebookName?: string;
    facebookUrl?: string;
    instagramName?: string;
    instagramUrl?: string;
    xName?: string;
    xUrl?: string;
    featuredAchievements?: string[] | null;
  };

  export const stageNames: Record<number, string> = {
    1: "Chapter 1 · Foundations & Scope · Stage 1",
    2: "Chapter 1 · Foundations & Scope · Stage 2",
    4: "Chapter 1 · Foundations & Scope · Stage 4",
    7: "Chapter 1 · Foundations & Scope · Stage 7"
  };

  export const entries: Record<number, Entry[]> = {
    1: [
      { name: "KITTYCAT", avatar: "", score: 950, correct: 10, total: 10, timeSeconds: 18, totalXp: 880, about: "Interactive learning explorer and quiz speedrun champion across all subjects.", message: "THE GAME IS VERY EASY FOR ME HAHAHA !" },
      { name: "FOXXIE", avatar: "", score: 910, correct: 9, total: 10, timeSeconds: 16, totalXp: 760, about: "Curious learner collecting every pixel cat badge and prop!", message: "Always learning something new!" },
      { name: "GG1", avatar: "", score: 875, correct: 9, total: 10, timeSeconds: 29, totalXp: 640, about: "Creating interactive slides, video lessons, and fun classroom quizzes.", message: "Keep going and have fun learning!" },
      { name: "NekoNova", avatar: "", score: 820, correct: 8, total: 10, timeSeconds: 24, totalXp: 520, about: "Mastering new skills one lesson and course quest at a time.", message: "Building new skills every day." },
      { name: "TONOAK", avatar: "", score: 760, correct: 8, total: 10, timeSeconds: 42, totalXp: 160, message: "Ready for the next chapter!" }
    ],
    2: [
      { name: "FOXXIE", avatar: "", score: 965, correct: 10, total: 10, timeSeconds: 14, totalXp: 760, about: "Curious learner collecting every pixel cat badge and prop!" },
      { name: "KITTYCAT", avatar: "", score: 900, correct: 9, total: 10, timeSeconds: 19, totalXp: 880, about: "Interactive learning explorer and quiz speedrun champion across all subjects." },
      { name: "PixelPaws", avatar: "", score: 835, correct: 8, total: 10, timeSeconds: 20, totalXp: 520, about: "Pixel art & UX design fan sharing visual slide decks." },
      { name: "LawWhisker", avatar: "", score: 710, correct: 7, total: 10, timeSeconds: 31, totalXp: 340, about: "Exploring technology, policy, and coding courses." }
    ],
    4: [
      { name: "GG1", avatar: "", score: 930, correct: 10, total: 10, timeSeconds: 22, totalXp: 640, about: "Creating interactive slides, video lessons, and fun classroom quizzes." },
      { name: "NekoNova", avatar: "", score: 845, correct: 9, total: 10, timeSeconds: 34, totalXp: 520, about: "Mastering new skills one lesson and course quest at a time." },
      { name: "Catonix", avatar: "", score: 785, correct: 8, total: 10, timeSeconds: 39, totalXp: 410, about: "Completing daily quests and custom classroom challenges." }
    ],
    7: [
      { name: "KITTYCAT", avatar: "", score: 990, correct: 10, total: 10, timeSeconds: 11, totalXp: 880, about: "Interactive learning explorer and quiz speedrun champion across all subjects." },
      { name: "GG1", avatar: "", score: 880, correct: 9, total: 10, timeSeconds: 27, totalXp: 640, about: "Creating interactive slides, video lessons, and fun classroom quizzes." },
      { name: "FOXXIE", avatar: "", score: 800, correct: 8, total: 10, timeSeconds: 21, totalXp: 760, about: "Curious learner collecting every pixel cat badge and prop!" }
    ]
  };
}
