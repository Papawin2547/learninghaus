// Harry Potter Wizarding World Die-Hard Fan Trivia Bank (6 Sections: Characters, Houses, Wands & Patronus, Spells/Potions/Marauders, Horcruxes & Hallows, Quidditch & Creatures) — Bilingual TH + EN
namespace LearningHausHpTrivia {
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

  const HP_BANK: readonly BiItemSpec[] = [
    // ── Section 1: Books & Core Characters ──
    {
      id: "hp-q1",
      kind: "quiz",
      promptEn: "When was the first Harry Potter book published in the UK, and how many main books are in the series?",
      promptTh: "หนังสือ แฮร์รี่ พอตเตอร์ กับศิลาอาถรรพ์ ตีพิมพ์ในสหราชอาณาจักรเมื่อใด และมีภาคหลักกี่เล่ม?",
      optionsEn: ["26 June 1997 · 7 books", "31 July 1997 · 8 books", "1 September 1996 · 7 books", "26 June 1998 · 6 books"],
      optionsTh: ["26 มิถุนายน ค.ศ. 1997 · 7 เล่ม", "31 กรกฎาคม ค.ศ. 1997 · 8 เล่ม", "1 กันยายน ค.ศ. 1996 · 7 เล่ม", "26 มิถุนายน ค.ศ. 1998 · 6 เล่ม"],
      correctIndex: 0,
      explainEn: "J. K. Rowling published Philosopher's Stone on 26 June 1997; the main series has 7 books (8 films).",
      explainTh: "เจ. เค. โรว์ลิง ตีพิมพ์เล่มแรกเมื่อ 26 มิถุนายน ค.ศ. 1997 มีหนังสือภาคหลัก 7 เล่ม (ภาพยนตร์ 8 ภาค)"
    },
    {
      id: "hp-q2",
      kind: "quiz",
      promptEn: "What is Harry Potter's birthday (which he shares with J. K. Rowling) and who is his godfather?",
      promptTh: "แฮร์รี่ พอตเตอร์ เกิดวันที่เท่าใด (วันเดียวกับ เจ. เค. โรว์ลิง) และใครคือพ่อทูนหัวของเขา?",
      optionsEn: ["31 July 1980 · Sirius Black", "1 March 1980 · Remus Lupin", "19 September 1979 · Albus Dumbledore", "31 October 1980 · Rubeus Hagrid"],
      optionsTh: ["31 กรกฎาคม ค.ศ. 1980 · ซิเรียส แบล็ก", "1 มีนาคม ค.ศ. 1980 · รีมัส ลูปิน", "19 กันยายน ค.ศ. 1979 · อัลบัส ดัมเบิลดอร์", "31 ตุลาคม ค.ศ. 1980 · รูเบอัส แฮกริด"],
      correctIndex: 0,
      explainEn: "Harry James Potter was born on 31 July 1980, and his godfather is Sirius Black.",
      explainTh: "แฮร์รี่ เจมส์ พอตเตอร์ เกิดวันที่ 31 กรกฎาคม ค.ศ. 1980 และมีพ่อทูนหัวคือ ซิเรียส แบล็ก"
    },
    {
      id: "hp-q3",
      kind: "quiz",
      promptEn: "What profession do Hermione Granger's Muggle parents have, and what is her cat's name?",
      promptTh: "พ่อและแม่มักเกิ้ลของเฮอร์ไมโอนี่ เกรนเจอร์ ประกอบอาชีพใด และแมวของเธอชื่ออะไร?",
      optionsEn: ["Dentists · Crookshanks", "Doctors · Scabbers", "Lawyers · Mrs. Norris", "Pharmacists · Hedwig"],
      optionsTh: ["ทันตแพทย์ · ครุกแชงก์ส", "แพทย์ · สแคบเบอร์ส", "ทนายความ · คุณนายนอร์ริส", "เภสัชกร · เฮ็ดวิก"],
      correctIndex: 0,
      explainEn: "Hermione's parents are Muggle dentists, and her half-Kneazle cat is named Crookshanks.",
      explainTh: "พ่อแม่ของเฮอร์ไมโอนี่เป็นทันตแพทย์ และเธอมีแมวลูกผสมเนียเซิลชื่อ 'ครุกแชงก์ส'"
    },
    {
      id: "hp-q4",
      kind: "quiz",
      promptEn: "Where does Severus Snape's nickname 'The Half-Blood Prince' come from?",
      promptTh: "ฉายา 'เจ้าชายเลือดผสม' (Half-Blood Prince) ของเซเวอรัส สเนป มีที่มาจากอะไร?",
      optionsEn: [
        "His mother's maiden name Eileen Prince & Muggle father Tobias Snape",
        "He was a royal descendant of Godric Gryffindor",
        "A title given by Voldemort to top Death Eaters",
        "The name of a famous Potions textbook author"
      ],
      optionsTh: [
        "นามสกุลเดิมของแม่ (ไอลีน พรินซ์) และพ่อที่เป็นมักเกิ้ล (โทไบอัส สเนป)",
        "เป็นทายาทสายตรงของก็อดดริก กริฟฟินดอร์",
        "ตำแหน่งที่โวลเดอมอร์แต่งตั้งให้ผู้เสพความตาย",
        "ชื่อของผู้แต่งตำราวิชาปรุงยาขั้นสูง"
      ],
      correctIndex: 0,
      explainEn: "Snape's mother was Eileen Prince (a witch) and his father was Tobias Snape (a Muggle).",
      explainTh: "มาจากนามสกุลเดิมของแม่คือ ไอลีน พรินซ์ (Eileen Prince) และพ่อมักเกิ้ล โทไบอัส สเนป"
    },
    {
      id: "hp-q5",
      kind: "quiz",
      promptEn: "What is Albus Dumbledore's favorite sweet, and what are the names of his younger brother and sister?",
      promptTh: "อัลบัส ดัมเบิลดอร์ ชอบลูกอมรสใด และน้องชายกับน้องสาวของเขาชื่ออะไร?",
      optionsEn: [
        "Sherbet Lemon · Aberforth & Ariana",
        "Chocolate Frogs · Percival & Wulfric",
        "Bertie Bott's Beans · Brian & Kendra",
        "Acid Pops · Aberforth & Bathilda"
      ],
      optionsTh: [
        "เชอร์เบตมะนาว · อาเบอร์ฟอร์ธ และ แอรีอานนา",
        "กบช็อกโกแลต · เพอร์ซิวาล และ วูลฟริก",
        "เยลลี่เม็ดทุกรส · ไบรอัน และ เคนดรา",
        "ลูกอมเปรี้ยว · อาเบอร์ฟอร์ธ และ บาธิลดา"
      ],
      correctIndex: 0,
      explainEn: "Dumbledore loves Sherbet Lemons and has two younger siblings: Aberforth and Ariana.",
      explainTh: "ดัมเบิลดอร์ชอบลูกอมรสเชอร์เบตมะนาว มีน้องชายชื่อ อาเบอร์ฟอร์ธ และน้องสาวชื่อ แอรีอานนา"
    },

    // ── Section 2: Hogwarts & Houses ──
    {
      id: "hp-q6",
      kind: "quiz",
      promptEn: "What does Hogwarts' Latin motto 'Draco Dormiens Nunquam Titillandus' mean?",
      promptTh: "คำขวัญภาษาละตินของฮอกวอตส์ 'Draco Dormiens Nunquam Titillandus' แปลว่าอะไร?",
      optionsEn: [
        "Never tickle a sleeping dragon",
        "Magic conquers all darkness",
        "Wisdom guides the brave heart",
        "Enter with courage and truth"
      ],
      optionsTh: [
        "อย่าแหย่มังกรหลับ",
        "เวทมนตร์พิชิตความมืดทั้งปวง",
        "ปัญญานำทางหัวใจผู้กล้า",
        "จงก้าวเข้าสู่ความจริงและความกล้า"
      ],
      correctIndex: 0,
      explainEn: "Hogwarts' motto translates to 'Never tickle a sleeping dragon'.",
      explainTh: "คำขวัญประจำโรงเรียนฮอกวอตส์แปลว่า 'อย่าแหย่มังกรหลับ'"
    },
    {
      id: "hp-q7",
      kind: "quiz",
      promptEn: "How do Hufflepuff students open the entrance to their common room?",
      promptTh: "นักเรียนบ้านฮัฟเฟิลพัฟต้องทำอย่างไรเพื่อเปิดทางเข้าหอนอนประจำบ้าน?",
      optionsEn: [
        "Tap barrel #2 in the middle row to the rhythm of 'Helga Hufflepuff'",
        "Answer a riddle asked by a bronze eagle knocker",
        "Give a password to the Fat Lady portrait",
        "Speak a password to a damp stone wall in the dungeons"
      ],
      optionsTh: [
        "เคาะถังใบที่ 2 แถวกลางตามจังหวะชื่อ 'เฮลก้า ฮัฟเฟิลพัฟ'",
        "ตอบปริศนาเชาวน์จากที่เคาะประตูรูปนกอินทรีสัมฤทธิ์",
        "บอกรหัสผ่านกับภาพเหมือนสุภาพสตรีอ้วน",
        "พูดรหัสผ่านหน้ากำแพงหินชื้นในคุกใต้ดิน"
      ],
      correctIndex: 0,
      explainEn: "Tap barrel 2 from the bottom, middle of the second row, in the rhythm of 'Hel-ga Huf-fle-puff'.",
      explainTh: "ต้องเคาะถังใบที่ 2 แถวกลางตามจังหวะชื่อ 'เฮลก้า ฮัฟเฟิลพัฟ'"
    },
    {
      id: "hp-q8",
      kind: "quiz",
      promptEn: "In the original books, what are Ravenclaw's house colors and animal emblem?",
      promptTh: "ในหนังสือต้นฉบับ สีประจำบ้านและสัตว์ประจำบ้านเรเวนคลอ (Ravenclaw) คืออะไร?",
      optionsEn: ["Blue & Bronze · Eagle", "Blue & Silver · Raven", "Green & Silver · Serpent", "Yellow & Black · Badger"],
      optionsTh: ["สีน้ำเงิน - ทองแดง · นกอินทรี", "สีน้ำเงิน - เงิน · อีกา", "สีเขียว - เงิน · งู", "สีเหลือง - ดำ · ตัวแบดเจอร์"],
      correctIndex: 0,
      explainEn: "In the books, Ravenclaw's colors are blue and bronze, and its symbol is an eagle (not a raven).",
      explainTh: "ในหนังสือ บ้านเรเวนคลอใช้สีน้ำเงิน-ทองแดง และมีสัตว์ประจำบ้านคือ 'นกอินทรี'"
    },

    // ── Section 3: Wands & Patronus ──
    {
      id: "hp-q9",
      kind: "quiz",
      promptEn: "What wood, core, and length make up Harry Potter's wand?",
      promptTh: "ไม้กายสิทธิ์ของแฮร์รี่ พอตเตอร์ ทำจากไม้อะไร แกนกลางใด และยาวกี่นิ้ว?",
      optionsEn: [
        "Holly · Phoenix tail feather (Fawkes) · 11 inches",
        "Yew · Phoenix tail feather · 13.5 inches",
        "Vine · Dragon heartstring · 10.75 inches",
        "Elder · Thestral tail hair · 15 inches"
      ],
      optionsTh: [
        "ไม้ฮอลลี่ · แกนขนหางนกฟีนิกซ์ (ของฟอกส์) · ยาว 11 นิ้ว",
        "ไม้ยิว · แกนขนหางนกฟีนิกซ์ · ยาว 13.5 นิ้ว",
        "ไม้เถาองุ่น · แกนเอ็นหัวใจมังกร · ยาว 10.75 นิ้ว",
        "ไม้เอลเดอร์ · แกนขนหางเธสตรอล · ยาว 15 นิ้ว"
      ],
      correctIndex: 0,
      explainEn: "Harry's wand is 11-inch Holly with a phoenix tail feather from Fawkes — twin core to Voldemort's 13.5-inch Yew wand.",
      explainTh: "ไม้ของแฮร์รี่คือไม้ฮอลลี่ แกนขนหางนกฟีนิกซ์ของฟอกส์ ยาว 11 นิ้ว (เป็นไม้แฝดกับไม้ยิวยาว 13.5 นิ้วของโวลเดอมอร์)"
    },
    {
      id: "hp-q10",
      kind: "quiz",
      promptEn: "What core is inside the legendary 15-inch Elder Wand?",
      promptTh: "ไม้กายสิทธิ์เอลเดอร์ (Elder Wand) ยาว 15 นิ้ว มีแกนกลางทำมาจากอะไร?",
      optionsEn: ["Thestral tail hair", "Phoenix tail feather", "Dragon heartstring", "Unicorn tail hair"],
      optionsTh: ["ขนหางเธสตรอล", "ขนหางนกฟีนิกซ์", "เอ็นหัวใจมังกร", "ขนหางยูนิคอร์น"],
      correctIndex: 0,
      explainEn: "The Elder Wand is 15 inches of elder wood containing a Thestral tail hair core.",
      explainTh: "ไม้เอลเดอร์ยาว 15 นิ้ว มีแกนกลางเป็น 'ขนหางเธสตรอล' (Thestral tail hair)"
    },
    {
      id: "hp-q11",
      kind: "quiz",
      promptEn: "What forms do Hermione Granger's and Severus Snape's Patronuses take?",
      promptTh: "ผู้พิทักษ์ (Patronus) ของเฮอร์ไมโอนี่ เกรนเจอร์ และเซเวอรัส สเนป เป็นรูปสัตว์ใดตามลำดับ?",
      optionsEn: ["Otter · Doe", "Jack Russell Terrier · Stag", "Phoenix · Wolf", "Cat · Raven"],
      optionsTh: ["ตัวนาก · กวางตัวเมีย", "สุนัขแจ็กรัสเซลล์ · กวางตัวผู้", "นกฟีนิกซ์ · หมาป่า", "แมว · อีกา"],
      correctIndex: 0,
      explainEn: "Hermione's Patronus is an Otter, while Snape's is a Doe (matching Lily Potter's).",
      explainTh: "ผู้พิทักษ์ของเฮอร์ไมโอนี่คือ 'ตัวนาก' (Otter) และของสเนปคือ 'กวางตัวเมีย' (Doe - เหมือนลิลี่)"
    },

    // ── Section 4: Spells, Potions, Codes & Marauders ──
    {
      id: "hp-q12",
      kind: "quiz",
      promptEn: "What telephone keypad code opens the visitor's entrance to the Ministry of Magic?",
      promptTh: "รหัสโทรศัพท์สำหรับเข้ากระทรวงเวทมนตร์คือหมายเลขใด?",
      optionsEn: ["62442 (M-A-G-I-C)", "71300 (V-A-U-L-T)", "93400 (H-O-G-W)", "68742 (W-I-Z-A-R)"],
      optionsTh: ["62442 (สะกดคำว่า M-A-G-I-C)", "71300 (ห้องนิรภัยศิลาอาถรรพ์)", "93400 (ชานชาลา)", "68742 (ห้องนิรภัยพอตเตอร์)"],
      correctIndex: 0,
      explainEn: "Dialing 62442 spells M-A-G-I-C on a telephone keypad to enter the Ministry of Magic.",
      explainTh: "รหัสเข้ากระทรวงเวทมนตร์คือ 62442 ซึ่งตรงกับการสะกดคำว่า M-A-G-I-C บนปุ่มกดโทรศัพท์"
    },
    {
      id: "hp-q13",
      kind: "quiz",
      promptEn: "Which potion gives liquid luck, and which potion forces the drinker to tell the truth?",
      promptTh: "น้ำยาใดที่มอบโชคดีให้ผู้ดื่ม และน้ำยาใดที่บังคับให้พูดความจริงตามลำดับ?",
      optionsEn: [
        "Felix Felicis · Veritaserum",
        "Amortentia · Polyjuice Potion",
        "Polyjuice Potion · Felix Felicis",
        "Veritaserum · Amortentia"
      ],
      optionsTh: [
        "น้ำยานำโชค (Felix Felicis) · สัจจะเซรุ่ม (Veritaserum)",
        "น้ำยาลุ่มหลง (Amortentia) · น้ำยาสรรพรส (Polyjuice)",
        "น้ำยาสรรพรส (Polyjuice) · น้ำยานำโชค (Felix Felicis)",
        "สัจจะเซรุ่ม (Veritaserum) · น้ำยาลุ่มหลง (Amortentia)"
      ],
      correctIndex: 0,
      explainEn: "Felix Felicis is molten-gold Liquid Luck, while Veritaserum is the truth serum.",
      explainTh: "Felix Felicis คือน้ำยานำโชคสีทองหลอมเหลว ส่วน Veritaserum (สัจจะเซรุ่ม) คือน้ำยาบังคับพูดความจริง"
    },
    {
      id: "hp-q14",
      kind: "quiz",
      promptEn: "Which Marauder nickname belongs to Sirius Black, and what is the phrase to close the Marauder's Map?",
      promptTh: "ฉายาในกลุ่มตัวกวนของซิเรียส แบล็ก คืออะไร และคำพูดสำหรับปิดแผนที่ตัวกวนคือข้อใด?",
      optionsEn: [
        "Padfoot · 'Mischief Managed'",
        "Moony · 'I solemnly swear that I am up to no good'",
        "Prongs · 'Mischief Managed'",
        "Wormtail · 'Nox'"
      ],
      optionsTh: [
        "เท้าปุย (Padfoot) · 'แผนลวงสำเร็จแล้ว'",
        "จันทร์เจ้า (Moony) · 'ข้าขอสาบานอย่างจริงจังว่าข้านั้นหาความดีไม่ได้'",
        "เขาแหลม (Prongs) · 'แผนลวงสำเร็จแล้ว'",
        "หางหนอน (Wormtail) · 'น็อกซ์'"
      ],
      correctIndex: 0,
      explainEn: "Sirius Black is Padfoot (black dog), and 'Mischief Managed' wipes the Marauder's Map blank.",
      explainTh: "ซิเรียส แบล็ก คือ 'เท้าปุย' (สุนัขดำ) และรหัสปิดแผนที่คือ 'แผนลวงสำเร็จแล้ว'"
    },

    // ── Section 5: Horcruxes & Deathly Hallows ──
    {
      id: "hp-q15",
      kind: "quiz",
      promptEn: "Who destroyed Voldemort's final Horcrux, Nagini, and with which weapon?",
      promptTh: "ใครคือผู้ทำลายงูนากินี (ฮอร์ครักซ์ชิ้นสุดท้าย) และใช้อาวุธใด?",
      optionsEn: [
        "Neville Longbottom · Sword of Gryffindor",
        "Ron Weasley · Basilisk fang",
        "Hermione Granger · Fiendfyre",
        "Harry Potter · Elder Wand"
      ],
      optionsTh: [
        "เนวิลล์ ลองบัตท่อม · ดาบแห่งกริฟฟินดอร์",
        "รอน วีสลีย์ · เขี้ยวบาซิลิสก์",
        "เฮอร์ไมโอนี่ เกรนเจอร์ · เพลิงปีศาจ",
        "แฮร์รี่ พอตเตอร์ · ไม้กายสิทธิ์เอลเดอร์"
      ],
      correctIndex: 0,
      explainEn: "Neville Longbottom pulled the Sword of Gryffindor from the Sorting Hat and slew Nagini in Book 7.",
      explainTh: "เนวิลล์ ลองบัตท่อม ดึงดาบแห่งกริฟฟินดอร์ออกมาจากหมวกคัดสรรและฟันงูนากินีในเล่ม 7"
    },

    // ── Section 6: Quidditch & Magical Creatures ──
    {
      id: "hp-q16",
      kind: "quiz",
      promptEn: "How many players are on a Quidditch team, and how many points is catching the Golden Snitch worth?",
      promptTh: "กีฬาควิดดิชมีผู้เล่นทีมละกี่คน และการจับลูกสนิชสีทองได้กี่คะแนน?",
      optionsEn: ["7 players · 150 points", "6 players · 100 points", "7 players · 100 points", "8 players · 150 points"],
      optionsTh: ["7 คน · 150 คะแนน", "6 คน · 100 คะแนน", "7 คน · 100 คะแนน", "8 คน · 150 คะแนน"],
      correctIndex: 0,
      explainEn: "Each team has 7 players (3 Chasers, 2 Beaters, 1 Keeper, 1 Seeker), and the Golden Snitch ends the match for 150 points.",
      explainTh: "มีผู้เล่นทีมละ 7 คน (เชสเซอร์ 3, บีตเตอร์ 2, คีปเปอร์ 1, ซีกเกอร์ 1) และการจับลูกสนิชสีทองได้ 150 คะแนนพร้อมจบเกม"
    },

    // ── True / False Sprint ──
    {
      id: "hp-tf1",
      kind: "true-false-sprint",
      promptEn: "Tom Marvolo Riddle is an anagram of 'I am Lord Voldemort'.",
      promptTh: "ชื่อเดิม 'Tom Marvolo Riddle' สามารถนำตัวอักษรมาสลับตำแหน่ง (Anagram) เป็นคำว่า 'I am Lord Voldemort' ได้พอดี",
      isTrue: true,
      explainEn: "True! Rearranging the letters of Tom Marvolo Riddle spells 'I am Lord Voldemort'.",
      explainTh: "จริง! ตัวอักษรใน Tom Marvolo Riddle สลับตำแหน่งเป็น 'I am Lord Voldemort' ได้พอดี"
    },
    {
      id: "hp-tf2",
      kind: "true-false-sprint",
      promptEn: "Lord Voldemort, Bellatrix Lestrange, and Draco Malfoy can all cast a corporeal Patronus.",
      promptTh: "ลอร์ดโวลเดอมอร์ เบลลาทริกซ์ เลสแตรงจ์ และเดรโก มัลฟอย สามารถเสกคาถาผู้พิทักษ์ (Patronus) ได้ทุกคน",
      isTrue: false,
      explainEn: "False! None of those three are able to cast a Patronus.",
      explainTh: "ผิด! ทั้งโวลเดอมอร์ เบลลาทริกซ์ และเดรโก มัลฟอย ต่างไม่สามารถเสกคาถาผู้พิทักษ์ได้"
    },
    {
      id: "hp-tf3",
      kind: "true-false-sprint",
      promptEn: "Only people who have witnessed death and understood its meaning can see Thestrals.",
      promptTh: "ม้ามีปีกโครงกระดูก 'เธสตรอล' (Thestral) มองเห็นได้เฉพาะผู้ที่เคยเห็นความตายและเข้าใจความหมายของมันเท่านั้น",
      isTrue: true,
      explainEn: "True! Thestrals remain invisible to anyone who has not witnessed and comprehended death.",
      explainTh: "จริง! เธสตรอลจะปรากฏให้เห็นเฉพาะผู้ที่เคยเห็นความตายและเข้าใจความหมายของมัน"
    },

    // ── Rapid Stamp (Binary Stamp) ──
    {
      id: "hp-stamp1",
      kind: "binary-stamp",
      promptEn: "Gringotts Vault 713 held the Philosopher's Stone (not the Potter family gold — that was Vault 687).",
      promptTh: "ห้องนิรภัยหมายเลข 713 ที่กริงกอตส์คือห้องเก็บศิลาอาถรรพ์ (ส่วนห้องของตระกูลพอตเตอร์คือ 687)",
      leftEn: "True Canon Fact",
      leftTh: "ข้อมูลจริงในเรื่อง",
      rightEn: "False / Myth",
      rightTh: "ข้อมูลผิด / ไม่ใช่",
      stampAnswer: "left",
      explainEn: "Vault 687 belongs to the Potters, while Vault 713 stored the Philosopher's Stone.",
      explainTh: "ถูกต้อง! ห้อง 687 เป็นของตระกูลพอตเตอร์ และห้อง 713 เก็บศิลาอาถรรพ์"
    },
    {
      id: "hp-stamp2",
      kind: "binary-stamp",
      promptEn: "Polyjuice Potion takes only 24 hours to brew.",
      promptTh: "น้ำยาสรรพรส (Polyjuice Potion) ใช้เวลาเคี่ยวเพียง 24 ชั่วโมงก็พร้อมดื่ม",
      leftEn: "True Canon Fact",
      leftTh: "ข้อมูลจริงในเรื่อง",
      rightEn: "False / Myth",
      rightTh: "ข้อมูลผิด / ไม่ใช่",
      stampAnswer: "right",
      explainEn: "False! Polyjuice Potion takes a full month to stew.",
      explainTh: "ผิด! น้ำยาสรรพรสต้องใช้เวลาเคี่ยวนานถึง 1 เดือนเต็ม"
    },
    {
      id: "hp-stamp3",
      kind: "binary-stamp",
      promptEn: "Ron Weasley is the 6th child of 7 siblings, and the Weasley home is called 'The Burrow'.",
      promptTh: "รอน วีสลีย์ เป็นลูกคนที่ 6 จากพี่น้อง 7 คน และบ้านของตระกูลวีสลีย์ชื่อว่า 'บ้านโพรงกระต่าย' (The Burrow)",
      leftEn: "True Canon Fact",
      leftTh: "ข้อมูลจริงในเรื่อง",
      rightEn: "False / Myth",
      rightTh: "ข้อมูลผิด / ไม่ใช่",
      stampAnswer: "left",
      explainEn: "Bill, Charlie, Percy, Fred, George, Ron (#6), and Ginny (#7) live at The Burrow.",
      explainTh: "จริง! พี่น้อง 7 คนคือ บิล, ชาลี, เพอร์ซี่, เฟร็ด, จอร์จ, รอน (คนที่ 6), จินนี่ อาศัยที่บ้านโพรงกระต่าย"
    },

    // ── Matching ──
    {
      id: "hp-match1",
      kind: "matching",
      promptEn: "Match each Hogwarts House with its resident Ghost",
      promptTh: "จับคู่บ้านฮอกวอตส์ทั้ง 4 กับผีประจำบ้านให้ถูกต้อง",
      pairsEn: [
        { left: "Gryffindor", right: "Nearly Headless Nick" },
        { left: "Hufflepuff", right: "Fat Friar" },
        { left: "Ravenclaw", right: "The Grey Lady" },
        { left: "Slytherin", right: "Bloody Baron" }
      ],
      pairsTh: [
        { left: "กริฟฟินดอร์", right: "นิคหัวเกือบขาด" },
        { left: "ฮัฟเฟิลพัฟ", right: "บาทหลวงอ้วน" },
        { left: "เรเวนคลอ", right: "สุภาพสตรีสีเทา (เฮเลน่า)" },
        { left: "สลิธีริน", right: "บารอนเลือด" }
      ],
      explainEn: "Nick (Gryffindor), Fat Friar (Hufflepuff), Grey Lady (Ravenclaw), and Bloody Baron (Slytherin).",
      explainTh: "กริฟฟินดอร์-นิคหัวเกือบขาด, ฮัฟเฟิลพัฟ-บาทหลวงอ้วน, เรเวนคลอ-สุภาพสตรีสีเทา, สลิธีริน-บารอนเลือด"
    },
    {
      id: "hp-match2",
      kind: "matching",
      promptEn: "Match each Spell with its magical effect",
      promptTh: "จับคู่คาถายอดนิยมกับผลของคาถาให้ถูกต้อง",
      pairsEn: [
        { left: "Expelliarmus", right: "Disarming charm" },
        { left: "Riddikulus", right: "Defeat a Boggart" },
        { left: "Alohomora", right: "Unlock doors" },
        { left: "Obliviate", right: "Erase memories" }
      ],
      pairsTh: [
        { left: "เอกซ์เปลล์ลิอาร์มัส", right: "ปลดอาวุธ" },
        { left: "ริดดิคูลัส", right: "ปราบบ็อกการ์ต" },
        { left: "อโลโฮโมร่า", right: "สะเดาะกลอน" },
        { left: "โอบลิวิอาเต้", right: "ลบความทรงจำ" }
      ],
      explainEn: "Expelliarmus disarms, Riddikulus repels Boggarts, Alohomora unlocks, and Obliviate erases memory.",
      explainTh: "เอกซ์เปลล์ลิอาร์มัส=ปลดอาวุธ, ริดดิคูลัส=ปราบบ็อกการ์ต, อโลโฮโมร่า=สะเดาะกลอน, โอบลิวิอาเต้=ลบความทรงจำ"
    },

    // ── Sorting ──
    {
      id: "hp-sort1",
      kind: "sorting",
      promptEn: "Sort each item into Unforgivable Curse vs. Everyday Utility Spell",
      promptTh: "แยกคาถาออกเป็น 'คำสาปโทษผิดสถานเดียว' กับ 'คาถาทั่วไป'",
      bucketsEn: ["Unforgivable Curse", "Utility / Defense Spell"],
      bucketsTh: ["คำสาปโทษผิดสถานเดียว", "คาถาทั่วไป / ป้องกันตัว"],
      itemsEn: [
        { text: "Imperio (Control)", bucketIdx: 0 },
        { text: "Crucio (Torture)", bucketIdx: 0 },
        { text: "Avada Kedavra (Killing)", bucketIdx: 0 },
        { text: "Wingardium Leviosa", bucketIdx: 1 },
        { text: "Expecto Patronum", bucketIdx: 1 }
      ],
      itemsTh: [
        { text: "อิมเปริโอ (สะกดใจ)", bucketIdx: 0 },
        { text: "ครูซิโอ (กรีดแทง)", bucketIdx: 0 },
        { text: "อะวาดา เคดาฟรา (พิฆาต)", bucketIdx: 0 },
        { text: "วิงการ์เดียม เลวีโอซ่า", bucketIdx: 1 },
        { text: "เอกซ์เปกโต พาโตรนุม", bucketIdx: 1 }
      ],
      explainEn: "The 3 Unforgivable Curses are Imperio, Crucio, and Avada Kedavra.",
      explainTh: "คำสาปโทษผิดสถานเดียวมี 3 บท คือ อิมเปริโอ, ครูซิโอ และอะวาดา เคดาฟรา"
    },
    {
      id: "hp-sort2",
      kind: "sorting",
      promptEn: "Sort each artifact into Deathly Hallows vs. Hogwarts Founder Horcruxes",
      promptTh: "แยกของวิเศษออกเป็น 'เครื่องรางยมทูต' กับ 'ฮอร์ครักซ์ของสี่ผู้ก่อตั้ง'",
      bucketsEn: ["Deathly Hallows", "Founder Horcrux"],
      bucketsTh: ["เครื่องรางยมทูต", "ฮอร์ครักซ์ของผู้ก่อตั้ง"],
      itemsEn: [
        { text: "Elder Wand", bucketIdx: 0 },
        { text: "Resurrection Stone", bucketIdx: 0 },
        { text: "Cloak of Invisibility", bucketIdx: 0 },
        { text: "Slytherin's Locket", bucketIdx: 1 },
        { text: "Hufflepuff's Cup", bucketIdx: 1 },
        { text: "Ravenclaw's Diadem", bucketIdx: 1 }
      ],
      itemsTh: [
        { text: "ไม้กายสิทธิ์เอลเดอร์", bucketIdx: 0 },
        { text: "หินชุบวิญญาณ", bucketIdx: 0 },
        { text: "ผ้าคลุมล่องหน", bucketIdx: 0 },
        { text: "ล็อกเกตของสลิธีริน", bucketIdx: 1 },
        { text: "ถ้วยของฮัฟเฟิลพัฟ", bucketIdx: 1 },
        { text: "รัดเกล้าของเรเวนคลอ", bucketIdx: 1 }
      ],
      explainEn: "The 3 Deathly Hallows are Elder Wand, Resurrection Stone, and Invisibility Cloak.",
      explainTh: "เครื่องรางยมทูต 3 ชิ้น ได้แก่ ไม้กายสิทธิ์เอลเดอร์ หินชุบวิญญาณ และผ้าคลุมล่องหน"
    },

    // ── Order Steps ──
    {
      id: "hp-order1",
      kind: "order-steps",
      promptEn: "Order these 4 Horcruxes by when they were destroyed (First -> Last)",
      promptTh: "เรียงลำดับการทำลายฮอร์ครักซ์ 4 ชิ้นนี้จากชิ้นแรกไปชิ้นสุดท้าย",
      stepsEn: [
        "Tom Riddle's Diary (Book 2 · Harry)",
        "Marvolo Gaunt's Ring (Book 6 · Dumbledore)",
        "Slytherin's Locket (Book 7 · Ron)",
        "Nagini the Snake (Book 7 · Neville)"
      ],
      stepsTh: [
        "สมุดบันทึกของทอม ริดเดิ้ล (เล่ม 2 · แฮร์รี่)",
        "แหวนของมาร์โวโล ก๊อนท์ (เล่ม 6 · ดัมเบิลดอร์)",
        "ล็อกเกตของซัลลาซาร์ สลิธีริน (เล่ม 7 · รอน)",
        "งูนากินี (เล่ม 7 · เนวิลล์)"
      ],
      explainEn: "Diary (Book 2) -> Ring (Book 6) -> Locket (Book 7, Forest of Dean) -> Nagini (Book 7, Battle of Hogwarts).",
      explainTh: "ลำดับคือ สมุดบันทึก (เล่ม 2) -> แหวนก๊อนท์ (เล่ม 6) -> ล็อกเกตสลิธีริน (เล่ม 7) -> งูนากินี (เล่ม 7 ชิ้นสุดท้าย)"
    }
  ];

  const shuffleArr = <T>(arr: readonly T[]): T[] => {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };

  const localizeItem = (spec: BiItemSpec): PartyItem => {
    const th = typeof LearningHausI18n !== "undefined" && LearningHausI18n.getLang() === "th";
    if (spec.kind === "quiz") {
      return {
        id: spec.id,
        kind: "quiz",
        prompt: th ? spec.promptTh : spec.promptEn,
        options: th ? [...spec.optionsTh] : [...spec.optionsEn],
        correctIndex: spec.correctIndex,
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

  export const pickHpTriviaQuestions = (count = 8, quizOnly = false): PartyItem[] => {
    const safeCount = Math.max(1, Math.min(20, count));
    const filtered = quizOnly ? HP_BANK.filter((i) => i.kind === "quiz") : [...HP_BANK];
    const shuffled = shuffleArr(filtered);
    const out = shuffled.slice(0, safeCount).map(localizeItem);
    if (out.length < safeCount) {
      const extraPool = shuffleArr(HP_BANK.filter((i) => !filtered.includes(i)));
      for (const spec of extraPool) {
        if (out.length >= safeCount) break;
        out.push(localizeItem(spec));
      }
    }
    return out;
  };
}
