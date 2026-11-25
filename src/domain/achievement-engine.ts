// คำนวณความคืบหน้าแยกจาก UI: รับเฉพาะตัวเลขกิจกรรมจริงและกติกาจากแค็ตตาล็อก
namespace LearningHausAchievementEngine {
  export type Metrics = {
    completedLessons: number;
    completedQuizzes: number;
    perfectQuizzes: number;
    fastStages: number;
    comebackPasses: number | null;
    subjects: number;
    improvedReplays: number;
    activeDays: number;
    completedCourses: number;
    claimedQuests?: number;
    chapterProgress: Record<string, number>;
    creator: {
      available: boolean;
      publishedCourses: number;
      createdLessons: number;
      assignedQuests?: number;
      completedStudents: number;
    };
  };

  export type Progress = {
    current: number | null;
    target: number | null;
    label: string;
    trackable: boolean;
    unlocked: boolean;
  };

  const amount = (value: number, target: number, label?: string): Progress => {
    const current = Math.min(Math.max(0, Math.floor(value)), target);
    return { current, target, label: label || `${current}/${target}`, trackable: true, unlocked: current >= target };
  };

  export const evaluate = (achievement: LearningHausAchievementCatalog.Achievement, metrics: Metrics): Progress => {
    const rule = achievement.unlockRule;
    switch (rule.type) {
      case "first-lesson": return amount(metrics.completedLessons, 1);
      case "lessons-complete": return amount(metrics.completedLessons, rule.count);
      case "first-quiz": return amount(metrics.completedQuizzes, 1);
      case "quizzes-complete": return amount(metrics.completedQuizzes, rule.count);
      case "perfect-score": return amount(metrics.perfectQuizzes > 0 ? 1 : 0, 1);
      case "perfect-quizzes": return amount(metrics.perfectQuizzes, rule.count);
      case "fast-stage": return amount(metrics.fastStages > 0 ? 1 : 0, 1);
      case "fast-stages": return amount(metrics.fastStages, rule.count);
      case "failed-then-pass": return metrics.comebackPasses === null
        ? { current: null, target: null, label: "Not tracked yet", trackable: false, unlocked: false }
        : amount(metrics.comebackPasses, 1);
      case "subjects-complete": return amount(metrics.subjects, rule.count);
      case "improved-replay": return amount(metrics.improvedReplays > 0 ? 1 : 0, 1);
      case "active-days": return amount(metrics.activeDays, rule.count);
      case "courses-complete": return amount(metrics.completedCourses, rule.count);
      case "claimed-quests": return amount(metrics.claimedQuests || 0, rule.count);
      case "creator-courses-published": return metrics.creator.available
        ? amount(metrics.creator.publishedCourses, rule.count)
        : amount(0, rule.count);
      case "creator-lessons-created": return metrics.creator.available
        ? amount(metrics.creator.createdLessons, rule.count)
        : amount(0, rule.count);
      case "creator-quests-assigned": return metrics.creator.available
        ? amount(metrics.creator.assignedQuests || 0, rule.count)
        : amount(0, rule.count);
      case "creator-students-complete": return metrics.creator.available
        ? amount(metrics.creator.completedStudents, rule.count)
        : amount(0, rule.count);
    }
  };
}
