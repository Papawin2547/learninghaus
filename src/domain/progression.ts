// แกนกลางของคะแนน XP และ Level: โมดูลอื่นเรียกผ่านฟังก์ชันเล็ก ๆ ชุดนี้
namespace LearningHausProgression {
  export type StageGameType =
    | "quiz"
    | "matching"
    | "binary-stamp"
    | "sorting"
    | "scenario"
    | "true-false-sprint"
    | "inspector"
    | "order-steps"
    | "risk-review";

  export type StageAttempt = {
    correctAnswers: number;
    totalQuestions: number;
    elapsedSeconds: number;
    timeLimitSeconds: number;
    gameType?: StageGameType;
  };

  export type LevelState = {
    level: number;
    progressXp: number;
    requiredXp: number;
    totalXp: number;
  };

  const clamp = (value: number, minimum: number, maximum: number): number =>
    Math.min(maximum, Math.max(minimum, value));

  // XP ที่ต้องใช้จะเพิ่มทีละน้อย เพื่อให้ช่วงท้ายไม่ขึ้น Level เร็วเกินไป
  export const getLevelState = (totalXp: number): LevelState => {
    let remaining = Math.max(0, Math.floor(Number(totalXp) || 0));
    let level = 1;
    let requiredXp = LearningHausRules.level.baseXpPerLevel;
    let guard = 0;
    while (remaining >= requiredXp && guard < 200) {
      remaining -= requiredXp;
      level += 1;
      requiredXp = LearningHausRules.level.baseXpPerLevel + (level - 1) * LearningHausRules.level.xpGrowthPerLevel;
      guard += 1;
    }
    return { level, progressXp: remaining, requiredXp, totalXp: Math.max(0, Math.floor(Number(totalXp) || 0)) };
  };

  // แปลงข้อมูลเก่าที่มี level/exp แบบเดิมให้เป็น XP รวมโดยไม่รีเซ็ตผู้ใช้
  export const getLegacyTotalXp = (level: number, exp: number): number =>
    Math.max(0, (Math.max(1, Math.floor(Number(level) || 1)) - 1) * LearningHausRules.level.baseXpPerLevel + Math.max(0, Math.floor(Number(exp) || 0)));

  // คะแนนเต็ม 1,000: ความถูกต้องเป็นหลัก ความเร็วเป็นโบนัส และตอบถูกทุกข้อมีโบนัสความชำนาญ
  export const calculateStageScore = (attempt: StageAttempt): number => {
    const accuracy = clamp(attempt.correctAnswers / Math.max(1, attempt.totalQuestions), 0, 1);
    const speed = 1 - clamp(attempt.elapsedSeconds / Math.max(1, attempt.timeLimitSeconds), 0, 1);
    const speedScore = speed * accuracy * 200;
    const masteryBonus = accuracy === 1 ? 100 : 0;
    return Math.round(accuracy * 700 + speedScore + masteryBonus);
  };

  // ด่านใหม่ให้ XP 80–120 ตามคุณภาพครั้งแรก ส่วนการเล่นซ้ำยังไม่ฟาร์ม XP ได้
  export const calculateStageXp = (score: number, firstCompletion: boolean): number => {
    if (!firstCompletion) return 0;
    const normalizedScore = clamp(score, 0, 1000) / 1000;
    return LearningHausRules.quiz.minimumStageXp + Math.round(normalizedScore * (LearningHausRules.quiz.maximumStageXp - LearningHausRules.quiz.minimumStageXp));
  };
}
