// My Classes (Classic Google Classroom Grid), Cleaned-Up Explore Lessons, Minimal 2-Step Class Studio, & Custom Lesson Player
namespace LearningHausLearnHub {
  export type CoverRatio = "portrait" | "landscape" | "square";
  export type ClassRole = "enrolled" | "teaching";
  export type LearnSubview = "classes" | "explore" | "deck" | "studio";
  export type ClassLayoutStyle = "fan" | "grid" | "list";
  export type CardAspectRatio = "3/4" | "16/9" | "1/1" | "4/3";
  export type ChapterMediaType = "youtube" | "upload" | "canva" | "reading";

  export type CourseCategory =
    | "law"
    | "ethics"
    | "practical"
    | "cs"
    | "data"
    | "cyber"
    | "math"
    | "science"
    | "languages"
    | "social"
    | "business"
    | "finance"
    | "design"
    | "health"
    | "personal"
    | "other";

  export type ChapterQuizQuestion = {
    question: string;
    options: [string, string, string];
    correctIndex: 0 | 1 | 2;
  };

  export type ClassRewardPoolItem = {
    poolId: string;
    kind: "prop" | "bg";
    itemId: string;
    nameEn: string;
    nameTh: string;
    tagEn: string;
    tagTh: string;
    propRewardId?: LearningHausPixelCat.PropId;
    bgRewardId?: LearningHausPixelCat.AvatarBgId;
  };

  export type CourseQuestObjectiveType =
    | "complete-lessons"
    | "complete-chapter"
    | "media-finish"
    | "quiz-pass"
    | "complete-course";

  export type CustomCourseQuest = {
    id: string;
    courseId: string;
    objectiveType: CourseQuestObjectiveType;
    targetValue: number;
    titleEn: string;
    titleTh: string;
    descEn: string;
    descTh: string;
    rewardPoolId: string;
    xpReward: number;
    propRewardId?: LearningHausPixelCat.PropId;
    bgRewardId?: LearningHausPixelCat.AvatarBgId;
  };

  export type CourseChapter = {
    title: string;
    summaryEn: string;
    summaryTh: string;
    points?: number;
    cover?: string;
    mediaType?: ChapterMediaType;
    youtubeUrl?: string;
    canvaUrl?: string;
    videoFileName?: string;
    uploadMime?: string;
    readingBody?: string;
    hasQuiz?: boolean;
    quiz?: ChapterQuizQuestion;
    quizThemePreset?: number;
    quizStages?: LearningHausCustomQuizStudio.CustomQuizStage[];
  };

  export type JoinRequest = {
    id: string;
    learnerName: string;
    requestedAt: string;
  };

  export type CourseItem = {
    id: string;
    classCode: string;
    title: string;
    category: CourseCategory;
    categoryEn: string;
    categoryTh: string;
    suggested: boolean;
    ratio: CoverRatio;
    ratioEn: string;
    ratioTh: string;
    creator: string;
    role?: ClassRole;
    isCustom?: boolean;
    requireApproval?: boolean;
    pendingRequests?: JoinRequest[];
    approvedLearners?: string[];
    layoutStyle?: ClassLayoutStyle;
    cardRatio?: CardAspectRatio;
    cardWidth?: number;
    cardSizeCustom?: boolean;
    passPercent?: number;
    image?: string;
    poster?: string;
    gradient: string;
    iconName: "book" | "briefcase" | "shield" | "scale" | "sparkles" | "layers";
    descriptionEn: string;
    descriptionTh: string;
    chapters: readonly CourseChapter[];
    rewardPool?: ClassRewardPoolItem[];
    customQuests?: CustomCourseQuest[];
  };

  type MyClassesState = {
    joinedIds: string[];
    removedDefaults: string[];
    pendingJoinIds?: string[];
    customClasses: CourseItem[];
    courseQuestsByCourse?: Record<string, CustomCourseQuest[]>;
  };

  const IMAGE_MAX_BYTES = 2 * 1024 * 1024;
  const IMAGE_MIN_PX = 300;
  const IMAGE_MAX_PX = 2400;
  const VIDEO_MAX_BYTES = 25 * 1024 * 1024;

  const t = (en: string, th: string): string => LearningHausI18n.t(en, th);

  const escHtml = (value: string): string =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const SVG_ICONS: Record<string, string> = {
    search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    star: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    book: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    briefcase: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    shield: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>`,
    scale: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,
    sparkles: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    layers: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    arrowRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    user: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    bookmark: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
    bookmarkFilled: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
    checkCircle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
    plusCircle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`,
    plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    copy: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    key: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>`,
    compass: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    logOut: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
    info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    pencil: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
    play: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>`
  };

  const CATEGORY_META: Record<CourseCategory, { en: string; th: string; icon: CourseItem["iconName"] }> = {
    law: { en: "AI Law & Policy", th: "กฎหมายและนโยบาย AI", icon: "scale" },
    ethics: { en: "Ethics & Safety", th: "จริยธรรมและความปลอดภัย", icon: "shield" },
    practical: { en: "Practical AI & Productivity", th: "การใช้งาน AI ในชีวิตจริง", icon: "briefcase" },
    cs: { en: "Computer Science & Programming", th: "วิทยาการคอมพิวเตอร์และการเขียนโปรแกรม", icon: "layers" },
    data: { en: "Data Science & Analytics", th: "วิทยาการข้อมูลและการวิเคราะห์", icon: "layers" },
    cyber: { en: "Cybersecurity & Privacy", th: "ความมั่นคงปลอดภัยไซเบอร์และความเป็นส่วนตัว", icon: "shield" },
    math: { en: "Mathematics", th: "คณิตศาสตร์", icon: "layers" },
    science: { en: "Science & Engineering", th: "วิทยาศาสตร์และวิศวกรรมศาสตร์", icon: "sparkles" },
    languages: { en: "Languages & Literature", th: "ภาษาและวรรณคดี", icon: "book" },
    social: { en: "Social Studies & History", th: "สังคมศึกษาและประวัติศาสตร์", icon: "scale" },
    business: { en: "Business & Management", th: "ธุรกิจและการจัดการ", icon: "briefcase" },
    finance: { en: "Finance & Economics", th: "การเงินและเศรษฐศาสตร์", icon: "briefcase" },
    design: { en: "Art, Design & Media", th: "ศิลปะ การออกแบบ และสื่อสร้างสรรค์", icon: "sparkles" },
    health: { en: "Health & Wellness", th: "สุขภาพและการดูแลตนเอง", icon: "shield" },
    personal: { en: "Personal Development & Soft Skills", th: "การพัฒนาตนเองและทักษะการทำงาน", icon: "sparkles" },
    other: { en: "General / Other", th: "ทั่วไป / อื่นๆ", icon: "book" }
  };

  const COURSES: readonly CourseItem[] = [
    {
      id: "eu-ai-act",
      classCode: "EUAI-2026",
      title: "EU AI Act: Foundations to Enforcement",
      category: "law",
      categoryEn: "AI Law",
      categoryTh: "กฎหมาย AI",
      suggested: true,
      ratio: "portrait",
      ratioEn: "Portrait 3:4",
      ratioTh: "ปกแนวตั้ง 3:4",
      creator: "LearningHaus Official",
      role: "enrolled",
      image: "lesson-assets/ext/chapters/Chapter1.png",
      poster: "lesson-assets/chapter-1-poster.png",
      gradient: "linear-gradient(135deg, #27532d 0%, #3c7d42 100%)",
      iconName: "scale",
      descriptionEn:
        "Learn the world's first major AI law across 8 chapters, from basic scope and banned practices to high-risk rules, transparency, governance, and user rights.",
      descriptionTh:
        "ปูพื้นฐานกฎหมาย AI ฉบับแรกของโลกตั้งแต่ขอบเขตการบังคับใช้ ข้อห้าม AI ความเสี่ยงสูง ความโปร่งใส ไปจนถึงสิทธิของผู้ใช้งานและการบังคับใช้จริงครบทั้ง 8 บท",
      chapters: [
        { title: "Foundations & Scope", summaryEn: "Legal scope and key roles under the EU AI Act.", summaryTh: "ขอบเขตการบังคับใช้และผู้มีหน้าที่ภายใต้ EU AI Act" },
        { title: "Prohibited AI Practices", summaryEn: "Banned AI practices that threaten fundamental rights.", summaryTh: "แนวปฏิบัติ AI ต้องห้ามที่ละเมิดสิทธิขั้นพื้นฐาน" },
        { title: "High-Risk AI Systems", summaryEn: "Safety, documentation, and oversight rules for high-risk AI.", summaryTh: "ระบบ AI ความเสี่ยงสูงและข้อกำหนดด้านความปลอดภัย" },
        { title: "Transparency for Specific AI Systems", summaryEn: "Disclosure duties for chatbots and synthetic media.", summaryTh: "หน้าที่แจ้งให้ผู้ใช้ทราบเมื่อโต้ตอบกับ AI หรือสื่อสังเคราะห์" },
        { title: "General-Purpose AI Models (GPAI)", summaryEn: "Compliance obligations for general-purpose AI models.", summaryTh: "หลักเกณฑ์สำหรับโมเดล AI อเนกประสงค์และโมเดลขนาดใหญ่" },
        { title: "Supporting Innovation & Small Businesses", summaryEn: "AI regulatory sandboxes and SME support measures.", summaryTh: "AI Regulatory Sandboxes และมาตรการสนับสนุน SMEs" },
        { title: "Governance & Who Is in Charge?", summaryEn: "Role of the EU AI Office, AI Board, and national authorities.", summaryTh: "โครงสร้างหน่วยงานกำกับดูแล AI Office และ AI Board" },
        { title: "Your Rights & Enforcement", summaryEn: "Right to explanation, complaints, and legal penalties.", summaryTh: "สิทธิในการร้องเรียน ขอคำอธิบาย และบทลงโทษตามกฎหมาย" }
      ]
    },
    {
      id: "everyday-math-101",
      classCode: "MATH-101",
      title: "Everyday Math & Practical Calculation",
      category: "practical",
      categoryEn: "Everyday Math",
      categoryTh: "คณิตชีวิตประจำวัน",
      suggested: true,
      ratio: "landscape",
      ratioEn: "Landscape 16:9",
      ratioTh: "ปกแนวนอน 16:9",
      creator: "LearningHaus Official",
      role: "enrolled",
      image: "lesson-assets/covers/pixel-library.png",
      poster: "lesson-assets/covers/pixel-library.png",
      gradient: "linear-gradient(135deg, #245032 0%, #4d8b55 100%)",
      iconName: "layers",
      descriptionEn:
        "Master everyday calculations you actually use: discounts and percentages, splitting bills, comparing unit prices, and simple interest.",
      descriptionTh:
        "ฝึกคณิตศาสตร์ที่ใช้จริงในชีวิตประจำวัน ทั้งการคิดส่วนลดเปอร์เซ็นต์ การหารค่าอาหาร การเทียบราคาต่อหน่วย และดอกเบี้ยเบื้องต้น",
      chapters: [
        { title: "Percentages & Shopping Discounts", summaryEn: "Calculate 15%, 30%, and Buy-2-Get-1 deals quickly in your head.", summaryTh: "วิธีคิดส่วนลด 15%, 30% และโปรซื้อ 2 แถม 1 แบบรวดเร็วในใจ", mediaType: "reading", readingBody: "To find 10% of any price, move the decimal point one place left. For 20%, double 10%. For 15%, add 10% plus half of 10%. Example: 20% off 450 baht = 90 baht off, so you pay 360 baht.", hasQuiz: true, quiz: { question: "A shirt costs 400 baht with a 25% discount. How much do you pay?", options: ["300 baht", "325 baht", "350 baht"], correctIndex: 0 } },
        { title: "Splitting Bills, VAT & Service Charge", summaryEn: "Understand +7% VAT and +10% service charge when dining out.", summaryTh: "เข้าใจการคิด VAT 7% และ Service Charge 10% เวลาทานอาหารกับเพื่อน", mediaType: "reading", readingBody: "When a restaurant menu says ++, it usually adds 10% service charge first, then 7% VAT on the subtotal — roughly multiplying the menu price by 1.177." },
        { title: "Comparing Unit Prices at the Store", summaryEn: "Spot which bottle or pack actually gives better value per gram or ml.", summaryTh: "เทคนิคเทียบราคาต่อกรัมหรือต่อมิลลิลิตร เพื่อเลือกซื้อของที่คุ้มค่าที่สุด", mediaType: "reading", readingBody: "Divide total price by net weight or volume (e.g., 60 baht / 500 ml = 0.12 baht/ml). Larger packs are not always cheaper when a smaller pack is on sale!" },
        { title: "Simple Interest & Monthly Installments", summaryEn: "Check real total cost before choosing 0% or monthly installment plans.", summaryTh: "คำนวณดอกเบี้ยและยอดผ่อนรายเดือนให้รู้ต้นทุนจริงก่อนตัดสินใจซื้อ", mediaType: "reading", hasQuiz: true, quiz: { question: "If you borrow 10,000 baht at 5% simple interest per year, how much is the interest for 1 year?", options: ["500 baht", "50 baht", "5,000 baht"], correctIndex: 0 } }
      ]
    },
    {
      id: "basic-english-101",
      classCode: "ENG-101",
      title: "Basic Conversational English",
      category: "languages",
      categoryEn: "Languages",
      categoryTh: "ภาษา",
      suggested: true,
      ratio: "portrait",
      ratioEn: "Portrait 3:4",
      ratioTh: "ปกแนวตั้ง 3:4",
      creator: "LearningHaus Official",
      role: "enrolled",
      image: "lesson-assets/covers/pixel-art.png",
      poster: "lesson-assets/covers/pixel-art.png",
      gradient: "linear-gradient(160deg, #3c3a62 0%, #346739 100%)",
      iconName: "book",
      descriptionEn:
        "Build everyday English confidence for greetings, introducing yourself, ordering food, asking for directions, and polite small talk.",
      descriptionTh:
        "ฝึกภาษาอังกฤษเพื่อการสื่อสารเบื้องต้นที่ใช้ได้จริงทุกวัน ทั้งการทักทาย แนะนำตัว สั่งอาหาร ถามทาง และบทสนทนาอย่างสุภาพ",
      chapters: [
        { title: "Greetings & Self-Introduction", summaryEn: "Natural ways to say hello, share your name, and keep a conversation going.", summaryTh: "ประโยคทักทาย แนะนำตัว และชวนคุยต่ออย่างเป็นธรรมชาติ", mediaType: "reading", readingBody: "Start warmly with 'Hi, nice to meet you! I'm ...' or 'How's your day going?'. Keep answers friendly and ask a simple follow-up question.", hasQuiz: true, quiz: { question: "Which reply is most natural when someone asks 'How are you doing?'", options: ["I'm doing great, thanks! How about you?", "I am doing homework tomorrow.", "Yes, I am name Alex."], correctIndex: 0 } },
        { title: "Ordering Food & Coffee Politely", summaryEn: "Use 'Could I have...' and 'I'd like...' smoothly at cafes and restaurants.", summaryTh: "การใช้ 'Could I have...' และ 'I'd like...' เวลาสั่งอาหารและเครื่องดื่มอย่างสุภาพ", mediaType: "reading", readingBody: "Instead of 'Give me iced coffee', say 'Could I have an iced latte, less sweet, please?' or 'I'd like to order the green curry, please.'" },
        { title: "Asking & Giving Directions", summaryEn: "Essential phrases for finding bus stops, stations, and nearby places.", summaryTh: "ประโยคถามทางและบอกทางพื้นฐานสำหรับการเดินทาง", mediaType: "reading", readingBody: "Use 'Excuse me, how do I get to the train station?' and listen for landmarks like 'go straight', 'turn left at the corner', and 'it's across from the bank'." },
        { title: "Polite Requests & Everyday Small Talk", summaryEn: "Ask for help, clarify when you don't catch a word, and say thank you naturally.", summaryTh: "การขอความช่วยเหลือ ขอให้พูดซ้ำช้าๆ และขอบคุณอย่างสุภาพ", mediaType: "reading", hasQuiz: true, quiz: { question: "What is a polite way to ask someone to repeat what they said?", options: ["Sorry, could you say that again a bit slower?", "Speak louder now!", "I don't care."], correctIndex: 0 } }
      ]
    },
    {
      id: "personal-finance-102",
      classCode: "FIN-102",
      title: "Personal Finance & Saving Basics",
      category: "business",
      categoryEn: "Business & Skills",
      categoryTh: "ธุรกิจ & ทักษะ",
      suggested: true,
      ratio: "landscape",
      ratioEn: "Landscape 16:9",
      ratioTh: "ปกแนวนอน 16:9",
      creator: "LearningHaus Official",
      role: "enrolled",
      image: "lesson-assets/covers/pixel-forest.png",
      poster: "lesson-assets/covers/pixel-forest.png",
      gradient: "linear-gradient(135deg, #2d4c33 0%, #6d945b 100%)",
      iconName: "briefcase",
      descriptionEn:
        "Learn practical money habits for students and young adults: 50/30/20 budgeting, building an emergency fund, and avoiding common debt traps.",
      descriptionTh:
        "ปูพื้นฐานการวางแผนการเงินส่วนบุคคลสำหรับนักศึกษาและวัยเริ่มทำงาน ทั้งสูตรออมเงิน 50/30/20 เงินสำรองฉุกเฉิน และการเลี่ยงกับดักหนี้",
      chapters: [
        { title: "The 50 / 30 / 20 Budget Rule", summaryEn: "Balance needs, wants, and savings without feeling overwhelmed.", summaryTh: "แบ่งสัดส่วนรายจ่ายจำเป็น ความสุขส่วนตัว และเงินออมด้วยกฎ 50/30/20", mediaType: "reading", readingBody: "Allocate roughly 50% of income to essentials (food, rent, transport), 30% to lifestyle wants, and at least 20% to savings or debt repayment.", hasQuiz: true, quiz: { question: "In the 50/30/20 rule, what does the 20% portion represent?", options: ["Savings and financial goals", "Impulse shopping", "Entertainment subscriptions"], correctIndex: 0 } },
        { title: "Tracking Daily Income & Expenses", summaryEn: "Spot small recurring leaks like unused subscriptions and daily snacks.", summaryTh: "วิธีจดบันทึกรายรับรายจ่ายเพื่อเห็นรูรั่วทางการเงินเล็กๆ ในแต่ละวัน", mediaType: "reading" },
        { title: "Building an Emergency Fund", summaryEn: "Why saving 3–6 months of living expenses protects you from surprises.", summaryTh: "ทำไมควรมีเงินสำรองฉุกเฉิน 3–6 เดือนของค่าใช้จ่ายจำเป็น", mediaType: "reading" }
      ]
    },
    {
      id: "digital-safety-103",
      classCode: "SAFE-103",
      title: "Digital Safety & Smart Internet Use",
      category: "cs",
      categoryEn: "Coding & Tech",
      categoryTh: "โค้ดดิ้ง & เทค",
      suggested: false,
      ratio: "square",
      ratioEn: "Square 1:1",
      ratioTh: "ปกจัตุรัส 1:1",
      creator: "LearningHaus Official",
      role: "enrolled",
      image: "lesson-assets/covers/pixel-code.png",
      poster: "lesson-assets/covers/pixel-code.png",
      gradient: "linear-gradient(135deg, #1d3c47 0%, #37786f 100%)",
      iconName: "sparkles",
      descriptionEn:
        "Protect yourself online by spotting scam links and fake SMS messages, setting strong passwords with 2FA, and verifying news before sharing.",
      descriptionTh:
        "เรียนรู้วิธีป้องกันตัวเองจากลิงก์มิจฉาชีพและ SMS ปลอม การตั้งรหัสผ่านปลอดภัยพร้อม 2FA และการตรวจสอบข่าวก่อนแชร์",
      chapters: [
        { title: "Spotting Phishing Links & Fake SMS", summaryEn: "Red flags in urgent messages claiming your account or parcel is blocked.", summaryTh: "วิธีสังเกตข้อความเร่งด่วน ลิงก์แปลกปลอม และเพจปลอมของมิจฉาชีพ", mediaType: "reading", hasQuiz: true, quiz: { question: "What should you do if you receive an SMS with a short link claiming your bank account is locked?", options: ["Do not click; verify directly via the official bank app or hotline", "Click immediately and enter your OTP", "Forward the link to all friends"], correctIndex: 0 } },
        { title: "Strong Passwords & Two-Factor Auth (2FA)", summaryEn: "Why unique passphrases and 2FA stop account takeovers.", summaryTh: "การตั้งรหัสผ่านที่เดายากและเปิดใช้งานยืนยันตัวตน 2 ชั้น (2FA)", mediaType: "reading" },
        { title: "Checking Information Before Sharing", summaryEn: "Quick 3-step fact-check habits for social media posts.", summaryTh: "เช็กให้ชัวร์ก่อนแชร์ด้วยหลักการตรวจสอบแหล่งที่มา 3 ขั้นตอน", mediaType: "reading" }
      ]
    },
    {
      id: "everyday-comm-104",
      classCode: "COMM-104",
      title: "Everyday Writing & Clear Communication",
      category: "design",
      categoryEn: "Design & Media",
      categoryTh: "ดีไซน์ & สื่อ",
      suggested: false,
      ratio: "square",
      ratioEn: "Square 1:1",
      ratioTh: "ปกจัตุรัส 1:1",
      creator: "LearningHaus Official",
      role: "enrolled",
      image: "lesson-assets/covers/pixel-draft.png",
      poster: "lesson-assets/covers/pixel-draft.png",
      gradient: "linear-gradient(135deg, #54452b 0%, #3c7d42 100%)",
      iconName: "sparkles",
      descriptionEn:
        "Communicate clearly in class and daily life: write polite emails, summarize key points concisely, and structure short presentations.",
      descriptionTh:
        "พัฒนาทักษะการสื่อสารและการเขียนที่ใช้ได้ทุกวัน ทั้งการเขียนอีเมลสุภาพ การสรุปใจความให้กระชับ และการเล่าเรื่องให้น่าฟัง",
      chapters: [
        { title: "Writing Clear & Polite Emails", summaryEn: "Subject lines, greetings, and clear requests teachers and teams appreciate.", summaryTh: "โครงสร้างอีเมลที่อ่านง่าย สุภาพ และสื่อสารจุดประสงค์ชัดเจน", mediaType: "reading" },
        { title: "Summarizing Key Points in 3 Bullets", summaryEn: "Turn long notes into clear takeaways anyone can read in 15 seconds.", summaryTh: "เทคนิคย่อยข้อความยาวให้เหลือ 3 ประเด็นสำคัญที่อ่านจบใน 15 วินาที", mediaType: "reading" },
        { title: "Speaking Clearly in Short Presentations", summaryEn: "Open with the main idea, show one example, and wrap up cleanly.", summaryTh: "วิธีเปิดประเด็น ยกตัวอย่าง และสรุปจบในการนำเสนอสั้นๆ อย่างมั่นใจ", mediaType: "reading" }
      ]
    }
  ];

  const FAVORITES_STORAGE_KEY = "learninghaus.favorite-courses.v1";
  const SELECTED_COURSE_STORAGE_KEY = "learninghaus.selectedQuizCourseId.v1";
  const MY_CLASSES_STORAGE_KEY = "learninghaus.myClasses.v1";
  const CUSTOM_DONE_STORAGE_KEY = "learninghaus.customChapterDone.v1";
  const AWARDED_XP_STORAGE_KEY = "learninghaus.equalLessonXp.v1";
  const EQUAL_LESSON_XP = 25;
  const CLASS_COMPLETE_BONUS_XP = 100;

  // In-memory session blob URLs for uploaded videos (<= 25 MB)
  const sessionVideoUrls = new Map<string, string>();

  let activeCourseId = "eu-ai-act";
  let selectedQuizCourseId: string | null = null;
  let activeCategory = "all";
  let activeRoleFilter: "all" | ClassRole = "all";
  let searchQuery = "";
  let modalCourse: CourseItem | null = null;
  let favoriteIds = new Set<string>();
  let myClassesState: MyClassesState = { joinedIds: [], removedDefaults: [], pendingJoinIds: [], customClasses: [] };
  let customDoneMap: Record<string, number[]> = {};
  let awardedXpKeys = new Set<string>();
  let customSelectedChIdx = 0;

  // Studio state
  let studioCourseId: string | null = null;
  let studioStep: 1 | 2 | 3 = 1;
  let studioChapterIdx = 0;

  // Player modal state
  let playerCourseId: string | null = null;
  let playerChapterIdx = 0;
  let activeYtPlayer: { destroy?: () => void } | null = null;

  let setSubviewFn: ((subview: LearnSubview) => void) | null = null;
  let toastTimer: number | null = null;

  const PASSED_LESSON_QUIZ_KEY = "learninghaus.passedLessonQuizzes.v1";
  let passedLessonQuizzes = new Set<string>();

  const MASTER_REWARD_CATALOG: readonly Omit<ClassRewardPoolItem, "poolId">[] = [
    { kind: "prop", itemId: "beret", nameEn: "Scholar Beret", nameTh: "หมวกเบเร่ต์นักคิด", tagEn: "Pixel Cat Prop", tagTh: "พร็อพแต่งแมว", propRewardId: "beret" },
    { kind: "prop", itemId: "visor", nameEn: "Cyber Visor", nameTh: "แว่นไวเซอร์ไซเบอร์", tagEn: "Pixel Cat Prop", tagTh: "พร็อพแต่งแมว", propRewardId: "visor" },
    { kind: "bg", itemId: "law-pillars", nameEn: "Marble Study Theme", nameTh: "พื้นหลังลายหินอ่อนคลาสสิก", tagEn: "Profile Background", tagTh: "พื้นหลังโปรไฟล์", bgRewardId: "law-pillars" },
    { kind: "prop", itemId: "star-clip", nameEn: "Starlight Hairpin", nameTh: "กิ๊บดาวประกายแสง", tagEn: "Pixel Cat Prop", tagTh: "พร็อพแต่งแมว", propRewardId: "star-clip" },
    { kind: "prop", itemId: "halo", nameEn: "Golden Halo", nameTh: "วงแหวนแสงทอง", tagEn: "Pixel Cat Prop", tagTh: "พร็อพแต่งแมว", propRewardId: "halo" },
    { kind: "prop", itemId: "flower-crown", nameEn: "Leaf & Blossom Crown", nameTh: "มงกุฎใบไม้ผลิบาน", tagEn: "Pixel Cat Prop", tagTh: "พร็อพแต่งแมว", propRewardId: "flower-crown" },
    { kind: "bg", itemId: "aurora-glow", nameEn: "Emerald Aurora Theme", nameTh: "พื้นหลังแสงเหนือมรกต", tagEn: "Profile Background", tagTh: "พื้นหลังโปรไฟล์", bgRewardId: "aurora-glow" },
    { kind: "bg", itemId: "prism-holo", nameEn: "Prism Holo Theme", nameTh: "พื้นหลังโฮโลแกรมปริซึม", tagEn: "Profile Background", tagTh: "พื้นหลังโปรไฟล์", bgRewardId: "prism-holo" },
    { kind: "bg", itemId: "sunset-wave", nameEn: "Sunset Waves Theme", nameTh: "พื้นหลังคลื่นยามเย็น", tagEn: "Profile Background", tagTh: "พื้นหลังโปรไฟล์", bgRewardId: "sunset-wave" },
    { kind: "prop", itemId: "grad-cap", nameEn: "Scholar Cap", nameTh: "หมวกบัณฑิต", tagEn: "Pixel Cat Prop", tagTh: "พร็อพแต่งแมว", propRewardId: "grad-cap" },
    { kind: "prop", itemId: "wizard-hat", nameEn: "Scholar Wizard Hat", nameTh: "หมวกจอมเวทปราชญ์", tagEn: "Pixel Cat Prop", tagTh: "พร็อพแต่งแมว", propRewardId: "wizard-hat" },
    { kind: "prop", itemId: "crown", nameEn: "Star Crown", nameTh: "มงกุฎดาวทองคำ", tagEn: "Pixel Cat Prop", tagTh: "พร็อพแต่งแมว", propRewardId: "crown" }
  ];

  const hashCourseSeed = (seed: string): number => {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h >>> 0);
  };

  export const rollRewardPoolForSeed = (seed: string): ClassRewardPoolItem[] => {
    if (seed === "eu-ai-act") {
      return [
        { ...MASTER_REWARD_CATALOG[0], poolId: "pool-0" },
        { ...MASTER_REWARD_CATALOG[1], poolId: "pool-1" },
        { ...MASTER_REWARD_CATALOG[2], poolId: "pool-2" },
        { ...MASTER_REWARD_CATALOG[6], poolId: "pool-3" }
      ];
    }
    const pool = [...MASTER_REWARD_CATALOG];
    let s = hashCourseSeed(seed) || 1234567;
    for (let i = pool.length - 1; i > 0; i -= 1) {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      const j = s % (i + 1);
      const tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }
    return pool.slice(0, 4).map((item, idx) => ({
      ...item,
      poolId: `pool-${idx}`
    }));
  };

  const getAllCombined = (): CourseItem[] => [...myClassesState.customClasses, ...COURSES];

  export const getCourseById = (courseId: string): CourseItem | null =>
    getAllCombined().find((c) => c.id === courseId) || null;

  export const getClassRewardPool = (courseId: string): ClassRewardPoolItem[] => {
    const course = getCourseById(courseId);
    if (course?.rewardPool && course.rewardPool.length >= 4) {
      return course.rewardPool;
    }
    const rolled = rollRewardPoolForSeed(courseId);
    if (course && course.isCustom) {
      course.rewardPool = rolled;
    }
    return rolled;
  };

  const buildDefaultCourseQuests = (course: CourseItem): CustomCourseQuest[] => {
    const pool = getClassRewardPool(course.id);
    const r0 = pool[0];
    const r1 = pool[1] || pool[0];
    const chCount = Math.max(1, course.chapters.length);
    if (course.id === "eu-ai-act") {
      return [
        {
          id: "course-eu-ch2",
          courseId: "eu-ai-act",
          objectiveType: "complete-lessons",
          targetValue: 2,
          titleEn: "Complete 2 Lessons in EU AI Act",
          titleTh: "เรียนครบ 2 บทในคอร์ส EU AI Act",
          descEn: `Finish 2 lessons or chapters in ${course.title} to claim ${r0.nameEn} from this class's reward pool.`,
          descTh: `เรียนจบ 2 บทในคอร์ส ${course.title} เพื่อรับ ${r0.nameTh} จากคลังรางวัลประจำคลาส`,
          rewardPoolId: r0.poolId,
          xpReward: 100,
          propRewardId: r0.propRewardId,
          bgRewardId: r0.bgRewardId
        },
        {
          id: "course-eu-master",
          courseId: "eu-ai-act",
          objectiveType: "complete-lessons",
          targetValue: 3,
          titleEn: "Complete 3 Chapters in EU AI Act",
          titleTh: "พิชิตครบ 3 บทในคอร์ส EU AI Act",
          descEn: `Complete 3 chapters in ${course.title} to unlock ${r1.nameEn}.`,
          descTh: `ผ่านบทเรียนหรือด่านควิซครบ 3 บทในคอร์ส ${course.title} เพื่อปลดล็อก ${r1.nameTh}`,
          rewardPoolId: r1.poolId,
          xpReward: 160,
          propRewardId: r1.propRewardId,
          bgRewardId: r1.bgRewardId
        }
      ];
    }
    const firstTarget = 1;
    const secondTarget = Math.min(chCount, Math.max(2, chCount));
    const list: CustomCourseQuest[] = [
      {
        id: `cquest-${course.id}-1`,
        courseId: course.id,
        objectiveType: "media-finish",
        targetValue: firstTarget,
        titleEn: `Finish Lesson 1 in ${course.title}`,
        titleTh: `เรียนจบบทที่ 1 ของคลาส ${course.title}`,
        descEn: `Read the slides/article or watch the video in Lesson 1 ("${course.chapters[0]?.title || "Lesson 1"}") to claim ${r0.nameEn}.`,
        descTh: `เปิดอ่านสไลด์/บทความ หรือดูวิดีโอบทที่ 1 ("${course.chapters[0]?.title || "บทที่ 1"}") จนจบเพื่อรับ ${r0.nameTh}`,
        rewardPoolId: r0.poolId,
        xpReward: course.requireApproval ? 0 : 40,
        propRewardId: r0.propRewardId,
        bgRewardId: r0.bgRewardId
      }
    ];
    if (chCount >= 2) {
      list.push({
        id: `cquest-${course.id}-all`,
        courseId: course.id,
        objectiveType: "complete-course",
        targetValue: secondTarget,
        titleEn: `Complete All ${chCount} Lessons in ${course.title}`,
        titleTh: `เรียนจบครบทั้ง ${chCount} บทในคลาส ${course.title}`,
        descEn: `Finish every lesson in ${course.title} to unlock ${r1.nameEn} from this class's reward pool.`,
        descTh: `เรียนจบครบทุกบทเรียนในคลาส ${course.title} เพื่อรับ ${r1.nameTh} จากคลังรางวัลประจำคลาส`,
        rewardPoolId: r1.poolId,
        xpReward: course.requireApproval ? 0 : 80,
        propRewardId: r1.propRewardId,
        bgRewardId: r1.bgRewardId
      });
    }
    return list;
  };

  export const getCourseQuests = (courseId: string): CustomCourseQuest[] => {
    const course = getCourseById(courseId);
    if (!course) return [];
    let list: CustomCourseQuest[] = [];
    if (Array.isArray(course.customQuests) && course.customQuests.length > 0) {
      list = course.customQuests;
    } else if (Array.isArray(myClassesState.courseQuestsByCourse?.[courseId]) && myClassesState.courseQuestsByCourse![courseId].length > 0) {
      list = myClassesState.courseQuestsByCourse![courseId];
    } else {
      list = buildDefaultCourseQuests(course);
      if (course.isCustom) {
        course.customQuests = list;
      }
    }
    // Locked / approval-required classes never grant Bonus EXP (anti-farm rule)
    return course.requireApproval ? list.map((q) => ({ ...q, xpReward: 0 })) : list;
  };

  export const isCustomChapterCompleted = (courseId: string, chIdx: number): boolean =>
    isChapterDone(courseId, chIdx);

  export const getCompletedLessonCountForCourse = (courseId: string): number => {
    if (courseId === "eu-ai-act" && window.LearningHausQuiz?.getProgress) {
      const p = window.LearningHausQuiz.getProgress();
      const spc = LearningHausRules.quiz.stagesPerChapter;
      const quizDone = (p?.chapters || []).filter((ch) => {
        const first = (ch.chapter - 1) * spc + 1;
        return ch.highestPassed >= first;
      }).length;
      const customDone = Array.isArray(customDoneMap[courseId]) ? customDoneMap[courseId].length : 0;
      return Math.max(quizDone, customDone);
    }
    return Array.isArray(customDoneMap[courseId]) ? customDoneMap[courseId].length : 0;
  };

  export const hasPassedLessonQuiz = (courseId: string, chIdx?: number): boolean => {
    if (typeof chIdx === "number") {
      return passedLessonQuizzes.has(`${courseId}:${chIdx}`) || isChapterDone(courseId, chIdx);
    }
    for (const key of passedLessonQuizzes) {
      if (key.startsWith(`${courseId}:`)) return true;
    }
    return getCompletedLessonCountForCourse(courseId) > 0;
  };

  const recordLessonQuizPassed = (courseId: string, chIdx: number): void => {
    passedLessonQuizzes.add(`${courseId}:${chIdx}`);
    LearningHausAccountStorage.writeJson(PASSED_LESSON_QUIZ_KEY, Array.from(passedLessonQuizzes));
  };

  export const getAchievementMetricsOverlay = (): {
    extraLessons: number;
    extraCourses: number;
    extraQuizzes: number;
    subjectsCount: number;
    creator: {
      available: boolean;
      publishedCourses: number;
      createdLessons: number;
      assignedQuests: number;
      completedStudents: number;
    };
  } => {
    const allCourses = getAllCombined();
    let extraLessons = 0;
    let extraCourses = 0;
    const subjects = new Set<string>();

    allCourses.forEach((course) => {
      const doneArr = Array.isArray(customDoneMap[course.id]) ? customDoneMap[course.id] : [];
      if (course.id !== "eu-ai-act") {
        extraLessons += doneArr.length;
        if (course.chapters.length > 0 && doneArr.length >= course.chapters.length) {
          extraCourses += 1;
        }
        if (doneArr.length > 0) subjects.add(course.category || "other");
      } else if (doneArr.length > 0 || getCompletedLessonCountForCourse("eu-ai-act") > 0) {
        subjects.add(course.category || "law");
      }
    });

    const teaching = myClassesState.customClasses.filter((c) => c.isCustom && c.role === "teaching");
    const publishedCourses = teaching.length;
    const createdLessons = teaching.reduce((sum, c) => sum + (c.chapters?.length || 0), 0);
    const assignedQuests = teaching.reduce((sum, c) => sum + (Array.isArray(c.customQuests) ? c.customQuests.length : 0), 0);
    const completedStudents = teaching.reduce((sum, c) => sum + (Array.isArray(c.approvedLearners) ? c.approvedLearners.length : 0), 0);

    return {
      extraLessons,
      extraCourses,
      extraQuizzes: passedLessonQuizzes.size,
      subjectsCount: subjects.size,
      creator: {
        available: true,
        publishedCourses,
        createdLessons,
        assignedQuests,
        completedStudents
      }
    };
  };

  type ExpTierSpec = {
    value: number;
    unlocked: boolean;
    rankEn: string;
    rankTh: string;
    reqEn: string;
    reqTh: string;
  };

  const getCreatorExpPolicy = (course: CourseItem): {
    isLocked: boolean;
    maxExp: number;
    tiers: ExpTierSpec[];
    rankNameEn: string;
    rankNameTh: string;
    nextReqEn: string;
    nextReqTh: string;
  } => {
    if (course.requireApproval) {
      return {
        isLocked: true,
        maxExp: 0,
        tiers: [
          {
            value: 0,
            unlocked: true,
            rankEn: "Locked Class",
            rankTh: "ห้องล็อค",
            reqEn: "Require creator approval is enabled",
            reqTh: "เปิดล็อคห้องไว้"
          }
        ],
        rankNameEn: "Locked Class (0 EXP)",
        rankNameTh: "ห้องเรียนแบบล็อค (0 EXP)",
        nextReqEn: "Switch to a Public class (turn off approval) to grant Bonus EXP.",
        nextReqTh: "ห้องล็อค (ต้องรออนุมัติ) จะไม่ให้โบนัส EXP ต้องเปลี่ยนเป็นห้องสาธารณะจึงจะกำหนด EXP ได้"
      };
    }

    const m = getAchievementMetricsOverlay().creator;
    const tiers: ExpTierSpec[] = [
      {
        value: 40,
        unlocked: true,
        rankEn: "Starter Creator",
        rankTh: "ผู้สร้างเริ่มต้น",
        reqEn: "Available for all Public classes",
        reqTh: "เปิดใช้ได้ทันทีในห้องสาธารณะ"
      },
      {
        value: 80,
        unlocked: m.publishedCourses >= 1 || m.assignedQuests >= 2,
        rankEn: "First Class Creator",
        rankTh: "ยศผู้สร้างห้องเรียนแรก",
        reqEn: "Unlock 'First Class Creator' or 'Quest Designer' achievement",
        reqTh: "ปลดยศ 'ผู้สร้างห้องเรียนแรก' หรือ 'นักออกแบบเควสต์'"
      },
      {
        value: 120,
        unlocked: m.createdLessons >= 5,
        rankEn: "Lesson Maker",
        rankTh: "ยศผู้สร้าง 5 บทเรียน",
        reqEn: "Unlock 'Lesson Maker' achievement (5+ lessons)",
        reqTh: "ปลดยศ 'ผู้สร้างบทเรียน 5 บท' (Lesson Maker)"
      },
      {
        value: 160,
        unlocked: m.publishedCourses >= 3 || m.createdLessons >= 12,
        rankEn: "Course Architect",
        rankTh: "ยศสถาปนิก 3 ห้องเรียน",
        reqEn: "Unlock 'Course Architect' or 'Curriculum Builder' achievement",
        reqTh: "ปลดยศ 'สถาปนิก 3 ห้องเรียน' หรือ 'นักออกแบบ 12 บทเรียน'"
      },
      {
        value: 200,
        unlocked: m.completedStudents >= 10,
        rankEn: "Learning Mentor",
        rankTh: "ยศพี่เลี้ยงแห่งการเรียนรู้",
        reqEn: "Unlock 'Learning Mentor' achievement (10+ completions)",
        reqTh: "ปลดยศ 'พี่เลี้ยงแห่งการเรียนรู้' (ผู้เรียนจบ 10+ ครั้ง)"
      }
    ];

    const unlockedTiers = tiers.filter((item) => item.unlocked);
    const highest = unlockedTiers[unlockedTiers.length - 1] || tiers[0];
    const nextLocked = tiers.find((item) => !item.unlocked) || null;
    return {
      isLocked: false,
      maxExp: highest.value,
      tiers,
      rankNameEn: highest.rankEn,
      rankNameTh: highest.rankTh,
      nextReqEn: nextLocked ? `Next (+${nextLocked.value} EXP): ${nextLocked.reqEn}` : "All Creator EXP tiers unlocked!",
      nextReqTh: nextLocked ? `ขั้นถัดไป (+${nextLocked.value} EXP): ${nextLocked.reqTh}` : "ปลดล็อกโบนัส EXP สูงสุดครบทุกยศแล้ว!"
    };
  };

  const loadState = (): void => {
    const rawClasses = LearningHausAccountStorage.readJson<Partial<MyClassesState> | null>(MY_CLASSES_STORAGE_KEY, null);
    myClassesState = {
      joinedIds: Array.isArray(rawClasses?.joinedIds) ? rawClasses!.joinedIds.map(String) : [],
      removedDefaults: Array.isArray(rawClasses?.removedDefaults) ? rawClasses!.removedDefaults.map(String) : [],
      pendingJoinIds: Array.isArray(rawClasses?.pendingJoinIds) ? rawClasses!.pendingJoinIds.map(String) : [],
      courseQuestsByCourse:
        rawClasses?.courseQuestsByCourse && typeof rawClasses.courseQuestsByCourse === "object"
          ? rawClasses.courseQuestsByCourse
          : {},
      customClasses: Array.isArray(rawClasses?.customClasses)
        ? rawClasses!.customClasses
            .filter((c): c is CourseItem => Boolean(c && typeof c.id === "string" && typeof c.title === "string"))
            .map((c) => ({
              ...c,
              cardRatio: "3/4" as CardAspectRatio,
              cardWidth: 241,
              rewardPool: Array.isArray(c.rewardPool) && c.rewardPool.length >= 4 ? c.rewardPool : rollRewardPoolForSeed(c.id)
            }))
        : []
    };

    const rawPassedQuiz = LearningHausAccountStorage.readJson<string[]>(PASSED_LESSON_QUIZ_KEY, []);
    passedLessonQuizzes = new Set(Array.isArray(rawPassedQuiz) ? rawPassedQuiz.map(String) : []);

    const rawDone = LearningHausAccountStorage.readJson<Record<string, number[]> | null>(CUSTOM_DONE_STORAGE_KEY, null);
    customDoneMap = rawDone && typeof rawDone === "object" ? rawDone : {};

    const savedXpKeys = LearningHausAccountStorage.readJson<string[]>(AWARDED_XP_STORAGE_KEY, []);
    awardedXpKeys = new Set(Array.isArray(savedXpKeys) ? savedXpKeys.map(String) : []);

    const validIds = new Set(getAllCombined().map((c) => c.id));
    const savedFavs = LearningHausAccountStorage.readJson<string[]>(FAVORITES_STORAGE_KEY, []);
    favoriteIds = new Set(Array.isArray(savedFavs) ? savedFavs.filter((id) => typeof id === "string" && validIds.has(id)) : []);

    const savedSelected = LearningHausAccountStorage.readJson<string | null>(SELECTED_COURSE_STORAGE_KEY, null);
    selectedQuizCourseId = typeof savedSelected === "string" && validIds.has(savedSelected) ? savedSelected : null;
    if (selectedQuizCourseId) activeCourseId = selectedQuizCourseId;
  };

  const saveAwardedXp = (): void => {
    LearningHausAccountStorage.writeJson(AWARDED_XP_STORAGE_KEY, Array.from(awardedXpKeys));
  };

  export const getCompletedClassesCount = (): number => {
    let completed = 0;
    for (const course of getAllCombined()) {
      const prog = getCourseProgressInfo(course);
      if (prog.pct >= 100 && course.chapters.length > 0) completed += 1;
    }
    return completed;
  };

  export const syncCompletedClassesBadges = (): void => {
    const count = getCompletedClassesCount();
    document.querySelectorAll<HTMLElement>("[data-classes-completed-count]").forEach((el) => {
      el.textContent = String(count);
    });
  };

  const saveMyClasses = (): void => {
    LearningHausAccountStorage.writeJson(MY_CLASSES_STORAGE_KEY, myClassesState);
  };

  const saveCustomDone = (): void => {
    LearningHausAccountStorage.writeJson(CUSTOM_DONE_STORAGE_KEY, customDoneMap);
  };

  const saveFavorites = (): void => {
    LearningHausAccountStorage.writeJson(FAVORITES_STORAGE_KEY, Array.from(favoriteIds));
  };

  const persistSelectedCourse = (courseId: string | null): void => {
    selectedQuizCourseId = courseId;
    LearningHausAccountStorage.writeJson(SELECTED_COURSE_STORAGE_KEY, courseId);
  };

  const isChapterDone = (courseId: string, chIdx: number): boolean =>
    Array.isArray(customDoneMap[courseId]) && customDoneMap[courseId].includes(chIdx);

  const setChapterDone = (courseId: string, chIdx: number, done: boolean): { newlyDone: boolean; awardedExp: number; classBonus: boolean } => {
    const existing = new Set<number>(Array.isArray(customDoneMap[courseId]) ? customDoneMap[courseId] : []);
    const wasDone = existing.has(chIdx);
    if (done) existing.add(chIdx);
    else existing.delete(chIdx);
    customDoneMap[courseId] = Array.from(existing).sort((a, b) => a - b);
    saveCustomDone();
    let awardedExp = 0;
    let classBonus = false;
    if (done && !wasDone) {
      const lessonXpKey = `lesson:${courseId}:${chIdx}`;
      if (!awardedXpKeys.has(lessonXpKey)) {
        awardedXpKeys.add(lessonXpKey);
        awardedExp += EQUAL_LESSON_XP;
      }
      const course = getAllCombined().find((c) => c.id === courseId);
      if (course && course.chapters.length > 0 && existing.size >= course.chapters.length) {
        const classXpKey = `class:${courseId}`;
        if (!awardedXpKeys.has(classXpKey)) {
          awardedXpKeys.add(classXpKey);
          awardedExp += CLASS_COMPLETE_BONUS_XP;
          classBonus = true;
        }
      }
      if (awardedExp > 0) {
        saveAwardedXp();
        window.dispatchEvent(new CustomEvent("learninghaus:quiz-xp-awarded", { detail: { amount: awardedExp } }));
      }
      window.LearningHausQuests?.recordLessonActivity?.(courseId, chIdx + 1);
      window.dispatchEvent(new Event("learninghaus:stage-progress-updated"));
    }
    syncCompletedClassesBadges();
    return { newlyDone: done && !wasDone, awardedExp, classBonus };
  };

  const extractYoutubeId = (url?: string): string => {
    if (!url) return "";
    const m = url.trim().match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : "";
  };

  type RatioConfig = {
    kind: "portrait" | "landscape" | "square" | "classic";
    min: number;
    s: number;
    m: number;
    l: number;
    max: number;
    xRatios: readonly [number, number, number];
    yStep: number;
  };

  const RATIO_CONFIGS: Record<CardAspectRatio, RatioConfig> = {
    "3/4": {
      kind: "portrait",
      min: 180,
      s: 195,
      m: 241,
      l: 275,
      max: 280,
      // Exact EU AI Act cascade offsets: 106/355, 204/355, 293/355 -> stack width 412px at 241px!
      xRatios: [106 / 355, 204 / 355, 293 / 355],
      yStep: 24
    },
    "16/9": {
      kind: "landscape",
      min: 260,
      s: 310,
      m: 380,
      l: 430,
      max: 450,
      // Layered widescreen card deck: generous horizontal showcase + crisp staggered overlap
      xRatios: [0.135, 0.255, 0.36],
      yStep: 24
    },
    "1/1": {
      kind: "square",
      min: 200,
      s: 230,
      m: 280,
      l: 325,
      max: 340,
      xRatios: [0.21, 0.4, 0.56],
      yStep: 24
    },
    "4/3": {
      kind: "classic",
      min: 230,
      s: 270,
      m: 330,
      l: 380,
      max: 400,
      xRatios: [0.17, 0.32, 0.45],
      yStep: 24
    }
  };

  const getRatioConfig = (ratio?: CardAspectRatio): RatioConfig =>
    RATIO_CONFIGS[ratio || "3/4"] || RATIO_CONFIGS["3/4"];

  const clampWidthForRatio = (ratio: CardAspectRatio, width?: number): number => {
    const cfg = getRatioConfig(ratio);
    const val = Number(width);
    if (!Number.isFinite(val) || val <= 0) return cfg.m;
    return Math.max(cfg.min, Math.min(cfg.max, Math.round(val)));
  };

  const detectImageRatio = (w: number, h: number): CardAspectRatio => {
    if (!w || !h) return "3/4";
    const r = w / h;
    if (r >= 1.5) return "16/9";
    if (r >= 1.15) return "4/3";
    if (r >= 0.85) return "1/1";
    return "3/4";
  };

  const calcCardHeight = (width: number, ratio: CardAspectRatio): number => {
    if (ratio === "3/4") {
      // Exact EU AI Act card aspect ratio (355 x 544)
      return Math.round((width * 544) / 355);
    }
    const [w, h] = ratio.split("/").map(Number);
    return Math.round((width * (h || 4)) / (w || 3));
  };

  const getChapterCover = (course: CourseItem, ch: CourseChapter, _idx: number): string => {
    if (ch.cover) return ch.cover;
    if (course.image) return course.image;
    return "lesson-assets/covers/pixel-draft.png";
  };

  const canvaResolvedCache = new Map<string, string>();
  const canvaDirectUrlCache = new Map<string, string>();

  const normalizeCanvaUrlInput = (raw?: string): string => {
    const clean = (raw || "").trim();
    if (!clean) return "";
    return /^https?:\/\//i.test(clean) ? clean : /^([a-z0-9-]+\.)?canva\.(com|link|site)\//i.test(clean) ? `https://${clean}` : clean;
  };

  const toCanvaEmbedUrl = (raw?: string): string => {
    const clean = normalizeCanvaUrlInput(raw);
    if (!clean) return "";
    if (canvaResolvedCache.has(clean)) return canvaResolvedCache.get(clean) || "";
    try {
      const parsed = new URL(clean);
      const host = parsed.hostname.toLowerCase();
      if (!/^(?:[a-z0-9-]+\.)?canva\.com$/i.test(host)) return "";
      if (/^\/design\/[^/]+\/[^/]+\/?$/i.test(parsed.pathname)) {
        parsed.pathname = parsed.pathname.replace(/\/$/, "") + "/view";
      } else {
        parsed.pathname = parsed.pathname.replace(/\/(edit|watch|present)(\/.*)?$/i, "/view");
      }
      if (!parsed.searchParams.has("embed")) {
        parsed.searchParams.set("embed", "");
      }
      return parsed.toString().replace(/embed=(&|$)/, "embed$1");
    } catch {
      return "";
    }
  };

  const isCanvaShortUrl = (raw?: string): boolean => {
    const clean = normalizeCanvaUrlInput(raw);
    if (!clean) return false;
    try {
      const parsed = new URL(clean);
      return /^(?:[a-z0-9-]+\.)?canva\.(link|site)$/i.test(parsed.hostname.toLowerCase());
    } catch {
      return false;
    }
  };

  const resolveCanvaUrlAsync = async (raw?: string): Promise<{ resolvedUrl: string; embedUrl: string } | null> => {
    const clean = normalizeCanvaUrlInput(raw);
    if (!clean) return null;
    const directEmbed = toCanvaEmbedUrl(clean);
    if (directEmbed) {
      canvaResolvedCache.set(clean, directEmbed);
      canvaDirectUrlCache.set(clean, canvaDirectUrlCache.get(clean) || clean);
      return { resolvedUrl: canvaDirectUrlCache.get(clean) || clean, embedUrl: directEmbed };
    }
    if (!isCanvaShortUrl(clean)) return null;
    try {
      const res = await fetch(`/api/resolve-canva?url=${encodeURIComponent(clean)}`);
      const data = (await res.json()) as { ok?: boolean; resolvedUrl?: string; embedUrl?: string };
      if (!res.ok || !data?.ok || !data.embedUrl) return null;
      const finalResolved = data.resolvedUrl || clean;
      canvaResolvedCache.set(clean, data.embedUrl);
      canvaResolvedCache.set(finalResolved, data.embedUrl);
      canvaDirectUrlCache.set(clean, finalResolved);
      canvaDirectUrlCache.set(finalResolved, finalResolved);
      return { resolvedUrl: finalResolved, embedUrl: data.embedUrl };
    } catch {
      return null;
    }
  };

  const getCustomPointsSummary = (course: CourseItem): { earned: number; total: number; pct: number; doneCount: number } => {
    let total = 0;
    let earned = 0;
    let doneCount = 0;
    course.chapters.forEach((ch, idx) => {
      const pts = Math.max(10, Math.min(500, Number(ch.points) || 100));
      total += pts;
      if (isChapterDone(course.id, idx)) {
        earned += pts;
        doneCount += 1;
      }
    });
    const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
    return { earned, total, pct, doneCount };
  };

  const isInMyClasses = (courseId: string): boolean => {
    if (myClassesState.customClasses.some((c) => c.id === courseId)) return true;
    if (myClassesState.joinedIds.includes(courseId)) return true;
    const questEnrolled = window.LearningHausQuests?.getEnrolledCourseIds?.() || [];
    if (questEnrolled.includes(courseId)) return true;
    if (courseId === "eu-ai-act" && !myClassesState.removedDefaults.includes("eu-ai-act")) return true;
    return false;
  };

  export const getMyClasses = (): CourseItem[] => {
    const seen = new Set<string>();
    const list: CourseItem[] = [];
    for (const c of myClassesState.customClasses) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        list.push(c);
      }
    }
    for (const c of COURSES) {
      if (!seen.has(c.id) && isInMyClasses(c.id)) {
        seen.add(c.id);
        list.push(c);
      }
    }
    return list;
  };

  const addClassMembership = (courseId: string): void => {
    myClassesState.removedDefaults = myClassesState.removedDefaults.filter((id) => id !== courseId);
    if (!myClassesState.joinedIds.includes(courseId) && !myClassesState.customClasses.some((c) => c.id === courseId)) {
      myClassesState.joinedIds.push(courseId);
    }
    saveMyClasses();
    window.LearningHausQuests?.enroll?.(courseId);
    window.dispatchEvent(new CustomEvent("learninghaus:library-updated", { detail: { courseId } }));
  };

  const removeClassMembership = (courseId: string): void => {
    const isCustom = myClassesState.customClasses.some((c) => c.id === courseId);
    if (isCustom) {
      myClassesState.customClasses = myClassesState.customClasses.filter((c) => c.id !== courseId);
    } else {
      myClassesState.joinedIds = myClassesState.joinedIds.filter((id) => id !== courseId);
      if (courseId === "eu-ai-act" && !myClassesState.removedDefaults.includes("eu-ai-act")) {
        myClassesState.removedDefaults.push("eu-ai-act");
      }
    }
    saveMyClasses();
    window.LearningHausQuests?.unenroll?.(courseId);
    if (activeCourseId === courseId) {
      const remaining = getMyClasses();
      activeCourseId = remaining[0]?.id || "eu-ai-act";
    }
    window.dispatchEvent(new CustomEvent("learninghaus:library-updated", { detail: { courseId } }));
  };

  const generateClassCode = (): string => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const existing = new Set(getAllCombined().map((c) => c.classCode.toUpperCase()));
    for (let attempt = 0; attempt < 25; attempt += 1) {
      let suffix = "";
      for (let i = 0; i < 4; i += 1) {
        suffix += chars[Math.floor(Math.random() * chars.length)];
      }
      const code = `LH-${suffix}`;
      if (!existing.has(code)) return code;
    }
    return `LH-${Date.now().toString(36).slice(-4).toUpperCase()}`;
  };

  const getCurrentProfileName = (): string => {
    const nameEl = document.querySelector<HTMLElement>('[data-profile-value="name"]');
    const raw = nameEl?.textContent?.trim();
    return raw || t("You", "คุณ");
  };

  const loadYouTubeIframeApi = (onReady: () => void): void => {
    const win = window as unknown as {
      YT?: { Player?: new (el: HTMLElement | string, opts: Record<string, unknown>) => { destroy?: () => void } };
      onYouTubeIframeAPIReady?: () => void;
      __lhYtCallbacks?: Array<() => void>;
    };
    if (win.YT?.Player) {
      onReady();
      return;
    }
    win.__lhYtCallbacks = win.__lhYtCallbacks || [];
    win.__lhYtCallbacks.push(onReady);
    if (!document.getElementById("lh-youtube-iframe-api")) {
      const prevReady = win.onYouTubeIframeAPIReady;
      win.onYouTubeIframeAPIReady = () => {
        prevReady?.();
        const cbs = win.__lhYtCallbacks || [];
        win.__lhYtCallbacks = [];
        cbs.forEach((fn) => fn());
      };
      const tag = document.createElement("script");
      tag.id = "lh-youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }
  };

  export const attachSmoothCardDrag = (
    stackEl: HTMLElement,
    options: {
      cardSelector: string;
      onStep: (delta: 1 | -1, swipedCard?: HTMLElement | null) => void;
    }
  ): void => {
    if (stackEl.dataset.smoothDragBound === "1") return;
    stackEl.dataset.smoothDragBound = "1";

    let pointerId: number | null = null;
    let activeCard: HTMLElement | null = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocityX = 0;
    let currentDx = 0;
    let moved = false;
    let rafId = 0;
    let scaleFactor = 1;

    const getVisualScale = (): number => {
      const rect = stackEl.getBoundingClientRect();
      const layoutW = stackEl.offsetWidth || 1;
      const ratio = rect.width / layoutW;
      return ratio > 0.2 ? ratio : 1;
    };

    const applyDragFrame = (): void => {
      rafId = 0;
      if (!activeCard) return;
      const localDx = currentDx / scaleFactor;
      const clampedDx = localDx > 0 ? localDx * 0.48 : localDx;
      const dragY = Math.abs(clampedDx) * 0.065;
      const dragRot = Math.max(-16, Math.min(14, clampedDx * 0.048));
      const progress = clampedDx < 0 ? Math.min(1, Math.abs(clampedDx) / 145) : 0;

      activeCard.style.setProperty("--drag-x", `${clampedDx.toFixed(1)}px`);
      activeCard.style.setProperty("--drag-y", `${dragY.toFixed(1)}px`);
      activeCard.style.setProperty("--drag-rot", `${dragRot.toFixed(2)}deg`);
      stackEl.style.setProperty("--drag-p", progress.toFixed(3));
    };

    const resetDragVars = (card: HTMLElement | null): void => {
      stackEl.classList.remove("is-dragging");
      stackEl.style.setProperty("--drag-p", "0");
      if (card) {
        card.style.removeProperty("--drag-x");
        card.style.removeProperty("--drag-y");
        card.style.removeProperty("--drag-rot");
      }
    };

    stackEl.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });

    stackEl.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      const target = event.target as HTMLElement | null;
      const frontCard = target?.closest<HTMLElement>(`${options.cardSelector}.is-active`);
      if (!frontCard) return;

      pointerId = event.pointerId;
      activeCard = frontCard;
      startX = event.clientX;
      startY = event.clientY;
      lastX = event.clientX;
      lastTime = performance.now();
      velocityX = 0;
      currentDx = 0;
      moved = false;
      scaleFactor = getVisualScale();

      frontCard.classList.remove("is-spring-back", "is-swiping-left");
      try {
        stackEl.setPointerCapture(pointerId);
      } catch {
        // ignore synthetic pointer events
      }
    });

    stackEl.addEventListener("pointermove", (event) => {
      if (pointerId === null || event.pointerId !== pointerId || !activeCard) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!moved) {
        if (Math.hypot(dx, dy) < 6) return;
        if (Math.abs(dy) > Math.abs(dx) * 1.35) {
          // Vertical scroll intent
          pointerId = null;
          activeCard = null;
          return;
        }
        moved = true;
        stackEl.classList.add("is-dragging");
      }

      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      velocityX = (event.clientX - lastX) / dt;
      lastX = event.clientX;
      lastTime = now;
      currentDx = dx;

      if (!rafId) {
        rafId = window.requestAnimationFrame(applyDragFrame);
      }
    });

    const finishDrag = (event: PointerEvent, cancelled: boolean): void => {
      if (pointerId === null || event.pointerId !== pointerId) return;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      try {
        if (stackEl.hasPointerCapture(pointerId)) stackEl.releasePointerCapture(pointerId);
      } catch {
        // ignore
      }

      const card = activeCard;
      const visualDx = currentDx;
      const vx = velocityX;
      const didMove = moved;

      pointerId = null;
      activeCard = null;
      moved = false;

      if (!didMove) {
        resetDragVars(card);
        return;
      }

      stackEl.dataset.justDragged = "1";
      window.setTimeout(() => {
        delete stackEl.dataset.justDragged;
      }, 90);

      const swipeLeft = !cancelled && (visualDx < -52 || (vx < -0.35 && visualDx < -18));
      const swipeRight = !cancelled && (visualDx > 52 || (vx > 0.35 && visualDx > 18));

      resetDragVars(card);

      if (swipeLeft && card) {
        card.classList.add("is-swiping-left");
        options.onStep(1, card);
        window.setTimeout(() => {
          card.classList.remove("is-swiping-left");
        }, 300);
      } else if (swipeRight && card) {
        options.onStep(-1, card);
      } else if (card) {
        card.classList.add("is-spring-back");
        window.setTimeout(() => {
          card.classList.remove("is-spring-back");
        }, 320);
      }
    };

    stackEl.addEventListener("pointerup", (event) => finishDrag(event, false));
    stackEl.addEventListener("pointercancel", (event) => finishDrag(event, true));
  };

  export const isFavoriteCourse = (courseId: string): boolean => favoriteIds.has(courseId);
  export const hasSelectedCourse = (): boolean => Boolean(selectedQuizCourseId);
  export const getSelectedCourseId = (): string | null => selectedQuizCourseId;
  export const getAllCourses = (): readonly CourseItem[] => getAllCombined();
  export const getFavoriteCourseIds = (): string[] => Array.from(favoriteIds);
  export const getLibraryCourses = (): (CourseItem & { isFavorite: boolean; isEnrolled: boolean })[] => {
    const myClassIds = new Set(getMyClasses().map((c) => c.id));
    const items = getAllCombined()
      .filter((c) => myClassIds.has(c.id) || favoriteIds.has(c.id))
      .map((c) => ({
        ...c,
        isFavorite: favoriteIds.has(c.id),
        isEnrolled: myClassIds.has(c.id)
      }));
    if (items.length === 0) {
      return [{ ...COURSES[0], isFavorite: false, isEnrolled: true }];
    }
    return items;
  };

  export const setActiveCourse = (courseId: string): void => {
    const match = getAllCombined().find((c) => c.id === courseId);
    if (!match) return;
    activeCourseId = match.id;
    persistSelectedCourse(match.id);
    window.dispatchEvent(new CustomEvent("learninghaus:active-course-changed", { detail: { courseId: activeCourseId } }));
  };

  export const enterCourseQuiz = (courseId?: string): void => {
    const targetId = courseId || activeCourseId;
    setActiveCourse(targetId);
    addClassMembership(activeCourseId);
    LearningHausCustomQuizStudio.stopThemeBgm();
    window.dispatchEvent(new Event("learninghaus:open-quiz"));
  };

  export const showHub = (): void => {
    setSubviewFn?.("classes");
  };

  export const showExplore = (): void => {
    setSubviewFn?.("explore");
  };

  export const showDeck = (courseId?: string): void => {
    setActiveCourse(courseId || activeCourseId);
    customSelectedChIdx = 0;
    addClassMembership(activeCourseId);
    setSubviewFn?.("deck");
  };

  export const getActiveCourseId = (): string => activeCourseId;
  export const getActiveCourse = (): CourseItem =>
    getAllCombined().find((c) => c.id === activeCourseId) || COURSES[0];

  export const joinClassByCode = (rawCode: string): { ok: boolean; alreadyJoined?: boolean; course?: CourseItem; message: string } => {
    const code = rawCode.trim().toUpperCase().replace(/\s+/g, "");
    if (code.length < 4) {
      return {
        ok: false,
        message: t("Please enter a valid Class Code (at least 4 characters).", "กรุณากรอกรหัสห้องเรียนอย่างน้อย 4 ตัวอักษร")
      };
    }

    const existing = getAllCombined().find((c) => c.classCode.toUpperCase() === code);
    if (existing) {
      if (isInMyClasses(existing.id)) {
        return {
          ok: true,
          alreadyJoined: true,
          course: existing,
          message: t(`"${existing.title}" is already in My Classes.`, `ห้องเรียน "${existing.title}" อยู่ในห้องเรียนของฉันแล้ว`)
        };
      }
      if (existing.requireApproval && existing.role !== "teaching") {
        const list = Array.isArray(existing.pendingRequests) ? existing.pendingRequests : [];
        const learnerName = getCurrentProfileName();
        let createdReq = list.find((r) => r.learnerName === learnerName);
        if (!createdReq) {
          createdReq = { id: `req-${Date.now().toString(36)}`, learnerName, requestedAt: new Date().toISOString() };
          list.push(createdReq);
          existing.pendingRequests = list;
        }
        const pendingIds = Array.isArray(myClassesState.pendingJoinIds) ? myClassesState.pendingJoinIds : [];
        if (!pendingIds.includes(existing.id)) pendingIds.push(existing.id);
        myClassesState.pendingJoinIds = pendingIds;
        saveMyClasses();
        window.dispatchEvent(
          new CustomEvent("learninghaus:notify", {
            detail: {
              kind: "class_join_request",
              important: true,
              titleEn: `Join request: ${existing.title}`,
              titleTh: `คำขอเข้าห้องเรียน: ${existing.title}`,
              bodyEn: `${learnerName} requested to join using code ${existing.classCode}.`,
              bodyTh: `${learnerName} ขอเข้าร่วมห้องเรียนด้วยรหัส ${existing.classCode}`,
              meta: {
                courseId: existing.id,
                courseTitle: existing.title,
                classCode: existing.classCode,
                requestId: createdReq.id,
                learnerName
              }
            }
          })
        );
        window.dispatchEvent(new CustomEvent("learninghaus:class-requests-changed", { detail: { courseId: existing.id } }));
        return {
          ok: true,
          course: existing,
          message: t(
            `Join request sent for "${existing.title}". Waiting for creator approval.`,
            `ส่งคำขอเข้าร่วม "${existing.title}" แล้ว กรุณารอผู้สร้างห้องเรียนอนุมัติ`
          )
        };
      }
      addClassMembership(existing.id);
      window.dispatchEvent(
        new CustomEvent("learninghaus:notify", {
          detail: {
            kind: "class_member_joined",
            important: false,
            titleEn: `Joined "${existing.title}"`,
            titleTh: `เข้าห้องเรียน "${existing.title}" แล้ว`,
            bodyEn: `You are now enrolled in ${existing.title} (${existing.classCode}).`,
            bodyTh: `คุณเข้าร่วมห้องเรียน ${existing.title} (${existing.classCode}) เรียบร้อยแล้ว`,
            meta: { courseId: existing.id, courseTitle: existing.title, classCode: existing.classCode }
          }
        })
      );
      return {
        ok: true,
        course: existing,
        message: t(`Joined "${existing.title}"!`, `เข้าร่วมห้องเรียน "${existing.title}" สำเร็จ`)
      };
    }

    if (!/^[A-Z0-9-]{4,24}$/.test(code)) {
      return {
        ok: false,
        message: t("Use letters, numbers, or hyphens only (e.g. EUAI-2026 or P-XXXXX).", "ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข และขีดกลาง (เช่น EUAI-2026 หรือ P-XXXXX)")
      };
    }

    return {
      ok: false,
      message: t(
        `Code "${code}" was not found. Make sure the class or Party Arena room has been created.`,
        `ไม่พบรหัส "${code}" ในระบบ กรุณาตรวจสอบว่ามีผู้สร้างห้องเรียนหรือห้องปาร์ตี้นี้แล้ว`
      )
    };
  };

  export type PendingJoinRequestEntry = {
    courseId: string;
    courseTitle: string;
    classCode: string;
    req: JoinRequest;
  };

  export const getPendingJoinRequests = (): PendingJoinRequestEntry[] => {
    const out: PendingJoinRequestEntry[] = [];
    getAllCombined().forEach((course) => {
      if (!Array.isArray(course.pendingRequests) || !course.pendingRequests.length) return;
      course.pendingRequests.forEach((req) => {
        out.push({
          courseId: course.id,
          courseTitle: course.title,
          classCode: course.classCode,
          req
        });
      });
    });
    return out;
  };

  export const getTeachingCourses = (): CourseItem[] =>
    getAllCombined().filter((c) => c.isCustom && c.role === "teaching");

  export const approveJoinRequest = (
    courseId: string,
    requestId: string
  ): { ok: boolean; learnerName?: string; courseTitle?: string } => {
    const course = getAllCombined().find((c) => c.id === courseId);
    if (!course) return { ok: false };
    const req = (course.pendingRequests || []).find((r) => r.id === requestId);
    if (!req) return { ok: false };
    course.pendingRequests = (course.pendingRequests || []).filter((r) => r.id !== requestId);
    course.approvedLearners = [...(course.approvedLearners || []), req.learnerName];
    myClassesState.pendingJoinIds = (myClassesState.pendingJoinIds || []).filter((id) => id !== course.id);
    if (req.learnerName === getCurrentProfileName()) {
      addClassMembership(course.id);
    }
    saveMyClasses();
    window.dispatchEvent(
      new CustomEvent("learninghaus:class-requests-changed", {
        detail: { courseId: course.id, requestId, action: "approved", learnerName: req.learnerName }
      })
    );
    window.dispatchEvent(
      new CustomEvent("learninghaus:notify", {
        detail: {
          kind: "class_member_joined",
          important: false,
          titleEn: `New member in "${course.title}"`,
          titleTh: `สมาชิกใหม่เข้าห้อง "${course.title}"`,
          bodyEn: `${req.learnerName} was approved and joined your class (${course.classCode}).`,
          bodyTh: `อนุมัติ ${req.learnerName} เข้าห้องเรียนของคุณแล้ว (${course.classCode})`,
          meta: { courseId: course.id, courseTitle: course.title, classCode: course.classCode, learnerName: req.learnerName }
        }
      })
    );
    return { ok: true, learnerName: req.learnerName, courseTitle: course.title };
  };

  export const declineJoinRequest = (
    courseId: string,
    requestId: string
  ): { ok: boolean; learnerName?: string; courseTitle?: string } => {
    const course = getAllCombined().find((c) => c.id === courseId);
    if (!course) return { ok: false };
    const req = (course.pendingRequests || []).find((r) => r.id === requestId);
    if (!req) return { ok: false };
    course.pendingRequests = (course.pendingRequests || []).filter((r) => r.id !== requestId);
    saveMyClasses();
    window.dispatchEvent(
      new CustomEvent("learninghaus:class-requests-changed", {
        detail: { courseId: course.id, requestId, action: "declined", learnerName: req.learnerName }
      })
    );
    return { ok: true, learnerName: req.learnerName, courseTitle: course.title };
  };

  const SAMPLE_LEARNERS = ["NekoNova", "SakuraPaws", "PixelPaws", "LawWhisker", "MochiSpark", "KitsuneDev"];

  export const addSampleJoinRequest = (courseId?: string): PendingJoinRequestEntry | null => {
    const target =
      (courseId ? getAllCombined().find((c) => c.id === courseId) : null) ||
      getTeachingCourses()[0] ||
      getAllCombined()[0];
    if (!target) return null;
    const list = Array.isArray(target.pendingRequests) ? target.pendingRequests : [];
    const pick = SAMPLE_LEARNERS[(list.length + Math.floor(Date.now() / 1000)) % SAMPLE_LEARNERS.length];
    const req: JoinRequest = {
      id: `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      learnerName: pick,
      requestedAt: new Date().toISOString()
    };
    list.push(req);
    target.pendingRequests = list;
    target.requireApproval = true;
    saveMyClasses();
    window.dispatchEvent(
      new CustomEvent("learninghaus:notify", {
        detail: {
          kind: "class_join_request",
          important: true,
          titleEn: `${pick} requested to join`,
          titleTh: `${pick} ขอเข้าร่วมห้องเรียน`,
          bodyEn: `Wants to enter "${target.title}" (${target.classCode}). Approve or decline below.`,
          bodyTh: `ขอเข้าห้องเรียน "${target.title}" (${target.classCode}) สามารถกดอนุมัติได้ทันที`,
          meta: {
            courseId: target.id,
            courseTitle: target.title,
            classCode: target.classCode,
            requestId: req.id,
            learnerName: pick
          }
        }
      })
    );
    window.dispatchEvent(
      new CustomEvent("learninghaus:class-requests-changed", {
        detail: { courseId: target.id, requestId: req.id, action: "added" }
      })
    );
    return { courseId: target.id, courseTitle: target.title, classCode: target.classCode, req };
  };

  export const simulateMemberJoined = (courseId?: string): void => {
    const target =
      (courseId ? getAllCombined().find((c) => c.id === courseId) : null) ||
      getTeachingCourses()[0] ||
      getAllCombined()[0];
    if (!target) return;
    const pick = SAMPLE_LEARNERS[Math.floor(Date.now() / 1000) % SAMPLE_LEARNERS.length];
    target.approvedLearners = [...(target.approvedLearners || []), pick];
    saveMyClasses();
    window.dispatchEvent(
      new CustomEvent("learninghaus:notify", {
        detail: {
          kind: "class_member_joined",
          important: false,
          titleEn: `${pick} joined your class`,
          titleTh: `${pick} เข้าห้องเรียนของคุณแล้ว`,
          bodyEn: `Entered "${target.title}" (${target.classCode}) via Class Code.`,
          bodyTh: `เข้าร่วมห้องเรียน "${target.title}" (${target.classCode}) ด้วยรหัสห้องเรียน`,
          meta: { courseId: target.id, courseTitle: target.title, classCode: target.classCode, learnerName: pick }
        }
      })
    );
  };

  const catLabel = (c: CourseItem): string => t(c.categoryEn, c.categoryTh);
  const descText = (c: CourseItem): string => t(c.descriptionEn, c.descriptionTh);
  const lessonCountText = (n: number): string => t(`${n} ${n === 1 ? "Lesson" : "Lessons"}`, `${n} บทเรียน`);

  const getCourseProgressInfo = (course: CourseItem): { pct: number; completedLessons: number; nextLabel: string } => {
    const totalChapters = Math.max(1, course.chapters.length);
    if (course.id === "eu-ai-act" && window.LearningHausQuiz?.getProgress) {
      const progress = window.LearningHausQuiz.getProgress();
      const chCount = Math.min(LearningHausRules.quiz.chapterCount, totalChapters);
      const stagesPerCh = LearningHausRules.quiz.stagesPerChapter;
      const totalStages = chCount * stagesPerCh;
      let cleared = 0;
      let completedChapters = 0;
      let firstIncompleteIdx = -1;
      for (let ch = 1; ch <= chCount; ch += 1) {
        const entry = progress?.chapters?.find((item) => item.chapter === ch);
        const firstStageIndex = (ch - 1) * stagesPerCh;
        const highestPassed = entry ? entry.highestPassed : -1;
        const chCleared =
          highestPassed >= firstStageIndex
            ? Math.min(stagesPerCh, highestPassed - firstStageIndex + 1)
            : 0;
        cleared += chCleared;
        if (chCleared >= stagesPerCh) completedChapters += 1;
        else if (firstIncompleteIdx === -1) firstIncompleteIdx = ch - 1;
      }
      const pct = totalStages > 0 ? Math.round((cleared / totalStages) * 100) : 0;
      if (pct >= 100) {
        return {
          pct: 100,
          completedLessons: chCount,
          nextLabel: t("All chapters completed!", "เรียนครบทุกบทเรียนแล้ว!")
        };
      }
      const nextCh = course.chapters[Math.max(0, firstIncompleteIdx)];
      const nextNum = Math.max(0, firstIncompleteIdx) + 1;
      return {
        pct,
        completedLessons: completedChapters,
        nextLabel: `${t("Up next", "บทถัดไป")}: Ch.${nextNum} · ${nextCh?.title || ""}`
      };
    }

    const pts = getCustomPointsSummary(course);
    const nextIdx = course.chapters.findIndex((_, idx) => !isChapterDone(course.id, idx));
    if (course.role === "teaching" && pts.doneCount === 0) {
      const pendingCount = Array.isArray(course.pendingRequests) ? course.pendingRequests.length : 0;
      return {
        pct: 0,
        completedLessons: 0,
        nextLabel:
          pendingCount > 0
            ? t(`${pendingCount} pending join ${pendingCount === 1 ? "request" : "requests"} · Code ${course.classCode}`, `มีคำขอเข้าห้องรออนุมัติ ${pendingCount} รายการ · รหัส ${course.classCode}`)
            : t(`Instructor ready · Share code ${course.classCode}`, `พร้อมสอนแล้ว · แชร์รหัส ${course.classCode}`)
      };
    }
    if (nextIdx === -1 && course.chapters.length > 0) {
      return {
        pct: 100,
        completedLessons: totalChapters,
        nextLabel: t(`Class completed! (${pts.doneCount}/${totalChapters} lessons)`, `เรียนจบคลาสนี้แล้ว! (${pts.doneCount}/${totalChapters} บทเรียน)`)
      };
    }
    if (pts.doneCount > 0) {
      return {
        pct: pts.pct,
        completedLessons: pts.doneCount,
        nextLabel: `${t("Up next", "บทถัดไป")}: Ch.${nextIdx + 1} · ${course.chapters[nextIdx]?.title || ""}`
      };
    }

    const firstTitle = course.chapters[0]?.title || t("Chapter 1", "บทที่ 1");
    return {
      pct: 0,
      completedLessons: 0,
      nextLabel: `${t("Ready to start", "พร้อมเริ่มเรียน")}: Ch.1 · ${firstTitle}`
    };
  };

  const renderCoverMarkup = (course: CourseItem): string => {
    if (course.image) {
      return `<img src="${escHtml(course.image)}" alt="${escHtml(course.title)}">`;
    }
    const glyph = SVG_ICONS[course.iconName] || SVG_ICONS.book;
    return `
      <div class="learn-hub__cover-art" style="background:${escHtml(course.gradient)};">
        <span class="learn-hub__cover-glyph">${glyph}</span>
        <small>${escHtml(catLabel(course))}</small>
        <strong>${escHtml(course.title)}</strong>
      </div>
    `;
  };

  const buildClassroomCardHtml = (course: CourseItem): string => {
    const isTeaching = course.role === "teaching";
    const prog = getCourseProgressInfo(course);
    const roleBadgeHtml = isTeaching
      ? `<span class="learn-class-badge learn-class-badge--teach">${t("Teaching", "ผู้สอน")}</span>`
      : `<span class="learn-class-badge">${escHtml(catLabel(course))}</span>`;

    const bannerBg = course.poster || course.image
      ? `background-image: linear-gradient(155deg, rgba(16, 40, 22, 0.72) 0%, rgba(25, 62, 33, 0.84) 100%), url('${escHtml(course.poster || course.image || "")}'); background-size: cover; background-position: center;`
      : `background: ${escHtml(course.gradient)};`;

    return `
      <article class="learn-class-card" data-class-id="${escHtml(course.id)}">
        <div class="learn-class-card__top" style="${bannerBg}" role="button" tabindex="0" data-open-deck="${escHtml(course.id)}" aria-label="${escHtml(t("Open class", "เข้าสู่ห้องเรียน"))} ${escHtml(course.title)}">
          <div class="learn-class-card__top-row">
            ${roleBadgeHtml}
            <span class="learn-class-card__count">${SVG_ICONS.book}<span>${lessonCountText(course.chapters.length)}</span></span>
          </div>
          <div class="learn-class-card__head-copy">
            <h3 class="learn-class-card__title">${escHtml(course.title)}</h3>
            <span class="learn-class-card__creator">${SVG_ICONS.user}<span>${escHtml(course.creator)}</span></span>
          </div>
        </div>
        <div class="learn-class-card__body" role="button" tabindex="0" data-open-deck="${escHtml(course.id)}">
          <p class="learn-class-card__next">${escHtml(prog.nextLabel)}</p>
          <div class="learn-class-card__prog">
            <div class="learn-class-card__prog-meta">
              <span>${t("Progress", "ความคืบหน้า")}</span>
              <strong>${prog.pct}%</strong>
            </div>
            <div class="learn-class-card__prog-bar" aria-hidden="true">
              <span style="width:${prog.pct}%"></span>
            </div>
          </div>
        </div>
        <div class="learn-class-card__foot">
          <button class="learn-code-btn" type="button" data-copy-code="${escHtml(course.classCode)}" title="${escHtml(t("Copy Class Code", "คัดลอกรหัสห้องเรียน"))}">
            ${SVG_ICONS.copy}
            <span>${escHtml(course.classCode)}</span>
          </button>
          <div class="learn-class-card__foot-right">
            ${
              isTeaching
                ? `<button class="learn-ghost-icon-btn learn-ghost-icon-btn--edit" type="button" data-edit-class="${escHtml(course.id)}" aria-label="${escHtml(t("Edit class design", "ออกแบบห้องเรียน"))}" title="${escHtml(t("Edit class design", "ออกแบบห้องเรียน"))}">${SVG_ICONS.pencil}</button>`
                : ""
            }
            <button class="learn-ghost-icon-btn" type="button" data-remove-class="${escHtml(course.id)}" aria-label="${escHtml(isTeaching ? t("Delete class", "ลบห้องเรียน") : t("Leave class", "ออกจากห้องเรียน"))}" title="${escHtml(isTeaching ? t("Delete class", "ลบห้องเรียน") : t("Leave class", "ออกจากห้องเรียน"))}">
              ${isTeaching ? SVG_ICONS.trash : SVG_ICONS.logOut}
            </button>
            <button class="learn-class-card__enter" type="button" data-open-deck="${escHtml(course.id)}">
              <span>${t("Enter", "เข้าเรียน")}</span>
              ${SVG_ICONS.arrowRight}
            </button>
          </div>
        </div>
      </article>
    `;
  };

  const buildExploreCardHtml = (course: CourseItem): string => {
    const saved = favoriteIds.has(course.id);
    const inClasses = isInMyClasses(course.id);
    const coverBg = course.poster || course.image
      ? `background-image: linear-gradient(180deg, rgba(14, 34, 19, 0.25) 0%, rgba(14, 34, 19, 0.72) 100%), url('${escHtml(course.poster || course.image || "")}'); background-size: cover; background-position: center;`
      : `background: ${escHtml(course.gradient)};`;

    return `
      <article class="learn-explore-card" data-explore-card="${escHtml(course.id)}">
        <div class="learn-explore-card__cover" style="${coverBg}" role="button" tabindex="0" data-open-course="${escHtml(course.id)}" aria-label="${escHtml(t("View details for", "ดูรายละเอียด"))} ${escHtml(course.title)}">
          <div class="learn-explore-card__cover-top">
            <span class="learn-explore-card__lesson-pill">${SVG_ICONS.book}<span>${lessonCountText(course.chapters.length)}</span></span>
            <button class="learn-explore-card__fav${saved ? " is-saved" : ""}" type="button" data-toggle-fav="${escHtml(course.id)}" aria-pressed="${saved}" aria-label="${escHtml(saved ? t("Remove from Favorites", "นำออกจากคลังโปรด") : t("Save to Favorites", "บันทึกไว้ในคลังโปรด"))}" title="${escHtml(saved ? t("Saved in Favorites", "อยู่ในคลังโปรดแล้ว") : t("Save to Favorites for later", "เก็บไว้ในคลังโปรดเพื่อดูทีหลัง"))}">
              ${saved ? SVG_ICONS.bookmarkFilled : SVG_ICONS.bookmark}
            </button>
          </div>
          ${!course.poster && !course.image ? `<span class="learn-explore-card__glyph">${SVG_ICONS[course.iconName] || SVG_ICONS.book}</span>` : ""}
        </div>
        <div class="learn-explore-card__body" role="button" tabindex="0" data-open-course="${escHtml(course.id)}">
          <div class="learn-explore-card__meta">
            <span class="learn-explore-card__cat">${escHtml(catLabel(course))}</span>
            <span class="learn-explore-card__code">${escHtml(course.classCode)}</span>
          </div>
          <h3 class="learn-explore-card__title">${escHtml(course.title)}</h3>
          <span class="learn-explore-card__creator">${SVG_ICONS.user}<span>${escHtml(course.creator)}</span></span>
          <p class="learn-explore-card__desc">${escHtml(descText(course))}</p>
        </div>
        <div class="learn-explore-card__foot">
          ${
            inClasses
              ? `<button class="learn-cr-btn learn-cr-btn--soft learn-explore-card__main-btn" type="button" data-open-deck="${escHtml(course.id)}">${SVG_ICONS.checkCircle}<span>${t("In My Classes · Open", "อยู่ในห้องแล้ว · เปิด")}</span></button>`
              : `<button class="learn-cr-btn learn-cr-btn--primary learn-explore-card__main-btn" type="button" data-add-to-classes="${escHtml(course.id)}">${SVG_ICONS.plus}<span>${t("Add to My Classes", "เพิ่มเข้าห้องเรียน")}</span></button>`
          }
          <button class="learn-cr-btn learn-explore-card__info-btn" type="button" data-open-course="${escHtml(course.id)}" title="${escHtml(t("Course Details", "รายละเอียดคอร์ส"))}" aria-label="${escHtml(t("Course Details", "รายละเอียดคอร์ส"))}">
            ${SVG_ICONS.info}
          </button>
        </div>
      </article>
    `;
  };

  const buildLessonSummaryBarHtml = (course: CourseItem): string => {
    const pts = getCustomPointsSummary(course);
    const totalCount = course.chapters.length;
    const doneCount = pts.doneCount;
    const remaining = Math.max(0, totalCount - doneCount);
    const earnedExp = doneCount * EQUAL_LESSON_XP + (doneCount >= totalCount && totalCount > 0 ? CLASS_COMPLETE_BONUS_XP : 0);
    return `
      <div class="learn-lesson-summary" aria-label="Lesson progress summary">
        <div class="learn-lesson-summary__stats">
          <div class="learn-lesson-summary__stat">
            <small>${t("Completed", "เรียนจบแล้ว")}</small>
            <strong>${doneCount} / ${totalCount}</strong>
          </div>
          <div class="learn-lesson-summary__stat">
            <small>${t("Remaining", "เหลืออีก")}</small>
            <strong>${remaining}</strong>
          </div>
          <div class="learn-lesson-summary__stat">
            <small>${t("Total Score", "คะแนนรวม")}</small>
            <strong>${pts.earned} / ${pts.total} pts</strong>
          </div>
          <div class="learn-lesson-summary__stat is-exp">
            <small>${t("Equal EXP", "แต้ม EXP ที่ได้")}</small>
            <strong>+${earnedExp} EXP</strong>
          </div>
        </div>
        <div class="learn-lesson-summary__bar-row">
          <span>${t("Class Progress", "ความคืบหน้าคลาสนี้")}</span>
          <b>${pts.pct}%</b>
        </div>
        <div class="learn-lesson-summary__bar"><span style="width:${pts.pct}%"></span></div>
      </div>
    `;
  };

  const buildCustomClassroomHtml = (course: CourseItem, selectedIdx: number, isPreview: boolean): string => {
    const layout: ClassLayoutStyle = course.layoutStyle || (course.isCustom ? "fan" : "list");
    const ratio: CardAspectRatio = "3/4";
    const cfg = getRatioConfig(ratio);
    const width = 241;
    const height = calcCardHeight(width, ratio);
    const pts = getCustomPointsSummary(course);
    const safeIdx = Math.max(0, Math.min(course.chapters.length - 1, selectedIdx));
    const activeCh = course.chapters[safeIdx] || course.chapters[0];

    const mediaBadge = (ch: CourseChapter): string => {
      if (ch.mediaType === "youtube") return "YouTube";
      if (ch.mediaType === "canva") return "Canva";
      if (ch.mediaType === "upload") return t("Slides / PDF", "สไลด์ / PDF");
      return t("Lesson", "บทเรียน");
    };

    if (layout === "fan") {
      const visibleSteps = Math.min(3, Math.max(0, course.chapters.length - 1));
      const x1 = Math.round(width * cfg.xRatios[0]);
      const x2 = Math.round(width * cfg.xRatios[1]);
      const x3 = Math.round(width * cfg.xRatios[2]);
      const maxX = visibleSteps === 0 ? 0 : visibleSteps === 1 ? x1 : visibleSteps === 2 ? x2 : x3;
      const rightInset = visibleSteps === 0 ? 0 : Math.round(width * (visibleSteps * 0.02));
      const yStep = ratio === "3/4" ? Math.round((height * 36) / 544) : cfg.yStep;
      const y0 = yStep * visibleSteps;
      const y1 = Math.max(0, yStep * (visibleSteps - 1));
      const y2 = Math.max(0, yStep * (visibleSteps - 2));
      const y3 = 0;
      const stackW =
        ratio === "3/4" && visibleSteps === 3
          ? Math.round((width * 606) / 355)
          : width + maxX - rightInset;
      const stackH = height + y0;
      const activeDone = isChapterDone(course.id, safeIdx);
      const activePts = Math.max(10, Math.min(500, Number(activeCh?.points) || 100));

      return `
        <div class="learn-eu-clone${isPreview ? " is-preview" : ""}" data-ratio-kind="${cfg.kind}">
          <p class="home-main__instruction">${t("<strong>Drag</strong> the card left or <strong>click</strong> to select your lesson.", "<strong>ลากการ์ดไปทางซ้าย</strong> หรือ <strong>คลิก</strong> เพื่อเลือกบทเรียน")}</p>
          <section
            class="learn-eu-stack"
            data-ratio-kind="${cfg.kind}"
            style="width:${stackW}px; height:${stackH}px; --eu-w:${width}px; --eu-h:${height}px; --eu-x1:${x1}px; --eu-x2:${x2}px; --eu-x3:${x3}px; --eu-y0:${y0}px; --eu-y1:${y1}px; --eu-y2:${y2}px; --eu-y3:${y3}px;"
            aria-label="Chapter selection"
          >
            ${course.chapters
              .map((ch, idx) => {
                const offset = (idx - safeIdx + course.chapters.length) % course.chapters.length;
                const stateClass =
                  offset === 0
                    ? "is-active"
                    : offset === 1
                      ? "is-next"
                      : offset === 2
                        ? "is-next-2"
                        : offset === 3
                          ? "is-next-3"
                          : "";
                const done = isChapterDone(course.id, idx);
                const cover = getChapterCover(course, ch, idx);
                return `
                  <button
                    type="button"
                    class="learn-eu-stack__card ${stateClass}"
                    ${isPreview ? `data-studio-pick-ch="${idx}"` : `data-custom-pick-ch="${idx}"`}
                    aria-label="Select Chapter ${idx + 1} - ${escHtml(ch.title)}"
                    aria-pressed="${offset === 0}"
                    tabindex="${offset < 4 ? 0 : -1}"
                  >
                    <img src="${escHtml(cover)}" alt="Chapter ${idx + 1} - ${escHtml(ch.title)} card">
                    ${done ? `<span class="learn-eu-stack__done">${SVG_ICONS.checkCircle}<span>${t("Done", "จบแล้ว")}</span></span>` : ""}
                  </button>
                `;
              })
              .join("")}
          </section>
          ${
            isPreview
              ? ""
              : `<button class="home-start learn-eu-clone__start" type="button" data-open-custom-lesson="${safeIdx}">${t("START", "เริ่มเรียน")}</button>`
          }
          <section class="home-progress learn-eu-clone__progress" aria-label="Chapter progress">
            <h1 class="home-progress__title">${t("Chapter", "บทที่")} ${safeIdx + 1} - ${escHtml(activeCh?.title || "")}</h1>
            <div class="home-progress__labels">
              <span>${t("Your score", "คะแนนของคุณ")} · ${activeDone ? activePts : 0}/${activePts} ${t("pts", "คะแนน")}</span>
              <span>${pts.pct} %</span>
            </div>
            <div class="home-progress__meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pts.pct}">
              <span style="width:${pts.pct}%"></span>
            </div>
          </section>
        </div>
      `;
    }

    if (layout === "grid") {
      return `
        <div class="learn-layout-wrap${isPreview ? " is-preview" : ""}">
          ${isPreview ? "" : buildLessonSummaryBarHtml(course)}
          <div class="${isPreview ? "learn-layout-preview-body" : "learn-layout-scroll"}">
            <div class="learn-cgrid learn-cgrid--4col" data-ratio-kind="${cfg.kind}">
              ${course.chapters
                .map((ch, idx) => {
                  const done = isChapterDone(course.id, idx);
                  const chPts = Math.max(10, Math.min(500, Number(ch.points) || 100));
                  const cover = getChapterCover(course, ch, idx);
                  return `
                    <article class="learn-cgrid__card" role="button" tabindex="0" ${isPreview ? `data-studio-pick-ch="${idx}"` : `data-open-custom-lesson="${idx}"`}>
                      <div class="learn-cgrid__media" style="aspect-ratio:3/4;">
                        <img src="${escHtml(cover)}" alt="${escHtml(ch.title)}">
                        <div class="learn-cgrid__badges">
                          <span class="learn-fan-pill${done ? " is-done" : ""}">${done ? t("Done", "จบแล้ว") : t(`Ch.${idx + 1}`, `บท ${idx + 1}`)}</span>
                          <span class="learn-fan-pill">${chPts} pts</span>
                        </div>
                      </div>
                      <div class="learn-cgrid__body">
                        <strong>Ch.${idx + 1} · ${escHtml(ch.title)}</strong>
                        <span>${escHtml(mediaBadge(ch))} · ${escHtml(t(ch.summaryEn, ch.summaryTh))}</span>
                      </div>
                    </article>
                  `;
                })
                .join("")}
            </div>
          </div>
        </div>
      `;
    }

    // List layout with pinned top lesson summary menu & independent smooth scrollable list
    return `
      <div class="learn-layout-wrap${isPreview ? " is-preview" : ""}">
        ${isPreview ? "" : buildLessonSummaryBarHtml(course)}
        <div class="${isPreview ? "learn-layout-preview-body" : "learn-layout-scroll"}">
          <div class="learn-custom-deck__list" data-ratio-kind="${cfg.kind}">
            ${course.chapters
              .map((ch, idx) => {
                const done = isChapterDone(course.id, idx);
                const chPts = Math.max(10, Math.min(500, Number(ch.points) || 100));
                const cover = getChapterCover(course, ch, idx);
                return `
                  <article class="learn-custom-deck__item">
                    <div class="learn-clist__thumb" data-ratio-kind="${cfg.kind}" style="aspect-ratio:3/4;">
                      <img src="${escHtml(cover)}" alt="${escHtml(ch.title)}">
                    </div>
                    <div class="learn-custom-deck__item-copy">
                      <strong>Chapter ${idx + 1} · ${escHtml(ch.title)}</strong>
                      <span>${escHtml(t(ch.summaryEn, ch.summaryTh))}</span>
                      <div class="learn-clist__meta">
                        <span class="learn-clist__tag">${chPts} pts</span>
                        <span class="learn-clist__tag">+${EQUAL_LESSON_XP} EXP</span>
                        <span class="learn-clist__tag">${escHtml(mediaBadge(ch))}</span>
                        ${done ? `<span class="learn-clist__tag is-done">${t("Completed", "เรียนจบแล้ว")}</span>` : ""}
                      </div>
                    </div>
                    ${
                      isPreview
                        ? ""
                        : `<button class="learn-hub__btn-soft" type="button" data-open-custom-lesson="${idx}">${t("Open Lesson", "เปิดบทเรียน")} ${SVG_ICONS.arrowRight}</button>`
                    }
                  </article>
                `;
              })
              .join("")}
          </div>
        </div>
      </div>
    `;
  };

  const compressCoverDataUrl = (img: HTMLImageElement): string => {
    const maxDim = 840;
    let w = img.naturalWidth || img.width;
    let h = img.naturalHeight || img.height;
    if (w > maxDim || h > maxDim) {
      const scale = maxDim / Math.max(w, h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return img.src;
    ctx.drawImage(img, 0, 0, w, h);
    try {
      return canvas.toDataURL("image/webp", 0.82);
    } catch {
      return canvas.toDataURL("image/jpeg", 0.82);
    }
  };

  const init = (): void => {
    const homeView = document.getElementById("home-view");
    const learnPanel = homeView?.querySelector<HTMLElement>('[data-home-panel="learn"]');
    const classesEl = learnPanel?.querySelector<HTMLElement>("[data-learn-classes]");
    const classesGridHost = classesEl?.querySelector<HTMLElement>("[data-learn-classes-grid]");
    const plusToggleBtn = classesEl?.querySelector<HTMLButtonElement>("[data-learn-toggle-plus]");
    const plusMenu = classesEl?.querySelector<HTMLElement>("[data-learn-plus-menu]");

    const hubEl = learnPanel?.querySelector<HTMLElement>("[data-learn-hub]");
    const deckEl = learnPanel?.querySelector<HTMLElement>("[data-learn-deck]");
    const studioEl = learnPanel?.querySelector<HTMLElement>("[data-learn-studio]");
    const catalogHost = hubEl?.querySelector<HTMLElement>("[data-learn-catalog]");
    const searchInput = hubEl?.querySelector<HTMLInputElement>("[data-learn-search]");
    const searchClear = hubEl?.querySelector<HTMLButtonElement>("[data-learn-search-clear]");
    const favCountEl = hubEl?.querySelector<HTMLElement>("[data-learn-fav-count]");

    const backHubBtn = deckEl?.querySelector<HTMLButtonElement>("[data-learn-back-hub]");
    const deckCoursePill = deckEl?.querySelector<HTMLElement>("[data-learn-deck-course-pill]");
    const deckRequestsBtn = deckEl?.querySelector<HTMLButtonElement>("[data-learn-deck-requests]");
    const deckRequestsLabel = deckEl?.querySelector<HTMLElement>("[data-learn-deck-requests-label]");
    const deckEditBtn = deckEl?.querySelector<HTMLButtonElement>("[data-learn-deck-edit]");
    const deckCodeBtn = deckEl?.querySelector<HTMLButtonElement>("[data-learn-deck-code]");
    const deckFavBtn = deckEl?.querySelector<HTMLButtonElement>("[data-learn-deck-fav]");
    const deckEuDeckWrap = deckEl?.querySelector<HTMLElement>("[data-learn-eu-deck]");
    const deckCustomWrap = deckEl?.querySelector<HTMLElement>("[data-learn-custom-deck]");

    // Studio elements
    const studioTitleEl = studioEl?.querySelector<HTMLElement>("[data-studio-title]");
    const studioCodeBtn = studioEl?.querySelector<HTMLButtonElement>("[data-studio-code]");
    const studioApprovalToggle = studioEl?.querySelector<HTMLInputElement>("[data-studio-require-approval]");
    const studioPreviewHost = studioEl?.querySelector<HTMLElement>("[data-studio-preview]");
    const studioChStrip = studioEl?.querySelector<HTMLElement>("[data-studio-ch-strip]");
    const studioDelChBtn = studioEl?.querySelector<HTMLButtonElement>("[data-studio-del-ch]");
    const studioCoverPreview = studioEl?.querySelector<HTMLElement>("[data-studio-cover-preview]");
    const studioImgInput = studioEl?.querySelector<HTMLInputElement>("[data-studio-img-input]");
    const studioImgErr = studioEl?.querySelector<HTMLElement>("[data-studio-img-err]");
    const studioRatioTip = studioEl?.querySelector<HTMLElement>("[data-studio-ratio-tip]");
    const studioChTitleInput = studioEl?.querySelector<HTMLInputElement>("[data-studio-ch-title]");
    const studioChPtsInput = studioEl?.querySelector<HTMLInputElement>("[data-studio-ch-pts]");
    const studioChDescInput = studioEl?.querySelector<HTMLInputElement>("[data-studio-ch-desc]");
    const studioYtWrap = studioEl?.querySelector<HTMLElement>("[data-studio-yt-wrap]");
    const studioYtInput = studioEl?.querySelector<HTMLInputElement>("[data-studio-yt-url]");
    const studioVidWrap = studioEl?.querySelector<HTMLElement>("[data-studio-vid-wrap]");
    const studioVidInput = studioEl?.querySelector<HTMLInputElement>("[data-studio-vid-input]");
    const studioVidName = studioEl?.querySelector<HTMLElement>("[data-studio-vid-name]");
    const studioVidErr = studioEl?.querySelector<HTMLElement>("[data-studio-vid-err]");
    const studioCanvaWrap = studioEl?.querySelector<HTMLElement>("[data-studio-canva-wrap]");
    const studioCanvaInput = studioEl?.querySelector<HTMLInputElement>("[data-studio-canva-url]");
    const studioReadingWrap = studioEl?.querySelector<HTMLElement>("[data-studio-reading-wrap]");
    const studioReadingBody = studioEl?.querySelector<HTMLTextAreaElement>("[data-studio-reading-body]");
    const studioQuizEnabled = studioEl?.querySelector<HTMLInputElement>("[data-studio-quiz-enabled]");
    const studioQuizFields = studioEl?.querySelector<HTMLElement>("[data-studio-quiz-fields]");
    const studioQuizQ = studioEl?.querySelector<HTMLInputElement>("[data-studio-quiz-q]");
    const studioQuizOpt0 = studioEl?.querySelector<HTMLInputElement>('[data-studio-quiz-opt="0"]');
    const studioQuizOpt1 = studioEl?.querySelector<HTMLInputElement>('[data-studio-quiz-opt="1"]');
    const studioQuizOpt2 = studioEl?.querySelector<HTMLInputElement>('[data-studio-quiz-opt="2"]');
    const studioRewardPoolEl = studioEl?.querySelector<HTMLElement>("[data-studio-reward-pool]");
    const studioQuestTypeSelect = studioEl?.querySelector<HTMLSelectElement>("[data-studio-quest-type]");
    const studioQuestTargetSelect = studioEl?.querySelector<HTMLSelectElement>("[data-studio-quest-target]");
    const studioQuestRewardSelect = studioEl?.querySelector<HTMLSelectElement>("[data-studio-quest-reward]");
    const studioQuestXpSelect = studioEl?.querySelector<HTMLSelectElement>("[data-studio-quest-xp]");
    const studioQuestXpHint = studioEl?.querySelector<HTMLElement>("[data-studio-quest-xp-hint]");
    const studioQuestTitleInput = studioEl?.querySelector<HTMLInputElement>("[data-studio-quest-title]");
    const studioQuestListEl = studioEl?.querySelector<HTMLElement>("[data-studio-quest-list]");

    // Interactive 3x3 Grid Cover Cropper modal (3:4 Lesson Cover & 16:5 Class Banner)
    const cropperModal = document.querySelector<HTMLElement>("[data-learn-cropper-modal]");
    const cropperTitleEl = cropperModal?.querySelector<HTMLElement>("[data-cropper-title]");
    const cropperHintEl = cropperModal?.querySelector<HTMLElement>("[data-cropper-hint]");
    const cropperApplyBtn = cropperModal?.querySelector<HTMLButtonElement>("[data-cropper-apply]");
    const cropperStageWrap = cropperModal?.querySelector<HTMLElement>(".learn-cropper__stage-wrap");
    const cropperViewport = cropperModal?.querySelector<HTMLElement>("[data-cropper-viewport]");
    const cropperImg = cropperModal?.querySelector<HTMLImageElement>("[data-cropper-img]");
    const cropperZoom = cropperModal?.querySelector<HTMLInputElement>("[data-cropper-zoom]");
    const cropperZoomLabel = cropperModal?.querySelector<HTMLElement>("[data-cropper-zoom-label]");

    // Join Requests modal
    const requestsModal = document.querySelector<HTMLElement>("[data-learn-requests-modal]");
    const requestsListEl = requestsModal?.querySelector<HTMLElement>("[data-learn-requests-list]");
    const requestsApprovalToggle = requestsModal?.querySelector<HTMLInputElement>("[data-requests-toggle-approval]");

    // Course details modal
    const modalBackdrop = document.querySelector<HTMLElement>("[data-course-modal-backdrop]");
    const modalCover = modalBackdrop?.querySelector<HTMLElement>("[data-course-modal-cover]");
    const modalChips = modalBackdrop?.querySelector<HTMLElement>("[data-course-modal-chips]");
    const modalTitle = modalBackdrop?.querySelector<HTMLElement>("[data-course-modal-title]");
    const modalDesc = modalBackdrop?.querySelector<HTMLElement>("[data-course-modal-desc]");
    const modalTotal = modalBackdrop?.querySelector<HTMLElement>("[data-course-modal-total]");
    const modalList = modalBackdrop?.querySelector<HTMLElement>("[data-course-modal-chapters]");
    const modalFavBtn = modalBackdrop?.querySelector<HTMLButtonElement>("[data-course-modal-fav]");
    const modalEnrollBtn = modalBackdrop?.querySelector<HTMLButtonElement>("[data-course-modal-enroll]");
    const modalEnterBtn = modalBackdrop?.querySelector<HTMLButtonElement>("[data-course-modal-enter]");

    // Join & Create modals
    const joinModal = document.querySelector<HTMLElement>("[data-learn-join-modal]");
    const joinForm = joinModal?.querySelector<HTMLFormElement>("[data-learn-join-form]");
    const joinInput = joinModal?.querySelector<HTMLInputElement>("[data-learn-join-input]");
    const joinMsg = joinModal?.querySelector<HTMLElement>("[data-learn-join-msg]");

    const createModal = document.querySelector<HTMLElement>("[data-learn-create-modal]");
    const createForm = createModal?.querySelector<HTMLFormElement>("[data-learn-create-form]");
    const createNameInput = createModal?.querySelector<HTMLInputElement>("[data-learn-create-name]");
    const createCatSelect = createModal?.querySelector<HTMLSelectElement>("[data-learn-create-cat]");
    const createDescInput = createModal?.querySelector<HTMLInputElement>("[data-learn-create-desc]");
    const createSwatches = createModal?.querySelector<HTMLElement>("[data-learn-create-swatches]");
    const createBgInput = createModal?.querySelector<HTMLInputElement>("[data-learn-create-bg-input]");
    const createBgPreview = createModal?.querySelector<HTMLElement>("[data-learn-create-bg-preview]");
    const createBgImg = createModal?.querySelector<HTMLImageElement>("[data-learn-create-bg-img]");
    const createBgCropBtn = createModal?.querySelector<HTMLButtonElement>("[data-learn-create-bg-crop]");
    const createBgClear = createModal?.querySelector<HTMLButtonElement>("[data-learn-create-bg-clear]");
    const createApprovalInput = createModal?.querySelector<HTMLInputElement>("[data-learn-create-approval]");
    let selectedCreateBannerImage = "";
    let selectedCreateBannerRawSrc = "";

    const resetCreateBannerImage = (): void => {
      selectedCreateBannerImage = "";
      selectedCreateBannerRawSrc = "";
      if (createBgInput) createBgInput.value = "";
      if (createBgImg) createBgImg.removeAttribute("src");
      if (createBgPreview) createBgPreview.hidden = true;
    };

    // Custom lesson video/YouTube player modal
    const playerModal = document.querySelector<HTMLElement>("[data-learn-player-modal]");
    const playerEyebrow = playerModal?.querySelector<HTMLElement>("[data-learn-player-eyebrow]");
    const playerTitle = playerModal?.querySelector<HTMLElement>("[data-learn-player-title]");
    const playerStage = playerModal?.querySelector<HTMLElement>("[data-learn-player-stage]");
    const playerDesc = playerModal?.querySelector<HTMLElement>("[data-learn-player-desc]");
    const playerStatus = playerModal?.querySelector<HTMLElement>("[data-learn-player-status]");
    const playerCompleteBtn = playerModal?.querySelector<HTMLButtonElement>("[data-learn-player-complete]");

    const toastEl = document.querySelector<HTMLElement>("[data-learn-toast]");

    if (!homeView || !learnPanel || !classesEl || !classesGridHost || !hubEl || !deckEl || !catalogHost) return;

    let selectedCreateGradient = "linear-gradient(135deg, #27532d 0%, #3c7d42 100%)";

    loadState();

    const showToast = (message: string): void => {
      if (!toastEl) return;
      toastEl.textContent = message;
      toastEl.hidden = false;
      if (toastTimer) window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => {
        toastEl.hidden = true;
      }, 2800);
    };
    window.addEventListener("learninghaus:toast", (ev) => {
      const msg = (ev as CustomEvent<{ message?: string }>).detail?.message;
      if (msg) showToast(msg);
    });

    const copyClassCode = (code: string): void => {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(code).catch(() => {});
      }
      showToast(t(`Copied Class Code: ${code}`, `คัดลอกรหัสห้องเรียนแล้ว: ${code}`));
    };

    const setPlusMenuOpen = (open: boolean): void => {
      if (!plusMenu || !plusToggleBtn) return;
      plusMenu.hidden = !open;
      plusToggleBtn.setAttribute("aria-expanded", String(open));
    };

    const getStudioCourse = (): CourseItem | null => {
      if (!studioCourseId) return null;
      return myClassesState.customClasses.find((c) => c.id === studioCourseId) || null;
    };

    const syncFavoriteButtons = (): void => {
      if (favCountEl) favCountEl.textContent = String(favoriteIds.size);
      if (modalFavBtn && modalCourse) {
        const saved = favoriteIds.has(modalCourse.id);
        modalFavBtn.classList.toggle("is-saved", saved);
        modalFavBtn.setAttribute("aria-pressed", String(saved));
        modalFavBtn.innerHTML = `${saved ? SVG_ICONS.bookmarkFilled : SVG_ICONS.bookmark}<span>${saved ? t("Saved in Favorites", "อยู่ในคลังโปรดแล้ว") : t("Add to Favorites", "เพิ่มในคลังโปรด")}</span>`;
      }
      if (modalEnrollBtn && modalCourse) {
        const inClasses = isInMyClasses(modalCourse.id);
        modalEnrollBtn.classList.toggle("is-enrolled", inClasses);
        modalEnrollBtn.setAttribute("aria-pressed", String(inClasses));
        modalEnrollBtn.innerHTML = `${inClasses ? SVG_ICONS.checkCircle : SVG_ICONS.plusCircle}<span>${inClasses ? t("In My Classes", "อยู่ในห้องเรียนแล้ว") : t("Add to My Classes", "เพิ่มเข้าห้องเรียน")}</span>`;
      }
      if (deckFavBtn) {
        const current = getActiveCourse();
        const saved = favoriteIds.has(current.id);
        deckFavBtn.classList.toggle("is-saved", saved);
        deckFavBtn.setAttribute("aria-pressed", String(saved));
        deckFavBtn.innerHTML = `${saved ? SVG_ICONS.bookmarkFilled : SVG_ICONS.bookmark}<span>${saved ? t("Favorited", "อยู่ในคลังโปรด") : t("Favorite", "คลังโปรด")}</span>`;
      }
    };

    const renderMyClasses = (): void => {
      const allMyClasses = getMyClasses();
      const enrolledClasses = allMyClasses.filter((c) => c.role !== "teaching");
      const teachingClasses = allMyClasses.filter((c) => c.role === "teaching");

      const allCountEl = classesEl.querySelector<HTMLElement>('[data-learn-role-count="all"]');
      const enrolledCountEl = classesEl.querySelector<HTMLElement>('[data-learn-role-count="enrolled"]');
      const teachingCountEl = classesEl.querySelector<HTMLElement>('[data-learn-role-count="teaching"]');
      if (allCountEl) allCountEl.textContent = String(allMyClasses.length);
      if (enrolledCountEl) enrolledCountEl.textContent = String(enrolledClasses.length);
      if (teachingCountEl) teachingCountEl.textContent = String(teachingClasses.length);

      const visible =
        activeRoleFilter === "enrolled"
          ? enrolledClasses
          : activeRoleFilter === "teaching"
            ? teachingClasses
            : allMyClasses;

      if (!visible.length) {
        if (activeRoleFilter === "teaching") {
          classesGridHost.innerHTML = `
            <div class="learn-classes__empty">
              <span class="learn-hub__empty-icon">${SVG_ICONS.plusCircle}</span>
              <strong>${t("You haven't created any classes yet", "คุณยังไม่ได้สร้างห้องเรียนของตัวเอง")}</strong>
              <p>${t("Create a class to choose its layout, upload chapter covers, and share a Class Code.", "สร้างห้องเรียนใหม่เพื่อเลือกดีไซน์ อัปโหลดรูปปกบทเรียน และแชร์รหัส Class Code")}</p>
              <div class="learn-classes__empty-actions">
                <button class="learn-cr-btn learn-cr-btn--primary" type="button" data-learn-open-create>${SVG_ICONS.plus}<span>${t("Create New Class", "สร้างห้องเรียนใหม่")}</span></button>
              </div>
            </div>
          `;
          return;
        }
        classesGridHost.innerHTML = `
          <div class="learn-classes__empty">
            <span class="learn-hub__empty-icon">${SVG_ICONS.book}</span>
            <strong>${t("No classes in your classroom yet", "ยังไม่มีห้องเรียนในหน้าห้องเรียนของฉัน")}</strong>
            <p>${t("Join a classroom with a Class Code or explore public lessons to add them here.", "กรอกรหัสเข้าห้องเรียน หรือสำรวจบทเรียนอื่นๆ เพื่อเพิ่มห้องเรียนเข้ามาที่นี่")}</p>
            <div class="learn-classes__empty-actions">
              <button class="learn-cr-btn learn-cr-btn--primary" type="button" data-learn-go-explore>${SVG_ICONS.compass}<span>${t("Explore Lessons", "สำรวจบทเรียนอื่นๆ")}</span></button>
              <button class="learn-cr-btn learn-cr-btn--soft" type="button" data-learn-open-join>${SVG_ICONS.key}<span>${t("Join with Class Code", "กรอกรหัสเข้าห้องเรียน")}</span></button>
            </div>
          </div>
        `;
        return;
      }

      const pendingCourses = (myClassesState.pendingJoinIds || [])
        .map((id) => getAllCombined().find((c) => c.id === id))
        .filter((c): c is CourseItem => Boolean(c && !isInMyClasses(c.id)));
      const pendingHtml = pendingCourses.length
        ? `
          <div class="learn-pending-strip" aria-label="Pending join requests">
            ${pendingCourses
              .map(
                (c) => `
                  <div class="learn-pending-card">
                    <div class="learn-pending-card__copy">
                      <span class="learn-pending-card__badge">${t("Pending Approval", "รอผู้สอนอนุมัติ")}</span>
                      <strong>${escHtml(c.title)} (${escHtml(c.classCode)})</strong>
                      <small>${t("Your request was sent to the instructor.", "ส่งคำขอเข้าร่วมแล้ว กรุณารอผู้สร้างห้องเรียนกดอนุมัติ")}</small>
                    </div>
                    <button type="button" class="learn-cr-btn" data-cancel-pending-join="${escHtml(c.id)}">${t("Cancel Request", "ยกเลิกคำขอ")}</button>
                  </div>
                `
              )
              .join("")}
          </div>
        `
        : "";

      classesGridHost.innerHTML = `${pendingHtml}<div class="learn-classes__grid">${visible.map(buildClassroomCardHtml).join("")}</div>`;
    };

    const matchesCategoryChip = (courseCat: CourseCategory, chip: string): boolean => {
      if (chip === "all") return true;
      if (courseCat === chip) return true;
      if (chip === "cs") return courseCat === "cs" || courseCat === "data" || courseCat === "practical" || courseCat === "cyber";
      if (chip === "business") return courseCat === "business" || courseCat === "finance" || courseCat === "personal";
      if (chip === "languages") return courseCat === "languages" || courseCat === "math" || courseCat === "science" || courseCat === "social";
      if (chip === "law") return courseCat === "law" || courseCat === "ethics";
      return false;
    };

    const filterExploreCourses = (): CourseItem[] => {
      const q = searchQuery.trim().toLowerCase();
      return COURSES.filter((c) => {
        if (activeCategory === "favorites" && !favoriteIds.has(c.id)) return false;
        if (activeCategory !== "all" && activeCategory !== "favorites" && !matchesCategoryChip(c.category, activeCategory)) return false;
        if (!q) return true;
        return (
          c.title.toLowerCase().includes(q) ||
          c.classCode.toLowerCase().includes(q) ||
          c.descriptionEn.toLowerCase().includes(q) ||
          c.descriptionTh.toLowerCase().includes(q) ||
          c.creator.toLowerCase().includes(q) ||
          c.categoryEn.toLowerCase().includes(q) ||
          c.categoryTh.toLowerCase().includes(q)
        );
      });
    };

    const renderCatalog = (): void => {
      syncFavoriteButtons();
      const list = filterExploreCourses();

      if (!list.length) {
        if (activeCategory === "favorites" && !searchQuery.trim()) {
          catalogHost.innerHTML = `
            <div class="learn-hub__empty learn-hub__empty--fav">
              <span class="learn-hub__empty-icon">${SVG_ICONS.bookmark}</span>
              <strong>${t("No favorite courses yet", "ยังไม่มีบทเรียนในคลังโปรดของคุณ")}</strong>
              <p>${t("Tap the bookmark icon on any course card to save it here for later without adding it to My Classes yet.", "กดปุ่มบุ๊กมาร์กบนการ์ดคอร์สเพื่อเก็บไว้ดูภายหลัง โดยยังไม่เพิ่มเข้าหน้าห้องเรียนของฉัน")}</p>
              <button class="learn-hub__btn-primary" type="button" data-learn-cat="all">${t("Browse All Lessons", "ดูบทเรียนทั้งหมด")} ${SVG_ICONS.arrowRight}</button>
            </div>
          `;
          return;
        }
        const safeQ = escHtml(searchQuery);
        catalogHost.innerHTML = `<div class="learn-hub__empty">${t(`No courses match "<strong>${safeQ}</strong>". Try another keyword or switch back to "All".`, `ไม่พบบทเรียนที่ตรงกับคำค้นหา "<strong>${safeQ}</strong>" ลองค้นหาด้วยคำอื่นหรือเลือกหมวด "ทั้งหมด"`)}</div>`;
        return;
      }

      catalogHost.innerHTML = `
        <div class="learn-explore__grid">
          ${list.map(buildExploreCardHtml).join("")}
        </div>
      `;
    };

    const renderDeckForCourse = (course: CourseItem): void => {
      if (deckCoursePill) {
        deckCoursePill.innerHTML = `${SVG_ICONS.layers}<span><strong>${escHtml(course.title)}</strong> · ${t(`${course.chapters.length} Total Lessons`, `${course.chapters.length} บทเรียนทั้งหมด`)}</span>`;
      }
      if (deckEditBtn) {
        deckEditBtn.hidden = !(course.isCustom && course.role === "teaching");
      }
      if (deckRequestsBtn && deckRequestsLabel) {
        const isTeachingCustom = Boolean(course.isCustom && course.role === "teaching");
        deckRequestsBtn.hidden = !isTeachingCustom;
        if (isTeachingCustom) {
          const pendingCount = Array.isArray(course.pendingRequests) ? course.pendingRequests.length : 0;
          deckRequestsBtn.classList.toggle("has-pending", pendingCount > 0);
          deckRequestsLabel.textContent =
            pendingCount > 0
              ? t(`Requests (${pendingCount})`, `คำขอ (${pendingCount})`)
              : course.requireApproval
                ? t("Approval On", "เปิดอนุมัติ")
                : t("Approval", "ตั้งค่าอนุมัติ");
        }
      }
      if (deckCodeBtn) {
        deckCodeBtn.hidden = !course.classCode;
        deckCodeBtn.dataset.copyCode = course.classCode;
        deckCodeBtn.innerHTML = `${SVG_ICONS.copy}<span>${escHtml(course.classCode)}</span>`;
      }
      const quizGroupTitle = deckEl.querySelector<HTMLElement>("[data-learn-quiz-group-title]");
      const quizGroupMeta = deckEl.querySelector<HTMLElement>("[data-learn-quiz-group-meta]");
      const chCount = Math.min(LearningHausRules.quiz.chapterCount, course.chapters.length);
      const totalStages = chCount * LearningHausRules.quiz.stagesPerChapter;
      if (quizGroupTitle) quizGroupTitle.textContent = course.title;
      if (quizGroupMeta) {
        if (course.isCustom) {
          const pts = getCustomPointsSummary(course);
          const passPct = course.passPercent || 80;
          quizGroupMeta.textContent = t(
            `${course.chapters.length} Lessons · ${pts.earned}/${pts.total} pts (Pass ${passPct}%)`,
            `${course.chapters.length} บทเรียน · ${pts.earned}/${pts.total} คะแนน (เกณฑ์ผ่าน ${passPct}%)`
          );
        } else {
          quizGroupMeta.textContent = t(
            `${chCount} Chapters (${totalStages} Stages) · Stage Map & Quiz`,
            `${chCount} บทเรียน (${totalStages} ด่าน) · แผนที่ด่านและ Quiz`
          );
        }
      }
      const isFlagshipEu = course.id === "eu-ai-act";
      const useStickyScroll = !isFlagshipEu && (!course.isCustom || (course.layoutStyle || "fan") !== "fan");
      deckEl.classList.toggle("is-sticky-scroll", useStickyScroll);
      homeView.dataset.learnDeckScroll = useStickyScroll ? "sticky" : "flow";
      if (deckEuDeckWrap) deckEuDeckWrap.hidden = !isFlagshipEu;
      if (deckCustomWrap) {
        deckCustomWrap.hidden = isFlagshipEu;
        const isEuStyleCustom = !isFlagshipEu && Boolean(course.isCustom) && (course.layoutStyle || "fan") === "fan";
        deckCustomWrap.classList.toggle("is-eu-layout", isEuStyleCustom);
        if (!isFlagshipEu) {
          if (course.isCustom) {
            deckCustomWrap.innerHTML = buildCustomClassroomHtml(course, customSelectedChIdx, false);
            const customStack = deckCustomWrap.querySelector<HTMLElement>(".learn-eu-stack");
            if (customStack) {
              attachSmoothCardDrag(customStack, {
                cardSelector: ".learn-eu-stack__card",
                onStep: (delta) => {
                  const len = Math.max(1, course.chapters.length);
                  syncCustomStackInPlace(deckCustomWrap, course, (customSelectedChIdx + delta + len) % len);
                }
              });
            }
          } else {
            deckCustomWrap.innerHTML = `
              <div class="learn-layout-wrap">
                ${buildLessonSummaryBarHtml(course)}
                <div class="learn-layout-scroll">
                  <div class="learn-custom-deck__hero">
                    <div class="learn-custom-deck__cover is-${course.ratio}">
                      ${renderCoverMarkup(course)}
                    </div>
                    <div class="learn-custom-deck__info">
                      <span class="learn-hub__sec-tag">${escHtml(catLabel(course))} · ${lessonCountText(course.chapters.length)}</span>
                      <h2>${escHtml(course.title)}</h2>
                      <p>${escHtml(descText(course))}</p>
                    </div>
                  </div>
                  <div class="learn-custom-deck__list">
                    ${course.chapters
                      .map((ch, idx) => {
                        const done = isChapterDone(course.id, idx);
                        return `
                          <article class="learn-custom-deck__item">
                            <span class="learn-custom-deck__num">${idx + 1}</span>
                            <div class="learn-custom-deck__item-copy">
                              <strong>Chapter ${idx + 1} · ${escHtml(ch.title)}</strong>
                              <span>${escHtml(t(ch.summaryEn, ch.summaryTh))}</span>
                              <div class="learn-clist__meta">
                                <span class="learn-clist__tag">+${EQUAL_LESSON_XP} EXP</span>
                                ${done ? `<span class="learn-clist__tag is-done">${t("Completed", "เรียนจบแล้ว")}</span>` : ""}
                              </div>
                            </div>
                            <button class="learn-hub__btn-soft" type="button" data-open-custom-lesson="${idx}">${t("Open Lesson", "เปิดบทเรียน")} ${SVG_ICONS.arrowRight}</button>
                          </article>
                        `;
                      })
                      .join("")}
                  </div>
                </div>
              </div>
            `;
          }
        }
      }
    };

    const populateStudioQuestTargetOptions = (course: CourseItem): void => {
      if (!studioQuestTargetSelect || !studioQuestTypeSelect) return;
      const objType = (studioQuestTypeSelect.value || "complete-lessons") as CourseQuestObjectiveType;
      const chCount = Math.max(1, course.chapters.length);
      if (objType === "complete-lessons") {
        studioQuestTargetSelect.disabled = false;
        studioQuestTargetSelect.innerHTML = Array.from({ length: chCount }, (_, i) => {
          const n = i + 1;
          return `<option value="${n}">${t(`Complete ${n} ${n === 1 ? "Lesson" : "Lessons"}`, `เรียนครบ ${n} บทเรียน`)}</option>`;
        }).join("");
      } else if (objType === "complete-course") {
        studioQuestTargetSelect.disabled = true;
        studioQuestTargetSelect.innerHTML = `<option value="${chCount}">${t(`All ${chCount} Lessons (Whole Class)`, `ครบทุกบท (${chCount} บทเรียน)`)}</option>`;
      } else {
        studioQuestTargetSelect.disabled = false;
        studioQuestTargetSelect.innerHTML = course.chapters
          .map(
            (c, i) =>
              `<option value="${i + 1}">${t(`Lesson ${i + 1}`, `บทที่ ${i + 1}`)}: ${escHtml(c.title)}</option>`
          )
          .join("");
      }
    };

    const renderStudioQuestsStep = (course: CourseItem): void => {
      const pool = getClassRewardPool(course.id);
      const quests = getCourseQuests(course.id);
      const assignedPoolIds = new Set(quests.map((q) => q.rewardPoolId));

      if (studioRewardPoolEl) {
        studioRewardPoolEl.innerHTML = pool
          .map((item, idx) => {
            const assigned = assignedPoolIds.has(item.poolId);
            return `
              <div class="learn-studio__pool-item${assigned ? " is-assigned" : ""}">
                <span class="learn-studio__pool-badge">${t(`Pool #${idx + 1}`, `รางวัลสุ่ม #${idx + 1}`)} · ${escHtml(t(item.tagEn, item.tagTh))}</span>
                <strong>${escHtml(t(item.nameEn, item.nameTh))}</strong>
                <small>${assigned ? t("Assigned to a quest", "ผูกกับเควสต์แล้ว") : t("Available to assign", "พร้อมนำไปผูกกับเควสต์")}</small>
              </div>
            `;
          })
          .join("");
      }

      if (studioQuestRewardSelect) {
        studioQuestRewardSelect.innerHTML = pool
          .map(
            (item, idx) =>
              `<option value="${escHtml(item.poolId)}">${t(`#${idx + 1}`, `#${idx + 1}`)} · ${escHtml(t(item.nameEn, item.nameTh))} (${escHtml(t(item.tagEn, item.tagTh))})</option>`
          )
          .join("");
      }

      populateStudioQuestTargetOptions(course);

      const expPolicy = getCreatorExpPolicy(course);
      if (studioQuestXpSelect) {
        if (expPolicy.isLocked) {
          studioQuestXpSelect.innerHTML = `<option value="0" selected>+0 EXP (${t("Locked Class", "ห้องล็อค · ไม่มี EXP")})</option>`;
          studioQuestXpSelect.value = "0";
          studioQuestXpSelect.disabled = true;
        } else {
          const prevVal = Number(studioQuestXpSelect.value) || 0;
          studioQuestXpSelect.disabled = false;
          studioQuestXpSelect.innerHTML = expPolicy.tiers
            .map((tier) => {
              const lockTag = tier.unlocked ? "" : ` (${t(`Unlock: ${tier.rankEn}`, `ปลดที่ยศ: ${tier.rankTh}`)})`;
              return `<option value="${tier.value}" ${tier.unlocked ? "" : "disabled"}>+${tier.value} EXP${escHtml(lockTag)}</option>`;
            })
            .join("");
          const validChoice = expPolicy.tiers.some((tier) => tier.unlocked && tier.value === prevVal)
            ? prevVal
            : Math.min(80, expPolicy.maxExp);
          studioQuestXpSelect.value = String(validChoice || 40);
        }
      }
      if (studioQuestXpHint) {
        studioQuestXpHint.classList.toggle("is-locked", expPolicy.isLocked);
        studioQuestXpHint.textContent = expPolicy.isLocked
          ? t(expPolicy.nextReqEn, expPolicy.nextReqTh)
          : `${t("Creator Rank:", "ยศผู้สร้างปัจจุบัน:")} ${t(expPolicy.rankNameEn, expPolicy.rankNameTh)} (${t(`Max +${expPolicy.maxExp} EXP`, `ตั้งได้สูงสุด +${expPolicy.maxExp} EXP`)}) · ${t(expPolicy.nextReqEn, expPolicy.nextReqTh)}`;
      }

      if (studioQuestListEl) {
        if (!quests.length) {
          studioQuestListEl.innerHTML = `<p class="learn-studio__hint">${t("No quests assigned yet. Use the form above to assign quests for your learners!", "ยังไม่มีเควสต์ในคลาสนี้ เลือกเงื่อนไขและรางวัลด้านบนแล้วกด + มอบหมายเควสต์ได้เลย")}</p>`;
        } else {
          studioQuestListEl.innerHTML = quests
            .map((q) => {
              const rewardItem = pool.find((p) => p.poolId === q.rewardPoolId) || pool[0];
              const rewardLabel = rewardItem ? t(rewardItem.nameEn, rewardItem.nameTh) : t("Bonus EXP", "โบนัส EXP");
              return `
                <div class="learn-studio__quest-item">
                  <div class="learn-studio__quest-copy">
                    <strong>${escHtml(t(q.titleEn, q.titleTh))}</strong>
                    <span>${escHtml(t(q.descEn, q.descTh))}</span>
                    <div class="learn-studio__quest-tags">
                      <span class="learn-clist__tag">+${q.xpReward} EXP</span>
                      <span class="learn-clist__tag is-done">${SVG_ICONS.star} ${escHtml(rewardLabel)}</span>
                    </div>
                  </div>
                  <button type="button" class="learn-ghost-icon-btn" data-studio-del-quest="${escHtml(q.id)}" title="${escHtml(t("Remove quest", "ลบเควสต์นี้"))}" aria-label="${escHtml(t("Remove quest", "ลบเควสต์นี้"))}">
                    ${SVG_ICONS.trash}
                  </button>
                </div>
              `;
            })
            .join("");
        }
      }
    };

    const renderStudio = (): void => {
      if (!studioEl) return;
      const course = getStudioCourse();
      if (!course) return;

      const layout = course.layoutStyle || "fan";
      const passPct = Number(course.passPercent) || 80;
      studioChapterIdx = Math.max(0, Math.min(course.chapters.length - 1, studioChapterIdx));
      const ch = course.chapters[studioChapterIdx];

      if (studioTitleEl) studioTitleEl.textContent = course.title;
      if (studioCodeBtn) {
        studioCodeBtn.dataset.copyCode = course.classCode;
        studioCodeBtn.innerHTML = `${SVG_ICONS.copy}<span>${escHtml(course.classCode)}</span>`;
      }
      if (studioApprovalToggle) {
        studioApprovalToggle.checked = Boolean(course.requireApproval);
      }

      studioEl.querySelectorAll<HTMLButtonElement>("[data-studio-step].learn-studio__step").forEach((btn) => {
        const active = Number(btn.dataset.studioStep) === studioStep;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", String(active));
      });
      studioEl.querySelectorAll<HTMLElement>("[data-studio-panel]").forEach((panel) => {
        panel.hidden = Number(panel.dataset.studioPanel) !== studioStep;
      });

      studioEl.querySelectorAll<HTMLButtonElement>("[data-studio-layout]").forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.studioLayout === layout);
      });
      studioEl.querySelectorAll<HTMLButtonElement>("[data-studio-pass]").forEach((btn) => {
        btn.classList.toggle("is-active", Number(btn.dataset.studioPass) === passPct);
      });

      if (studioPreviewHost) {
        studioPreviewHost.innerHTML = buildCustomClassroomHtml(course, studioChapterIdx, true);
        const previewStack = studioPreviewHost.querySelector<HTMLElement>(".learn-eu-stack");
        if (previewStack) {
          attachSmoothCardDrag(previewStack, {
            cardSelector: ".learn-eu-stack__card",
            onStep: (delta) => {
              const len = Math.max(1, course.chapters.length);
              studioChapterIdx = (studioChapterIdx + delta + len) % len;
              syncCustomStackInPlace(studioPreviewHost, course, studioChapterIdx);
            }
          });
        }
      }

      if (studioChStrip) {
        studioChStrip.innerHTML =
          course.chapters
            .map(
              (_, idx) =>
                `<button type="button" class="learn-studio__ch-pill${idx === studioChapterIdx ? " is-active" : ""}" data-studio-select-ch="${idx}">${t(`Lesson ${idx + 1}`, `บทที่ ${idx + 1}`)}</button>`
            )
            .join("") +
          `<button type="button" class="learn-studio__ch-pill learn-studio__ch-pill--add" data-studio-add-ch>+ ${t("Add Lesson", "เพิ่มบท")}</button>`;
      }
      if (studioDelChBtn) studioDelChBtn.hidden = course.chapters.length <= 1;

      if (ch) {
        if (studioCoverPreview) {
          studioCoverPreview.innerHTML = `<img src="${escHtml(getChapterCover(course, ch, studioChapterIdx))}" alt="${escHtml(ch.title)}">`;
        }
        if (studioChTitleInput) studioChTitleInput.value = ch.title;
        if (studioChPtsInput) studioChPtsInput.value = String(ch.points || 100);
        if (studioChDescInput) studioChDescInput.value = t(ch.summaryEn, ch.summaryTh);

        const media: ChapterMediaType = ch.mediaType || "youtube";
        studioEl.querySelectorAll<HTMLButtonElement>("[data-studio-media]").forEach((btn) => {
          btn.classList.toggle("is-active", btn.dataset.studioMedia === media);
        });
        if (studioYtWrap) studioYtWrap.hidden = media !== "youtube";
        if (studioVidWrap) studioVidWrap.hidden = media !== "upload";
        if (studioCanvaWrap) studioCanvaWrap.hidden = media !== "canva";
        if (studioReadingWrap) studioReadingWrap.hidden = media !== "reading";
        if (studioYtInput) studioYtInput.value = ch.youtubeUrl || "";
        if (studioCanvaInput) studioCanvaInput.value = ch.canvaUrl || "";
        if (studioReadingBody) studioReadingBody.value = ch.readingBody || "";
        if (studioVidName) {
          studioVidName.textContent = ch.videoFileName
            ? t(`Ready: ${ch.videoFileName}`, `ไฟล์พร้อมใช้งาน: ${ch.videoFileName}`)
            : t("Supports PDF, PPT/PPTX, or slide images (PNG/JPG/WebP). Video uploads are disabled.", "รองรับเฉพาะไฟล์ PDF, สไลด์ PPT/PPTX หรือรูปภาพสไลด์ (ไม่อนุญาตให้อัปโหลดวิดีโอ)");
        }

        const hasQ = Boolean(ch.hasQuiz || (ch.quizStages && ch.quizStages.length > 0));
        if (studioQuizEnabled) studioQuizEnabled.checked = hasQ;
        if (studioQuizFields) studioQuizFields.hidden = !hasQ;
      }

      const quizMapHost = studioEl?.querySelector<HTMLElement>("[data-studio-quiz-map-host]");
      if (quizMapHost && ch && (ch.hasQuiz || (ch.quizStages && ch.quizStages.length > 0))) {
        LearningHausCustomQuizStudio.renderStudioBuilder(quizMapHost, course, studioChapterIdx, () => {
          saveMyClasses();
        });
      }

      renderStudioQuestsStep(course);
    };

    const openStudio = (courseId: string, step: 1 | 2 | 3 = 1): void => {
      studioCourseId = courseId;
      studioStep = step;
      studioChapterIdx = 0;
      if (studioImgErr) studioImgErr.hidden = true;
      if (studioVidErr) studioVidErr.hidden = true;
      setActiveCourse(courseId);
      setSubview("studio");
    };

    const setSubview = (subview: LearnSubview): void => {
      if (subview !== "studio") LearningHausCustomQuizStudio.stopThemeBgm();
      setPlusMenuOpen(false);
      classesEl.hidden = subview !== "classes";
      hubEl.hidden = subview !== "explore";
      deckEl.hidden = subview !== "deck";
      if (studioEl) studioEl.hidden = subview !== "studio";
      homeView.dataset.learnSubview = subview;
      if (subview === "classes") {
        renderMyClasses();
      } else if (subview === "explore") {
        renderCatalog();
      } else if (subview === "deck") {
        renderDeckForCourse(getActiveCourse());
        syncFavoriteButtons();
      } else if (subview === "studio") {
        renderStudio();
      }
      homeView.querySelector(".home-main")?.scrollTo(0, 0);
    };
    setSubviewFn = setSubview;

    // Lesson Player Modal (YouTube Watch-to-Complete + Uploaded Slides/PDF/Video + Reading Article + Optional Quiz)
    const CUSTOM_VIDEO_WATCHED_KEY = "learninghaus.videoWatched.v1";
    const isCustomVideoWatched = (courseId: string, chIdx: number): boolean => {
      if (isChapterDone(courseId, chIdx)) return true;
      const map = LearningHausAccountStorage.readJson<Record<string, boolean>>(CUSTOM_VIDEO_WATCHED_KEY, {});
      return Boolean(map[`${courseId}:${chIdx}`]);
    };
    const markCustomVideoWatched = (courseId: string, chIdx: number): void => {
      const map = LearningHausAccountStorage.readJson<Record<string, boolean>>(CUSTOM_VIDEO_WATCHED_KEY, {});
      map[`${courseId}:${chIdx}`] = true;
      LearningHausAccountStorage.writeJson(CUSTOM_VIDEO_WATCHED_KEY, map);
    };
    let modalYtGuardTimer: number | null = null;
    const stopModalYtGuard = (): void => {
      if (modalYtGuardTimer !== null) {
        window.clearInterval(modalYtGuardTimer);
        modalYtGuardTimer = null;
      }
    };

    const destroyActivePlayer = (): void => {
      stopModalYtGuard();
      try {
        activeYtPlayer?.destroy?.();
      } catch {
        // ignore YT destroy edge cases
      }
      activeYtPlayer = null;
      if (playerStage) playerStage.innerHTML = "";
    };

    const closePlayerModal = (): void => {
      destroyActivePlayer();
      if (playerModal) playerModal.hidden = true;
      playerCourseId = null;
    };

    const updatePlayerFooter = (course: CourseItem, chIdx: number): void => {
      const ch = course.chapters[chIdx];
      const pts = Math.max(10, Math.min(500, Number(ch?.points) || 100));
      const done = isChapterDone(course.id, chIdx);
      if (playerStatus) {
        playerStatus.textContent = done
          ? t(`Completed! Earned +${pts} pts`, `เรียนจบบทนี้แล้ว! (+${pts} คะแนน)`)
          : ch?.mediaType === "youtube"
            ? t(`Watch to the end to auto-complete (+${pts} pts)`, `ดูวิดีโอ YouTube จนจบเพื่อนับว่าเรียนจบอัตโนมัติ (+${pts} คะแนน)`)
            : ch?.mediaType === "upload"
              ? t(`Review attached slide/file or watch video to complete (+${pts} pts)`, `อ่านสไลด์/เอกสารแนบ หรือดูวิดีโอจนจบเพื่อรับคะแนน (+${pts} คะแนน)`)
              : t(`Read article and mark complete (+${pts} pts)`, `อ่านบทความแล้วกดทำเครื่องหมายว่าเรียนจบ (+${pts} คะแนน)`);
      }
      if (playerCompleteBtn) {
        playerCompleteBtn.innerHTML = done
          ? `${SVG_ICONS.checkCircle}<span>${t("Completed", "เรียนจบแล้ว")}</span>`
          : `<span>${t(`Mark Complete (+${pts} pts)`, `ทำเครื่องหมายว่าเรียนจบ (+${pts} pts)`)}</span>`;
      }
    };

    const handleChapterCompleted = (course: CourseItem, chIdx: number): void => {
      const result = setChapterDone(course.id, chIdx, true);
      updatePlayerFooter(course, chIdx);
      renderMyClasses();
      if (homeView.dataset.learnSubview === "deck") renderDeckForCourse(course);
      if (result.newlyDone) {
        if (result.classBonus) {
          showToast(
            t(
              `Class completed! +${result.awardedExp} EXP (incl. +${CLASS_COMPLETE_BONUS_XP} class bonus)`,
              `เรียนจบครบคลาสแล้ว! ได้รับ +${result.awardedExp} EXP (รวมโบนัสจบคลาส +${CLASS_COMPLETE_BONUS_XP})`
            )
          );
          window.dispatchEvent(
            new CustomEvent("learninghaus:notify", {
              detail: {
                kind: "class_completed",
                important: true,
                titleEn: `Class Completed: ${course.title}`,
                titleTh: `เรียนจบคลาสแล้ว: ${course.title}`,
                bodyEn: `Earned +${result.awardedExp} EXP including +${CLASS_COMPLETE_BONUS_XP} completion bonus!`,
                bodyTh: `ได้รับ +${result.awardedExp} EXP (รวมโบนัสเรียนจบคลาส +${CLASS_COMPLETE_BONUS_XP})`,
                meta: { courseId: course.id, courseTitle: course.title }
              }
            })
          );
        } else if (result.awardedExp > 0) {
          showToast(t(`Lesson completed! +${result.awardedExp} EXP`, `เรียนจบบทที่ ${chIdx + 1} สำเร็จ! (+${result.awardedExp} EXP)`));
        } else {
          showToast(t(`Lesson ${chIdx + 1} marked complete.`, `บันทึกว่าเรียนจบบทที่ ${chIdx + 1} แล้ว`));
        }
      }
    };

    const buildInlineQuizHtml = (ch: CourseChapter): string => {
      if (!ch.hasQuiz || !ch.quiz?.question) return "";
      const opts = ch.quiz.options || ["Option A", "Option B", "Option C"];
      return `
        <div class="learn-player-quiz" data-player-quiz-box>
          <div class="learn-player-quiz__head">
            <span class="learn-clist__tag">${t("Lesson Quiz", "ควิซท้ายบทเรียน")}</span>
            <strong>${escHtml(ch.quiz.question)}</strong>
          </div>
          <div class="learn-player-quiz__opts">
            ${opts
              .map(
                (optText, idx) => `
                  <button type="button" class="learn-player-quiz__opt" data-player-quiz-pick="${idx}">
                    <b>${String.fromCharCode(65 + idx)}</b>
                    <span>${escHtml(optText || `${t("Option", "ตัวเลือก")} ${idx + 1}`)}</span>
                  </button>
                `
              )
              .join("")}
          </div>
          <p class="learn-player-quiz__msg" data-player-quiz-msg hidden></p>
        </div>
      `;
    };

    const openLessonPlayer = (course: CourseItem, chIdx: number): void => {
      if (!playerModal || !playerStage) return;
      const ch = course.chapters[chIdx];
      if (!ch) return;

      destroyActivePlayer();
      playerCourseId = course.id;
      playerChapterIdx = chIdx;
      const pts = Math.max(10, Math.min(500, Number(ch.points) || 100));
      const media: ChapterMediaType = ch.mediaType || "youtube";

      if (playerEyebrow) {
        playerEyebrow.textContent =
          media === "youtube"
            ? `YouTube · ${pts} ${t("pts", "คะแนน")}`
            : media === "upload"
              ? `${t("Slides / File / Video", "สไลด์ / ไฟล์แนบ / วิดีโอ")} · ${pts} ${t("pts", "คะแนน")}`
              : `${t("Reading Article", "บทความอ่าน")} · ${pts} ${t("pts", "คะแนน")}`;
      }
      if (playerTitle) playerTitle.textContent = `${t("Lesson", "บทที่")} ${chIdx + 1} · ${ch.title}`;
      if (playerDesc) playerDesc.textContent = t(ch.summaryEn, ch.summaryTh);

      const inlineQuizHtml = buildInlineQuizHtml(ch);

      if (media === "youtube") {
        const ytId = extractYoutubeId(ch.youtubeUrl);
        if (!ytId) {
          playerStage.innerHTML = `
            <div class="learn-player-modal__empty">
              <strong>${t("No YouTube link added yet", "ยังไม่ได้ใส่ลิงก์ YouTube สำหรับบทนี้")}</strong>
              <p>${t("Edit this class in Class Studio to paste a YouTube video link, or upload slides / write a reading article.", "กดออกแบบห้องเรียน (Edit Class) เพื่อวางลิงก์วิดีโอ YouTube หรือเปลี่ยนเป็นอัปโหลดสไลด์/บทความอ่าน")}</p>
            </div>
            ${inlineQuizHtml}
          `;
        } else {
          playerStage.innerHTML = `<div class="learn-player-modal__yt" id="learn-yt-player-host"></div>${inlineQuizHtml}`;
          const host = playerStage.querySelector<HTMLElement>("#learn-yt-player-host");
          if (host) {
            host.innerHTML = `<iframe src="https://www.youtube.com/embed/${escHtml(ytId)}?rel=0&enablejsapi=1" title="${escHtml(ch.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            loadYouTubeIframeApi(() => {
              if (playerCourseId !== course.id || playerChapterIdx !== chIdx || playerModal.hidden) return;
              const win = window as unknown as {
                YT?: {
                  Player?: new (
                    el: HTMLElement | string,
                    opts: Record<string, unknown>
                  ) => {
                    destroy?: () => void;
                    getCurrentTime?: () => number;
                    getPlayerState?: () => number;
                    seekTo?: (s: number, allow?: boolean) => void;
                  };
                };
              };
              const targetEl = document.getElementById("learn-yt-player-host");
              if (!win.YT?.Player || !targetEl) return;
              targetEl.innerHTML = "";
              let ytMaxWatched = 0;
              const ytPlayer = new win.YT.Player(targetEl, {
                videoId: ytId,
                playerVars: { rel: 0, modestbranding: 1 },
                events: {
                  onReady: () => {
                    stopModalYtGuard();
                    if (isCustomVideoWatched(course.id, chIdx)) return;
                    modalYtGuardTimer = window.setInterval(() => {
                      if (playerCourseId !== course.id || playerChapterIdx !== chIdx || playerModal.hidden) {
                        stopModalYtGuard();
                        return;
                      }
                      if (isCustomVideoWatched(course.id, chIdx)) {
                        stopModalYtGuard();
                        return;
                      }
                      try {
                        const cur = Number(ytPlayer.getCurrentTime?.() || 0);
                        const state = Number(ytPlayer.getPlayerState?.() ?? -1);
                        if (cur > ytMaxWatched + 2.0) {
                          ytPlayer.seekTo?.(ytMaxWatched, true);
                          if (playerStatus) {
                            playerStatus.textContent = t(
                              "Watch the video to the end once before skipping the timeline. Pause and rewind still work.",
                              "กรุณาดูวิดีโอให้จบอย่างน้อย 1 ครั้งก่อนจึงจะข้าม Timeline ได้ (กดหยุดหรือย้อนกลับได้ตามปกติ)"
                            );
                          }
                          return;
                        }
                        if (state === 1 && cur > ytMaxWatched && cur - ytMaxWatched <= 2.0) {
                          ytMaxWatched = cur;
                        }
                      } catch {
                        // ignore YT polling error
                      }
                    }, 350);
                  },
                  onStateChange: (ev: { data: number }) => {
                    if (ev.data === 0) {
                      markCustomVideoWatched(course.id, chIdx);
                      stopModalYtGuard();
                      handleChapterCompleted(course, chIdx);
                    }
                  }
                }
              });
              activeYtPlayer = ytPlayer;
            });
          }
        }
      } else if (media === "canva") {
        const rawCanva = normalizeCanvaUrlInput(ch.canvaUrl);
        const renderCanvaFrame = (embedUrl: string, directUrl: string): void => {
          playerStage.innerHTML = `
            <iframe class="learn-player-modal__pdf" src="${escHtml(embedUrl)}" title="${escHtml(ch.title)}" allowfullscreen loading="lazy"></iframe>
            <div class="learn-player-canva-bar">
              <span>${t("Canva Slides", "สไลด์ Canva")}</span>
              <a class="learn-cr-btn" href="${escHtml(directUrl)}" target="_blank" rel="noopener noreferrer">${t("Open in Canva", "เปิดใน Canva")} ↗</a>
            </div>
            ${inlineQuizHtml}
          `;
        };
        const renderCanvaFallback = (urlToOpen: string): void => {
          playerStage.innerHTML = `
            <div class="learn-player-modal__empty">
              <strong>${t("Could not embed this Canva link directly", "ไม่สามารถแสดงตัวอย่างสไลด์จากลิงก์นี้ในกรอบโดยตรงได้")}</strong>
              <p>${t("You can still open the Canva slides in a new tab, or paste a Canva share link in Class Studio.", "คุณสามารถกดเปิดดูสไลด์ Canva ในแท็บใหม่ หรือตรวจสอบลิงก์แชร์ใน Class Studio")}</p>
              <a class="learn-cr-btn learn-cr-btn--primary" href="${escHtml(urlToOpen)}" target="_blank" rel="noopener noreferrer">${t("Open in Canva", "เปิดสไลด์ใน Canva")} ↗</a>
            </div>
            ${inlineQuizHtml}
          `;
        };

        if (!rawCanva) {
          playerStage.innerHTML = `
            <div class="learn-player-modal__empty">
              <strong>${t("No Canva Slides link added yet", "ยังไม่ได้ใส่ลิงก์สไลด์ Canva สำหรับบทนี้")}</strong>
              <p>${t("Edit this class in Class Studio to paste any Canva link (canva.com or canva.link).", "กดออกแบบห้องเรียนเพื่อวางลิงก์สไลด์ Canva (รองรับทั้ง canva.com และ canva.link)")}</p>
            </div>
            ${inlineQuizHtml}
          `;
        } else {
          const embedUrl = toCanvaEmbedUrl(rawCanva);
          if (embedUrl) {
            renderCanvaFrame(embedUrl, canvaDirectUrlCache.get(rawCanva) || rawCanva);
          } else if (isCanvaShortUrl(rawCanva)) {
            playerStage.innerHTML = `
              <div class="learn-player-modal__empty">
                <strong>${t("Loading Canva Slides...", "กำลังโหลดสไลด์ Canva...")}</strong>
                <p>${t("Resolving Canva short link for slide embedding.", "กำลังแปลงลิงก์ย่อของ Canva เพื่อแสดงสไลด์")}</p>
              </div>
              ${inlineQuizHtml}
            `;
            void resolveCanvaUrlAsync(rawCanva).then((resolved) => {
              if (!playerModal || playerModal.hidden) return;
              if (resolved?.embedUrl) {
                renderCanvaFrame(resolved.embedUrl, resolved.resolvedUrl);
              } else {
                renderCanvaFallback(rawCanva);
              }
            });
          } else {
            renderCanvaFallback(rawCanva);
          }
        }
      } else if (media === "upload") {
        const blobUrl = sessionVideoUrls.get(`${course.id}:${chIdx}`);
        const mime = (ch.uploadMime || "").toLowerCase();
        const fName = (ch.videoFileName || "").toLowerCase();
        if (blobUrl) {
          if (mime.includes("pdf") || fName.endsWith(".pdf")) {
            playerStage.innerHTML = `<iframe class="learn-player-modal__pdf" src="${escHtml(blobUrl)}" title="${escHtml(ch.title)}"></iframe>${inlineQuizHtml}`;
          } else if (mime.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(fName)) {
            playerStage.innerHTML = `<div class="learn-player-modal__slide-view"><img src="${escHtml(blobUrl)}" alt="${escHtml(ch.title)}"></div>${inlineQuizHtml}`;
          } else {
            const cover = getChapterCover(course, ch, chIdx);
            playerStage.innerHTML = `
              <div class="learn-player-modal__reading">
                <img src="${escHtml(cover)}" alt="${escHtml(ch.title)}">
                <div>
                  <strong>${escHtml(ch.videoFileName || t("Slide Deck Attached", "ไฟล์สไลด์แนบประจำบทเรียน"))}</strong>
                  <p>${escHtml(ch.readingBody || t(ch.summaryEn, ch.summaryTh))}</p>
                </div>
              </div>
              ${inlineQuizHtml}
            `;
          }
        } else {
          const cover = getChapterCover(course, ch, chIdx);
          playerStage.innerHTML = `
            <div class="learn-player-modal__reading">
              <img src="${escHtml(cover)}" alt="${escHtml(ch.title)}">
              <div>
                <strong>${escHtml(ch.videoFileName || t("Slide Deck / Document Attached", "เอกสารสไลด์แนบประจำบทเรียน"))}</strong>
                <p>${escHtml(ch.readingBody || t(ch.summaryEn, ch.summaryTh))}</p>
              </div>
            </div>
            ${inlineQuizHtml}
          `;
        }
      } else {
        const cover = getChapterCover(course, ch, chIdx);
        const bodyText = ch.readingBody || t(ch.summaryEn, ch.summaryTh);
        playerStage.innerHTML = `
          <div class="learn-player-modal__reading">
            <img src="${escHtml(cover)}" alt="${escHtml(ch.title)}">
            <div>
              <strong>Lesson ${chIdx + 1} · ${escHtml(ch.title)}</strong>
              <p style="white-space: pre-line;">${escHtml(bodyText)}</p>
            </div>
          </div>
          ${inlineQuizHtml}
        `;
      }

      updatePlayerFooter(course, chIdx);
      playerModal.hidden = false;
    };

    const toggleFavorite = (courseId: string): void => {
      if (favoriteIds.has(courseId)) favoriteIds.delete(courseId);
      else favoriteIds.add(courseId);
      saveFavorites();
      window.LearningHausQuests?.recordCourseExplored?.(courseId);
      syncFavoriteButtons();
      renderCatalog();
      window.dispatchEvent(new CustomEvent("learninghaus:library-updated", { detail: { courseId } }));
    };

    const closeModal = (): void => {
      if (!modalBackdrop) return;
      modalBackdrop.hidden = true;
      modalCourse = null;
    };

    const openJoinModal = (): void => {
      setPlusMenuOpen(false);
      if (!joinModal) return;
      if (joinMsg) {
        joinMsg.hidden = true;
        joinMsg.textContent = "";
      }
      if (joinInput) joinInput.value = "";
      joinModal.hidden = false;
      joinInput?.focus({ preventScroll: true });
    };

    const closeJoinModal = (): void => {
      if (joinModal) joinModal.hidden = true;
    };

    const openCreateModal = (): void => {
      setPlusMenuOpen(false);
      if (!createModal) return;
      createForm?.reset();
      createModal.hidden = false;
      createNameInput?.focus({ preventScroll: true });
    };

    const closeCreateModal = (): void => {
      if (createModal) createModal.hidden = true;
    };

    const renderModalContent = (course: CourseItem): void => {
      if (modalCover) {
        modalCover.className = `learn-modal__cover is-${course.ratio}`;
        modalCover.innerHTML = renderCoverMarkup(course);
      }
      if (modalChips) {
        modalChips.innerHTML = `
          <span class="learn-modal__chip">${escHtml(catLabel(course))}</span>
          <span class="learn-modal__chip">${SVG_ICONS.book}<span>${lessonCountText(course.chapters.length)}</span></span>
          <span class="learn-modal__chip">${SVG_ICONS.key}<span>${escHtml(course.classCode)}</span></span>
          <span class="learn-modal__chip">${SVG_ICONS.user}<span>${escHtml(course.creator)}</span></span>
        `;
      }
      if (modalTitle) modalTitle.textContent = course.title;
      if (modalDesc) modalDesc.textContent = descText(course);
      if (modalTotal) modalTotal.textContent = t(`Total ${lessonCountText(course.chapters.length)}`, `ทั้งหมด ${course.chapters.length} บทเรียน`);
      if (modalList) {
        modalList.innerHTML = course.chapters
          .map(
            (ch, idx) =>
              `<div class="learn-modal__chapter-item"><b>${idx + 1}</b><span>Chapter ${idx + 1}: ${escHtml(ch.title)}</span></div>`
          )
          .join("");
      }
      if (modalEnterBtn) {
        modalEnterBtn.innerHTML = `<span>${t(`Enter Course (${lessonCountText(course.chapters.length)})`, `เข้าสู่หน้าบทเรียน (${course.chapters.length} บท)`)}</span>${SVG_ICONS.arrowRight}`;
      }
      syncFavoriteButtons();
    };

    const openModal = (courseId: string): void => {
      const course = getAllCombined().find((c) => c.id === courseId);
      if (!course || !modalBackdrop) return;
      modalCourse = course;
      window.LearningHausQuests?.recordCourseExplored?.(course.id);
      renderModalContent(course);
      modalBackdrop.hidden = false;
      modalEnterBtn?.focus({ preventScroll: true });
    };

    const setCategory = (cat: string): void => {
      activeCategory = cat || "all";
      hubEl.querySelectorAll<HTMLButtonElement>("[data-learn-cat]").forEach((btn) => {
        const active = btn.dataset.learnCat === activeCategory;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", String(active));
      });
      renderCatalog();
    };

    const setRoleFilter = (role: "all" | ClassRole): void => {
      activeRoleFilter = role;
      classesEl.querySelectorAll<HTMLButtonElement>("[data-learn-role]").forEach((btn) => {
        const active = btn.dataset.learnRole === activeRoleFilter;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", String(active));
      });
      renderMyClasses();
    };

    // MY CLASSES interactions
    plusToggleBtn?.addEventListener("click", (event) => {
      event.stopPropagation();
      setPlusMenuOpen(Boolean(plusMenu?.hidden));
    });

    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(".learn-plus-wrap")) {
        setPlusMenuOpen(false);
      }
    });

    classesEl.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-learn-open-party]")) {
        setPlusMenuOpen(false);
        void window.LearningHausPartyArena?.open();
        return;
      }
      if (target?.closest("[data-learn-go-explore]")) {
        setSubview("explore");
        return;
      }
      if (target?.closest("[data-learn-open-join]")) {
        openJoinModal();
        return;
      }
      if (target?.closest("[data-learn-open-create]")) {
        openCreateModal();
        return;
      }
      const roleBtn = target?.closest<HTMLButtonElement>("[data-learn-role]");
      if (roleBtn?.dataset.learnRole) {
        const r = roleBtn.dataset.learnRole;
        setRoleFilter(r === "enrolled" || r === "teaching" ? r : "all");
        return;
      }
      const copyBtn = target?.closest<HTMLElement>("[data-copy-code]");
      if (copyBtn?.dataset.copyCode) {
        event.stopPropagation();
        copyClassCode(copyBtn.dataset.copyCode);
        return;
      }
      const editBtn = target?.closest<HTMLElement>("[data-edit-class]");
      if (editBtn?.dataset.editClass) {
        event.stopPropagation();
        openStudio(editBtn.dataset.editClass, 1);
        return;
      }
      const removeBtn = target?.closest<HTMLElement>("[data-remove-class]");
      if (removeBtn?.dataset.removeClass) {
        event.stopPropagation();
        const cid = removeBtn.dataset.removeClass;
        const targetCourse = getAllCombined().find((c) => c.id === cid);
        removeClassMembership(cid);
        renderMyClasses();
        renderCatalog();
        showToast(
          targetCourse?.role === "teaching"
            ? t(`Deleted "${targetCourse.title}"`, `ลบห้องเรียน "${targetCourse.title}" แล้ว`)
            : t(`Removed "${targetCourse?.title || "class"}" from My Classes`, `นำ "${targetCourse?.title || "ห้องเรียน"}" ออกจากห้องเรียนของฉันแล้ว`)
        );
        return;
      }
      const cancelPendingBtn = target?.closest<HTMLElement>("[data-cancel-pending-join]");
      if (cancelPendingBtn?.dataset.cancelPendingJoin) {
        const cid = cancelPendingBtn.dataset.cancelPendingJoin;
        myClassesState.pendingJoinIds = (myClassesState.pendingJoinIds || []).filter((id) => id !== cid);
        const course = getAllCombined().find((c) => c.id === cid);
        const me = getCurrentProfileName();
        if (course && Array.isArray(course.pendingRequests)) {
          course.pendingRequests = course.pendingRequests.filter((r) => r.learnerName !== me);
        }
        saveMyClasses();
        renderMyClasses();
        showToast(t("Join request cancelled.", "ยกเลิกคำขอเข้าร่วมห้องเรียนแล้ว"));
        return;
      }
      const openDeckBtn = target?.closest<HTMLElement>("[data-open-deck]");
      if (openDeckBtn?.dataset.openDeck) {
        showDeck(openDeckBtn.dataset.openDeck);
      }
    });

    classesEl.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("button")) return;
      const openEl = target?.closest<HTMLElement>("[data-open-deck]");
      if (openEl?.dataset.openDeck) {
        event.preventDefault();
        showDeck(openEl.dataset.openDeck);
      }
    });

    // EXPLORE LESSONS interactions
    hubEl.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-learn-back-classes]")) {
        setSubview("classes");
        return;
      }
      if (target?.closest("[data-learn-open-join]")) {
        openJoinModal();
        return;
      }
      const favBtn = target?.closest<HTMLButtonElement>("[data-toggle-fav]");
      if (favBtn?.dataset.toggleFav) {
        event.stopPropagation();
        toggleFavorite(favBtn.dataset.toggleFav);
        return;
      }
      const addBtn = target?.closest<HTMLButtonElement>("[data-add-to-classes]");
      if (addBtn?.dataset.addToClasses) {
        event.stopPropagation();
        const cid = addBtn.dataset.addToClasses;
        const course = getAllCombined().find((c) => c.id === cid);
        addClassMembership(cid);
        renderMyClasses();
        renderCatalog();
        showToast(t(`Added "${course?.title || "class"}" to My Classes!`, `เพิ่ม "${course?.title || "คอร์ส"}" เข้าห้องเรียนของฉันแล้ว`));
        return;
      }
      const cancelPendingBtn = target?.closest<HTMLElement>("[data-cancel-pending-join]");
      if (cancelPendingBtn?.dataset.cancelPendingJoin) {
        const cid = cancelPendingBtn.dataset.cancelPendingJoin;
        myClassesState.pendingJoinIds = (myClassesState.pendingJoinIds || []).filter((id) => id !== cid);
        const course = getAllCombined().find((c) => c.id === cid);
        const me = getCurrentProfileName();
        if (course && Array.isArray(course.pendingRequests)) {
          course.pendingRequests = course.pendingRequests.filter((r) => r.learnerName !== me);
        }
        saveMyClasses();
        renderMyClasses();
        showToast(t("Join request cancelled.", "ยกเลิกคำขอเข้าร่วมห้องเรียนแล้ว"));
        return;
      }
      const openDeckBtn = target?.closest<HTMLElement>("[data-open-deck]");
      if (openDeckBtn?.dataset.openDeck) {
        event.stopPropagation();
        showDeck(openDeckBtn.dataset.openDeck);
        return;
      }
      const catBtn = target?.closest<HTMLButtonElement>("[data-learn-cat]");
      if (catBtn) {
        setCategory(catBtn.dataset.learnCat || "all");
        return;
      }
      const openBtn = target?.closest<HTMLElement>("[data-open-course]");
      if (openBtn?.dataset.openCourse) {
        openModal(openBtn.dataset.openCourse);
      }
    });

    hubEl.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("button")) return;
      const openEl = target?.closest<HTMLElement>("[data-open-course]");
      if (openEl?.dataset.openCourse) {
        event.preventDefault();
        openModal(openEl.dataset.openCourse);
      }
    });

    searchInput?.addEventListener("input", () => {
      searchQuery = searchInput.value;
      if (searchClear) searchClear.hidden = !searchQuery;
      renderCatalog();
    });

    searchClear?.addEventListener("click", () => {
      searchQuery = "";
      if (searchInput) searchInput.value = "";
      searchClear.hidden = true;
      renderCatalog();
      searchInput?.focus();
    });

    // Interactive Facebook-style 3x3 Grid Cover Cropper (3:4 Lesson Cover & 16:5 Class Banner)
    let cropperMode: "studio-cover" | "class-banner" = "studio-cover";
    let cropperImageEl: HTMLImageElement | null = null;
    let cropperScale = 1;
    let cropperBaseScale = 1;
    let cropperOffsetX = 0;
    let cropperOffsetY = 0;
    let cropperDragging = false;
    let cropperDragStartX = 0;
    let cropperDragStartY = 0;
    let cropperDragOriginX = 0;
    let cropperDragOriginY = 0;

    const getCropperViewportSize = (): { w: number; h: number } => {
      const rect = cropperViewport?.getBoundingClientRect();
      if (cropperMode === "class-banner") {
        return {
          w: rect && rect.width > 20 ? rect.width : 340,
          h: rect && rect.height > 20 ? rect.height : 106
        };
      }
      return {
        w: rect && rect.width > 20 ? rect.width : 240,
        h: rect && rect.height > 20 ? rect.height : 320
      };
    };

    const clampCropperOffsets = (): void => {
      if (!cropperImageEl) return;
      const { w: vw, h: vh } = getCropperViewportSize();
      const dispW = cropperImageEl.naturalWidth * cropperBaseScale * cropperScale;
      const dispH = cropperImageEl.naturalHeight * cropperBaseScale * cropperScale;
      const maxX = Math.max(0, (dispW - vw) / 2);
      const maxY = Math.max(0, (dispH - vh) / 2);
      cropperOffsetX = Math.max(-maxX, Math.min(maxX, cropperOffsetX));
      cropperOffsetY = Math.max(-maxY, Math.min(maxY, cropperOffsetY));
    };

    const syncCropperTransform = (): void => {
      if (!cropperImg || !cropperImageEl) return;
      clampCropperOffsets();
      const dispW = cropperImageEl.naturalWidth * cropperBaseScale * cropperScale;
      const dispH = cropperImageEl.naturalHeight * cropperBaseScale * cropperScale;
      cropperImg.style.width = `${dispW}px`;
      cropperImg.style.height = `${dispH}px`;
      cropperImg.style.transform = `translate(calc(-50% + ${cropperOffsetX}px), calc(-50% + ${cropperOffsetY}px))`;
      if (cropperZoom) cropperZoom.value = String(Math.round(cropperScale * 100));
      if (cropperZoomLabel) cropperZoomLabel.textContent = `${Math.round(cropperScale * 100)}%`;
    };

    const closeCoverCropper = (): void => {
      if (cropperModal) cropperModal.hidden = true;
      if (cropperMode === "class-banner" && !selectedCreateBannerImage && createBgInput) {
        createBgInput.value = "";
      }
      cropperImageEl = null;
    };

    const openCoverCropper = (src: string, mode: "studio-cover" | "class-banner" = "studio-cover"): void => {
      if (!cropperModal || !cropperImg) return;
      cropperMode = mode;
      const isBanner = mode === "class-banner";
      cropperViewport?.classList.toggle("is-banner", isBanner);
      if (cropperTitleEl) {
        cropperTitleEl.textContent = isBanner
          ? t("Crop Class Background Image", "เลือกส่วนภาพพื้นหลังห้องเรียน")
          : t("Crop 3:4 Lesson Cover", "เลือกกรอบภาพปก 3:4");
      }
      if (cropperHintEl) {
        cropperHintEl.textContent = isBanner
          ? t("Drag and zoom inside the 3x3 grid to choose which part of the photo appears on the class header.", "ลากและซูมบนเส้น Grid เพื่อเลือกส่วนของภาพที่จะแสดงบนหัวการ์ดห้องเรียน")
          : t("Drag the photo to position and use the slider to zoom inside the 3:4 frame.", "ลากภาพเพื่อจัดตำแหน่ง และเลื่อนสไลเดอร์เพื่อซูมเลือกส่วนที่ต้องการในกรอบ 3:4");
      }
      if (cropperApplyBtn) {
        cropperApplyBtn.textContent = isBanner
          ? t("Use Selected Region", "ใช้ภาพส่วนที่เลือก")
          : t("Apply 3:4 Crop", "ใช้ภาพที่เลือก");
      }
      const img = new Image();
      img.onload = () => {
        cropperImageEl = img;
        cropperModal.hidden = false;
        const { w: vw, h: vh } = getCropperViewportSize();
        cropperBaseScale = Math.max(vw / img.naturalWidth, vh / img.naturalHeight);
        cropperScale = 1;
        cropperOffsetX = 0;
        cropperOffsetY = 0;
        cropperImg.src = src;
        syncCropperTransform();
      };
      img.src = src;
    };

    const applyCoverCrop = (): void => {
      if (!cropperImageEl) return;
      const { w: vw, h: vh } = getCropperViewportSize();
      const totalScale = cropperBaseScale * cropperScale;
      const dispW = cropperImageEl.naturalWidth * totalScale;
      const dispH = cropperImageEl.naturalHeight * totalScale;
      const imgLeft = vw / 2 - dispW / 2 + cropperOffsetX;
      const imgTop = vh / 2 - dispH / 2 + cropperOffsetY;
      const sx = Math.max(0, -imgLeft / totalScale);
      const sy = Math.max(0, -imgTop / totalScale);
      const sw = Math.min(cropperImageEl.naturalWidth - sx, vw / totalScale);
      const sh = Math.min(cropperImageEl.naturalHeight - sy, vh / totalScale);

      const isBanner = cropperMode === "class-banner";
      const outW = isBanner ? 960 : 600;
      const outH = isBanner ? 300 : 800;
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(cropperImageEl, sx, sy, sw, sh, 0, 0, outW, outH);
      let outUrl = "";
      try {
        outUrl = canvas.toDataURL("image/webp", 0.85);
      } catch {
        outUrl = canvas.toDataURL("image/jpeg", 0.85);
      }

      if (isBanner) {
        selectedCreateBannerImage = outUrl;
        if (createBgImg) createBgImg.src = outUrl;
        if (createBgPreview) createBgPreview.hidden = false;
        closeCoverCropper();
        showToast(t("Class background cropped and ready!", "เลือกส่วนภาพพื้นหลังห้องเรียนเรียบร้อย"));
        return;
      }

      const course = getStudioCourse();
      if (!course) return;
      const mutable = [...course.chapters];
      mutable[studioChapterIdx] = { ...mutable[studioChapterIdx], cover: outUrl };
      course.chapters = mutable;
      if (studioImgErr) studioImgErr.hidden = true;
      saveMyClasses();
      renderStudio();
      closeCoverCropper();
      showToast(t("3:4 cover cropped and saved!", "ครอปและบันทึกภาพปก 3:4 เรียบร้อย"));
    };

    const cropperDragSurface = cropperStageWrap || cropperViewport;
    cropperDragSurface?.addEventListener("pointerdown", (event) => {
      if (!cropperImageEl) return;
      event.preventDefault();
      window.getSelection()?.removeAllRanges();
      cropperDragging = true;
      cropperDragStartX = event.clientX;
      cropperDragStartY = event.clientY;
      cropperDragOriginX = cropperOffsetX;
      cropperDragOriginY = cropperOffsetY;
      try {
        cropperDragSurface.setPointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    });
    cropperDragSurface?.addEventListener("pointermove", (event) => {
      if (!cropperDragging) return;
      cropperOffsetX = cropperDragOriginX + (event.clientX - cropperDragStartX);
      cropperOffsetY = cropperDragOriginY + (event.clientY - cropperDragStartY);
      syncCropperTransform();
    });
    const endCropDrag = (): void => {
      cropperDragging = false;
    };
    cropperDragSurface?.addEventListener("pointerup", endCropDrag);
    cropperDragSurface?.addEventListener("pointercancel", endCropDrag);
    cropperZoom?.addEventListener("input", () => {
      cropperScale = Math.max(1, Math.min(2.6, (Number(cropperZoom.value) || 100) / 100));
      syncCropperTransform();
    });
    cropperModal?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (target === cropperModal || target?.closest("[data-learn-cropper-close]")) {
        closeCoverCropper();
        return;
      }
      if (target?.closest("[data-cropper-reset]")) {
        cropperScale = 1;
        cropperOffsetX = 0;
        cropperOffsetY = 0;
        syncCropperTransform();
        return;
      }
      if (target?.closest("[data-cropper-apply]")) {
        applyCoverCrop();
      }
    });

    // Class Join Approval Requests Modal
    const renderRequestsModal = (course: CourseItem): void => {
      if (!requestsListEl) return;
      if (requestsApprovalToggle) requestsApprovalToggle.checked = Boolean(course.requireApproval);
      const pending = Array.isArray(course.pendingRequests) ? course.pendingRequests : [];
      if (!pending.length) {
        requestsListEl.innerHTML = `
          <div class="learn-requests__empty">
            <p>${
              course.requireApproval
                ? t("No pending join requests yet. Learners using your Class Code will appear here for approval.", "ยังไม่มีคำขอเข้าร่วมห้องเรียน ผู้ที่กรอกรหัสห้องจะแสดงที่นี่เพื่อให้คุณกดอนุมัติ")
                : t("Open join is enabled. Turn on approval above to review learners before they enter.", "ตอนนี้เปิดรับเข้าห้องอัตโนมัติ เปิดสวิตช์ด้านบนหากต้องการตรวจสอบและอนุมัติผู้เรียนก่อน")
            }</p>
            <button type="button" class="learn-cr-btn learn-cr-btn--soft" data-requests-add-demo>${t("Add Sample Request (Test)", "จำลองคำขอเข้าห้อง (ทดสอบ)")}</button>
          </div>
        `;
        return;
      }
      requestsListEl.innerHTML = pending
        .map(
          (req) => `
            <div class="learn-requests__row" data-req-id="${escHtml(req.id)}">
              <div class="learn-requests__info">
                <strong>${escHtml(req.learnerName)}</strong>
                <small>${t("Requested via Class Code", "ขอเข้าร่วมด้วยรหัสห้องเรียน")}</small>
              </div>
              <div class="learn-requests__actions">
                <button type="button" class="learn-cr-btn learn-cr-btn--primary" data-req-approve="${escHtml(req.id)}">${t("Approve", "อนุมัติ")}</button>
                <button type="button" class="learn-cr-btn" data-req-decline="${escHtml(req.id)}">${t("Decline", "ปฏิเสธ")}</button>
              </div>
            </div>
          `
        )
        .join("");
    };

    const openRequestsModal = (): void => {
      const course = getActiveCourse();
      if (!requestsModal || !course.isCustom || course.role !== "teaching") return;
      renderRequestsModal(course);
      requestsModal.hidden = false;
    };

    const closeRequestsModal = (): void => {
      if (requestsModal) requestsModal.hidden = true;
    };

    deckRequestsBtn?.addEventListener("click", openRequestsModal);
    requestsApprovalToggle?.addEventListener("change", () => {
      const course = getActiveCourse();
      if (!course.isCustom) return;
      course.requireApproval = requestsApprovalToggle.checked;
      saveMyClasses();
      renderRequestsModal(course);
      renderDeckForCourse(course);
      showToast(
        course.requireApproval
          ? t("Join approval enabled for this class.", "เปิดโหมดต้องอนุมัติก่อนเข้าห้องนี้แล้ว")
          : t("Open join enabled (no approval needed).", "ปิดโหมดอนุมัติแล้ว (เข้าด้วยรหัสได้ทันที)")
      );
    });
    requestsModal?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (target === requestsModal || target?.closest("[data-learn-requests-close]")) {
        closeRequestsModal();
        return;
      }
      const course = getActiveCourse();
      if (!course.isCustom) return;
      if (target?.closest("[data-requests-add-demo]")) {
        addSampleJoinRequest(course.id);
        renderRequestsModal(course);
        renderDeckForCourse(course);
        renderMyClasses();
        return;
      }
      const approveBtn = target?.closest<HTMLElement>("[data-req-approve]");
      if (approveBtn?.dataset.reqApprove) {
        const res = approveJoinRequest(course.id, approveBtn.dataset.reqApprove);
        if (res.ok && res.learnerName) {
          showToast(t(`Approved ${res.learnerName}!`, `อนุมัติ ${res.learnerName} เข้าห้องเรียนแล้ว`));
        }
        renderRequestsModal(course);
        renderDeckForCourse(course);
        renderMyClasses();
        return;
      }
      const declineBtn = target?.closest<HTMLElement>("[data-req-decline]");
      if (declineBtn?.dataset.reqDecline) {
        const res = declineJoinRequest(course.id, declineBtn.dataset.reqDecline);
        renderRequestsModal(course);
        renderDeckForCourse(course);
        renderMyClasses();
        if (res.ok && res.learnerName) {
          showToast(t(`Declined ${res.learnerName}.`, `ปฏิเสธคำขอของ ${res.learnerName} แล้ว`));
        }
      }
    });

    studioApprovalToggle?.addEventListener("change", () => {
      const course = getStudioCourse();
      if (!course) return;
      course.requireApproval = studioApprovalToggle.checked;
      saveMyClasses();
      renderStudioQuestsStep(course);
      window.dispatchEvent(new Event("learninghaus:quest-updated"));
      showToast(
        course.requireApproval
          ? t("Locked class enabled (Bonus EXP set to 0).", "เปิดล็อคห้องแล้ว (โบนัส EXP ของเควสต์จะถูกตั้งเป็น 0)")
          : t("Learners can join immediately with the Class Code.", "ตั้งค่าให้เข้าห้องด้วยรหัสได้ทันที (เปิดรับโบนัส EXP แล้ว)")
      );
    });

    // CHAPTER DECK interactions
    backHubBtn?.addEventListener("click", () => setSubview("classes"));
    deckEditBtn?.addEventListener("click", () => {
      const current = getActiveCourse();
      if (current.isCustom && current.role === "teaching") openStudio(current.id, 1);
    });
    deckCodeBtn?.addEventListener("click", () => {
      if (deckCodeBtn.dataset.copyCode) copyClassCode(deckCodeBtn.dataset.copyCode);
    });
    deckFavBtn?.addEventListener("click", () => toggleFavorite(getActiveCourse().id));
    deckEl.querySelector<HTMLButtonElement>("[data-learn-enter-quiz]")?.addEventListener("click", () => {
      enterCourseQuiz(getActiveCourse().id);
    });
    homeView.querySelector<HTMLElement>('[data-home-panel="lesson"] [data-home-nav="quiz"]')?.addEventListener("click", () => {
      setActiveCourse(getActiveCourse().id);
    });

    const syncCustomStackInPlace = (container: HTMLElement, course: CourseItem, nextIdx: number): void => {
      const len = Math.max(1, course.chapters.length);
      const safeIdx = ((nextIdx % len) + len) % len;
      if (container === deckCustomWrap) customSelectedChIdx = safeIdx;
      const cards = Array.from(container.querySelectorAll<HTMLButtonElement>(".learn-eu-stack__card"));
      cards.forEach((card, idx) => {
        const offset = (idx - safeIdx + len) % len;
        card.classList.remove("is-active", "is-next", "is-next-2", "is-next-3");
        if (offset === 0) card.classList.add("is-active");
        else if (offset === 1) card.classList.add("is-next");
        else if (offset === 2) card.classList.add("is-next-2");
        else if (offset === 3) card.classList.add("is-next-3");
        card.setAttribute("aria-pressed", String(offset === 0));
        card.tabIndex = offset < 4 ? 0 : -1;
      });
      const startBtn = container.querySelector<HTMLButtonElement>("[data-open-custom-lesson]");
      if (startBtn) startBtn.dataset.openCustomLesson = String(safeIdx);

      const ch = course.chapters[safeIdx];
      const passPct = Math.max(10, Math.min(100, Number(course.passPercent) || 80));
      const pts = getCustomPointsSummary(course);
      const activeDone = isChapterDone(course.id, safeIdx);
      const activePts = Math.max(10, Math.min(500, Number(ch?.points) || 100));
      const progTitle = container.querySelector<HTMLElement>(".home-progress__title");
      const progLabels = container.querySelector<HTMLElement>(".home-progress__labels");
      const progFill = container.querySelector<HTMLElement>(".home-progress__meter span");
      if (progTitle) progTitle.textContent = `${t("Chapter", "บทที่")} ${safeIdx + 1} - ${ch?.title || ""}`;
      if (progLabels) {
        progLabels.innerHTML = `
          <span>${t("Your score", "คะแนนของคุณ")} · ${activeDone ? activePts : 0}/${activePts} ${t("pts", "คะแนน")}</span>
          <span>${pts.pct} %</span>
        `;
      }
      if (progFill) progFill.style.width = `${pts.pct}%`;
    };

    deckCustomWrap?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      const stack = target?.closest<HTMLElement>(".learn-eu-stack");
      if (stack?.dataset.justDragged === "1") return;

      const pickFan = target?.closest<HTMLElement>("[data-custom-pick-ch]");
      if (pickFan) {
        const idx = Number(pickFan.dataset.customPickCh) || 0;
        const course = getActiveCourse();
        if (idx === customSelectedChIdx) {
          openLessonPlayer(course, idx);
        } else {
          syncCustomStackInPlace(deckCustomWrap, course, idx);
        }
        return;
      }
      const openCustom = target?.closest<HTMLElement>("[data-open-custom-lesson]");
      if (openCustom) {
        const idx = Number(openCustom.dataset.openCustomLesson) || 0;
        customSelectedChIdx = idx;
        openLessonPlayer(getActiveCourse(), idx);
        return;
      }
      const btn = target?.closest<HTMLElement>("[data-open-eu-sample-lesson]");
      if (!btn) return;
      const chapter = Number(btn.dataset.openEuSampleLesson) || 1;
      const courseId = getActiveCourse().id;
      addClassMembership(courseId);
      homeView.dispatchEvent(new CustomEvent("learninghaus:lesson-open", { detail: { chapter, courseId } }));
      const lessonPanel = homeView.querySelector<HTMLElement>('[data-home-panel="lesson"]');
      if (lessonPanel) {
        document.querySelectorAll<HTMLElement>("[data-home-panel]").forEach((p) => {
          p.hidden = p.dataset.homePanel !== "lesson";
        });
        homeView.dataset.activePanel = "lesson";
      }
    });

    // MINIMAL 2-STEP CLASS STUDIO interactions
    studioEl?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      const course = getStudioCourse();
      if (target?.closest("[data-studio-back]")) {
        setSubview("classes");
        return;
      }
      const copyBtn = target?.closest<HTMLElement>("[data-copy-code]");
      if (copyBtn?.dataset.copyCode) {
        copyClassCode(copyBtn.dataset.copyCode);
        return;
      }
      const stepBtn = target?.closest<HTMLElement>("[data-studio-step]");
      if (stepBtn?.dataset.studioStep) {
        LearningHausCustomQuizStudio.stopThemeBgm();
        const s = Number(stepBtn.dataset.studioStep);
        studioStep = s === 3 ? 3 : s === 2 ? 2 : 1;
        renderStudio();
        homeView.querySelector(".home-main")?.scrollTo(0, 0);
        return;
      }
      if (!course) return;

      if (target?.closest("[data-studio-quest-add]")) {
        const pool = getClassRewardPool(course.id);
        const objType = ((studioQuestTypeSelect?.value || "complete-lessons") as CourseQuestObjectiveType);
        const targetVal = Math.max(1, Number(studioQuestTargetSelect?.value) || 1);
        const poolId = studioQuestRewardSelect?.value || pool[0]?.poolId || "pool-0";
        const rewardItem = pool.find((p) => p.poolId === poolId) || pool[0];
        const expPolicy = getCreatorExpPolicy(course);
        const xpReward = expPolicy.isLocked
          ? 0
          : Math.min(expPolicy.maxExp, Math.max(40, Number(studioQuestXpSelect?.value) || 40));
        const customTitle = (studioQuestTitleInput?.value || "").trim();
        const chTitle = course.chapters[targetVal - 1]?.title || `Lesson ${targetVal}`;

        let autoTitleEn = `Complete ${targetVal} ${targetVal === 1 ? "Lesson" : "Lessons"} in ${course.title}`;
        let autoTitleTh = `เรียนจบครบ ${targetVal} บทเรียนในคลาส ${course.title}`;
        let descEn = `Complete ${targetVal} ${targetVal === 1 ? "lesson" : "lessons"} in ${course.title} to claim ${rewardItem.nameEn}.`;
        let descTh = `เรียนจบครบ ${targetVal} บทเรียนในคลาส ${course.title} เพื่อรับ ${rewardItem.nameTh}`;

        if (objType === "complete-chapter") {
          autoTitleEn = `Complete Lesson ${targetVal}: ${chTitle}`;
          autoTitleTh = `เรียนจบบทที่ ${targetVal}: ${chTitle}`;
          descEn = `Complete Lesson ${targetVal} ("${chTitle}") in ${course.title} to unlock ${rewardItem.nameEn}.`;
          descTh = `เรียนจบบทที่ ${targetVal} ("${chTitle}") ในคลาส ${course.title} เพื่อรับ ${rewardItem.nameTh}`;
        } else if (objType === "media-finish") {
          autoTitleEn = `Read Slides / Watch Video: ${chTitle}`;
          autoTitleTh = `เปิดอ่านสไลด์/บทความ หรือดูวิดีโอจบ: ${chTitle}`;
          descEn = `Finish reading the slides/article or watching the video in Lesson ${targetVal} ("${chTitle}") to claim ${rewardItem.nameEn}.`;
          descTh = `เปิดอ่านสไลด์/บทความ หรือดูวิดีโอของบทที่ ${targetVal} ("${chTitle}") จนจบเพื่อรับ ${rewardItem.nameTh}`;
        } else if (objType === "quiz-pass") {
          autoTitleEn = `Pass Quiz in Lesson ${targetVal}: ${chTitle}`;
          autoTitleTh = `ผ่านควิซบทที่ ${targetVal}: ${chTitle}`;
          descEn = `Pass the lesson quiz in Lesson ${targetVal} ("${chTitle}") to unlock ${rewardItem.nameEn}.`;
          descTh = `ทำควิซของบทที่ ${targetVal} ("${chTitle}") ผ่านเกณฑ์เพื่อรับ ${rewardItem.nameTh}`;
        } else if (objType === "complete-course") {
          const allCount = Math.max(1, course.chapters.length);
          autoTitleEn = `Complete All ${allCount} Lessons in ${course.title}`;
          autoTitleTh = `เรียนจบครบทุกบท (${allCount} บท) ในคลาส ${course.title}`;
          descEn = `Finish every lesson in ${course.title} to claim ${rewardItem.nameEn}.`;
          descTh = `เรียนจบครบทุกบทในคลาส ${course.title} เพื่อรับ ${rewardItem.nameTh}`;
        }

        const nextQuest: CustomCourseQuest = {
          id: `cquest-${course.id}-${Date.now().toString(36)}`,
          courseId: course.id,
          objectiveType: objType,
          targetValue: objType === "complete-course" ? Math.max(1, course.chapters.length) : targetVal,
          titleEn: customTitle || autoTitleEn,
          titleTh: customTitle || autoTitleTh,
          descEn,
          descTh,
          rewardPoolId: rewardItem.poolId,
          xpReward,
          propRewardId: rewardItem.propRewardId,
          bgRewardId: rewardItem.bgRewardId
        };

        const existingQuests = [...getCourseQuests(course.id)];
        existingQuests.push(nextQuest);
        course.customQuests = existingQuests;
        myClassesState.courseQuestsByCourse = myClassesState.courseQuestsByCourse || {};
        myClassesState.courseQuestsByCourse[course.id] = existingQuests;
        if (studioQuestTitleInput) studioQuestTitleInput.value = "";
        saveMyClasses();
        renderStudioQuestsStep(course);
        window.dispatchEvent(new Event("learninghaus:quest-updated"));
        showToast(t("Course Quest assigned to class!", "มอบหมายเควสต์ประจำคลาสเรียบร้อยแล้ว!"));
        return;
      }

      const delQuestBtn = target?.closest<HTMLElement>("[data-studio-del-quest]");
      if (delQuestBtn?.dataset.studioDelQuest) {
        const qid = delQuestBtn.dataset.studioDelQuest;
        const remaining = getCourseQuests(course.id).filter((q) => q.id !== qid);
        course.customQuests = remaining;
        myClassesState.courseQuestsByCourse = myClassesState.courseQuestsByCourse || {};
        myClassesState.courseQuestsByCourse[course.id] = remaining;
        saveMyClasses();
        renderStudioQuestsStep(course);
        window.dispatchEvent(new Event("learninghaus:quest-updated"));
        showToast(t("Removed quest from class.", "ลบเควสต์ออกจากคลาสแล้ว"));
        return;
      }

      const layoutBtn = target?.closest<HTMLElement>("[data-studio-layout]");
      if (layoutBtn?.dataset.studioLayout) {
        const v = layoutBtn.dataset.studioLayout as ClassLayoutStyle;
        course.layoutStyle = v;
        saveMyClasses();
        renderStudio();
        return;
      }
      const ratioBtn = target?.closest<HTMLElement>("[data-studio-ratio]");
      if (ratioBtn?.dataset.studioRatio) {
        const nextRatio = ratioBtn.dataset.studioRatio as CardAspectRatio;
        const cfg = getRatioConfig(nextRatio);
        course.cardRatio = nextRatio;
        course.cardWidth = cfg.m;
        course.cardSizeCustom = true;
        if (studioRatioTip) studioRatioTip.hidden = true;
        saveMyClasses();
        renderStudio();
        return;
      }
      const applyRatioBtn = target?.closest<HTMLElement>("[data-studio-apply-ratio]");
      if (applyRatioBtn?.dataset.studioApplyRatio) {
        const nextRatio = applyRatioBtn.dataset.studioApplyRatio as CardAspectRatio;
        const cfg = getRatioConfig(nextRatio);
        course.cardRatio = nextRatio;
        course.cardWidth = cfg.m;
        course.cardSizeCustom = true;
        if (studioRatioTip) studioRatioTip.hidden = true;
        saveMyClasses();
        renderStudio();
        showToast(t(`Adjusted classroom cards to ${nextRatio}!`, `ปรับเลย์เอาต์การ์ดห้องเรียนเป็น ${nextRatio} แล้ว`));
        return;
      }
      const sizePresetBtn = target?.closest<HTMLElement>("[data-studio-size-preset]");
      if (sizePresetBtn?.dataset.studioSizePreset) {
        const cfg = getRatioConfig(course.cardRatio || "3/4");
        const key = sizePresetBtn.dataset.studioSizePreset as "s" | "m" | "l";
        course.cardWidth = cfg[key];
        course.cardSizeCustom = true;
        saveMyClasses();
        renderStudio();
        return;
      }
      const passBtn = target?.closest<HTMLElement>("[data-studio-pass]");
      if (passBtn?.dataset.studioPass) {
        course.passPercent = Math.max(10, Math.min(100, Number(passBtn.dataset.studioPass) || 80));
        saveMyClasses();
        renderStudio();
        return;
      }
      const pickPreview = target?.closest<HTMLElement>("[data-studio-pick-ch]");
      if (pickPreview?.dataset.studioPickCh) {
        const previewStack = target?.closest<HTMLElement>(".learn-eu-stack");
        if (previewStack?.dataset.justDragged === "1") return;
        studioChapterIdx = Number(pickPreview.dataset.studioPickCh) || 0;
        if (studioPreviewHost && previewStack) {
          syncCustomStackInPlace(studioPreviewHost, course, studioChapterIdx);
        } else {
          renderStudio();
        }
        return;
      }
      const selectCh = target?.closest<HTMLElement>("[data-studio-select-ch]");
      if (selectCh?.dataset.studioSelectCh) {
        LearningHausCustomQuizStudio.stopThemeBgm();
        studioChapterIdx = Number(selectCh.dataset.studioSelectCh) || 0;
        if (studioImgErr) studioImgErr.hidden = true;
        if (studioVidErr) studioVidErr.hidden = true;
        renderStudio();
        return;
      }
      if (target?.closest("[data-studio-add-ch]")) {
        const nextNum = course.chapters.length + 1;
        const defaults = ["lesson-assets/ext/chapters/Chapter1.png", "lesson-assets/ext/chapters/Chapter2.png", "lesson-assets/ext/chapters/Chapter3.png"];
        const mutable = [...course.chapters];
        mutable.push({
          title: `Lesson ${nextNum}`,
          summaryEn: "Key concepts and practice for this lesson.",
          summaryTh: "สรุปแนวคิดสำคัญและแบบฝึกหัดของบทเรียนนี้",
          points: 100,
          cover: defaults[(nextNum - 1) % defaults.length],
          mediaType: "youtube",
          youtubeUrl: ""
        });
        course.chapters = mutable;
        studioChapterIdx = mutable.length - 1;
        saveMyClasses();
        renderStudio();
        return;
      }
      if (target?.closest("[data-studio-del-ch]") && course.chapters.length > 1) {
        const mutable = [...course.chapters];
        mutable.splice(studioChapterIdx, 1);
        course.chapters = mutable;
        studioChapterIdx = Math.max(0, studioChapterIdx - 1);
        saveMyClasses();
        renderStudio();
        return;
      }
      if (target?.closest("[data-studio-crop-current]")) {
        const currentCh = course.chapters[studioChapterIdx];
        if (currentCh) openCoverCropper(getChapterCover(course, currentCh, studioChapterIdx));
        return;
      }
      const presetBtn = target?.closest<HTMLElement>("[data-studio-preset-img]");
      if (presetBtn?.dataset.studioPresetImg) {
        const imgSrc = presetBtn.dataset.studioPresetImg;
        const mutable = [...course.chapters];
        mutable[studioChapterIdx] = { ...mutable[studioChapterIdx], cover: imgSrc };
        course.chapters = mutable;
        if (studioImgErr) studioImgErr.hidden = true;
        if (studioRatioTip) studioRatioTip.hidden = true;
        saveMyClasses();
        renderStudio();
        return;
      }
      const mediaBtn = target?.closest<HTMLElement>("[data-studio-media]");
      if (mediaBtn?.dataset.studioMedia) {
        const mutable = [...course.chapters];
        mutable[studioChapterIdx] = { ...mutable[studioChapterIdx], mediaType: mediaBtn.dataset.studioMedia as ChapterMediaType };
        course.chapters = mutable;
        if (studioVidErr) studioVidErr.hidden = true;
        saveMyClasses();
        renderStudio();
        return;
      }
      if (target?.closest("[data-studio-finish]")) {
        saveMyClasses();
        showDeck(course.id);
        showToast(t("Classroom saved!", "บันทึกการออกแบบห้องเรียนเรียบร้อย"));
      }
    });

    studioChTitleInput?.addEventListener("input", () => {
      const course = getStudioCourse();
      if (!course) return;
      const mutable = [...course.chapters];
      mutable[studioChapterIdx] = { ...mutable[studioChapterIdx], title: studioChTitleInput.value };
      course.chapters = mutable;
      saveMyClasses();
    });

    studioChPtsInput?.addEventListener("input", () => {
      const course = getStudioCourse();
      if (!course) return;
      const pts = Math.max(10, Math.min(500, Number(studioChPtsInput.value) || 10));
      const mutable = [...course.chapters];
      mutable[studioChapterIdx] = { ...mutable[studioChapterIdx], points: pts };
      course.chapters = mutable;
      saveMyClasses();
    });

    studioChDescInput?.addEventListener("input", () => {
      const course = getStudioCourse();
      if (!course) return;
      const mutable = [...course.chapters];
      mutable[studioChapterIdx] = {
        ...mutable[studioChapterIdx],
        summaryEn: studioChDescInput.value,
        summaryTh: studioChDescInput.value
      };
      course.chapters = mutable;
      saveMyClasses();
    });

    studioYtInput?.addEventListener("input", () => {
      const course = getStudioCourse();
      if (!course) return;
      const mutable = [...course.chapters];
      mutable[studioChapterIdx] = { ...mutable[studioChapterIdx], youtubeUrl: studioYtInput.value.trim() };
      course.chapters = mutable;
      saveMyClasses();
    });

    studioCanvaInput?.addEventListener("input", () => {
      const course = getStudioCourse();
      if (!course) return;
      const mutable = [...course.chapters];
      mutable[studioChapterIdx] = { ...mutable[studioChapterIdx], canvaUrl: studioCanvaInput.value.trim() };
      course.chapters = mutable;
      saveMyClasses();
    });

    studioCanvaInput?.addEventListener("change", () => {
      const course = getStudioCourse();
      if (!course) return;
      const targetCourseId = course.id;
      const targetIdx = studioChapterIdx;
      const raw = normalizeCanvaUrlInput(studioCanvaInput.value);
      if (!raw || !isCanvaShortUrl(raw)) return;
      void resolveCanvaUrlAsync(raw).then((resolved) => {
        if (!resolved?.resolvedUrl) return;
        const latestCourse = getCourseById(targetCourseId);
        if (!latestCourse || !latestCourse.chapters[targetIdx]) return;
        const mutable = [...latestCourse.chapters];
        mutable[targetIdx] = { ...mutable[targetIdx], canvaUrl: resolved.resolvedUrl };
        latestCourse.chapters = mutable;
        if (getStudioCourse()?.id === targetCourseId && studioChapterIdx === targetIdx && studioCanvaInput) {
          studioCanvaInput.value = resolved.resolvedUrl;
        }
        saveMyClasses();
        showToast(t("Converted Canva short link for slide embedding!", "แปลงลิงก์สไลด์ Canva เรียบร้อยแล้ว!"));
      });
    });

    studioReadingBody?.addEventListener("input", () => {
      const course = getStudioCourse();
      if (!course) return;
      const mutable = [...course.chapters];
      mutable[studioChapterIdx] = { ...mutable[studioChapterIdx], readingBody: studioReadingBody.value };
      course.chapters = mutable;
      saveMyClasses();
    });

    const syncStudioQuizToChapter = (): void => {
      const course = getStudioCourse();
      if (!course) return;
      const enabled = Boolean(studioQuizEnabled?.checked);
      if (!enabled) LearningHausCustomQuizStudio.stopThemeBgm();
      if (studioQuizFields) studioQuizFields.hidden = !enabled;
      const mutable = [...course.chapters];
      const current = { ...mutable[studioChapterIdx], hasQuiz: enabled };
      if (enabled) {
        LearningHausCustomQuizStudio.ensureLessonQuizConfig(current, studioChapterIdx);
        if (!current.quizStages?.length) {
          current.quizStages = [LearningHausCustomQuizStudio.createDefaultStage(1, current.title)];
        }
      }
      mutable[studioChapterIdx] = current;
      course.chapters = mutable;
      saveMyClasses();
      const quizMapHost = studioEl?.querySelector<HTMLElement>("[data-studio-quiz-map-host]");
      if (quizMapHost && enabled) {
        LearningHausCustomQuizStudio.renderStudioBuilder(quizMapHost, course, studioChapterIdx, () => {
          saveMyClasses();
        });
      }
    };

    studioQuizEnabled?.addEventListener("change", syncStudioQuizToChapter);

    studioQuestTypeSelect?.addEventListener("change", () => {
      const course = getStudioCourse();
      if (course) populateStudioQuestTargetOptions(course);
    });

    studioImgInput?.addEventListener("change", () => {
      const file = studioImgInput.files?.[0];
      const course = getStudioCourse();
      studioImgInput.value = "";
      if (!file || !course) return;

      if (!/^image\/(png|jpeg|webp)$/i.test(file.type)) {
        if (studioImgErr) {
          studioImgErr.textContent = t("Unsupported file type. Please use PNG, JPG, or WebP.", "รองรับเฉพาะไฟล์ภาพ PNG, JPG หรือ WebP เท่านั้น");
          studioImgErr.hidden = false;
        }
        return;
      }
      if (file.size > IMAGE_MAX_BYTES) {
        if (studioImgErr) {
          studioImgErr.textContent = t(
            `Image is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Max allowed size is 2 MB.`,
            `วางรูปไม่ได้: ไฟล์ขนาด ${(file.size / 1024 / 1024).toFixed(2)} MB เกินกำหนดสูงสุด 2 MB`
          );
          studioImgErr.hidden = false;
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result || "");
        const img = new Image();
        img.onload = () => {
          if (img.width < IMAGE_MIN_PX || img.height < IMAGE_MIN_PX || img.width > IMAGE_MAX_PX || img.height > IMAGE_MAX_PX) {
            if (studioImgErr) {
              studioImgErr.textContent = t(
                `Image dimensions (${img.width}×${img.height}px) must be between 300×300px and 2400×2400px.`,
                `วางรูปไม่ได้: ขนาดภาพ ${img.width}×${img.height}px อยู่นอกช่วง 300–2400px`
              );
              studioImgErr.hidden = false;
            }
            return;
          }
          if (studioImgErr) studioImgErr.hidden = true;
          if (studioRatioTip) studioRatioTip.hidden = true;
          openCoverCropper(dataUrl);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });

    studioVidInput?.addEventListener("change", () => {
      const file = studioVidInput.files?.[0];
      const course = getStudioCourse();
      studioVidInput.value = "";
      if (!file || !course) return;

      if (file.type.startsWith("video/") || /\.(mp4|webm|mov|avi|mkv)$/i.test(file.name)) {
        if (studioVidErr) {
          studioVidErr.innerHTML = `
            <span>${t(
              "Direct video uploads are disabled. Please paste a YouTube link for videos, or upload PDF / slide files here.",
              "ไม่อนุญาตให้อัปโหลดไฟล์วิดีโอโดยตรง กรุณาใช้ลิงก์ YouTube สำหรับวิดีโอ หรือแนบไฟล์ PDF / สไลด์เท่านั้น"
            )}</span>
            <button type="button" class="learn-cr-btn learn-cr-btn--primary learn-studio__switch-yt" data-studio-media="youtube">${t("Use YouTube Link →", "ใช้ลิงก์ YouTube แทน →")}</button>
          `;
          studioVidErr.hidden = false;
        }
        return;
      }

      if (file.size > VIDEO_MAX_BYTES) {
        const mb = (file.size / 1024 / 1024).toFixed(1);
        if (studioVidErr) {
          studioVidErr.innerHTML = `
            <span>${t(
              `File is too large (${mb} MB). Max upload size is 25 MB. For large videos, paste a YouTube link instead.`,
              `อัปโหลดไฟล์ไม่ได้: ขนาด ${mb} MB เกินลิมิต 25 MB สำหรับวิดีโอขนาดใหญ่ แนะนำให้แปะลิงก์ YouTube แทน`
            )}</span>
            <button type="button" class="learn-cr-btn learn-cr-btn--primary learn-studio__switch-yt" data-studio-media="youtube">${t("Use YouTube Link →", "ใช้ลิงก์ YouTube แทน →")}</button>
          `;
          studioVidErr.hidden = false;
        }
        return;
      }

      const key = `${course.id}:${studioChapterIdx}`;
      const prevUrl = sessionVideoUrls.get(key);
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      sessionVideoUrls.set(key, URL.createObjectURL(file));

      const mutable = [...course.chapters];
      mutable[studioChapterIdx] = {
        ...mutable[studioChapterIdx],
        videoFileName: file.name,
        uploadMime: file.type || ""
      };
      course.chapters = mutable;
      if (studioVidErr) studioVidErr.hidden = true;
      saveMyClasses();
      renderStudio();
      showToast(t(`Attached file: ${file.name}`, `แนบไฟล์สไลด์/สื่อการเรียนแล้ว: ${file.name}`));
    });

    // PLAYER MODAL interactions
    playerModal?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (target === playerModal || target?.closest("[data-learn-player-close]")) {
        closePlayerModal();
        return;
      }
      const quizPickBtn = target?.closest<HTMLButtonElement>("[data-player-quiz-pick]");
      if (quizPickBtn && playerCourseId) {
        const course = getAllCombined().find((c) => c.id === playerCourseId);
        const ch = course?.chapters[playerChapterIdx];
        if (!course || !ch?.quiz) return;
        const picked = Number(quizPickBtn.dataset.playerQuizPick) || 0;
        const correct = Number(ch.quiz.correctIndex) || 0;
        const quizBox = playerStage?.querySelector<HTMLElement>("[data-player-quiz-box]");
        const msgEl = quizBox?.querySelector<HTMLElement>("[data-player-quiz-msg]");
        quizBox?.querySelectorAll<HTMLButtonElement>("[data-player-quiz-pick]").forEach((b) => {
          b.classList.remove("is-correct", "is-wrong");
        });
        if (picked === correct) {
          quizPickBtn.classList.add("is-correct");
          if (msgEl) {
            msgEl.hidden = false;
            msgEl.className = "learn-player-quiz__msg is-correct";
            msgEl.textContent = t("Correct! Lesson quiz passed.", "ถูกต้อง! ผ่านควิซประจำบทเรียนนี้แล้ว");
          }
          recordLessonQuizPassed(course.id, playerChapterIdx);
          handleChapterCompleted(course, playerChapterIdx);
          window.dispatchEvent(new Event("learninghaus:quest-updated"));
        } else {
          quizPickBtn.classList.add("is-wrong");
          if (msgEl) {
            msgEl.hidden = false;
            msgEl.className = "learn-player-quiz__msg is-wrong";
            msgEl.textContent = t("Not quite right. Try another answer!", "ยังไม่ถูกต้อง ลองเลือกคำตอบอื่นอีกครั้งนะ!");
          }
        }
        return;
      }
      if (target?.closest("[data-learn-player-complete]") && playerCourseId) {
        const course = getAllCombined().find((c) => c.id === playerCourseId);
        if (!course) return;
        const alreadyDone = isChapterDone(course.id, playerChapterIdx);
        if (alreadyDone) {
          setChapterDone(course.id, playerChapterIdx, false);
          updatePlayerFooter(course, playerChapterIdx);
          renderMyClasses();
          if (homeView.dataset.learnSubview === "deck") renderDeckForCourse(course);
        } else {
          handleChapterCompleted(course, playerChapterIdx);
        }
      }
    });

    // COURSE DETAILS MODAL interactions
    modalBackdrop?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-course-modal-fav]") && modalCourse) {
        toggleFavorite(modalCourse.id);
        return;
      }
      if (target?.closest("[data-course-modal-enroll]") && modalCourse) {
        if (isInMyClasses(modalCourse.id)) {
          removeClassMembership(modalCourse.id);
          showToast(t(`Removed "${modalCourse.title}" from My Classes`, `นำ "${modalCourse.title}" ออกจากห้องเรียนของฉันแล้ว`));
        } else {
          addClassMembership(modalCourse.id);
          showToast(t(`Added "${modalCourse.title}" to My Classes!`, `เพิ่ม "${modalCourse.title}" เข้าห้องเรียนของฉันแล้ว`));
        }
        syncFavoriteButtons();
        renderMyClasses();
        renderCatalog();
        return;
      }
      if (target === modalBackdrop || target?.closest("[data-course-modal-close]")) {
        closeModal();
        return;
      }
      if (target?.closest("[data-course-modal-enter]") && modalCourse) {
        const chosenId = modalCourse.id;
        closeModal();
        showDeck(chosenId);
      }
    });

    // JOIN CLASS CODE MODAL interactions
    joinModal?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (target === joinModal || target?.closest("[data-learn-join-close]")) {
        closeJoinModal();
        return;
      }
      const fillBtn = target?.closest<HTMLButtonElement>("[data-learn-fill-code]");
      if (fillBtn?.dataset.learnFillCode && joinInput) {
        joinInput.value = fillBtn.dataset.learnFillCode;
        if (joinMsg) joinMsg.hidden = true;
        joinInput.focus();
      }
    });

    joinForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const rawCode = joinInput?.value || "";
      const result = joinClassByCode(rawCode);
      if (result.ok) {
        closeJoinModal();
        setRoleFilter("all");
        setSubview("classes");
        renderCatalog();
        showToast(result.message);
        return;
      }
      const partyResult = await window.LearningHausPartyArena?.joinRoomByCode?.(rawCode);
      if (partyResult?.ok) {
        closeJoinModal();
        return;
      }
      if (joinMsg) {
        joinMsg.textContent = result.message;
        joinMsg.hidden = false;
      }
    });

    // CREATE NEW CLASS MODAL interactions
    createSwatches?.addEventListener("click", (event) => {
      const btn = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>("[data-theme-grad]");
      if (!btn?.dataset.themeGrad) return;
      selectedCreateGradient = btn.dataset.themeGrad;
      createSwatches.querySelectorAll<HTMLButtonElement>("[data-theme-grad]").forEach((s) => {
        const active = s === btn;
        s.classList.toggle("is-active", active);
        s.setAttribute("aria-checked", String(active));
      });
    });

    createBgInput?.addEventListener("change", () => {
      const file = createBgInput.files?.[0];
      createBgInput.value = "";
      if (!file) return;
      if (!/^image\/(png|jpeg|webp)$/i.test(file.type)) {
        showToast(t("Please choose a PNG, JPG, or WebP image.", "กรุณาเลือกไฟล์รูปภาพ PNG, JPG หรือ WebP"));
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        showToast(t("Image is too large (max 4 MB).", "ไฟล์ภาพใหญ่เกินไป (ไม่เกิน 4 MB)"));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const rawUrl = String(reader.result || "");
        if (!rawUrl) return;
        selectedCreateBannerRawSrc = rawUrl;
        openCoverCropper(rawUrl, "class-banner");
      };
      reader.readAsDataURL(file);
    });

    createBgCropBtn?.addEventListener("click", () => {
      const src = selectedCreateBannerRawSrc || selectedCreateBannerImage;
      if (src) openCoverCropper(src, "class-banner");
    });

    createBgClear?.addEventListener("click", resetCreateBannerImage);

    createModal?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (target === createModal || target?.closest("[data-learn-create-close]")) {
        resetCreateBannerImage();
        closeCreateModal();
      }
    });

    createForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = (createNameInput?.value || "").trim();
      if (!name) return;
      const catKey = (createCatSelect?.value || "law") as CourseCategory;
      const catMeta = CATEGORY_META[catKey] || CATEGORY_META.other;
      const customDesc = (createDescInput?.value || "").trim();
      const code = generateClassCode();

      const newId = `custom-${Date.now().toString(36)}`;
      const rolledPool = rollRewardPoolForSeed(`${newId}-${code}-${Math.random()}`);
      const newClass: CourseItem = {
        id: newId,
        classCode: code,
        title: name,
        category: catKey,
        categoryEn: catMeta.en,
        categoryTh: catMeta.th,
        suggested: false,
        ratio: "portrait",
        ratioEn: "Portrait 3:4",
        ratioTh: "ปกแนวตั้ง 3:4",
        creator: getCurrentProfileName(),
        role: "teaching",
        isCustom: true,
        requireApproval: Boolean(createApprovalInput?.checked),
        pendingRequests: [],
        approvedLearners: [],
        layoutStyle: "fan",
        cardRatio: "3/4",
        cardWidth: 241,
        passPercent: 80,
        gradient: selectedCreateGradient,
        poster: selectedCreateBannerImage || undefined,
        iconName: catMeta.icon,
        descriptionEn: customDesc || `Instructor-created class (${catMeta.en}). Share code ${code} so learners can join.`,
        descriptionTh: customDesc || `ห้องเรียนที่สร้างโดยผู้สอน (${catMeta.th}) แชร์รหัส ${code} เพื่อให้ผู้เรียนเข้าร่วม`,
        rewardPool: rolledPool,
        chapters: [
          {
            title: "Introduction & Objectives",
            summaryEn: "Overview of topics and learning goals.",
            summaryTh: "ภาพรวมเนื้อหาและเป้าหมายการเรียนรู้",
            points: 100,
            cover: "lesson-assets/covers/pixel-draft.png",
            mediaType: "youtube",
            youtubeUrl: "https://www.youtube.com/watch?v=aircAruvnKk"
          },
          {
            title: "Core Concepts & Practice",
            summaryEn: "Key rules, examples, and discussion points.",
            summaryTh: "หลักการสำคัญ ตัวอย่าง และแนวทางปฏิบัติ",
            points: 100,
            cover: "lesson-assets/covers/pixel-draft.png",
            mediaType: "canva",
            canvaUrl: ""
          },
          {
            title: "Summary & Class Quiz",
            summaryEn: "Wrap-up review and quiz readiness.",
            summaryTh: "สรุปบทเรียนและเตรียมเข้าสู่หน้า Quiz",
            points: 100,
            cover: "lesson-assets/covers/pixel-draft.png",
            mediaType: "reading",
            youtubeUrl: ""
          }
        ]
      };
      newClass.customQuests = buildDefaultCourseQuests(newClass);

      myClassesState.customClasses.unshift(newClass);
      saveMyClasses();
      window.LearningHausQuests?.enroll?.(newClass.id);
      window.dispatchEvent(new CustomEvent("learninghaus:library-updated", { detail: { courseId: newClass.id } }));

      resetCreateBannerImage();
      closeCreateModal();
      if (activeRoleFilter === "enrolled") setRoleFilter("all");
      // Open Minimal 2-Step Class Studio immediately so creator can design the room!
      openStudio(newClass.id, 1);
      showToast(t(`Created "${name}" (${code}). Choose your class design!`, `สร้างห้องเรียน "${name}" (${code}) แล้ว เลือกดีไซน์ห้องเรียนได้เลย`));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (cropperModal && !cropperModal.hidden) {
        event.preventDefault();
        closeCoverCropper();
        return;
      }
      if (requestsModal && !requestsModal.hidden) {
        event.preventDefault();
        closeRequestsModal();
        return;
      }
      if (plusMenu && !plusMenu.hidden) {
        setPlusMenuOpen(false);
        return;
      }
      if (playerModal && !playerModal.hidden) {
        event.preventDefault();
        closePlayerModal();
        return;
      }
      if (joinModal && !joinModal.hidden) {
        event.preventDefault();
        closeJoinModal();
        return;
      }
      if (createModal && !createModal.hidden) {
        event.preventDefault();
        resetCreateBannerImage();
      closeCreateModal();
        return;
      }
      if (modalBackdrop && !modalBackdrop.hidden) {
        event.preventDefault();
        closeModal();
      }
    });

    window.addEventListener("learninghaus:social-session", () => {
      loadState();
      syncFavoriteButtons();
      renderMyClasses();
      renderCatalog();
    });

    window.addEventListener("learninghaus:quest-updated", () => {
      syncFavoriteButtons();
      renderMyClasses();
      renderCatalog();
    });

    window.addEventListener("learninghaus:stage-progress-updated", () => {
      syncCompletedClassesBadges();
      if (homeView.dataset.learnSubview === "classes") {
        renderMyClasses();
      } else if (homeView.dataset.learnSubview === "deck") {
        renderDeckForCourse(getActiveCourse());
      }
    });

    window.addEventListener("learninghaus:class-requests-changed", () => {
      renderMyClasses();
      const activeCourse = getActiveCourse();
      if (homeView.dataset.learnSubview === "deck") {
        renderDeckForCourse(activeCourse);
      }
      if (requestsModal && !requestsModal.hidden && activeCourse.isCustom) {
        renderRequestsModal(activeCourse);
      }
    });

    window.addEventListener("learninghaus:language-changed", () => {
      renderMyClasses();
      renderCatalog();
      if (homeView.dataset.learnSubview === "deck") {
        renderDeckForCourse(getActiveCourse());
        syncFavoriteButtons();
      } else if (homeView.dataset.learnSubview === "studio") {
        renderStudio();
      }
      if (modalCourse && modalBackdrop && !modalBackdrop.hidden) {
        renderModalContent(modalCourse);
      }
    });

    window.addEventListener("learninghaus:learn-subview", (event) => {
      const detail = (event as CustomEvent<{ subview?: "hub" | "classes" | "explore" | "deck" | "studio"; courseId?: string }>).detail;
      if (detail?.courseId) setActiveCourse(detail.courseId);
      if (detail?.subview === "deck") setSubview("deck");
      else if (detail?.subview === "explore") setSubview("explore");
      else if (detail?.subview === "studio" && detail?.courseId) openStudio(detail.courseId, 1);
      else setSubview("classes");
    });

    window.addEventListener("learninghaus:chapter-video-ended", (event) => {
      const ch = Number((event as CustomEvent<{ chapter?: number }>).detail?.chapter);
      if (Number.isFinite(ch) && ch >= 1) {
        setChapterDone("eu-ai-act", ch - 1, true);
      }
    });

    renderMyClasses();
    renderCatalog();
    syncCompletedClassesBadges();
    setSubview("classes");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}
Object.assign(window, { LearningHausLearnHub });
