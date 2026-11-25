// ข้อมูลสไปรต์พิกเซล 52x52 ท่านั่งหันหน้าตรง (Classic Front Sit) และตัวเรนเดอร์พาเลตต์สีโดยตรงสำหรับตัวละครแมว LearningHaus
namespace LearningHausPixelCat {
  export type PatternSlotTarget = "pattern1" | "pattern2" | "pattern3";
  export type EyeColorTarget = "eyeLeft" | "eyeRight" | "eyeGlint";
  export type OutfitColorTarget = "outfit1" | "outfit2" | "outfit3";
  export type PropColorTarget = "prop1" | "prop2" | "prop3";

  export type ColorTarget =
    | "fur"
    | PatternSlotTarget
    | EyeColorTarget
    | OutfitColorTarget
    | PropColorTarget;

  export type CreatorCategoryTab = "fur" | "eyes" | "outfit" | "prop";
  export type FurPatternId = "tabby" | "solid" | "tuxedo" | "calico" | "siamese";
  export type EyeStyleId = "round" | "sparkle" | "cool" | "heterochromia" | "happy";
  export type OutfitId = "none" | "scarf" | "hoodie" | "suit" | "sweater" | "cloak";
  export type PropId =
    | "none"
    | "ribbon"
    | "sprout"
    | "glasses"
    | "headphones"
    | "headband"
    | "coffee"
    | "grad-cap"
    | "crown"
    | "wizard-hat"
    | "halo"
    | "beret"
    | "flower-crown"
    | "star-clip"
    | "visor";

  export type AvatarBgId =
    | "sage-cream"
    | "warm-peach"
    | "sky-cloud"
    | "mint-checker"
    | "sunburst-gold"
    | "sakura-petals"
    | "neon-grid"
    | "royal-cosmos"
    | "pixel-polka"
    | "sunset-wave"
    | "aurora-glow"
    | "law-pillars"
    | "prism-holo";

  export type AvatarBgSource = "starter" | "achievement" | "quest";

  export type AvatarBgDefinition = {
    id: AvatarBgId;
    name: string;
    nameTh: string;
    source: AvatarBgSource;
    achievementId?: string | null;
    questId?: string | null;
    ringColor: string;
    unlockHint: string;
    unlockHintTh: string;
  };

  export type LayerColor = {
    h: number; // 0..360
    s: number; // 0..100
    v: number; // 0..100
    a: number; // 0..100 (Opacity %)
  };

  export type CatConfig = {
    pattern: FurPatternId;
    eyeStyle: EyeStyleId;
    outfit: OutfitId;
    prop: PropId;
    avatarBg?: AvatarBgId;
    showGrid: boolean;
    colors: Record<ColorTarget, LayerColor>;
  };

  export type PresetSlot = {
    slot: number; // 1..4
    name: string;
    config: CatConfig | null;
    updatedAt: string | null;
  };

  export type CatJumpPhase = "idle" | "crouch" | "launch" | "air" | "land";

  export type IdleAnimPose = {
    swayDx: -1 | 0 | 1;
    breathDy: 0 | 1;
    tailDx: -1 | 0 | 1;
    jumpPhase?: CatJumpPhase;
  };

  export type PixelRole =
    | "transparent"
    | "outline"
    | "nose"
    | "innerEarLight"
    | "innerEarShadow"
    | "baseFur"
    | "baseFurShadow"
    | "pattern1"
    | "pattern2"
    | "pattern3"
    | "eyeSlot";

  export type ColorChannelMeta = {
    target: ColorTarget;
    label: string;
    category: CreatorCategoryTab;
  };

  export type PatternDefinition = {
    id: FurPatternId;
    name: string;
    nameTh: string;
    activeSlots: readonly PatternSlotTarget[];
    slotLabels: Partial<Record<PatternSlotTarget, string>>;
    slotLabelsTh: Partial<Record<PatternSlotTarget, string>>;
    resolveCoatRole: (r: number, c: number, ch: string) => "baseFur" | "baseFurShadow" | PatternSlotTarget;
  };

  export type OutfitDefinition = {
    id: OutfitId;
    name: string;
    nameTh: string;
    channels: readonly { target: OutfitColorTarget; label: string; labelTh: string }[];
  };

  export type PropDefinition = {
    id: PropId;
    name: string;
    nameTh: string;
    icon: string;
    achievementId: string | null;
    achievementName: string;
    achievementNameTh: string;
    questId?: string | null;
    requirementHint: string;
    requirementHintTh: string;
    channels: readonly { target: PropColorTarget; label: string; labelTh: string }[];
  };

  export const GRID_SIZE = 52;
  export const TOTAL_PRESET_SLOTS = 4;

  export const NEUTRAL_POSE: IdleAnimPose = Object.freeze({
    swayDx: 0,
    breathDy: 0,
    tailDx: 0
  });

  export const OUTFIT_CATALOG: Record<OutfitId, OutfitDefinition> = Object.freeze({
    none: {
      id: "none",
      name: "None",
      nameTh: "ไม่ใส่เสื้อ",
      channels: []
    },
    scarf: {
      id: "scarf",
      name: "Scarf",
      nameTh: "ผ้าพันคอ",
      channels: [
        { target: "outfit1", label: "Main Scarf", labelTh: "ผืนผ้าพันคอหลัก" },
        { target: "outfit2", label: "Stripes & Fringe", labelTh: "แถบลายและชายครุย" }
      ]
    },
    hoodie: {
      id: "hoodie",
      name: "Hoodie",
      nameTh: "เสื้อฮู้ด",
      channels: [
        { target: "outfit1", label: "Hoodie Body", labelTh: "ตัวเสื้อฮู้ด" },
        { target: "outfit2", label: "Pocket & Trim", labelTh: "กระเป๋าหน้าและขอบเสื้อ" },
        { target: "outfit3", label: "Drawstrings", labelTh: "สายเชือกฮู้ด" }
      ]
    },
    suit: {
      id: "suit",
      name: "Scholar Suit",
      nameTh: "สูทนักวิชาการ",
      channels: [
        { target: "outfit1", label: "Jacket", labelTh: "เสื้อสูทนอก" },
        { target: "outfit2", label: "Inner Shirt", labelTh: "เสื้อเชิ้ตด้านใน" },
        { target: "outfit3", label: "Necktie", labelTh: "เนกไท" }
      ]
    },
    sweater: {
      id: "sweater",
      name: "Knit Sweater",
      nameTh: "สเวตเตอร์ไหมพรม",
      channels: [
        { target: "outfit1", label: "Main Knit", labelTh: "เนื้อไหมพรมหลัก" },
        { target: "outfit2", label: "Knit Pattern", labelTh: "ลายถักไหมพรม" },
        { target: "outfit3", label: "Collar & Hem", labelTh: "ขอบคอและชายเสื้อ" }
      ]
    },
    cloak: {
      id: "cloak",
      name: "Cyber Cloak",
      nameTh: "ผ้าคลุมไซเบอร์",
      channels: [
        { target: "outfit1", label: "Main Cloak", labelTh: "ผืนผ้าคลุมหลัก" },
        { target: "outfit2", label: "Neon Trim", labelTh: "ขอบแสงนีออน" },
        { target: "outfit3", label: "Energy Brooch", labelTh: "เข็มกลัดพลังงาน" }
      ]
    }
  });

  export const PATTERN_CATALOG: Record<FurPatternId, PatternDefinition> = Object.freeze({
    solid: {
      id: "solid",
      name: "Solid",
      nameTh: "สีล้วน",
      activeSlots: [],
      slotLabels: {},
      slotLabelsTh: {},
      resolveCoatRole: (_r, _c, ch) => {
        if (ch === "s" || ch === "k") return "baseFurShadow";
        return "baseFur";
      }
    },
    tuxedo: {
      id: "tuxedo",
      name: "Tuxedo",
      nameTh: "ทักซิโด้",
      activeSlots: ["pattern1"],
      slotLabels: {
        pattern1: "Pattern 1 (Chest & Paws)"
      },
      slotLabelsTh: {
        pattern1: "สีลวดลาย 1 (อกและอุ้งเท้า)"
      },
      resolveCoatRole: (_r, _c, ch) => {
        if (ch === "w" || ch === "k") return "pattern1";
        if (ch === "s") return "baseFurShadow";
        return "baseFur";
      }
    },
    siamese: {
      id: "siamese",
      name: "Siamese",
      nameTh: "วิเชียรมาศ",
      activeSlots: ["pattern1"],
      slotLabels: {
        pattern1: "Pattern 1 (Ears, Face, Paws & Tail)"
      },
      slotLabelsTh: {
        pattern1: "สีลวดลาย 1 (แต้มหู หน้า อุ้งเท้า หาง)"
      },
      resolveCoatRole: (r, c, ch) => {
        const isEarPoint = r <= 7 && (ch === "b" || ch === "p");
        const isFaceMask = r >= 9 && r <= 18 && c >= 12 && c <= 33 && (ch === "b" || ch === "p");
        const isTailOrPawPoint = (c <= 8 && r >= 18) || (r >= 36 && (ch === "b" || ch === "p"));
        if (isEarPoint || isFaceMask || isTailOrPawPoint) {
          return "pattern1";
        }
        if (ch === "s" || ch === "k") return "baseFurShadow";
        return "baseFur";
      }
    },
    tabby: {
      id: "tabby",
      name: "Tabby",
      nameTh: "ลายเสือ",
      activeSlots: ["pattern1", "pattern2", "pattern3"],
      slotLabels: {
        pattern1: "Pattern 1 (Tabby Stripes)",
        pattern2: "Pattern 2 (Chest & Cheeks)",
        pattern3: "Pattern 3 (Chest Shading)"
      },
      slotLabelsTh: {
        pattern1: "สีลวดลาย 1 (แถบลายเสือ)",
        pattern2: "สีลวดลาย 2 (ขนอกและแก้ม)",
        pattern3: "สีลวดลาย 3 (เงาไล่เฉดอก)"
      },
      resolveCoatRole: (_r, _c, ch) => {
        if (ch === "p") return "pattern1";
        if (ch === "w") return "pattern2";
        if (ch === "k") return "pattern3";
        if (ch === "s") return "baseFurShadow";
        return "baseFur";
      }
    },
    calico: {
      id: "calico",
      name: "Calico",
      nameTh: "สามสี",
      activeSlots: ["pattern1", "pattern2", "pattern3"],
      slotLabels: {
        pattern1: "Pattern 1 (Left Patches)",
        pattern2: "Pattern 2 (Right Patches)",
        pattern3: "Pattern 3 (Chest & Paws)"
      },
      slotLabelsTh: {
        pattern1: "สีลวดลาย 1 (แต้มสีฝั่งซ้าย)",
        pattern2: "สีลวดลาย 2 (แต้มสีฝั่งขวา)",
        pattern3: "สีลวดลาย 3 (ขนอกและอุ้งเท้า)"
      },
      resolveCoatRole: (r, c, ch) => {
        if (ch === "w" || ch === "k") return "pattern3";
        const inPatch1 =
          (r <= 12 && c <= 18) ||
          (r >= 26 && r <= 37 && c >= 28) ||
          (c <= 8 && r >= 23 && r <= 30) ||
          (ch === "p" && c < 23);
        if (inPatch1) return "pattern1";
        const inPatch2 =
          (r <= 12 && c >= 27) ||
          (r >= 28 && r <= 39 && c >= 8 && c <= 16) ||
          (c <= 8 && r >= 31) ||
          (ch === "p" && c >= 23);
        if (inPatch2) return "pattern2";
        if (ch === "s") return "baseFurShadow";
        return "baseFur";
      }
    }
  });

  export const PROPS: readonly PropDefinition[] = Object.freeze([
    {
      id: "none",
      name: "None",
      nameTh: "ไม่ใส่พร็อพ",
      icon: "",
      achievementId: null,
      achievementName: "Starter",
      achievementNameTh: "เริ่มต้น",
      requirementHint: "Available right away",
      requirementHintTh: "ใช้งานได้ทันที",
      channels: []
    },
    {
      id: "ribbon",
      name: "Cute Ribbon",
      nameTh: "โบว์ติดหู",
      icon: "",
      achievementId: null,
      achievementName: "Starter Gift",
      achievementNameTh: "ของขวัญเริ่มต้น",
      requirementHint: "Available right away for all learners",
      requirementHintTh: "ใช้งานได้ทันทีสำหรับผู้เรียนทุกคน",
      channels: [
        { target: "prop1", label: "Ribbon Body", labelTh: "ตัวโบว์หลัก" },
        { target: "prop2", label: "Center Knot", labelTh: "ปมกลางโบว์" }
      ]
    },
    {
      id: "sprout",
      name: "Pixel Sprout",
      nameTh: "ต้นอ่อนพิกเซล",
      icon: "",
      achievementId: "beginner",
      achievementName: "Beginner",
      achievementNameTh: "Beginner",
      requirementHint: "Unlocks after completing your first lesson (Beginner)",
      requirementHintTh: "ปลดล็อกเมื่อผ่านด่านเรียนแรก (Beginner)",
      channels: [
        { target: "prop1", label: "Sprout Leaves", labelTh: "ใบไม้ต้นอ่อน" },
        { target: "prop2", label: "Leaf Highlight & Stem", labelTh: "ไฮไลต์ใบและก้าน" }
      ]
    },
    {
      id: "glasses",
      name: "Smart Glasses",
      nameTh: "แว่นนักวิเคราะห์",
      icon: "",
      achievementId: "quiz-challenger",
      achievementName: "Quiz Challenger",
      achievementNameTh: "Quiz Challenger",
      requirementHint: "Unlocks after finishing your first quiz (Quiz Challenger)",
      requirementHintTh: "ปลดล็อกเมื่อทำควิซจบครั้งแรก (Quiz Challenger)",
      channels: [
        { target: "prop1", label: "Frame", labelTh: "กรอบแว่น" },
        { target: "prop2", label: "Lenses", labelTh: "เลนส์แว่น" }
      ]
    },
    {
      id: "headphones",
      name: "Cyber Headset",
      nameTh: "หูฟังสายฟ้า",
      icon: "",
      achievementId: "fast-thinker",
      achievementName: "Fast Thinker",
      achievementNameTh: "Fast Thinker",
      requirementHint: "Unlocks by clearing a stage in under 3 minutes with 80%+ score (Fast Thinker)",
      requirementHintTh: "ปลดล็อกเมื่อผ่านด่านไวใน 3 นาที คะแนน 80%+ (Fast Thinker)",
      channels: [
        { target: "prop1", label: "Headband", labelTh: "โครงหูฟังหลัก" },
        { target: "prop2", label: "Ear Cushions", labelTh: "นวมครอบหู" },
        { target: "prop3", label: "Neon Accent", labelTh: "ไฟนีออนสายฟ้า" }
      ]
    },
    {
      id: "headband",
      name: "Comeback Band",
      nameTh: "ผ้าคาดหัวสู้ไม่ถอย",
      icon: "",
      achievementId: "comeback",
      achievementName: "Comeback Learner",
      achievementNameTh: "Comeback Learner",
      requirementHint: "Unlocks after retrying and passing a quiz (Comeback Learner)",
      requirementHintTh: "ปลดล็อกเมื่อแก้มือทำควิซผ่านสำเร็จ (Comeback Learner)",
      channels: [
        { target: "prop1", label: "Headband Strap", labelTh: "แถบผ้าคาดหัว" },
        { target: "prop2", label: "Forehead Emblem", labelTh: "ตราประจำหน้าผาก" },
        { target: "prop3", label: "Trailing Ribbon", labelTh: "ชายผ้าด้านหลัง" }
      ]
    },
    {
      id: "coffee",
      name: "Pixel Coffee",
      nameTh: "แก้วกาแฟคู่ใจ",
      icon: "",
      achievementId: "consistent-learner",
      achievementName: "Consistent Learner",
      achievementNameTh: "Consistent Learner",
      requirementHint: "Unlocks after learning for 3 days (Consistent Learner)",
      requirementHintTh: "ปลดล็อกเมื่อเข้าเรียนครบ 3 วัน (Consistent Learner)",
      channels: [
        { target: "prop1", label: "Ceramic Cup", labelTh: "ตัวแก้วเซรามิก" },
        { target: "prop2", label: "Cup Sleeve", labelTh: "ปลอกจับกันร้อน" },
        { target: "prop3", label: "Coffee Steam", labelTh: "ไอร้อนกาแฟ" }
      ]
    },
    {
      id: "grad-cap",
      name: "Scholar Cap",
      nameTh: "หมวกบัณฑิต",
      icon: "",
      achievementId: "knowledge-seeker",
      achievementName: "Knowledge Seeker",
      achievementNameTh: "นักแสวงหาความรู้",
      requirementHint: "Unlocks after completing 5 lessons in any class",
      requirementHintTh: "ปลดล็อกเมื่อเรียนจบครบ 5 บทเรียนในคลาสใดก็ได้",
      channels: [
        { target: "prop1", label: "Mortarboard", labelTh: "แผ่นหมวกบัณฑิต" },
        { target: "prop2", label: "Cap Base", labelTh: "ฐานหมวก" },
        { target: "prop3", label: "Tassel", labelTh: "พู่ห้อยปริญญา" }
      ]
    },
    {
      id: "crown",
      name: "Star Crown",
      nameTh: "มงกุฎดาวทองคำ",
      icon: "",
      achievementId: "perfect-score",
      achievementName: "Perfect Score",
      achievementNameTh: "Perfect Score",
      requirementHint: "Unlocks after achieving a 100% quiz score (Perfect Score)",
      requirementHintTh: "ปลดล็อกเมื่อทำควิซได้คะแนนเต็ม 100% (Perfect Score)",
      channels: [
        { target: "prop1", label: "Gold Crown", labelTh: "เรือนมงกุฎทอง" },
        { target: "prop2", label: "Center Gem", labelTh: "อัญมณีกลางมงกุฎ" },
        { target: "prop3", label: "Side Gems", labelTh: "อัญมณีประดับข้าง" }
      ]
    },
    {
      id: "wizard-hat",
      name: "Scholar Wizard Hat",
      nameTh: "หมวกจอมเวทปราชญ์",
      icon: "",
      achievementId: "course-finisher",
      achievementName: "Course Finisher",
      achievementNameTh: "Course Finisher",
      requirementHint: "Unlocks after finishing your first complete course (Course Finisher)",
      requirementHintTh: "ปลดล็อกเมื่อเรียนจบครบทั้งคอร์สเป็นคอร์สแรก (Course Finisher)",
      channels: [
        { target: "prop1", label: "Wizard Hat", labelTh: "ตัวหมวกจอมเวท" },
        { target: "prop2", label: "Hat Band", labelTh: "แถบคาดหมวก" },
        { target: "prop3", label: "Star Sparkle", labelTh: "ประกายดาวเวทมนตร์" }
      ]
    },
    {
      id: "star-clip",
      name: "Starlight Hairpin",
      nameTh: "กิ๊บดาวประกายแสง",
      icon: "",
      achievementId: null,
      achievementName: "Daily Quest: Quiz Sprint",
      achievementNameTh: "เควสประจำวัน: ลุยควิซ 2 ด่าน",
      questId: "daily-quiz-sprint",
      requirementHint: "Quest Reward: Claim 'Clear 2 Quiz Stages Today' in Daily Quests.",
      requirementHintTh: "เฉพาะเควสต์: รับรางวัลจากเควสต์ 'ผ่านด่านควิซ 2 ด่านวันนี้' ในหน้า Daily Quests",
      channels: [
        { target: "prop1", label: "Star Body", labelTh: "ตัวดาวหลัก" },
        { target: "prop2", label: "Star Core", labelTh: "แกนประกายดาว" },
        { target: "prop3", label: "Ribbon Tails", labelTh: "ชายริบบิ้น" }
      ]
    },
    {
      id: "halo",
      name: "Golden Halo",
      nameTh: "วงแหวนแสงทอง",
      icon: "",
      achievementId: null,
      achievementName: "Quest: Complete 3 New Lessons",
      achievementNameTh: "เควส: เรียนจบ 3 บทเรียนใหม่",
      questId: "quest-new-lessons-3",
      requirementHint: "Quest Reward: Claim 'Complete 3 New Lessons' in All Quests.",
      requirementHintTh: "เฉพาะเควสต์: รับรางวัลจากเควสต์ 'เรียนจบ 3 บทเรียนใหม่' ในหน้า All Quests",
      channels: [
        { target: "prop1", label: "Halo Ring", labelTh: "วงแหวนหลัก" },
        { target: "prop2", label: "Inner Glow", labelTh: "แสงประกายด้านใน" },
        { target: "prop3", label: "Sparkle Dust", labelTh: "ละอองดาวรอบข้าง" }
      ]
    },
    {
      id: "flower-crown",
      name: "Leaf & Blossom Crown",
      nameTh: "มงกุฎใบไม้ผลิบาน",
      icon: "",
      achievementId: null,
      achievementName: "Quest: Multi-Course Explorer",
      achievementNameTh: "เควส: นักสำรวจข้ามคอร์ส",
      questId: "quest-multi-course",
      requirementHint: "Quest Reward: Claim 'Enroll in 2 Courses' in All Quests.",
      requirementHintTh: "เฉพาะเควสต์: รับรางวัลจากเควสต์ 'ลงทะเบียนเรียน 2 คอร์ส' ในหน้า All Quests",
      channels: [
        { target: "prop1", label: "Leaf Vine", labelTh: "เถาใบไม้" },
        { target: "prop2", label: "Flower Petals", labelTh: "กลีบดอกไม้" },
        { target: "prop3", label: "Blossom Center", labelTh: "เกสรดอกไม้" }
      ]
    },
    {
      id: "beret",
      name: "Scholar Beret",
      nameTh: "หมวกเบเร่ต์นักคิด",
      icon: "",
      achievementId: null,
      achievementName: "Course Quest Reward Pool",
      achievementNameTh: "รางวัลจากคลังเควสต์ประจำคลาส",
      questId: "course-eu-ch2",
      requirementHint: "Course Quest Reward: Claim from any Class Quest with this item.",
      requirementHintTh: "รางวัลเควสต์คอร์ส: รับได้จากเควสต์ของคลาสเรียนที่มีไอเทมนี้ในคลังรางวัล",
      channels: [
        { target: "prop1", label: "Beret Crown", labelTh: "ตัวหมวกเบเร่ต์" },
        { target: "prop2", label: "Brim Band", labelTh: "ขอบหมวก" },
        { target: "prop3", label: "Top Stem", labelTh: "จุกด้านบนหมวก" }
      ]
    },
    {
      id: "visor",
      name: "Cyber Visor",
      nameTh: "แว่นไวเซอร์ไซเบอร์",
      icon: "",
      achievementId: null,
      achievementName: "Course Quest Reward Pool",
      achievementNameTh: "รางวัลจากคลังเควสต์ประจำคลาส",
      questId: "course-eu-master",
      requirementHint: "Course Quest Reward: Claim from any Class Quest with this item.",
      requirementHintTh: "รางวัลเควสต์คอร์ส: รับได้จากเควสต์ของคลาสเรียนที่มีไอเทมนี้ในคลังรางวัล",
      channels: [
        { target: "prop1", label: "Visor Frame", labelTh: "โครงแว่นไวเซอร์" },
        { target: "prop2", label: "Energy Lens", labelTh: "เลนส์พลังงาน" },
        { target: "prop3", label: "Neon Glint", labelTh: "เส้นแสงสะท้อน" }
      ]
    }
  ]);

  export const AVATAR_BACKGROUNDS: readonly AvatarBgDefinition[] = Object.freeze([
    {
      id: "sage-cream",
      name: "Meadow Sage",
      nameTh: "เขียวทุ่งหญ้าอ่อน",
      source: "starter",
      ringColor: "#75aa7b",
      unlockHint: "Starter background, ready to use.",
      unlockHintTh: "พื้นหลังเริ่มต้น ใช้งานได้ทันที"
    },
    {
      id: "warm-peach",
      name: "Warm Peach",
      nameTh: "พีชอบอุ่น",
      source: "starter",
      ringColor: "#e39c64",
      unlockHint: "Starter background, ready to use.",
      unlockHintTh: "พื้นหลังเริ่มต้น ใช้งานได้ทันที"
    },
    {
      id: "sky-cloud",
      name: "Clear Sky",
      nameTh: "ฟ้าสดใส",
      source: "starter",
      ringColor: "#6da9dc",
      unlockHint: "Starter background, ready to use.",
      unlockHintTh: "พื้นหลังเริ่มต้น ใช้งานได้ทันที"
    },
    {
      id: "mint-checker",
      name: "Pixel Checkers",
      nameTh: "ลายตารางพิกเซล",
      source: "achievement",
      achievementId: "beginner",
      ringColor: "#4f9a5b",
      unlockHint: "Unlock via Achievement: Beginner",
      unlockHintTh: "ปลดล็อกเมื่อผ่าน Achievement: Beginner"
    },
    {
      id: "sunburst-gold",
      name: "Golden Sunburst",
      nameTh: "รัศมีแสงทอง",
      source: "achievement",
      achievementId: "quiz-challenger",
      ringColor: "#d99b26",
      unlockHint: "Unlock via Achievement: Quiz Challenger",
      unlockHintTh: "ปลดล็อกเมื่อผ่าน Achievement: Quiz Challenger"
    },
    {
      id: "sakura-petals",
      name: "Sakura Breeze",
      nameTh: "กลีบซากุระ",
      source: "achievement",
      achievementId: "consistent-learner",
      ringColor: "#e284a7",
      unlockHint: "Unlock via Achievement: Consistent Learner",
      unlockHintTh: "ปลดล็อกเมื่อผ่าน Achievement: Consistent Learner"
    },
    {
      id: "neon-grid",
      name: "Cyber Matrix",
      nameTh: "กริดไซเบอร์นีออน",
      source: "achievement",
      achievementId: "fast-thinker",
      ringColor: "#2dd4bf",
      unlockHint: "Unlock via Achievement: Fast Thinker",
      unlockHintTh: "ปลดล็อกเมื่อผ่าน Achievement: Fast Thinker"
    },
    {
      id: "royal-cosmos",
      name: "Royal Starlight",
      nameTh: "ห้วงอวกาศดวงดาว",
      source: "achievement",
      achievementId: "perfect-score",
      ringColor: "#eab308",
      unlockHint: "Unlock via Achievement: Perfect Score",
      unlockHintTh: "ปลดล็อกเมื่อผ่าน Achievement: Perfect Score"
    },
    {
      id: "pixel-polka",
      name: "Mint Polka",
      nameTh: "ลายจุดมินต์พิกเซล",
      source: "quest",
      questId: "daily-lesson-explorer",
      ringColor: "#3f8d4b",
      unlockHint: "Quest Reward: Claim 'Complete 1 Lesson Today'.",
      unlockHintTh: "รางวัลเควสต์: รับจากเควสต์ 'เรียนจบ 1 บทเรียนวันนี้'"
    },
    {
      id: "sunset-wave",
      name: "Sunset Waves",
      nameTh: "คลื่นยามเย็น",
      source: "quest",
      questId: "daily-study-combo",
      ringColor: "#e5735c",
      unlockHint: "Quest Reward: Claim 'Daily Study Trio'.",
      unlockHintTh: "รางวัลเควสต์: รับจากเควสต์ 'คอมโบการเรียนประจำวัน'"
    },
    {
      id: "aurora-glow",
      name: "Emerald Aurora",
      nameTh: "แสงเหนือมรกต",
      source: "quest",
      questId: "quest-quiz-5",
      ringColor: "#2aa876",
      unlockHint: "Quest Reward: Claim 'Quiz Tactician (5 Stages)'.",
      unlockHintTh: "รางวัลเควสต์: รับจากเควสต์ 'นักวางแผนควิซ (5 ด่าน)'"
    },
    {
      id: "law-pillars",
      name: "Marble Study",
      nameTh: "ลายหินอ่อนคลาสสิก",
      source: "quest",
      questId: "course-eu-ch2",
      ringColor: "#c49a3a",
      unlockHint: "Course Quest Reward: Claim from any Class Quest with this background.",
      unlockHintTh: "รางวัลเควสต์คอร์ส: รับได้จากเควสต์ของคลาสเรียนที่มีพื้นหลังนี้ในคลังรางวัล"
    },
    {
      id: "prism-holo",
      name: "Prism Holo",
      nameTh: "โฮโลแกรมปริซึม",
      source: "quest",
      questId: "quest-new-lessons-3",
      ringColor: "#9c7be6",
      unlockHint: "Quest Reward: Claim 'Complete 3 New Lessons'.",
      unlockHintTh: "รางวัลเควสต์: รับจากเควสต์ 'เรียนจบ 3 บทเรียนใหม่'"
    }
  ]);

  export const localizeBgName = (bg: AvatarBgDefinition): string =>
    LearningHausI18n.t(bg.name, bg.nameTh);

  export const localizeBgHint = (bg: AvatarBgDefinition): string =>
    LearningHausI18n.t(bg.unlockHint, bg.unlockHintTh);

  export const localizePatternSlot = (pattern: PatternDefinition, slot: PatternSlotTarget): string =>
    LearningHausI18n.t(
      pattern.slotLabels[slot] || `Pattern ${slot.slice(-1)}`,
      pattern.slotLabelsTh[slot] || `สีลวดลาย ${slot.slice(-1)}`
    );

  export const localizePropName = (prop: PropDefinition): string =>
    LearningHausI18n.t(prop.name, prop.nameTh);

  export const localizePropAchievement = (prop: PropDefinition): string =>
    LearningHausI18n.t(prop.achievementName, prop.achievementNameTh);

  export const localizePropHint = (prop: PropDefinition): string =>
    LearningHausI18n.t(prop.requirementHint, prop.requirementHintTh);

  export const getRewardForAchievement = (
    achievementId: string
  ): { id: string; name: string; icon: string } | null => {
    const found = PROPS.find((item) => item.achievementId === achievementId);
    return found ? { id: found.id, name: localizePropName(found), icon: found.icon } : null;
  };

  export const defaultColors = (): Record<ColorTarget, LayerColor> => ({
    fur: { h: 23, s: 73, v: 99, a: 100 }, // #FC8C44
    pattern1: { h: 7, s: 76, v: 95, a: 100 }, // #F24E3B
    pattern2: { h: 63, s: 8, v: 98, a: 100 }, // #FAFBE6
    pattern3: { h: 355, s: 21, v: 90, a: 100 }, // #E5B5B9
    eyeLeft: { h: 315, s: 48, v: 26, a: 100 },
    eyeRight: { h: 315, s: 48, v: 26, a: 100 },
    eyeGlint: { h: 65, s: 6, v: 99, a: 100 },
    outfit1: { h: 350, s: 78, v: 88, a: 100 },
    outfit2: { h: 42, s: 25, v: 97, a: 100 },
    outfit3: { h: 355, s: 82, v: 90, a: 100 },
    prop1: { h: 335, s: 80, v: 92, a: 100 },
    prop2: { h: 46, s: 90, v: 98, a: 100 },
    prop3: { h: 192, s: 82, v: 96, a: 100 }
  });

  export const defaultConfig = (): CatConfig => ({
    pattern: "tabby",
    eyeStyle: "round",
    outfit: "none",
    prop: "none",
    avatarBg: "sage-cream",
    showGrid: false,
    colors: defaultColors()
  });

  const cloneColor = (c: LayerColor | undefined, fallback: LayerColor): LayerColor => ({
    h: Number.isFinite(c?.h) ? Number(c!.h) : fallback.h,
    s: Number.isFinite(c?.s) ? Number(c!.s) : fallback.s,
    v: Number.isFinite(c?.v) ? Number(c!.v) : fallback.v,
    a: Number.isFinite(c?.a) ? Number(c!.a) : fallback.a
  });

  export const normalizeConfig = (raw: unknown): CatConfig => {
    const base = defaultConfig();
    if (!raw || typeof raw !== "object") return base;
    const obj = raw as Record<string, unknown>;
    const rawColors = (obj.colors && typeof obj.colors === "object" ? obj.colors : {}) as Record<
      string,
      LayerColor | undefined
    >;

    const legacyEyes = rawColors.eyes;
    const legacyOutfit = rawColors.outfit;
    const legacyProp = rawColors.prop;

    const pattern: FurPatternId =
      typeof obj.pattern === "string" && obj.pattern in PATTERN_CATALOG
        ? (obj.pattern as FurPatternId)
        : base.pattern;
    const eyeStyle: EyeStyleId =
      typeof obj.eyeStyle === "string" &&
      ["round", "sparkle", "cool", "heterochromia", "happy"].includes(obj.eyeStyle)
        ? (obj.eyeStyle as EyeStyleId)
        : base.eyeStyle;
    const outfit: OutfitId =
      typeof obj.outfit === "string" && obj.outfit in OUTFIT_CATALOG
        ? (obj.outfit as OutfitId)
        : base.outfit;
    const prop: PropId =
      typeof obj.prop === "string" && PROPS.some((p) => p.id === obj.prop)
        ? (obj.prop as PropId)
        : base.prop;
    const avatarBg: AvatarBgId =
      typeof obj.avatarBg === "string" && AVATAR_BACKGROUNDS.some((b) => b.id === obj.avatarBg)
        ? (obj.avatarBg as AvatarBgId)
        : (base.avatarBg || "sage-cream");

    const eyeLeft = cloneColor(rawColors.eyeLeft || legacyEyes, base.colors.eyeLeft);
    const defaultRightEye =
      eyeStyle === "heterochromia" && !rawColors.eyeRight
        ? { ...eyeLeft, h: (eyeLeft.h + 150) % 360 }
        : eyeLeft;

    return {
      pattern,
      eyeStyle,
      outfit,
      prop,
      avatarBg,
      showGrid: Boolean(obj.showGrid),
      colors: {
        fur: cloneColor(rawColors.fur, base.colors.fur),
        pattern1: cloneColor(rawColors.pattern1, base.colors.pattern1),
        pattern2: cloneColor(rawColors.pattern2, base.colors.pattern2),
        pattern3: cloneColor(rawColors.pattern3, base.colors.pattern3),
        eyeLeft,
        eyeRight: cloneColor(rawColors.eyeRight, defaultRightEye),
        eyeGlint: cloneColor(rawColors.eyeGlint, base.colors.eyeGlint),
        outfit1: cloneColor(rawColors.outfit1 || legacyOutfit, base.colors.outfit1),
        outfit2: cloneColor(rawColors.outfit2, base.colors.outfit2),
        outfit3: cloneColor(rawColors.outfit3, base.colors.outfit3),
        prop1: cloneColor(rawColors.prop1 || legacyProp, base.colors.prop1),
        prop2: cloneColor(rawColors.prop2, base.colors.prop2),
        prop3: cloneColor(rawColors.prop3, base.colors.prop3)
      }
    };
  };

  export const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
    const hue = ((h % 360) + 360) % 360;
    const sat = Math.max(0, Math.min(100, s)) / 100;
    const val = Math.max(0, Math.min(100, v)) / 100;
    const c = val * sat;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = val - c;
    let r = 0;
    let g = 0;
    let b = 0;
    if (hue < 60) [r, g, b] = [c, x, 0];
    else if (hue < 120) [r, g, b] = [x, c, 0];
    else if (hue < 180) [r, g, b] = [0, c, x];
    else if (hue < 240) [r, g, b] = [0, x, c];
    else if (hue < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  };

  export const rgbToHsv = (r: number, g: number, b: number): [number, number, number] => {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      if (max === rn) h = 60 * (((gn - bn) / d) % 6);
      else if (max === gn) h = 60 * ((bn - rn) / d + 2);
      else h = 60 * ((rn - gn) / d + 4);
    }
    if (h < 0) h += 360;
    const s = max === 0 ? 0 : (d / max) * 100;
    const v = max * 100;
    return [Number(h.toFixed(2)), Number(s.toFixed(2)), Number(v.toFixed(2))];
  };

  export const toHex = (r: number, g: number, b: number): string =>
    `#${[r, g, b].map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0")).join("")}`.toUpperCase();

  // แปลง LayerColor เป็นค่าสี RGBA ตรงตามที่เลือก 100% โดยไม่บิด Hue หรือเพิ่ม Saturation
  export const directRgbaCss = (color: LayerColor, alphaMultiplier = 1): string => {
    const [r, g, b] = hsvToRgb(color.h, color.s, color.v);
    const alpha = Math.max(0, Math.min(1, (color.a / 100) * alphaMultiplier));
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
  };

  // คำนวณสีเงาจาก RGB โดยลดความสว่างลงเล็กน้อยเข้าหาโทนเทากลาง-อุ่น เพื่อป้องกันสีขาวติดม่วง
  export const neutralShadowRgbaCss = (color: LayerColor, alphaMultiplier = 1, darkenFactor = 0.87): string => {
    const [r, g, b] = hsvToRgb(color.h, color.s, color.v);
    const avg = (r + g + b) / 3;
    const nr = Math.round((r * 0.65 + avg * 0.35) * darkenFactor);
    const ng = Math.round((g * 0.65 + avg * 0.35) * darkenFactor);
    const nb = Math.round((b * 0.65 + avg * 0.35) * darkenFactor);
    const alpha = Math.max(0, Math.min(1, (color.a / 100) * alphaMultiplier));
    return `rgba(${nr}, ${ng}, ${nb}, ${alpha.toFixed(3)})`;
  };

  // แผนผังพิกเซล 46x46 ของแมวนั่งหันหน้าตรงมาตรฐาน (สมมาตรซ้าย-ขวา 100% พื้นหลังโปร่งใส)
  const FRONT_CAT_46: readonly string[] = [
    "...........oooo................oooo...........",
    "..........obbbbo..............obbbbo..........",
    "..........obbbbbo............obbbbbo..........",
    ".........opbwwwbbo..........obbwwwbpo.........",
    ".........opkwwwbbboooooooooobbbwwwkpo.........",
    ".........opkwwwppbbbppbbppbbbppwwwkpo.........",
    ".........opbwwkpbbbbpbbbbpbbbbpkwwbpo.........",
    ".........opbwkpbbbbbpbbbbpbbbbbpkwbpo.........",
    ".........opbkpbbbbbbbbppbbbbbbbbpkbpo.........",
    ".........oppbbbbbbbbbbppbbbbbbbbbbppo.........",
    "........opppbbbbbbbbbbbbbbbbbbbbbbpppo........",
    "........oppbbbbbbbbbbbbbbbbbbbbbbbbppo........",
    "........opppbbbbbbbbbbbbbbbbbbbbbbpppo........",
    "........oppbbbbbbbbwwnnnnwwbbbbbbbbppo........",
    "........opppbbbbbwwwwwoowwwwwbbbbbpppo........",
    "........oppbbbbwwwwwookkoowwwwwbbbbppo........",
    "........oppbbbwwwwwwwwwwwwwwwwwwbbbppo........",
    ".oooo...oppbbbwwwwwwwwwwwwwwwwwwbbbppo........",
    "owwwwo..oppbbbwwwwwwwwwwwwwwwwwwbbbppo........",
    "owwwwko..oppbbbwwwwwwwwwwwwwwwwbbbppo.........",
    "owwwwwo...ospbbbkwwwwwwwwwwwwkbbbpso..........",
    "okwwwwwo...osppbbkkkwwwwwwkkkbbppso...........",
    ".okkwwwo....ooopppbbkkkkkkbbpppooo............",
    "..opkbbo......oooppkkkkkkkkppooo..............",
    "..oppbbo...ooppppbbwwwwwwwwbbppppoo...........",
    "..oppppo..opppbbbbwwwwwwwwwwbbbbpppo..........",
    "..oppppo..oppbbbbbwwwwwwwwwwbbbbbppo..........",
    "..oppbbo..opppbbbbwwwwwwwwwwbbbbpppo..........",
    "..opbbbo..oppbbbbkwwwwwwwwwwkbbbbppo..........",
    ".opppbo..opppbbbbbbwwwwwwwwbbbbbbpppo.........",
    ".oppbo...oppbbbbbbbwwwwwwwwbbbbbbbppo.........",
    ".oppbo...opppbbbbbkwwwwwwwwkbbbbbpppo.........",
    ".opbbo..opppbbbobbbwwwwwwwwbbbobbbpppo........",
    ".opbpo..opppbbbobbbbkwwwwkbbbbobbbpppo........",
    ".opbpo..opppbbbobbbbbkkkkbbbbbobbbpppo........",
    ".oopbbo.opppbbboppbbbboobbbbppobbbpppo........",
    "..opbbbooppbbbbobbbbbboobbbbbbobbbbppo........",
    "..opppppopppbbbobppbbboobbbppbobbbpppo........",
    "...oppppopppbbbobbbbbboobbbbbbobbbpppo........",
    "....ooooopppbbbobbbbbboobbbbbbobbbpppo........",
    "........oppppbbokwwwwkookwwwwkobbppppo........",
    ".........opkwwwowwwwwwoowwwwwwowwwkpo.........",
    ".........okwwwwowwwwwwoowwwwwwowwwwko.........",
    ".........okkwwwokwwwwkookwwwwkowwwkko.........",
    ".........oooooooooooooooooooooooooooo.........",
    ".............................................."
  ];

  const resolvePixelRole = (pattern: FurPatternId, r: number, c: number, ch: string): PixelRole => {
    if (ch === ".") return "transparent";
    if (ch === "o") return "outline";
    if (ch === "n") return "nose";

    const inLeftEye = r >= 10 && r <= 14 && c >= 13 && c <= 17;
    const inRightEye = r >= 10 && r <= 14 && c >= 28 && c <= 32;
    if (inLeftEye || inRightEye) return "eyeSlot";

    const inInnerEar =
      r >= 3 && r <= 8 && ((c >= 11 && c <= 15) || (c >= 30 && c <= 34)) && (ch === "w" || ch === "k");
    if (inInnerEar) {
      return ch === "w" ? "innerEarLight" : "innerEarShadow";
    }

    const patternDef = PATTERN_CATALOG[pattern] || PATTERN_CATALOG.tabby;
    return patternDef.resolveCoatRole(r, c, ch);
  };

  export const renderCatToCanvas = (
    canvas: HTMLCanvasElement,
    rawConfig: CatConfig,
    animPose: IdleAnimPose = NEUTRAL_POSE
  ): void => {
    const config = normalizeConfig(rawConfig);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = canvas.width;
    const scale = size / GRID_SIZE;
    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = false;

    const jumpPhase: CatJumpPhase = animPose.jumpPhase || "idle";
    const isJumpingAir = jumpPhase === "launch" || jumpPhase === "air";
    const isSquashPose = jumpPhase === "crouch" || jumpPhase === "land";

    const resolveAnimatedGridPos = (x: number, y: number, isFloorProp = false): [number, number] => {
      if (isJumpingAir) {
        const airLift = jumpPhase === "air" ? -4 : -3;
        if (x <= 10 && y >= 21) {
          return [x + animPose.tailDx - 1, y + airLift - 2];
        }
        return [x + animPose.swayDx, y + airLift];
      }
      if (isFloorProp || y >= 40) {
        return [x, y];
      }
      if (isSquashPose) {
        const squashDy = jumpPhase === "land" ? 3 : 2;
        if (x <= 10 && y >= 21) {
          return [x + animPose.tailDx, y + 2];
        }
        return [x + animPose.swayDx, y + squashDy];
      }
      if (x <= 10 && y >= 21) {
        return [x + animPose.tailDx, y + animPose.breathDy];
      }
      return [x + animPose.swayDx, y + animPose.breathDy];
    };

    const putPixel = (x: number, y: number, fillStyle: string, isFloorProp = false): void => {
      const [gx, gy] = resolveAnimatedGridPos(x, y, isFloorProp);
      if (gx < 0 || gx >= GRID_SIZE || gy < 0 || gy >= GRID_SIZE) return;
      ctx.fillStyle = fillStyle;
      const x0 = Math.round(gx * scale);
      const y0 = Math.round(gy * scale);
      const x1 = Math.round((gx + 1) * scale);
      const y1 = Math.round((gy + 1) * scale);
      ctx.fillRect(x0, y0, Math.max(1, x1 - x0), Math.max(1, y1 - y0));
    };

    const putRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      fillStyle: string,
      isFloorProp = false
    ): void => {
      for (let dy = 0; dy < h; dy += 1) {
        for (let dx = 0; dx < w; dx += 1) {
          putPixel(x + dx, y + dy, fillStyle, isFloorProp);
        }
      }
    };

    // สร้างพาเลตต์สีโดยตรงจากค่าสีที่เลือก (Direct Pixel Palette Mapping)
    const furAlpha = config.colors.fur.a / 100;
    const palette: Record<Exclude<PixelRole, "transparent" | "eyeSlot">, string> = {
      outline: `rgba(63, 29, 56, ${furAlpha.toFixed(3)})`,
      nose: `rgba(242, 92, 68, ${furAlpha.toFixed(3)})`,
      innerEarLight: `rgba(250, 251, 232, ${furAlpha.toFixed(3)})`,
      innerEarShadow: `rgba(229, 182, 186, ${furAlpha.toFixed(3)})`,
      baseFur: directRgbaCss(config.colors.fur),
      baseFurShadow: neutralShadowRgbaCss(config.colors.fur, 1, 0.87),
      pattern1: directRgbaCss(config.colors.pattern1, furAlpha),
      pattern2: directRgbaCss(config.colors.pattern2, furAlpha),
      pattern3: directRgbaCss(config.colors.pattern3, furAlpha)
    };

    const rowOffset = 5;
    const colOffset = 3;

    const drawCatRows = (rStart: number, rEnd: number, colMin = 0, colMax = 45): void => {
      for (let r = rStart; r <= rEnd; r += 1) {
        const row = FRONT_CAT_46[r];
        const y = r + rowOffset;
        const cStart = Math.max(0, colMin);
        const cEnd = Math.min(row.length - 1, colMax);
        for (let c = cStart; c <= cEnd; c += 1) {
          const ch = row[c];
          const role = resolvePixelRole(config.pattern, r, c, ch);
          if (role === "transparent") continue;
          const x = c + colOffset;

          if (role === "eyeSlot") {
            putPixel(x, y, palette.baseFur);
            continue;
          }

          if (
            (role === "pattern1" && config.colors.pattern1.a < 100) ||
            (role === "pattern2" && config.colors.pattern2.a < 100) ||
            (role === "pattern3" && config.colors.pattern3.a < 100)
          ) {
            putPixel(x, y, palette.baseFur);
          }

          putPixel(x, y, palette[role]);
        }
      }
    };

    const pawFill =
      config.pattern === "tuxedo" || config.pattern === "siamese"
        ? palette.pattern1
        : config.pattern === "calico"
          ? palette.pattern2
          : palette.baseFur;
    const pawPadFill = config.pattern === "tuxedo" ? palette.innerEarShadow : palette.innerEarLight;

    const drawPixelStamp = (
      ox: number,
      oy: number,
      bitmap: readonly string[],
      colorMap: Record<string, string>
    ): void => {
      for (let dy = 0; dy < bitmap.length; dy += 1) {
        const row = bitmap[dy];
        for (let dx = 0; dx < row.length; dx += 1) {
          const ch = row[dx];
          const fill = colorMap[ch];
          if (fill) putPixel(ox + dx, oy + dy, fill);
        }
      }
    };

    if (isJumpingAir) {
      // วาดหางที่ชูขึ้นด้านหลังก่อน ตามด้วยลำตัวช่วงบนและหัวที่ลอยพุ่งขึ้น
      drawCatRows(17, 38, 0, 8);
      drawCatRows(29, 34, 9, 45);
      drawCatRows(0, 28, 9, 45);

      // ปิดเส้นโค้งใต้ท้องแบบลอยกลางอากาศ (ไม่นั่งติดพื้น)
      putRect(15, 39, 22, 1, palette.baseFur);
      putRect(17, 40, 18, 1, palette.baseFurShadow);
      putRect(19, 41, 14, 1, palette.outline);

      // ขาหลังสองข้างดีดยืด/งอแยกกันกลางอากาศ (ชัดเจนว่าเป็นท่ากระโดด)
      const hindColorMap: Record<string, string> = {
        o: palette.outline,
        f: palette.baseFur,
        s: palette.baseFurShadow,
        p: pawFill,
        t: pawPadFill
      };
      if (jumpPhase === "air") {
        const leftHindAir = [
          "..oooo..",
          ".offffo.",
          "offssfo.",
          "ofpppo..",
          "opptpo..",
          ".ooooo.."
        ];
        const rightHindAir = [
          "..oooo..",
          ".offffo.",
          ".ofssffo",
          "..opppfo",
          "..optppo",
          "..ooooo."
        ];
        drawPixelStamp(11, 39, leftHindAir, hindColorMap);
        drawPixelStamp(33, 39, rightHindAir, hindColorMap);
      } else {
        const leftHindLaunch = [
          "..oooo.",
          ".offffo",
          ".ofssfo",
          "offpffo",
          "ofpppo.",
          "opptpo.",
          ".oooo.."
        ];
        const rightHindLaunch = [
          ".oooo..",
          "offffo.",
          "ofssfo.",
          "offpffo",
          ".opppfo",
          ".optppo",
          "..oooo."
        ];
        drawPixelStamp(13, 39, leftHindLaunch, hindColorMap);
        drawPixelStamp(32, 39, rightHindLaunch, hindColorMap);
      }
    } else {
      // วาดช่วงล่างที่ยึดติดพื้นก่อน แล้วตามด้วยช่วงบนที่ขยับเอียงตัวเบาๆ
      drawCatRows(29, FRONT_CAT_46.length - 1);
      drawCatRows(0, 28);
    }

    // วาดดวงตาทั้งสองข้างด้วยสีตาซ้าย สีตาขวา และสีประกายตาที่ปรับแยกกันได้อิสระ
    const leftEyeFill = directRgbaCss(config.colors.eyeLeft, furAlpha);
    const leftEyeDeep = neutralShadowRgbaCss(config.colors.eyeLeft, furAlpha, 0.72);
    const rightEyeFill = directRgbaCss(config.colors.eyeRight, furAlpha);
    const rightEyeDeep = neutralShadowRgbaCss(config.colors.eyeRight, furAlpha, 0.72);
    const eyeGlint = directRgbaCss(config.colors.eyeGlint, furAlpha);
    const eyeSoftGlint = neutralShadowRgbaCss(config.colors.eyeGlint, furAlpha, 0.86);

    const drawCatEye = (ox: number, oy: number, mainColor: string, deepColor: string): void => {
      if (config.eyeStyle === "happy") {
        putPixel(ox, oy + 2, palette.outline);
        putPixel(ox + 1, oy + 1, palette.outline);
        putPixel(ox + 2, oy + 1, palette.outline);
        putPixel(ox + 3, oy + 1, palette.outline);
        putPixel(ox + 4, oy + 2, palette.outline);
        return;
      }

      const eyeMask = [".ooo.", "oiiio", "oiiio", "oiiio", ".ooo."];
      for (let dy = 0; dy < 5; dy += 1) {
        for (let dx = 0; dx < 5; dx += 1) {
          const m = eyeMask[dy][dx];
          if (m === ".") continue;
          if (config.eyeStyle === "cool" && dy === 0) continue;
          if (config.eyeStyle === "cool" && dy === 1) {
            putPixel(ox + dx, oy + dy, palette.outline);
            continue;
          }
          putPixel(ox + dx, oy + dy, m === "o" ? deepColor : mainColor);
        }
      }
      if (config.eyeStyle !== "cool") {
        putPixel(ox + 1, oy + 1, eyeGlint);
        putPixel(ox + 2, oy + 1, eyeSoftGlint);
      } else {
        putPixel(ox + 1, oy + 2, eyeGlint);
      }
      if (config.eyeStyle === "sparkle") {
        putPixel(ox + 3, oy + 3, eyeGlint);
      }
    };

    drawCatEye(16, 15, leftEyeFill, leftEyeDeep);
    drawCatEye(31, 15, rightEyeFill, rightEyeDeep);

    // วาดเสื้อผ้าด้านหน้าตรงตามช่องสีแยกอิสระ (outfit1, outfit2, outfit3)
    if (config.outfit !== "none" && config.colors.outfit1.a > 0) {
      const outOutline = palette.outline;
      const outMain = directRgbaCss(config.colors.outfit1, furAlpha);
      const outMainShadow = neutralShadowRgbaCss(config.colors.outfit1, furAlpha, 0.8);
      const outAccent = directRgbaCss(config.colors.outfit2, furAlpha);
      const outDetail = directRgbaCss(config.colors.outfit3, furAlpha);

      if (config.outfit === "scarf") {
        putRect(15, 28, 22, 1, outOutline);
        putRect(14, 29, 24, 3, outMain);
        putRect(15, 30, 22, 1, outAccent);
        putRect(14, 32, 24, 1, outOutline);
        putRect(28, 32, 5, 6, outOutline);
        putRect(29, 32, 3, 4, outMain);
        putRect(29, 36, 3, 1, outAccent);
      } else if (config.outfit === "hoodie" || config.outfit === "sweater" || config.outfit === "suit") {
        const drawOutfitRowRange = (rStart: number, rEnd: number): void => {
          for (let r = rStart; r <= rEnd; r += 1) {
            const row = FRONT_CAT_46[r];
            const y = r + rowOffset;
            for (let c = 9; c <= 36; c += 1) {
              const ch = row[c];
              if (ch === ".") continue;
              const x = c + colOffset;
              if (ch === "o") {
                putPixel(x, y, outOutline);
              } else if (r === 24 || r === (isJumpingAir ? 34 : 39)) {
                putPixel(x, y, outOutline);
              } else if (config.outfit === "suit" && c >= 19 && c <= 26 && r <= 35) {
                putPixel(x, y, c >= 22 && c <= 23 && r >= 26 ? outDetail : outAccent);
              } else if (config.outfit === "sweater" && (r === 25 || r === (isJumpingAir ? 33 : 38))) {
                putPixel(x, y, outDetail);
              } else if (config.outfit === "sweater" && (r % 4 === 0 || (c + r) % 6 === 0)) {
                putPixel(x, y, outAccent);
              } else if (config.outfit === "hoodie" && r >= 32 && r <= (isJumpingAir ? 34 : 37) && c >= 17 && c <= 28) {
                putPixel(x, y, outAccent);
              } else {
                putPixel(x, y, c <= 14 || c >= 31 ? outMainShadow : outMain);
              }
            }
          }
        };
        drawOutfitRowRange(29, isJumpingAir ? 34 : 39);
        drawOutfitRowRange(24, 28);
        if (config.outfit === "hoodie") {
          putRect(22, 29, 1, 5, outDetail);
          putRect(29, 29, 1, 5, outDetail);
        }
      } else if (config.outfit === "cloak") {
        const cloakMaxRow = isJumpingAir ? 35 : 40;
        for (let r = 29; r <= cloakMaxRow; r += 1) {
          const y = r + rowOffset;
          const spread = Math.floor((r - 24) * 0.35);
          const leftStart = Math.max(8, 12 - spread);
          const rightEnd = Math.min(37, 33 + spread);
          for (let c = leftStart; c <= 15; c += 1) {
            const x = c + colOffset;
            if (c === leftStart || r === cloakMaxRow) putPixel(x, y, outOutline);
            else if (c === leftStart + 1) putPixel(x, y, outAccent);
            else putPixel(x, y, outMain);
          }
          for (let c = 30; c <= rightEnd; c += 1) {
            const x = c + colOffset;
            if (c === rightEnd || r === cloakMaxRow) putPixel(x, y, outOutline);
            else if (c === rightEnd - 1) putPixel(x, y, outAccent);
            else putPixel(x, y, outMain);
          }
        }
        for (let r = 24; r <= 28; r += 1) {
          const y = r + rowOffset;
          const spread = Math.floor((r - 24) * 0.35);
          const leftStart = Math.max(8, 12 - spread);
          const rightEnd = Math.min(37, 33 + spread);
          for (let c = leftStart; c <= 15; c += 1) {
            const x = c + colOffset;
            if (c === leftStart) putPixel(x, y, outOutline);
            else if (c === leftStart + 1) putPixel(x, y, outAccent);
            else putPixel(x, y, outMain);
          }
          for (let c = 30; c <= rightEnd; c += 1) {
            const x = c + colOffset;
            if (c === rightEnd) putPixel(x, y, outOutline);
            else if (c === rightEnd - 1) putPixel(x, y, outAccent);
            else putPixel(x, y, outMain);
          }
        }
        putRect(15, 28, 22, 2, outOutline);
        putRect(16, 29, 20, 1, outMain);
        putRect(24, 28, 4, 3, outDetail);
      }
    }

    // วาดขาหน้ายกกางออกด้านข้าง/ด้านหน้าในท่ากระโดด (อยู่เหนือเสื้อเพื่อให้เห็นอุ้งเท้ากระโดดชัดเจน)
    if (isJumpingAir) {
      const frontColorMap: Record<string, string> = {
        o: palette.outline,
        f: palette.baseFur,
        s: palette.baseFurShadow,
        p: pawFill,
        t: pawPadFill
      };
      const leftFrontPaw = [
        ".ooo...",
        "oppto..",
        "opppfo.",
        ".offffo",
        "..ossfo",
        "...ooo."
      ];
      const rightFrontPaw = [
        "...ooo.",
        "..otppo",
        ".ofpppo",
        "offffo.",
        "ofsso..",
        ".ooo..."
      ];
      const frontPawY = jumpPhase === "air" ? 25 : 28;
      drawPixelStamp(7, frontPawY, leftFrontPaw, frontColorMap);
      drawPixelStamp(38, frontPawY, rightFrontPaw, frontColorMap);
    }

    // วาดพร็อพพิเศษจาก Achievement ด้วยช่องสี prop1, prop2, prop3 แยกกันโดยตรง
    if (config.prop !== "none" && config.colors.prop1.a > 0) {
      const propOutline = palette.outline;
      const propC1 = directRgbaCss(config.colors.prop1, furAlpha);
      const propC1Dark = neutralShadowRgbaCss(config.colors.prop1, furAlpha, 0.76);
      const propC2 = directRgbaCss(config.colors.prop2, furAlpha);
      const propC3 = directRgbaCss(config.colors.prop3, furAlpha);

      if (config.prop === "ribbon") {
        putRect(11, 8, 3, 4, propOutline);
        putRect(16, 8, 3, 4, propOutline);
        putRect(12, 9, 2, 2, propC1);
        putRect(16, 9, 2, 2, propC1);
        putRect(14, 9, 2, 3, propC2);
      } else if (config.prop === "sprout") {
        putRect(25, 5, 2, 5, propOutline);
        putRect(21, 2, 4, 3, propOutline);
        putRect(27, 2, 4, 3, propOutline);
        putRect(22, 3, 3, 2, propC1);
        putRect(27, 3, 3, 2, propC1);
        putPixel(22, 3, propC2);
        putPixel(28, 3, propC2);
      } else if (config.prop === "glasses") {
        const frameFill = propC1;
        const lensFill = directRgbaCss(
          { ...config.colors.prop2, a: Math.min(config.colors.prop2.a, 58) },
          furAlpha
        );
        putRect(15, 14, 7, 7, frameFill);
        putRect(30, 14, 7, 7, frameFill);
        putRect(22, 16, 8, 2, frameFill);
        putRect(12, 16, 3, 1, frameFill);
        putRect(37, 16, 3, 1, frameFill);
        putRect(16, 15, 5, 5, lensFill);
        putRect(31, 15, 5, 5, lensFill);
        putPixel(16, 15, palette.innerEarLight);
        putPixel(31, 15, palette.innerEarLight);
      } else if (config.prop === "headphones") {
        putRect(16, 3, 20, 2, propOutline);
        putRect(17, 4, 18, 1, propC1);
        putRect(9, 14, 4, 7, propOutline);
        putRect(10, 15, 2, 5, propC2);
        putRect(11, 16, 1, 3, propC3);
        putRect(39, 14, 4, 7, propOutline);
        putRect(40, 15, 2, 5, propC2);
        putRect(40, 16, 1, 3, propC3);
      } else if (config.prop === "headband") {
        putRect(12, 11, 28, 3, propOutline);
        putRect(13, 12, 26, 1, propC1);
        putRect(24, 12, 4, 1, propC2);
        putRect(8, 12, 4, 2, propC1);
        putRect(6, 14, 3, 2, propC3);
      } else if (config.prop === "coffee" && !isJumpingAir) {
        putRect(40, 41, 7, 8, propOutline, true);
        putRect(41, 42, 5, 6, propC1, true);
        putRect(41, 42, 5, 1, palette.innerEarLight, true);
        putRect(47, 43, 2, 4, propOutline, true);
        putRect(42, 44, 3, 2, propC2, true);
        putPixel(42, 38 + animPose.breathDy, propC3, true);
        putPixel(43, 37 + animPose.breathDy, propC3, true);
        putPixel(45, 39 + animPose.breathDy, propC3, true);
        putPixel(44, 36 + animPose.breathDy, propC3, true);
      } else if (config.prop === "grad-cap") {
        putRect(15, 4, 22, 2, propOutline);
        putRect(13, 2, 26, 2, propOutline);
        putRect(14, 3, 24, 1, propC1);
        putRect(19, 6, 14, 3, propOutline);
        putRect(20, 6, 12, 2, propC2);
        putRect(37, 4, 1, 5, propC3);
        putRect(36, 8, 3, 2, propC3);
      } else if (config.prop === "crown") {
        const crownMap = [
          "o....oo....o",
          "oo..oooo..oo",
          "ogooogggogoo",
          "oggggggggggo",
          "ogsgcppgcsgo",
          "oggggggggggo",
          "oooooooooooo"
        ];
        for (let dy = 0; dy < crownMap.length; dy += 1) {
          for (let dx = 0; dx < crownMap[dy].length; dx += 1) {
            const ch = crownMap[dy][dx];
            if (ch === ".") continue;
            const fill =
              ch === "o"
                ? propOutline
                : ch === "g"
                  ? propC1
                  : ch === "p" || ch === "c"
                    ? propC2
                    : propC3;
            putPixel(20 + dx, 3 + dy, fill);
          }
        }
      } else if (config.prop === "wizard-hat") {
        const hatMap = [
          "........oooo........",
          ".......oppppo.......",
          "......oppppppo......",
          ".....oppspppppo.....",
          "....oppppppppppo....",
          "...oppppssspppppo...",
          "..opggggggggggggpo..",
          "oooppppppppppppppooo",
          "oooooooooooooooooooo"
        ];
        for (let dy = 0; dy < hatMap.length; dy += 1) {
          for (let dx = 0; dx < hatMap[dy].length; dx += 1) {
            const ch = hatMap[dy][dx];
            if (ch === ".") continue;
            const color =
              ch === "o"
                ? propOutline
                : ch === "g"
                  ? propC2
                  : ch === "s"
                    ? propC3
                    : dy === 7
                      ? propC1Dark
                      : propC1;
            putPixel(16 + dx, 1 + dy, color);
          }
        }
      } else if (config.prop === "star-clip") {
        const starMap = [
          "...oo...",
          "..o11o..",
          "oo1221oo",
          "o112211o",
          ".o1111o.",
          "..o33o..",
          ".o3o3o.."
        ];
        for (let dy = 0; dy < starMap.length; dy += 1) {
          for (let dx = 0; dx < starMap[dy].length; dx += 1) {
            const ch = starMap[dy][dx];
            if (ch === ".") continue;
            const color = ch === "o" ? propOutline : ch === "1" ? propC1 : ch === "2" ? propC2 : propC3;
            putPixel(31 + dx, 6 + dy, color);
          }
        }
      } else if (config.prop === "halo") {
        const haloMap = [
          "....oooooooo....",
          "..oo11222211oo..",
          ".o11oo....oo11o.",
          "..oo11111111oo..",
          "....oooooooo...."
        ];
        for (let dy = 0; dy < haloMap.length; dy += 1) {
          for (let dx = 0; dx < haloMap[dy].length; dx += 1) {
            const ch = haloMap[dy][dx];
            if (ch === ".") continue;
            const color = ch === "o" ? propOutline : ch === "1" ? propC1 : propC2;
            putPixel(18 + dx, 1 + dy, color);
          }
        }
        putPixel(16, 2, propC3);
        putPixel(35, 2, propC3);
      } else if (config.prop === "flower-crown") {
        const crownMap = [
          "..ooo....oooo....ooo..",
          ".o222o..o2222o..o222o.",
          "o12321oo123321oo12321o",
          "o11211111122111111211o",
          ".oooooooooooooooooooo."
        ];
        for (let dy = 0; dy < crownMap.length; dy += 1) {
          for (let dx = 0; dx < crownMap[dy].length; dx += 1) {
            const ch = crownMap[dy][dx];
            if (ch === ".") continue;
            const color = ch === "o" ? propOutline : ch === "1" ? propC1 : ch === "2" ? propC2 : propC3;
            putPixel(15 + dx, 7 + dy, color);
          }
        }
      } else if (config.prop === "beret") {
        const beretMap = [
          ".........oo...........",
          "........o33o..........",
          "....oooooooooooo......",
          "..oo111111111111oo....",
          ".o1111111111111111oo..",
          "o1111111111111111111o.",
          "o1111dddddddddddd111o.",
          ".oooo222222222222oooo.",
          "....oooooooooooooo...."
        ];
        for (let dy = 0; dy < beretMap.length; dy += 1) {
          for (let dx = 0; dx < beretMap[dy].length; dx += 1) {
            const ch = beretMap[dy][dx];
            if (ch === ".") continue;
            const color =
              ch === "o"
                ? propOutline
                : ch === "1"
                  ? propC1
                  : ch === "d"
                    ? propC1Dark
                    : ch === "2"
                      ? propC2
                      : propC3;
            putPixel(15 + dx, 1 + dy, color);
          }
        }
      } else if (config.prop === "visor") {
        const lensFill = directRgbaCss(
          { ...config.colors.prop2, a: Math.min(config.colors.prop2.a, 66) },
          furAlpha
        );
        putRect(12, 14, 28, 1, propOutline);
        putRect(13, 15, 26, 1, propC1);
        putRect(12, 15, 1, 5, propOutline);
        putRect(39, 15, 1, 5, propOutline);
        putRect(13, 16, 26, 4, lensFill);
        putRect(13, 20, 10, 1, propOutline);
        putRect(29, 20, 10, 1, propOutline);
        putRect(23, 19, 6, 1, propOutline);
        putPixel(16, 16, propC3);
        putPixel(15, 17, propC3);
        putPixel(33, 16, propC3);
        putPixel(32, 17, propC3);
      }
    }

    if (config.showGrid) {
      ctx.strokeStyle = "rgba(63, 29, 56, 0.12)";
      ctx.lineWidth = 1;
      for (let i = 1; i < GRID_SIZE; i += 1) {
        const pos = Math.floor(i * scale) + 0.5;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(size, pos);
        ctx.stroke();
      }
    }
  };

  export const drawAvatarBackground = (
    ctx: CanvasRenderingContext2D,
    bgId: AvatarBgId,
    size: number
  ): void => {
    const unit = Math.max(2, Math.round(size / 20));
    const fillGrad = (stops: readonly [number, string][], angle: "v" | "diag" = "diag"): void => {
      const grad =
        angle === "v"
          ? ctx.createLinearGradient(0, 0, 0, size)
          : ctx.createLinearGradient(0, 0, size, size);
      stops.forEach(([pos, col]) => grad.addColorStop(pos, col));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
    };
    const px = (gx: number, gy: number, w: number, h: number, color: string): void => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(gx * unit), Math.round(gy * unit), Math.round(w * unit), Math.round(h * unit));
    };

    if (bgId === "warm-peach") {
      fillGrad([[0, "#fff4e6"], [1, "#fbd4b0"]]);
      px(3, 4, 2, 1, "rgba(255,255,255,0.65)");
      px(14, 15, 2, 1, "rgba(255,255,255,0.5)");
    } else if (bgId === "sky-cloud") {
      fillGrad([[0, "#e8f5ff"], [1, "#b9dffb"]], "v");
      px(2, 4, 4, 1, "rgba(255,255,255,0.82)");
      px(3, 3, 2, 1, "rgba(255,255,255,0.82)");
      px(13, 6, 4, 1, "rgba(255,255,255,0.75)");
      px(14, 5, 2, 1, "rgba(255,255,255,0.75)");
    } else if (bgId === "mint-checker") {
      ctx.fillStyle = "#eef8ef";
      ctx.fillRect(0, 0, size, size);
      const cell = Math.max(4, Math.round(size / 8));
      ctx.fillStyle = "#cfe9d3";
      for (let r = 0; r < 10; r += 1) {
        for (let c = 0; c < 10; c += 1) {
          if ((r + c) % 2 === 0) ctx.fillRect(c * cell, r * cell, cell, cell);
        }
      }
    } else if (bgId === "sunburst-gold") {
      fillGrad([[0, "#fff8d6"], [0.55, "#fde08d"], [1, "#f2b84b"]], "v");
      const cx = size / 2;
      const cy = size / 2;
      ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
      for (let i = 0; i < 8; i += 1) {
        const a0 = (i * Math.PI) / 4;
        const a1 = a0 + Math.PI / 10;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, size * 0.75, a0, a1);
        ctx.closePath();
        ctx.fill();
      }
    } else if (bgId === "sakura-petals") {
      fillGrad([[0, "#fff0f6"], [1, "#fbcfe0"]]);
      const petals: readonly [number, number][] = [[3, 4], [15, 3], [2, 13], [16, 12], [6, 16], [13, 17]];
      petals.forEach(([x, y]) => {
        px(x, y, 2, 1, "#f48fb1");
        px(x + 1, y + 1, 1, 1, "#ffffff");
      });
    } else if (bgId === "neon-grid") {
      fillGrad([[0, "#10182b"], [1, "#1b2848"]], "v");
      const step = Math.max(6, Math.round(size / 8));
      ctx.fillStyle = "rgba(45, 212, 191, 0.24)";
      for (let p = step; p < size; p += step) {
        ctx.fillRect(p, 0, Math.max(1, Math.round(size / 90)), size);
        ctx.fillRect(0, p, size, Math.max(1, Math.round(size / 90)));
      }
      px(3, 3, 1, 1, "#5eead4");
      px(16, 5, 1, 1, "#38bdf8");
      px(15, 16, 1, 1, "#5eead4");
    } else if (bgId === "royal-cosmos") {
      fillGrad([[0, "#1c1542"], [0.55, "#33226b"], [1, "#523285"]]);
      const stars: readonly [number, number, string][] = [
        [3, 4, "#fde047"],
        [16, 4, "#ffffff"],
        [5, 15, "#e9d5ff"],
        [15, 14, "#fde047"],
        [9, 2, "#ffffff"],
        [17, 9, "#c4b5fd"],
        [2, 10, "#fde047"]
      ];
      stars.forEach(([x, y, col]) => px(x, y, 1, 1, col));
    } else if (bgId === "pixel-polka") {
      fillGrad([[0, "#edf9ee"], [1, "#d8f0dc"]], "v");
      const dots: readonly [number, number][] = [
        [3, 3], [9, 2], [15, 4], [2, 9], [17, 9], [4, 15], [10, 17], [16, 15]
      ];
      dots.forEach(([x, y]) => px(x, y, 2, 2, "rgba(63, 141, 75, 0.24)"));
    } else if (bgId === "sunset-wave") {
      fillGrad([[0, "#ffe4c4"], [0.42, "#fda481"], [0.78, "#d484b5"], [1, "#7b68b8"]], "v");
      px(0, 14, 22, 1, "rgba(255,255,255,0.22)");
      px(0, 16, 22, 1, "rgba(255,255,255,0.16)");
      px(3, 4, 2, 1, "rgba(255,255,255,0.55)");
    } else if (bgId === "aurora-glow") {
      fillGrad([[0, "#0f2e30"], [0.45, "#1d6f5f"], [0.8, "#56c596"], [1, "#a7f3d0"]]);
      px(3, 3, 1, 1, "#ecfdf5");
      px(15, 4, 1, 1, "#a7f3d0");
      px(16, 13, 1, 1, "#ffffff");
      px(4, 15, 1, 1, "#d1fae5");
    } else if (bgId === "law-pillars") {
      fillGrad([[0, "#fdfbf5"], [1, "#efe4c8"]], "v");
      ctx.strokeStyle = "rgba(196, 154, 58, 0.24)";
      ctx.lineWidth = Math.max(1.5, size / 75);
      const gap = size / 5;
      for (let i = -size; i < size * 2; i += gap) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(i + size, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
      }
    } else if (bgId === "prism-holo") {
      fillGrad([
        [0, "#ffd6e7"],
        [0.28, "#fef3c7"],
        [0.56, "#ccf4dd"],
        [0.82, "#cde7ff"],
        [1, "#e6d4ff"]
      ]);
      px(4, 4, 1, 1, "#ffffff");
      px(15, 3, 1, 1, "#ffffff");
      px(3, 14, 1, 1, "#ffffff");
      px(16, 15, 1, 1, "#ffffff");
    } else {
      // Default: sage-cream
      fillGrad([[0, "#eff8f0"], [1, "#d2ead5"]]);
    }
  };

  export const renderBgSwatchDataUrl = (bgId: AvatarBgId, size = 72): string => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    const def = AVATAR_BACKGROUNDS.find((b) => b.id === bgId) || AVATAR_BACKGROUNDS[0];
    const ringW = Math.max(3, Math.round(size * 0.06));
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - ringW / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    drawAvatarBackground(ctx, bgId, size);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = def.ringColor;
    ctx.lineWidth = ringW;
    ctx.stroke();
    return canvas.toDataURL("image/png");
  };

  export const renderCatHeadToCanvas = (canvas: HTMLCanvasElement, rawConfig: CatConfig): void => {
    const config = normalizeConfig(rawConfig);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = canvas.width;
    const HEAD_VIEW_SIZE = 40;
    const HEAD_VIEW_X = 6;
    const HEAD_VIEW_Y = -3;
    const scale = size / HEAD_VIEW_SIZE;
    const bgId: AvatarBgId = config.avatarBg || "sage-cream";
    const bgDef = AVATAR_BACKGROUNDS.find((b) => b.id === bgId) || AVATAR_BACKGROUNDS[0];
    const ringW = Math.max(3, Math.round(size * 0.036));
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - ringW / 2;

    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = false;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Paint circular profile background first
    drawAvatarBackground(ctx, bgId, size);

    const putPixel = (x: number, y: number, fillStyle: string): void => {
      const gx = x - HEAD_VIEW_X;
      const gy = y - HEAD_VIEW_Y;
      if (gx < 0 || gx >= HEAD_VIEW_SIZE || gy < 0 || gy >= HEAD_VIEW_SIZE) return;
      ctx.fillStyle = fillStyle;
      const x0 = Math.round(gx * scale);
      const y0 = Math.round(gy * scale);
      const x1 = Math.round((gx + 1) * scale);
      const y1 = Math.round((gy + 1) * scale);
      ctx.fillRect(x0, y0, Math.max(1, x1 - x0), Math.max(1, y1 - y0));
    };

    const putRect = (x: number, y: number, w: number, h: number, fillStyle: string): void => {
      for (let dy = 0; dy < h; dy += 1) {
        for (let dx = 0; dx < w; dx += 1) {
          putPixel(x + dx, y + dy, fillStyle);
        }
      }
    };

    const furAlpha = config.colors.fur.a / 100;
    const palette: Record<Exclude<PixelRole, "transparent" | "eyeSlot">, string> = {
      outline: `rgba(63, 29, 56, ${furAlpha.toFixed(3)})`,
      nose: `rgba(242, 92, 68, ${furAlpha.toFixed(3)})`,
      innerEarLight: `rgba(250, 251, 232, ${furAlpha.toFixed(3)})`,
      innerEarShadow: `rgba(229, 182, 186, ${furAlpha.toFixed(3)})`,
      baseFur: directRgbaCss(config.colors.fur),
      baseFurShadow: neutralShadowRgbaCss(config.colors.fur, 1, 0.87),
      pattern1: directRgbaCss(config.colors.pattern1, furAlpha),
      pattern2: directRgbaCss(config.colors.pattern2, furAlpha),
      pattern3: directRgbaCss(config.colors.pattern3, furAlpha)
    };

    const rowOffset = 5;
    const colOffset = 3;

    // Draw only the head rows (r = 0..22), excluding the tail columns (c <= 7)
    for (let r = 0; r <= 22; r += 1) {
      const row = FRONT_CAT_46[r];
      const y = r + rowOffset;
      for (let c = 8; c < row.length; c += 1) {
        const ch = row[c];
        const role = resolvePixelRole(config.pattern, r, c, ch);
        if (role === "transparent") continue;
        const x = c + colOffset;

        if (role === "eyeSlot") {
          putPixel(x, y, palette.baseFur);
          continue;
        }

        if (
          (role === "pattern1" && config.colors.pattern1.a < 100) ||
          (role === "pattern2" && config.colors.pattern2.a < 100) ||
          (role === "pattern3" && config.colors.pattern3.a < 100)
        ) {
          putPixel(x, y, palette.baseFur);
        }

        putPixel(x, y, palette[role]);
      }
    }

    // Seal the bottom chin contour cleanly along r = 23 (c = 14..31) with outline pixels
    const chinRow = FRONT_CAT_46[23];
    for (let c = 14; c <= 31; c += 1) {
      if (chinRow[c] !== ".") {
        putPixel(c + colOffset, 23 + rowOffset, palette.outline);
      }
    }

    // Eyes
    const leftEyeFill = directRgbaCss(config.colors.eyeLeft, furAlpha);
    const leftEyeDeep = neutralShadowRgbaCss(config.colors.eyeLeft, furAlpha, 0.72);
    const rightEyeFill = directRgbaCss(config.colors.eyeRight, furAlpha);
    const rightEyeDeep = neutralShadowRgbaCss(config.colors.eyeRight, furAlpha, 0.72);
    const eyeGlint = directRgbaCss(config.colors.eyeGlint, furAlpha);
    const eyeSoftGlint = neutralShadowRgbaCss(config.colors.eyeGlint, furAlpha, 0.86);

    const drawCatEye = (ox: number, oy: number, mainColor: string, deepColor: string): void => {
      if (config.eyeStyle === "happy") {
        putPixel(ox, oy + 2, palette.outline);
        putPixel(ox + 1, oy + 1, palette.outline);
        putPixel(ox + 2, oy + 1, palette.outline);
        putPixel(ox + 3, oy + 1, palette.outline);
        putPixel(ox + 4, oy + 2, palette.outline);
        return;
      }

      const eyeMask = [".ooo.", "oiiio", "oiiio", "oiiio", ".ooo."];
      for (let dy = 0; dy < 5; dy += 1) {
        for (let dx = 0; dx < 5; dx += 1) {
          const m = eyeMask[dy][dx];
          if (m === ".") continue;
          if (config.eyeStyle === "cool" && dy === 0) continue;
          if (config.eyeStyle === "cool" && dy === 1) {
            putPixel(ox + dx, oy + dy, palette.outline);
            continue;
          }
          putPixel(ox + dx, oy + dy, m === "o" ? deepColor : mainColor);
        }
      }
      if (config.eyeStyle !== "cool") {
        putPixel(ox + 1, oy + 1, eyeGlint);
        putPixel(ox + 2, oy + 1, eyeSoftGlint);
      } else {
        putPixel(ox + 1, oy + 2, eyeGlint);
      }
      if (config.eyeStyle === "sparkle") {
        putPixel(ox + 3, oy + 3, eyeGlint);
      }
    };

    drawCatEye(16, 15, leftEyeFill, leftEyeDeep);
    drawCatEye(31, 15, rightEyeFill, rightEyeDeep);

    // Head-worn props only (skip floor props like coffee and body outfits)
    if (config.prop !== "none" && config.prop !== "coffee" && config.colors.prop1.a > 0) {
      const propOutline = palette.outline;
      const propC1 = directRgbaCss(config.colors.prop1, furAlpha);
      const propC1Dark = neutralShadowRgbaCss(config.colors.prop1, furAlpha, 0.76);
      const propC2 = directRgbaCss(config.colors.prop2, furAlpha);
      const propC3 = directRgbaCss(config.colors.prop3, furAlpha);

      if (config.prop === "ribbon") {
        putRect(11, 8, 3, 4, propOutline);
        putRect(16, 8, 3, 4, propOutline);
        putRect(12, 9, 2, 2, propC1);
        putRect(16, 9, 2, 2, propC1);
        putRect(14, 9, 2, 3, propC2);
      } else if (config.prop === "sprout") {
        putRect(25, 5, 2, 5, propOutline);
        putRect(21, 2, 4, 3, propOutline);
        putRect(27, 2, 4, 3, propOutline);
        putRect(22, 3, 3, 2, propC1);
        putRect(27, 3, 3, 2, propC1);
        putPixel(22, 3, propC2);
        putPixel(28, 3, propC2);
      } else if (config.prop === "glasses") {
        const frameFill = propC1;
        const lensFill = directRgbaCss(
          { ...config.colors.prop2, a: Math.min(config.colors.prop2.a, 58) },
          furAlpha
        );
        putRect(15, 14, 7, 7, frameFill);
        putRect(30, 14, 7, 7, frameFill);
        putRect(22, 16, 8, 2, frameFill);
        putRect(12, 16, 3, 1, frameFill);
        putRect(37, 16, 3, 1, frameFill);
        putRect(16, 15, 5, 5, lensFill);
        putRect(31, 15, 5, 5, lensFill);
        putPixel(16, 15, palette.innerEarLight);
        putPixel(31, 15, palette.innerEarLight);
      } else if (config.prop === "headphones") {
        putRect(16, 3, 20, 2, propOutline);
        putRect(17, 4, 18, 1, propC1);
        putRect(9, 14, 4, 7, propOutline);
        putRect(10, 15, 2, 5, propC2);
        putRect(11, 16, 1, 3, propC3);
        putRect(39, 14, 4, 7, propOutline);
        putRect(40, 15, 2, 5, propC2);
        putRect(40, 16, 1, 3, propC3);
      } else if (config.prop === "headband") {
        putRect(12, 11, 28, 3, propOutline);
        putRect(13, 12, 26, 1, propC1);
        putRect(24, 12, 4, 1, propC2);
        putRect(9, 12, 3, 2, propC1);
        putRect(8, 14, 3, 2, propC3);
      } else if (config.prop === "grad-cap") {
        putRect(15, 4, 22, 2, propOutline);
        putRect(13, 2, 26, 2, propOutline);
        putRect(14, 3, 24, 1, propC1);
        putRect(19, 6, 14, 3, propOutline);
        putRect(20, 6, 12, 2, propC2);
        putRect(37, 4, 1, 5, propC3);
        putRect(36, 8, 3, 2, propC3);
      } else if (config.prop === "crown") {
        const crownMap = [
          "o....oo....o",
          "oo..oooo..oo",
          "ogooogggogoo",
          "oggggggggggo",
          "ogsgcppgcsgo",
          "oggggggggggo",
          "oooooooooooo"
        ];
        for (let dy = 0; dy < crownMap.length; dy += 1) {
          for (let dx = 0; dx < crownMap[dy].length; dx += 1) {
            const ch = crownMap[dy][dx];
            if (ch === ".") continue;
            const fill =
              ch === "o"
                ? propOutline
                : ch === "g"
                  ? propC1
                  : ch === "p" || ch === "c"
                    ? propC2
                    : propC3;
            putPixel(20 + dx, 3 + dy, fill);
          }
        }
      } else if (config.prop === "wizard-hat") {
        const hatMap = [
          "........oooo........",
          ".......oppppo.......",
          "......oppppppo......",
          ".....oppspppppo.....",
          "....oppppppppppo....",
          "...oppppssspppppo...",
          "..opggggggggggggpo..",
          "oooppppppppppppppooo",
          "oooooooooooooooooooo"
        ];
        for (let dy = 0; dy < hatMap.length; dy += 1) {
          for (let dx = 0; dx < hatMap[dy].length; dx += 1) {
            const ch = hatMap[dy][dx];
            if (ch === ".") continue;
            const color =
              ch === "o"
                ? propOutline
                : ch === "g"
                  ? propC2
                  : ch === "s"
                    ? propC3
                    : dy === 7
                      ? propC1Dark
                      : propC1;
            putPixel(16 + dx, 1 + dy, color);
          }
        }
      } else if (config.prop === "star-clip") {
        const starMap = [
          "...oo...",
          "..o11o..",
          "oo1221oo",
          "o112211o",
          ".o1111o.",
          "..o33o..",
          ".o3o3o.."
        ];
        for (let dy = 0; dy < starMap.length; dy += 1) {
          for (let dx = 0; dx < starMap[dy].length; dx += 1) {
            const ch = starMap[dy][dx];
            if (ch === ".") continue;
            const color = ch === "o" ? propOutline : ch === "1" ? propC1 : ch === "2" ? propC2 : propC3;
            putPixel(31 + dx, 6 + dy, color);
          }
        }
      } else if (config.prop === "halo") {
        const haloMap = [
          "....oooooooo....",
          "..oo11222211oo..",
          ".o11oo....oo11o.",
          "..oo11111111oo..",
          "....oooooooo...."
        ];
        for (let dy = 0; dy < haloMap.length; dy += 1) {
          for (let dx = 0; dx < haloMap[dy].length; dx += 1) {
            const ch = haloMap[dy][dx];
            if (ch === ".") continue;
            const color = ch === "o" ? propOutline : ch === "1" ? propC1 : propC2;
            putPixel(18 + dx, 1 + dy, color);
          }
        }
        putPixel(16, 2, propC3);
        putPixel(35, 2, propC3);
      } else if (config.prop === "flower-crown") {
        const crownMap = [
          "..ooo....oooo....ooo..",
          ".o222o..o2222o..o222o.",
          "o12321oo123321oo12321o",
          "o11211111122111111211o",
          ".oooooooooooooooooooo."
        ];
        for (let dy = 0; dy < crownMap.length; dy += 1) {
          for (let dx = 0; dx < crownMap[dy].length; dx += 1) {
            const ch = crownMap[dy][dx];
            if (ch === ".") continue;
            const color = ch === "o" ? propOutline : ch === "1" ? propC1 : ch === "2" ? propC2 : propC3;
            putPixel(15 + dx, 7 + dy, color);
          }
        }
      } else if (config.prop === "beret") {
        const beretMap = [
          ".........oo...........",
          "........o33o..........",
          "....oooooooooooo......",
          "..oo111111111111oo....",
          ".o1111111111111111oo..",
          "o1111111111111111111o.",
          "o1111dddddddddddd111o.",
          ".oooo222222222222oooo.",
          "....oooooooooooooo...."
        ];
        for (let dy = 0; dy < beretMap.length; dy += 1) {
          for (let dx = 0; dx < beretMap[dy].length; dx += 1) {
            const ch = beretMap[dy][dx];
            if (ch === ".") continue;
            const color =
              ch === "o"
                ? propOutline
                : ch === "1"
                  ? propC1
                  : ch === "d"
                    ? propC1Dark
                    : ch === "2"
                      ? propC2
                      : propC3;
            putPixel(15 + dx, 1 + dy, color);
          }
        }
      } else if (config.prop === "visor") {
        const lensFill = directRgbaCss(
          { ...config.colors.prop2, a: Math.min(config.colors.prop2.a, 66) },
          furAlpha
        );
        putRect(12, 14, 28, 1, propOutline);
        putRect(13, 15, 26, 1, propC1);
        putRect(12, 15, 1, 5, propOutline);
        putRect(39, 15, 1, 5, propOutline);
        putRect(13, 16, 26, 4, lensFill);
        putRect(13, 20, 10, 1, propOutline);
        putRect(29, 20, 10, 1, propOutline);
        putRect(23, 19, 6, 1, propOutline);
        putPixel(16, 16, propC3);
        putPixel(15, 17, propC3);
        putPixel(33, 16, propC3);
        putPixel(32, 17, propC3);
      }
    }

    ctx.restore();

    // Crisp circular profile frame ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = bgDef.ringColor;
    ctx.lineWidth = ringW;
    ctx.stroke();
  };

  export const renderConfigToDataUrl = (rawConfig: CatConfig, size = 240): string => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    renderCatHeadToCanvas(canvas, { ...normalizeConfig(rawConfig), showGrid: false });
    return canvas.toDataURL("image/png");
  };

  const npcAvatarCache = new Map<string, string>();

  export const getNpcConfig = (seedName: string): CatConfig => {
    const clean = String(seedName || "NPC").trim().toUpperCase();
    let hash = 2166136261;
    for (let i = 0; i < clean.length; i += 1) {
      hash ^= clean.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const uHash = hash >>> 0;
    const patterns: FurPatternId[] = ["tabby", "tuxedo", "calico", "siamese", "solid"];
    const eyes: EyeStyleId[] = ["round", "sparkle", "cool", "heterochromia", "happy"];
    const outfits: OutfitId[] = ["none", "scarf", "hoodie", "suit", "sweater", "cloak"];
    const props: PropId[] = ["none", "ribbon", "sprout", "glasses", "headphones", "headband", "grad-cap", "crown", "wizard-hat"];

    const pattern = patterns[uHash % patterns.length];
    const eyeStyle = eyes[(uHash >>> 3) % eyes.length];
    const outfit = outfits[(uHash >>> 6) % outfits.length];
    const prop = props[(uHash >>> 9) % props.length];

    const furHue = (uHash * 37) % 360;
    const p1Hue = (furHue + 28 + ((uHash >>> 4) % 140)) % 360;
    const eyeHue = (uHash * 73) % 360;
    const outHue = (uHash * 53 + 110) % 360;
    const propHue = (uHash * 97 + 45) % 360;

    const npcBgs: AvatarBgId[] = ["sage-cream", "warm-peach", "sky-cloud", "mint-checker", "pixel-polka", "sakura-petals"];
    const avatarBg = npcBgs[(uHash >>> 12) % npcBgs.length];

    return normalizeConfig({
      pattern,
      eyeStyle,
      outfit,
      prop,
      avatarBg,
      showGrid: false,
      colors: {
        fur: { h: furHue, s: 45 + (uHash % 40), v: 78 + (uHash % 20), a: 100 },
        pattern1: { h: p1Hue, s: 55 + ((uHash >>> 2) % 35), v: 42 + ((uHash >>> 5) % 45), a: 100 },
        pattern2: { h: (furHue + 180) % 360, s: 10, v: 97, a: 100 },
        pattern3: { h: furHue, s: 22, v: 88, a: 100 },
        eyeLeft: { h: eyeHue, s: 78, v: 82, a: 100 },
        eyeRight: { h: eyeStyle === "heterochromia" ? (eyeHue + 145) % 360 : eyeHue, s: 78, v: 82, a: 100 },
        eyeGlint: { h: 60, s: 5, v: 100, a: 100 },
        outfit1: { h: outHue, s: 68, v: 78, a: 100 },
        outfit2: { h: (outHue + 40) % 360, s: 25, v: 96, a: 100 },
        outfit3: { h: (outHue + 190) % 360, s: 82, v: 90, a: 100 },
        prop1: { h: propHue, s: 78, v: 92, a: 100 },
        prop2: { h: (propHue + 55) % 360, s: 88, v: 96, a: 100 },
        prop3: { h: (propHue + 160) % 360, s: 80, v: 95, a: 100 }
      }
    });
  };

  export const renderPropPreviewDataUrl = (propId: PropId, baseConfig?: CatConfig, size = 72): string => {
    const cfg = normalizeConfig(baseConfig || defaultConfig());
    const signatureColors: Partial<Record<PropId, { prop1: LayerColor; prop2: LayerColor; prop3: LayerColor }>> = {
      "star-clip": {
        prop1: { h: 46, s: 92, v: 99, a: 100 },
        prop2: { h: 55, s: 22, v: 100, a: 100 },
        prop3: { h: 342, s: 78, v: 94, a: 100 }
      },
      halo: {
        prop1: { h: 44, s: 94, v: 99, a: 100 },
        prop2: { h: 56, s: 35, v: 100, a: 100 },
        prop3: { h: 48, s: 95, v: 100, a: 100 }
      },
      "flower-crown": {
        prop1: { h: 128, s: 64, v: 64, a: 100 },
        prop2: { h: 342, s: 72, v: 96, a: 100 },
        prop3: { h: 48, s: 92, v: 99, a: 100 }
      },
      beret: {
        prop1: { h: 142, s: 52, v: 46, a: 100 },
        prop2: { h: 44, s: 78, v: 92, a: 100 },
        prop3: { h: 142, s: 46, v: 34, a: 100 }
      },
      visor: {
        prop1: { h: 214, s: 32, v: 32, a: 100 },
        prop2: { h: 186, s: 88, v: 96, a: 100 },
        prop3: { h: 175, s: 25, v: 100, a: 100 }
      }
    };
    const sig = signatureColors[propId];
    return renderConfigToDataUrl(
      {
        ...cfg,
        prop: propId,
        colors: sig ? { ...cfg.colors, ...sig } : cfg.colors
      },
      size
    );
  };

  export const getNpcAvatarDataUrl = (seedName: string, size = 200): string => {
    const key = `${String(seedName || "NPC").trim().toUpperCase()}:${size}`;
    const cached = npcAvatarCache.get(key);
    if (cached) return cached;
    const url = renderConfigToDataUrl(getNpcConfig(seedName), size);
    npcAvatarCache.set(key, url);
    return url;
  };
}
