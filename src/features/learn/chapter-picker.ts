// ส่วนนี้ทำหน้าที่: เลือกการ์ด Chapter ในหน้า Learn และอัปเดตความคืบหน้าของ Chapter รวมถึง Daily Quests ตามผลทำจริง
(() => {
  const initChapterPicker = (): void => {
    const picker = document.querySelector<HTMLElement>("[data-chapter-picker]");
    const cards = picker ? Array.from(picker.querySelectorAll<HTMLButtonElement>("[data-home-chapter]")) : [];
    const title = document.querySelector<HTMLElement>("[data-chapter-title]");
    const score = document.querySelector<HTMLElement>("[data-chapter-score]");
    const meter = document.querySelector<HTMLElement>("[data-chapter-meter]");
    const todayQuestsList = document.querySelector<HTMLElement>("[data-daily-quests-today]");
    const allQuestsList = document.querySelector<HTMLElement>("[data-daily-quests-all]");
    const questTitles = Array.from(document.querySelectorAll<HTMLElement>("[data-daily-quest-title]"));
    const questMeters = Array.from(document.querySelectorAll<HTMLElement>("[data-daily-quest-meter]"));

    if (!picker || cards.length === 0) return;

    const chapters = [
      { number: 1, title: "Chapter 1 - Foundations & Scope", questTitle: "Chapter 1: Foundations & The Scope of the Law" },
      { number: 2, title: "Chapter 2 - Prohibited AI Practices", questTitle: "Chapter 2: Prohibited AI Practices" },
      { number: 3, title: "Chapter 3 - High-Risk AI Systems", questTitle: "Chapter 3: High-Risk AI Systems" },
      { number: 4, title: "Chapter 4 - Transparency for Specific AI Systems", questTitle: "Chapter 4: Transparency for Specific AI Systems" },
      { number: 5, title: "Chapter 5 - General-Purpose AI Models (GPAI)", questTitle: "Chapter 5: General-Purpose AI (GPAI) Models" },
      { number: 6, title: "Chapter 6 - Supporting Innovation & Small Businesses", questTitle: "Chapter 6: Supporting Innovation & Small Businesses" },
      { number: 7, title: "Chapter 7 - Governance & Who Is in Charge?", questTitle: "Chapter 7: Governance & Who Is in Charge?" },
      { number: 8, title: "Chapter 8 - Your Rights & Enforcement", questTitle: "Chapter 8: Your Rights & Enforcement" }
    ];
    const stagesPerChapter = LearningHausRules.quiz.stagesPerChapter;
    let selectedIndex = 0;

    const getChapterMetrics = (chapterNumber: number): {
      percent: number;
      completedStages: number;
      videoCompleted: boolean;
      videoWatched: boolean;
      quizCompleted: boolean;
      isAccessible: boolean;
    } => {
      const progress = window.LearningHausQuiz?.getProgress?.();
      const entry = progress?.chapters?.find((item) => item.chapter === chapterNumber);
      const firstStageIndex = (chapterNumber - 1) * stagesPerChapter;
      const highestPassed = entry ? entry.highestPassed : -1;
      const completedStages = highestPassed >= firstStageIndex ? Math.min(stagesPerChapter, highestPassed - firstStageIndex + 1) : 0;
      const percent = Math.round((completedStages / stagesPerChapter) * 100);
      const videoCompleted = Boolean(entry?.videoCompleted ?? chapterNumber === 1);
      const videoWatched = Boolean(entry?.videoWatched || completedStages > 0);
      const quizCompleted = completedStages >= stagesPerChapter;
      const prevEntry = chapterNumber > 1 ? progress?.chapters?.find((item) => item.chapter === chapterNumber - 1) : null;
      const prevFirstStageIndex = (chapterNumber - 2) * stagesPerChapter;
      const prevCompleted =
        chapterNumber === 1 ||
        Boolean(prevEntry && prevEntry.highestPassed >= prevFirstStageIndex + stagesPerChapter - 1);
      const isAccessible = chapterNumber === 1 || videoCompleted || prevCompleted;
      return { percent, completedStages, videoCompleted, videoWatched, quizCompleted, isAccessible };
    };

    const createQuestRow = (labelText: string, state: "complete" | "pending" | "locked"): HTMLElement => {
      const article = document.createElement("article");
      article.className = `daily-quests-page__quest${state === "locked" ? " daily-quests-page__quest--locked" : ""}`;
      if (state === "locked") article.setAttribute("aria-label", "Locked quest");
      const text = document.createElement("span");
      text.textContent = labelText;
      article.append(text);
      if (state !== "locked") {
        const status = document.createElement("span");
        status.className = `daily-quests-page__status daily-quests-page__status--${state}`;
        status.setAttribute("aria-label", state === "complete" ? "Completed" : "In progress");
        status.textContent = state === "complete" ? "✓" : "";
        article.append(status);
      } else {
        const lockIcon = document.createElement("span");
        lockIcon.className = "daily-quests-page__lock";
        lockIcon.setAttribute("aria-hidden", "true");
        lockIcon.innerHTML = LearningHausIcons.svg("lock");
        article.append(lockIcon);
      }
      return article;
    };

    const renderDailyQuests = (): void => {
      window.LearningHausQuests?.render?.();
    };

    const updateSelection = (nextIndex: number): void => {
      selectedIndex = (nextIndex + cards.length) % cards.length;
      cards.forEach((card, index) => {
        const offset = (index - selectedIndex + cards.length) % cards.length;
        card.classList.remove("is-active", "is-next", "is-next-2", "is-next-3");
        if (offset === 0) card.classList.add("is-active");
        if (offset === 1) card.classList.add("is-next");
        if (offset === 2) card.classList.add("is-next-2");
        if (offset === 3) card.classList.add("is-next-3");
        card.setAttribute("aria-pressed", String(offset === 0));
        card.tabIndex = offset < 4 ? 0 : -1;
      });
      const chapter = chapters[selectedIndex];
      if (!chapter) return;
      const metrics = getChapterMetrics(chapter.number);
      if (title) title.textContent = chapter.title;
      if (score) score.textContent = `${metrics.percent} %`;
      if (meter) {
        meter.setAttribute("aria-valuenow", String(metrics.percent));
        const fill = meter.querySelector<HTMLElement>("span");
        if (fill) fill.style.width = `${metrics.percent}%`;
      }
      renderDailyQuests();
    };

    picker.addEventListener("click", (event) => {
      if (picker.dataset.justDragged === "1") return;
      const target = event.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>("[data-home-chapter]");
      if (!card) return;
      event.preventDefault();
      updateSelection(Number(card.dataset.homeChapter) - 1);
    });

    window.LearningHausLearnHub?.attachSmoothCardDrag?.(picker, {
      cardSelector: ".home-chapters__card",
      onStep: (delta) => {
        updateSelection(selectedIndex + delta);
      }
    });

    picker.addEventListener("keydown", (event) => {
      const target = event.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>("[data-home-chapter]");
      if (!card || !["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
      updateSelection(selectedIndex + direction);
      cards[selectedIndex]?.focus();
    });

    picker.addEventListener("learninghaus:select-chapter", (event) => {
      const detail = (event as CustomEvent<{ chapter?: number }>).detail;
      const chapter = Number(detail?.chapter);
      if (Number.isInteger(chapter) && chapter >= 1 && chapter <= cards.length) updateSelection(chapter - 1);
    });

    window.addEventListener("learninghaus:stage-progress-updated", () => {
      updateSelection(selectedIndex);
    });

    updateSelection(0);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChapterPicker, { once: true });
  } else {
    initChapterPicker();
  }
})();
