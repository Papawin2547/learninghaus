// Mae Fah Luang University (MFU) Trivia Content Bank (5 Categories: History, Symbols, 15 Schools & Colors, Campus Landmarks, Traditions) — Bilingual TH + EN
namespace LearningHausMfuTrivia {
  type PartyItem = LearningHausCustomQuizStudio.CustomQuizQuestionItem & {
    timeLimitSeconds?: number;
  };

  type BiItemSpec =
    | {
        id: string;
        kind: "quiz";
        promptEn: string;
        promptTh: string;
        optionsEn: [string, string, string, string];
        optionsTh: [string, string, string, string];
        correctIndex: number;
        explainEn: string;
        explainTh: string;
      }
    | {
        id: string;
        kind: "true-false-sprint";
        promptEn: string;
        promptTh: string;
        isTrue: boolean;
        explainEn: string;
        explainTh: string;
      }
    | {
        id: string;
        kind: "matching";
        promptEn: string;
        promptTh: string;
        pairsEn: { left: string; right: string }[];
        pairsTh: { left: string; right: string }[];
        explainEn: string;
        explainTh: string;
      }
    | {
        id: string;
        kind: "binary-stamp";
        promptEn: string;
        promptTh: string;
        leftEn: string;
        leftTh: string;
        rightEn: string;
        rightTh: string;
        stampAnswer: "left" | "right";
        explainEn: string;
        explainTh: string;
      }
    | {
        id: string;
        kind: "sorting";
        promptEn: string;
        promptTh: string;
        bucketsEn: [string, string];
        bucketsTh: [string, string];
        itemsEn: { text: string; bucketIdx: number }[];
        itemsTh: { text: string; bucketIdx: number }[];
        explainEn: string;
        explainTh: string;
      }
    | {
        id: string;
        kind: "order-steps";
        promptEn: string;
        promptTh: string;
        stepsEn: string[];
        stepsTh: string[];
        explainEn: string;
        explainTh: string;
      };

  const MFU_BANK: readonly BiItemSpec[] = [
    // หมวด 1: ประวัติความเป็นมาและข้อมูลพื้นฐาน
    {
      id: "mfu-1",
      kind: "quiz",
      promptEn: "When was Mae Fah Luang University (MFU) officially founded?",
      promptTh: "วันสถาปนามหาวิทยาลัยแม่ฟ้าหลวง (มฟล.) ตรงกับวันที่เท่าใด?",
      optionsEn: [
        "25 September 1998 (B.E. 2541)",
        "21 October 2000 (B.E. 2543)",
        "14 February 1996 (B.E. 2539)",
        "5 December 1999 (B.E. 2542)"
      ],
      optionsTh: [
        "25 กันยายน พ.ศ. 2541 (ปีขาล)",
        "21 ตุลาคม พ.ศ. 2543 (ปีมะโรง)",
        "14 กุมภาพันธ์ พ.ศ. 2539 (ปีชวด)",
        "5 ธันวาคม พ.ศ. 2542 (ปีเถาะ)"
      ],
      correctIndex: 0,
      explainEn: "MFU was established on 25 September B.E. 2541 (Year of the Tiger).",
      explainTh: "วันสถาปนา มฟล. คือวันที่ 25 กันยายน พ.ศ. 2541 ตรงกับปีขาล"
    },
    {
      id: "mfu-2",
      kind: "quiz",
      promptEn: "What is MFU's founding royal aspiration carried forward from Princess Srinagarindra (Somdet Ya)?",
      promptTh: "พระราชปณิธานหลักของสมเด็จย่าที่ มฟล. สืบสานคือข้อใด?",
      optionsEn: [
        "Reforesting Land & Developing People (ปลูกป่า สร้างคน)",
        "Digital Commerce First",
        "Zero-Paper Administration",
        "Urban Skyscraper Expansion"
      ],
      optionsTh: [
        "“ปลูกป่า สร้างคน”",
        "“สร้างตึกสูง ทันสมัย”",
        "“เทคโนโลยีนำเศรษฐกิจ”",
        "“วิจัยลึก พิชิตอวกาศ”"
      ],
      correctIndex: 0,
      explainEn: "MFU upholds Somdet Ya's royal aspiration of 'Planting Forests, Building People' (ปลูกป่า สร้างคน).",
      explainTh: "มฟล. สืบสานพระราชปณิธานของสมเด็จย่าในการ “ปลูกป่า สร้างคน”"
    },
    {
      id: "mfu-3",
      kind: "quiz",
      promptEn: "Who served as the very first President of Mae Fah Luang University?",
      promptTh: "อธิการบดีคนแรกของมหาวิทยาลัยแม่ฟ้าหลวงคือท่านใด?",
      optionsEn: [
        "Assoc. Prof. Dr. Vanchai Sirichana",
        "Pol. Gen. Pow Sarasin",
        "Prof. Dr. Pridi Banomyong",
        "Dr. Puey Ungphakorn"
      ],
      optionsTh: [
        "รศ.ดร.วันชัย ศิริชนะ",
        "พล.ต.อ.เภา สารสิน",
        "ศ.ดร.ปรีดี พนมยงค์",
        "ดร.ป๋วย อึ๊งภากรณ์"
      ],
      correctIndex: 0,
      explainEn: "Assoc. Prof. Dr. Vanchai Sirichana pioneered and laid MFU's foundation as its first President.",
      explainTh: "รองศาสตราจารย์ ดร.วันชัย ศิริชนะ เป็นอธิการบดีคนแรกผู้บุกเบิกและวางรากฐาน มฟล."
    },
    {
      id: "mfu-4",
      kind: "quiz",
      promptEn: "Where is MFU's main campus located, and what is its famous nickname?",
      promptTh: "มฟล. ตั้งอยู่ที่ตำบลใดในจังหวัดเชียงราย และมีฉายาที่เป็นที่รู้จักว่าอะไร?",
      optionsEn: [
        "333 Moo 1, Tha Sut, Chiang Rai · 'University in the Park'",
        "Nimmanhaemin, Chiang Mai · 'Mountain Tech Hub'",
        "Mae Sai Border · 'Gate of Mekong'",
        "Phayao Lakeside · 'Valley Campus'"
      ],
      optionsTh: [
        "ต.ท่าสุด อ.เมือง จ.เชียงราย · “มหาวิทยาลัยในสวน”",
        "ต.สุเทพ จ.เชียงใหม่ · “เมืองแห่งหมอก”",
        "อ.แม่สาย จ.เชียงราย · “ประตูสู่แม่น้ำโขง”",
        "ต.ริมกก จ.เชียงราย · “แคมปัสริมน้ำ”"
      ],
      correctIndex: 0,
      explainEn: "Located at 333 Moo 1, Tha Sut, Chiang Rai, MFU is celebrated as the 'University in the Park'.",
      explainTh: "ตั้งอยู่เลขที่ 333 หมู่ 1 ต.ท่าสุด อ.เมือง จ.เชียงราย และได้ฉายา “มหาวิทยาลัยในสวน”"
    },
    // หมวด 2: สัญลักษณ์ สี ดอกไม้ และอัตลักษณ์ประจำมหาวิทยาลัย
    {
      id: "mfu-5",
      kind: "quiz",
      promptEn: "What do the Thai auspicious numerals '๘' and '๙' above MFU's emblem signify?",
      promptTh: "ตัวเลขมงคล '๘' และ '๙' บนตราสัญลักษณ์ มฟล. หมายถึงสิ่งใด?",
      optionsEn: [
        "Somdet Ya as the Royal Mother of King Rama VIII and King Rama IX",
        "Founding month August and 9 founding schools",
        "The 8th and 9th buildings constructed at Tha Sut",
        "8 Doi Tung peaks and 9 gardens"
      ],
      optionsTh: [
        "ทรงเป็นพระราชชนนีของพระมหากษัตริย์รัชกาลที่ 8 และรัชกาลที่ 9",
        "เดือนสิงหาคมและสำนักวิชาเริ่มแรก 9 แห่ง",
        "อาคารเรียน 8 หลังและหอพัก 9 หลัง",
        "ดอย 8 ลูกและสระน้ำ 9 แห่ง"
      ],
      correctIndex: 0,
      explainEn: "'๘' above University and '๙' above Mae Fah Luang honor Princess Srinagarindra as Royal Mother of Kings Rama VIII & IX.",
      explainTh: "เลข ๘ และ ๙ หมายถึงทรงเป็นพระราชชนนีของพระบาทสมเด็จพระเจ้าอยู่หัวรัชกาลที่ 8 และรัชกาลที่ 9"
    },
    {
      id: "mfu-6",
      kind: "quiz",
      promptEn: "What is MFU's official flower, and what is the university's adorable mascot called?",
      promptTh: "ดอกไม้ประจำ มฟล. และชื่อมาสคอต (Mascot) ประจำมหาวิทยาลัยคือข้อใด?",
      optionsEn: [
        "Lamduan / Hom Nual (Sphaerocoryne lefevrei) & 'Nong Din-Din' (mole)",
        "Sakura Blossom & 'Nong Fah'",
        "Golden Shower (Ratchaphruek) & 'Nong Chang'",
        "Lotus Flower & 'Nong Lamduan'"
      ],
      optionsTh: [
        "ดอกหอมนวล (ดอกลำดวน) และมาสคอต “น้องดินดิน” (ตัวตุ่น)",
        "ดอกซากุระดอย และ “น้องหมอก”",
        "ดอกราชพฤกษ์ และ “น้องช้างน้อย”",
        "ดอกบัวตอง และ “น้องกวาง”"
      ],
      correctIndex: 0,
      explainEn: "MFU's pale-yellow fragrant flower is Hom Nual / Lamduan, and 'Nong Din-Din' symbolizes soil & nature conservation.",
      explainTh: "ดอกไม้ประจำ มฟล. คือดอกหอมนวล/ดอกลำดวน ส่วนมาสคอตคือ “น้องดินดิน” ตัวตุ่นอนุรักษ์สิ่งแวดล้อม"
    },
    {
      id: "mfu-7",
      kind: "matching",
      promptEn: "Pair Match · 4 Tung Patterns on MFU Graduation Gown",
      promptTh: "จับคู่ · ความหมายลายตุง 4 สัญลักษณ์มงคลบนแถบครุย มฟล.",
      pairsEn: [
        { left: "Prasat (Castle)", right: "Tavatimsa Heaven (สวรรค์ชั้นดาวดึงส์)" },
        { left: "Mouse / Rat (หนู)", right: "Somdet Ya's birth year (ปีชวด พ.ศ. 2443)" },
        { left: "Naga (พญานาค)", right: "Lanna guardian of Buddhism" },
        { left: "Tiger (เสือ)", right: "MFU founding year (ปีขาล พ.ศ. 2541)" }
      ],
      pairsTh: [
        { left: "ลายปราสาท", right: "สวรรค์ชั้นดาวดึงส์" },
        { left: "ลายหนู", right: "ปีพระราชสมภพสมเด็จย่า (ปีชวด พ.ศ. 2443)" },
        { left: "ลายพญานาค", right: "สัตว์ชั้นสูงผู้พิทักษ์พระพุทธศาสนาล้านนา" },
        { left: "ลายเสือ", right: "ปีก่อตั้ง มฟล. (ปีขาล พ.ศ. 2541)" }
      ],
      explainEn: "The 4 Doi Tung gown patterns encode MFU's Lanna heritage and Somdet Ya's timeline.",
      explainTh: "แถบตุง 4 ลายบนครุย มฟล. คือ ลายปราสาท หนู พญานาค และเสือ"
    },
    {
      id: "mfu-8",
      kind: "true-false-sprint",
      promptEn: "MFU's colors Red & Gold represent Somdet Ya's Sunday birth color (Red) and boundless prosperity (Gold).",
      promptTh: "สีแดงประจำ มฟล. หมายถึงสีประจำวันพระราชสมภพ (วันอาทิตย์) และสีทองหมายถึงความเจริญรุ่งเรืองไม่มีขอบเขต",
      isTrue: true,
      explainEn: "Red represents Sunday (Somdet Ya's birth day) and Gold symbolizes boundless university prosperity.",
      explainTh: "ถูกต้อง! สีแดงคือวันอาทิตย์ (วันพระราชสมภพ) และสีทองคือความเจริญรุ่งเรืองอย่างไม่มีขอบเขต"
    },
    // หมวด 3: สำนักวิชาทั้ง 15 แห่ง และสีประจำสำนักวิชา
    {
      id: "mfu-9",
      kind: "quiz",
      promptEn: "Which official school color represents the School of Applied Digital Technology (ADT)?",
      promptTh: "สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์ (School of Applied Digital Technology) ใช้สีใดเป็นสีประจำสำนัก?",
      optionsEn: ["Navy Blue (สีน้ำเงิน)", "Sky Blue (สีฟ้า)", "Purple (สีม่วง)", "Orange (สีแสด)"],
      optionsTh: ["สีน้ำเงิน", "สีฟ้า", "สีม่วง", "สีแสด"],
      correctIndex: 0,
      explainEn: "Applied Digital Technology uses Navy Blue (สีน้ำเงิน), while Management uses Sky Blue (สีฟ้า).",
      explainTh: "สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์ใช้ “สีน้ำเงิน” (ส่วนสำนักวิชาการจัดการใช้สีฟ้า)"
    },
    {
      id: "mfu-10",
      kind: "matching",
      promptEn: "Pair Match · Match Each MFU School to Its Color (Set 1)",
      promptTh: "จับคู่ · สำนักวิชา มฟล. กับสีประจำสำนัก (ชุดที่ 1)",
      pairsEn: [
        { left: "School of Law", right: "White (สีขาว)" },
        { left: "Cosmetic Science", right: "Magenta / Shocking Pink (สีบานเย็น)" },
        { left: "School of Sinology", right: "Red (สีแดง)" },
        { left: "School of Dentistry", right: "Purple (สีม่วง)" }
      ],
      pairsTh: [
        { left: "สำนักวิชานิติศาสตร์", right: "สีขาว" },
        { left: "สำนักวิชาวิทยาศาสตร์เครื่องสำอาง", right: "สีบานเย็น" },
        { left: "สำนักวิชาจีนวิทยา", right: "สีแดง" },
        { left: "สำนักวิชาทันตแพทยศาสตร์", right: "สีม่วง" }
      ],
      explainEn: "MFU has 15 Schools—Law is White, Cosmetic Science is Magenta, Sinology is Red, and Dentistry is Purple.",
      explainTh: "นิติศาสตร์=สีขาว, เครื่องสำอาง=สีบานเย็น, จีนวิทยา=สีแดง, ทันตแพทย์=สีม่วง"
    },
    {
      id: "mfu-11",
      kind: "matching",
      promptEn: "Pair Match · Match Green-Spectrum & Warm Schools (Set 2)",
      promptTh: "จับคู่ · สำนักวิชาโทนสีเขียว/พาสเทล (ชุดที่ 2)",
      pairsEn: [
        { left: "School of Medicine", right: "Green (สีเขียว)" },
        { left: "Health Science", right: "Light Green (สีเขียวอ่อน)" },
        { left: "Anti-Aging & Regenerative Med", right: "Dark Green (สีเขียวเข้ม)" },
        { left: "Integrative Medicine", right: "Teal / Blue-Green (สีเขียวอมฟ้า)" }
      ],
      pairsTh: [
        { left: "สำนักวิชาแพทยศาสตร์", right: "สีเขียว" },
        { left: "สำนักวิชาวิทยาศาสตร์สุขภาพ", right: "สีเขียวอ่อน" },
        { left: "สำนักวิชาเวชศาสตร์ชะลอวัยฯ", right: "สีเขียวเข้ม" },
        { left: "สำนักวิชาการแพทย์บูรณาการ", right: "สีเขียวอมฟ้า" }
      ],
      explainEn: "All 4 health/medical green tones differ cleanly: Medicine (Green), Health Science (Light), Anti-Aging (Dark), Integrative (Teal).",
      explainTh: "แพทย์=เขียว, วิทย์สุขภาพ=เขียวอ่อน, ชะลอวัย=เขียวเข้ม, แพทย์บูรณาการ=เขียวอมฟ้า"
    },
    {
      id: "mfu-12",
      kind: "quiz",
      promptEn: "How many academic Schools ('สำนักวิชา', not 'คณะ') does MFU currently have, and what color is School of Nursing?",
      promptTh: "ปัจจุบัน มฟล. มีทั้งหมดกี่สำนักวิชา และสำนักวิชาพยาบาลศาสตร์มีสีประจำสำนักคือสีใด?",
      optionsEn: [
        "15 Schools · Orange (สีแสด)",
        "12 Schools · Pink (สีชมพู)",
        "18 Schools · Gray (สีเทา)",
        "15 Schools · Cream Yellow (สีเหลืองนวล)"
      ],
      optionsTh: [
        "15 สำนักวิชา · สีแสด",
        "12 สำนักวิชา · สีชมพู",
        "18 สำนักวิชา · สีเทา",
        "15 สำนักวิชา · สีเหลืองนวล"
      ],
      correctIndex: 0,
      explainEn: "MFU has 15 Schools; Nursing is Orange (สีแสด), Agro-Industry is Pink (สีชมพู), Liberal Arts is Gray (สีเทา), and Social Innovation is Cream Yellow.",
      explainTh: "มฟล. มี 15 สำนักวิชา และสำนักวิชาพยาบาลศาสตร์ใช้ “สีแสด”"
    },
    // หมวด 4: ภูมิศาสตร์ อาคารสถานที่ และจุดเช็กอินในรั้ว มฟล.
    {
      id: "mfu-13",
      kind: "quiz",
      promptEn: "Which large hall (capacity 1,100+ with a 2nd-floor canteen) is officially named 'Pol. Gen. Pow Sarasin Building'?",
      promptTh: "อาคารเรียนรวมขนาดใหญ่ที่รองรับผู้เข้าร่วมกิจกรรมได้กว่า 1,100 คน มีศูนย์อาหารชั้น 2 และชื่อว่า “อาคารพลตำรวจเอก เภา สารสิน” คืออาคารใด?",
      optionsEn: ["Building C5", "Building C1", "Building D1", "Building S4"],
      optionsTh: ["อาคาร C5", "อาคาร C1", "อาคาร D1", "อาคาร S4"],
      correctIndex: 0,
      explainEn: "Building C5 (Pol. Gen. Pow Sarasin Building) holds 1,100+ people and houses a mid-size food court on level 2.",
      explainTh: "อาคาร C5 (อาคารพลตำรวจเอก เภา สารสิน) จุคนได้กว่า 1,100 คนและมีศูนย์อาหารชั้น 2"
    },
    {
      id: "mfu-14",
      kind: "quiz",
      promptEn: "What is special about Lab Building S4, and what is the famous steep hill students joke about climbing from dorms to class?",
      promptTh: "อาคารปฏิบัติการ S4 มีรูปทรงคล้ายสัญลักษณ์ใด และทางเดินลาดชันในตำนานจากโซนหอพักขึ้นตึกเรียนถูกเรียกว่าอะไร?",
      optionsEn: [
        "Greater-than symbol ('>') · 'Hell Hill / Test-of-Heart Hill' (เนินนรก / เนินวัดใจ)",
        "Crescent 'C' · 'Lan Tao' (ลานเต่า)",
        "Square Pavilion · 'Lan Dao' (ลานดาว)",
        "Hexagon · 'Doi Ngaem' (ดอยแง่ม)"
      ],
      optionsTh: [
        "รูปทรงเครื่องหมายมากกว่า (>) · “เนินนรก” (หรือเนินวัดใจ)",
        "รูปทรงตัว C · “ลานเต่า”",
        "ทรงแปดเหลี่ยม · “ลานดาว”",
        "ทรงวงรี · “ดอยแง่ม”"
      ],
      correctIndex: 0,
      explainEn: "S4 (Food Technology) is shaped like '>' while students call the steep dorm-to-class climb 'Noen Narok' (Hell Hill).",
      explainTh: "อาคาร S4 มีรูปทรงเหมือนเครื่องหมายมากกว่า (>) ส่วนทางเดินขึ้นตึกเรียนชันๆ เรียกว่า “เนินนรก / เนินวัดใจ”"
    },
    {
      id: "mfu-15",
      kind: "matching",
      promptEn: "Pair Match · Match MFU Campus Buildings & Check-In Spots",
      promptTh: "จับคู่ · อาคารสถานที่และจุดเช็กอินใน มฟล.",
      pairsEn: [
        { left: "Building C1 & Lan Dao", right: "C-shaped hall encircling semi-circular plaza" },
        { left: "Building D1", right: "Popular canteen near dorm hill + minimart/ATMs" },
        { left: "Dormitory F3 Front", right: "'Lan Tao' scenic hangout viewpoint" },
        { left: "M-Square Zone", right: "Modern E-Park left of gate + ME study spaces" }
      ],
      pairsTh: [
        { left: "อาคาร C1 และลานดาว", right: "อาคารทรงตัว C โอบล้อมลานกว้างรูปครึ่งวงกลม" },
        { left: "อาคาร D1", right: "ศูนย์อาหารหลักโซนทางขึ้นเนินหอพัก" },
        { left: "หน้าหอพัก F3", right: "จุดชมวิวนั่งเล่นชื่อดัง “ลานเต่า”" },
        { left: "กลุ่มอาคาร M-Square", right: "โซน E-Park ทางซ้ายมือเข้าประตู มีอาคาร ME" }
      ],
      explainEn: "Every MFU landmark has a distinct campus role—especially D1 for food and Lan Tao by F3!",
      explainTh: "C1 โอบลานดาว, D1 คือศูนย์อาหารโซนหอ, หน้า F3 คือลานเต่า และ M-Square อยู่โซน E-Park"
    },
    {
      id: "mfu-16",
      kind: "binary-stamp",
      promptEn: "Buildings S1 and S2 at MFU are indoor Olympic-size swimming pools.",
      promptTh: "อาคาร S1 และ S2 ของ มฟล. คือสระว่ายน้ำขนาดโอลิมปิกในร่ม",
      leftEn: "TRUE MFU FACT",
      leftTh: "ข้อมูลจริง มฟล.",
      rightEn: "MYTH / WRONG",
      rightTh: "ข้อมูลผิด / ไม่ใช่",
      stampAnswer: "right",
      explainEn: "S1 is Computer Lab & S2 is Tissue Culture — NOT a swimming pool!",
      explainTh: "ไม่จริง! อาคาร S1 คือห้องปฏิบัติการคอมพิวเตอร์ และ S2 คือเพาะเลี้ยงเนื้อเยื่อ ไม่ใช่สระว่ายน้ำ"
    },
    {
      id: "mfu-23",
      kind: "binary-stamp",
      promptEn: "Academic units at MFU are officially called 'Schools' (สำนักวิชา) rather than 'Faculties' (คณะ).",
      promptTh: "หน่วยงานวิชาการของ มฟล. ทั้ง 15 แห่งเรียกว่า “สำนักวิชา” (School) ไม่ได้เรียกว่า “คณะ” (Faculty)",
      leftEn: "TRUE MFU FACT",
      leftTh: "ข้อมูลจริง มฟล.",
      rightEn: "MYTH / WRONG",
      rightTh: "ข้อมูลผิด / ไม่ใช่",
      stampAnswer: "left",
      explainEn: "Correct! MFU uniquely organizes all 15 academic units as Schools (สำนักวิชา).",
      explainTh: "ถูกต้อง! เอกลักษณ์ของ มฟล. คือใช้คำว่า “สำนักวิชา” ทั้ง 15 สำนัก"
    },
    {
      id: "mfu-17",
      kind: "sorting",
      promptEn: "Category Sort · Dormitories vs. Academic Lab Buildings",
      promptTh: "คัดแยกหมวดหมู่ · หอพักนักศึกษา vs กลุ่มอาคารปฏิบัติการ/เรียน",
      bucketsEn: ["Student Dormitories & Hangouts", "Academic & Lab Buildings"],
      bucketsTh: ["หอพัก & จุดนั่งเล่น", "อาคารเรียน & ห้องปฏิบัติการ"],
      itemsEn: [
        { text: "Lamduan 1–7", bucketIdx: 0 },
        { text: "Building S1 (Computer Lab)", bucketIdx: 1 },
        { text: "F1–F6 & Lan Tao", bucketIdx: 0 },
        { text: "Building S3 (Engineering / Cosmetics)", bucketIdx: 1 }
      ],
      itemsTh: [
        { text: "หอพักลำดวน 1–7", bucketIdx: 0 },
        { text: "อาคาร S1 (คอมพิวเตอร์)", bucketIdx: 1 },
        { text: "หอพัก F1–F6 และลานเต่า", bucketIdx: 0 },
        { text: "อาคาร S3 (วิศวกรรม/เครื่องสำอาง)", bucketIdx: 1 }
      ],
      explainEn: "Dorms split into Lamduan (1–7) and F (F1–F6), while S1–S7 are science/language/research buildings.",
      explainTh: "หอพักแบ่งเป็นหอลำดวน 1–7 และ F1–F6 ส่วน S1–S7 เป็นกลุ่มอาคารปฏิบัติการและเรียน"
    },
    // หมวด 5: ประเพณี กิจกรรม และวัฒนธรรม "ลูกแม่ฟ้าหลวง"
    {
      id: "mfu-18",
      kind: "quiz",
      promptEn: "Which mountain peak do seniors and freshmen hike together during MFU's annual 'Luk Mae Fah Khuen Doi' tradition?",
      promptTh: "ประเพณี “ลูกแม่ฟ้าขึ้นดอย” (รับน้องขึ้นดอย) รุ่นพี่และนักศึกษาใหม่ร่วมใจเดินขึ้นดอยชื่อใด?",
      optionsEn: ["Doi Ngaem (ดอยแง่ม)", "Doi Suthep (ดอยสุเทพ)", "Doi Inthanon (ดอยอินทนนท์)", "Phu Chi Fa (ภูชี้ฟ้า)"],
      optionsTh: ["ดอยแง่ม", "ดอยสุเทพ", "ดอยอินทนนท์", "ภูชี้ฟ้า"],
      correctIndex: 0,
      explainEn: "The cherished freshmen tradition is hiking together up 'Doi Ngaem' (ดอยแง่ม).",
      explainTh: "กิจกรรมรับน้องขึ้นดอยของ มฟล. คือการเดินขึ้น “ดอยแง่ม” เพื่อสักการะสิ่งศักดิ์สิทธิ์และสร้างความสามัคคี"
    },
    {
      id: "mfu-19",
      kind: "quiz",
      promptEn: "What important October ceremony honors Princess Srinagarindra's birthday on October 21?",
      promptTh: "งานประเพณีสำคัญช่วงเดือนตุลาคม (วันคล้ายวันพระราชสมภพสมเด็จย่า 21 ตุลาคม) เรียกว่างานอะไร?",
      optionsEn: [
        "Wai Sa Mae Fah Luang (งานไหว้สาแม่ฟ้าหลวง)",
        "Lamduan Games (กีฬาลำดวนเกมส์)",
        "EV Bus Rally",
        "Final Exam Week"
      ],
      optionsTh: [
        "งานไหว้สาแม่ฟ้าหลวง",
        "มหกรรมกีฬาลำดวนเกมส์",
        "วันแนะนำตัวสำนักวิชา",
        "พิธีเปิดลานดาว"
      ],
      correctIndex: 0,
      explainEn: "'Wai Sa Mae Fah Luang' on October 21 honors Somdet Ya's birthday with deep gratitude.",
      explainTh: "“งานไหว้สาแม่ฟ้าหลวง” จัดช่วง 21 ตุลาคม เพื่อน้อมรำลึกในพระมหากรุณาธิคุณของสมเด็จย่า"
    },
    {
      id: "mfu-20",
      kind: "quiz",
      promptEn: "How do students usually commute between dorms, academic buildings, and the front gate, and what pre-term English bootcamp do all freshmen join?",
      promptTh: "รถรับส่งหลักภายใน มฟล. และโครงการปรับพื้นฐานภาษาอังกฤษสำหรับนักศึกษาใหม่ทุกคนคือข้อใด?",
      optionsEn: [
        "EV Shuttle Bus & Intensive English (IE)",
        "Campus Monorail & Thai 101",
        "Cable Car & Golf Carts",
        "Subway Line B & TOEIC Camp"
      ],
      optionsTh: [
        "รถรับส่งไฟฟ้า (EV Shuttle Bus) และโครงการ Intensive English (IE)",
        "รถไฟฟ้าใต้ดิน และวิชาการเขียนไทย",
        "กระเช้าลอยฟ้า และค่ายคณิตศาสตร์",
        "เรือรับส่ง และค่ายว่ายน้ำ"
      ],
      correctIndex: 0,
      explainEn: "MFU operates clean EV Shuttle Buses across campus and requires all freshmen to complete Intensive English (IE).",
      explainTh: "ใน มฟล. ใช้รถรับส่งไฟฟ้า (EV Shuttle Bus) และนักศึกษาใหม่ทุกคนเข้าร่วมโครงการปรับพื้นฐานภาษาอังกฤษ (IE)"
    },
    {
      id: "mfu-21",
      kind: "true-false-sprint",
      promptEn: "Vihara Phra Chao Lan Thong houses MFU's Lanna-style principal Buddha image, while the Chinese Language & Culture Center houses the Confucius Institute.",
      promptTh: "วิหารพระเจ้าล้านทองเฉลิมพระเกียรติฯ ประดิษฐานพระพุทธรูปศิลปะล้านนาประจำ มฟล. และศูนย์ภาษาฯ จีนสิรินธรเป็นที่ตั้งสถาบันขงจื่อ",
      isTrue: true,
      explainEn: "Both landmarks sit gracefully within MFU's garden campus.",
      explainTh: "ถูกต้อง! ทั้งวิหารพระเจ้าล้านทองฯ และศูนย์ภาษาและวัฒนธรรมจีนสิรินธรเป็นแลนด์มาร์กสำคัญของ มฟล."
    },
    {
      id: "mfu-22",
      kind: "order-steps",
      promptEn: "Step Sequence · Typical MFU Freshman Journey in Year 1",
      promptTh: "เรียงลำดับขั้นตอน · เส้นทางชีวิต “ลูกแม่ฟ้าหลวง” ปี 1",
      stepsEn: [
        "Join Intensive English (IE) prep before regular classes start",
        "Take the Oath Ceremony becoming a 'Luk Mae Fah Luang'",
        "Hike Doi Ngaem together in 'Luk Mae Fah Khuen Doi'",
        "Cheer your School in October's Wai Sa & Lamduan Games"
      ],
      stepsTh: [
        "เข้าร่วมปรับพื้นฐานภาษาอังกฤษ Intensive English (IE)",
        "เข้าร่วมพิธีถวายตัวเป็นลูกแม่ฟ้าหลวง",
        "ร่วมใจเดินขึ้น “ดอยแง่ม” ในประเพณีรับน้องขึ้นดอย",
        "ร่วมงานไหว้สาแม่ฟ้าหลวง 21 ต.ค. และกีฬาลำดวนเกมส์"
      ],
      explainEn: "From IE prep to Oath Ceremony, Doi Ngaem hike, and October traditions!",
      explainTh: "เริ่มต้นจาก IE → ถวายตัวเป็นลูกแม่ฟ้าหลวง → ขึ้นดอยแง่ม → ไหว้สา & ลำดวนเกมส์"
    }
  ];

  const shuffleArr = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  };

  const localizeItem = (spec: BiItemSpec): PartyItem => {
    const th = LearningHausI18n.isThai();
    if (spec.kind === "quiz") {
      const rawOpts = th ? [...spec.optionsTh] : [...spec.optionsEn];
      const tagged = rawOpts.map((text, idx) => ({ text, ok: idx === spec.correctIndex }));
      const mixed = shuffleArr(tagged);
      const nextCorrect = mixed.findIndex((o) => o.ok);
      return {
        id: spec.id,
        kind: "quiz",
        prompt: th ? spec.promptTh : spec.promptEn,
        options: mixed.map((o) => o.text),
        correctIndex: nextCorrect >= 0 ? nextCorrect : 0,
        explanation: th ? spec.explainTh : spec.explainEn,
        timeLimitSeconds: 15
      };
    }
    if (spec.kind === "true-false-sprint") {
      return {
        id: spec.id,
        kind: "true-false-sprint",
        prompt: th ? spec.promptTh : spec.promptEn,
        isTrue: spec.isTrue,
        explanation: th ? spec.explainTh : spec.explainEn,
        timeLimitSeconds: 15
      };
    }
    if (spec.kind === "matching") {
      return {
        id: spec.id,
        kind: "matching",
        prompt: th ? spec.promptTh : spec.promptEn,
        pairs: th ? spec.pairsTh.map((p) => ({ ...p })) : spec.pairsEn.map((p) => ({ ...p })),
        explanation: th ? spec.explainTh : spec.explainEn,
        timeLimitSeconds: 30
      };
    }
    if (spec.kind === "binary-stamp") {
      return {
        id: spec.id,
        kind: "binary-stamp",
        prompt: th ? spec.promptTh : spec.promptEn,
        leftLabel: th ? spec.leftTh : spec.leftEn,
        rightLabel: th ? spec.rightTh : spec.rightEn,
        stampAnswer: spec.stampAnswer,
        explanation: th ? spec.explainTh : spec.explainEn,
        timeLimitSeconds: 20
      };
    }
    if (spec.kind === "sorting") {
      return {
        id: spec.id,
        kind: "sorting",
        prompt: th ? spec.promptTh : spec.promptEn,
        buckets: th ? [...spec.bucketsTh] : [...spec.bucketsEn],
        sortItems: th ? spec.itemsTh.map((i) => ({ ...i })) : spec.itemsEn.map((i) => ({ ...i })),
        explanation: th ? spec.explainTh : spec.explainEn,
        timeLimitSeconds: 30
      };
    }
    return {
      id: spec.id,
      kind: "order-steps",
      prompt: th ? spec.promptTh : spec.promptEn,
      steps: th ? [...spec.stepsTh] : [...spec.stepsEn],
      explanation: th ? spec.explainTh : spec.explainEn,
      timeLimitSeconds: 30
    };
  };

  export const pickMfuTriviaQuestions = (count = 8, quizOnly = false): PartyItem[] => {
    const safeCount = Math.max(1, Math.min(20, count));
    const filtered = quizOnly ? MFU_BANK.filter((i) => i.kind === "quiz") : [...MFU_BANK];
    const shuffled = shuffleArr(filtered);
    const out = shuffled.slice(0, safeCount).map(localizeItem);
    if (out.length < safeCount) {
      const extraPool = shuffleArr(MFU_BANK.filter((i) => !filtered.includes(i)));
      for (const spec of extraPool) {
        if (out.length >= safeCount) break;
        out.push(localizeItem(spec));
      }
    }
    return out;
  };
}
