// Grouped Daily Quests, General Objectives, Course-Specific Quests (enrolled courses only), and Quest-Exclusive Prop Rewards
namespace LearningHausQuests {
  export type QuestScope = "daily" | "general" | "course";

  export type QuestProgress = {
    current: number;
    target: number;
    subtasks?: readonly { labelEn: string; labelTh: string; done: boolean }[];
  };

  export type QuestDefinition = {
    id: string;
    scope: QuestScope;
    courseId?: string;
    courseTitle?: string;
    titleEn: string;
    titleTh: string;
    descEn: string;
    descTh: string;
    xpReward: number;
    propRewardId?: LearningHausPixelCat.PropId;
    bgRewardId?: LearningHausPixelCat.AvatarBgId;
    getProgress: () => QuestProgress;
  };

  type DailyLogState = {
    dateKey: string;
    lessonsToday: string[];
    stagesToday: number[];
    coursesExploredToday: string[];
    claimedDailyIds: string[];
  };

  type LifetimeQuestState = {
    completedLessons: string[];
    claimedQuestIds: string[];
    unlockedProps: string[];
    unlockedBgs: string[];
    unenrolledCourses: string[];
  };

  const ENROLLED_STORAGE_KEY = "learninghaus.enrolledCourses.v1";
  const DAILY_STORAGE_KEY = "learninghaus.questDailyLog.v1";
  const LIFETIME_STORAGE_KEY = "learninghaus.questLifetime.v1";

  const t = (en: string, th: string): string => LearningHausI18n.t(en, th);

  const todayKey = (): string => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const SVG_ICONS = {
    sparkles: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    gift: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`,
    check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`,
    book: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    compass: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    layers: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    zap: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
    arrowRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`
  };

  const readDailyLog = (): DailyLogState => {
    const key = todayKey();
    const raw = LearningHausAccountStorage.readJson<Partial<DailyLogState> | null>(DAILY_STORAGE_KEY, null);
    if (!raw || raw.dateKey !== key) {
      return {
        dateKey: key,
        lessonsToday: [],
        stagesToday: [],
        coursesExploredToday: [],
        claimedDailyIds: []
      };
    }
    return {
      dateKey: key,
      lessonsToday: Array.isArray(raw.lessonsToday) ? raw.lessonsToday.map(String) : [],
      stagesToday: Array.isArray(raw.stagesToday) ? raw.stagesToday.map(Number).filter(Number.isFinite) : [],
      coursesExploredToday: Array.isArray(raw.coursesExploredToday) ? raw.coursesExploredToday.map(String) : [],
      claimedDailyIds: Array.isArray(raw.claimedDailyIds) ? raw.claimedDailyIds.map(String) : []
    };
  };

  const writeDailyLog = (state: DailyLogState): void => {
    LearningHausAccountStorage.writeJson(DAILY_STORAGE_KEY, state);
  };

  const readLifetime = (): LifetimeQuestState => {
    const raw = LearningHausAccountStorage.readJson<Partial<LifetimeQuestState> | null>(LIFETIME_STORAGE_KEY, null);
    return {
      completedLessons: Array.isArray(raw?.completedLessons) ? raw!.completedLessons.map(String) : [],
      claimedQuestIds: Array.isArray(raw?.claimedQuestIds) ? raw!.claimedQuestIds.map(String) : [],
      unlockedProps: Array.isArray(raw?.unlockedProps) ? raw!.unlockedProps.map(String) : [],
      unlockedBgs: Array.isArray(raw?.unlockedBgs) ? raw!.unlockedBgs.map(String) : [],
      unenrolledCourses: Array.isArray(raw?.unenrolledCourses) ? raw!.unenrolledCourses.map(String) : []
    };
  };

  const writeLifetime = (state: LifetimeQuestState): void => {
    LearningHausAccountStorage.writeJson(LIFETIME_STORAGE_KEY, state);
  };

  const getQuizProgress = (): LearningHausTypes.QuizProgressSummary | null =>
    window.LearningHausQuiz?.getProgress?.() || null;

  const getTotalClearedStages = (): number => {
    const progress = getQuizProgress();
    if (!progress) return 0;
    const stagesPerChapter = LearningHausRules.quiz.stagesPerChapter;
    return progress.chapters.reduce((sum, ch) => {
      const first = (ch.chapter - 1) * stagesPerChapter;
      const cleared = ch.highestPassed >= first ? Math.min(stagesPerChapter, ch.highestPassed - first + 1) : 0;
      return sum + cleared;
    }, 0);
  };

  const getCompletedChaptersCount = (): number => {
    const progress = getQuizProgress();
    if (!progress) return 0;
    const stagesPerChapter = LearningHausRules.quiz.stagesPerChapter;
    return progress.chapters.filter((ch) => {
      const first = (ch.chapter - 1) * stagesPerChapter;
      return ch.highestPassed >= first + stagesPerChapter - 1;
    }).length;
  };

  const hasReachedEuChapter2 = (): boolean => {
    const progress = getQuizProgress();
    if (!progress) return false;
    const stagesPerChapter = LearningHausRules.quiz.stagesPerChapter;
    const ch1 = progress.chapters.find((c) => c.chapter === 1);
    const ch2 = progress.chapters.find((c) => c.chapter === 2);
    const ch1Done = Boolean(ch1 && ch1.highestPassed >= stagesPerChapter - 1);
    const ch2Started = Boolean(ch2 && (ch2.videoWatched || ch2.videoCompleted || ch2.highestPassed >= stagesPerChapter));
    const lifetime = readLifetime();
    const openedCh2 = lifetime.completedLessons.includes("eu-ai-act:2");
    return ch1Done || ch2Started || openedCh2;
  };

  const getUniqueLessonsCount = (): number => {
    const set = new Set<string>(readLifetime().completedLessons);
    const progress = getQuizProgress();
    if (progress) {
      const stagesPerChapter = LearningHausRules.quiz.stagesPerChapter;
      progress.chapters.forEach((ch) => {
        const first = (ch.chapter - 1) * stagesPerChapter;
        if (ch.videoWatched || ch.videoCompleted || ch.highestPassed >= first) {
          set.add(`eu-ai-act:${ch.chapter}`);
        }
      });
    }
    return set.size;
  };

  const getCourseLessonCount = (courseId: string): number => {
    const set = new Set<string>();
    readLifetime().completedLessons.forEach((entry) => {
      if (entry.startsWith(`${courseId}:`)) set.add(entry);
    });
    if (courseId === "eu-ai-act") {
      const progress = getQuizProgress();
      if (progress) {
        const stagesPerChapter = LearningHausRules.quiz.stagesPerChapter;
        progress.chapters.forEach((ch) => {
          const first = (ch.chapter - 1) * stagesPerChapter;
          if (ch.videoWatched || ch.videoCompleted || ch.highestPassed >= first) {
            set.add(`eu-ai-act:${ch.chapter}`);
          }
        });
      }
    }
    return set.size;
  };

  export const getEnrolledCourseIds = (): string[] => {
    const saved = LearningHausAccountStorage.readJson<string[] | null>(ENROLLED_STORAGE_KEY, null);
    const set = new Set<string>(Array.isArray(saved) ? saved.map(String) : []);
    const lifetime = readLifetime();

    // Auto-enroll EU AI Act if the learner already has progress and has not explicitly unenrolled
    if (!set.has("eu-ai-act") && !lifetime.unenrolledCourses.includes("eu-ai-act")) {
      const hasEuActivity = getTotalClearedStages() > 0 || getCourseLessonCount("eu-ai-act") > 0;
      if (hasEuActivity) {
        set.add("eu-ai-act");
        LearningHausAccountStorage.writeJson(ENROLLED_STORAGE_KEY, Array.from(set));
      }
    }
    return Array.from(set);
  };

  export const isEnrolled = (courseId: string): boolean => getEnrolledCourseIds().includes(courseId);

  export const enroll = (courseId: string, silent = false): boolean => {
    if (!courseId) return false;
    const current = new Set(getEnrolledCourseIds());
    const lifetime = readLifetime();
    const wasUnenrolled = lifetime.unenrolledCourses.includes(courseId);
    if (wasUnenrolled) {
      lifetime.unenrolledCourses = lifetime.unenrolledCourses.filter((id) => id !== courseId);
      writeLifetime(lifetime);
    }
    const added = !current.has(courseId);
    current.add(courseId);
    LearningHausAccountStorage.writeJson(ENROLLED_STORAGE_KEY, Array.from(current));

    const daily = readDailyLog();
    if (!daily.coursesExploredToday.includes(courseId)) {
      daily.coursesExploredToday.push(courseId);
      writeDailyLog(daily);
    }

    if (!silent) {
      window.dispatchEvent(new CustomEvent("learninghaus:quest-updated", { detail: { courseId, enrolled: true } }));
      render();
    }
    return added;
  };

  export const unenroll = (courseId: string): void => {
    const current = getEnrolledCourseIds().filter((id) => id !== courseId);
    LearningHausAccountStorage.writeJson(ENROLLED_STORAGE_KEY, current);
    const lifetime = readLifetime();
    if (!lifetime.unenrolledCourses.includes(courseId)) {
      lifetime.unenrolledCourses.push(courseId);
      writeLifetime(lifetime);
    }
    window.dispatchEvent(new CustomEvent("learninghaus:quest-updated", { detail: { courseId, enrolled: false } }));
    render();
  };

  export const recordLessonActivity = (courseId: string, chapter: number): void => {
    const cleanCourse = courseId || "eu-ai-act";
    const key = `${cleanCourse}:${chapter}`;
    enroll(cleanCourse, true);

    const lifetime = readLifetime();
    if (!lifetime.completedLessons.includes(key)) {
      lifetime.completedLessons.push(key);
      writeLifetime(lifetime);
    }

    const daily = readDailyLog();
    if (!daily.lessonsToday.includes(key)) {
      daily.lessonsToday.push(key);
      writeDailyLog(daily);
    }

    window.dispatchEvent(new CustomEvent("learninghaus:quest-updated"));
    render();
  };

  export const recordCourseExplored = (courseId: string): void => {
    if (!courseId) return;
    const daily = readDailyLog();
    if (!daily.coursesExploredToday.includes(courseId)) {
      daily.coursesExploredToday.push(courseId);
      writeDailyLog(daily);
      window.dispatchEvent(new CustomEvent("learninghaus:quest-updated"));
      render();
    }
  };

  export const recordStagePassedToday = (stageIndex: number): void => {
    if (!Number.isFinite(stageIndex) || stageIndex < 0) return;
    enroll("eu-ai-act", true);
    const daily = readDailyLog();
    if (!daily.stagesToday.includes(stageIndex)) {
      daily.stagesToday.push(stageIndex);
      writeDailyLog(daily);
    }
    window.dispatchEvent(new CustomEvent("learninghaus:quest-updated"));
    render();
  };

  export const isRewardUnlocked = (propId: string): boolean => {
    return readLifetime().unlockedProps.includes(propId);
  };

  export const isBgUnlocked = (bgId: string): boolean => {
    return readLifetime().unlockedBgs.includes(bgId);
  };

  const isClaimed = (quest: QuestDefinition): boolean => {
    if (quest.scope === "daily") {
      return readDailyLog().claimedDailyIds.includes(quest.id);
    }
    return readLifetime().claimedQuestIds.includes(quest.id);
  };

  const COURSE_DISPLAY_TITLES: Record<string, { en: string; th: string }> = {
    "eu-ai-act": { en: "EU AI Act", th: "EU AI Act" },
    "python-data-101": { en: "Python & Data Visualization", th: "Python & Data Visualization" },
    "ux-design-studio": { en: "Modern UI/UX Design", th: "Modern UI/UX Design" },
    "biz-strategy-301": { en: "Digital Product & Startup Strategy", th: "Digital Product & Startup Strategy" },
    "eng-comm-105": { en: "Practical English for Presentations", th: "ภาษาอังกฤษเพื่อการนำเสนอ" },
    "ai-productivity-lab": { en: "Everyday AI & Slide Deck Productivity", th: "เทคนิคใช้ AI และทำสไลด์" }
  };

  const buildQuests = (): QuestDefinition[] => {
    const hub = window.LearningHausLearnHub;
    const enrolledSet = new Set<string>(getEnrolledCourseIds());
    (hub?.getMyClasses?.() || []).forEach((c) => enrolledSet.add(c.id));
    const enrolled = Array.from(enrolledSet);
    const quests: QuestDefinition[] = [
      // 1. DAILY QUESTS (Grouped daily objectives)
      {
        id: "daily-lesson-explorer",
        scope: "daily",
        titleEn: "Complete 1 Lesson Today",
        titleTh: "เรียนจบ 1 บทเรียนวันนี้",
        descEn: "Open or finish any chapter lesson today to unlock the Mint Polka circular profile background.",
        descTh: "เปิดเรียนหรือรับชมวิดีโอบทเรียนใดก็ได้ 1 บทวันนี้ เพื่อรับพื้นหลังโปรไฟล์ ลายจุดมินต์พิกเซล",
        xpReward: 40,
        bgRewardId: "pixel-polka",
        getProgress: () => {
          const daily = readDailyLog();
          return { current: Math.min(1, daily.lessonsToday.length), target: 1 };
        }
      },
      {
        id: "daily-quiz-sprint",
        scope: "daily",
        titleEn: "Clear 2 Quiz Stages Today",
        titleTh: "ผ่านด่านควิซ 2 ด่านวันนี้",
        descEn: "Pass any 2 quiz stages today to claim an exclusive Starlight Hairpin prop.",
        descTh: "ผ่านด่านควิซใดก็ได้ครบ 2 ด่านในวันนี้ เพื่อรับพร็อพพิเศษ กิ๊บดาวประกายแสง",
        xpReward: 60,
        propRewardId: "star-clip",
        getProgress: () => {
          const daily = readDailyLog();
          return { current: Math.min(2, daily.stagesToday.length), target: 2 };
        }
      },
      {
        id: "daily-study-combo",
        scope: "daily",
        titleEn: "Daily Study Trio",
        titleTh: "คอมโบการเรียนประจำวัน (3 ภารกิจย่อย)",
        descEn: "Group all 3 daily habits to unlock the Sunset Waves profile background.",
        descTh: "รวม 3 กิจกรรมประจำวันเพื่อรับพื้นหลังโปรไฟล์พิเศษ คลื่นยามเย็น",
        xpReward: 80,
        bgRewardId: "sunset-wave",
        getProgress: () => {
          const daily = readDailyLog();
          const hasLesson = daily.lessonsToday.length >= 1;
          const hasQuiz = daily.stagesToday.length >= 1;
          const hasCourse = daily.coursesExploredToday.length >= 1 || enrolled.length >= 1;
          const doneCount = Number(hasLesson) + Number(hasQuiz) + Number(hasCourse);
          return {
            current: doneCount,
            target: 3,
            subtasks: [
              { labelEn: "Study 1 lesson", labelTh: "เรียน 1 บทเรียน", done: hasLesson },
              { labelEn: "Clear 1 quiz stage", labelTh: "ผ่านควิซ 1 ด่าน", done: hasQuiz },
              { labelEn: "Explore or enroll in a course", labelTh: "สำรวจหรือลงทะเบียนคอร์ส", done: hasCourse }
            ]
          };
        }
      },

      // 2. ALL QUESTS — GENERAL MILESTONE OBJECTIVES
      {
        id: "quest-new-lessons-3",
        scope: "general",
        titleEn: "Complete 3 New Lessons",
        titleTh: "เรียนจบ 3 บทเรียนใหม่",
        descEn: "Study 3 unique lessons across any courses to unlock the Golden Halo prop and Prism Holo background.",
        descTh: "เรียนบทเรียนที่ไม่ซ้ำกันครบ 3 บทจากคอร์สใดก็ได้ เพื่อปลดล็อกวงแหวนแสงทองและพื้นหลังโฮโลแกรมปริซึม",
        xpReward: 100,
        propRewardId: "halo",
        bgRewardId: "prism-holo",
        getProgress: () => ({ current: Math.min(3, getUniqueLessonsCount()), target: 3 })
      },
      {
        id: "quest-multi-course",
        scope: "general",
        titleEn: "Multi-Course Explorer",
        titleTh: "นักสำรวจข้ามคอร์ส (ลงทะเบียน 2 คอร์ส)",
        descEn: "Enroll in at least 2 courses on the Learn page to unlock the exclusive Leaf & Blossom Crown.",
        descTh: "ลงทะเบียนเรียนอย่างน้อย 2 คอร์สในหน้าเรียนรู้ เพื่อปลดล็อกพร็อพพิเศษ มงกุฎใบไม้ผลิบาน",
        xpReward: 75,
        propRewardId: "flower-crown",
        getProgress: () => ({ current: Math.min(2, enrolled.length), target: 2 })
      },
      {
        id: "quest-quiz-5",
        scope: "general",
        titleEn: "Quiz Tactician (5 Stages)",
        titleTh: "นักวางแผนควิซ (ผ่านสะสม 5 ด่าน)",
        descEn: "Pass 5 quiz stages in total to unlock the Emerald Aurora profile background and bonus EXP.",
        descTh: "ผ่านด่านควิซสะสมครบ 5 ด่านเพื่อปลดล็อกพื้นหลังแสงเหนือมรกตและรับ EXP โบนัส",
        xpReward: 120,
        bgRewardId: "aurora-glow",
        getProgress: () => ({ current: Math.min(5, getTotalClearedStages()), target: 5 })
      }
    ];

    // 3. COURSE-SPECIFIC QUESTS (Creator-Assigned Quests + System-Randomized Class Reward Pool for every enrolled class!)
    enrolled.forEach((courseId) => {
      const courseObj = hub?.getCourseById?.(courseId);
      const fallbackMeta = COURSE_DISPLAY_TITLES[courseId] || {
        en: courseObj?.title || courseId,
        th: courseObj?.title || courseId
      };
      const courseTitle = courseObj ? courseObj.title : t(fallbackMeta.en, fallbackMeta.th);
      const customQuests = hub?.getCourseQuests?.(courseId) || [];

      if (customQuests.length > 0) {
        customQuests.forEach((cq) => {
          quests.push({
            id: cq.id,
            scope: "course",
            courseId,
            courseTitle,
            titleEn: cq.titleEn,
            titleTh: cq.titleTh,
            descEn: cq.descEn,
            descTh: cq.descTh,
            xpReward: courseObj?.requireApproval
              ? 0
              : typeof cq.xpReward === "number"
                ? Math.max(0, cq.xpReward)
                : 100,
            propRewardId: cq.propRewardId,
            bgRewardId: cq.bgRewardId || (cq.id === "course-eu-ch2" ? "law-pillars" : undefined),
            getProgress: () => {
              const targetVal = Math.max(1, Number(cq.targetValue) || 1);
              const doneInCourse = Math.max(
                getCourseLessonCount(courseId),
                hub?.getCompletedLessonCountForCourse?.(courseId) || 0
              );
              if (cq.id === "course-eu-ch2") {
                return { current: hasReachedEuChapter2() || doneInCourse >= 2 ? 1 : 0, target: 1 };
              }
              if (cq.id === "course-eu-master") {
                const chCleared = Math.max(getCompletedChaptersCount(), doneInCourse);
                return { current: Math.min(3, chCleared), target: 3 };
              }
              if (cq.objectiveType === "complete-lessons") {
                return { current: Math.min(targetVal, doneInCourse), target: targetVal };
              }
              if (cq.objectiveType === "complete-course") {
                const totalLessons = Math.max(1, courseObj?.chapters.length || targetVal);
                return { current: Math.min(totalLessons, doneInCourse), target: totalLessons };
              }
              if (cq.objectiveType === "quiz-pass") {
                const passed = Boolean(hub?.hasPassedLessonQuiz?.(courseId, targetVal - 1));
                return { current: passed ? 1 : 0, target: 1 };
              }
              // complete-chapter or media-finish
              const chDone =
                Boolean(hub?.isCustomChapterCompleted?.(courseId, targetVal - 1)) ||
                readLifetime().completedLessons.includes(`${courseId}:${targetVal}`) ||
                doneInCourse >= targetVal;
              return { current: chDone ? 1 : 0, target: 1 };
            }
          });
        });
      } else {
        quests.push({
          id: `course-progress-${courseId}`,
          scope: "course",
          courseId,
          courseTitle,
          titleEn: `Study 2 Lessons in ${courseTitle}`,
          titleTh: `เรียน 2 บทในคอร์ส ${courseTitle}`,
          descEn: `Open and complete 2 lessons inside your enrolled ${courseTitle} course.`,
          descTh: `เปิดเรียนครบ 2 บทภายในคอร์ส ${courseTitle} ที่คุณลงทะเบียนไว้`,
          xpReward: 100,
          getProgress: () => ({ current: Math.min(2, getCourseLessonCount(courseId)), target: 2 })
        });
      }
    });

    return quests;
  };

  let lastClaimBanner: { message: string; propId?: LearningHausPixelCat.PropId; bgId?: LearningHausPixelCat.AvatarBgId } | null = null;

  const claimQuest = (quest: QuestDefinition): void => {
    const progress = quest.getProgress();
    if (progress.current < progress.target || isClaimed(quest)) return;

    if (quest.scope === "daily") {
      const daily = readDailyLog();
      if (!daily.claimedDailyIds.includes(quest.id)) {
        daily.claimedDailyIds.push(quest.id);
        writeDailyLog(daily);
      }
    } else {
      const lifetime = readLifetime();
      if (!lifetime.claimedQuestIds.includes(quest.id)) {
        lifetime.claimedQuestIds.push(quest.id);
        writeLifetime(lifetime);
      }
    }

    if (quest.propRewardId || quest.bgRewardId) {
      const lifetime = readLifetime();
      if (quest.propRewardId && !lifetime.unlockedProps.includes(quest.propRewardId)) {
        lifetime.unlockedProps.push(quest.propRewardId);
      }
      if (quest.bgRewardId && !lifetime.unlockedBgs.includes(quest.bgRewardId)) {
        lifetime.unlockedBgs.push(quest.bgRewardId);
      }
      writeLifetime(lifetime);
    }

    if (quest.xpReward > 0) {
      window.dispatchEvent(new CustomEvent("learninghaus:quiz-xp-awarded", { detail: { amount: quest.xpReward } }));
    }

    const propDef = quest.propRewardId
      ? LearningHausPixelCat.PROPS.find((p) => p.id === quest.propRewardId)
      : null;
    const bgDef = quest.bgRewardId
      ? LearningHausPixelCat.AVATAR_BACKGROUNDS.find((b) => b.id === quest.bgRewardId)
      : null;
    const unlockedItemsEn: string[] = [];
    const unlockedItemsTh: string[] = [];
    if (propDef) {
      unlockedItemsEn.push(`prop "${propDef.name}"`);
      unlockedItemsTh.push(`พร็อพ "${propDef.nameTh}"`);
    }
    if (bgDef) {
      unlockedItemsEn.push(`background "${bgDef.name}"`);
      unlockedItemsTh.push(`พื้นหลัง "${bgDef.nameTh}"`);
    }

    lastClaimBanner = {
      message: unlockedItemsEn.length
        ? t(
            `Claimed +${quest.xpReward} EXP and unlocked ${unlockedItemsEn.join(" & ")}!`,
            `รับรางวัล +${quest.xpReward} EXP และปลดล็อก${unlockedItemsTh.join(" และ ")}เรียบร้อยแล้ว!`
          )
        : t(
            `Claimed +${quest.xpReward} EXP for "${quest.titleEn}"!`,
            `รับรางวัล +${quest.xpReward} EXP จากเควส "${quest.titleTh}" เรียบร้อยแล้ว!`
          ),
      propId: quest.propRewardId,
      bgId: quest.bgRewardId
    };

    window.dispatchEvent(
      new CustomEvent("learninghaus:quest-updated", {
        detail: { claimedId: quest.id, propRewardId: quest.propRewardId, bgRewardId: quest.bgRewardId }
      })
    );
    render();
  };

  const renderQuestCard = (quest: QuestDefinition): HTMLElement => {
    const progress = quest.getProgress();
    const pct = Math.max(0, Math.min(100, Math.round((progress.current / Math.max(1, progress.target)) * 100)));
    const completed = progress.current >= progress.target;
    const claimed = isClaimed(quest);
    const claimable = completed && !claimed;

    const card = document.createElement("article");
    card.className = `quest-card${claimed ? " is-claimed" : claimable ? " is-claimable" : ""}`;
    card.dataset.questId = quest.id;

    const main = document.createElement("div");
    main.className = "quest-card__main";

    const topRow = document.createElement("div");
    topRow.className = "quest-card__top";

    const titleWrap = document.createElement("div");
    titleWrap.className = "quest-card__title-wrap";
    if (quest.courseTitle) {
      const coursePill = document.createElement("span");
      coursePill.className = "quest-card__course-tag";
      coursePill.innerHTML = `${SVG_ICONS.book}<span>${quest.courseTitle}</span>`;
      titleWrap.append(coursePill);
    }
    const h3 = document.createElement("h3");
    h3.className = "quest-card__title";
    h3.textContent = t(quest.titleEn, quest.titleTh);
    titleWrap.append(h3);

    const progressTag = document.createElement("span");
    progressTag.className = "quest-card__count";
    progressTag.textContent = `${progress.current} / ${progress.target}`;

    topRow.append(titleWrap, progressTag);

    const desc = document.createElement("p");
    desc.className = "quest-card__desc";
    desc.textContent = t(quest.descEn, quest.descTh);

    const bar = document.createElement("div");
    bar.className = "quest-card__bar";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", String(progress.target));
    bar.setAttribute("aria-valuenow", String(progress.current));
    const fill = document.createElement("span");
    fill.style.width = `${pct}%`;
    bar.append(fill);

    main.append(topRow, desc, bar);

    if (progress.subtasks && progress.subtasks.length > 0) {
      const subList = document.createElement("div");
      subList.className = "quest-card__subtasks";
      progress.subtasks.forEach((sub) => {
        const chip = document.createElement("span");
        chip.className = `quest-card__subtask${sub.done ? " is-done" : ""}`;
        chip.innerHTML = `${sub.done ? SVG_ICONS.check : `<span class="quest-card__dot" aria-hidden="true"></span>`}<span>${t(sub.labelEn, sub.labelTh)}</span>`;
        subList.append(chip);
      });
      main.append(subList);
    }

    const footer = document.createElement("div");
    footer.className = "quest-card__footer";

    const rewards = document.createElement("div");
    rewards.className = "quest-card__rewards";

    const xpBadge = document.createElement("span");
    xpBadge.className = "quest-card__reward-pill quest-card__reward-pill--xp";
    xpBadge.innerHTML = `${SVG_ICONS.zap}<span>+${quest.xpReward} EXP</span>`;
    rewards.append(xpBadge);

    if (quest.propRewardId) {
      const propDef = LearningHausPixelCat.PROPS.find((p) => p.id === quest.propRewardId);
      if (propDef) {
        const propBadge = document.createElement("span");
        propBadge.className = "quest-card__reward-pill quest-card__reward-pill--prop";
        const previewImg = document.createElement("img");
        previewImg.className = "quest-card__prop-thumb";
        previewImg.src = LearningHausPixelCat.renderPropPreviewDataUrl(
          quest.propRewardId,
          LearningHausPixelCat.getActiveConfig(),
          72
        );
        previewImg.alt = LearningHausPixelCat.localizePropName(propDef);
        const propCopy = document.createElement("span");
        propCopy.textContent = `${t("Exclusive Prop:", "พร็อพพิเศษ:")} ${LearningHausPixelCat.localizePropName(propDef)}`;
        propBadge.append(previewImg, propCopy);
        rewards.append(propBadge);
      }
    }

    if (quest.bgRewardId) {
      const bgDef = LearningHausPixelCat.AVATAR_BACKGROUNDS.find((b) => b.id === quest.bgRewardId);
      if (bgDef) {
        const bgBadge = document.createElement("span");
        bgBadge.className = "quest-card__reward-pill quest-card__reward-pill--prop";
        const swatchImg = document.createElement("img");
        swatchImg.className = "quest-card__bg-thumb";
        swatchImg.src = LearningHausPixelCat.renderBgSwatchDataUrl(quest.bgRewardId, 56);
        swatchImg.alt = LearningHausPixelCat.localizeBgName(bgDef);
        const bgCopy = document.createElement("span");
        bgCopy.textContent = `${t("Profile BG:", "พื้นหลังโปรไฟล์:")} ${LearningHausPixelCat.localizeBgName(bgDef)}`;
        bgBadge.append(swatchImg, bgCopy);
        rewards.append(bgBadge);
      }
    }

    const actionWrap = document.createElement("div");
    actionWrap.className = "quest-card__action";

    if (claimed) {
      const claimedPill = document.createElement("span");
      claimedPill.className = "quest-card__claimed-pill";
      claimedPill.innerHTML = `${SVG_ICONS.check}<span>${t("Claimed", "รับแล้ว")}</span>`;
      actionWrap.append(claimedPill);
    } else if (claimable) {
      const claimBtn = document.createElement("button");
      claimBtn.type = "button";
      claimBtn.className = "quest-card__claim-btn";
      claimBtn.dataset.claimQuest = quest.id;
      claimBtn.innerHTML = `${SVG_ICONS.gift}<span>${t("Claim Reward", "รับรางวัล")}</span>`;
      claimBtn.addEventListener("click", () => claimQuest(quest));
      actionWrap.append(claimBtn);
    } else {
      const statusText = document.createElement("span");
      statusText.className = "quest-card__status-label";
      statusText.textContent = t("In progress", "กำลังดำเนินการ");
      actionWrap.append(statusText);
    }

    footer.append(rewards, actionWrap);
    card.append(main, footer);
    return card;
  };

  export const getClaimableCount = (): number =>
    buildQuests().filter((q) => q.getProgress().current >= q.getProgress().target && !isClaimed(q)).length;

  export const render = (): void => {
    const quests = buildQuests();
    const dailyQuests = quests.filter((q) => q.scope === "daily");
    const generalQuests = quests.filter((q) => q.scope === "general");
    const courseQuests = quests.filter((q) => q.scope === "course");

    // 1. Sync Right-Hand Rail & Profile Card Daily Quest preview
    const railTarget =
      dailyQuests.find((q) => q.getProgress().current >= q.getProgress().target && !isClaimed(q)) ||
      dailyQuests.find((q) => !isClaimed(q)) ||
      quests.find((q) => q.getProgress().current >= q.getProgress().target && !isClaimed(q)) ||
      quests[0];

    if (railTarget) {
      const p = railTarget.getProgress();
      const pct = Math.max(0, Math.min(100, Math.round((p.current / Math.max(1, p.target)) * 100)));
      const claimable = p.current >= p.target && !isClaimed(railTarget);
      document.querySelectorAll<HTMLElement>("[data-daily-quest-title]").forEach((node) => {
        const titleSpan = document.createElement("span");
        titleSpan.className = "dq-rail__label";
        titleSpan.textContent = t(railTarget.titleEn, railTarget.titleTh);
        const countSpan = document.createElement("span");
        countSpan.className = `dq-rail__count${claimable ? " is-claimable" : ""}`;
        countSpan.textContent = claimable ? t("Claim!", "รับรางวัล!") : `${p.current}/${p.target}`;
        node.title = `${titleSpan.textContent} (${countSpan.textContent})`;
        node.replaceChildren(titleSpan, countSpan);
      });
      document.querySelectorAll<HTMLElement>("[data-hud-quest-title]").forEach((node) => {
        node.textContent = t(railTarget.titleEn, railTarget.titleTh);
      });
      document.querySelectorAll<HTMLElement>("[data-hud-quest-count]").forEach((node) => {
        node.textContent = claimable ? t("Claim!", "รับรางวัล!") : `${p.current}/${p.target}`;
        node.classList.toggle("is-claimable", claimable);
      });
      document.querySelectorAll<HTMLElement>("[data-daily-quest-meter]").forEach((node) => {
        node.setAttribute("aria-valuenow", String(pct));
        const fill = node.querySelector<HTMLElement>("span");
        if (fill) fill.style.width = `${pct}%`;
      });
    }

    // 2. Render Claimable Summary & Banner on Daily Quests page
    const claimableCount = quests.filter((q) => q.getProgress().current >= q.getProgress().target && !isClaimed(q)).length;
    const summaryEl = document.querySelector<HTMLElement>("[data-quests-summary]");
    if (summaryEl) {
      const enrolledCount = getEnrolledCourseIds().length;
      const unlockedPropsCount = readLifetime().unlockedProps.length;
      summaryEl.innerHTML = `
        <span class="quests-summary__pill${claimableCount > 0 ? " is-highlight" : ""}">${SVG_ICONS.gift}<span>${t(`${claimableCount} Ready to Claim`, `พร้อมรับรางวัล ${claimableCount} รายการ`)}</span></span>
        <span class="quests-summary__pill">${SVG_ICONS.layers}<span>${t(`${enrolledCount} Enrolled ${enrolledCount === 1 ? "Course" : "Courses"}`, `ลงทะเบียนแล้ว ${enrolledCount} คอร์ส`)}</span></span>
        <span class="quests-summary__pill">${SVG_ICONS.sparkles}<span>${t(`${unlockedPropsCount}/5 Exclusive Props`, `พร็อพพิเศษ ${unlockedPropsCount}/5 ชิ้น`)}</span></span>
      `;
    }

    const bannerEl = document.querySelector<HTMLElement>("[data-quests-banner]");
    if (bannerEl) {
      if (lastClaimBanner) {
        bannerEl.hidden = false;
        bannerEl.replaceChildren();
        const text = document.createElement("span");
        text.textContent = lastClaimBanner.message;
        bannerEl.append(text);
        if (lastClaimBanner.propId) {
          const tryBtn = document.createElement("button");
          tryBtn.type = "button";
          tryBtn.className = "quests-banner__btn";
          tryBtn.textContent = t("Equip in Creator", "ไปสวมในสตูดิโอ");
          tryBtn.addEventListener("click", () => {
            window.LearningHausPixelCat?.open?.();
          });
          bannerEl.append(tryBtn);
        } else if (lastClaimBanner.bgId) {
          const bgBtn = document.createElement("button");
          bgBtn.type = "button";
          bgBtn.className = "quests-banner__btn";
          bgBtn.dataset.homeNav = "profile";
          bgBtn.textContent = t("Use on Profile", "ไปตั้งค่าพื้นหลัง");
          bannerEl.append(bgBtn);
        }
      } else {
        bannerEl.hidden = true;
      }
    }

    // 3. Render Daily Quests Section
    const todayList = document.querySelector<HTMLElement>("[data-daily-quests-today]");
    if (todayList) {
      todayList.replaceChildren(...dailyQuests.map(renderQuestCard));
    }

    // 4. Render All Quests Section (Grouped: General Objectives + Enrolled Course Quests)
    const allList = document.querySelector<HTMLElement>("[data-daily-quests-all]");
    if (allList) {
      const frag = document.createDocumentFragment();

      const generalHead = document.createElement("div");
      generalHead.className = "quests-group-head";
      generalHead.innerHTML = `${SVG_ICONS.compass}<h3>${t("General Objectives", "เป้าหมายทั่วไป")}</h3><span>${generalQuests.length}</span>`;
      frag.append(generalHead);
      generalQuests.forEach((q) => frag.append(renderQuestCard(q)));

      const courseHead = document.createElement("div");
      courseHead.className = "quests-group-head quests-group-head--course";
      courseHead.innerHTML = `${SVG_ICONS.book}<h3>${t("Enrolled Course Quests", "เควสเฉพาะคอร์สที่ลงทะเบียน")}</h3><span>${courseQuests.length}</span>`;
      frag.append(courseHead);

      if (courseQuests.length > 0) {
        courseQuests.forEach((q) => frag.append(renderQuestCard(q)));
      } else {
        const empty = document.createElement("div");
        empty.className = "quests-empty-course";
        empty.innerHTML = `
          <div>
            <strong>${t("No enrolled courses yet", "ยังไม่ได้ลงทะเบียนคอร์สเรียน")}</strong>
            <p>${t("Enroll in any course on the Learn page to unlock course-specific quests and exclusive props.", "ลงทะเบียนเรียนคอร์สในหน้าเรียนรู้ เพื่อปลดล็อกเควสเฉพาะคอร์สและพร็อพพิเศษ")}</p>
          </div>
          <button class="learn-hub__btn-primary" type="button" data-home-nav="learn">${t("Browse Courses", "ไปเลือกคอร์ส")} ${SVG_ICONS.arrowRight}</button>
        `;
        frag.append(empty);
      }

      allList.replaceChildren(frag);
    }
  };

  export const getTotalClaimedQuestsCount = (): number => {
    const daily = readDailyLog();
    const lifetime = readLifetime();
    return new Set([...daily.claimedDailyIds, ...lifetime.claimedQuestIds]).size;
  };

  const init = (): void => {
    const homeView = document.getElementById("home-view");
    homeView?.addEventListener("learninghaus:lesson-open", (event) => {
      const detail = (event as CustomEvent<{ chapter?: number; courseId?: string }>).detail;
      const chapter = Number(detail?.chapter) || 1;
      const courseId = detail?.courseId || window.LearningHausLearnHub?.getActiveCourseId?.() || "eu-ai-act";
      recordLessonActivity(courseId, chapter);
    });

    window.addEventListener("learninghaus:chapter-video-ended", (event) => {
      const detail = (event as CustomEvent<{ chapter?: number }>).detail;
      const chapter = Number(detail?.chapter) || 1;
      const courseId = window.LearningHausLearnHub?.getActiveCourseId?.() || "eu-ai-act";
      recordLessonActivity(courseId, chapter);
    });

    window.addEventListener("learninghaus:stage-passed", (event) => {
      const detail = (event as CustomEvent<{ index?: number }>).detail;
      if (typeof detail?.index === "number") {
        recordStagePassedToday(detail.index);
      }
    });

    window.addEventListener("learninghaus:stage-progress-updated", () => render());
    window.addEventListener("learninghaus:library-updated", () => render());
    window.addEventListener("learninghaus:social-session", () => {
      lastClaimBanner = null;
      render();
    });
    window.addEventListener("learninghaus:language-changed", () => {
      lastClaimBanner = null;
      render();
    });

    render();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}

Object.assign(window, { LearningHausQuests });
