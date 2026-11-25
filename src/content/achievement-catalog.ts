// แค็ตตาล็อกกลาง: แก้ชื่อ คำอธิบาย เงื่อนไข และรูป Achievement ได้จากไฟล์นี้ (รองรับ EN / TH ครบถ้วน)
namespace LearningHausAchievementCatalog {
  export type Category = "general" | "subject" | "creator";
  export type UnlockRule =
    | { type: "first-lesson" }
    | { type: "lessons-complete"; count: number }
    | { type: "first-quiz" }
    | { type: "quizzes-complete"; count: number }
    | { type: "perfect-score"; minimumQuestions: number }
    | { type: "perfect-quizzes"; count: number }
    | { type: "fast-stage"; minimumCorrect: number; maximumSeconds: number }
    | { type: "fast-stages"; count: number }
    | { type: "failed-then-pass" }
    | { type: "subjects-complete"; count: number }
    | { type: "improved-replay" }
    | { type: "active-days"; count: number }
    | { type: "courses-complete"; count: number }
    | { type: "claimed-quests"; count: number }
    | { type: "creator-courses-published"; count: number }
    | { type: "creator-lessons-created"; count: number }
    | { type: "creator-quests-assigned"; count: number }
    | { type: "creator-students-complete"; count: number };

  export type Achievement = {
    id: string;
    category: Category;
    name: string;
    nameTh: string;
    description: string;
    descriptionTh: string;
    requirement: string;
    requirementTh: string;
    imagePath: string;
    unlockRule: UnlockRule;
  };

  export type CategoryMeta = {
    id: Category;
    label: string;
    labelTh: string;
    description: string;
    descriptionTh: string;
  };

  export const categories: CategoryMeta[] = [
    { id: "general", label: "General", labelTh: "การเรียนทั่วไป", description: "Common learning milestones earned across any class, subject, or study day.", descriptionTh: "ความสำเร็จทั่วไปที่เก็บได้จากทุกห้องเรียน ทุกวิชา และทุกวันเข้าเรียน" },
    { id: "subject", label: "Quiz & Mastery", labelTh: "พิชิตควิซ & ทักษะ", description: "Challenges for quiz accuracy, speed, comebacks, and quest collecting across any class.", descriptionTh: "ความท้าทายด้านการทำควิซ ความแม่นยำ ความเร็ว และการพิชิตเควสต์จากทุกคลาส" },
    { id: "creator", label: "Creator", labelTh: "ผู้สร้างห้องเรียน", description: "Recognition for creating classes, lessons, slides, quizzes, and quests for learners.", descriptionTh: "รางวัลสำหรับการสร้างห้องเรียน บทเรียน สไลด์ ควิซ และเควสต์เพื่อแบ่งปันความรู้" }
  ];

  export const all: Achievement[] = [
    // 1. GENERAL LEARNING (11 Common Badges: Easy -> Very Hard)
    { id: "beginner", category: "general", name: "Beginner", nameTh: "ผู้เริ่มต้น", description: "You completed your very first lesson.", descriptionTh: "คุณเริ่มต้นเส้นทางการเรียนรู้ด้วยการเรียนจบบทแรกแล้ว", requirement: "Complete 1 lesson in any class.", requirementTh: "เรียนจบ 1 บทเรียนในคลาสใดก็ได้ (ระดับง่าย)", imagePath: "lesson-assets/achievements/beginner.png", unlockRule: { type: "first-lesson" } },
    { id: "knowledge-seeker", category: "general", name: "Knowledge Seeker", nameTh: "นักแสวงหาความรู้", description: "You completed five lessons across your classes.", descriptionTh: "คุณเรียนจบครบ 5 บทเรียนจากคลาสใดก็ได้แล้ว", requirement: "Complete 5 unique lessons in any class.", requirementTh: "เรียนจบครบ 5 บทเรียนที่ไม่ซ้ำกันในคลาสใดก็ได้ (ระดับง่าย)", imagePath: "lesson-assets/achievements/knowledge-seeker.png", unlockRule: { type: "lessons-complete", count: 5 } },
    { id: "lesson-sprinter", category: "general", name: "Dedicated Learner", nameTh: "ผู้เรียนมุ่งมั่น", description: "Steady progress across many lessons.", descriptionTh: "สะสมความรู้ต่อเนื่องจากการเรียนหลายบทเรียน", requirement: "Complete 15 unique lessons across any classes.", requirementTh: "เรียนจบครบ 15 บทเรียนจากคลาสใดก็ได้ (ระดับปานกลาง)", imagePath: "lesson-assets/achievements/lesson-sprinter.png", unlockRule: { type: "lessons-complete", count: 15 } },
    { id: "dedicated-scholar", category: "general", name: "Grand Scholar", nameTh: "นักปราชญ์ผู้ยิ่งใหญ่", description: "Deep commitment to learning every day.", descriptionTh: "ความมุ่งมั่นในการเรียนรู้ของคุณโดดเด่นอย่างยิ่ง", requirement: "Complete 40 unique lessons across any classes.", requirementTh: "เรียนจบครบ 40 บทเรียนจากคลาสใดก็ได้ (ระดับยาก)", imagePath: "lesson-assets/achievements/dedicated-scholar.png", unlockRule: { type: "lessons-complete", count: 40 } },
    { id: "curious-explorer", category: "general", name: "Curious Explorer", nameTh: "นักสำรวจข้ามวิชา", description: "You explored different fields of study.", descriptionTh: "คุณได้สำรวจและเรียนรู้หลากหลายสาขาวิชา", requirement: "Complete lessons in 3 different subjects.", requirementTh: "เรียนจบบทเรียนอย่างน้อย 3 หมวดวิชาที่ต่างกัน (ระดับปานกลาง)", imagePath: "lesson-assets/achievements/curious-explorer.png", unlockRule: { type: "subjects-complete", count: 3 } },
    { id: "polymath-explorer", category: "general", name: "Polymath", nameTh: "พหูสูตหลายศาสตร์", description: "You study across many different topics.", descriptionTh: "คุณเรียนรู้ข้ามสายวิชาได้อย่างกว้างขวางรอบด้าน", requirement: "Complete lessons in 5 different subjects.", requirementTh: "เรียนจบบทเรียนครบ 5 หมวดวิชาที่ต่างกัน (ระดับยาก)", imagePath: "lesson-assets/achievements/polymath-explorer.png", unlockRule: { type: "subjects-complete", count: 5 } },
    { id: "consistent-learner", category: "general", name: "3-Day Streak", nameTh: "เรียนต่อเนื่อง 3 วัน", description: "Small steps add up over time.", descriptionTh: "ความสม่ำเสมอวันละนิดสร้างความก้าวหน้าที่ยิ่งใหญ่", requirement: "Study or finish a quiz on 3 different days.", requirementTh: "เข้าเรียนหรือทำควิซครบ 3 วันที่ต่างกัน (ระดับง่าย)", imagePath: "lesson-assets/achievements/consistent-learner.png", unlockRule: { type: "active-days", count: 3 } },
    { id: "habit-builder", category: "general", name: "7-Day Habit", nameTh: "ผู้สร้างวินัย 7 วัน", description: "Learning is now part of your daily life.", descriptionTh: "การเรียนรู้กลายเป็นนิสัยประจำวันของคุณแล้ว", requirement: "Study or finish a quiz on 7 different days.", requirementTh: "เข้าเรียนหรือทำควิซครบ 7 วันที่ต่างกัน (ระดับยาก)", imagePath: "lesson-assets/achievements/habit-builder.png", unlockRule: { type: "active-days", count: 7 } },
    { id: "course-finisher", category: "general", name: "Course Finisher", nameTh: "ผู้พิชิตคอร์สแรก", description: "You finished every lesson in a full class.", descriptionTh: "คุณเรียนจบครบทุกบทเรียนใน 1 คลาสเรียบร้อยแล้ว", requirement: "Complete all lessons in 1 class.", requirementTh: "เรียนจบครบทั้งคลาสอย่างน้อย 1 คลาส (ระดับปานกลาง)", imagePath: "lesson-assets/achievements/course-finisher.png", unlockRule: { type: "courses-complete", count: 1 } },
    { id: "expert", category: "general", name: "Expert", nameTh: "ผู้เชี่ยวชาญ", description: "You graduated from three full classes.", descriptionTh: "คุณเรียนจบครบทั้งคอร์สแล้วถึง 3 ห้องเรียน", requirement: "Complete 3 different classes.", requirementTh: "เรียนจบครบ 3 คลาสที่ต่างกัน (ระดับยาก)", imagePath: "lesson-assets/achievements/expert.png", unlockRule: { type: "courses-complete", count: 3 } },
    { id: "master", category: "general", name: "Grand Master", nameTh: "ปรมาจารย์ 5 คอร์ส", description: "You completed a wide collection of classes.", descriptionTh: "คุณพิชิตคลาสเรียนได้อย่างครอบคลุมรอบด้าน", requirement: "Complete 5 different classes.", requirementTh: "เรียนจบครบ 5 คลาสที่ต่างกัน (ระดับท้าทายสูงสุด)", imagePath: "lesson-assets/achievements/master.png", unlockRule: { type: "courses-complete", count: 5 } },

    // 2. QUIZ & MASTERY (10 Common Badges: Easy -> Very Hard)
    { id: "quiz-challenger", category: "subject", name: "First Quiz", nameTh: "ควิซแรกสำเร็จ", description: "You finished your first quiz.", descriptionTh: "คุณทำควิซครั้งแรกสำเร็จแล้ว", requirement: "Finish 1 quiz in any class.", requirementTh: "ทำควิซให้จบอย่างน้อย 1 ครั้งในคลาสใดก็ได้ (ระดับง่าย)", imagePath: "lesson-assets/achievements/quiz-challenger.png", unlockRule: { type: "first-quiz" } },
    { id: "quiz-veteran", category: "subject", name: "Quiz Veteran", nameTh: "จอมยุทธ์ควิซ 10 ด่าน", description: "Experienced across ten quiz runs.", descriptionTh: "ผ่านการทำควิซมาแล้วครบ 10 ครั้ง", requirement: "Complete 10 quizzes in any class.", requirementTh: "ทำควิซสะสมครบ 10 ครั้งจากคลาสใดก็ได้ (ระดับปานกลาง)", imagePath: "lesson-assets/achievements/quiz-veteran.png", unlockRule: { type: "quizzes-complete", count: 10 } },
    { id: "quiz-champion", category: "subject", name: "Quiz Champion", nameTh: "แชมป์ควิซ 30 ด่าน", description: "You have conquered thirty quiz challenges.", descriptionTh: "พิชิตด่านควิซสะสมครบ 30 ครั้งอย่างยอดเยี่ยม", requirement: "Complete 30 quizzes in any class.", requirementTh: "ทำควิซสะสมครบ 30 ครั้งจากคลาสใดก็ได้ (ระดับยาก)", imagePath: "lesson-assets/achievements/quiz-champion.png", unlockRule: { type: "quizzes-complete", count: 30 } },
    { id: "perfect-score", category: "subject", name: "Perfect Score", nameTh: "คะแนนเต็ม 100%", description: "Every answer was right.", descriptionTh: "ตอบถูกครบทุกข้อโดยไม่พลาดเลย", requirement: "Get 100% on any quiz.", requirementTh: "ทำคะแนนเต็ม 100% ในควิซอย่างน้อย 1 ครั้ง (ระดับปานกลาง)", imagePath: "lesson-assets/achievements/perfect-score.png", unlockRule: { type: "perfect-score", minimumQuestions: 5 } },
    { id: "flawless-trio", category: "subject", name: "Flawless Master", nameTh: "ไร้ที่ติ 3 ครั้ง", description: "Multiple 100% scores with total accuracy.", descriptionTh: "ทำคะแนนเต็ม 100% ได้หลายครั้งอย่างแม่นยำ", requirement: "Get 100% on 3 quizzes.", requirementTh: "ทำคะแนนเต็ม 100% สะสมครบ 3 ครั้ง (ระดับยาก)", imagePath: "lesson-assets/achievements/flawless-trio.png", unlockRule: { type: "perfect-quizzes", count: 3 } },
    { id: "fast-thinker", category: "subject", name: "Fast Thinker", nameTh: "คิดไวแม่นยำ", description: "Quick thinking and strong accuracy.", descriptionTh: "คิดเร็วและตอบได้อย่างแม่นยำยอดเยี่ยม", requirement: "Score 80% or higher in under 3 minutes.", requirementTh: "ทำคะแนน 80% ขึ้นไปภายในเวลาไม่เกิน 3 นาที (ระดับปานกลาง)", imagePath: "lesson-assets/achievements/fast-thinker.png", unlockRule: { type: "fast-stage", minimumCorrect: 8, maximumSeconds: 180 } },
    { id: "lightning-master", category: "subject", name: "Speed Legend", nameTh: "ตำนานสายฟ้า 5 ครั้ง", description: "Fast and accurate across five quizzes.", descriptionTh: "ทำควิซได้ทั้งรวดเร็วและแม่นยำสูงครบ 5 ครั้ง", requirement: "Clear 5 fast quizzes (80%+ in under 3 minutes).", requirementTh: "ผ่านเกณฑ์คิดไวแม่นยำสะสมครบ 5 ครั้ง (ระดับท้าทายสูงสุด)", imagePath: "lesson-assets/achievements/lightning-master.png", unlockRule: { type: "fast-stages", count: 5 } },
    { id: "comeback", category: "subject", name: "Comeback Learner", nameTh: "ไม่ยอมแพ้", description: "You tried again after a miss and passed.", descriptionTh: "คุณกลับมาฝึกใหม่หลังทำพลาดและผ่านได้สำเร็จ", requirement: "Retry a quiz you missed and pass it.", requirementTh: "กลับมาแก้ตัวในควิซที่เคยพลาดจนผ่านสำเร็จ (ระดับง่าย)", imagePath: "lesson-assets/achievements/comeback.png", unlockRule: { type: "failed-then-pass" } },
    { id: "growth-mindset", category: "subject", name: "Growth Mindset", nameTh: "พัฒนาไม่หยุดยั้ง", description: "Practice helped you beat your old score.", descriptionTh: "การฝึกซ้ำช่วยให้คะแนนของคุณสูงขึ้นกว่าเดิม", requirement: "Replay any quiz and get a higher score.", requirementTh: "เล่นควิซเดิมซ้ำและทำคะแนนให้สูงกว่าเดิม (ระดับง่าย)", imagePath: "lesson-assets/achievements/growth-mindset.png", unlockRule: { type: "improved-replay" } },
    { id: "quest-hunter", category: "subject", name: "Quest Collector", nameTh: "นักล่าเควสต์", description: "You completed and claimed multiple quests.", descriptionTh: "คุณทำภารกิจสำเร็จและรับรางวัลเควสต์ไปแล้วหลายครั้ง", requirement: "Claim 3 rewards from Daily or Course Quests.", requirementTh: "รับรางวัลจากเควสต์ประจำวันหรือเควสต์คอร์สครบ 3 ครั้ง (ระดับปานกลาง)", imagePath: "lesson-assets/achievements/quest-hunter.png", unlockRule: { type: "claimed-quests", count: 3 } },

    // 3. CREATOR & COMMUNITY (6 Common Badges: Easy -> Very Hard)
    { id: "first-creator", category: "creator", name: "First Class Creator", nameTh: "ผู้สร้างห้องเรียนแรก", description: "Your first class is ready for learners.", descriptionTh: "ห้องเรียนแรกที่คุณสร้างพร้อมให้ผู้เรียนเข้าศึกษาแล้ว", requirement: "Create and publish your first class.", requirementTh: "สร้างห้องเรียนแรกของคุณ (ระดับง่าย)", imagePath: "lesson-assets/achievements/first-creator.png", unlockRule: { type: "creator-courses-published", count: 1 } },
    { id: "knowledge-sharer", category: "creator", name: "Lesson Maker", nameTh: "ผู้สร้างบทเรียน 5 บท", description: "You built lessons with slides, videos, or articles.", descriptionTh: "คุณสร้างบทเรียนคุณภาพทั้งสไลด์ วิดีโอ หรือบทความ", requirement: "Create 5 lessons across your classes.", requirementTh: "สร้างบทเรียนสะสมครบ 5 บทเรียน (ระดับปานกลาง)", imagePath: "lesson-assets/achievements/knowledge-sharer.png", unlockRule: { type: "creator-lessons-created", count: 5 } },
    { id: "curriculum-master", category: "creator", name: "Curriculum Builder", nameTh: "นักออกแบบ 12 บทเรียน", description: "Built a rich library of custom lessons.", descriptionTh: "สร้างคลังบทเรียนและสื่อการสอนไว้มากมาย", requirement: "Create 12 lessons across your classes.", requirementTh: "สร้างบทเรียนสะสมครบ 12 บทเรียน (ระดับยาก)", imagePath: "lesson-assets/achievements/curriculum-master.png", unlockRule: { type: "creator-lessons-created", count: 12 } },
    { id: "quest-designer", category: "creator", name: "Quest Designer", nameTh: "นักออกแบบเควสต์", description: "You assigned fun quests with class rewards.", descriptionTh: "คุณมอบหมายเควสต์พร้อมรางวัลประจำคลาสให้ผู้เรียน", requirement: "Assign 2 Course Quests in your classes.", requirementTh: "มอบหมายเควสต์ประจำคลาสครบ 2 เควสต์ (ระดับง่าย)", imagePath: "lesson-assets/achievements/quest-designer.png", unlockRule: { type: "creator-quests-assigned", count: 2 } },
    { id: "course-architect", category: "creator", name: "Course Architect", nameTh: "สถาปนิก 3 ห้องเรียน", description: "You created a collection of three classes.", descriptionTh: "คุณออกแบบและพัฒนาห้องเรียนไว้หลายคอร์ส", requirement: "Create 3 different classes.", requirementTh: "สร้างห้องเรียนครบ 3 ห้องเรียน (ระดับยาก)", imagePath: "lesson-assets/achievements/course-architect.png", unlockRule: { type: "creator-courses-published", count: 3 } },
    { id: "learning-mentor", category: "creator", name: "Learning Mentor", nameTh: "พี่เลี้ยงแห่งการเรียนรู้", description: "Your classes helped many learners succeed.", descriptionTh: "ห้องเรียนของคุณช่วยให้ผู้เรียนจำนวนมากเรียนรู้สำเร็จ", requirement: "Have 10 learners join or finish your classes.", requirementTh: "มีผู้เรียนเข้าร่วมหรือเรียนจบคลาสของคุณครบ 10 คน (ระดับท้าทายสูงสุด)", imagePath: "lesson-assets/achievements/learning-mentor.png", unlockRule: { type: "creator-students-complete", count: 10 } }
  ];

  const isTh = (): boolean => typeof LearningHausI18n !== "undefined" && LearningHausI18n.isThai();
  export const localizeName = (a: Achievement): string => (isTh() ? a.nameTh : a.name);
  export const localizeDescription = (a: Achievement): string => (isTh() ? a.descriptionTh : a.description);
  export const localizeRequirement = (a: Achievement): string => (isTh() ? a.requirementTh : a.requirement);
  export const localizeCategoryLabel = (c: CategoryMeta): string => (isTh() ? c.labelTh : c.label);
}
