# LearningHaus: คะแนน, Level, Leaderboard และ Achievement

## กติกาหลัก

คะแนนของแต่ละด่านเต็ม 1,000 คะแนน คิดจากความถูกต้อง 70%, ความเร็ว 20% และโบนัสตอบถูกทุกข้อ 10% ความเร็วจะคูณกับความถูกต้อง เพื่อไม่ให้ตอบเร็วแต่ผิดได้คะแนนสูงกว่าคนที่เข้าใจบทเรียน

```text
accuracy = correctAnswers / totalQuestions
speed = 1 - elapsedSeconds / timeLimitSeconds
stageScore = accuracy × 700 + accuracy × speed × 200 + perfectBonus
perfectBonus = 100 เมื่อถูกทุกข้อ มิฉะนั้น 0
```

XP ที่ได้เมื่อจบด่านครั้งแรกอยู่ระหว่าง 80–120 ตาม `stageScore` การเล่นซ้ำไม่แจก XP ซ้ำ แต่ถ้าคะแนนดีที่สุดเพิ่ม ระบบเก็บคะแนนใหม่ไว้สำหรับ Leaderboard และ Achievement ความพยายาม

Level ใช้ XP รวมและเพิ่มความยากทีละน้อย:

```text
XP ที่ต้องใช้จาก Level n ไป Level n+1 = 100 + 20 × (n − 1)
```

หน้า Leaderboards เลือกได้เฉพาะด่านที่มีข้อมูลคะแนน แล้วเรียงตาม `stageScore` จากสูงไปต่ำ หากคะแนนเท่ากันให้ใช้จำนวนข้อถูกมากกว่า และถ้ายังเท่ากันใช้เวลาน้อยกว่าเป็นตัวตัดสิน ผู้เล่นที่ยังไม่มีคะแนนด่านนั้นจะไม่ถูกแสดงในรายการด่านนั้น

## ชนิดด่านที่แนะนำ

ใน Chapter เดียวควรสลับรูปแบบเพื่อวัดทักษะหลายแบบ โดยยังแปลงผลลัพธ์เป็นคะแนนมาตรฐาน 0–1,000 เดียวกัน:

1. **Quick Check** — คำถามเลือกตอบ ตรวจความเข้าใจหลัก
2. **Link the Rule** — โยงเส้นจับคู่คำศัพท์กับกฎที่ถูกต้อง คิดจากคู่ที่ถูก จำนวนการลากผิด และเวลา
3. **Sort the Risk** — ลากจัดกลุ่มความเสี่ยง คิดจากตำแหน่งที่ถูกและจำนวนครั้งแก้
4. **Case Decision** — สถานการณ์จำลอง ให้เลือกการตัดสินใจและเหตุผล
5. **Spot the Risk** — ค้นหาจุดเสี่ยงในตัวอย่าง AI คิดจากจุดที่พบถูกและการกดหลอก

การหมุนเวียน 10 ด่านที่ใช้ได้ทันทีคือ `Quiz → Matching → Quiz → Sorting → Scenario → Quiz → Risk Review → Matching → Scenario → Quiz` รายละเอียดชนิดด่านอยู่ใน `src/content/stage-catalog.ts`

## ลำดับ Achievement สำหรับสร้างภาพ

แนะนำให้สร้างภาพตามลำดับนี้ เพื่อให้ผู้เรียนเห็นความคืบหน้าจากพื้นฐานไปสู่ความชำนาญ:

1. **Beginner** — จบด่านแรก
2. **Law Foundations** — จบ Chapter 1
3. **Safe Boundaries** — จบ Chapter 2
4. **Risk Analyst** — จบ Chapter 3
5. **Transparent Thinker** — จบ Chapter 4
6. **Purpose Keeper** — จบ Chapter 5
7. **Innovation Guide** — จบ Chapter 6
8. **Governance Watch** — จบ Chapter 7
9. **Rights Guardian** — จบ Chapter 8
10. **Expert** — จบ Chapter 1–4 และได้อย่างน้อย 7/10 ในด่านสุดท้ายของแต่ละ Chapter
11. **Master** — จบครบ 8 Chapter และได้อย่างน้อย 8/10 ในด่านสุดท้ายของทุก Chapter
12. **Fast Thinker** — ทำคะแนนความเร็วระดับสูง 5 ด่าน โดยยังถูกอย่างน้อย 8/10
13. **Comeback Learner** — เพิ่มคะแนนดีที่สุดอย่างน้อย 3 ข้อใน 3 ด่านจากการกลับมาฝึกซ้ำ

รายการนี้พร้อมคำบรรยายสำหรับใช้เป็น prompt อยู่ใน `src/content/achievement-catalog.ts` ส่วนหน้า Achievement เดิมยังแสดง Beginner, Expert และ Master เพื่อไม่เปลี่ยน layout ที่ทำไว้แล้วจนกว่าจะมีภาพชุดใหม่ครบ
