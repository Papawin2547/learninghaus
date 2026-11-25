// ค่าที่ปรับได้ของ Quiz และ Level: แก้ตัวเลขในไฟล์นี้แล้วรัน `pnpm build` เพื่ออัปเดตหน้าเว็บ
namespace LearningHausRules {
  export const quiz = {
    // จำนวนคำถามต่อหนึ่งด่าน: ชุดคำถามแต่ละ Chapter มี 10 ข้อ (ถ้าเพิ่มเกิน 10 ต้องเพิ่มคำถามใน questions.ts ด้วย)
    questionsPerStage: 10,
    // เวลาตอบต่อข้อ (วินาที): ลดเหลือ 15 วินาทีตามจังหวะเล่นแบบเร็ว
    secondsPerQuestion: 15,
    // XP ต่ำสุดเมื่อทำด่านใหม่จบครั้งแรก: คะแนนดีจะได้เพิ่มตามสูตรใน progression.ts
    minimumStageXp: 80,
    // XP สูงสุดของด่านใหม่: จำกัดเพดานเพื่อไม่ให้ความเร็วสำคัญกว่าความเข้าใจ
    maximumStageXp: 120,
    // จำนวน Chapter และจำนวนด่านต่อ Chapter ผูกกับแผนที่ Quiz และชุดคำถาม: เปลี่ยนสองค่านี้ต้องปรับแผนที่/เนื้อหาด้วย
    chapterCount: 8,
    stagesPerChapter: 10
  } as const;

  export const level = {
    // XP ขั้นต้นที่ต้องสะสมเพื่อเลื่อนจาก Level 1 เป็น Level 2
    baseXpPerLevel: 100,
    // ทุก Level ถัดไปต้องใช้ XP เพิ่มขึ้นเท่านี้
    xpGrowthPerLevel: 20,
    // XP เริ่มต้นของบัญชีตัวอย่างในหน้า Profile
    initialExp: 60
  } as const;
}
