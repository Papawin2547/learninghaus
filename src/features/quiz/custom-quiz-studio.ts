// Draft B Guided 3-Tab Custom Quiz Map Studio + 8 Distinct Web Audio BGM Themes + Playable Course Quiz Map + 7-Format Mixed Minigame Runner
namespace LearningHausCustomQuizStudio {
  export type MixedItemKind =
    | "quiz"
    | "true-false-sprint"
    | "matching"
    | "binary-stamp"
    | "sorting"
    | "order-steps"
    | "scenario";

  export type CustomQuizQuestionItem = {
    id: string;
    kind: MixedItemKind;
    prompt: string;
    options?: string[];
    correctIndex?: number;
    isTrue?: boolean;
    pairs?: { left: string; right: string }[];
    leftLabel?: string;
    rightLabel?: string;
    stampAnswer?: "left" | "right";
    buckets?: string[];
    sortItems?: { text: string; bucketIdx: number }[];
    steps?: string[];
    explanation?: string;
  };

  export type CustomQuizStage = {
    id: string;
    title: string;
    themePresetId?: number;
    timeLimitSeconds: number;
    items: CustomQuizQuestionItem[];
  };

  export type StudioChapterLike = {
    title: string;
    summaryEn?: string;
    summaryTh?: string;
    hasQuiz?: boolean;
    quizThemePreset?: number;
    quizStages?: CustomQuizStage[];
  };

  export type StudioCourseLike = {
    id: string;
    title: string;
    chapters: readonly StudioChapterLike[];
  };

  type ThemePresetMeta = {
    id: number;
    roman: string;
    nameEn: string;
    nameTh: string;
    bgmEn: string;
    bgmTh: string;
    cardGrad: string;
    biomeBg: string;
    bannerBg: string;
    accent: string;
    dark: boolean;
  };

  export const THEME_PRESETS: ThemePresetMeta[] = [
    // 5 Kept General Fantasy Themes (Law themes removed)
    { id: 1, roman: "I", nameEn: "Obsidian Vault", nameTh: "หอคอยศิลาดำ", bgmEn: "Mystery Tension (92 BPM)", bgmTh: "ลึกลับตื่นเต้น (โทนดาร์ก)", cardGrad: "linear-gradient(135deg,#251924,#7D1B28)", biomeBg: "linear-gradient(180deg,#251924 0%,#371C27 100%)", bannerBg: "#7D1B28", accent: "#C93B3B", dark: true },
    { id: 2, roman: "II", nameEn: "Amber Bastion", nameTh: "ป้อมปราการอำพัน", bgmEn: "Heroic March (128 BPM)", bgmTh: "มาร์ชผู้กล้า (จังหวะคึกคัก)", cardGrad: "linear-gradient(135deg,#9E4B14,#D97028)", biomeBg: "linear-gradient(180deg,#FDF3E8 0%,#F3DAC2 100%)", bannerBg: "#B3521B", accent: "#D97028", dark: false },
    { id: 3, roman: "III", nameEn: "Mirror Observatory", nameTh: "หอดูดาวกระจก", bgmEn: "Starlight Chimes (84 BPM)", bgmTh: "กระดิ่งแสงดาว (นุ่มนวล)", cardGrad: "linear-gradient(135deg,#3C4287,#4CA3DD)", biomeBg: "linear-gradient(180deg,#EEF0FC 0%,#DAE0F7 100%)", bannerBg: "#3C4287", accent: "#545BB8", dark: false },
    { id: 4, roman: "IV", nameEn: "Astral Spire", nameTh: "หอคอยจอมเวท", bgmEn: "Arcane 8-Bit (144 BPM)", bgmTh: "เวทมนตร์ 8-Bit (เร็วสนุก)", cardGrad: "linear-gradient(135deg,#281945,#8E44E3)", biomeBg: "linear-gradient(180deg,#281945 0%,#422269 100%)", bannerBg: "#6422AD", accent: "#8E44E3", dark: true },
    { id: 5, roman: "V", nameEn: "Emerald Conservatory", nameTh: "เรือนกระจกมรกต", bgmEn: "Botanical Lo-Fi (80 BPM)", bgmTh: "ชิลล์พฤกษา (Lo-Fi อ่านเพลิน)", cardGrad: "linear-gradient(135deg,#125E4A,#1C8A6E)", biomeBg: "linear-gradient(180deg,#E7F7F2 0%,#CDEAE0 100%)", bannerBg: "#166E58", accent: "#1C8A6E", dark: false },
    // 5 New Cozy & Nature Themes
    { id: 6, roman: "VI", nameEn: "Cozy Cat Cafe", nameTh: "คาเฟ่แมวอบอุ่น", bgmEn: "Warm Cafe Swing (96 BPM)", bgmTh: "คาเฟ่สวิงอบอุ่น (น่ารักผ่อนคลาย)", cardGrad: "linear-gradient(135deg,#9C6644,#D49A6A)", biomeBg: "linear-gradient(180deg,#FFF5E6 0%,#EED0B1 100%)", bannerBg: "#9C6644", accent: "#C67C4E", dark: false },
    { id: 7, roman: "VII", nameEn: "Snowy Peak", nameTh: "ภูเขาหิมะ", bgmEn: "Winter Crystal (104 BPM)", bgmTh: "คริสตัลฤดูหนาว (ใสเย็นสบาย)", cardGrad: "linear-gradient(135deg,#2F6690,#6FA8DC)", biomeBg: "linear-gradient(180deg,#D4EBFA 0%,#CFE4F5 100%)", bannerBg: "#2F6690", accent: "#3B82B6", dark: false },
    { id: 8, roman: "VIII", nameEn: "Sunflower Meadow", nameTh: "ทุ่งทานตะวัน", bgmEn: "Sunny Breeze (118 BPM)", bgmTh: "สายลมแดดอุ่น (สดใสมีพลัง)", cardGrad: "linear-gradient(135deg,#3B8146,#D4A017)", biomeBg: "linear-gradient(180deg,#C9EDFA 0%,#E7F2C4 100%)", bannerBg: "#3B8146", accent: "#D4A017", dark: false },
    { id: 9, roman: "IX", nameEn: "Starlit Desert", nameTh: "ทะเลทรายแสงดาว", bgmEn: "Desert Mirage (100 BPM)", bgmTh: "ทะเลทรายใต้แสงจันทร์ (ชวนฝัน)", cardGrad: "linear-gradient(135deg,#1A2346,#9E6A3E)", biomeBg: "linear-gradient(180deg,#141C3A 0%,#5B4258 100%)", bannerBg: "#2B3467", accent: "#D49A54", dark: true },
    { id: 10, roman: "X", nameEn: "Riverside Village", nameTh: "หมู่บ้านริมน้ำ", bgmEn: "Morning Brook (90 BPM)", bgmTh: "ลำธารยามเช้า (สงบสดชื่น)", cardGrad: "linear-gradient(135deg,#2C7A7B,#D98A6C)", biomeBg: "linear-gradient(180deg,#FCE8DE 0%,#C8E6DF 100%)", bannerBg: "#2C7A7B", accent: "#319795", dark: false }
  ];

  const ITEM_KINDS: { kind: MixedItemKind; labelEn: string; labelTh: string; tipEn: string; tipTh: string }[] = [
    { kind: "quiz", labelEn: "4-Choice", labelTh: "4 ตัวเลือก", tipEn: "Classic multiple-choice question with 1 correct answer.", tipTh: "คำถามปรนัย 4 ตัวเลือก ให้ผู้เล่นเลือกคำตอบที่ถูกต้อง 1 ข้อ" },
    { kind: "true-false-sprint", labelEn: "True / False", labelTh: "จริง / เท็จ", tipEn: "Fast True or False check on a statement.", tipTh: "ทายข้อความว่าเป็น จริง (True) หรือ เท็จ (False)" },
    { kind: "matching", labelEn: "Pair Match", labelTh: "จับคู่", tipEn: "Players tap left items to match with their right-hand pairs.", tipTh: "ผู้เล่นกดจับคู่คำฝั่งซ้ายให้ตรงกับความหมายฝั่งขวา" },
    { kind: "binary-stamp", labelEn: "Rapid Stamp", labelTh: "ประทับตรา", tipEn: "Judge a case into one of 2 custom verdicts (e.g. Safe vs Risky).", tipTh: "ตัดสินกรณีตัวอย่างโดยกดประทับตรา 1 ใน 2 ฝั่งที่คุณตั้งชื่อเอง" },
    { kind: "sorting", labelEn: "Category Sort", labelTh: "แยกหมวดหมู่", tipEn: "Sort items into 2 custom category buckets.", tipTh: "คัดแยกรายการต่างๆ ลงในกล่องหมวดหมู่ 2 ฝั่งให้ถูกต้อง" },
    { kind: "order-steps", labelEn: "Step Sequence", labelTh: "เรียงลำดับ", tipEn: "Steps are shuffled; players tap them from 1st to last.", tipTh: "ระบบจะสุ่มสลับขั้นตอนให้ ผู้เล่นต้องกดเรียงจากขั้นที่ 1 ไปจนครบ" },
    { kind: "scenario", labelEn: "Decision Path", labelTh: "สถานการณ์", tipEn: "Present a real-world scenario and choose the best action.", tipTh: "จำลองสถานการณ์จริงให้ผู้เล่นเลือกแนวทางตัดสินใจที่ดีที่สุด" }
  ];

  const t = (en: string, th: string): string => LearningHausI18n.t(en, th);
  const esc = (s: string): string =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const uid = (prefix: string): string => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  export const getThemePreset = (id?: number): ThemePresetMeta =>
    THEME_PRESETS.find((p) => p.id === id) || THEME_PRESETS[0];

  export const createDefaultItem = (kind: MixedItemKind = "quiz", idx = 1): CustomQuizQuestionItem => {
    const id = uid("q");
    if (kind === "true-false-sprint") {
      return { id, kind, prompt: t(`Statement #${idx}: This key concept is true.`, `ข้อความข้อที่ ${idx}: แนวคิดหลักนี้ถูกต้อง`), isTrue: true, explanation: "" };
    }
    if (kind === "matching") {
      return {
        id,
        kind,
        prompt: t("Match each term with its correct meaning.", "จับคู่คำศัพท์กับความหมายที่ถูกต้อง"),
        pairs: [
          { left: t("Concept A", "แนวคิด A"), right: t("Definition A", "คำอธิบาย A") },
          { left: t("Concept B", "แนวคิด B"), right: t("Definition B", "คำอธิบาย B") },
          { left: t("Concept C", "แนวคิด C"), right: t("Definition C", "คำอธิบาย C") }
        ],
        explanation: ""
      };
    }
    if (kind === "binary-stamp") {
      return {
        id,
        kind,
        prompt: t("Review this case and stamp the right verdict.", "ตรวจสอบกรณีนี้แล้วประทับตราฝั่งที่ถูกต้อง"),
        leftLabel: t("Approve", "ถูกต้อง / ผ่าน"),
        rightLabel: t("Flag", "ต้องระวัง / ไม่ผ่าน"),
        stampAnswer: "left",
        explanation: ""
      };
    }
    if (kind === "sorting") {
      return {
        id,
        kind,
        prompt: t("Sort each item into the matching category.", "คัดแยกแต่ละรายการลงในหมวดหมู่ที่ถูกต้อง"),
        buckets: [t("Category A", "หมวดหมู่ A"), t("Category B", "หมวดหมู่ B")],
        sortItems: [
          { text: t("Example 1", "ตัวอย่างที่ 1"), bucketIdx: 0 },
          { text: t("Example 2", "ตัวอย่างที่ 2"), bucketIdx: 1 },
          { text: t("Example 3", "ตัวอย่างที่ 3"), bucketIdx: 0 }
        ],
        explanation: ""
      };
    }
    if (kind === "order-steps") {
      return {
        id,
        kind,
        prompt: t("Arrange these steps in the correct order.", "เรียงลำดับขั้นตอนต่อไปนี้จากแรกไปสุดท้าย"),
        steps: [t("Step 1: Prepare", "ขั้นที่ 1: เตรียมข้อมูล"), t("Step 2: Apply", "ขั้นที่ 2: ลงมือทำ"), t("Step 3: Review", "ขั้นที่ 3: ตรวจสอบผล")],
        explanation: ""
      };
    }
    if (kind === "scenario") {
      return {
        id,
        kind,
        prompt: t("A real-world situation comes up. What is the best action?", "เมื่อเจอสถานการณ์จริงในบทเรียนนี้ ควรตัดสินใจอย่างไรดีที่สุด?"),
        options: [t("Best practice choice", "ทางเลือกที่เหมาะสมที่สุด"), t("Risky shortcut", "ทางลัดที่มีความเสี่ยง"), t("Ignore the issue", "ปล่อยผ่านไม่แก้ไข")],
        correctIndex: 0,
        explanation: ""
      };
    }
    return {
      id,
      kind: "quiz",
      prompt: t(`Question #${idx}: Choose the best answer.`, `คำถามข้อที่ ${idx}: เลือกคำตอบที่ถูกต้องที่สุด`),
      options: [t("Correct option", "ตัวเลือกที่ถูกต้อง"), t("Option B", "ตัวเลือก ข"), t("Option C", "ตัวเลือก ค"), t("Option D", "ตัวเลือก ง")],
      correctIndex: 0,
      explanation: ""
    };
  };

  export const createDefaultStage = (stageNum: number, lessonTitle?: string): CustomQuizStage => ({
    id: uid("st"),
    title: lessonTitle ? `${t("Stage", "ด่าน")} ${stageNum}: ${lessonTitle}` : `${t("Stage", "ด่าน")} ${stageNum}`,
    timeLimitSeconds: 90,
    items: [createDefaultItem("quiz", 1), createDefaultItem("true-false-sprint", 2), createDefaultItem("matching", 3)]
  });

  export const ensureLessonQuizConfig = (ch: StudioChapterLike, lessonIdx = 0): void => {
    if (!ch.quizThemePreset || ch.quizThemePreset < 1 || ch.quizThemePreset > 10) {
      ch.quizThemePreset = ((lessonIdx + 5) % 10) + 1;
    }
    if (!Array.isArray(ch.quizStages)) {
      ch.quizStages = [];
    }
  };

  const CUSTOM_DONE_KEY = "learninghaus.customQuizDone.v1";
  type CustomStageRecord = { bestScore: number; completedAt: string };
  const readDoneMap = (): Record<string, CustomStageRecord> =>
    LearningHausAccountStorage.readJson<Record<string, CustomStageRecord>>(CUSTOM_DONE_KEY, {});
  const saveStageDone = (courseId: string, chIdx: number, stageId: string, score: number): void => {
    const map = readDoneMap();
    const key = `${courseId}:${chIdx}:${stageId}`;
    const prev = map[key];
    map[key] = { bestScore: Math.max(prev?.bestScore || 0, score), completedAt: new Date().toISOString() };
    LearningHausAccountStorage.writeJson(CUSTOM_DONE_KEY, map);
  };
  const getStageRecord = (courseId: string, chIdx: number, stageId: string): CustomStageRecord | null =>
    readDoneMap()[`${courseId}:${chIdx}:${stageId}`] || null;
  export const isStageCleared = (courseId: string, chIdx: number, stageId: string): boolean =>
    Boolean(getStageRecord(courseId, chIdx, stageId));
  export const markStageCleared = (courseId: string, chIdx: number, stageId: string, score: number): void => {
    saveStageDone(courseId, chIdx, stageId, score);
    window.dispatchEvent(
      new CustomEvent("learninghaus:custom-quiz-cleared", { detail: { courseId, chIdx, stageId, score } })
    );
    window.dispatchEvent(new Event("learninghaus:library-updated"));
  };

  // Dedicated 8-Theme Distinct Web Audio BGM Synthesizer
  type BgmPattern = {
    bpm: number;
    leadWave: OscillatorType;
    bassWave: OscillatorType;
    lead: number[];
    bass: number[];
    gain: number;
  };
  const THEME_BGM_PATTERNS: Record<number, BgmPattern> = {
    1: { bpm: 92, leadWave: "sawtooth", bassWave: "triangle", gain: 0.055, lead: [293.66, 0, 349.23, 329.63, 293.66, 440.0, 415.3, 329.63], bass: [146.83, 146.83, 130.81, 130.81, 116.54, 116.54, 110.0, 110.0] },
    2: { bpm: 128, leadWave: "square", bassWave: "triangle", gain: 0.055, lead: [392.0, 493.88, 587.33, 587.33, 659.25, 587.33, 493.88, 783.99], bass: [196.0, 146.83, 196.0, 146.83, 220.0, 164.81, 196.0, 146.83] },
    3: { bpm: 84, leadWave: "sine", bassWave: "sine", gain: 0.09, lead: [698.46, 880.0, 987.77, 1046.5, 987.77, 880.0, 783.99, 659.25], bass: [174.61, 0, 220.0, 0, 196.0, 0, 164.81, 0] },
    4: { bpm: 144, leadWave: "square", bassWave: "square", gain: 0.045, lead: [440.0, 523.25, 659.25, 880.0, 783.99, 659.25, 523.25, 587.33], bass: [220.0, 220.0, 196.0, 196.0, 174.61, 174.61, 164.81, 164.81] },
    5: { bpm: 80, leadWave: "triangle", bassWave: "sine", gain: 0.085, lead: [311.13, 392.0, 466.16, 587.33, 523.25, 466.16, 392.0, 0], bass: [155.56, 155.56, 130.81, 130.81, 174.61, 174.61, 116.54, 116.54] },
    6: { bpm: 96, leadWave: "triangle", bassWave: "sine", gain: 0.085, lead: [523.25, 0, 659.25, 587.33, 698.46, 659.25, 587.33, 493.88], bass: [261.63, 196.0, 220.0, 174.61, 196.0, 146.83, 196.0, 261.63] },
    7: { bpm: 104, leadWave: "sine", bassWave: "triangle", gain: 0.085, lead: [783.99, 659.25, 587.33, 783.99, 880.0, 783.99, 659.25, 523.25], bass: [196.0, 196.0, 164.81, 164.81, 174.61, 174.61, 130.81, 130.81] },
    8: { bpm: 118, leadWave: "triangle", bassWave: "triangle", gain: 0.08, lead: [587.33, 659.25, 739.99, 880.0, 739.99, 659.25, 587.33, 739.99], bass: [146.83, 220.0, 196.0, 220.0, 164.81, 220.0, 146.83, 220.0] },
    9: { bpm: 100, leadWave: "sawtooth", bassWave: "sine", gain: 0.055, lead: [329.63, 349.23, 415.3, 440.0, 415.3, 349.23, 329.63, 0], bass: [164.81, 164.81, 164.81, 164.81, 146.83, 146.83, 164.81, 123.47] },
    10: { bpm: 90, leadWave: "sine", bassWave: "sine", gain: 0.09, lead: [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 440.0], bass: [261.63, 0, 196.0, 0, 220.0, 0, 174.61, 0] }
  };

  let previewingBgmPreset: number | null = null;
  let bgmCtx: AudioContext | null = null;
  let bgmInterval: number | null = null;

  export const stopThemeBgm = (): void => {
    previewingBgmPreset = null;
    if (bgmInterval !== null) {
      window.clearInterval(bgmInterval);
      bgmInterval = null;
    }
    window.LearningHausSettings?.stopBgm?.();
  };

  export const playThemeBgm = (presetId: number): void => {
    stopThemeBgm();
    const id = Math.max(1, Math.min(10, presetId));
    previewingBgmPreset = id;
    const pat = THEME_BGM_PATTERNS[id] || THEME_BGM_PATTERNS[1];
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      if (!bgmCtx) bgmCtx = new AC();
      if (bgmCtx.state === "suspended") bgmCtx.resume().catch(() => undefined);
      let step = 0;
      const stepMs = Math.round((60 / pat.bpm) * 500);
      const playStep = (): void => {
        if (!bgmCtx || previewingBgmPreset !== id) return;
        const now = bgmCtx.currentTime;
        const dur = stepMs / 1000;
        const lFreq = pat.lead[step % pat.lead.length];
        const bFreq = pat.bass[step % pat.bass.length];
        if (lFreq > 0) {
          const osc = bgmCtx.createOscillator();
          const g = bgmCtx.createGain();
          osc.type = pat.leadWave;
          osc.frequency.setValueAtTime(lFreq, now);
          g.gain.setValueAtTime(0.001, now);
          g.gain.linearRampToValueAtTime(pat.gain, now + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0008, now + dur * 0.92);
          osc.connect(g);
          g.connect(bgmCtx.destination);
          osc.start(now);
          osc.stop(now + dur);
        }
        if (bFreq > 0) {
          const bOsc = bgmCtx.createOscillator();
          const bg = bgmCtx.createGain();
          bOsc.type = pat.bassWave;
          bOsc.frequency.setValueAtTime(bFreq, now);
          bg.gain.setValueAtTime(0.001, now);
          bg.gain.linearRampToValueAtTime(pat.gain * 0.72, now + 0.02);
          bg.gain.exponentialRampToValueAtTime(0.0008, now + dur * 0.95);
          bOsc.connect(bg);
          bg.connect(bgmCtx.destination);
          bOsc.start(now);
          bOsc.stop(now + dur);
        }
        step += 1;
      };
      playStep();
      bgmInterval = window.setInterval(playStep, stepMs);
    } catch {
      // Ignore Web Audio autoplay restriction
    }
  };

  // =========================================================================
  // 1. DRAFT B GUIDED 3-TAB STUDIO BUILDER (Inside Class Studio Step 2)
  // =========================================================================
  let studioSubTab: 1 | 2 | 3 = 1;
  let studioStageIdx = 0;

  export const renderStudioBuilder = (
    host: HTMLElement,
    course: StudioCourseLike,
    chIdx: number,
    onMutate: () => void
  ): void => {
    const ch = course.chapters[chIdx];
    if (!ch) {
      host.innerHTML = "";
      return;
    }
    ensureLessonQuizConfig(ch, chIdx);
    const stages = ch.quizStages!;
    if (studioStageIdx >= stages.length) studioStageIdx = Math.max(0, stages.length - 1);
    const activeTheme = getThemePreset(ch.quizThemePreset);
    const totalQuestions = stages.reduce((sum, s) => sum + s.items.length, 0);

    const tabBtns = `
      <div class="cqs-steps" role="tablist">
        <button type="button" class="cqs-step${studioSubTab === 1 ? " is-on" : ""}" data-cqs-tab="1">
          <b>1</b><span>${t("Theme & Music", "เลือกธีม & เพลง")}</span>
        </button>
        <button type="button" class="cqs-step${studioSubTab === 2 ? " is-on" : ""}" data-cqs-tab="2">
          <b>2</b><span>${t("Stages", "จำนวนด่าน")} (${stages.length})</span>
        </button>
        <button type="button" class="cqs-step${studioSubTab === 3 ? " is-on" : ""}" data-cqs-tab="3">
          <b>3</b><span>${t("Questions & Mix", "โจทย์ & คละมินิเกม")} (${totalQuestions})</span>
        </button>
      </div>
    `;

    let bodyHtml = "";
    if (studioSubTab === 1) {
      bodyHtml = `
        <div class="cqs-body">
          <p class="cqs-sub">${t("Step 1: Pick any of the 10 theme presets for this lesson. Each preset has a continuous scenic backdrop and its own unique music track.", "ขั้นที่ 1: เลือกธีมแผนที่ประจำบทนี้จากทั้งหมด 10 ธีม (5 ธีมแฟนตาซี + 5 ธีมอบอุ่น/ธรรมชาติ) ทุกธีมเป็นฉากแผ่นเดียวยาวพร้อมเพลง BGM เฉพาะตัว")}</p>
          <div class="cqs-theme-grid">
            ${THEME_PRESETS.map((p) => {
              const on = p.id === activeTheme.id;
              const playing = previewingBgmPreset === p.id;
              const thumbSrc = LearningHausStageCatalog.getBiomeImagePath(p.id);
              return `
                <div class="cqs-theme-tile${on ? " is-on" : ""}" style="background-image:linear-gradient(180deg, rgba(12,18,24,0.22) 0%, rgba(12,18,24,0.12) 42%, rgba(12,18,24,0.84) 100%), url('${thumbSrc}')" data-cqs-pick-theme="${p.id}" role="button" tabindex="0">
                  <div>
                    <strong>${p.roman}. ${esc(t(p.nameEn, p.nameTh))}</strong>
                    <small>${esc(t(p.bgmEn, p.bgmTh))}</small>
                  </div>
                  <div class="cqs-theme-foot">
                    <button type="button" class="cqs-bgm-btn" data-cqs-preview-bgm="${p.id}">
                      ${playing ? t("Stop BGM", "หยุดเพลง") : t("Play BGM", "ฟังเพลง")}
                    </button>
                    ${on ? `<span class="cqs-selected-tag">${t("Selected", "ใช้อยู่")}</span>` : ""}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
          <div class="cqs-next-row">
            <button type="button" class="learn-cr-btn learn-cr-btn--primary" data-cqs-tab="2">${t("Next: Set Number of Stages →", "ถัดไป: กำหนดจำนวนด่าน →")}</button>
          </div>
        </div>
      `;
    } else if (studioSubTab === 2) {
      bodyHtml = `
        <div class="cqs-body">
          <div class="cqs-count-bar">
            <div class="cqs-count-bar__main">
              <span class="cqs-count-bar__label">${t("Stages in this Lesson (1–10):", "จำนวนด่านในบทเรียนนี้ (1–10 ด่าน):")}</span>
              <div class="cqs-count-picker" role="group" aria-label="Number of stages">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                  .map((n) => `<button type="button" class="cqs-count-btn${stages.length === n ? " is-on" : ""}" data-cqs-set-count="${n}">${n}</button>`)
                  .join("")}
              </div>
            </div>
            <div class="cqs-count-bar__acts">
              <button type="button" class="learn-cr-btn" data-cqs-preview-map>${t("Preview Map", "ดูตัวอย่างแผนที่")}</button>
              <button type="button" class="learn-cr-btn learn-cr-btn--primary" data-cqs-add-stage ${stages.length >= 10 ? "disabled" : ""}>+ ${t("Add Stage", "เพิ่มด่าน")}</button>
            </div>
          </div>
          ${
            !stages.length
              ? `<div class="cqs-empty">${t("No stages yet. Click + Add Stage to create Stage 1.", "ยังไม่มีด่าน กด + เพิ่มด่านใหม่ เพื่อสร้างด่านที่ 1 ได้เลย")}</div>`
              : `<div class="cqs-stage-list">
                  ${stages
                    .map((st, idx) => {
                      const stTheme = getThemePreset(st.themePresetId || ch.quizThemePreset);
                      const kindNames = Array.from(new Set(st.items.map((it) => ITEM_KINDS.find((k) => k.kind === it.kind)?.[LearningHausI18n.isThai() ? "labelTh" : "labelEn"] || it.kind)));
                      const qCount = Math.max(1, st.items.length);
                      const secVal = Math.max(10, Math.min(900, Number(st.timeLimitSeconds) || 90));
                      return `
                        <div class="cqs-stage-card" data-cqs-stage-row="${idx}">
                          <div class="cqs-stage-top">
                            <div class="cqs-stage-num" style="background:${stTheme.accent}">${idx + 1}</div>
                            <input type="text" class="cqs-in cqs-stage-title-in" data-cqs-st-title="${idx}" value="${esc(st.title)}" placeholder="${t("Stage title...", "ชื่อด่าน...")}">
                            <div class="cqs-stage-acts">
                              <button type="button" class="learn-cr-btn learn-cr-btn--primary" data-cqs-edit-stage="${idx}">${t("Edit Questions", "แก้คำถาม")} →</button>
                              <button type="button" class="learn-cr-btn" data-cqs-test-stage="${idx}">${t("Play", "ลองเล่น")}</button>
                              ${stages.length > 1 ? `<button type="button" class="cqs-del-btn" data-cqs-del-stage="${idx}" aria-label="Delete stage">×</button>` : ""}
                            </div>
                          </div>
                          <div class="cqs-stage-meta-row">
                            <label class="cqs-ctrl-chip" title="${t("Seconds for this stage (10–900)", "กำหนดเวลาของด่านนี้ (10–900 วินาที)")}">
                              <span class="cqs-ctrl-chip__lbl">${t("Time", "เวลา")}</span>
                              <input type="number" class="cqs-ctrl-num" data-cqs-st-time="${idx}" min="10" max="900" step="5" value="${secVal}" aria-label="${t("Seconds", "วินาที")}">
                              <small>${t("sec", "วินาที")}</small>
                            </label>
                            <div class="cqs-ctrl-chip" title="${t("Number of questions in this stage (1–20)", "จำนวนข้อในด่านนี้ (1–20 ข้อ)")}">
                              <span class="cqs-ctrl-chip__lbl">${t("Questions", "จำนวนข้อ")}</span>
                              <button type="button" class="cqs-step-btn" data-cqs-q-dec="${idx}" ${qCount <= 1 ? "disabled" : ""} aria-label="Decrease questions">−</button>
                              <input type="number" class="cqs-ctrl-num cqs-ctrl-num--short" data-cqs-st-qcount="${idx}" min="1" max="20" step="1" value="${qCount}" aria-label="${t("Question count", "จำนวนข้อ")}">
                              <button type="button" class="cqs-step-btn" data-cqs-q-inc="${idx}" ${qCount >= 20 ? "disabled" : ""} aria-label="Increase questions">+</button>
                            </div>
                            <select class="cqs-sel" data-cqs-st-theme="${idx}" aria-label="Stage theme">
                              <option value="0" ${!st.themePresetId ? "selected" : ""}>${t("Use Lesson Theme", "ใช้ธีมหลักของบทเรียน")}</option>
                              ${THEME_PRESETS.map((p) => `<option value="${p.id}" ${st.themePresetId === p.id ? "selected" : ""}>${p.roman}. ${esc(t(p.nameEn, p.nameTh))}</option>`).join("")}
                            </select>
                            <span class="cqs-count-pill">${esc(kindNames.slice(0, 3).join(" · "))}</span>
                          </div>
                        </div>
                      `;
                    })
                    .join("")}
                </div>`
          }
        </div>
      `;
    } else {
      const stage = stages[studioStageIdx];
      bodyHtml = `
        <div class="cqs-body">
          ${
            !stage
              ? `<div class="cqs-empty">${t("Add at least 1 stage first.", "กรุณาเพิ่มด่านอย่างน้อย 1 ด่านก่อน")} <button type="button" class="learn-cr-btn learn-cr-btn--primary" data-cqs-add-stage>+ ${t("Add Stage 1", "สร้างด่านที่ 1")}</button></div>`
              : `
                <div class="cqs-stage-pills">
                  ${stages.map((st, idx) => `<button type="button" class="cqs-pill${idx === studioStageIdx ? " is-on" : ""}" data-cqs-sel-stage="${idx}">${t("Stage", "ด่าน")} ${idx + 1} (${st.items.length} ${t("items", "ข้อ")})</button>`).join("")}
                  <button type="button" class="cqs-pill cqs-pill--play" data-cqs-test-stage="${studioStageIdx}">${t("Test Play Stage", "ทดลองเล่นด่านนี้")}</button>
                </div>
                <div class="cqs-row-head">
                  <p class="cqs-sub"><strong>${esc(stage.title)}</strong> · ${t("Step 3: Pick any minigame format for each question inside this stage.", "ขั้นที่ 3: เลือกรูปแบบคำถามหรือมินิเกมแยกแต่ละข้อได้อิสระภายในด่านนี้")}</p>
                  <button type="button" class="learn-cr-btn learn-cr-btn--primary" data-cqs-add-item ${stage.items.length >= 20 ? "disabled" : ""}>+ ${t("Add Question", "เพิ่มข้อใหม่")}</button>
                </div>
                ${renderItemEditorListHtml(stage.items)}
              `
          }
        </div>
      `;
    }

    host.innerHTML = `
      <div class="cqs-shell">
        <div class="cqs-head">
          <div>
            <strong>${t("Quiz Map & Minigame Studio", "โหมดสร้างแผนที่ควิซ & มินิเกม")}</strong>
            <small>${esc(t(activeTheme.nameEn, activeTheme.nameTh))} · ${esc(t(activeTheme.bgmEn, activeTheme.bgmTh))} · ${stages.length} ${t("stages", "ด่าน")} · ${totalQuestions} ${t("items", "ข้อ")}</small>
          </div>
          <span class="cqs-theme-dot" style="background:${activeTheme.accent}">${activeTheme.roman}. ${esc(t(activeTheme.nameEn, activeTheme.nameTh))}</span>
        </div>
        ${tabBtns}
        ${bodyHtml}
      </div>
    `;

    // Bind events
    host.querySelectorAll<HTMLButtonElement>("[data-cqs-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        studioSubTab = Number(btn.dataset.cqsTab) as 1 | 2 | 3;
        if (studioSubTab !== 1) stopThemeBgm();
        if (studioSubTab === 3 && stages.length === 0) {
          stages.push(createDefaultStage(1, ch.title));
          studioStageIdx = 0;
          onMutate();
        }
        renderStudioBuilder(host, course, chIdx, onMutate);
      });
    });

    host.querySelectorAll<HTMLElement>("[data-cqs-pick-theme]").forEach((tile) => {
      tile.addEventListener("click", (ev) => {
        if ((ev.target as HTMLElement).closest("[data-cqs-preview-bgm]")) return;
        ch.quizThemePreset = Number(tile.dataset.cqsPickTheme) || 1;
        onMutate();
        renderStudioBuilder(host, course, chIdx, onMutate);
      });
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-preview-bgm]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const pid = Number(btn.dataset.cqsPreviewBgm) || 1;
        if (previewingBgmPreset === pid) stopThemeBgm();
        else playThemeBgm(pid);
        renderStudioBuilder(host, course, chIdx, onMutate);
      });
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-set-count]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetCount = Math.max(1, Math.min(10, Number(btn.dataset.cqsSetCount) || 1));
        while (stages.length < targetCount) {
          stages.push(createDefaultStage(stages.length + 1, ch.title));
        }
        if (stages.length > targetCount) {
          stages.splice(targetCount);
        }
        studioStageIdx = Math.max(0, Math.min(studioStageIdx, stages.length - 1));
        onMutate();
        renderStudioBuilder(host, course, chIdx, onMutate);
      });
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-preview-map]").forEach((btn) => {
      btn.addEventListener("click", () => {
        stopThemeBgm();
        onMutate();
        if (window.LearningHausLearnHub?.enterCourseQuiz) {
          window.LearningHausLearnHub.enterCourseQuiz(course.id);
        } else {
          openCourseQuizMap(course);
        }
      });
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-add-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (stages.length >= 10) return;
        stages.push(createDefaultStage(stages.length + 1, ch.title));
        studioStageIdx = stages.length - 1;
        onMutate();
        renderStudioBuilder(host, course, chIdx, onMutate);
      });
    });

    host.querySelectorAll<HTMLInputElement>("[data-cqs-st-title]").forEach((inp) => {
      inp.addEventListener("input", () => {
        const idx = Number(inp.dataset.cqsStTitle);
        if (stages[idx]) {
          stages[idx].title = inp.value;
          onMutate();
        }
      });
    });

    const setStageItemCount = (st: CustomQuizStage, rawCount: number): void => {
      const target = Math.max(1, Math.min(20, Math.round(rawCount) || 1));
      const rotateKinds: MixedItemKind[] = [
        "quiz",
        "true-false-sprint",
        "matching",
        "binary-stamp",
        "sorting",
        "order-steps",
        "scenario"
      ];
      while (st.items.length < target) {
        const nextKind = rotateKinds[st.items.length % rotateKinds.length];
        st.items.push(createDefaultItem(nextKind, st.items.length + 1));
      }
      if (st.items.length > target) {
        st.items.splice(target);
      }
    };

    host.querySelectorAll<HTMLInputElement>("[data-cqs-st-time]").forEach((inp) => {
      const commitTime = (clampInput: boolean): void => {
        const idx = Number(inp.dataset.cqsStTime);
        if (!stages[idx]) return;
        const parsed = Math.round(Number(inp.value) || 90);
        const clamped = Math.max(10, Math.min(900, parsed));
        stages[idx].timeLimitSeconds = clamped;
        if (clampInput) inp.value = String(clamped);
        onMutate();
      };
      inp.addEventListener("input", () => commitTime(false));
      inp.addEventListener("change", () => commitTime(true));
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-q-dec]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.cqsQDec);
        if (!stages[idx]) return;
        setStageItemCount(stages[idx], stages[idx].items.length - 1);
        onMutate();
        renderStudioBuilder(host, course, chIdx, onMutate);
      });
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-q-inc]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.cqsQInc);
        if (!stages[idx]) return;
        setStageItemCount(stages[idx], stages[idx].items.length + 1);
        onMutate();
        renderStudioBuilder(host, course, chIdx, onMutate);
      });
    });

    host.querySelectorAll<HTMLInputElement>("[data-cqs-st-qcount]").forEach((inp) => {
      inp.addEventListener("change", () => {
        const idx = Number(inp.dataset.cqsStQcount);
        if (!stages[idx]) return;
        setStageItemCount(stages[idx], Number(inp.value) || stages[idx].items.length);
        onMutate();
        renderStudioBuilder(host, course, chIdx, onMutate);
      });
    });

    host.querySelectorAll<HTMLSelectElement>("[data-cqs-st-theme]").forEach((sel) => {
      sel.addEventListener("change", () => {
        const idx = Number(sel.dataset.cqsStTheme);
        const val = Number(sel.value) || 0;
        if (stages[idx]) {
          stages[idx].themePresetId = val > 0 ? val : undefined;
          onMutate();
          renderStudioBuilder(host, course, chIdx, onMutate);
        }
      });
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-edit-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        studioStageIdx = Number(btn.dataset.cqsEditStage) || 0;
        studioSubTab = 3;
        renderStudioBuilder(host, course, chIdx, onMutate);
      });
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-del-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.cqsDelStage);
        stages.splice(idx, 1);
        studioStageIdx = Math.max(0, Math.min(studioStageIdx, stages.length - 1));
        onMutate();
        renderStudioBuilder(host, course, chIdx, onMutate);
      });
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-sel-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        studioStageIdx = Number(btn.dataset.cqsSelStage) || 0;
        renderStudioBuilder(host, course, chIdx, onMutate);
      });
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-test-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sIdx = Number(btn.dataset.cqsTestStage) || 0;
        stopThemeBgm();
        onMutate();
        if (window.LearningHausQuizFlow?.open) {
          window.LearningHausQuizFlow.open(chIdx * LearningHausRules.quiz.stagesPerChapter + sIdx);
        } else {
          playStage(course, chIdx, sIdx);
        }
      });
    });

    const activeStage = stages[studioStageIdx];
    if (activeStage) {
      bindItemEditorList(host, activeStage.items, 20, (needsReRender) => {
        onMutate();
        if (needsReRender) renderStudioBuilder(host, course, chIdx, onMutate);
      });
    }
  };

  export const renderItemEditorListHtml = (items: CustomQuizQuestionItem[]): string => `
    <div class="cqs-q-list">
      ${items.map((item, qIdx) => renderItemEditorCard(item, qIdx, items.length)).join("")}
    </div>
  `;

  export const bindItemEditorList = (
    host: HTMLElement,
    items: CustomQuizQuestionItem[],
    maxItems: number,
    onUpdate: (needsReRender: boolean) => void
  ): void => {
    host.querySelector<HTMLButtonElement>("[data-cqs-add-item]")?.addEventListener("click", () => {
      if (items.length >= maxItems) return;
      items.push(createDefaultItem("quiz", items.length + 1));
      onUpdate(true);
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-item-kind]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qIdx = Number(btn.dataset.cqsQ);
        const nextKind = btn.dataset.cqsItemKind as MixedItemKind;
        if (!items[qIdx] || items[qIdx].kind === nextKind) return;
        const fresh = createDefaultItem(nextKind, qIdx + 1);
        fresh.id = items[qIdx].id;
        items[qIdx] = fresh;
        onUpdate(true);
      });
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-del-item]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qIdx = Number(btn.dataset.cqsDelItem);
        if (items.length <= 1) return;
        items.splice(qIdx, 1);
        onUpdate(true);
      });
    });

    host.querySelectorAll<HTMLInputElement>("[data-cqs-q-prompt]").forEach((inp) => {
      inp.addEventListener("input", () => {
        const qIdx = Number(inp.dataset.cqsQPrompt);
        if (items[qIdx]) {
          items[qIdx].prompt = inp.value;
          onUpdate(false);
        }
      });
    });

    host.querySelectorAll<HTMLInputElement>("[data-cqs-q-exp]").forEach((inp) => {
      inp.addEventListener("input", () => {
        const qIdx = Number(inp.dataset.cqsQExp);
        if (items[qIdx]) {
          items[qIdx].explanation = inp.value;
          onUpdate(false);
        }
      });
    });

    host.querySelectorAll<HTMLInputElement>("[data-cqs-opt-text]").forEach((inp) => {
      inp.addEventListener("input", () => {
        const qIdx = Number(inp.dataset.cqsQ);
        const oIdx = Number(inp.dataset.cqsOptText);
        const item = items[qIdx];
        if (item?.options) {
          item.options[oIdx] = inp.value;
          onUpdate(false);
        }
      });
    });

    host.querySelectorAll<HTMLInputElement>("[data-cqs-opt-correct]").forEach((rad) => {
      rad.addEventListener("change", () => {
        const qIdx = Number(rad.dataset.cqsQ);
        const oIdx = Number(rad.dataset.cqsOptCorrect);
        if (items[qIdx]) {
          items[qIdx].correctIndex = oIdx;
          onUpdate(false);
        }
      });
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-tf-ans]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qIdx = Number(btn.dataset.cqsQ);
        if (items[qIdx]) {
          items[qIdx].isTrue = btn.dataset.cqsTfAns === "true";
          onUpdate(true);
        }
      });
    });

    host.querySelectorAll<HTMLInputElement>("[data-cqs-pair-side]").forEach((inp) => {
      inp.addEventListener("input", () => {
        const qIdx = Number(inp.dataset.cqsQ);
        const pIdx = Number(inp.dataset.cqsP);
        const side = inp.dataset.cqsPairSide as "left" | "right";
        const item = items[qIdx];
        if (item?.pairs?.[pIdx]) {
          item.pairs[pIdx][side] = inp.value;
          onUpdate(false);
        }
      });
    });

    host.querySelectorAll<HTMLInputElement>("[data-cqs-stamp-label]").forEach((inp) => {
      inp.addEventListener("input", () => {
        const qIdx = Number(inp.dataset.cqsQ);
        const side = inp.dataset.cqsStampLabel;
        const item = items[qIdx];
        if (item) {
          if (side === "left") item.leftLabel = inp.value;
          else item.rightLabel = inp.value;
          onUpdate(false);
        }
      });
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-stamp-ans]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qIdx = Number(btn.dataset.cqsQ);
        if (items[qIdx]) {
          items[qIdx].stampAnswer = btn.dataset.cqsStampAns === "right" ? "right" : "left";
          onUpdate(true);
        }
      });
    });

    host.querySelectorAll<HTMLInputElement>("[data-cqs-bucket]").forEach((inp) => {
      inp.addEventListener("input", () => {
        const qIdx = Number(inp.dataset.cqsQ);
        const bIdx = Number(inp.dataset.cqsBucket);
        const item = items[qIdx];
        if (item?.buckets) {
          item.buckets[bIdx] = inp.value;
          onUpdate(false);
        }
      });
    });

    host.querySelectorAll<HTMLInputElement>("[data-cqs-sort-text]").forEach((inp) => {
      inp.addEventListener("input", () => {
        const qIdx = Number(inp.dataset.cqsQ);
        const sIdx = Number(inp.dataset.cqsSortText);
        const item = items[qIdx];
        if (item?.sortItems?.[sIdx]) {
          item.sortItems[sIdx].text = inp.value;
          onUpdate(false);
        }
      });
    });

    host.querySelectorAll<HTMLSelectElement>("[data-cqs-sort-b]").forEach((sel) => {
      sel.addEventListener("change", () => {
        const qIdx = Number(sel.dataset.cqsQ);
        const sIdx = Number(sel.dataset.cqsSortB);
        const item = items[qIdx];
        if (item?.sortItems?.[sIdx]) {
          item.sortItems[sIdx].bucketIdx = Number(sel.value) || 0;
          onUpdate(false);
        }
      });
    });

    host.querySelectorAll<HTMLInputElement>("[data-cqs-step-text]").forEach((inp) => {
      inp.addEventListener("input", () => {
        const qIdx = Number(inp.dataset.cqsQ);
        const sIdx = Number(inp.dataset.cqsStepText);
        const item = items[qIdx];
        if (item?.steps) {
          item.steps[sIdx] = inp.value;
          onUpdate(false);
        }
      });
    });

    host.querySelectorAll<HTMLButtonElement>("[data-cqs-add-sub]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qIdx = Number(btn.dataset.cqsQ);
        const item = items[qIdx];
        if (!item) return;
        if (item.kind === "matching" && item.pairs && item.pairs.length < 6) {
          item.pairs.push({ left: "", right: "" });
        } else if (item.kind === "sorting" && item.sortItems && item.sortItems.length < 6) {
          item.sortItems.push({ text: "", bucketIdx: 0 });
        } else if (item.kind === "order-steps" && item.steps && item.steps.length < 6) {
          item.steps.push("");
        }
        onUpdate(true);
      });
    });
  };

  const renderItemEditorCard = (item: CustomQuizQuestionItem, qIdx: number, total: number): string => {
    const kindMeta = ITEM_KINDS.find((k) => k.kind === item.kind) || ITEM_KINDS[0];
    const kindChips = ITEM_KINDS.map(
      (k) => `<button type="button" class="cqs-fchip${item.kind === k.kind ? " is-on" : ""}" data-cqs-q="${qIdx}" data-cqs-item-kind="${k.kind}">${esc(t(k.labelEn, k.labelTh))}</button>`
    ).join("");

    let fieldsHtml = "";
    if (item.kind === "quiz" || item.kind === "scenario") {
      const opts = item.options || ["", "", "", ""];
      fieldsHtml = `
        <div class="cqs-field-label">${t("Answer Choices (check the correct answer)", "ตัวเลือกคำตอบ (ติ๊กวงกลมหน้าข้อที่ถูก)")}</div>
        <div class="cqs-opt-grid">
          ${opts
            .map(
              (o, oIdx) => `
                <label class="cqs-opt-row">
                  <input type="radio" name="cqs-corr-${qIdx}" data-cqs-q="${qIdx}" data-cqs-opt-correct="${oIdx}" ${(item.correctIndex || 0) === oIdx ? "checked" : ""}>
                  <input type="text" class="cqs-in" data-cqs-q="${qIdx}" data-cqs-opt-text="${oIdx}" value="${esc(o)}" placeholder="${t("Option", "ตัวเลือก")} ${oIdx + 1}">
                </label>
              `
            )
            .join("")}
        </div>
      `;
    } else if (item.kind === "true-false-sprint") {
      fieldsHtml = `
        <div class="cqs-field-label">${t("Select the correct verdict", "เลือกเฉลยที่ถูกต้อง")}</div>
        <div class="cqs-tf-row">
          <button type="button" class="cqs-tf-btn${item.isTrue !== false ? " is-on" : ""}" data-cqs-q="${qIdx}" data-cqs-tf-ans="true">${t("Correct Answer: TRUE", "คำตอบที่ถูก: จริง (True)")}</button>
          <button type="button" class="cqs-tf-btn${item.isTrue === false ? " is-on" : ""}" data-cqs-q="${qIdx}" data-cqs-tf-ans="false">${t("Correct Answer: FALSE", "คำตอบที่ถูก: เท็จ (False)")}</button>
        </div>
      `;
    } else if (item.kind === "matching") {
      const pairs = item.pairs || [];
      fieldsHtml = `
        <div class="cqs-field-label">${t("Matching Pairs (Left ↔ Right)", "คู่คำศัพท์และความหมายที่ตรงกัน (ซ้าย ↔ ขวา)")}</div>
        <div class="cqs-pair-list">
          ${pairs
            .map(
              (p, pIdx) => `
                <div class="cqs-pair-row">
                  <input type="text" class="cqs-in" data-cqs-q="${qIdx}" data-cqs-p="${pIdx}" data-cqs-pair-side="left" value="${esc(p.left)}" placeholder="${t("Left item", "ฝั่งซ้าย")}">
                  <span class="cqs-arrow">↔</span>
                  <input type="text" class="cqs-in" data-cqs-q="${qIdx}" data-cqs-p="${pIdx}" data-cqs-pair-side="right" value="${esc(p.right)}" placeholder="${t("Matching pair", "คู่ที่ตรงกัน")}">
                </div>
              `
            )
            .join("")}
        </div>
        ${pairs.length < 6 ? `<button type="button" class="cqs-sub-add" data-cqs-q="${qIdx}" data-cqs-add-sub>+ ${t("Add Pair", "เพิ่มคู่จับคู่")}</button>` : ""}
      `;
    } else if (item.kind === "binary-stamp") {
      fieldsHtml = `
        <div class="cqs-field-label">${t("Two Stamp Labels", "ตั้งชื่อป้ายประทับตรา 2 ฝั่ง")}</div>
        <div class="cqs-pair-row">
          <input type="text" class="cqs-in" data-cqs-q="${qIdx}" data-cqs-stamp-label="left" value="${esc(item.leftLabel || "")}" placeholder="${t("Left stamp label", "ป้ายฝั่งซ้าย")}">
          <input type="text" class="cqs-in" data-cqs-q="${qIdx}" data-cqs-stamp-label="right" value="${esc(item.rightLabel || "")}" placeholder="${t("Right stamp label", "ป้ายฝั่งขวา")}">
        </div>
        <div class="cqs-tf-row">
          <button type="button" class="cqs-tf-btn${item.stampAnswer !== "right" ? " is-on" : ""}" data-cqs-q="${qIdx}" data-cqs-stamp-ans="left">${t("Correct: Left Stamp", "คำตอบถูก: ฝั่งซ้าย")}</button>
          <button type="button" class="cqs-tf-btn${item.stampAnswer === "right" ? " is-on" : ""}" data-cqs-q="${qIdx}" data-cqs-stamp-ans="right">${t("Correct: Right Stamp", "คำตอบถูก: ฝั่งขวา")}</button>
        </div>
      `;
    } else if (item.kind === "sorting") {
      const buckets = item.buckets || [t("Group A", "หมวด A"), t("Group B", "หมวด B")];
      const sItems = item.sortItems || [];
      fieldsHtml = `
        <div class="cqs-field-label">${t("1. Category Bucket Names", "1. ชื่อหมวดหมู่ทั้ง 2 ฝั่ง")}</div>
        <div class="cqs-pair-row">
          ${buckets.map((b, bIdx) => `<input type="text" class="cqs-in" data-cqs-q="${qIdx}" data-cqs-bucket="${bIdx}" value="${esc(b)}" placeholder="${t("Bucket", "หมวดหมู่")} ${bIdx + 1}">`).join("")}
        </div>
        <div class="cqs-field-label">${t("2. Items & Their Correct Bucket", "2. รายการที่จะให้คัดแยกและหมวดที่ถูกต้อง")}</div>
        <div class="cqs-pair-list">
          ${sItems
            .map(
              (si, sIdx) => `
                <div class="cqs-pair-row">
                  <input type="text" class="cqs-in" data-cqs-q="${qIdx}" data-cqs-sort-text="${sIdx}" value="${esc(si.text)}" placeholder="${t("Item text", "ข้อความรายการ")}">
                  <select class="cqs-sel" data-cqs-q="${qIdx}" data-cqs-sort-b="${sIdx}">
                    ${buckets.map((b, bIdx) => `<option value="${bIdx}" ${si.bucketIdx === bIdx ? "selected" : ""}>→ ${esc(b || `Bucket ${bIdx + 1}`)}</option>`).join("")}
                  </select>
                </div>
              `
            )
            .join("")}
        </div>
        ${sItems.length < 6 ? `<button type="button" class="cqs-sub-add" data-cqs-q="${qIdx}" data-cqs-add-sub>+ ${t("Add Item", "เพิ่มรายการคัดแยก")}</button>` : ""}
      `;
    } else if (item.kind === "order-steps") {
      const steps = item.steps || ["", "", ""];
      fieldsHtml = `
        <div class="cqs-field-label">${t("Correct Order (Top = 1st, system shuffles for players)", "ลำดับที่ถูกต้องจากบนลงล่าง (ระบบจะสุ่มสลับตอนเล่นจริง)")}</div>
        <div class="cqs-pair-list">
          ${steps
            .map(
              (st, sIdx) => `
                <div class="cqs-step-in-row">
                  <span class="cqs-step-badge">${sIdx + 1}</span>
                  <input type="text" class="cqs-in" data-cqs-q="${qIdx}" data-cqs-step-text="${sIdx}" value="${esc(st)}" placeholder="${t("Correct step", "ขั้นตอนที่")} ${sIdx + 1}">
                </div>
              `
            )
            .join("")}
        </div>
        ${steps.length < 6 ? `<button type="button" class="cqs-sub-add" data-cqs-q="${qIdx}" data-cqs-add-sub>+ ${t("Add Step", "เพิ่มขั้นตอน")}</button>` : ""}
      `;
    }

    return `
      <div class="cqs-q-card">
        <div class="cqs-q-top">
          <strong>${t("Question", "ข้อที่")} ${qIdx + 1} · <span style="color:#3b8146">${esc(t(kindMeta.labelEn, kindMeta.labelTh))}</span></strong>
          ${total > 1 ? `<button type="button" class="cqs-del-btn" data-cqs-del-item="${qIdx}" aria-label="Delete item">×</button>` : ""}
        </div>
        <div class="cqs-fchips">${kindChips}</div>
        <div class="cqs-kind-tip">${esc(t(kindMeta.tipEn, kindMeta.tipTh))}</div>
        <div class="cqs-field-label">${t("Question / Prompt", "โจทย์คำถาม / คำสั่ง")}</div>
        <input type="text" class="cqs-in cqs-in--prompt" data-cqs-q-prompt="${qIdx}" value="${esc(item.prompt)}" placeholder="${t("Question or instruction...", "พิมพ์คำถามหรือคำสั่งของข้อนี้...")}">
        ${fieldsHtml}
        <div class="cqs-field-label">${t("Answer Explanation (Optional)", "คำอธิบายเฉลยหลังตอบ (ไม่บังคับ)")}</div>
        <input type="text" class="cqs-in cqs-in--prompt" data-cqs-q-exp="${qIdx}" value="${esc(item.explanation || "")}" placeholder="${t("Short explanation shown after answering...", "อธิบายสั้นๆ ว่าทำไมคำตอบนี้ถึงถูก...")}">
      </div>
    `;
  };

  // =========================================================================
  // 2. PLAYABLE CUSTOM COURSE QUIZ MAP MODAL (Like EU AI Act Realms!)
  // =========================================================================
  let mapOverlay: HTMLElement | null = null;
  let runnerOverlay: HTMLElement | null = null;
  let runnerTimer: number | null = null;

  const ensureMapOverlay = (): HTMLElement => {
    if (!mapOverlay) {
      mapOverlay = document.createElement("div");
      mapOverlay.className = "cqm-overlay";
      mapOverlay.hidden = true;
      document.body.appendChild(mapOverlay);
    }
    return mapOverlay;
  };

  const ensureRunnerOverlay = (): HTMLElement => {
    if (!runnerOverlay) {
      runnerOverlay = document.createElement("div");
      runnerOverlay.className = "cqm-runner-overlay";
      runnerOverlay.hidden = true;
      document.body.appendChild(runnerOverlay);
    }
    return runnerOverlay;
  };

  export const closeCourseQuizMap = (): void => {
    stopThemeBgm();
    if (mapOverlay) mapOverlay.hidden = true;
  };

  // 3-Tier Theme-Matched Pixel Clinging Mascots for ALL 10 Creator Themes (Mini -> Mid -> Grand Final Boss!)
  const getCustomStageMascotHtml = (themeId: number, sIdx: number, totalStages: number): string => {
    const id = Math.max(1, Math.min(10, Math.round(themeId || 1)));
    const isFinal = sIdx === totalStages - 1 && totalStages > 1;
    const isMid = !isFinal && totalStages >= 4 && (sIdx === 2 || sIdx === 5);
    if (!isFinal && !isMid && sIdx === 0) return "";

    // Palette per all 10 Creator Themes: [primary, highlight, accent, dark]
    const pals: Record<number, [string, string, string, string]> = {
      1: ["#EF4444", "#FECACA", "#FBBF24", "#2B2042"], // Obsidian Vault
      2: ["#B91C1C", "#EF4444", "#FBBF24", "#5C2B14"], // Amber Bastion (Brick Castle)
      3: ["#38BDF8", "#BAE6FD", "#FDE047", "#1E2D57"], // Mirror Observatory
      4: ["#9333EA", "#E879F9", "#67E8F9", "#4C1D95"], // Astral Spire
      5: ["#E05638", "#FDE8D7", "#A7F3D0", "#24635C"], // Emerald Conservatory
      6: ["#D97706", "#FEF3C7", "#E11D48", "#4A2813"], // Cozy Cat Cafe
      7: ["#60A5FA", "#FFFFFF", "#34D399", "#1E3A5F"], // Snowy Peak
      8: ["#EAB308", "#FDE047", "#52AB44", "#5C2D12"], // Sunflower Meadow
      9: ["#F59E0B", "#FEF08A", "#0284C7", "#5C341D"], // Starlit Desert
      10: ["#F29C8A", "#FDD5AD", "#3898D4", "#2D6B47"] // Riverside Village
    };
    const [p1, p2, p3, p4] = pals[id] || pals[8];

    if (isFinal) {
      // Tier 3: Grand 36x36 Final Boss Crowned Guardian for each custom Lesson/Chapter
      return `<span class="cqm-orn cqm-orn--final" aria-hidden="true"><svg class="quiz-pixel-svg" viewBox="0 0 36 36">
        <rect x="12" y="2" width="12" height="5" fill="#F59E0B" stroke="#191724" stroke-width="1"/>
        <rect x="13" y="3" width="10" height="3" fill="#FDE047"/>
        <rect x="14" y="1" width="2" height="2" fill="#FEF08A"/><rect x="20" y="1" width="2" height="2" fill="#FEF08A"/>
        <rect x="3" y="10" width="8" height="10" fill="${p3}" stroke="#191724" stroke-width="1"/>
        <rect x="25" y="10" width="8" height="10" fill="${p3}" stroke="#191724" stroke-width="1"/>
        <rect x="9" y="8" width="18" height="16" fill="${p1}" stroke="#191724" stroke-width="1"/>
        <rect x="11" y="10" width="14" height="6" fill="${p2}"/>
        <rect x="13" y="13" width="3" height="3" fill="#191724"/><rect x="13" y="13" width="1" height="1" fill="#FFFFFF"/>
        <rect x="20" y="13" width="3" height="3" fill="#191724"/><rect x="20" y="13" width="1" height="1" fill="#FFFFFF"/>
        <rect x="11" y="17" width="2" height="2" fill="#F472B6"/><rect x="23" y="17" width="2" height="2" fill="#F472B6"/>
        <rect x="7" y="24" width="22" height="8" fill="${p4}" stroke="#191724" stroke-width="1"/>
        <rect x="10" y="26" width="16" height="4" fill="${p3}"/>
      </svg></span>`;
    }
    if (isMid) {
      // Tier 2: Detailed 28x28 Mid-Chapter Mascot
      const side = sIdx === 2 ? "cqm-orn--mid-left" : "cqm-orn--mid-right";
      return `<span class="cqm-orn ${side}" aria-hidden="true"><svg class="quiz-pixel-svg" viewBox="0 0 28 28">
        <rect x="6" y="4" width="16" height="13" fill="${p1}" stroke="#191724" stroke-width="1"/>
        <rect x="8" y="6" width="12" height="5" fill="${p2}"/>
        <rect x="9" y="9" width="2" height="3" fill="#191724"/><rect x="9" y="9" width="1" height="1" fill="#FFFFFF"/>
        <rect x="17" y="9" width="2" height="3" fill="#191724"/><rect x="17" y="9" width="1" height="1" fill="#FFFFFF"/>
        <rect x="8" y="13" width="2" height="1" fill="#F472B6"/><rect x="18" y="13" width="2" height="1" fill="#F472B6"/>
        <rect x="4" y="17" width="20" height="6" fill="${p4}" stroke="#191724" stroke-width="1"/>
        <rect x="7" y="19" width="14" height="2" fill="${p3}"/>
      </svg></span>`;
    }
    // Tier 1: Compact 20x20 Mini Theme Prop alternating sides
    const miniSide = sIdx % 2 === 1 ? "cqm-orn--mini-right" : "cqm-orn--mini-left";
    return `<span class="cqm-orn ${miniSide}" aria-hidden="true"><svg class="quiz-pixel-svg" viewBox="0 0 20 20">
      <rect x="5" y="4" width="10" height="9" fill="${p1}" stroke="#191724" stroke-width="1"/>
      <rect x="7" y="6" width="6" height="4" fill="${p2}"/>
      <rect x="7" y="13" width="6" height="4" fill="${p4}" stroke="#191724" stroke-width="1"/>
      <rect x="13" y="3" width="3" height="3" fill="${p3}" stroke="#191724" stroke-width="1"/>
    </svg></span>`;
  };

  export const openCourseQuizMap = (course: StudioCourseLike): void => {
    const el = ensureMapOverlay();
    const quizEnabledChapters = course.chapters
      .map((ch, idx) => ({ ch, idx }))
      .filter(({ ch }) => Boolean(ch.hasQuiz || (ch.quizStages && ch.quizStages.length > 0)));
    const visibleChapters = quizEnabledChapters.length
      ? quizEnabledChapters
      : course.chapters.map((ch, idx) => ({ ch, idx }));

    const firstTheme = getThemePreset(visibleChapters[0]?.ch.quizThemePreset || 1);
    playThemeBgm(firstTheme.id);

    const avatarUrl =
      window.LearningHausProfile?.getProfile?.()?.avatar ||
      window.LearningHausPixelCat?.getActiveAvatarDataUrl?.() ||
      "";
    let placedAvatar = false;

    const chaptersHtml = visibleChapters
      .map(({ ch, idx: chIdx }) => {
        ensureLessonQuizConfig(ch, chIdx);
        const theme = getThemePreset(ch.quizThemePreset);
        const stages = ch.quizStages!.length ? ch.quizStages! : [createDefaultStage(1, ch.title)];

        // Symmetric balanced Snakes-and-Ladders S-curve coordinates (zero distortion on Desktop, Tablet & Mobile!)
        const xPattern = [50, 68, 50, 32, 50, 68, 50, 32, 50, 50];
        const stepGap = 152;
        const padTop = 188;
        const trackH = Math.max(580, (stages.length - 1) * stepGap + padTop + 148);
        const pts = stages.map((_, i) => ({
          xPct: xPattern[i % xPattern.length],
          xSvg: Math.round((xPattern[i % xPattern.length] / 100) * 600),
          y: padTop + i * stepGap
        }));

        let pathD = "";
        if (pts.length > 1) {
          pathD = `M ${pts[0].xSvg} ${pts[0].y}`;
          for (let i = 1; i < pts.length; i += 1) {
            const prev = pts[i - 1];
            const cur = pts[i];
            const midY = Math.round((prev.y + cur.y) / 2);
            pathD += ` C ${prev.xSvg} ${midY}, ${cur.xSvg} ${midY}, ${cur.xSvg} ${cur.y}`;
          }
        }

        const bgSvg = LearningHausStageCatalog.renderContinuousBiomeSvg(theme.id, trackH + 140);
        const nodesHtml = stages
          .map((st, sIdx) => {
            const stTheme = getThemePreset(st.themePresetId || ch.quizThemePreset);
            const rec = getStageRecord(course.id, chIdx, st.id);
            const isBoss = sIdx === stages.length - 1 && stages.length > 1;
            const isCurrent = !rec && !placedAvatar;
            if (isCurrent) placedAvatar = true;
            const pt = pts[sIdx];
            const kindBadges = Array.from(
              new Set(st.items.map((it) => ITEM_KINDS.find((k) => k.kind === it.kind)?.[LearningHausI18n.isThai() ? "labelTh" : "labelEn"] || it.kind))
            )
              .slice(0, 2)
              .join(" + ");
            const avatarPin =
              isCurrent && avatarUrl
                ? `<span class="cqm-snake-avatar" aria-hidden="true"><img src="${esc(avatarUrl)}" alt=""></span>`
                : "";
            const mascotHtml = getCustomStageMascotHtml(stTheme.id, sIdx, stages.length);
            return `
              <div class="cqm-snake-stop" style="left:${pt.xPct}%;top:${pt.y}px;">
                ${avatarPin}
                <button type="button" class="cqm-snake-node${rec ? " is-done" : ""}${isCurrent ? " is-current" : ""}${isBoss ? " is-boss" : ""}" style="--node-accent:${stTheme.accent};--node-banner:${stTheme.bannerBg}" data-cqm-play-ch="${chIdx}" data-cqm-play-st="${sIdx}">
                  ${mascotHtml}
                  <span class="cqm-snake-node__num">${rec ? "✓" : isBoss ? "★" : sIdx + 1}</span>
                </button>
                <div class="cqm-snake-label">
                  <strong>${esc(st.title)}</strong>
                  <span>${st.items.length} ${t("items", "ข้อ")} · ${esc(kindBadges)}${rec ? ` · <b>${rec.bestScore}%</b>` : ""}</span>
                </div>
              </div>
            `;
          })
          .join("");

        return `
          <section class="cqm-realm${theme.dark ? " is-dark" : ""}" style="background:${theme.biomeBg}">
            <div class="cqm-realm__bg" aria-hidden="true">${bgSvg}</div>
            <div class="cqm-realm__banner" style="background:${theme.bannerBg};color:#ffffff">
              <div>
                <span class="cqm-realm__roman">${theme.roman}</span>
                <strong>${t("Chapter", "บทที่")} ${chIdx + 1}: ${esc(ch.title)}</strong>
                <small>${esc(t(theme.nameEn, theme.nameTh))} · ${stages.length} ${t("stages", "ด่าน")} · ${esc(t(theme.bgmEn, theme.bgmTh))}</small>
              </div>
              <button type="button" class="cqm-bgm-pill" data-cqm-bgm="${theme.id}">${previewingBgmPreset === theme.id ? t("Mute BGM", "ปิดเสียง") : t("Play BGM", "เปิดเสียง")}</button>
            </div>
            <div class="cqm-snake-track" style="height:${trackH}px;">
              ${
                pathD
                  ? `<svg class="cqm-snake-svg" viewBox="0 0 600 ${trackH}" preserveAspectRatio="none" aria-hidden="true">
                      <path d="${pathD}" fill="none" stroke="rgba(8,14,22,0.18)" stroke-width="8" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
                      <path d="${pathD}" fill="none" stroke="rgba(255,255,255,0.62)" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="8 12" vector-effect="non-scaling-stroke"/>
                    </svg>`
                  : ""
              }
              ${nodesHtml}
            </div>
          </section>
        `;
      })
      .join("");

    el.innerHTML = `
      <div class="cqm-sheet" role="dialog" aria-modal="true" aria-label="${esc(course.title)} Quiz Map">
        <header class="cqm-top">
          <div>
            <small>${t("COURSE QUIZ MAP", "แผนที่ด่าน Quiz ประจำคลาส")}</small>
            <h2>${esc(course.title)}</h2>
          </div>
          <button type="button" class="cqm-close" data-cqm-close aria-label="Close">×</button>
        </header>
        <div class="cqm-scroll">${chaptersHtml}</div>
      </div>
    `;
    el.hidden = false;

    el.querySelector("[data-cqm-close]")?.addEventListener("click", closeCourseQuizMap);
    el.addEventListener("click", (ev) => {
      if (ev.target === el) closeCourseQuizMap();
    });
    const syncCqmBgmButtons = (): void => {
      el.querySelectorAll<HTMLButtonElement>("[data-cqm-bgm]").forEach((b) => {
        const pid = Number(b.dataset.cqmBgm) || 1;
        const on = previewingBgmPreset === pid;
        b.textContent = on ? t("Mute BGM", "ปิดเสียง") : t("Play BGM", "เปิดเสียง");
        b.setAttribute("aria-pressed", String(on));
      });
    };
    el.querySelectorAll<HTMLButtonElement>("[data-cqm-bgm]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pid = Number(btn.dataset.cqmBgm) || 1;
        if (previewingBgmPreset === pid) stopThemeBgm();
        else playThemeBgm(pid);
        syncCqmBgmButtons();
      });
    });
    el.querySelectorAll<HTMLButtonElement>("[data-cqm-play-ch]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const chIdx = Number(btn.dataset.cqmPlayCh) || 0;
        const stIdx = Number(btn.dataset.cqmPlaySt) || 0;
        playStage(course, chIdx, stIdx, () => openCourseQuizMap(course));
      });
    });
  };

  // =========================================================================
  // 3. MIXED-FORMAT 7-MINIGAME STAGE RUNNER (Plays all mixed items in 1 stage!)
  // =========================================================================
  export const playStage = (
    course: StudioCourseLike,
    chIdx: number,
    stageIdx: number,
    onDone?: () => void
  ): void => {
    const ch = course.chapters[chIdx];
    if (!ch) return;
    ensureLessonQuizConfig(ch, chIdx);
    const stages = ch.quizStages!.length ? ch.quizStages! : [createDefaultStage(1, ch.title)];
    const stage = stages[stageIdx] || stages[0];
    if (!stage || !stage.items.length) return;

    const theme = getThemePreset(stage.themePresetId || ch.quizThemePreset);
    playThemeBgm(theme.id);

    const el = ensureRunnerOverlay();
    let curIdx = 0;
    let correctCount = 0;
    let secondsLeft = Math.max(10, Number(stage.timeLimitSeconds) || 90);
    let answered = false;

    const stopTimer = (): void => {
      if (runnerTimer !== null) {
        window.clearInterval(runnerTimer);
        runnerTimer = null;
      }
    };

    const closeRunner = (): void => {
      stopTimer();
      stopThemeBgm();
      el.hidden = true;
      if (onDone) onDone();
    };

    const finishStage = (): void => {
      stopTimer();
      const total = stage.items.length;
      const pct = Math.round((correctCount / Math.max(1, total)) * 100);
      saveStageDone(course.id, chIdx, stage.id, pct);
      window.dispatchEvent(new CustomEvent("learninghaus:custom-quiz-cleared", { detail: { courseId: course.id, chIdx, stageId: stage.id, score: pct } }));
      window.dispatchEvent(new Event("learninghaus:library-updated"));

      el.innerHTML = `
        <div class="cqr-card">
          <div class="cqr-result">
            <span class="cqr-badge" style="background:${theme.accent}">${pct}%</span>
            <h2>${pct >= 60 ? t("Stage Cleared!", "ผ่านด่านเรียบร้อย!") : t("Good Try!", "ลองใหม่อีกครั้งนะ!")}</h2>
            <p>${esc(stage.title)} · ${correctCount} / ${total} ${t("correct", "ข้อถูก")}</p>
            <div class="cqr-result-acts">
              <button type="button" class="learn-cr-btn" data-cqr-retry>${t("Replay Stage", "เล่นด่านนี้อีกครั้ง")}</button>
              <button type="button" class="learn-cr-btn learn-cr-btn--primary" data-cqr-exit>${t("Back to Quiz Map", "กลับหน้าแผนที่ Quiz")}</button>
            </div>
          </div>
        </div>
      `;
      el.querySelector("[data-cqr-retry]")?.addEventListener("click", () => playStage(course, chIdx, stageIdx, onDone));
      el.querySelector("[data-cqr-exit]")?.addEventListener("click", closeRunner);
    };

    const advance = (): void => {
      curIdx += 1;
      if (curIdx >= stage.items.length) finishStage();
      else renderCurrent();
    };

    const renderCurrent = (): void => {
      answered = false;
      const item = stage.items[curIdx];
      const kindMeta = ITEM_KINDS.find((k) => k.kind === item.kind) || ITEM_KINDS[0];
      const pct = Math.round((curIdx / stage.items.length) * 100);

      let playHtml = "";
      if (item.kind === "quiz" || item.kind === "scenario") {
        const opts = item.options || [];
        playHtml = `
          <div class="cqr-opts">
            ${opts.map((o, i) => `<button type="button" class="cqr-opt" data-cqr-choice="${i}"><b>${String.fromCharCode(65 + i)}</b><span>${esc(o)}</span></button>`).join("")}
          </div>
        `;
      } else if (item.kind === "true-false-sprint") {
        playHtml = `
          <div class="cqr-tf-grid">
            <button type="button" class="cqr-tf-card" data-cqr-tf="true">${t("TRUE", "จริง (TRUE)")}</button>
            <button type="button" class="cqr-tf-card" data-cqr-tf="false">${t("FALSE", "เท็จ (FALSE)")}</button>
          </div>
        `;
      } else if (item.kind === "binary-stamp") {
        playHtml = `
          <div class="cqr-tf-grid">
            <button type="button" class="cqr-tf-card" data-cqr-stamp="left">${esc(item.leftLabel || t("Left", "ซ้าย"))}</button>
            <button type="button" class="cqr-tf-card" data-cqr-stamp="right">${esc(item.rightLabel || t("Right", "ขวา"))}</button>
          </div>
        `;
      } else if (item.kind === "matching") {
        const pairs = item.pairs || [];
        const rightOrder = pairs.map((p, idx) => ({ idx, text: p.right })).sort(() => Math.random() - 0.5);
        playHtml = `
          <div class="cqr-match-grid">
            <div class="cqr-match-col">
              ${pairs.map((p, i) => `<button type="button" class="cqr-match-btn" data-cqr-mleft="${i}">${esc(p.left)}</button>`).join("")}
            </div>
            <div class="cqr-match-col">
              ${rightOrder.map((r) => `<button type="button" class="cqr-match-btn" data-cqr-mright="${r.idx}">${esc(r.text)}</button>`).join("")}
            </div>
          </div>
        `;
      } else if (item.kind === "sorting") {
        const buckets = item.buckets || [t("Group A", "หมวด A"), t("Group B", "หมวด B")];
        const itemsList = item.sortItems || [];
        playHtml = `
          <div class="cqr-sort-item" data-cqr-sort-cur>${esc(itemsList[0]?.text || "")}</div>
          <div class="cqr-tf-grid">
            ${buckets.map((b, i) => `<button type="button" class="cqr-tf-card" data-cqr-sort-pick="${i}">${esc(b)}</button>`).join("")}
          </div>
        `;
      } else if (item.kind === "order-steps") {
        const steps = (item.steps || []).map((s, idx) => ({ idx, text: s })).sort(() => Math.random() - 0.5);
        playHtml = `
          <div class="cqr-order-hint">${t("Tap steps in order from 1st to last:", "กดเลือกขั้นตอนเรียงจากลำดับที่ 1 ไปจนครบ:")}</div>
          <div class="cqr-opts">
            ${steps.map((s) => `<button type="button" class="cqr-opt" data-cqr-order="${s.idx}"><b data-cqr-order-num>?</b><span>${esc(s.text)}</span></button>`).join("")}
          </div>
        `;
      }

      el.innerHTML = `
        <div class="cqr-card">
          <header class="cqr-head" style="background:${theme.bannerBg};color:#fff">
            <div>
              <small>${esc(t(kindMeta.labelEn, kindMeta.labelTh))} · ${curIdx + 1} / ${stage.items.length}</small>
              <h3>${esc(stage.title)}</h3>
            </div>
            <div class="cqr-head-right">
              <span class="cqr-timer" data-cqr-timer>${secondsLeft}s</span>
              <button type="button" class="cqm-close" data-cqr-close aria-label="Exit">×</button>
            </div>
          </header>
          <div class="cqr-bar"><span style="width:${pct}%;background:${theme.accent}"></span></div>
          <div class="cqr-body">
            <p class="cqr-prompt">${esc(item.prompt)}</p>
            ${playHtml}
            <p class="cqr-fb" data-cqr-fb hidden></p>
          </div>
        </div>
      `;

      const fb = el.querySelector<HTMLElement>("[data-cqr-fb]");
      const showFb = (ok: boolean, msg: string): void => {
        if (ok) correctCount += 1;
        const extra = item.explanation ? ` · ${item.explanation}` : "";
        if (fb) {
          fb.hidden = false;
          fb.className = `cqr-fb ${ok ? "is-ok" : "is-bad"}`;
          fb.textContent = `${msg}${extra}`;
        }
        window.setTimeout(advance, item.explanation ? 1400 : 850);
      };

      el.querySelector("[data-cqr-close]")?.addEventListener("click", closeRunner);

      if (item.kind === "quiz" || item.kind === "scenario") {
        el.querySelectorAll<HTMLButtonElement>("[data-cqr-choice]").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (answered) return;
            answered = true;
            const pick = Number(btn.dataset.cqrChoice);
            const ok = pick === (item.correctIndex || 0);
            btn.classList.add(ok ? "is-ok" : "is-bad");
            showFb(ok, ok ? t("Correct!", "ถูกต้อง!") : t("Not quite, moving to next.", "ยังไม่ถูก ไปข้อถัดไป"));
          });
        });
      } else if (item.kind === "true-false-sprint") {
        el.querySelectorAll<HTMLButtonElement>("[data-cqr-tf]").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (answered) return;
            answered = true;
            const pick = btn.dataset.cqrTf === "true";
            const ok = pick === (item.isTrue !== false);
            btn.classList.add(ok ? "is-ok" : "is-bad");
            showFb(ok, ok ? t("Correct!", "ถูกต้อง!") : t("Missed!", "ยังไม่ถูก!"));
          });
        });
      } else if (item.kind === "binary-stamp") {
        el.querySelectorAll<HTMLButtonElement>("[data-cqr-stamp]").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (answered) return;
            answered = true;
            const ok = btn.dataset.cqrStamp === (item.stampAnswer || "left");
            btn.classList.add(ok ? "is-ok" : "is-bad");
            showFb(ok, ok ? t("Stamped right!", "ประทับตราถูกต้อง!") : t("Wrong side!", "ประทับตราผิดฝั่ง!"));
          });
        });
      } else if (item.kind === "matching") {
        let selLeft: number | null = null;
        let matched = 0;
        let mistakes = 0;
        const totalPairs = (item.pairs || []).length;
        el.querySelectorAll<HTMLButtonElement>("[data-cqr-mleft]").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (btn.disabled) return;
            el.querySelectorAll("[data-cqr-mleft]").forEach((b) => b.classList.remove("is-sel"));
            btn.classList.add("is-sel");
            selLeft = Number(btn.dataset.cqrMleft);
          });
        });
        el.querySelectorAll<HTMLButtonElement>("[data-cqr-mright]").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (btn.disabled || selLeft === null) return;
            const rIdx = Number(btn.dataset.cqrMright);
            const leftBtn = el.querySelector<HTMLButtonElement>(`[data-cqr-mleft="${selLeft}"]`);
            if (rIdx === selLeft) {
              btn.disabled = true;
              btn.classList.add("is-ok");
              if (leftBtn) {
                leftBtn.disabled = true;
                leftBtn.classList.remove("is-sel");
                leftBtn.classList.add("is-ok");
              }
              matched += 1;
              selLeft = null;
              if (matched >= totalPairs) {
                answered = true;
                showFb(mistakes === 0, t("All pairs matched!", "จับคู่ครบทุกคู่แล้ว!"));
              }
            } else {
              mistakes += 1;
              btn.classList.add("is-bad");
              window.setTimeout(() => btn.classList.remove("is-bad"), 420);
            }
          });
        });
      } else if (item.kind === "sorting") {
        const sItems = item.sortItems || [];
        let sPos = 0;
        let sWrong = 0;
        const curBox = el.querySelector<HTMLElement>("[data-cqr-sort-cur]");
        el.querySelectorAll<HTMLButtonElement>("[data-cqr-sort-pick]").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (answered || sPos >= sItems.length) return;
            const pick = Number(btn.dataset.cqrSortPick);
            if (pick !== sItems[sPos].bucketIdx) sWrong += 1;
            sPos += 1;
            if (sPos >= sItems.length) {
              answered = true;
              showFb(sWrong === 0, sWrong === 0 ? t("Sorted cleanly!", "คัดแยกถูกต้องครบถ้วน!") : t("Sorting complete!", "คัดแยกครบแล้ว!"));
            } else if (curBox) {
              curBox.textContent = sItems[sPos].text;
            }
          });
        });
      } else if (item.kind === "order-steps") {
        const totalSteps = (item.steps || []).length;
        let expected = 0;
        let mistakes = 0;
        el.querySelectorAll<HTMLButtonElement>("[data-cqr-order]").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (answered || btn.disabled) return;
            const idx = Number(btn.dataset.cqrOrder);
            if (idx === expected) {
              btn.disabled = true;
              btn.classList.add("is-ok");
              const numEl = btn.querySelector("[data-cqr-order-num]");
              if (numEl) numEl.textContent = String(expected + 1);
              expected += 1;
              if (expected >= totalSteps) {
                answered = true;
                showFb(mistakes === 0, t("Steps ordered right!", "เรียงลำดับถูกต้องครบถ้วน!"));
              }
            } else {
              mistakes += 1;
              btn.classList.add("is-bad");
              window.setTimeout(() => btn.classList.remove("is-bad"), 400);
            }
          });
        });
      }
    };

    el.hidden = false;
    renderCurrent();
    stopTimer();
    runnerTimer = window.setInterval(() => {
      secondsLeft -= 1;
      const tEl = el.querySelector<HTMLElement>("[data-cqr-timer]");
      if (tEl) tEl.textContent = `${Math.max(0, secondsLeft)}s`;
      if (secondsLeft <= 0) finishStage();
    }, 1000);
  };

  // Stop any theme BGM preview whenever leaving the studio/tab or hiding the page
  if (typeof window !== "undefined") {
    const stopPreviewOnly = (): void => {
      if (!runnerOverlay || runnerOverlay.hidden) stopThemeBgm();
    };
    window.addEventListener("learninghaus:open-home-panel", stopPreviewOnly);
    window.addEventListener("learninghaus:open-quiz", stopPreviewOnly);
    window.addEventListener("learninghaus:cancel-quiz-travel", stopPreviewOnly);
    window.addEventListener("learninghaus:studio-leave", stopPreviewOnly);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopThemeBgm();
    });
  }
}
