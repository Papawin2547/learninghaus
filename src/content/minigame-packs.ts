// Universal subject-agnostic mini-game schemas, course pack registry, and EU AI Act chapter levels (Chapters 1-8)
namespace LearningHausMiniGamePacks {
  export type BiText = string | { en: string; th: string };

  export const text = (val: BiText): string =>
    typeof val === "string" ? val : LearningHausI18n.t(val.en, val.th);

  export type PairMatchLevel = {
    kind: "matching";
    title: BiText;
    instruction: BiText;
    timeLimitSeconds: number;
    leftLabel: BiText;
    rightLabel: BiText;
    pairs: readonly { id: string; left: BiText; right: BiText; explain: BiText }[];
  };

  export type RapidStampLevel = {
    kind: "binary-stamp";
    title: BiText;
    instruction: BiText;
    timeLimitSeconds: number;
    leftButton: BiText;
    rightButton: BiText;
    leftStamp: BiText;
    rightStamp: BiText;
    cards: readonly {
      code: string;
      title: BiText;
      desc: BiText;
      answer: "left" | "right";
      explain: BiText;
    }[];
  };

  export type CategorySortLevel = {
    kind: "sorting";
    title: BiText;
    instruction: BiText;
    timeLimitSeconds: number;
    buckets: readonly {
      id: string;
      title: BiText;
      subtitle: BiText;
      tone: "red" | "amber" | "blue" | "green";
    }[];
    items: readonly {
      name: BiText;
      hint: BiText;
      bucketId: string;
      explain: BiText;
    }[];
  };

  export type DecisionPathLevel = {
    kind: "scenario";
    title: BiText;
    instruction: BiText;
    timeLimitSeconds: number;
    meterLabel: BiText;
    initialMeter: number;
    steps: readonly {
      speaker: BiText;
      prompt: BiText;
      choices: readonly {
        text: BiText;
        delta: number;
        isBest: boolean;
        note: BiText;
      }[];
    }[];
  };

  export type RapidBlitzLevel = {
    kind: "true-false-sprint";
    title: BiText;
    instruction: BiText;
    timeLimitSeconds: number;
    trueLabel?: BiText;
    falseLabel?: BiText;
    statements: readonly {
      text: BiText;
      isTrue: boolean;
      explain: BiText;
    }[];
  };

  export type SpotCluesLevel = {
    kind: "inspector";
    title: BiText;
    instruction: BiText;
    timeLimitSeconds: number;
    artifactTitle: BiText;
    goalLabel: BiText;
    hotspots: readonly {
      id: string;
      title: BiText;
      desc: BiText;
      isTarget: boolean;
      explain: BiText;
    }[];
  };

  export type StepSequenceLevel = {
    kind: "order-steps";
    title: BiText;
    instruction: BiText;
    timeLimitSeconds: number;
    steps: readonly {
      rank: number;
      label: BiText;
      explain: BiText;
    }[];
  };

  export type MiniGameLevel =
    | PairMatchLevel
    | RapidStampLevel
    | CategorySortLevel
    | DecisionPathLevel
    | RapidBlitzLevel
    | SpotCluesLevel
    | StepSequenceLevel;

  export type ChapterMiniGamePack = Partial<Record<number, MiniGameLevel>>;

  const registry = new Map<string, ChapterMiniGamePack>();

  export const registerChapterPack = (courseId: string, chapter: number, pack: ChapterMiniGamePack): void => {
    registry.set(`${courseId}:${chapter}`, pack);
  };

  // ============================================================================
  // CHAPTER 1: EU AI Act — Foundations & Scope (Stages 2–9)
  // ============================================================================
  registerChapterPack("eu-ai-act", 1, {
    // Stage 2 (pos 1): Pair Match
    1: {
      kind: "matching",
      title: { en: "Pair Match · Core Roles & Articles", th: "จับคู่ความสัมพันธ์ · บทบาทและมาตราหลัก" },
      instruction: { en: "Tap a term on the left, then tap its matching definition on the right.", th: "แตะคำศัพท์ฝั่งซ้าย แล้วแตะความหมายที่ตรงกันฝั่งขวา" },
      timeLimitSeconds: 75,
      leftLabel: { en: "Key Terms", th: "คำศัพท์ / มาตรา" },
      rightLabel: { en: "Meanings", th: "ความหมาย" },
      pairs: [
        {
          id: "art1",
          left: { en: "Article 1", th: "มาตรา 1 (Article 1)" },
          right: { en: "Sets harmonised AI rules & protects fundamental rights", th: "วางกติกา AI ที่เป็นเอกภาพและคุ้มครองสิทธิขั้นพื้นฐาน" },
          explain: { en: "Article 1 defines the subject matter and purpose of the EU AI Act.", th: "มาตรา 1 กำหนดวัตถุประสงค์และขอบเขตหลักของกฎหมาย EU AI Act" }
        },
        {
          id: "art4",
          left: { en: "Article 4", th: "มาตรา 4 (Article 4)" },
          right: { en: "Requires AI literacy for staff operating AI systems", th: "กำหนดให้บุคลากรที่ใช้งาน AI ต้องมีความรู้พื้นฐาน AI Literacy" },
          explain: { en: "Providers and deployers must ensure sufficient AI literacy among staff.", th: "ทั้งผู้พัฒนาและองค์กรผู้ใช้งานต้องส่งเสริมทักษะ AI Literacy ให้ทีมงาน" }
        },
        {
          id: "prov",
          left: { en: "Provider", th: "ผู้พัฒนา (Provider)" },
          right: { en: "Develops & places an AI system on the market", th: "พัฒนาและนำระบบ AI ออกสู่ตลาดภายใต้ชื่อของตน" },
          explain: { en: "A provider builds (or commissions) an AI system and markets it under its name.", th: "Provider คือผู้สร้างหรือว่าจ้างสร้างระบบ AI แล้ววางจำหน่ายในนามตนเอง" }
        },
        {
          id: "dep",
          left: { en: "Deployer", th: "ผู้ใช้งานเชิงองค์กร (Deployer)" },
          right: { en: "Uses an AI system professionally under its authority", th: "นำระบบ AI ไปใช้งานจริงในองค์กรภายใต้อำนาจของตน" },
          explain: { en: "Deployers use AI in a professional context (excluding purely personal use).", th: "Deployer คือองค์กรที่นำ AI มาใช้ในงาน ไม่รวมการใช้งานส่วนตัว" }
        }
      ]
    },
    // Stage 3 (pos 2): Rapid Stamp
    2: {
      kind: "binary-stamp",
      title: { en: "Rapid Stamp · In Scope or Excluded?", th: "ประทับตราแยกฝั่ง · อยู่ในขอบเขตหรือได้รับข้อยกเว้น?" },
      instruction: { en: "Review each real-world scenario and stamp whether the EU AI Act applies.", th: "ตรวจแต่ละกรณีแล้วประทับตราว่าอยู่ภายใต้ขอบเขต EU AI Act หรือได้รับข้อยกเว้น" },
      timeLimitSeconds: 75,
      leftButton: { en: "STAMP: COVERED", th: "ประทับตรา: อยู่ในขอบเขต" },
      rightButton: { en: "STAMP: EXCLUDED", th: "ประทับตรา: ได้รับข้อยกเว้น" },
      leftStamp: { en: "COVERED", th: "อยู่ในขอบเขต" },
      rightStamp: { en: "EXCLUDED", th: "ได้รับข้อยกเว้น" },
      cards: [
        {
          code: "CASE #101",
          title: { en: "Hospital Diagnostic AI in Paris", th: "AI ช่วยวินิจฉัยโรคในโรงพยาบาลปารีส" },
          desc: { en: "A clinic deploys an AI model to triage patient scans across France.", th: "คลินิกนำโมเดล AI มาช่วยคัดกรองภาพสแกนผู้ป่วยในฝรั่งเศส" },
          answer: "left",
          explain: { en: "Covered: business use inside the EU falls under Article 2.", th: "อยู่ในขอบเขต เพราะเป็นการใช้งานเชิงวิชาชีพภายในสหภาพยุโรป" }
        },
        {
          code: "CASE #102",
          title: { en: "Personal Weekend Photo Filter", th: "ฟิลเตอร์แต่งรูป AI ส่วนตัววันหยุด" },
          desc: { en: "A student uses an AI app at home purely to stylize personal vacation photos.", th: "นักศึกษาใช้แอป AI ที่บ้านแต่งรูปท่องเที่ยวส่วนตัวเท่านั้น" },
          answer: "right",
          explain: { en: "Excluded: purely personal use is outside business rules.", th: "ได้รับข้อยกเว้น เพราะเป็นการใช้งานส่วนตัวที่ไม่เกี่ยวข้องกับวิชาชีพ" }
        },
        {
          code: "CASE #103",
          title: { en: "US SaaS Scoring EU Loan Applicants", th: "บริษัทสหรัฐฯ ใช้ AI ประเมินสินเชื่อผู้กู้ใน EU" },
          desc: { en: "A company based outside the EU sells credit-scoring outputs used by EU banks.", th: "บริษัทนอก EU ส่งผลคะแนนเครดิตจาก AI ให้ธนาคารในยุโรปนำไปตัดสินใจ" },
          answer: "left",
          explain: { en: "Covered: Article 2 still applies when AI results are used in the EU.", th: "อยู่ในขอบเขต เพราะกฎหมายมีผลครอบคลุมหากผลลัพธ์ AI ถูกนำไปใช้ใน EU" }
        },
        {
          code: "CASE #104",
          title: { en: "Solely Military Defense System", th: "ระบบ AI เพื่อการทหารโดยเฉพาะ" },
          desc: { en: "An AI system developed and placed into service exclusively for national defense.", th: "ระบบ AI ที่พัฒนาและใช้งานเพื่อภารกิจความมั่นคงทางทหารโดยเฉพาะ" },
          answer: "right",
          explain: { en: "Excluded: systems used only for military or national defense are outside the Act.", th: "ได้รับข้อยกเว้น ระบบที่ใช้เพื่อการทหารและความมั่นคงโดยเฉพาะอยู่นอกขอบเขต" }
        }
      ]
    },
    // Stage 4 (pos 3): Category Sort
    3: {
      kind: "sorting",
      title: { en: "Category Sort · AI Risk Pyramid", th: "คัดแยกหมวดหมู่ · พีระมิดระดับความเสี่ยง AI" },
      instruction: { en: "Sort each real-world AI system into its matching EU AI Act risk tier.", th: "คัดแยกระบบ AI แต่ละชิ้นลงในกล่องระดับความเสี่ยงที่ถูกต้อง" },
      timeLimitSeconds: 80,
      buckets: [
        { id: "unacceptable", title: { en: "Unacceptable", th: "ต้องห้าม" }, subtitle: { en: "Banned outright", th: "ห้ามใช้งานเด็ดขาด" }, tone: "red" },
        { id: "high", title: { en: "High-Risk", th: "ความเสี่ยงสูง" }, subtitle: { en: "Strict safety & oversight", th: "ต้องมีคนกำกับและเอกสาร" }, tone: "amber" },
        { id: "limited", title: { en: "Limited Risk", th: "ความเสี่ยงจำกัด" }, subtitle: { en: "Disclosure required", th: "ต้องเปิดเผยว่าเป็น AI" }, tone: "blue" },
        { id: "minimal", title: { en: "Minimal Risk", th: "ความเสี่ยงต่ำสุด" }, subtitle: { en: "Freely permitted", th: "ใช้งานได้ทั่วไป" }, tone: "green" }
      ],
      items: [
        { name: { en: "CV Resume Screening AI", th: "AI คัดกรองเรซูเม่สมัครงาน" }, hint: { en: "Ranks candidates for job interviews", th: "จัดอันดับผู้สมัครเข้าสัมภาษณ์" }, bucketId: "high", explain: { en: "Employment & recruitment AI is classified as High-Risk.", th: "AI ด้านการจ้างงานและคัดเลือกบุคลากรจัดเป็นความเสี่ยงสูง" } },
        { name: { en: "Government Social Scoring", th: "ระบบให้คะแนนความประพฤติพลเมือง" }, hint: { en: "Restricts public services for low scores", th: "ตัดสิทธิบริการสาธารณะสำหรับคนคะแนนต่ำ" }, bucketId: "unacceptable", explain: { en: "Social scoring by public or private actors causing harm is prohibited.", th: "การให้คะแนนพลเมืองที่ก่อผลเสียอย่างไม่เป็นธรรมเป็นสิ่งต้องห้าม" } },
        { name: { en: "Customer Support Chatbot", th: "แชทบอทตอบคำถามลูกค้า" }, hint: { en: "Interacts directly with humans", th: "สนทนากับผู้ใช้งานโดยตรง" }, bucketId: "limited", explain: { en: "Chatbots fall under Limited Risk and must disclose they are AI.", th: "แชทบอทอยู่ในกลุ่มความเสี่ยงจำกัด ต้องแจ้งผู้ใช้ว่ากำลังคุยกับ AI" } },
        { name: { en: "Email Spam Filter", th: "ระบบกรองอีเมลสแปม" }, hint: { en: "Sorts junk mail automatically", th: "แยกอีเมลขยะเข้าโฟลเดอร์สแปม" }, bucketId: "minimal", explain: { en: "Spam filters pose minimal risk and require no special compliance burden.", th: "ระบบกรองสแปมมีความเสี่ยงต่ำสุด สามารถใช้งานได้ตามปกติ" } }
      ]
    },
    // Stage 5 (pos 4): Decision Path
    4: {
      kind: "scenario",
      title: { en: "Decision Path · First Day as AI Advisor", th: "เส้นทางตัดสินใจ · วันแรกในฐานะที่ปรึกษา AI" },
      instruction: { en: "Guide your teammate across 3 decisions to keep the Compliance Meter high.", th: "ช่วยเพื่อนร่วมทีมตัดสินใจครบ 3 ขั้นตอนเพื่อรักษาคะแนนความถูกต้องตามกฎหมาย" },
      timeLimitSeconds: 85,
      meterLabel: { en: "Compliance Meter", th: "คะแนนความถูกต้องตามกฎหมาย" },
      initialMeter: 60,
      steps: [
        {
          speaker: { en: "NekoNova · Startup Founder", th: "NekoNova · ผู้ก่อตั้งสตาร์ทอัพ" },
          prompt: { en: "We are based outside the EU, but European clinics will use our AI triage scores. Does the EU AI Act still apply to us?", th: "บริษัทเราตั้งอยู่นอก EU แต่คลินิกในยุโรปจะนำผลคัดกรองจาก AI เราไปใช้ เรายังต้องทำตาม EU AI Act ไหม?" },
          choices: [
            { text: { en: "Yes. Article 2 covers non-EU companies when their AI results are used in the EU.", th: "ใช่ มาตรา 2 ครอบคลุมผู้พัฒนานอก EU เมื่อผลลัพธ์ AI ถูกนำไปใช้ใน EU" }, delta: +15, isBest: true, note: { en: "Correct! This rule protects people located in the EU.", th: "ถูกต้อง! ขอบเขตกฎหมายครอบคลุมเพื่อคุ้มครองผู้ใช้งานในสหภาพยุโรป" } },
            { text: { en: "No. Only companies based in Brussels have to follow it.", th: "ไม่เกี่ยว บังคับใช้เฉพาะบริษัทที่มีสำนักงานใหญ่ในบรัสเซลส์เท่านั้น" }, delta: -25, isBest: false, note: { en: "Wrong. Where your office is located does not exempt AI results used in the EU.", th: "ไม่ถูกต้อง ที่ตั้งสำนักงานใหญ่ไม่ได้ทำให้พ้นขอบเขตหากผลลัพธ์ใช้ใน EU" } }
          ]
        },
        {
          speaker: { en: "NekoNova · Startup Founder", th: "NekoNova · ผู้ก่อตั้งสตาร์ทอัพ" },
          prompt: { en: "What about our support team who use this AI every day? Do they need AI training?", th: "แล้วทีมงานของเราที่ต้องใช้งานระบบ AI นี้ทุกวัน จำเป็นต้องอบรมเรื่อง AI ไหม?" },
          choices: [
            { text: { en: "Yes. Article 4 requires AI training that fits their role and risks.", th: "จำเป็น มาตรา 4 กำหนดให้จัดความรู้ AI Literacy ให้เหมาะกับบทบาทและความเสี่ยง" }, delta: +15, isBest: true, note: { en: "Spot on! Staff literacy helps catch errors and misuse early.", th: "ยอดเยี่ยม! ความรู้ AI Literacy ช่วยให้พนักงานจับผิดความคลาดเคลื่อนได้ทัน" } },
            { text: { en: "Skip training; only the ML engineers need to understand how it works.", th: "ไม่ต้องอบรม ให้แค่วิศวกร AI รู้ก็พอ" }, delta: -20, isBest: false, note: { en: "Article 4 covers staff dealing with operation and use of AI systems.", th: "มาตรา 4 ครอบคลุมบุคลากรที่เกี่ยวข้องกับการใช้งานระบบ AI ด้วย" } }
          ]
        },
        {
          speaker: { en: "NekoNova · Startup Founder", th: "NekoNova · ผู้ก่อตั้งสตาร์ทอัพ" },
          prompt: { en: "We also want to add a helpful FAQ chatbot on our public website. What's the key rule?", th: "เราอยากเพิ่มแชทบอทตอบคำถามบนหน้าเว็บสาธารณะด้วย กฎสำคัญคืออะไร?" },
          choices: [
            { text: { en: "Clearly inform visitors they are interacting with an AI assistant.", th: "แจ้งให้ผู้เข้าชมทราบชัดเจนว่ากำลังสนทนากับผู้ช่วย AI" }, delta: +10, isBest: true, note: { en: "Great! Transparent disclosure satisfies Limited-Risk obligations.", th: "เยี่ยมมาก! การแจ้งชัดเจนตอบโจทย์หน้าที่ความโปร่งใสของความเสี่ยงจำกัด" } },
            { text: { en: "Give it a human photo and hide that it is AI so users trust it more.", th: "ใส่รูปคนจริงและปิดบังว่าเป็น AI เพื่อให้ผู้ใช้เชื่อถือมากขึ้น" }, delta: -25, isBest: false, note: { en: "Hiding a chatbot's AI identity breaks transparency obligations.", th: "การปกปิดตัวตนแชทบอทละเมิดหน้าที่ด้านความโปร่งใส" } }
          ]
        }
      ]
    },
    // Stage 6 (pos 5): Rapid Blitz
    5: {
      kind: "true-false-sprint",
      title: { en: "Rapid Blitz · Scope & Roles True/False", th: "สปรินต์จริงหรือเท็จ · ขอบเขตและบทบาท" },
      instruction: { en: "Decide TRUE or FALSE quickly to build your streak combo!", th: "ตอบ จริง หรือ เท็จ ให้ไวเพื่อสะสมตัวคูณคอมโบคะแนน!" },
      timeLimitSeconds: 65,
      statements: [
        { text: { en: "The EU AI Act follows a risk-based approach with 4 main risk tiers.", th: "กฎหมาย EU AI Act ใช้แนวทางกำกับดูแลตามระดับความเสี่ยง 4 ระดับหลัก" }, isTrue: true, explain: { en: "Unacceptable, High-Risk, Limited Risk, and Minimal Risk.", th: "ได้แก่ ความเสี่ยงต้องห้าม ความเสี่ยงสูง ความเสี่ยงจำกัด และความเสี่ยงต่ำสุด" } },
        { text: { en: "Using an AI photo app purely for personal hobby photos makes you a regulated deployer.", th: "การใช้แอป AI แต่งรูปเป็นงานอดิเรกส่วนตัวทำให้คุณกลายเป็น Deployer ที่ต้องปฏิบัติตามกฎองค์กร" }, isTrue: false, explain: { en: "Purely personal, non-professional activities are excluded from deployer duties.", th: "การใช้งานส่วนตัวที่ไม่เกี่ยวกับวิชาชีพได้รับข้อยกเว้น" } },
        { text: { en: "Article 4 requires both providers and deployers to promote AI literacy among staff.", th: "มาตรา 4 กำหนดให้ทั้งผู้พัฒนาและองค์กรผู้ใช้งานส่งเสริมทักษะ AI Literacy ให้บุคลากร" }, isTrue: true, explain: { en: "AI literacy helps everyone operating AI understand opportunities and risks.", th: "ทักษะ AI Literacy ช่วยให้ผู้ใช้งานเข้าใจทั้งโอกาสและความเสี่ยงของระบบ" } },
        { text: { en: "The EU AI Act bans every AI system that uses machine learning.", th: "กฎหมาย EU AI Act สั่งห้ามระบบ AI ที่ใช้ Machine Learning ทั้งหมด" }, isTrue: false, explain: { en: "Only specific harmful practices are banned; most AI systems are allowed under proportionate rules.", th: "ห้ามเฉพาะแนวปฏิบัติที่เป็นอันตรายร้ายแรงเท่านั้น ระบบ AI ส่วนใหญ่ใช้งานได้ตามระดับความเสี่ยง" } },
        { text: { en: "An AI system is defined by some level of autonomy and inferring outputs from inputs.", th: "นิยามของระบบ AI คือระบบที่ทำงานอัตโนมัติในระดับหนึ่งและอนุมานผลลัพธ์จากข้อมูลนำเข้าได้" }, isTrue: true, explain: { en: "Article 3 defines AI systems around autonomy, adaptiveness, and inference.", th: "มาตรา 3 นิยามระบบ AI จากความเป็นอิสระในการทำงานและความสามารถในการอนุมานผลลัพธ์" } }
      ]
    },
    // Stage 7 (pos 6): Spot the Clues
    6: {
      kind: "inspector",
      title: { en: "Spot the Clues · Pre-Launch Spec Review", th: "นักสืบจับจุดสำคัญ · ตรวจสเปกก่อนเปิดตัว" },
      instruction: { en: "Inspect the product sheet below and tap the 3 legal red flags.", th: "ตรวจสอบเอกสารสเปกด้านล่างแล้วคลิกจับผิด 3 จุดที่เสี่ยงละเมิดกฎหมาย" },
      timeLimitSeconds: 80,
      artifactTitle: { en: "CampusAssist AI: Draft Launch Spec", th: "CampusAssist AI: ร่างสเปกก่อนเปิดใช้งาน" },
      goalLabel: { en: "Find 3 red flags", th: "จับผิดให้ครบ 3 จุด" },
      hotspots: [
        { id: "h1", title: { en: "Undisclosed Student Bot", th: "แชทบอทไม่แจ้งว่าเป็น AI" }, desc: { en: "Poses as a human advisor with zero AI disclosure banner.", th: "สวมรอยเป็นอาจารย์ที่ปรึกษาจริงโดยไม่แจ้งว่าเป็น AI" }, isTarget: true, explain: { en: "Users must be told clearly when chatting with an AI system.", th: "ต้องแจ้งให้ผู้ใช้ทราบชัดเจนเมื่อโต้ตอบกับแชทบอท AI" } },
        { id: "h2", title: { en: "Encrypted Audit Storage", th: "จัดเก็บบันทึกแบบเข้ารหัส" }, desc: { en: "Access logs are stored with AES-256 encryption.", th: "เก็บบันทึกการใช้งานด้วยการเข้ารหัสมาตรฐาน AES-256" }, isTarget: false, explain: { en: "Good security habit, not a breach.", th: "เป็นมาตรการความปลอดภัยที่ดี ไม่ใช่จุดละเมิด" } },
        { id: "h3", title: { en: "Classroom Emotion Scanner", th: "กล้องตรวจจับอารมณ์ในห้องเรียน" }, desc: { en: "Infers student emotions via webcam to rank attention.", th: "อ่านสีหน้าเพื่อประเมินอารมณ์นักศึกษาในห้องเรียน" }, isTarget: true, explain: { en: "Emotion recognition in education institutions is prohibited.", th: "การตรวจจับอารมณ์ในสถานศึกษาเป็นแนวปฏิบัติต้องห้าม" } },
        { id: "h4", title: { en: "Zero Staff Literacy Plan", th: "ไม่มีการอบรมบุคลากร" }, desc: { en: "Staff receive no onboarding on AI errors or bias.", th: "ไม่จัดอบรมให้เจ้าหน้าที่เข้าใจข้อจำกัดและอคติของ AI" }, isTarget: true, explain: { en: "Fails Article 4 AI literacy obligations for deployers.", th: "ขาดการปฏิบัติตามมาตรา 4 เรื่อง AI Literacy สำหรับผู้ใช้งาน" } },
        { id: "h5", title: { en: "Clear Privacy Notice", th: "ประกาศความเป็นส่วนตัวชัดเจน" }, desc: { en: "Explains data retention and student rights in plain language.", th: "อธิบายระยะเวลาเก็บข้อมูลและสิทธิของผู้เรียนอย่างเข้าใจง่าย" }, isTarget: false, explain: { en: "Good clear notice, safe feature.", th: "เป็นแนวปฏิบัติที่โปร่งใสและเหมาะสม" } },
        { id: "h6", title: { en: "Human Appeal Contact", th: "ช่องทางอุทธรณ์ต่อเจ้าหน้าที่" }, desc: { en: "Students can request human review at any time.", th: "ผู้เรียนสามารถขอให้เจ้าหน้าที่ตรวจสอบซ้ำได้ตลอดเวลา" }, isTarget: false, explain: { en: "Supports human review, safe practice.", th: "ช่วยเสริมการกำกับดูแลโดยมนุษย์อย่างถูกต้อง" } }
      ]
    },
    // Stage 8 (pos 7): Pair Match II (Applied Scenarios)
    7: {
      kind: "matching",
      title: { en: "Pair Match II · Scenarios & Actors", th: "จับคู่ความสัมพันธ์ II · กรณีศึกษาและบทบาท" },
      instruction: { en: "Match each real-world scenario on the left to the correct EU AI Act role or rule.", th: "จับคู่สถานการณ์จริงฝั่งซ้ายเข้ากับบทบาทหรือหลักกฎหมายที่ตรงกันฝั่งขวา" },
      timeLimitSeconds: 75,
      leftLabel: { en: "Real-World Scenario", th: "สถานการณ์จริง" },
      rightLabel: { en: "Role / Rule", th: "บทบาท / กฎเกณฑ์" },
      pairs: [
        { id: "p1", left: { en: "Startup trains & sells an AI model", th: "สตาร์ทอัพเทรนและขายโมเดล AI" }, right: { en: "Provider", th: "ผู้พัฒนา (Provider)" }, explain: { en: "Creating and placing an AI system on the market makes you a Provider.", th: "การพัฒนาและนำระบบ AI ออกสู่ตลาดจัดเป็นบทบาท Provider" } },
        { id: "p2", left: { en: "Bank uses vendor AI for loan checks", th: "ธนาคารซื้อ AI มาใช้ตรวจสินเชื่อ" }, right: { en: "Deployer", th: "ผู้ใช้งานเชิงองค์กร (Deployer)" }, explain: { en: "Operating an AI tool under organizational authority makes you a Deployer.", th: "การนำ AI มาใช้งานจริงภายใต้ชื่อองค์กรจัดเป็น Deployer" } },
        { id: "p3", left: { en: "EU firm brings non-EU AI into Europe", th: "บริษัทใน EU นำเข้า AI จากนอกยุโรป" }, right: { en: "Importer", th: "ผู้นำเข้า (Importer)" }, explain: { en: "Importers place third-country AI systems on the EU market.", th: "ผู้นำเข้ามีหน้าที่ตรวจสอบความพร้อมก่อนนำ AI จากนอก EU เข้ามาจำหน่าย" } },
        { id: "p4", left: { en: "Hobbyist plays AI chess at home", th: "บุคคลทั่วไปเล่นหมากรุก AI ที่บ้าน" }, right: { en: "Personal Use Exclusion", th: "ข้อยกเว้นการใช้งานส่วนตัว" }, explain: { en: "Non-professional personal activity is excluded from deployer rules.", th: "กิจกรรมส่วนตัวที่ไม่ใช่เชิงพาณิชย์หรือวิชาชีพได้รับข้อยกเว้น" } }
      ]
    },
    // Stage 9 (pos 8): Step Sequence
    8: {
      kind: "order-steps",
      title: { en: "Step Sequence · AI Readiness Checklist", th: "เรียงลำดับขั้นตอน · เช็กลิสต์ก่อนใช้ AI" },
      instruction: { en: "Tap the 4 steps in chronological order from Step 1 to Step 4.", th: "แตะการ์ดด้านล่างเพื่อเรียงลำดับขั้นตอนตั้งแต่ขั้นที่ 1 ถึงขั้นที่ 4" },
      timeLimitSeconds: 75,
      steps: [
        { rank: 1, label: { en: "Check if the System Falls Under EU AI Act Scope", th: "ตรวจสอบว่าระบบอยู่ในขอบเขต EU AI Act หรือไม่" }, explain: { en: "Always confirm Article 2 scope & exemptions first.", th: "เริ่มจากเช็กขอบเขตและข้อยกเว้นตามมาตรา 2 ก่อนเสมอ" } },
        { rank: 2, label: { en: "Identify Your Value-Chain Role (Provider vs. Deployer)", th: "ระบุบทบาทขององค์กร (ผู้พัฒนา หรือ ผู้ใช้งาน)" }, explain: { en: "Legal duties depend directly on your role.", th: "หน้าที่ตามกฎหมายขึ้นอยู่กับบทบาทในห่วงโซ่คุณค่า" } },
        { rank: 3, label: { en: "Classify the AI System's Risk Tier", th: "จัดระดับความเสี่ยงของระบบ AI" }, explain: { en: "Check whether it is Unacceptable, High-Risk, Limited, or Minimal.", th: "ตรวจสอบว่าอยู่ระดับต้องห้าม สูง จำกัด หรือต่ำสุด" } },
        { rank: 4, label: { en: "Train Staff (AI Literacy) & Apply Controls Before Launch", th: "อบรม AI Literacy ให้ทีมและตั้งมาตรการก่อนเปิดใช้" }, explain: { en: "Equip staff and compliance safeguards prior to deployment.", th: "เตรียมความพร้อมบุคลากรและมาตรการควบคุมให้ครบก่อนใช้งานจริง" } }
      ]
    }
  });

  // ============================================================================
  // CHAPTER 2: EU AI Act — Prohibited AI Practices (Stages 2–9)
  // ============================================================================
  registerChapterPack("eu-ai-act", 2, {
    1: {
      kind: "matching",
      title: { en: "Pair Match · Article 5 Banned Practices", th: "จับคู่ความสัมพันธ์ · ข้อห้ามตามมาตรา 5" },
      instruction: { en: "Match each prohibited practice to why it is banned under Article 5.", th: "จับคู่แนวปฏิบัติต้องห้ามกับเหตุผลที่ถูกห้ามตามมาตรา 5" },
      timeLimitSeconds: 75,
      leftLabel: { en: "Prohibited Practice", th: "แนวปฏิบัติต้องห้าม" },
      rightLabel: { en: "Core Harm", th: "ผลกระทบหลัก" },
      pairs: [
        { id: "m1", left: { en: "Subliminal Manipulation", th: "การชักจูงใต้จิตสำนึก" }, right: { en: "Distorts behavior beyond awareness causing harm", th: "บิดเบือนการตัดสินใจโดยผู้ใช้ไม่รู้ตัวจนเกิดความเสียหาย" }, explain: { en: "Subliminal and deceptive techniques that distort free choice are banned.", th: "เทคนิคชักจูงลับหลังการรับรู้ที่ก่อความเสียหายอย่างร้ายแรงถูกสั่งห้าม" } },
        { id: "m2", left: { en: "Social Scoring", th: "การให้คะแนนทางสังคม" }, right: { en: "Punishes people unfairly based on social traits", th: "ลงโทษหรือกีดกันบุคคลอย่างไม่เป็นธรรมจากพฤติกรรมสังคม" }, explain: { en: "Article 5 bans detrimental treatment unrelated to the original context.", th: "มาตรา 5 ห้ามการตัดสิทธิหรือเลือกปฏิบัติจากคะแนนความประพฤติ" } },
        { id: "m3", left: { en: "Untargeted Face Scraping", th: "การดูดภาพใบหน้าแบบไม่เลือกเป้า" }, right: { en: "Builds facial databases from internet/CCTV indiscriminately", th: "กวาดภาพใบหน้าจากเน็ตหรือกล้องวงจรปิดเพื่อสร้างฐานข้อมูล" }, explain: { en: "Untargeted scraping of facial images violates privacy and dignity.", th: "การดูดภาพใบหน้าจำนวนมากโดยไม่เลือกเป้าหมายละเมิดความเป็นส่วนตัวร้ายแรง" } },
        { id: "m4", left: { en: "Workplace Emotion AI", th: "AI ตรวจจับอารมณ์ในที่ทำงาน" }, right: { en: "Infers staff feelings without medical/safety need", th: "คาดเดาอารมณ์พนักงานโดยไม่มีเหตุผลด้านการแพทย์หรือความปลอดภัย" }, explain: { en: "Emotion inference in workplaces and schools is banned except medical/safety uses.", th: "ห้ามใช้วิเคราะห์อารมณ์ในที่ทำงานและสถานศึกษา ยกเว้นด้านการแพทย์หรือความปลอดภัย" } }
      ]
    },
    2: {
      kind: "binary-stamp",
      title: { en: "Rapid Stamp · Allowed or Prohibited?", th: "ประทับตราแยกฝั่ง · อนุญาต หรือ ต้องห้าม?" },
      instruction: { en: "Stamp each AI case under Article 5 of the EU AI Act.", th: "ตรวจแฟ้มกรณีศึกษาแล้วประทับตราว่าอนุญาตหรือต้องห้ามตามมาตรา 5" },
      timeLimitSeconds: 75,
      leftButton: { en: "STAMP: ALLOWED", th: "ประทับตรา: อนุญาต" },
      rightButton: { en: "STAMP: PROHIBITED", th: "ประทับตรา: ต้องห้าม" },
      leftStamp: { en: "ALLOWED", th: "อนุญาต" },
      rightStamp: { en: "PROHIBITED", th: "ต้องห้าม" },
      cards: [
        { code: "CASE #201", title: { en: "Exploiting Children's Vulnerabilities", th: "AI หลอกล่อความเปราะบางของเด็ก" }, desc: { en: "A voice toy pressures young kids into dangerous dares to earn digital points.", th: "ของเล่น AI ชักจูงให้เด็กทำกิจกรรมอันตรายเพื่อแลกคะแนนสะสม" }, answer: "right", explain: { en: "Banned: taking advantage of age or disability to cause harm is not allowed.", th: "ต้องห้าม: ห้ามใช้ประโยชน์จากความเปราะบางด้านวัยหรือความพิการจนเกิดอันตราย" } },
        { code: "CASE #202", title: { en: "Driver Drowsiness Alert", th: "ระบบเตือนคนขับง่วงนอนเพื่อความปลอดภัย" }, desc: { en: "Detects driver fatigue in a truck cabin solely to prevent road accidents.", th: "ตรวจจับอาการหลับในของคนขับรถบรรทุกเพื่อป้องกันอุบัติเหตุเท่านั้น" }, answer: "left", explain: { en: "Allowed: road safety tools that spot driver tiredness are allowed.", th: "อนุญาต: เข้าข้อยกเว้นด้านความปลอดภัยเพื่อป้องกันอุบัติเหตุ" } },
        { code: "CASE #203", title: { en: "Scraping CCTV for Facial Recognition DB", th: "ดูดภาพกล้องวงจรปิดสร้างฐานข้อมูลใบหน้า" }, desc: { en: "Harvests millions of random pedestrian faces from public webcams.", th: "เก็บภาพใบหน้าผู้เดินถนนนับล้านจากกล้องสาธารณะโดยไม่ขออนุญาต" }, answer: "right", explain: { en: "Banned: collecting random face photos from cameras or the web is not allowed.", th: "ต้องห้าม: ห้ามกวาดภาพใบหน้าแบบไม่เลือกเป้าหมายจากอินเทอร์เน็ตหรือกล้องวงจรปิด" } },
        { code: "CASE #204", title: { en: "Crime Risk Prediction From Personality Alone", th: "ทำนายโอกาสก่ออาชญากรรมจากบุคลิกภาพล้วน ๆ" }, desc: { en: "Predicts if a person will commit a crime solely from profiling traits.", th: "คาดการณ์ว่าบุคคลจะทำผิดกฎหมายจากลักษณะนิสัยเพียงอย่างเดียว" }, answer: "right", explain: { en: "Banned: guessing crime risk from personality traits alone is not allowed.", th: "ต้องห้าม: ห้ามประเมินความเสี่ยงการก่ออาชญากรรมจากการจัดทำโปรไฟล์เพียงอย่างเดียว" } }
      ]
    },
    3: {
      kind: "sorting",
      title: { en: "Category Sort · Banned vs. Permitted Exceptions", th: "คัดแยกหมวดหมู่ · ข้อห้ามเด็ดขาด vs ข้อยกเว้น/ทำได้" },
      instruction: { en: "Sort each AI case into Prohibited under Art. 5 or Lawful / Exception.", th: "แยกกรณีศึกษาต่อไปนี้ว่าเข้าข่ายต้องห้ามตามมาตรา 5 หรือเข้าข้อยกเว้นที่กฎหมายอนุญาต" },
      timeLimitSeconds: 80,
      buckets: [
        { id: "ban", title: { en: "Prohibited (Art. 5)", th: "ต้องห้าม (มาตรา 5)" }, subtitle: { en: "Banned outright", th: "ห้ามใช้งานเด็ดขาด" }, tone: "red" },
        { id: "ok", title: { en: "Exception / Objective Use", th: "เข้าข้อยกเว้น / ทำได้" }, subtitle: { en: "Medical, safety or factual", th: "การแพทย์ ความปลอดภัย หรืออิงข้อเท็จจริง" }, tone: "green" }
      ],
      items: [
        { name: { en: "Office Emotion Camera for Bonuses", th: "กล้องตรวจจับอารมณ์พนักงานตัดโบนัส" }, hint: { en: "Workplace performance", th: "ประเมินผลงานในออฟฟิศ" }, bucketId: "ban", explain: { en: "Workplace emotion inference for HR bonuses is banned.", th: "การอนุมานอารมณ์ในที่ทำงานเพื่อประเมินผลงานถูกห้ามเด็ดขาด" } },
        { name: { en: "Hospital Fatigue Alert for Surgeons", th: "ระบบเตือนความล้าของศัลยแพทย์เพื่อความปลอดภัย" }, hint: { en: "Medical & safety", th: "เพื่อความปลอดภัยทางการแพทย์" }, bucketId: "ok", explain: { en: "Medical and safety exceptions are expressly permitted.", th: "เข้าข้อยกเว้นด้านการแพทย์และความปลอดภัย" } },
        { name: { en: "Social Credit Score Banning Train Travel", th: "คะแนนพฤติกรรมสังคมตัดสิทธิขึ้นรถไฟ" }, hint: { en: "Unrelated social penalty", th: "ลงโทษข้ามบริบท" }, bucketId: "ban", explain: { en: "Social scoring leading to disproportionate treatment is banned.", th: "Social Scoring ที่นำไปสู่การตัดสิทธิไม่เป็นธรรมถูกห้าม" } },
        { name: { en: "Evidence-Based Fraud Audit", th: "ตรวจสอบทุจริตจากหลักฐานธุรกรรมจริง" }, hint: { en: "Verifiable objective facts", th: "อิงหลักฐานที่เป็นรูปธรรม" }, bucketId: "ok", explain: { en: "Objective fact-based analysis is not banned profiling.", th: "การวิเคราะห์จากข้อเท็จจริงที่ตรวจสอบได้ไม่ได้ถูกห้าม" } }
      ]
    },
    5: {
      kind: "true-false-sprint",
      title: { en: "Rapid Blitz · Article 5 & PDPA Speed Check", th: "สปรินต์จริงหรือเท็จ · เส้นแดงมาตรา 5 & PDPA" },
      instruction: { en: "Judge TRUE or FALSE rapidly!", th: "ตัดสิน จริง หรือ เท็จ ให้ไวที่สุด!" },
      timeLimitSeconds: 65,
      statements: [
        { text: { en: "Untargeted scraping of public webcams for face recognition is legal.", th: "การกวาดภาพใบหน้าจากกล้องสาธารณะแบบไม่เลือกเป้าทำได้ถูกกฎหมาย" }, isTrue: false, explain: { en: "Banned under Article 5 and triggers PDPA biometric violations.", th: "ต้องห้ามตาม Article 5 และผิดหลัก PDPA เรื่องข้อมูลชีวภาพ" } },
        { text: { en: "Real-time remote biometric ID in public is strictly restricted under Annex II & Art. 5.", th: "การระบุตัวตนทางชีวภาพระยะไกลแบบเรียลไทม์ในที่สาธารณะถูกจำกัดเข้มงวดตาม Annex II & Art. 5" }, isTrue: true, explain: { en: "Permitted only under strict statutory law-enforcement conditions.", th: "อนุญาตเฉพาะกรณีบังคับใช้กฎหมายตามเงื่อนไขที่เข้มงวด" } },
        { text: { en: "Schools can freely scan student emotions during exams with no safety reason.", th: "โรงเรียนสแกนอารมณ์นักเรียนระหว่างสอบได้เสรีโดยไม่ต้องมีเหตุปลอดภัย" }, isTrue: false, explain: { en: "School emotion recognition is banned outside medical/safety purposes.", th: "ห้ามตรวจจับอารมณ์ในสถานศึกษา เว้นแต่เพื่อการแพทย์หรือความปลอดภัย" } },
        { text: { en: "Exploiting age or disability to cause serious harm is banned.", th: "การฉวยโอกาสจากวัยหรือความพิการจนเกิดอันตรายร้ายแรงถูกห้ามเด็ดขาด" }, isTrue: true, explain: { en: "Article 5 protects vulnerable groups from harmful exploitation.", th: "Article 5 คุ้มครองกลุ่มเปราะบางจากการถูกแสวงหาประโยชน์" } }
      ]
    }
  });

  // ============================================================================
  // CHAPTER 3: High-Risk AI Systems (Stages 2–9)
  // ============================================================================
  registerChapterPack("eu-ai-act", 3, {
    1: {
      kind: "matching",
      title: { en: "Pair Match · High-Risk Core Requirements", th: "จับคู่ความสัมพันธ์ · ข้อกำหนดหลัก High-Risk AI" },
      instruction: { en: "Match each EU AI Act Article (9–15) to its practical lifecycle duty.", th: "จับคู่มาตรา (Articles 9–15) กับหน้าที่สำคัญตลอดวงจรชีวิตของ High-Risk AI" },
      timeLimitSeconds: 80,
      leftLabel: { en: "Legal Provision", th: "ข้อกำหนด & มาตรา" },
      rightLabel: { en: "Practical Purpose", th: "วัตถุประสงค์ในทางปฏิบัติ" },
      pairs: [
        { id: "hr1", left: { en: "Risk Management (Art. 9)", th: "บริหารความเสี่ยง (Art. 9)" }, right: { en: "Continuous iterative process to identify and mitigate risks", th: "กระบวนการต่อเนื่องตลอดวงจรชีวิตเพื่อลดความเสี่ยงที่คาดการณ์ได้" }, explain: { en: "Article 9 mandates a continuous risk management system.", th: "Article 9 กำหนดให้มีระบบบริหารความเสี่ยงอย่างต่อเนื่อง" } },
        { id: "hr2", left: { en: "Data Governance (Art. 10)", th: "ธรรมาภิบาลข้อมูล (Art. 10)" }, right: { en: "Relevant, representative datasets checked for bias and gaps", th: "ชุดข้อมูลฝึกอบรมมีคุณภาพ เป็นตัวแทนที่ดี และตรวจหาอคติ" }, explain: { en: "Article 10 ensures dataset quality and bias examination.", th: "Article 10 คุมคุณภาพข้อมูลฝึกและทดสอบเพื่อลดอคติ" } },
        { id: "hr3", left: { en: "Human Oversight (Art. 14)", th: "การกำกับโดยมนุษย์ (Art. 14)" }, right: { en: "Allows humans to understand limits and halt AI anytime", th: "ให้มนุษย์เข้าใจขีดจำกัด แทรกแซง หรือสั่งหยุดระบบได้เมื่อจำเป็น" }, explain: { en: "Article 14 prevents blind automation without human intervention.", th: "Article 14 กำหนดให้มนุษย์แทรกแซงหรือหยุดการทำงานได้จริง" } },
        { id: "hr4", left: { en: "Logs & Tech Docs (Art. 11–12)", th: "เอกสารเทคนิค & Log (Art. 11–12)" }, right: { en: "Automatic event logging & pre-market documentation", th: "บันทึกเหตุการณ์อัตโนมัติและจัดทำเอกสารเทคนิคก่อนวางตลาด" }, explain: { en: "Traceability relies on Annex IV tech docs and automatic logs.", th: "ช่วยตรวจสอบย้อนกลับได้ตลอดอายุการใช้งานของระบบ" } }
      ]
    },
    2: {
      kind: "binary-stamp",
      title: { en: "Rapid Stamp · Who Bears Provider Duties?", th: "ประทับตราแยกฝั่ง · ใครต้องรับหน้าที่ Provider?" },
      instruction: { en: "Stamp whether the actor remains a Deployer/Distributor or becomes a Provider under Art. 25.", th: "ประทับตราว่ากรณีนี้ยังเป็น Deployer/ผู้จำหน่าย หรือกลายเป็น Provider เต็มตัวตามมาตรา 25" },
      timeLimitSeconds: 75,
      leftButton: { en: "DEPLOYER / DISTRIBUTOR", th: "DEPLOYER / ผู้จัดจำหน่าย" },
      rightButton: { en: "BECOMES PROVIDER (ART. 25)", th: "รับหน้าที่ PROVIDER (ม.25)" },
      leftStamp: { en: "NOT PROVIDER", th: "ไม่ใช่ PROVIDER" },
      rightStamp: { en: "PROVIDER!", th: "เป็น PROVIDER!" },
      cards: [
        { code: "VC #301", title: { en: "Rebranding High-Risk AI", th: "ติดแบรนด์ตนเองทับระบบ High-Risk" }, desc: { en: "A distributor puts its own trademark on an Annex III hiring tool.", th: "ผู้จัดจำหน่ายนำเครื่องหมายการค้าตนเองมาติดบนซอฟต์แวร์คัดกรองงาน" }, answer: "right", explain: { en: "Under Art. 25, placing your own name/trademark triggers Provider duties.", th: "มาตรา 25 กำหนดให้ผู้ติดชื่อ/แบรนด์ตนเองต้องรับหน้าที่แบบ Provider" } },
        { code: "VC #302", title: { en: "Using HR AI Per Instructions", th: "ใช้ AI คัดกรองตามคู่มือผู้ผลิต" }, desc: { en: "An HR team follows the provider's manual and assigns human review.", th: "ทีม HR ใช้งานตามคู่มือและจัดคนตรวจสอบผลลัพธ์อย่างถูกต้อง" }, answer: "left", explain: { en: "Using the system as intended keeps the organization a Deployer.", th: "ใช้งานตามวัตถุประสงค์เดิมยังคงมีสถานะเป็น Deployer ตาม Art. 26" } },
        { code: "VC #303", title: { en: "Changing Intended Purpose", th: "ดัดแปลงวัตถุประสงค์การใช้งาน" }, desc: { en: "A company repurposes a general chatbot into a medical triage high-risk tool.", th: "องค์กรนำแชทบอททั่วไปมาดัดแปลงเป็นระบบคัดกรองผู้ป่วยความเสี่ยงสูง" }, answer: "right", explain: { en: "Modifying intended purpose into high-risk triggers Art. 25 Provider status.", th: "การเปลี่ยนวัตถุประสงค์เป็น High-Risk ทำให้เกิดภาระหน้าที่แบบ Provider" } }
      ]
    },
    4: {
      kind: "scenario",
      title: { en: "Decision Path · Launching Annex III HR AI", th: "เส้นทางตัดสินใจ · เปิดตัวระบบ HR ความเสี่ยงสูง" },
      instruction: { en: "Make compliant launch decisions to protect your Compliance Meter.", th: "เลือกแนวทางปฏิบัติที่ถูกต้องก่อนนำระบบ HR AI ออกสู่ตลาด" },
      timeLimitSeconds: 75,
      meterLabel: { en: "Compliance Readiness", th: "ความพร้อมตามกฎหมาย" },
      initialMeter: 70,
      steps: [
        {
          speaker: { en: "Compliance Lead", th: "หัวหน้าฝ่ายกำกับดูแล" },
          prompt: { en: "Our AI recruitment tool ranks job applicants. What pre-market step must happen first?", th: "ระบบ AI คัดกรองผู้สมัครงานของเราพร้อมแล้ว ต้องทำขั้นตอนใดก่อนวางตลาด?" },
          choices: [
            { text: { en: "Complete Conformity Assessment, EU Declaration, CE marking & EU Database registration.", th: "ประเมินความสอดคล้อง ออก Declaration ติด CE และจดทะเบียน EU Database" }, delta: 20, isBest: true, note: { en: "Correct! Articles 43–49 & 71 require full verification before market placement.", th: "ถูกต้อง! Articles 43–49 และ 71 บังคับให้ตรวจรับรองและขึ้นทะเบียนก่อน" } },
            { text: { en: "Launch immediately and test live on candidates without docs.", th: "เปิดใช้งานจริงทันทีโดยไม่ต้องทำเอกสาร" }, delta: -25, isBest: false, note: { en: "Skipping pre-market conformity violates Chapter III.", th: "การข้ามขั้นตอนประเมินความสอดคล้องถือว่าฝ่าฝืน Chapter III" } }
          ]
        },
        {
          speaker: { en: "DPO (Data Protection Officer)", th: "เจ้าหน้าที่คุ้มครองข้อมูล (DPO)" },
          prompt: { en: "The training dataset holds real applicant resumes and health notes. Is Art. 10 enough?", th: "ชุดข้อมูลฝึกมีเรซูเม่และข้อมูลสุขภาพผู้สมัครจริง ผ่านเกณฑ์ Art. 10 อย่างเดียวพอไหม?" },
          choices: [
            { text: { en: "No; also verify PDPA lawful basis, explicit consent for sensitive data, and data subject rights.", th: "ไม่พอ ต้องตรวจสอบฐานกฎหมาย PDPA ความยินยอมข้อมูลอ่อนไหว และสิทธิเจ้าของข้อมูลด้วย" }, delta: 15, isBest: true, note: { en: "Dual governance: EU AI Act Art. 10 + PDPA privacy safeguards apply together.", th: "ถูกต้อง! ทั้ง Art. 10 และ PDPA บังคับใช้ควบคู่กัน" } },
            { text: { en: "Yes; CE marking cancels out PDPA rules.", th: "พอแล้ว เพราะเครื่องหมาย CE ยกเว้น PDPA ให้ทั้งหมด" }, delta: -20, isBest: false, note: { en: "EU AI Act compliance never replaces PDPA duties.", th: "การผ่าน EU AI Act ไม่ได้ยกเว้นหน้าที่ตาม PDPA" } }
          ]
        }
      ]
    },
    5: {
      kind: "true-false-sprint",
      title: { en: "Rapid Blitz · High-Risk AI & PDPA", th: "สปรินต์จริงหรือเท็จ · High-Risk AI & PDPA" },
      instruction: { en: "Answer TRUE or FALSE quickly!", th: "ตอบ จริง หรือ เท็จ ให้ไวที่สุด!" },
      timeLimitSeconds: 65,
      statements: [
        { text: { en: "Public bodies deploying high-risk AI may need a Fundamental Rights Impact Assessment (Art. 27).", th: "หน่วยงานรัฐที่ใช้งาน High-Risk AI ต้องประเมินผลกระทบสิทธิขั้นพื้นฐาน (FRIA — Art. 27)" }, isTrue: true, explain: { en: "Article 27 requires FRIA for public bodies and public-service entities.", th: "Article 27 กำหนดให้หน่วยงานรัฐและผู้ให้บริการสาธารณะต้องทำ FRIA" } },
        { text: { en: "Annex III high-risk AI systems never need EU database registration.", th: "ระบบ High-Risk AI ตาม Annex III ไม่ต้องขึ้นทะเบียนใน EU Database" }, isTrue: false, explain: { en: "Articles 49 & 71 require EU database registration before deployment.", th: "Articles 49 และ 71 บังคับให้จดทะเบียนใน EU Database ก่อนวางตลาด" } },
        { text: { en: "Article 15 requires appropriate accuracy, robustness, and cybersecurity.", th: "Article 15 กำหนดเรื่องความแม่นยำ ความทนทาน และความมั่นคงปลอดภัยไซเบอร์" }, isTrue: true, explain: { en: "Resilience against errors and cyberattacks is mandatory under Art. 15.", th: "Article 15 คุ้มครองความถูกต้องและความมั่นคงปลอดภัยของระบบ" } },
        { text: { en: "Once high-risk AI is sold, automatic event logs are disabled.", th: "เมื่อขาย High-Risk AI แล้วต้องปิดระบบบันทึก Log อัตโนมัติ" }, isTrue: false, explain: { en: "Article 12 & 19 require automatic logging throughout the lifetime.", th: "Article 12 และ 19 กำหนดให้เก็บบันทึก Log ตลอดอายุระบบ" } }
      ]
    },
    8: {
      kind: "order-steps",
      title: { en: "Step Sequence · High-Risk Launch Pipeline", th: "เรียงลำดับขั้นตอน · นำ High-Risk AI ออกสู่ตลาด" },
      instruction: { en: "Tap the 4 High-Risk compliance steps in proper chronological order.", th: "แตะเรียงลำดับขั้นตอนการเตรียมระบบ High-Risk AI จากขั้นที่ 1 ถึง 4" },
      timeLimitSeconds: 75,
      steps: [
        { rank: 1, label: { en: "Classify Risk & Govern Training Data (Art. 6, 10 & PDPA)", th: "จัดประเภทความเสี่ยงและคัดกรองข้อมูลฝึก (Art. 6, 10 & PDPA)" }, explain: { en: "Confirm Annex III status and lawful PDPA data basis first.", th: "เริ่มจากการตรวจสถานะ Annex III และฐานกฎหมายข้อมูล" } },
        { rank: 2, label: { en: "Build Technical Docs, Logs & Human Oversight (Art. 11–15)", th: "จัดทำเอกสารเทคนิค ระบบ Log และการกำกับโดยมนุษย์" }, explain: { en: "Design lifecycle controls into the system before testing.", th: "วางมาตรการเทคนิคและความปลอดภัยในตัวระบบ" } },
        { rank: 3, label: { en: "Run Conformity Assessment, CE Marking & EU Registration (Art. 43–49)", th: "ประเมินความสอดคล้อง ติดเครื่องหมาย CE และขึ้นทะเบียน EU" }, explain: { en: "Verify compliance formally before market placement.", th: "ตรวจรับรองและขึ้นทะเบียนก่อนเปิดใช้งานจริง" } },
        { rank: 4, label: { en: "Deployer Oversight, FRIA & Ongoing Monitoring (Art. 26–27)", th: "กำกับดูแลขณะใช้งาน ทำ FRIA และติดตามผลต่อเนื่อง" }, explain: { en: "Deployers follow instructions and monitor live impact.", th: "ผู้ใช้งานปฏิบัติตามคู่มือและเฝ้าระวังผลกระทบต่อเนื่อง" } }
      ]
    }
  });

  // ============================================================================
  // CHAPTER 4: Transparency Obligations — Article 50 (Stages 2–9)
  // ============================================================================
  registerChapterPack("eu-ai-act", 4, {
    1: {
      kind: "matching",
      title: { en: "Pair Match · Article 50 Transparency Duties", th: "จับคู่ความสัมพันธ์ · หน้าที่ความโปร่งใส มาตรา 50" },
      instruction: { en: "Match each AI scenario to its responsible actor and duty under Article 50.", th: "จับคู่สถานการณ์การใช้งาน AI กับผู้มีหน้าที่และข้อกำหนดตามมาตรา 50" },
      timeLimitSeconds: 80,
      leftLabel: { en: "AI Scenario", th: "กรณีการใช้งาน AI" },
      rightLabel: { en: "Article 50 Duty", th: "หน้าที่ตามมาตรา 50" },
      pairs: [
        { id: "tr1", left: { en: "Customer Support Chatbot (Art. 50(1))", th: "แชทบอทบริการลูกค้า (Art. 50(1))" }, right: { en: "Provider informs user they are talking to AI", th: "Provider ออกแบบให้แจ้งผู้ใช้ว่ากำลังคุยกับ AI" }, explain: { en: "Providers must design direct-interaction AI to disclose AI nature.", th: "Article 50(1) ให้ผู้พัฒนาแจ้งผู้ใช้ตั้งแต่ต้น" } },
        { id: "tr2", left: { en: "Synthetic Media Generator (Art. 50(2))", th: "ระบบสร้างภาพ/เสียงสังเคราะห์ (Art. 50(2))" }, right: { en: "Provider embeds machine-readable detection marks", th: "Provider ฝัง Metadata/ลายน้ำที่เครื่องอ่านได้" }, explain: { en: "Machine-readable markings make synthetic media detectable.", th: "Article 50(2) กำหนดให้ฝังเครื่องหมายที่เครื่องอ่านได้" } },
        { id: "tr3", left: { en: "Deepfake Video/Audio (Art. 50(4))", th: "คลิปหรือเสียง Deepfake (Art. 50(4))" }, right: { en: "Deployer discloses content is artificially manipulated", th: "Deployer เปิดเผยว่าเนื้อหานี้สร้างหรือดัดแปลงโดย AI" }, explain: { en: "Deployers publishing deepfakes must clearly label them.", th: "ผู้เผยแพร่ Deepfake ต้องติดป้ายแจ้งเตือนชัดเจน" } },
        { id: "tr4", left: { en: "Public-Interest AI Text (Art. 50(4))", th: "บทความข่าวสาธารณะจาก AI (Art. 50(4))" }, right: { en: "Disclose AI origin unless human editorial control applies", th: "แจ้งที่มา AI เว้นแต่มีมนุษย์ตรวจทานและรับผิดชอบบรรณาธิการ" }, explain: { en: "Human editorial review & responsibility grants an exemption.", th: "หากมีบรรณาธิการมนุษย์ตรวจทานรับผิดชอบได้รับยกเว้น" } }
      ]
    },
    2: {
      kind: "binary-stamp",
      title: { en: "Rapid Stamp · Provider vs. Deployer Duty?", th: "ประทับตราแยกฝั่ง · หน้าที่ Provider หรือ Deployer?" },
      instruction: { en: "Stamp who holds the primary Article 50 obligation in each case.", th: "ประทับตราว่าหน้าที่ความโปร่งใสตามมาตรา 50 ในกรณีนี้เป็นของ Provider หรือ Deployer" },
      timeLimitSeconds: 75,
      leftButton: { en: "PROVIDER DUTY", th: "หน้าที่ PROVIDER" },
      rightButton: { en: "DEPLOYER DUTY", th: "หน้าที่ DEPLOYER" },
      leftStamp: { en: "PROVIDER", th: "PROVIDER" },
      rightStamp: { en: "DEPLOYER", th: "DEPLOYER" },
      cards: [
        { code: "TR #401", title: { en: "Machine-Readable Watermark", th: "ฝังลายน้ำดิจิทัลที่เครื่องอ่านได้" }, desc: { en: "Embedding detectable metadata in generated audio & images.", th: "ฝัง Metadata เพื่อบ่งชี้ภาพและเสียงที่สร้างจาก AI" }, answer: "left", explain: { en: "Article 50(2) assigns technical watermarking to Providers.", th: "Article 50(2) เป็นหน้าที่ของ Provider ผู้สร้างโมเดล/ระบบ" } },
        { code: "TR #402", title: { en: "Publishing a Deepfake Ad", th: "เผยแพร่โฆษณาที่ใช้ Deepfake" }, desc: { en: "A marketing agency publishes a manipulated video spokesperson.", th: "เอเจนซี่เผยแพร่วิดีโอพรีเซนเตอร์ที่ดัดแปลงใบหน้าและเสียง" }, answer: "right", explain: { en: "Article 50(4) requires Deployers publishing deepfakes to disclose them.", th: "Article 50(4) กำหนดให้ Deployer ผู้เผยแพร่ต้องแจ้งเตือน" } },
        { code: "TR #403", title: { en: "Biometric Categorisation Notice", th: "แจ้งผู้ใช้ระบบจัดกลุ่มชีวภาพ" }, desc: { en: "Operating a lawful biometric categorisation tool on visitors.", th: "เปิดใช้งานระบบจัดกลุ่มลักษณะชีวภาพที่กฎหมายอนุญาตกับผู้มาเยือน" }, answer: "right", explain: { en: "Article 50(3) obliges Deployers to notify exposed individuals.", th: "Article 50(3) กำหนดให้ Deployer แจ้งบุคคลที่ถูกประมวลผล" } }
      ]
    },
    5: {
      kind: "true-false-sprint",
      title: { en: "Rapid Blitz · Transparency & PDPA", th: "สปรินต์จริงหรือเท็จ · ความโปร่งใส & PDPA" },
      instruction: { en: "Answer TRUE or FALSE quickly!", th: "ตอบ จริง หรือ เท็จ ให้ไวที่สุด!" },
      timeLimitSeconds: 65,
      statements: [
        { text: { en: "Transparency notices under Art. 50(5) can be hidden at the bottom of annual legal terms.", th: "คำเตือนความโปร่งใสตาม Art. 50(5) ซ่อนไว้ท้ายข้อตกลงประจำปีได้" }, isTrue: false, explain: { en: "Notice must be clear, distinguishable, and given at first interaction/exposure.", th: "ต้องแจ้งอย่างชัดเจน อย่างช้าที่สุดเมื่อโต้ตอบหรือรับชมครั้งแรก" } },
        { text: { en: "Labeling a deepfake under Art. 50 waives PDPA consent to use someone's real face.", th: "ติดป้าย Deepfake ตาม Art. 50 แล้วใช้ใบหน้าคนจริงได้โดยไม่ต้องขอ PDPA" }, isTrue: false, explain: { en: "PDPA lawful basis/consent for personal likeness still applies.", th: "ยังคงต้องมีฐานกฎหมายหรือความยินยอมตาม PDPA เสมอ" } },
        { text: { en: "PDPA Section 23 adds a second layer of notice explaining what personal data is collected and why.", th: "PDPA มาตรา 23 เพิ่มชั้นการแจ้งว่าเก็บข้อมูลใด เพื่ออะไร และสิทธิเจ้าของข้อมูล" }, isTrue: true, explain: { en: "AI notice (Art. 50) + Privacy notice (PDPA Sec. 23) work together.", th: "ทั้งสองกฎหมายทำงานร่วมกันเป็น Two Layers of Notice" } },
        { text: { en: "Creative/satirical deepfakes only need proportionate disclosure that does not hamper enjoyment.", th: "งานศิลปะหรือเสียดสีที่มี Deepfake แจ้งอย่างเหมาะสมโดยไม่รบกวนการรับชมได้" }, isTrue: true, explain: { en: "Article 50 includes a tailored exception for artistic/satirical works.", th: "Article 50 เปิดข้อยกเว้นให้แจ้งอย่างเหมาะสมในงานสร้างสรรค์" } }
      ]
    }
  });

  // ============================================================================
  // CHAPTER 5: General-Purpose AI Models — GPAI (Stages 2–9)
  // ============================================================================
  registerChapterPack("eu-ai-act", 5, {
    1: {
      kind: "matching",
      title: { en: "Pair Match · GPAI Articles 51–56", th: "จับคู่ความสัมพันธ์ · กฎเกณฑ์ GPAI (Art. 51–56)" },
      instruction: { en: "Match each GPAI concept to its legal rule under Chapter V.", th: "จับคู่หลักการ GPAI กับข้อกำหนดใน Chapter V" },
      timeLimitSeconds: 80,
      leftLabel: { en: "GPAI Concept", th: "แนวคิด GPAI" },
      rightLabel: { en: "Rule / Threshold", th: "หลักเกณฑ์ / เงื่อนไข" },
      pairs: [
        { id: "gp1", left: { en: "10²⁵ FLOPs Compute (Art. 51)", th: "พลังคำนวณ > 10²⁵ FLOPs" }, right: { en: "Presumes GPAI model poses systemic risk", th: "สันนิษฐานว่าโมเดลมีความเสี่ยงเชิงระบบ (Systemic Risk)" }, explain: { en: "Models exceeding 10²⁵ cumulative training FLOPs trigger Art. 55 duties.", th: "เกิน 10²⁵ FLOPs ถือว่ามีความเสี่ยงเชิงระบบและมีหน้าที่เพิ่มตาม Art. 55" } },
        { id: "gp2", left: { en: "Article 53(1)(c)–(d)", th: "มาตรา 53(1)(c)–(d)" }, right: { en: "EU copyright policy & public training data summary", th: "นโยบายลิขสิทธิ์ EU และสรุปข้อมูลฝึกอบรมต่อสาธารณะ" }, explain: { en: "Even open-source GPAI models must respect TDM opt-outs and publish summaries.", th: "แม้โมเดลโอเพนซอร์สก็ต้องปฏิบัติตามลิขสิทธิ์และเผยแพร่สรุปข้อมูลฝึก" } },
        { id: "gp3", left: { en: "Code of Practice (Art. 56)", th: "แนวปฏิบัติที่ดี (Art. 56)" }, right: { en: "Voluntary code facilitated by AI Office to show compliance", th: "แนวปฏิบัติสมัครใจที่ AI Office จัดทำเพื่อใช้อ้างอิงความสอดคล้อง" }, explain: { en: "Signatories can demonstrate Art. 53 & 55 compliance via the Code.", th: "ผู้ลงนามปฏิบัติตามสามารถใช้แสดงการปฏิบัติตาม Art. 53 และ 55 ได้" } },
        { id: "gp4", left: { en: "Article 54", th: "มาตรา 54" }, right: { en: "Non-EU GPAI providers must appoint an EU Authorised Rep", th: "ผู้พัฒนา GPAI นอก EU ต้องแต่งตั้งตัวแทนใน EU" }, explain: { en: "Ensures accountability within the Union market.", th: "เพื่อให้มีผู้รับผิดชอบประสานงานภายในสหภาพยุโรป" } }
      ]
    },
    3: {
      kind: "sorting",
      title: { en: "Category Sort · Standard GPAI vs. Systemic-Risk GPAI", th: "คัดแยกหมวดหมู่ · GPAI ทั่วไป vs ความเสี่ยงเชิงระบบ" },
      instruction: { en: "Sort each duty into Baseline (All GPAI) or Extra Systemic-Risk Duties (Art. 55).", th: "แยกหน้าที่ว่าเป็นเกณฑ์พื้นฐานทุกโมเดล (Art. 53) หรือหน้าที่พิเศษเฉพาะ Systemic Risk (Art. 55)" },
      timeLimitSeconds: 80,
      buckets: [
        { id: "base", title: { en: "Baseline (All GPAI)", th: "เกณฑ์พื้นฐาน (ทุก GPAI)" }, subtitle: { en: "Articles 53–54", th: "Articles 53–54" }, tone: "blue" },
        { id: "sys", title: { en: "Systemic Risk Only", th: "เฉพาะ Systemic Risk" }, subtitle: { en: "Article 55", th: "Article 55" }, tone: "red" }
      ],
      items: [
        { name: { en: "Public Training Data Summary", th: "เผยแพร่สรุปข้อมูลฝึกต่อสาธารณะ" }, hint: { en: "AI Office template", th: "ตามแบบฟอร์ม AI Office" }, bucketId: "base", explain: { en: "Article 53(1)(d) applies to all GPAI providers.", th: "Art. 53(1)(d) บังคับใช้กับ GPAI ทุกราย" } },
        { name: { en: "Adversarial Model Evaluations (Red-Teaming)", th: "ทดสอบเจาะระบบ/ประเมินเชิงรุก (Adversarial Eval)" }, hint: { en: "High-impact frontier safety", th: "ประเมินความเสี่ยงรุนแรง" }, bucketId: "sys", explain: { en: "Article 55 mandates adversarial testing for systemic-risk models.", th: "Art. 55 กำหนดให้โมเดล Systemic Risk ต้องทดสอบเชิงรุก" } },
        { name: { en: "EU Copyright & TDM Opt-Out Policy", th: "นโยบายเคารพลิขสิทธิ์และ TDM Opt-Out" }, hint: { en: "Baseline IP compliance", th: "เคารพลิขสิทธิ์ EU" }, bucketId: "base", explain: { en: "Article 53(1)(c) applies to all GPAI models.", th: "Art. 53(1)(c) ใช้กับ GPAI ทุกราย" } },
        { name: { en: "Serious Incident Tracking & Heightened Cybersecurity", th: "ติดตามรายงานเหตุร้ายแรง & ความปลอดภัยไซเบอร์ขั้นสูง" }, hint: { en: "Union-level risk mitigation", th: "ป้องกันความเสี่ยงระดับสหภาพ" }, bucketId: "sys", explain: { en: "Article 55 requires incident reporting and heightened security.", th: "Art. 55 บังคับให้รายงานเหตุร้ายแรงต่อ AI Office และเสริมความปลอดภัย" } }
      ]
    },
    5: {
      kind: "true-false-sprint",
      title: { en: "Rapid Blitz · GPAI & PDPA", th: "สปรินต์จริงหรือเท็จ · GPAI & PDPA" },
      instruction: { en: "Answer TRUE or FALSE rapidly!", th: "ตอบ จริง หรือ เท็จ ให้ไวที่สุด!" },
      timeLimitSeconds: 65,
      statements: [
        { text: { en: "Open-source GPAI models with systemic risk are exempt from all EU AI Act rules.", th: "โมเดล GPAI โอเพนซอร์สที่มีความเสี่ยงเชิงระบบได้รับยกเว้นกฎหมายทั้งหมด" }, isTrue: false, explain: { en: "Targeted documentation exemptions do NOT apply if the model poses systemic risk.", th: "ข้อยกเว้นไม่ครอบคลุมโมเดลที่มีความเสี่ยงเชิงระบบ" } },
        { text: { en: "Chapter V GPAI rules are enforced centrally by the European AI Office.", th: "กฎ GPAI ใน Chapter V บังคับใช้แบบรวมศูนย์โดย European AI Office" }, isTrue: true, explain: { en: "Centralized enforcement by AI Office + Scientific Panel.", th: "AI Office เป็นผู้กำกับดูแลหลักระดับ EU" } },
        { text: { en: "Sending user personal data via prompts to an external GPAI API engages PDPA rules.", th: "การส่งข้อมูลส่วนบุคคลใน Prompt ไปยัง API ของ GPAI ภายนอกเข้าข่าย PDPA" }, isTrue: true, explain: { en: "Triggers controller/processor duties and cross-border transfer checks under PDPA.", th: "เกิดหน้าที่ผู้ควบคุม/ผู้ประมวลผลข้อมูลและหลักเกณฑ์โอนข้อมูลข้ามแดนตาม PDPA" } },
        { text: { en: "Signing the Code of Practice is mandatory by law for every programmer.", th: "การลงนามใน Code of Practice เป็นข้อบังคับทางกฎหมายสำหรับโปรแกรมเมอร์ทุกคน" }, isTrue: false, explain: { en: "Adherence to the Code of Practice is voluntary (Art. 56).", th: "Code of Practice เป็นแบบสมัครใจ (Voluntary) เพื่อช่วยพิสูจน์การปฏิบัติตาม" } }
      ]
    }
  });

  // ============================================================================
  // CHAPTER 6: Measures in Support of Innovation (Stages 2–9)
  // ============================================================================
  registerChapterPack("eu-ai-act", 6, {
    1: {
      kind: "matching",
      title: { en: "Pair Match · Sandboxes, Real-World Testing & SMEs", th: "จับคู่ความสัมพันธ์ · Sandbox, ทดสอบจริง & SMEs" },
      instruction: { en: "Match each Chapter VI innovation tool to its exact rule.", th: "จับคู่กลไกสนับสนุนนวัตกรรมใน Chapter VI กับเงื่อนไขที่ถูกต้อง" },
      timeLimitSeconds: 80,
      leftLabel: { en: "Innovation Mechanism", th: "กลไกสนับสนุนนวัตกรรม" },
      rightLabel: { en: "Key Legal Rule", th: "เงื่อนไขสำคัญ" },
      pairs: [
        { id: "in1", left: { en: "Sandbox Deadline (Art. 57)", th: "กำหนดเปิด Sandbox (Art. 57)" }, right: { en: "At least one national AI sandbox operational by 2 Aug 2026", th: "ทุกประเทศสมาชิกมี AI Sandbox อย่างน้อย 1 แห่งภายใน 2 ส.ค. 2026" }, explain: { en: "Member States must establish or join an operational AI sandbox by 2 August 2026.", th: "กำหนดให้พร้อมใช้งานภายในวันที่ 2 สิงหาคม 2026" } },
        { id: "in2", left: { en: "Good-Faith Protection (Art. 57(12))", th: "คุ้มครองค่าปรับ (Art. 57(12))" }, right: { en: "No EU AI Act admin fines during sandbox if following guidance", th: "งดปรับทางปกครองตาม EU AI Act หากทำตามแผนโดยสุจริต" }, explain: { en: "Third-party harm liability still applies, but admin fines are waived.", th: "ยกเว้นค่าปรับปกครองแต่ยังคงรับผิดต่อบุคคลภายนอก" } },
        { id: "in3", left: { en: "Real-World Testing Limit (Art. 60)", th: "ระยะเวลาทดสอบจริง (Art. 60)" }, right: { en: "Max 6 months (extendable once by 6 months)", th: "สูงสุด 6 เดือน (ขยายได้อีก 1 ครั้งไม่เกิน 6 เดือน)" }, explain: { en: "Requires authority approval, reversibility, and informed consent.", th: "ต้องขออนุมัติ ย้อนกลับผลลัพธ์ได้ และขอความยินยอม" } },
        { id: "in4", left: { en: "SME & Micro Support (Art. 62–63)", th: "ช่วย SMEs & รายย่อย (Art. 62–63)" }, right: { en: "Priority sandbox access, fee cuts, simplified QMS & lower fine cap", th: "เข้า Sandbox ก่อน ลดค่าธรรมเนียม QMS แบบย่อ และเพดานปรับต่ำกว่า" }, explain: { en: "Prevents small innovators from being priced out of compliance.", th: "ช่วยไม่ให้ผู้ประกอบการรายเล็กแบกรับต้นทุนเกินตัว" } }
      ]
    },
    4: {
      kind: "scenario",
      title: { en: "Decision Path · Running a Real-World AI Trial", th: "เส้นทางตัดสินใจ · ทดสอบ High-Risk AI ในโลกจริง" },
      instruction: { en: "Guide a start-up safely through Chapter VI & PDPA rules.", th: "ช่วยสตาร์ทอัพตัดสินใจให้ถูกหลัก Chapter VI และ PDPA" },
      timeLimitSeconds: 75,
      meterLabel: { en: "Legal Safety", th: "ความปลอดภัยทางกฎหมาย" },
      initialMeter: 70,
      steps: [
        {
          speaker: { en: "Product Lead", th: "หัวหน้าทีมผลิตภัณฑ์" },
          prompt: { en: "We want to test our Annex III system on real users outside a sandbox. What must we get first?", th: "อยากทดสอบระบบ Annex III กับผู้ใช้จริงนอก Sandbox ต้องขออนุญาตและแจ้งอะไรบ้าง?" },
          choices: [
            { text: { en: "Submit testing plan for approval (30-day tacit rule), keep reversibility, and get freely given informed consent.", th: "ยื่นแผนทดสอบขออนุมัติ ให้มนุษย์ควบคุม/ย้อนกลับได้ และขอ Informed Consent อย่างอิสระ" }, delta: 20, isBest: true, note: { en: "Matches Articles 60–61 and PDPA Sections 19 & 23!", th: "ถูกต้องตาม Articles 60–61 และ PDPA มาตรา 19, 23!" } },
            { text: { en: "Test secretly for 2 years without telling participants.", th: "แอบทดสอบเงียบๆ 2 ปีโดยไม่บอกผู้เข้าร่วม" }, delta: -25, isBest: false, note: { en: "Violates both Articles 60–61 and PDPA consent/notice rules.", th: "ละเมิดทั้ง Articles 60–61 และ PDPA อย่างร้ายแรง" } }
          ]
        }
      ]
    },
    5: {
      kind: "true-false-sprint",
      title: { en: "Rapid Blitz · Innovation & PDPA", th: "สปรินต์จริงหรือเท็จ · Sandbox & PDPA" },
      instruction: { en: "Answer TRUE or FALSE quickly!", th: "ตอบ จริง หรือ เท็จ ให้ไวที่สุด!" },
      timeLimitSeconds: 65,
      statements: [
        { text: { en: "Real-world AI predictions during testing must be reversible or disregarded.", th: "ผลลัพธ์จาก AI ระหว่างทดสอบจริงต้องสามารถย้อนกลับหรือเพิกถอนได้" }, isTrue: true, explain: { en: "Article 60(4)(i)-(j) requires human oversight and reversibility.", th: "Article 60(4) กำหนดให้มีมนุษย์กำกับและย้อนกลับผลลัพธ์ได้" } },
        { text: { en: "Sandbox participants are exempt from liability if they injure a third party.", th: "ผู้เข้าร่วม Sandbox ไม่ต้องรับผิดเลยแม้ทำให้บุคคลภายนอกเสียหาย" }, isTrue: false, explain: { en: "Providers remain liable under applicable law for harm to third parties.", th: "ผู้พัฒนายังคงรับผิดตามกฎหมายหากเกิดความเสียหายต่อบุคคลภายนอก" } },
        { text: { en: "Under Art. 59, personal data in public-interest sandboxes must be deleted once testing ends.", th: "ข้อมูลส่วนบุคคลใน Sandbox เพื่อประโยชน์สาธารณะ (ม.59) ต้องถูกลบเมื่อทดสอบเสร็จ" }, isTrue: true, explain: { en: "Deletion, isolation, and logging are mandatory under Art. 59.", th: "ต้องมีมาตรการป้องกัน การบันทึก Log และการลบเมื่อจบการทดสอบ" } },
        { text: { en: "Microenterprises can never simplify any part of their quality management system.", th: "วิสาหกิจขนาดจิ๋วไม่สามารถลดขั้นตอนระบบบริหารคุณภาพได้เลย" }, isTrue: false, explain: { en: "Article 63 permits simplified QMS elements for eligible microenterprises.", th: "Article 63 อนุญาตให้วิสาหกิจขนาดจิ๋วใช้ QMS แบบย่อได้" } }
      ]
    }
  });

  // ============================================================================
  // CHAPTER 7: Governance: Who Is in Charge? (Stages 2–9)
  // ============================================================================
  registerChapterPack("eu-ai-act", 7, {
    1: {
      kind: "matching",
      title: { en: "Pair Match · Union & National AI Bodies", th: "จับคู่ความสัมพันธ์ · หน่วยงานกำกับดูแล AI" },
      instruction: { en: "Match each governance institution to its core mandate under Chapter VII.", th: "จับคู่หน่วยงานใน Chapter VII กับบทบาทหน้าที่หลัก" },
      timeLimitSeconds: 80,
      leftLabel: { en: "Governance Body", th: "หน่วยงานกำกับดูแล" },
      rightLabel: { en: "Core Responsibility", th: "บทบาทหน้าที่หลัก" },
      pairs: [
        { id: "gv1", left: { en: "European AI Office (Art. 64)", th: "European AI Office (ม.64)" }, right: { en: "Central EU hub supervising GPAI models & Codes of Practice", th: "ศูนย์กลางระดับ EU กำกับโมเดล GPAI และประสานงานระหว่างประเทศ" }, explain: { en: "Established within the European Commission as central AI hub.", th: "ตั้งอยู่ในคณะกรรมาธิการยุโรปเพื่อกำกับ GPAI" } },
        { id: "gv2", left: { en: "AI Board (Art. 65–66)", th: "AI Board (ม.65–66)" }, right: { en: "1 rep per Member State + EDPS observer; ensures consistent application", th: "ผู้แทนรัฐสมาชิกรัฐละ 1 คน + EDPS สังเกตการณ์ ดูแลให้ใช้กฎหมายสอดคล้องกัน" }, explain: { en: "Coordinates national regulators and shares best practices.", th: "ประสานงานรัฐสมาชิกและออกข้อเสนอแนะ" } },
        { id: "gv3", left: { en: "Advisory Forum (Art. 67)", th: "Advisory Forum (ม.67)" }, right: { en: "Industry, SMEs, civil society & academia advising the Board", th: "ตัวแทนธุรกิจ SMEs ประชาสังคม และนักวิชาการให้คำปรึกษา" }, explain: { en: "Brings balanced stakeholder perspectives.", th: "รวบรวมมุมมองผู้มีส่วนได้ส่วนเสียทุกภาคส่วน" } },
        { id: "gv4", left: { en: "Scientific Panel (Art. 68–69)", th: "Scientific Panel (ม.68–69)" }, right: { en: "Independent experts issuing systemic-risk alerts", th: "ผู้เชี่ยวชาญอิสระออกคำเตือนความเสี่ยงเชิงระบบ" }, explain: { en: "Supports the AI Office on technical GPAI enforcement.", th: "สนับสนุนทางเทคนิคและเตือนความเสี่ยงเชิงระบบ" } }
      ]
    },
    3: {
      kind: "sorting",
      title: { en: "Category Sort · EU-Level vs. National Authorities", th: "คัดแยกหมวดหมู่ · หน่วยงานระดับ EU vs ระดับประเทศ" },
      instruction: { en: "Sort each role into Union-Level (Section 1) or National-Level (Section 2, Art. 70).", th: "แยกหน้าที่ว่าเป็นหน่วยงานระดับสหภาพยุโรป (Section 1) หรือหน่วยงานระดับชาติ (Section 2)" },
      timeLimitSeconds: 80,
      buckets: [
        { id: "eu", title: { en: "Union-Level (Art. 64–69)", th: "ระดับสหภาพยุโรป (Art. 64–69)" }, subtitle: { en: "Central coordination", th: "กำกับส่วนกลาง" }, tone: "blue" },
        { id: "nat", title: { en: "National Authority (Art. 70)", th: "ระดับประเทศ (Art. 70)" }, subtitle: { en: "On-the-ground oversight", th: "กำกับในแต่ละประเทศ" }, tone: "green" }
      ],
      items: [
        { name: { en: "Notifying Authority (Monitors Assessment Bodies)", th: "Notifying Authority (กำกับหน่วยตรวจรับรอง)" }, hint: { en: "Member State designation", th: "จัดตั้งในแต่ละรัฐสมาชิก" }, bucketId: "nat", explain: { en: "Article 70(1) requires each Member State to designate a Notifying Authority.", th: "Article 70(1) กำหนดให้รัฐสมาชิกตั้ง Notifying Authority" } },
        { name: { en: "European AI Office", th: "European AI Office" }, hint: { en: "Inside EU Commission", th: "ภายในคณะกรรมาธิการยุโรป" }, bucketId: "eu", explain: { en: "Article 64 creates the central European AI Office.", th: "Article 64 จัดตั้งศูนย์กลางระดับ EU" } },
        { name: { en: "National Single Point of Contact", th: "จุดประสานงานกลางแห่งชาติ (Single Point)" }, hint: { en: "Public & cross-border liaison", th: "ประสานงานสาธารณะในประเทศ" }, bucketId: "nat", explain: { en: "Article 70(2) designates one Market Surveillance Authority as Single Point.", th: "Article 70(2) กำหนดจุดติดต่อกลางในแต่ละประเทศ" } },
        { name: { en: "Scientific Panel of Independent Experts", th: "คณะผู้เชี่ยวชาญทางวิทยาศาสตร์อิสระ" }, hint: { en: "Qualified systemic-risk alerts", th: "เตือนความเสี่ยงเชิงระบบ" }, bucketId: "eu", explain: { en: "Articles 68–69 establish the Union-level Scientific Panel.", th: "Articles 68–69 จัดตั้งคณะผู้เชี่ยวชาญอิสระระดับ EU" } }
      ]
    },
    5: {
      kind: "true-false-sprint",
      title: { en: "Rapid Blitz · Governance & PDPC", th: "สปรินต์จริงหรือเท็จ · โครงสร้างผู้กำกับดูแล" },
      instruction: { en: "Judge TRUE or FALSE quickly!", th: "ตอบ จริง หรือ เท็จ ให้ไวที่สุด!" },
      timeLimitSeconds: 65,
      statements: [
        { text: { en: "In Thailand, the PDPC retains full jurisdiction when AI processes personal data in Thailand.", th: "ในไทย สคส. (PDPC) ยังคงมีอำนาจเต็มเมื่อ AI ประมวลผลข้อมูลส่วนบุคคลในไทย" }, isTrue: true, explain: { en: "AI governance and PDPA oversight operate in parallel.", th: "หน่วยงาน AI และ สคส. (PDPC) กำกับดูแลควบคู่กัน" } },
        { text: { en: "The AI Office holds voting rights inside the European AI Board.", th: "AI Office มีสิทธิออกเสียงลงคะแนนใน European AI Board" }, isTrue: false, explain: { en: "The AI Office participates without voting rights (Articles 65–66).", th: "AI Office เข้าร่วมโดยไม่มีสิทธิออกเสียง (Non-voting)" } },
        { text: { en: "National competent authorities must act independently and impartially (Art. 70(3)).", th: "หน่วยงานกำกับระดับชาติต้องปฏิบัติหน้าที่อย่างอิสระและเป็นกลาง (Art. 70(3))" }, isTrue: true, explain: { en: "Independence, adequate funding, AI & rights expertise are mandatory.", th: "Article 70(3) บังคับเรื่องความเป็นอิสระและทรัพยากรที่เพียงพอ" } },
        { text: { en: "Member States are forbidden from designating data protection authorities to oversee biometric AI.", th: "รัฐสมาชิกห้ามไม่ให้หน่วยงานคุ้มครองข้อมูลส่วนบุคคลกำกับดูแล AI ด้านชีวภาพ" }, isTrue: false, explain: { en: "Member States frequently designate DPAs to supervise sensitive biometric/law-enforcement AI.", th: "รัฐสมาชิกมักมอบหมายให้ DPA กำกับดูแลระบบอ่อนไหวอย่างไบโอเมตริกซ์" } }
      ]
    }
  });

  // ============================================================================
  // CHAPTER 8: Your Rights, Remedies & Enforcement (Stages 2–9)
  // ============================================================================
  registerChapterPack("eu-ai-act", 8, {
    1: {
      kind: "matching",
      title: { en: "Pair Match · Remedies, Fines & PDPA", th: "จับคู่ความสัมพันธ์ · สิทธิ เยียวยา & โทษปรับ" },
      instruction: { en: "Match each legal remedy or penalty tier to its exact rule.", th: "จับคู่สิทธิการเยียวยาหรือเพดานค่าปรับกับหลักเกณฑ์ที่ถูกต้อง" },
      timeLimitSeconds: 80,
      leftLabel: { en: "Remedy / Penalty", th: "สิทธิ / โทษปรับ" },
      rightLabel: { en: "Legal Standard", th: "หลักเกณฑ์ตามกฎหมาย" },
      pairs: [
        { id: "en1", left: { en: "Right to Explanation (Art. 86)", th: "สิทธิขอคำอธิบาย (Art. 86)" }, right: { en: "Clear explanation of AI's role in adverse Annex III decisions", th: "คำอธิบายบทบาท AI และเหตุผลหลักเมื่อได้รับผลกระทบเชิงลบจาก Annex III" }, explain: { en: "Applies when high-risk AI significantly affects rights, health, or safety.", th: "ใช้ได้เมื่อได้รับผลกระทบทางกฎหมายหรือสิทธิอย่างมีนัยสำคัญ" } },
        { id: "en2", left: { en: "Prohibited AI Fine (Art. 99(3))", th: "โทษปรับ AI ต้องห้าม (Art. 99(3))" }, right: { en: "Up to EUR 35,000,000 or 7% worldwide annual turnover", th: "สูงสุด 35,000,000 ยูโร หรือ 7% ของรายได้รวมทั่วโลก" }, explain: { en: "Highest administrative fine tier under Chapter XII.", th: "เพดานโทษปรับสูงสุดใน Chapter XII" } },
        { id: "en3", left: { en: "Misleading Info Fine (Art. 99(5))", th: "โทษให้ข้อมูลเท็จ (Art. 99(5))" }, right: { en: "Up to EUR 7,500,000 or 1% worldwide annual turnover", th: "สูงสุด 7,500,000 ยูโร หรือ 1% ของรายได้รวมทั่วโลก" }, explain: { en: "Covers incorrect, incomplete, or misleading replies to authorities.", th: "กรณีให้ข้อมูลเท็จหรือไม่ครบถ้วนแก่หน่วยงานกำกับดูแล" } },
        { id: "en4", left: { en: "PDPA Liability (Sec. 77–90)", th: "ความรับผิด PDPA (ม.77–90)" }, right: { en: "Up to THB 5M fine, 2x punitive damages & criminal penalties", th: "ปรับสูงสุด 5 ล้านบาท + ค่าเสียหายเชิงลงโทษ 2 เท่า + โทษอาญา" }, explain: { en: "Applies cumulatively alongside EU AI Act penalties.", th: "บังคับใช้ซ้อนทับแยกต่างหากหากละเมิดข้อมูลส่วนบุคคล" } }
      ]
    },
    2: {
      kind: "binary-stamp",
      title: { en: "Rapid Stamp · Which Fine Tier Applies?", th: "ประทับตราแยกฝั่ง · โทษปรับขั้น 35M/7% หรือ 15M/3%?" },
      instruction: { en: "Stamp each infringement with its maximum fine tier under Chapter XII.", th: "แยกกรณีละเมิดว่าอยู่เพดานปรับสูงสุด 35M/7% หรือ 15M/3%" },
      timeLimitSeconds: 75,
      leftButton: { en: "UP TO 35M EUR / 7%", th: "สูงสุด 35M EUR / 7%" },
      rightButton: { en: "UP TO 15M EUR / 3%", th: "สูงสุด 15M EUR / 3%" },
      leftStamp: { en: "35M / 7%", th: "35M / 7%" },
      rightStamp: { en: "15M / 3%", th: "15M / 3%" },
      cards: [
        { code: "FIN #801", title: { en: "Deploying Social Scoring AI", th: "ใช้งานระบบ Social Scoring (Art. 5)" }, desc: { en: "A company markets a banned social scoring tool in violation of Art. 5.", th: "องค์กรนำระบบให้คะแนนพฤติกรรมสังคมต้องห้ามมาจำหน่าย" }, answer: "left", explain: { en: "Prohibited AI infringements carry up to EUR 35M or 7% turnover (Art. 99(3)).", th: "การฝ่าฝืน AI ต้องห้ามมีโทษสูงสุด 35 ล้านยูโร หรือ 7% (Art. 99(3))" } },
        { code: "FIN #802", title: { en: "GPAI Provider Breaches Art. 53", th: "ผู้พัฒนา GPAI ฝ่าฝืนหน้าที่ Art. 53" }, desc: { en: "A foundation model provider ignores transparency and copyright duties.", th: "ผู้พัฒนาโมเดล GPAI ไม่จัดทำเอกสารและละเลยนโยบายลิขสิทธิ์" }, answer: "right", explain: { en: "Article 101 sets GPAI fines up to EUR 15M or 3% turnover.", th: "Article 101 กำหนดเพดานปรับ GPAI สูงสุด 15 ล้านยูโร หรือ 3%" } },
        { code: "FIN #803", title: { en: "Skipping High-Risk Duties (Art. 99(4))", th: "ละเลยหน้าที่ High-Risk / ความโปร่งใส" }, desc: { en: "An Annex III system ships without risk management or human oversight.", th: "ปล่อยระบบ High-Risk โดยไม่มีการบริหารความเสี่ยงและมนุษย์กำกับ" }, answer: "right", explain: { en: "Other core obligations carry up to EUR 15M or 3% turnover.", th: "Article 99(4) กำหนดเพดานสูงสุด 15 ล้านยูโร หรือ 3%" } }
      ]
    },
    5: {
      kind: "true-false-sprint",
      title: { en: "Rapid Blitz · Rights, Whistleblowers & Enforcement", th: "สปรินต์จริงหรือเท็จ · สิทธิ การแจ้งเบาะแส & บทลงโทษ" },
      instruction: { en: "Answer TRUE or FALSE quickly!", th: "ตอบ จริง หรือ เท็จ ให้ไวที่สุด!" },
      timeLimitSeconds: 65,
      statements: [
        { text: { en: "Article 87 protects whistleblowers who report EU AI Act infringements under Directive (EU) 2019/1937.", th: "Article 87 คุ้มครองผู้แจ้งเบาะแส (Whistleblowers) ที่รายงานการละเมิด EU AI Act" }, isTrue: true, explain: { en: "Employees and insiders exposing unlawful AI practices are protected.", th: "พนักงานและคนในที่เปิดโปงการฝ่าฝืนได้รับความคุ้มครองตามกฎหมาย" } },
        { text: { en: "Once a high-risk AI passes initial checks, providers never need post-market monitoring.", th: "เมื่อ High-Risk AI ผ่านตรวจครั้งแรกแล้ว ไม่ต้องติดตามผลหลังวางตลาดอีก" }, isTrue: false, explain: { en: "Article 72 requires ongoing post-market monitoring throughout its lifetime.", th: "Article 72 บังคับให้ติดตามวิเคราะห์ประสิทธิภาพตลอดอายุการใช้งาน" } },
        { text: { en: "PDPA grants complementary rights to access (Sec. 30), object (Sec. 32), erase (Sec. 33), and rectify (Sec. 35).", th: "PDPA ให้สิทธิเข้าถึง (ม.30) คัดค้าน (ม.32) ลบ (ม.33) และแก้ไขข้อมูล (ม.35) ควบคู่กัน" }, isTrue: true, explain: { en: "PDPA data subject rights complement EU AI Act Art. 85–86 remedies.", th: "สิทธิเจ้าของข้อมูลตาม PDPA ใช้ควบคู่กับสิทธิเยียวยาใน EU AI Act ได้" } },
        { text: { en: "Serious incidents causing death or critical infrastructure failure can be kept secret indefinitely.", th: "เหตุการณ์ร้ายแรงที่ทำให้เสียชีวิตหรือระบบโครงสร้างพื้นฐานล่มสามารถปิดเป็นความลับได้" }, isTrue: false, explain: { en: "Article 73 mandates immediate reporting after establishing a causal link.", th: "Article 73 บังคับให้รายงานเหตุการณ์ร้ายแรงทันที" } }
      ]
    },
    8: {
      kind: "order-steps",
      title: { en: "Step Sequence · Responding to a Serious AI Incident", th: "เรียงลำดับขั้นตอน · รับมือเมื่อเกิดเหตุร้ายแรงจาก AI" },
      instruction: { en: "Arrange the 4 post-market & remedy steps in order.", th: "เรียงลำดับขั้นตอนการตรวจสอบและเยียวยาเหตุร้ายแรงตั้งแต่ 1 ถึง 4" },
      timeLimitSeconds: 75,
      steps: [
        { rank: 1, label: { en: "Detect Issue via Post-Market Monitoring or User Complaint (Art. 72 & 85)", th: "ตรวจพบปัญหาจากระบบติดตามผลหลังขายหรือคำร้องเรียน (Art. 72 & 85)" }, explain: { en: "Continuous monitoring and complaint channels surface real-world harms.", th: "ระบบติดตามและช่องทางร้องเรียนช่วยจับสัญญาณปัญหาได้ไว" } },
        { rank: 2, label: { en: "Halt/Correct Risky Behavior & Provide Affected User Explanation (Art. 86)", th: "ระงับ/แก้ไขความเสี่ยงและชี้แจงคำอธิบายแก่ผู้ได้รับผลกระทบ (Art. 86)" }, explain: { en: "Protect people immediately and honor explanation/PDPA rights.", th: "หยุดผลกระทบและให้คำอธิบายตามสิทธิผู้ได้รับผลกระทบ" } },
        { rank: 3, label: { en: "Report Serious Incident to Market Surveillance Authority (Art. 73)", th: "รายงานเหตุการณ์ร้ายแรงต่อหน่วยงานกำกับดูแลตลาด (Art. 73)" }, explain: { en: "Statutory reporting applies immediately upon establishing causal link.", th: "ต้องรายงานทันทีเมื่อพบความเชื่อมโยงเชิงสาเหตุ" } },
        { rank: 4, label: { en: "Cooperate with Regulators & Apply Corrective/Recall Actions (Ch. IX & XII)", th: "ร่วมมือกับผู้กำกับดูแลและแก้ไข/เรียกคืนระบบ (Ch. IX & XII)" }, explain: { en: "Regulators verify compliance and enforce penalties if breached.", th: "ดำเนินการแก้ไขและรับการตรวจสอบตามกฎหมาย" } }
      ]
    }
  });

  // ============================================================================
  // UNIVERSAL AUTO-ADAPTER: Generates playable mini-games for Chapters 3-8 or any course
  // ============================================================================
  const buildAutoLevel = (chapter: number, stagePos: number): MiniGameLevel => {
    const type = LearningHausStageCatalog.getStageGameType(stagePos);
    const prompts = LearningHausQuestions.chapterPrompts[chapter] || LearningHausQuestions.chapterPrompts[2] || [];
    const theme = LearningHausStageCatalog.chapterThemes.find((c) => c.chapter === chapter);
    const chLabel = theme ? `Chapter ${chapter}: ${theme.chapterTitle}` : `Chapter ${chapter}`;

    const safePairs = prompts.slice(0, 4).map((p, idx) => ({
      id: `auto-${chapter}-${stagePos}-${idx}`,
      left: p[0],
      right: p[1],
      explain: p[2] || p[1]
    }));

    if (type === "matching") {
      const sliceStart = stagePos >= 6 && prompts.length >= 8 ? 4 : 0;
      const list = prompts.slice(sliceStart, sliceStart + 4).map((p, idx) => ({
        id: `m-${chapter}-${stagePos}-${idx}`,
        left: p[0],
        right: p[1],
        explain: p[2] || p[1]
      }));
      return {
        kind: "matching",
        title: { en: `Pair Match · ${chLabel}`, th: `จับคู่ความสัมพันธ์ · บทที่ ${chapter}` },
        instruction: { en: "Link each question prompt on the left to its exact matching principle on the right.", th: "จับคู่หัวข้อฝั่งซ้ายให้ตรงกับหลักการที่ถูกต้องฝั่งขวา" },
        timeLimitSeconds: 80,
        leftLabel: { en: "Prompts", th: "ประเด็นคำถาม" },
        rightLabel: { en: "Core Principles", th: "หลักการสำคัญ" },
        pairs: list.length >= 2 ? list : safePairs
      };
    }

    if (type === "binary-stamp") {
      const cards = prompts.slice(0, 4).map((p, idx) => {
        const isCorrectStatement = idx % 2 === 0;
        const wrongText = (p[3] && p[3][0]) || "No compliance review or transparency obligation applies.";
        return {
          code: `CASE #${chapter}0${idx + 1}`,
          title: p[0],
          desc: isCorrectStatement ? p[1] : wrongText,
          answer: (isCorrectStatement ? "left" : "right") as "left" | "right",
          explain: p[2] || `Correct principle: ${p[1]}`
        };
      });
      return {
        kind: "binary-stamp",
        title: { en: `Rapid Stamp · ${chLabel}`, th: `ประทับตราแยกฝั่ง · บทที่ ${chapter}` },
        instruction: { en: "Judge whether each statement accurately reflects the chapter's rule or is a violation/myth.", th: "ตัดสินว่าแต่ละการ์ดตรงตามหลักการของบทเรียนหรือเป็นข้อผิดพลาด" },
        timeLimitSeconds: 75,
        leftButton: { en: "STAMP: VALID", th: "ประทับตรา: ถูกต้อง" },
        rightButton: { en: "STAMP: FLAWED", th: "ประทับตรา: ไม่ถูกต้อง" },
        leftStamp: { en: "VALID", th: "ถูกต้อง" },
        rightStamp: { en: "FLAWED", th: "ไม่ถูกต้อง" },
        cards
      };
    }

    if (type === "sorting") {
      return {
        kind: "sorting",
        title: { en: `Category Sort · ${chLabel}`, th: `คัดแยกหมวดหมู่ · บทที่ ${chapter}` },
        instruction: { en: "Sort each practice card into Compliant Practice or Legal Risk.", th: "คัดแยกแต่ละกรณีลงกล่องแนวปฏิบัติที่ถูกต้องหรือความเสี่ยงทางกฎหมาย" },
        timeLimitSeconds: 75,
        buckets: [
          { id: "compliant", title: { en: "Compliant Practice", th: "แนวปฏิบัติที่ถูกต้อง" }, subtitle: { en: "Follows chapter rules", th: "สอดคล้องกับกฎในบทเรียน" }, tone: "green" },
          { id: "risk", title: { en: "Compliance Risk", th: "จุดเสี่ยง / ละเมิด" }, subtitle: { en: "Needs correction or banned", th: "ต้องแก้ไขหรือห้ามทำ" }, tone: "red" }
        ],
        items: prompts.slice(0, 4).map((p, idx) => {
          const isGood = idx % 2 === 0;
          const badOption = (p[3] && p[3][0]) || "Ignoring documentation and oversight rules";
          return {
            name: isGood ? p[1] : badOption,
            hint: p[0],
            bucketId: isGood ? "compliant" : "risk",
            explain: p[2] || p[1]
          };
        })
      };
    }

    if (type === "scenario") {
      return {
        kind: "scenario",
        title: { en: `Decision Path · ${chLabel}`, th: `เส้นทางตัดสินใจ · บทที่ ${chapter}` },
        instruction: { en: "Advise your team across 3 practical decisions to keep your score meter high.", th: "ช่วยทีมตัดสินใจ 3 สถานการณ์เพื่อรักษาคะแนนความถูกต้อง" },
        timeLimitSeconds: 85,
        meterLabel: { en: "Readiness Meter", th: "แถบความพร้อม" },
        initialMeter: 60,
        steps: prompts.slice(0, 3).map((p, idx) => {
          const badChoice = (p[3] && p[3][0]) || "Skip the requirement to save time.";
          const goodFirst = idx % 2 === 0;
          const goodObj = { text: p[1], delta: +15, isBest: true, note: p[2] || p[1] };
          const badObj = { text: badChoice, delta: -20, isBest: false, note: p[2] || `Better choice: ${p[1]}` };
          return {
            speaker: theme ? `${theme.companionName} · Advisor Desk` : "Team Advisor",
            prompt: p[0],
            choices: goodFirst ? [goodObj, badObj] : [badObj, goodObj]
          };
        })
      };
    }

    if (type === "true-false-sprint") {
      return {
        kind: "true-false-sprint",
        title: { en: `Rapid Blitz · ${chLabel}`, th: `สปรินต์จริงหรือเท็จ · บทที่ ${chapter}` },
        instruction: { en: "Answer TRUE or FALSE rapidly to chain combo multipliers!", th: "ตอบ จริง หรือ เท็จ ให้ไวเพื่อสะสมคอมโบ!" },
        timeLimitSeconds: 65,
        statements: prompts.slice(0, 5).map((p, idx) => {
          const truth = idx % 2 === 0;
          const falseStmt = (p[3] && p[3][0]) || "This rule has no obligations for organisations.";
          return {
            text: truth ? `${p[0]} → ${p[1]}` : `${p[0]} → ${falseStmt}`,
            isTrue: truth,
            explain: p[2] || p[1]
          };
        })
      };
    }

    if (type === "inspector") {
      const spots = prompts.slice(0, 3).flatMap((p, idx) => {
        const badDesc = (p[3] && p[3][0]) || "Skips required checks and transparency.";
        return [
          { id: `bad-${idx}`, title: `Issue Check #${idx + 1}`, desc: badDesc, isTarget: true, explain: p[2] || `Expected: ${p[1]}` },
          { id: `ok-${idx}`, title: `Verified Check #${idx + 1}`, desc: p[1], isTarget: false, explain: p[2] || "Compliant control." }
        ];
      });
      return {
        kind: "inspector",
        title: { en: `Spot the Clues · ${chLabel}`, th: `นักสืบจับจุดสำคัญ · บทที่ ${chapter}` },
        instruction: { en: "Inspect the checklist below and tap the 3 flawed items.", th: "ตรวจรายการด้านล่างแล้วคลิกจับผิด 3 ข้อที่ไม่ถูกต้อง" },
        timeLimitSeconds: 80,
        artifactTitle: `${chLabel}: Quick Check`,
        goalLabel: { en: "Tap 3 flaws", th: "จับผิด 3 จุด" },
        hotspots: [spots[0], spots[1], spots[3], spots[2], spots[4], spots[5]].filter(Boolean)
      };
    }

    // Default: order-steps
    return {
      kind: "order-steps",
      title: { en: `Step Sequence · ${chLabel}`, th: `เรียงลำดับขั้นตอน · บทที่ ${chapter}` },
      instruction: { en: "Tap the 4 review steps in exact chronological order from Step 1 to Step 4.", th: "แตะการ์ดด้านล่างเรียงลำดับขั้นตอนตั้งแต่ขั้นที่ 1 ถึงขั้นที่ 4" },
      timeLimitSeconds: 75,
      steps: [
        { rank: 1, label: { en: `Identify Scope & Rules in ${chLabel}`, th: `ระบุขอบเขตและกฎเกณฑ์ของบทที่ ${chapter}` }, explain: { en: "Start by confirming which rules apply.", th: "เริ่มต้นจากการตรวจสอบว่ากฎใดบ้างที่เกี่ยวข้อง" } },
        { rank: 2, label: { en: "Assess Risks & Required Documentation", th: "ประเมินความเสี่ยงและเอกสารที่จำเป็น" }, explain: { en: "Map risks before deploying changes.", th: "วิเคราะห์ความเสี่ยงและจัดเตรียมเอกสารก่อนใช้งาน" } },
        { rank: 3, label: { en: "Implement Transparency & Human Oversight", th: "วางมาตรการความโปร่งใสและให้มนุษย์กำกับดูแล" }, explain: { en: "Build clear user disclosures and review controls.", th: "เพิ่มการแจ้งผู้ใช้และระบบตรวจสอบโดยมนุษย์" } },
        { rank: 4, label: { en: "Verify Compliance & Monitor Continuously", th: "ตรวจสอบความสอดคล้องและติดตามผลต่อเนื่อง" }, explain: { en: "Keep monitoring performance and legal alignment post-launch.", th: "ติดตามและทบทวนความถูกต้องอย่างสม่ำเสมอหลังเปิดใช้งาน" } }
      ]
    };
  };

  export const resolveLevel = (courseId: string, chapter: number, stagePosition: number): MiniGameLevel | null => {
    const type = LearningHausStageCatalog.getStageGameType(stagePosition);
    if (type === "quiz") return null;
    const pack = registry.get(`${courseId}:${chapter}`);
    if (pack && pack[stagePosition]) return pack[stagePosition]!;
    return buildAutoLevel(chapter, stagePosition);
  };
}

Object.assign(window, { LearningHausMiniGamePacks });
