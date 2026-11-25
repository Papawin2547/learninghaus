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

  // เริ่มต้นแบบว่างเปล่าเพื่อให้แสดงเฉพาะคะแนนจากผู้ใช้งานจริงในระบบ
  export const entries: Record<number, Entry[]> = {};
}
