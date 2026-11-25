// รูปแบบด่านที่ใช้วางแผนบทเรียน: เพิ่มชนิดใหม่ได้โดยไม่ต้องแก้สูตรคะแนนหลัก
namespace LearningHausStageCatalog {
  export type Course = {
    id: string;
    subjectId: string;
    title: string;
    requiredLessons: number;
    stagesPerChapter: number;
  };

  // เพิ่มคอร์สหรือวิชาใหม่ได้จากรายการกลางนี้; ปัจจุบันมีข้อมูลจริงของ EU AI Act
  export const courses: Course[] = [
    { id: "eu-ai-act", subjectId: "ai-law", title: "EU AI Act", requiredLessons: 80, stagesPerChapter: 10 }
  ];

  export type Activity = {
    type: LearningHausProgression.StageGameType;
    name: string;
    purpose: string;
    scoreSignal: string;
  };

  export const activities: Activity[] = [
    { type: "quiz", name: "Quick Check", purpose: "Verify core concepts with 4-choice questions", scoreSignal: "Accuracy + time" },
    { type: "matching", name: "Pair Match", purpose: "Connect related terms, rules, or definitions", scoreSignal: "First-try pairs + time" },
    { type: "binary-stamp", name: "Rapid Stamp", purpose: "Judge cards into two customizable sides", scoreSignal: "Verdict accuracy + time" },
    { type: "sorting", name: "Category Sort", purpose: "Sort items into 2–4 custom category buckets", scoreSignal: "First-try sorts + time" },
    { type: "scenario", name: "Decision Path", purpose: "Make multi-step choices to protect a live score meter", scoreSignal: "Decision quality + meter" },
    { type: "true-false-sprint", name: "Rapid Blitz", purpose: "Fast-paced True/False streak blitz with combo multiplier", scoreSignal: "Streak accuracy + speed" },
    { type: "inspector", name: "Spot the Clues", purpose: "Inspect an artifact and click hidden target clues", scoreSignal: "Clues found cleanly + time" },
    { type: "order-steps", name: "Step Sequence", purpose: "Arrange workflow or process steps in chronological order", scoreSignal: "First-try step order + time" }
  ];

  // Universal 10-stage per chapter rotation (Stage 1 = Quick Check, Stages 2-9 = Universal Mini-Games, Stage 10 = Final Exam)
  export const stageRotation: LearningHausProgression.StageGameType[] = [
    "quiz",
    "matching",
    "binary-stamp",
    "sorting",
    "scenario",
    "true-false-sprint",
    "inspector",
    "matching",
    "order-steps",
    "quiz"
  ];

  export const getStageGameType = (stageIndex: number): LearningHausProgression.StageGameType => {
    const pos = ((stageIndex % LearningHausRules.quiz.stagesPerChapter) + LearningHausRules.quiz.stagesPerChapter) % LearningHausRules.quiz.stagesPerChapter;
    return stageRotation[pos] || "quiz";
  };

  export const getStageGameLabel = (stageIndex: number): string => {
    const pos = ((stageIndex % LearningHausRules.quiz.stagesPerChapter) + LearningHausRules.quiz.stagesPerChapter) % LearningHausRules.quiz.stagesPerChapter;
    if (pos === LearningHausRules.quiz.stagesPerChapter - 1) {
      return LearningHausI18n.t("Final Exam", "ข้อสอบปลายบท");
    }
    const type = stageRotation[pos] || "quiz";
    const labels: Record<string, [string, string]> = {
      quiz: ["Quick Check", "ควิซเช็กความเข้าใจ"],
      matching: ["Pair Match", "จับคู่ความสัมพันธ์"],
      "binary-stamp": ["Rapid Stamp", "ประทับตราแยกฝั่ง"],
      sorting: ["Category Sort", "คัดแยกหมวดหมู่"],
      scenario: ["Decision Path", "เส้นทางตัดสินใจ"],
      "true-false-sprint": ["Rapid Blitz", "สปรินต์จริงหรือเท็จ"],
      inspector: ["Spot the Clues", "นักสืบจับจุดสำคัญ"],
      "order-steps": ["Step Sequence", "เรียงลำดับขั้นตอน"]
    };
    const pair = labels[type] || labels.quiz;
    return LearningHausI18n.t(pair[0], pair[1]);
  };

  export type ChapterTheme = {
    chapter: number;
    roman: string;
    chapterTitle: string;
    realmName: string;
    thaiRealm: string;
    lore: string;
    companionImage: string;
    companionName: string;
    accent: string;
    shadow: string;
    secondary: string;
    pathColor: string;
    bannerBg: string;
    bannerText: string;
    learnSurface: string;
    biomeBg: string;
    darkBiome: boolean;
  };

  export const chapterThemes: ChapterTheme[] = [
    {
      chapter: 1,
      roman: "I",
      chapterTitle: "Foundations & Scope",
      realmName: "Sunflower Meadow",
      thaiRealm: "ทุ่งทานตะวันยามเช้า",
      lore: "Bright summer skies, rolling green hills & blooming golden sunflowers",
      companionImage: "../New_design/cat1.png",
      companionName: "Scholar Calico",
      accent: "#3B8146",
      shadow: "#286336",
      secondary: "#D4A017",
      pathColor: "#52945B",
      bannerBg: "#2E6937",
      bannerText: "#FFFFFF",
      learnSurface: "linear-gradient(180deg, #EAF8F0 0%, #E7F2C4 100%)",
      biomeBg: "linear-gradient(180deg, #C9EDFA 0%, #E7F2C4 100%)",
      darkBiome: false
    },
    {
      chapter: 2,
      roman: "II",
      chapterTitle: "Prohibited AI Practices",
      realmName: "The Forbidden Obsidian Vault",
      thaiRealm: "เขตต้องห้ามแห่งเงามืด",
      lore: "Shadowy iron gates, watchful crimson seals & amber warning torches",
      companionImage: "../New_design/cat2.png",
      companionName: "Inspector Black Cat",
      accent: "#C93B3B",
      shadow: "#8F2229",
      secondary: "#F2B84B",
      pathColor: "#C84B55",
      bannerBg: "#7D1B28",
      bannerText: "#FFEBEF",
      learnSurface: "linear-gradient(180deg, #FAF0F2 0%, #F2DCE1 100%)",
      biomeBg: "linear-gradient(180deg, #251924 0%, #371C27 100%)",
      darkBiome: true
    },
    {
      chapter: 3,
      roman: "III",
      chapterTitle: "High-Risk AI Systems",
      realmName: "The Amber Bastion Citadel",
      thaiRealm: "ป้อมปราการอัศวินแห่งความเสี่ยงสูง",
      lore: "Dusk skyline battlements, brass shield emblems & forged ember trails",
      companionImage: "../New_design/cat3.png",
      companionName: "Gavel Knight Cat",
      accent: "#D97028",
      shadow: "#9E4B14",
      secondary: "#47526E",
      pathColor: "#D68244",
      bannerBg: "#B3521B",
      bannerText: "#FFF8F0",
      learnSurface: "linear-gradient(180deg, #FDF4EB 0%, #F5DFCA 100%)",
      biomeBg: "linear-gradient(180deg, #FDF3E8 0%, #F3DAC2 100%)",
      darkBiome: false
    },
    {
      chapter: 4,
      roman: "IV",
      chapterTitle: "Transparency for Specific AI Systems",
      realmName: "Twilight Mirror Observatory",
      thaiRealm: "หอดูดาวกระจกแห่งความจริง",
      lore: "Starlight prisms, glowing detective lenses & truth-revealing mirrors",
      companionImage: "../New_design/cat4.png",
      companionName: "Scholar Cloak Cat",
      accent: "#545BB8",
      shadow: "#393F8E",
      secondary: "#4CA3DD",
      pathColor: "#6B73CC",
      bannerBg: "#3C4287",
      bannerText: "#FFFFFF",
      learnSurface: "linear-gradient(180deg, #EFF1FC 0%, #DDE2F8 100%)",
      biomeBg: "linear-gradient(180deg, #EEF0FC 0%, #DAE0F7 100%)",
      darkBiome: false
    },
    {
      chapter: 5,
      roman: "V",
      chapterTitle: "General-Purpose AI Models (GPAI)",
      realmName: "The Arcane Astral Spire",
      thaiRealm: "หอคอยจอมเวทนิวรอล",
      lore: "Crystal-orb ley lines, starlit amethyst spires & multi-spell runes",
      companionImage: "../New_design/cat5.png",
      companionName: "Arcane Scroll Cat",
      accent: "#8E44E3",
      shadow: "#5F24A8",
      secondary: "#EB76CD",
      pathColor: "#A566ED",
      bannerBg: "#6422AD",
      bannerText: "#F9EEFF",
      learnSurface: "linear-gradient(180deg, #F5EEFC 0%, #E7D7FA 100%)",
      biomeBg: "linear-gradient(180deg, #281945 0%, #422269 100%)",
      darkBiome: true
    },
    {
      chapter: 6,
      roman: "VI",
      chapterTitle: "Supporting Innovation & Small Businesses",
      realmName: "Emerald Alchemist Conservatory",
      thaiRealm: "เรือนกระจกนักแปรธาตุ",
      lore: "Sky-lit glasshouse dome, bubbling teal elixirs & thriving green sprouts",
      companionImage: "../New_design/cat6.png",
      companionName: "Alchemist Scholar Cat",
      accent: "#1C8A6E",
      shadow: "#125E4A",
      secondary: "#D4A33E",
      pathColor: "#32A386",
      bannerBg: "#166E58",
      bannerText: "#FFFFFF",
      learnSurface: "linear-gradient(180deg, #E8F7F2 0%, #D1EDE3 100%)",
      biomeBg: "linear-gradient(180deg, #E7F7F2 0%, #CDEAE0 100%)",
      darkBiome: false
    },
    {
      chapter: 7,
      roman: "VII",
      chapterTitle: "Governance & Who Is in Charge?",
      realmName: "Riverside Village",
      thaiRealm: "หมู่บ้านริมน้ำยามเช้า",
      lore: "Soft sunrise skies, riverside timber cottages & a sparkling winding stream",
      companionImage: "../New_design/cat7.png",
      companionName: "Council Presenter Cat",
      accent: "#2C7A7B",
      shadow: "#1D5657",
      secondary: "#D98A6C",
      pathColor: "#319795",
      bannerBg: "#2C7A7B",
      bannerText: "#FFFFFF",
      learnSurface: "linear-gradient(180deg, #FCE8DE 0%, #D5EEE8 100%)",
      biomeBg: "linear-gradient(180deg, #FCE8DE 0%, #C8E6DF 100%)",
      darkBiome: false
    },
    {
      chapter: 8,
      roman: "VIII",
      chapterTitle: "Your Rights & Enforcement",
      realmName: "Snowy Peak",
      thaiRealm: "ยอดเขาหิมะแสงเหนือ",
      lore: "Shimmering northern aurora, snow-capped alpine peaks & frosted evergreen pines",
      companionImage: "../New_design/cat8.png",
      companionName: "Summit Explorer Cat",
      accent: "#2F6690",
      shadow: "#1E4666",
      secondary: "#6FA8DC",
      pathColor: "#3B82B6",
      bannerBg: "#2F6690",
      bannerText: "#FFFFFF",
      learnSurface: "linear-gradient(180deg, #E2F2FC 0%, #CFE4F5 100%)",
      biomeBg: "linear-gradient(180deg, #D4EBFA 0%, #CFE4F5 100%)",
      darkBiome: false
    }
  ];

  export const getChapterTheme = (chapter: number): ChapterTheme => {
    return chapterThemes.find((item) => item.chapter === chapter) || chapterThemes[0];
  };

  // Maps chapters 1..8 exclusively onto 8 of the 10 non-law continuous scenic backdrops (zero law themes!)
  export const EU_CHAPTER_TO_THEME_ID: Record<number, number> = {
    1: 8,  // Sunflower Meadow
    2: 1,  // Obsidian Vault
    3: 2,  // Amber Bastion (Brick Castle)
    4: 3,  // Mirror Observatory
    5: 4,  // Astral Spire
    6: 5,  // Emerald Conservatory
    7: 10, // Riverside Village
    8: 7   // Snowy Peak
  };

  export const getBiomeImagePath = (themeId: number): string => {
    const id = Math.max(1, Math.min(10, Math.round(themeId || 1)));
    return `lesson-assets/biomes/theme-${id}.png`;
  };

  export const renderEuChapterBiomeSvg = (chNum: number, rawHeight: number): string => {
    const themeId = EU_CHAPTER_TO_THEME_ID[chNum] || 8;
    return renderContinuousBiomeSvg(themeId, rawHeight);
  };

  // Single-sheet 16-bit pixel-art world backdrop for all 10 Creator Themes (1..10) — ZERO repeating pattern seams!
  export const renderContinuousBiomeSvg = (themeId: number, _rawHeight: number): string => {
    const src = getBiomeImagePath(themeId);
    return `<img class="quiz-biome-scene quiz-biome-scene--pixel" src="${src}" alt="" draggable="false" loading="lazy">`;
  };
}
