// ส่วนนี้ทำหน้าที่: จับเวลา เอฟเฟกต์ตอบถูก/ผิด คะแนน และ XP (ข้อความคำถามอยู่ที่ src/content/questions.ts)
/* LearningHaus stage quiz. Questions are local demo content; Figma Q1/Q2 retain their exact wording and option order. */
(() => {
  type AnswerReviewRecord = {
    question: string;
    selectedAnswer: string | null;
    correctAnswer: string;
    explanation: string;
    isCorrect: boolean;
    answeredCorrectly: boolean;
    madeMistake: boolean;
    timedOut: boolean;
    removedChoices: string[];
  };

  const init = (): void => {
    const flow = document.getElementById("quiz-flow");
    if (!flow) return;
    const screens = Object.fromEntries(
      Array.from(flow.querySelectorAll<HTMLElement>("[data-quiz-screen]"), (node) => [node.dataset.quizScreen || "", node])
    ) as Record<string, HTMLElement>;
    const get = <T extends HTMLElement = HTMLElement>(selector: string): T | null => flow.querySelector<T>(selector);
    const prompt = get("[data-quiz-prompt]");
    const answers = get("[data-quiz-answers]");
    const minigameHost = get("[data-quiz-minigame]");
    const counter = get("[data-quiz-counter]");
    const seconds = get("[data-quiz-seconds]");
    const timerTrack = get(".quiz-flow__timer-track");
    const timerFill = get("[data-quiz-timer-fill]");
    if (!prompt || !answers || !counter || !seconds || !timerTrack || !timerFill) return;

    let stageIndex = -1;
    let questions: LearningHausQuestions.Question[] = [];
    let answerReviews: AnswerReviewRecord[] = [];
    let questionIndex = 0;
    let correctCount = 0;
    let totalItems: number = LearningHausRules.quiz.questionsPerStage;
    let currentTimerDurationSec: number = LearningHausRules.quiz.secondsPerQuestion;
    let activeGameType: LearningHausProgression.StageGameType = "quiz";
    let activeMiniGame: LearningHausMiniGameEngine.ActiveController | null = null;
    let remaining: number = LearningHausRules.quiz.secondsPerQuestion;
    let stageStartedAt = 0;
    let timerFrame: number | null = null;
    let questionStartedAt = 0;
    let displayedRemaining: number | null = null;
    let advanceTimeout: number | null = null;
    let feedbackTimeout: number | null = null;
    let removedChoices: string[] = [];
    let madeMistake = false;
    let answering = false;

    type CustomRunState = {
      courseId: string;
      courseTitle: string;
      requireApproval: boolean;
      chIdx: number;
      stageIdx: number;
      stage: LearningHausCustomQuizStudio.CustomQuizStage;
      itemIdx: number;
      deadlineMs: number;
      totalDurationMs: number;
      accCorrect: number;
      accTotal: number;
      accReviews: AnswerReviewRecord[];
      timedOutAll: boolean;
    };
    let customRun: CustomRunState | null = null;

    const customKindLabel = (kind: LearningHausCustomQuizStudio.MixedItemKind): string => {
      const map: Record<LearningHausCustomQuizStudio.MixedItemKind, [string, string]> = {
        quiz: ["4-Choice Quiz", "ควิซ 4 ตัวเลือก"],
        "true-false-sprint": ["Rapid Blitz", "จริง / เท็จ สปรินต์"],
        matching: ["Pair Match", "จับคู่ความสัมพันธ์"],
        "binary-stamp": ["Rapid Stamp", "ประทับตราแยกฝั่ง"],
        sorting: ["Category Sort", "คัดแยกหมวดหมู่"],
        "order-steps": ["Step Sequence", "เรียงลำดับขั้นตอน"],
        scenario: ["Decision Path", "สถานการณ์ตัดสินใจ"]
      };
      const pair = map[kind] || map.quiz;
      return LearningHausI18n.t(pair[0], pair[1]);
    };

    const convertCustomItemToMiniGameLevel = (
      item: LearningHausCustomQuizStudio.CustomQuizQuestionItem,
      stageTitle: string,
      timeLimitSeconds: number
    ): LearningHausMiniGamePacks.MiniGameLevel | null => {
      const explain = item.explanation || LearningHausI18n.t("Review this lesson concept.", "ทบทวนแนวคิดหลักของบทเรียนนี้");
      if (item.kind === "matching") {
        const pairs = (item.pairs || []).filter((p) => p.left || p.right);
        const safePairs = pairs.length
          ? pairs
          : [
              { left: "Item A", right: "Match A" },
              { left: "Item B", right: "Match B" }
            ];
        return {
          kind: "matching",
          title: item.prompt || stageTitle,
          instruction: { en: "Tap a left card, then tap its matching card on the right.", th: "แตะการ์ดฝั่งซ้าย แล้วแตะคู่ที่ตรงกันทางฝั่งขวา" },
          timeLimitSeconds,
          leftLabel: { en: "Terms", th: "หัวข้อ" },
          rightLabel: { en: "Matches", th: "คู่ที่ตรงกัน" },
          pairs: safePairs.map((p, i) => ({
            id: `cp-${i}`,
            left: p.left || `#${i + 1}`,
            right: p.right || `#${i + 1}`,
            explain
          }))
        };
      }
      if (item.kind === "binary-stamp") {
        const leftTxt = item.leftLabel || LearningHausI18n.t("Approve", "ถูกต้อง / ผ่าน");
        const rightTxt = item.rightLabel || LearningHausI18n.t("Flag", "ต้องระวัง / ไม่ผ่าน");
        return {
          kind: "binary-stamp",
          title: stageTitle,
          instruction: { en: "Inspect the card and stamp the right verdict.", th: "อ่านการ์ดแล้วกดประทับตราฝั่งที่ถูกต้อง" },
          timeLimitSeconds,
          leftButton: leftTxt,
          rightButton: rightTxt,
          leftStamp: leftTxt,
          rightStamp: rightTxt,
          cards: [
            {
              code: "CASE",
              title: item.prompt || stageTitle,
              desc: "",
              answer: item.stampAnswer === "right" ? "right" : "left",
              explain
            }
          ]
        };
      }
      if (item.kind === "sorting") {
        const tones: readonly ("blue" | "green" | "amber" | "red")[] = ["blue", "green", "amber", "red"];
        const rawBuckets = (item.buckets || []).length ? item.buckets! : ["Category A", "Category B"];
        const buckets = rawBuckets.map((b, i) => ({
          id: `b-${i}`,
          title: b || `Group ${i + 1}`,
          subtitle: "",
          tone: tones[i % tones.length]
        }));
        const rawItems = (item.sortItems || []).length ? item.sortItems! : [{ text: "Example 1", bucketIdx: 0 }];
        return {
          kind: "sorting",
          title: item.prompt || stageTitle,
          instruction: { en: "Sort each item into the matching category bucket.", th: "คัดแยกแต่ละรายการลงในหมวดหมู่ที่ถูกต้อง" },
          timeLimitSeconds,
          buckets,
          items: rawItems.map((si) => ({
            name: si.text || "Item",
            hint: "",
            bucketId: `b-${Math.max(0, Math.min(buckets.length - 1, si.bucketIdx || 0))}`,
            explain
          }))
        };
      }
      if (item.kind === "scenario") {
        const rawOpts = (item.options || []).length ? item.options! : ["Best practice", "Risky shortcut", "Ignore"];
        const corr = Math.max(0, Math.min(rawOpts.length - 1, item.correctIndex || 0));
        return {
          kind: "scenario",
          title: stageTitle,
          instruction: { en: "Choose the best decision to protect your score meter.", th: "เลือกการตัดสินใจที่ดีที่สุดเพื่อรักษาแถบคะแนน" },
          timeLimitSeconds,
          meterLabel: { en: "Decision Meter", th: "แถบการตัดสินใจ" },
          initialMeter: 70,
          steps: [
            {
              speaker: stageTitle,
              prompt: item.prompt || stageTitle,
              choices: rawOpts.map((o, i) => ({
                text: o || `Choice ${i + 1}`,
                delta: i === corr ? 20 : -15,
                isBest: i === corr,
                note: explain
              }))
            }
          ]
        };
      }
      if (item.kind === "true-false-sprint") {
        return {
          kind: "true-false-sprint",
          title: stageTitle,
          instruction: { en: "Judge quickly: is this statement TRUE or FALSE?", th: "ตัดสินใจให้ไว: ข้อความนี้จริงหรือเท็จ?" },
          timeLimitSeconds,
          statements: [
            {
              text: item.prompt || stageTitle,
              isTrue: item.isTrue !== false,
              explain
            }
          ]
        };
      }
      if (item.kind === "order-steps") {
        const rawSteps = (item.steps || []).filter(Boolean);
        const safeSteps = rawSteps.length >= 2 ? rawSteps : ["Step 1", "Step 2", "Step 3"];
        return {
          kind: "order-steps",
          title: item.prompt || stageTitle,
          instruction: { en: "Tap the steps in the correct sequence from first to last.", th: "กดเรียงลำดับขั้นตอนจากแรกไปสุดท้ายให้ถูกต้อง" },
          timeLimitSeconds,
          steps: safeSteps.map((s, i) => ({
            rank: i + 1,
            label: s,
            explain
          }))
        };
      }
      return null;
    };

    // ใช้ requestAnimationFrame คำนวณจากเวลาจริง เพื่อให้แถบลดต่อเนื่องไม่กระโดดทีละวินาที
    const stopTimer = (): void => {
      if (timerFrame !== null) cancelAnimationFrame(timerFrame);
      timerFrame = null;
    };

    const updateTimer = (now: number): void => {
      if (answering) return;
      const durationMs = customRun ? customRun.totalDurationMs : currentTimerDurationSec * 1000;
      const remainingMs = customRun
        ? Math.max(0, customRun.deadlineMs - now)
        : Math.max(0, durationMs - (now - questionStartedAt));
      remaining = Math.ceil(remainingMs / 1000);
      timerFill.style.transform = `scaleX(${Math.max(0, Math.min(1, remainingMs / Math.max(1, durationMs)))})`;
      if (remaining !== displayedRemaining) {
        displayedRemaining = remaining;
        seconds.textContent = `${remaining}s`;
        timerTrack.setAttribute("aria-valuenow", String(remaining));
        timerTrack.classList.toggle("is-urgent", remaining <= Math.min(10, Math.ceil((durationMs / 1000) * 0.25)));
      }
      if (remaining === 0) {
        if (customRun) customRun.timedOutAll = true;
        if (activeMiniGame) {
          stopTimer();
          activeMiniGame.finishOnTimeout();
        } else {
          choose(-1);
        }
        return;
      }
      timerFrame = requestAnimationFrame(updateTimer);
    };

    const startTimer = (): void => {
      stopTimer();
      questionStartedAt = performance.now();
      timerFrame = requestAnimationFrame(updateTimer);
    };

    const showScreen = (name: string): void => {
      Object.entries(screens).forEach(([key, screen]) => {
        screen.hidden = key !== name;
      });
      flow.dataset.screen = name;
      flow.scrollTop = 0;
    };

    const recordAnswerReview = (choice: number, earnedPoint = false): void => {
      const question = questions[questionIndex];
      if (!question) return;
      answerReviews[questionIndex] = {
        question: question.q,
        selectedAnswer: choice >= 0 ? question.a[choice] : null,
        correctAnswer: question.a[question.c],
        explanation: question.why,
        isCorrect: earnedPoint,
        answeredCorrectly: choice === question.c,
        madeMistake,
        timedOut: choice === -1,
        removedChoices: [...removedChoices]
      };
    };

    const renderAnswerReview = (): void => {
      const reviewList = get("[data-quiz-review-list]");
      if (!reviewList) return;
      reviewList.replaceChildren();
      const addField = (card: HTMLElement, labelText: string, valueText: string, className = ""): void => {
        const field = document.createElement("div");
        field.className = `quiz-flow__review-field${className ? ` ${className}` : ""}`;
        const label = document.createElement("span");
        label.className = "quiz-flow__review-field-label";
        label.textContent = labelText;
        const value = document.createElement("p");
        value.className = "quiz-flow__review-field-value";
        value.textContent = valueText;
        field.append(label, value);
        card.append(field);
      };

      answerReviews.forEach((review, index) => {
        if (!review) return;
        const card = document.createElement("article");
        card.className = `quiz-flow__review-item ${review.isCorrect ? "is-correct" : "is-incorrect"}`;
        card.setAttribute("role", "listitem");
        const heading = document.createElement("div");
        heading.className = "quiz-flow__review-item-heading";
        const number = document.createElement("h3");
        number.textContent = LearningHausI18n.t(`Question ${index + 1}`, `ข้อที่ ${index + 1}`);
        const status = document.createElement("span");
        status.className = "quiz-flow__review-status";
        status.textContent = review.timedOut
          ? LearningHausI18n.t("Time ran out", "หมดเวลา")
          : review.isCorrect
            ? LearningHausI18n.t("Correct", "ถูกต้อง")
            : review.answeredCorrectly
              ? LearningHausI18n.t("No point", "ไม่ได้คะแนน")
              : LearningHausI18n.t("Incorrect", "ตอบผิด");
        heading.append(number, status);
        card.append(heading);
        const promptText = document.createElement("p");
        promptText.className = "quiz-flow__review-question";
        promptText.textContent = review.question;
        card.append(promptText);

        const answersGrid = document.createElement("div");
        answersGrid.className = "quiz-flow__review-answer-grid";
        const selected =
          review.selectedAnswer ||
          (review.timedOut
            ? LearningHausI18n.t("No answer was submitted before time ran out.", "ไม่ได้ส่งคำตอบก่อนหมดเวลา")
            : LearningHausI18n.t("No final answer.", "ไม่มีคำตอบ"));
        addField(answersGrid, LearningHausI18n.t("Your answer", "คำตอบของคุณ"), selected, "quiz-flow__review-field--user");
        if (!review.answeredCorrectly) {
          addField(
            answersGrid,
            LearningHausI18n.t("Correct answer", "คำตอบที่ถูกต้อง"),
            review.correctAnswer,
            "quiz-flow__review-field--correct"
          );
        }
        if (review.removedChoices.length) {
          addField(
            answersGrid,
            LearningHausI18n.t("Incorrect choices removed", "ตัวเลือกผิดที่ถูกตัดออก"),
            review.removedChoices.join(" · "),
            "quiz-flow__review-field--removed"
          );
        }
        card.append(answersGrid);
        if (review.madeMistake && review.answeredCorrectly) {
          addField(
            card,
            LearningHausI18n.t("Scoring", "การคิดคะแนน"),
            LearningHausI18n.t(
              "No point was awarded because an incorrect option was chosen first.",
              "ไม่ได้รับคะแนนในข้อนี้เนื่องจากเลือกคำตอบผิดก่อนหน้า"
            ),
            "quiz-flow__review-field--removed"
          );
        }
        addField(card, LearningHausI18n.t("Why", "คำอธิบาย"), review.explanation, "quiz-flow__review-field--why");
        reviewList.append(card);
      });
    };

    const close = (): void => {
      stopTimer();
      activeMiniGame?.destroy();
      activeMiniGame = null;
      customRun = null;
      if (minigameHost) minigameHost.hidden = true;
      answers.hidden = false;
      if (advanceTimeout !== null) window.clearTimeout(advanceTimeout);
      if (feedbackTimeout !== null) window.clearTimeout(feedbackTimeout);
      advanceTimeout = null;
      feedbackTimeout = null;
      flow.classList.remove("is-answer-wrong", "is-answer-correct", "is-exam-mode", "is-minigame-mode");
      flow.hidden = true;
      document.body.classList.remove("quiz-flow-open");
      document.getElementById("quiz-view")?.removeAttribute("inert");
      window.LearningHausSettings?.returnToMapBgm?.();
      document.querySelector<HTMLElement>(`.quiz-node[data-stage-index="${stageIndex}"]`)?.focus({ preventScroll: true });
      window.dispatchEvent(new CustomEvent("learninghaus:quiz-flow-closed", { detail: { stageIndex } }));
    };

    const getProfileState = (): LearningHausProgression.LevelState => {
      const profile = window.LearningHausProfile?.getProfile?.();
      const storedTotalXp = Number(profile?.totalXp);
      const totalXp = Number.isFinite(storedTotalXp)
        ? Math.max(0, storedTotalXp)
        : LearningHausProgression.getLegacyTotalXp(Number(profile?.level), Number(profile?.exp));
      return LearningHausProgression.getLevelState(totalXp);
    };

    const isExamStage = (): boolean =>
      !customRun &&
      stageIndex >= 0 &&
      stageIndex % LearningHausRules.quiz.stagesPerChapter === LearningHausRules.quiz.stagesPerChapter - 1;

    const finish = (): void => {
      stopTimer();
      activeMiniGame?.destroy();
      activeMiniGame = null;
      const activeCustom = customRun;
      const examMode = isExamStage();
      const before = getProfileState();
      const stageAlreadyPassed = activeCustom
        ? LearningHausCustomQuizStudio.isStageCleared(activeCustom.courseId, activeCustom.chIdx, activeCustom.stage.id)
        : Boolean(document.querySelector(`.quiz-node[data-stage-index="${stageIndex}"]`)?.classList.contains("is-passed"));
      const stageTimeLimit = activeCustom
        ? Math.max(10, activeCustom.totalDurationMs / 1000)
        : activeGameType === "quiz"
          ? questions.length * LearningHausRules.quiz.secondsPerQuestion
          : currentTimerDurationSec;
      const elapsedSeconds = Math.min(
        stageTimeLimit,
        Math.max(0, (performance.now() - stageStartedAt) / 1000)
      );
      const stageScore = LearningHausProgression.calculateStageScore({
        correctAnswers: correctCount,
        totalQuestions: Math.max(1, totalItems),
        elapsedSeconds,
        timeLimitSeconds: stageTimeLimit,
        gameType: activeGameType
      });
      // ทำครบทุกข้อก็ผ่าน: XP ได้ครั้งแรก และห้องเรียนแบบล็อคจะไม่ได้โบนัส EXP
      const awardedXp = activeCustom?.requireApproval
        ? 0
        : LearningHausProgression.calculateStageXp(stageScore, !stageAlreadyPassed);
      const after = LearningHausProgression.getLevelState(before.totalXp + awardedXp);
      const scoreEl = get("[data-quiz-score]");
      const scoreTotalEl = get("[data-quiz-score-total]");
      const xpEl = get("[data-quiz-xp]");
      const levelBeforeEl = get("[data-quiz-level-before]");
      const levelAfterEl = get("[data-quiz-level-after]");
      const levelStrongEl = get(".quiz-flow__stat--level strong");
      const levelCardEl = get("[data-quiz-level-card]");
      const scoreStatsEl = get(".quiz-flow__score-stats");
      const resultNoteEl = get("[data-quiz-result-note]");
      const scoreEyebrowEl = get("[data-quiz-score-eyebrow]");
      const scoreHeadingEl = get("[data-quiz-score-heading]");
      const reviewSectionEl = get("[data-quiz-review-section]");
      const reviewListEl = get("[data-quiz-review-list]");
      const examLockedEl = get("[data-quiz-exam-locked]");
      const lbStageBadgeEl = get("[data-quiz-lb-stage-badge]");
      const lbHintEl = get("[data-quiz-lb-hint]");
      const lbNextBtn = get<HTMLButtonElement>("[data-quiz-lb-next]");
      const postGameLbEl = get<HTMLElement>("[data-quiz-postgame-lb]");

      if (scoreEl) scoreEl.textContent = String(correctCount);
      if (scoreTotalEl) scoreTotalEl.textContent = String(Math.max(1, totalItems));
      if (xpEl) xpEl.textContent = `${awardedXp} EXP`;
      if (levelBeforeEl) levelBeforeEl.textContent = String(before.level);
      if (levelAfterEl) levelAfterEl.textContent = String(after.level);
      const didLevelUp = after.level > before.level;
      if (levelStrongEl) levelStrongEl.textContent = LearningHausI18n.t("Level UP", "เลเวลอัป");
      if (levelCardEl) levelCardEl.hidden = !didLevelUp;
      if (scoreStatsEl) scoreStatsEl.classList.toggle("quiz-flow__score-stats--single", !didLevelUp);
      if (resultNoteEl) {
        resultNoteEl.textContent = activeCustom?.requireApproval
          ? LearningHausI18n.t(
              "Stage complete (Locked class awards 0 EXP).",
              "ผ่านด่านเรียบร้อยแล้ว (ห้องแบบล็อคจะไม่ได้รับโบนัส EXP)"
            )
          : awardedXp
            ? LearningHausI18n.t(
                `Nice work! You earned ${awardedXp} EXP.`,
                `เยี่ยมมาก! คุณได้รับ ${awardedXp} EXP`
              )
            : LearningHausI18n.t(
                "Stage complete. Replays do not award extra EXP.",
                "ผ่านด่านแล้ว (การเล่นซ้ำจะไม่ได้รับ EXP เพิ่ม)"
              );
      }

      flow.querySelectorAll<HTMLElement>("[data-quiz-step2-label]").forEach((label) => {
        label.textContent = examMode
          ? LearningHausI18n.t("Final Exam Score", "คะแนนสอบปลายบท")
          : LearningHausI18n.t("Score & Solutions", "คะแนนและเฉลย");
      });
      if (lbStageBadgeEl) {
        lbStageBadgeEl.textContent = activeCustom
          ? `${activeCustom.courseTitle} · ${activeCustom.stage.title}`
          : LearningHausLeaderboards.formatStageLabel(stageIndex + 1);
      }
      if (lbHintEl) {
        lbHintEl.textContent = examMode
          ? LearningHausI18n.t(
              "Final Exam: Press Next to see your exam score (no answers shown).",
              "ด่านสุดท้าย (สอบปลายบท): กดถัดไปเพื่อดูคะแนนสอบของคุณ (ไม่มีเฉลยคำตอบ)"
            )
          : LearningHausI18n.t(
              "Press Next to view your score and answer solutions for this stage.",
              "กดถัดไปเพื่อดูคะแนนและเฉลยคำตอบของด่านนี้"
            );
      }
      if (lbNextBtn) {
        lbNextBtn.textContent = examMode
          ? LearningHausI18n.t("Next · View Exam Score →", "ถัดไป · ดูคะแนนสอบ →")
          : LearningHausI18n.t("Next · Score & Solutions →", "ถัดไป · ดูคะแนนและเฉลย →");
      }
      if (scoreEyebrowEl) {
        scoreEyebrowEl.textContent = examMode
          ? LearningHausI18n.t("FINAL EXAM COMPLETE", "สอบปลายบทเสร็จสมบูรณ์")
          : LearningHausI18n.t("STAGE COMPLETE", "ผ่านด่านแล้ว");
      }
      if (scoreHeadingEl) {
        scoreHeadingEl.textContent = examMode
          ? LearningHausI18n.t("Your exam score", "คะแนนสอบของคุณ")
          : LearningHausI18n.t("Your score", "คะแนนของคุณ");
      }
      if (reviewSectionEl) reviewSectionEl.hidden = examMode;
      if (examLockedEl) examLockedEl.hidden = !examMode;
      if (examMode) {
        // ด่านสุดท้าย (Final Exam): ไม่แสดงและไม่ใส่เฉลยคำตอบใน DOM
        reviewListEl?.replaceChildren();
      } else {
        renderAnswerReview();
      }

      if (awardedXp) {
        window.dispatchEvent(new CustomEvent("learninghaus:quiz-xp-awarded", { detail: { amount: awardedXp, stageIndex, stageScore } }));
      }
      if (activeCustom) {
        const pct = Math.round((correctCount / Math.max(1, totalItems)) * 100);
        LearningHausCustomQuizStudio.markStageCleared(activeCustom.courseId, activeCustom.chIdx, activeCustom.stage.id, pct);
      }
      window.dispatchEvent(
        new CustomEvent("learninghaus:quiz-stage-complete", {
          detail: {
            courseId: activeCustom ? activeCustom.courseId : "eu-ai-act",
            index: stageIndex,
            correctCount,
            totalQuestions: Math.max(1, totalItems),
            elapsedSeconds,
            stageScore,
            xp: awardedXp
          }
        })
      );

      if (postGameLbEl) {
        LearningHausLeaderboards.renderPostGameLeaderboard(postGameLbEl, stageIndex + 1, {
          score: stageScore,
          correct: correctCount,
          total: Math.max(1, totalItems),
          timeSeconds: elapsedSeconds
        });
      }

      // ปิดเสียงเพลงตอนเล่นด่าน แล้วแสดง Leaderboard พร้อมเปิดเสียงชนะ / จบด่าน
      window.LearningHausSettings?.stopBgm?.();
      showScreen("leaderboard");
      window.LearningHausSettings?.playTone?.("victory");
      lbNextBtn?.focus({ preventScroll: true });
    };

    const finishCustomRun = (): void => {
      if (!customRun) return;
      correctCount = customRun.accCorrect;
      totalItems = Math.max(1, customRun.accTotal);
      answerReviews = [...customRun.accReviews];
      finish();
    };

    const renderCustomRunItem = (): void => {
      if (!customRun) return;
      activeMiniGame?.destroy();
      activeMiniGame = null;
      const item = customRun.stage.items[customRun.itemIdx];
      if (!item || customRun.timedOutAll || performance.now() >= customRun.deadlineMs) {
        finishCustomRun();
        return;
      }

      const itemNum = customRun.itemIdx + 1;
      const totalStageItems = customRun.stage.items.length;
      const remainingSec = Math.max(1, Math.ceil((customRun.deadlineMs - performance.now()) / 1000));
      counter.textContent = `${customRun.courseTitle} · ${customRun.stage.title} · ${itemNum} / ${totalStageItems} · ${customKindLabel(item.kind)}`;

      if (item.kind === "quiz" || !minigameHost) {
        activeGameType = "quiz";
        if (minigameHost) minigameHost.hidden = true;
        answers.hidden = false;
        flow.classList.remove("is-minigame-mode", "is-exam-mode", "is-answer-wrong", "is-answer-correct");
        const rawOpts = (item.options || []).length ? item.options! : ["Option A", "Option B", "Option C", "Option D"];
        const corrIdx = Math.max(0, Math.min(rawOpts.length - 1, item.correctIndex || 0));
        questions = [
          {
            q: item.prompt || customRun.stage.title,
            a: rawOpts,
            c: corrIdx,
            why: item.explanation || LearningHausI18n.t("Review this lesson concept.", "ทบทวนแนวคิดหลักของบทเรียนนี้")
          }
        ];
        questionIndex = 0;
        answerReviews = [];
        correctCount = 0;
        answering = false;
        prompt.textContent = questions[0].q;
        removedChoices = [];
        madeMistake = false;
        answers.replaceChildren(
          ...questions[0].a.map((option, idx) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "quiz-flow__answer";
            button.dataset.choice = String(idx);
            button.textContent = option;
            return button;
          })
        );
        syncAnswersLayout();
        showScreen("question");
        startTimer();
        answers.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
        return;
      }

      const mgLevel = convertCustomItemToMiniGameLevel(item, customRun.stage.title, remainingSec);
      if (!mgLevel) {
        customRun.itemIdx += 1;
        renderCustomRunItem();
        return;
      }

      activeGameType = mgLevel.kind;
      answering = false;
      answers.hidden = true;
      minigameHost.hidden = false;
      flow.classList.remove("is-exam-mode", "is-answer-wrong", "is-answer-correct");
      flow.classList.add("is-minigame-mode");
      prompt.textContent = LearningHausMiniGamePacks.text(mgLevel.title);
      showScreen("question");

      activeMiniGame = LearningHausMiniGameEngine.mount({
        container: minigameHost,
        level: mgLevel,
        onFeedback: (ok) => flashAnswerFeedback(ok ? "is-answer-correct" : "is-answer-wrong"),
        onComplete: (result) => {
          if (!customRun) return;
          customRun.accCorrect += result.correctCount;
          customRun.accTotal += Math.max(1, result.totalCount);
          customRun.accReviews.push(...result.reviews);
          customRun.itemIdx += 1;
          if (customRun.timedOutAll || customRun.itemIdx >= customRun.stage.items.length || performance.now() >= customRun.deadlineMs) {
            finishCustomRun();
          } else {
            renderCustomRunItem();
          }
        }
      });
      startTimer();
    };

    const next = (): void => {
      if (customRun) {
        customRun.accCorrect += correctCount;
        customRun.accTotal += 1;
        if (answerReviews[0]) customRun.accReviews.push(answerReviews[0]);
        customRun.itemIdx += 1;
        if (customRun.timedOutAll || customRun.itemIdx >= customRun.stage.items.length || performance.now() >= customRun.deadlineMs) {
          finishCustomRun();
        } else {
          renderCustomRunItem();
        }
        return;
      }
      questionIndex += 1;
      if (questionIndex >= questions.length) finish();
      else {
        renderQuestion();
        answers.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
      }
    };

    const flashAnswerFeedback = (className: string): void => {
      window.LearningHausSettings?.playTone?.(className === "is-answer-correct" ? "correct" : "wrong");
      if (feedbackTimeout !== null) window.clearTimeout(feedbackTimeout);
      flow.classList.remove("is-answer-wrong", "is-answer-correct");
      const questionScreen = get<HTMLElement>('[data-quiz-screen="question"]');
      if (questionScreen) void questionScreen.offsetWidth;
      flow.classList.add(className);
      feedbackTimeout = window.setTimeout(() => {
        flow.classList.remove(className);
        feedbackTimeout = null;
      }, 460);
    };

    const choose = (choice: number): void => {
      if (answering) return;
      const currentQuestion = questions[questionIndex];
      if (!currentQuestion) return;

      // โหมดข้อสอบ (ด่านสุดท้ายของแต่ละบท): ไม่มีเฉลย ไม่มีไฟเขียว/แดง ไม่มีตัดช้อยส์
      if (isExamStage()) {
        answering = true;
        stopTimer();
        const earnedPoint = choice === currentQuestion.c;
        recordAnswerReview(choice, earnedPoint);
        if (earnedPoint) correctCount += 1;
        window.LearningHausSettings?.playTone?.("click");
        answers.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
          button.disabled = true;
          if (choice >= 0 && Number(button.dataset.choice) === choice) {
            button.classList.add("is-exam-selected");
          }
        });
        advanceTimeout = window.setTimeout(next, 280);
        return;
      }

      if (choice === currentQuestion.c) {
        answering = true;
        stopTimer();
        const earnedPoint = !madeMistake;
        recordAnswerReview(choice, earnedPoint);
        flashAnswerFeedback("is-answer-correct");
        if (earnedPoint) correctCount += 1;
        answers.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
          button.disabled = true;
          if (Number(button.dataset.choice) === choice) button.classList.add("is-correct");
        });
        advanceTimeout = window.setTimeout(next, 550);
      } else {
        const wrongButton = answers.querySelector<HTMLButtonElement>(`button[data-choice="${choice}"]`);
        flashAnswerFeedback("is-answer-wrong");
        if (choice === -1) {
          answering = true;
          stopTimer();
          recordAnswerReview(choice);
          advanceTimeout = window.setTimeout(next, 600);
          return;
        }
        if (wrongButton) {
          madeMistake = true;
          removedChoices.push(currentQuestion.a[choice]);
          wrongButton.disabled = true;
          wrongButton.classList.add("is-wrong");
          const shouldRestoreFocus = document.activeElement === wrongButton;
          window.setTimeout(() => {
            if (!wrongButton.isConnected) return;
            wrongButton.classList.add("is-eliminating");
            window.setTimeout(() => {
              if (!wrongButton.isConnected) return;
              wrongButton.remove();
              syncAnswersLayout();
              if (shouldRestoreFocus) answers.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus({ preventScroll: true });
            }, 190);
          }, 420);
        }
      }
    };

    const syncAnswersLayout = (): void => {
      const count = answers.querySelectorAll<HTMLButtonElement>("button").length;
      answers.dataset.remainingCount = String(count);
    };

    const renderQuestion = (): void => {
      const question = questions[questionIndex];
      if (!question) return;
      answering = false;
      prompt.textContent = question.q;
      removedChoices = [];
      madeMistake = false;
      const examMode = isExamStage();
      flow.classList.toggle("is-exam-mode", examMode);
      const chapterNum = Math.floor(stageIndex / LearningHausRules.quiz.stagesPerChapter) + 1;
      const stageSuffix = examMode ? LearningHausI18n.t(" (Final Exam)", " (สอบปลายบท)") : "";
      const activeCourse = window.LearningHausLearnHub?.getActiveCourse?.();
      const coursePrefix = activeCourse && activeCourse.id !== "eu-ai-act" ? `${activeCourse.title} · ` : "";
      counter.textContent = LearningHausI18n.t(
        `${coursePrefix}Chapter ${chapterNum} · Stage ${stageIndex + 1}${stageSuffix} · Question ${questionIndex + 1} / ${questions.length}`,
        `${coursePrefix}บทที่ ${chapterNum} · ด่าน ${stageIndex + 1}${stageSuffix} · ข้อ ${questionIndex + 1} / ${questions.length}`
      );
      answers.replaceChildren(
        ...question.a.map((option, index) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "quiz-flow__answer";
          button.dataset.choice = String(index);
          button.textContent = option;
          return button;
        })
      );
      syncAnswersLayout();
      remaining = LearningHausRules.quiz.secondsPerQuestion;
      displayedRemaining = remaining;
      seconds.textContent = `${remaining}s`;
      timerFill.style.transform = "scaleX(1)";
      timerTrack.setAttribute("aria-valuenow", String(remaining));
      timerTrack.setAttribute("aria-valuemax", String(remaining));
      timerTrack.classList.remove("is-urgent");
      flow.classList.remove("is-answer-wrong", "is-answer-correct");
      showScreen("question");
      startTimer();
    };

    const open = (index: number): void => {
      if (!Number.isInteger(index) || index < 0 || index >= LearningHausRules.quiz.chapterCount * LearningHausRules.quiz.stagesPerChapter) return;
      stopTimer();
      activeMiniGame?.destroy();
      activeMiniGame = null;
      customRun = null;
      stageIndex = index;
      questionIndex = 0;
      correctCount = 0;
      answerReviews = [];
      stageStartedAt = performance.now();
      const chapter = Math.floor(index / LearningHausRules.quiz.stagesPerChapter) + 1;
      const stagePosition = index % LearningHausRules.quiz.stagesPerChapter;
      const courseId = window.LearningHausLearnHub?.getActiveCourseId?.() || "eu-ai-act";
      const activeCourse = window.LearningHausLearnHub?.getActiveCourse?.();

      flow.hidden = false;
      document.body.classList.add("quiz-flow-open");
      document.getElementById("quiz-view")?.setAttribute("inert", "");
      const isBossStage = stagePosition === LearningHausRules.quiz.stagesPerChapter - 1;
      window.LearningHausSettings?.setQuizGameBgm?.(index, isBossStage);

      if (activeCourse && activeCourse.id !== "eu-ai-act" && activeCourse.chapters.length > 0) {
        const chIdx = Math.max(0, Math.min(activeCourse.chapters.length - 1, chapter - 1));
        const chObj = activeCourse.chapters[chIdx];
        LearningHausCustomQuizStudio.ensureLessonQuizConfig(chObj, chIdx);
        const chStages =
          chObj.quizStages && chObj.quizStages.length > 0
            ? chObj.quizStages
            : [LearningHausCustomQuizStudio.createDefaultStage(1, chObj.title)];
        const customStage = chStages[stagePosition] || chStages[0];
        if (customStage && customStage.items.length > 0) {
          const durationSec = Math.max(10, Math.min(900, Number(customStage.timeLimitSeconds) || 90));
          const durationMs = durationSec * 1000;
          currentTimerDurationSec = durationSec;
          remaining = durationSec;
          displayedRemaining = remaining;
          seconds.textContent = `${remaining}s`;
          timerFill.style.transform = "scaleX(1)";
          timerTrack.setAttribute("aria-valuenow", String(remaining));
          timerTrack.setAttribute("aria-valuemax", String(remaining));
          timerTrack.classList.remove("is-urgent");
          customRun = {
            courseId: activeCourse.id,
            courseTitle: activeCourse.title,
            requireApproval: Boolean(activeCourse.requireApproval),
            chIdx,
            stageIdx: stagePosition,
            stage: customStage,
            itemIdx: 0,
            deadlineMs: performance.now() + durationMs,
            totalDurationMs: durationMs,
            accCorrect: 0,
            accTotal: 0,
            accReviews: [],
            timedOutAll: false
          };
          renderCustomRunItem();
          return;
        }
      }

      const mgLevel = minigameHost ? LearningHausMiniGamePacks.resolveLevel(courseId, chapter, stagePosition) : null;
      const coursePrefix = activeCourse && activeCourse.id !== "eu-ai-act" ? `${activeCourse.title} · ` : "";

      if (mgLevel && minigameHost) {
        activeGameType = mgLevel.kind;
        currentTimerDurationSec = mgLevel.timeLimitSeconds;
        answering = false;
        answers.hidden = true;
        minigameHost.hidden = false;
        flow.classList.remove("is-exam-mode", "is-answer-wrong", "is-answer-correct");
        flow.classList.add("is-minigame-mode");
        counter.textContent = LearningHausI18n.t(
          `${coursePrefix}Chapter ${chapter} · Stage ${index + 1} · ${LearningHausStageCatalog.getStageGameLabel(index)}`,
          `${coursePrefix}บทที่ ${chapter} · ด่าน ${index + 1} · ${LearningHausStageCatalog.getStageGameLabel(index)}`
        );
        prompt.textContent = LearningHausMiniGamePacks.text(mgLevel.title);

        remaining = currentTimerDurationSec;
        displayedRemaining = remaining;
        seconds.textContent = `${remaining}s`;
        timerFill.style.transform = "scaleX(1)";
        timerTrack.setAttribute("aria-valuenow", String(remaining));
        timerTrack.setAttribute("aria-valuemax", String(remaining));
        timerTrack.classList.remove("is-urgent");
        showScreen("question");

        activeMiniGame = LearningHausMiniGameEngine.mount({
          container: minigameHost,
          level: mgLevel,
          onFeedback: (ok) => flashAnswerFeedback(ok ? "is-answer-correct" : "is-answer-wrong"),
          onComplete: (result) => {
            correctCount = result.correctCount;
            totalItems = Math.max(1, result.totalCount);
            answerReviews = result.reviews;
            const scoreTotalEl = get("[data-quiz-score-total]");
            if (scoreTotalEl) scoreTotalEl.textContent = String(totalItems);
            finish();
          }
        });
        startTimer();
        return;
      }

      // Standard 4-choice Quiz (Stage 1 Warm-Up) or Final Stage Exam (Stage 10)
      activeGameType = "quiz";
      currentTimerDurationSec = LearningHausRules.quiz.secondsPerQuestion;
      if (minigameHost) minigameHost.hidden = true;
      answers.hidden = false;
      flow.classList.remove("is-minigame-mode");
      if (activeCourse && activeCourse.id !== "eu-ai-act" && activeCourse.chapters.length > 0) {
        const allCh = activeCourse.chapters;
        const focusCh = allCh[(chapter - 1) % allCh.length];
        const fallbackDistractors = [
          "Skipping transparency disclosures and documentation reviews.",
          "Deploying automated tools without checking accuracy or privacy risks.",
          "Ignoring human oversight and stakeholder feedback completely.",
          "Treating every AI output as verified legal advice without review."
        ];
        const buildCourseQ = (
          q: string,
          correctAns: string,
          distractors: string[],
          explain: string,
          seed: number
        ): LearningHausQuestions.Question => {
          const uniqueWrong = distractors.filter((d) => d && d !== correctAns).slice(0, 3);
          while (uniqueWrong.length < 3) {
            uniqueWrong.push(fallbackDistractors[uniqueWrong.length % fallbackDistractors.length]);
          }
          const options = [correctAns, ...uniqueWrong];
          const rot = seed % 4;
          const rotated = [...options.slice(rot), ...options.slice(0, rot)];
          return { q, a: rotated, c: rotated.indexOf(correctAns), why: explain };
        };

        const otherChapters = allCh.filter((c) => c.title !== focusCh.title);
        const generated: LearningHausQuestions.Question[] = [
          buildCourseQ(
            `In "${activeCourse.title}", what is the main focus of "${focusCh.title}"?`,
            focusCh.summaryEn,
            [...otherChapters.map((c) => c.summaryEn), ...fallbackDistractors],
            `${focusCh.title} focuses on: ${focusCh.summaryEn}`,
            chapter + stagePosition
          ),
          buildCourseQ(
            `Which chapter of "${activeCourse.title}" covers: ${focusCh.summaryEn}`,
            focusCh.title,
            [...otherChapters.map((c) => c.title), "Unrelated Hardware Maintenance", "Legacy Compiler Tuning", "Server Rack Cabling"],
            `"${focusCh.title}" is the dedicated chapter covering that topic.`,
            chapter + stagePosition + 1
          ),
          ...allCh.map((chItem, idx) =>
            buildCourseQ(
              `Which statement best matches "${chItem.title}" in ${activeCourse.title}?`,
              chItem.summaryEn,
              [...allCh.filter((o) => o.title !== chItem.title).map((o) => o.summaryEn), ...fallbackDistractors],
              `${chItem.title}: ${chItem.summaryEn}`,
              idx + chapter + stagePosition + 2
            )
          )
        ];
        questions = generated.slice(0, Math.min(LearningHausRules.quiz.questionsPerStage, Math.max(5, generated.length)));
      } else {
        questions = LearningHausQuestions.getStageQuestions(
          chapter,
          stagePosition,
          LearningHausRules.quiz.questionsPerStage
        );
      }
      totalItems = questions.length;
      const scoreTotalEl = get("[data-quiz-score-total]");
      if (scoreTotalEl) scoreTotalEl.textContent = String(questions.length);
      renderQuestion();
      answers.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    };

    window.addEventListener("learninghaus:language-changed", () => {
      if (activeMiniGame && stageIndex >= 0 && !flow.hidden) {
        const chapter = Math.floor(stageIndex / LearningHausRules.quiz.stagesPerChapter) + 1;
        const activeCourse = window.LearningHausLearnHub?.getActiveCourse?.();
        const coursePrefix = activeCourse && activeCourse.id !== "eu-ai-act" ? `${activeCourse.title} · ` : "";
        counter.textContent = LearningHausI18n.t(
          `${coursePrefix}Chapter ${chapter} · Stage ${stageIndex + 1} · ${LearningHausStageCatalog.getStageGameLabel(stageIndex)}`,
          `${coursePrefix}บทที่ ${chapter} · ด่าน ${stageIndex + 1} · ${LearningHausStageCatalog.getStageGameLabel(stageIndex)}`
        );
        activeMiniGame.rerender();
      }
    });

    window.addEventListener("learninghaus:quiz-stage-open", (event) => {
      if (document.getElementById("quiz-view")?.hidden) return;
      const detail = (event as CustomEvent<{ index?: number }>).detail;
      open(Number(detail?.index));
    });
    answers.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest<HTMLButtonElement>("button[data-choice]");
      if (button) choose(Number(button.dataset.choice));
    });
    get("[data-quiz-lb-next]")?.addEventListener("click", () => {
      showScreen("score");
      get("[data-quiz-finish]")?.focus({ preventScroll: true });
    });
    get("[data-quiz-back-lb]")?.addEventListener("click", () => {
      showScreen("leaderboard");
      get("[data-quiz-lb-next]")?.focus({ preventScroll: true });
    });
    get("[data-quiz-finish]")?.addEventListener("click", close);
    // ปุ่มนี้เปิดอันดับของด่านที่เพิ่งทำเสร็จเท่านั้น ไม่เพิ่มทางเข้าในเมนูหลัก
    get("[data-quiz-leaderboard]")?.addEventListener("click", () => {
      const completedStage = stageIndex + 1;
      close();
      window.dispatchEvent(new CustomEvent("learninghaus:leaderboard-open", { detail: { stage: completedStage } }));
    });
    get("[data-quiz-exit]")?.addEventListener("click", close);
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Escape" || flow.hidden) return;
        const personOverlay = document.querySelector<HTMLElement>('[data-home-panel="looking-people"]');
        if (personOverlay && !personOverlay.hidden) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        close();
      },
      true
    );
    window.LearningHausQuizFlow = Object.freeze({
      open,
      getState: () => ({ stageIndex, questionIndex, correctCount, screen: flow.dataset.screen || "closed" })
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
