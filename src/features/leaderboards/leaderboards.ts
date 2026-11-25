// ส่วนนี้ทำหน้าที่: เลือกด่านและเรียงคะแนน Leaderboard เฉพาะผู้ที่มีคะแนนด่านนั้น
namespace LearningHausLeaderboards {
  const storageKey = "learninghaus.stage-scores.v1";
  const emptyGif = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  let postGameRenderSeq = 0;

  export const isExamStageNumber = (stage: number): boolean =>
    Number.isInteger(stage) &&
    stage >= 1 &&
    (stage - 1) % LearningHausRules.quiz.stagesPerChapter === LearningHausRules.quiz.stagesPerChapter - 1;

  export const formatStageLabel = (stage: number): string => {
    const base =
      LearningHausLeaderboardData.stageNames[stage] ||
      `Chapter ${Math.floor((stage - 1) / LearningHausRules.quiz.stagesPerChapter) + 1} · Stage ${stage}`;
    if (isExamStageNumber(stage) && !/exam/i.test(base)) return `${base} (Final Exam)`;
    return base;
  };

  // นับด่านที่จบจริงจากแผนที่ Quiz เพื่อไม่ให้คะแนนตัวอย่างเปิดหน้าอันดับก่อนเล่น
  const getCompletedStages = (): number[] => {
    const progress = window.LearningHausQuiz?.getProgress?.();
    if (!progress?.chapters) return [];
    const stages: number[] = [];
    progress.chapters.forEach(({ chapter, highestPassed }) => {
      const firstIndex = (chapter - 1) * LearningHausRules.quiz.stagesPerChapter;
      for (let index = firstIndex; index <= highestPassed; index += 1) stages.push(index + 1);
    });
    return stages;
  };

  export const hasCompletedStage = (stage: number): boolean => Number.isInteger(stage) && getCompletedStages().includes(stage);
  export const hasAnyCompletedStage = (): boolean => getCompletedStages().length > 0;

  type LocalScore = LearningHausLeaderboardData.Entry & { stage: number; isCurrentPlayer?: boolean };

  const readLocalScores = (): LocalScore[] => {
    const saved = LearningHausAccountStorage.readJson<LocalScore[]>(storageKey, []);
    return Array.isArray(saved)
      ? saved.filter((entry): entry is LocalScore => Boolean(entry && Number.isInteger(entry.stage) && typeof entry.name === "string"))
      : [];
  };

  const saveLocalScore = (score: LocalScore): void => {
    const scores = readLocalScores();
    const existing = scores.findIndex(
      (entry) => entry.stage === score.stage && (entry.isCurrentPlayer || entry.name === score.name)
    );
    if (existing >= 0 && scores[existing].score >= score.score) {
      scores[existing] = { ...scores[existing], name: score.name, avatar: score.avatar, totalXp: score.totalXp, isCurrentPlayer: true };
      LearningHausAccountStorage.writeJson(storageKey, scores);
      return;
    }
    if (existing >= 0) scores.splice(existing, 1);
    scores.push({ ...score, isCurrentPlayer: true });
    LearningHausAccountStorage.writeJson(storageKey, scores);
  };

  const resolveEntryAvatar = (entry: { name: string; avatar?: string; catConfig?: string; isCurrentPlayer?: boolean }): string => {
    if (entry.isCurrentPlayer || LearningHausAccountStorage.isCurrentUser(entry)) {
      return window.LearningHausPixelCat?.getActiveAvatarDataUrl?.() || window.LearningHausProfile?.getProfile?.()?.avatar || "";
    }
    if (entry.catConfig) {
      try {
        const parsed = JSON.parse(entry.catConfig);
        const rendered = window.LearningHausPixelCat?.renderConfigToDataUrl?.(parsed, 180);
        if (rendered) return rendered;
      } catch {
        // ignore invalid catConfig JSON
      }
    }
    const raw = String(entry.avatar || "").trim();
    if (raw && !raw.includes("Profire/PF0")) return raw;
    return window.LearningHausPixelCat?.getNpcAvatarDataUrl?.(entry.name) || "";
  };

  const syncLocalScoresWithProfile = (): void => {
    const profile = window.LearningHausProfile?.getProfile?.();
    if (!profile) return;
    const scores = readLocalScores();
    if (!scores.length) return;
    let changed = false;
    scores.forEach((entry) => {
      if (entry.isCurrentPlayer || LearningHausAccountStorage.isCurrentUser(entry)) {
        entry.name = String(profile.name || "TONOAK");
        entry.avatar = resolveEntryAvatar({ name: entry.name, avatar: profile.avatar, isCurrentPlayer: true });
        entry.totalXp = Number(profile.totalXp) || LearningHausRules.level.initialExp;
        entry.about = String(profile.about || "");
        const activeCat = window.LearningHausPixelCat?.getActiveConfig?.();
        if (activeCat) entry.catConfig = JSON.stringify(activeCat);
        entry.isCurrentPlayer = true;
        changed = true;
      }
    });
    if (changed) LearningHausAccountStorage.writeJson(storageKey, scores);
  };

  const dedupeAndSortEntries = (list: LearningHausLeaderboardData.Entry[]): LearningHausLeaderboardData.Entry[] => {
    const unique = new Map<string, LearningHausLeaderboardData.Entry>();
    list.forEach((entry) => {
      const key = entry.name.trim().toUpperCase();
      const previous = unique.get(key);
      if (!previous || entry.score > previous.score || (entry.score === previous.score && entry.timeSeconds < previous.timeSeconds)) {
        unique.set(key, entry);
      }
    });
    return Array.from(unique.values()).sort(
      (first, second) => second.score - first.score || second.correct - first.correct || first.timeSeconds - second.timeSeconds
    );
  };

  const getEntries = (stage: number): LearningHausLeaderboardData.Entry[] => {
    const profile = window.LearningHausProfile?.getProfile?.();
    const activeName = LearningHausAccountStorage.currentUserName();
    const sampleEntries = (LearningHausLeaderboardData.entries[stage] || []).map((entry) => {
      if (entry.name.toUpperCase() === "TONOAK") {
        const activeCat = window.LearningHausPixelCat?.getActiveConfig?.();
        return {
          ...entry,
          name: activeName,
          avatar: resolveEntryAvatar({ name: activeName, avatar: profile?.avatar, isCurrentPlayer: true }),
          about: String(profile?.about || entry.about || ""),
          catConfig: activeCat ? JSON.stringify(activeCat) : entry.catConfig,
          totalXp: Number(profile?.totalXp ?? entry.totalXp)
        };
      }
      return {
        ...entry,
        avatar: resolveEntryAvatar(entry)
      };
    });
    const local = readLocalScores()
      .filter((entry) => entry.stage === stage)
      .map((entry) => ({ ...entry, avatar: resolveEntryAvatar(entry) }));
    return dedupeAndSortEntries([...sampleEntries, ...local]);
  };

  const applyPersonDataset = (button: HTMLButtonElement, entry: LearningHausLeaderboardData.Entry): void => {
    button.dataset.lookingPerson = entry.name;
    button.dataset.personId = String(entry.userId || "");
    button.dataset.personLevel = String(LearningHausProgression.getLevelState(entry.totalXp).level);
    button.dataset.personExp = String(entry.totalXp);
    button.dataset.personAvatar = entry.avatar;
    button.dataset.personAbout = String(entry.about || "").trim();
    button.dataset.personCatConfig = String(entry.catConfig || "").trim();
    button.dataset.personMessage = entry.message || "Learning one responsible AI decision at a time.";
    button.dataset.personFeaturedAchievements = Array.isArray(entry.featuredAchievements)
      ? JSON.stringify(entry.featuredAchievements)
      : "";
    (["facebook", "instagram", "x"] as const).forEach((key) => {
      const item = entry as LearningHausLeaderboardData.Entry & Record<string, unknown>;
      button.dataset[`person${key[0].toUpperCase()}${key.slice(1)}Name`] = String(item[`${key}Name`] || "");
      button.dataset[`person${key[0].toUpperCase()}${key.slice(1)}Url`] = String(item[`${key}Url`] || "");
    });
  };

  const createEntryButton = (entry: LearningHausLeaderboardData.Entry, rank: number, interactive: boolean): HTMLButtonElement => {
    const button = document.createElement("button");
    button.className = "leaderboards-table__row";
    if (LearningHausAccountStorage.isCurrentUser(entry)) button.classList.add("leaderboards-table__row--current");
    if (!interactive) button.classList.add("is-static");
    button.type = "button";
    button.disabled = !interactive;
    if (interactive) applyPersonDataset(button, entry);

    const image = document.createElement("img");
    image.src = entry.avatar || emptyGif;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    const rankNode = document.createElement("span");
    rankNode.textContent = String(rank);
    const name = document.createElement("strong");
    name.textContent = entry.name;
    const level = document.createElement("span");
    level.textContent = String(LearningHausProgression.getLevelState(entry.totalXp).level);
    const score = document.createElement("span");
    score.textContent = String(entry.score);
    button.append(image, rankNode, name, level, score);
    return button;
  };

  const setPodiumSlot = (
    button: Element,
    entry: LearningHausLeaderboardData.Entry | undefined,
    rank: number,
    interactive: boolean
  ): void => {
    const personButton = button as HTMLButtonElement;
    personButton.toggleAttribute("hidden", !entry);
    if (!entry) {
      delete personButton.dataset.lookingPerson;
      return;
    }
    personButton.classList.toggle("is-static", !interactive);
    personButton.disabled = !interactive;
    if (interactive) applyPersonDataset(personButton, entry);
    else delete personButton.dataset.lookingPerson;

    personButton.setAttribute("aria-label", `${rank} ${entry.name} ${entry.score} score`);
    const image = personButton.querySelector<HTMLImageElement>("img");
    if (image) {
      image.hidden = false;
      image.src = entry.avatar || emptyGif;
      image.alt = `${entry.name} avatar`;
    }
    const rankNode = personButton.querySelector(".leaderboards-podium__rank");
    const nameNode = personButton.querySelector(".leaderboards-podium__name");
    const scoreNode = personButton.querySelector(".leaderboards-podium__exp");
    if (rankNode) rankNode.textContent = String(rank);
    if (nameNode) nameNode.textContent = entry.name;
    if (scoreNode) scoreNode.textContent = `${entry.score} ${LearningHausI18n.t("SCORE", "คะแนน")}`;
  };

  const drawLeaderboardInto = (
    root: HTMLElement,
    entries: LearningHausLeaderboardData.Entry[],
    live: boolean,
    interactive: boolean
  ): void => {
    const podium = root.querySelector(".leaderboards-podium");
    const list = root.querySelector<HTMLElement>(".leaderboards-table__list");
    const summary = root.querySelector("[data-leaderboard-summary]");
    if (!podium || !list) return;

    const podiumButtons = [
      podium.querySelector(".leaderboards-podium__item--first"),
      podium.querySelector(".leaderboards-podium__item--second"),
      podium.querySelector(".leaderboards-podium__item--third")
    ];
    podiumButtons.forEach((button, index) => {
      if (!button) return;
      setPodiumSlot(button, entries[index], index + 1, interactive);
    });

    list.replaceChildren(...entries.slice(3).map((entry, index) => createEntryButton(entry, index + 4, interactive)));

    if (summary) {
      if (!entries.length) {
        summary.textContent = LearningHausI18n.t(
          "No scores recorded for this stage yet",
          "ยังไม่มีคะแนนบันทึกไว้สำหรับด่านนี้"
        );
      } else {
        const noun = entries.length === 1 ? "learner" : "learners";
        summary.textContent = LearningHausI18n.t(
          `${entries.length} ${noun} ranked · ${live ? "Shared best scores" : "Best scores"} for this stage`,
          `จัดอันดับผู้เรียน ${entries.length} คน · ${live ? "คะแนนสูงสุดรวม" : "คะแนนสูงสุด"}ของด่านนี้`
        );
      }
    }
  };

  export const renderPostGameLeaderboard = (
    container: HTMLElement,
    stage: number,
    freshScore?: { score: number; correct: number; total: number; timeSeconds: number }
  ): void => {
    const seq = ++postGameRenderSeq;
    const profile = window.LearningHausProfile?.getProfile?.();
    const activeName = String(profile?.name || LearningHausAccountStorage.currentUserName() || "TONOAK");
    const freshEntry: LearningHausLeaderboardData.Entry | null = freshScore
      ? {
          userId: window.LearningHausSocial?.currentUserId?.() || undefined,
          name: activeName,
          avatar: resolveEntryAvatar({ name: activeName, avatar: profile?.avatar, isCurrentPlayer: true }),
          about: String(profile?.about || ""),
          catConfig: window.LearningHausPixelCat?.getActiveConfig?.()
            ? JSON.stringify(window.LearningHausPixelCat.getActiveConfig())
            : undefined,
          score: freshScore.score,
          correct: freshScore.correct,
          total: freshScore.total,
          timeSeconds: freshScore.timeSeconds,
          totalXp: Number(profile?.totalXp) || LearningHausRules.level.initialExp,
          featuredAchievements: profile?.featuredAchievements ?? null,
          message: "Improving one stage at a time."
        }
      : null;

    const social = window.LearningHausSocial;
    const localEntries = getEntries(stage);
    const immediateEntries = freshEntry ? dedupeAndSortEntries([...localEntries, freshEntry]) : localEntries;
    drawLeaderboardInto(container, immediateEntries, Boolean(social?.isConnected?.()), true);

    if (social?.isConnected?.()) {
      window.setTimeout(() => {
        if (seq !== postGameRenderSeq) return;
        void social
          .getSharedScores(stage)
          .then((rows) => {
            if (seq !== postGameRenderSeq) return;
            const shared = (rows || []).map((row) => ({
              ...row,
              avatar: resolveEntryAvatar(row),
              total: freshScore?.total || 10
            }));
            const merged = freshEntry ? dedupeAndSortEntries([...shared, freshEntry]) : dedupeAndSortEntries(shared);
            drawLeaderboardInto(container, merged, true, true);
          })
          .catch(() => {
            // Keep already-rendered immediate entries on network hiccup
          });
      }, 250);
    }
  };

  const render = (stage: number, select: HTMLSelectElement, page: HTMLElement): void => {
    const localEntries = getEntries(stage);
    const summary = page.querySelector("[data-leaderboard-summary]");
    const social = window.LearningHausSocial;
    if (social?.isConnected?.()) {
      drawLeaderboardInto(page, [], true, true);
      if (summary) summary.textContent = LearningHausI18n.t("Loading shared scores…", "กำลังโหลดคะแนนจัดอันดับรวม…");
      void social
        .getSharedScores(stage)
        .then((rows) => {
          if (Number(select.value) !== stage) return;
          const entries = (rows || []).map((row) => ({
            ...row,
            avatar: resolveEntryAvatar(row),
            total: 10
          }));
          drawLeaderboardInto(page, entries, true, true);
        })
        .catch((error: Error) => {
          if (summary) {
            summary.textContent = LearningHausI18n.t(
              `Shared scores unavailable: ${error.message}`,
              `ไม่สามารถโหลดคะแนนจัดอันดับรวมได้: ${error.message}`
            );
          }
        });
    } else {
      drawLeaderboardInto(page, localEntries, false, true);
    }
    select.setAttribute(
      "aria-label",
      LearningHausI18n.t(
        `Choose a completed stage to view scores. Current: ${formatStageLabel(stage)}`,
        `เลือกด่านที่ผ่านแล้วเพื่อดูคะแนน ปัจจุบัน: ${formatStageLabel(stage)}`
      )
    );
  };

  const refreshStages = (select: HTMLSelectElement, page: HTMLElement, requestedStage?: number): void => {
    const stages = getCompletedStages();
    const current = requestedStage && stages.includes(requestedStage) ? requestedStage : Number(select.value);
    select.replaceChildren(
      ...stages.map((stage) => {
        const option = document.createElement("option");
        option.value = String(stage);
        option.textContent = formatStageLabel(stage);
        return option;
      })
    );
    if (!stages.length) return;
    select.value = String(stages.includes(current) ? current : stages[0]);
    render(Number(select.value), select, page);
  };

  const init = (): void => {
    const page = document.querySelector<HTMLElement>(".leaderboards-page");
    const select = page?.querySelector<HTMLSelectElement>("[data-leaderboard-stage]");
    if (!page || !select) return;
    select.addEventListener("change", () => render(Number(select.value), select, page));
    refreshStages(select, page);
    window.addEventListener("learninghaus:social-session", () => {
      if (hasAnyCompletedStage()) refreshStages(select, page);
    });
    window.addEventListener("learninghaus:stage-progress-updated", () => {
      if (hasAnyCompletedStage()) refreshStages(select, page);
    });
    window.addEventListener("learninghaus:profile-updated", () => {
      syncLocalScoresWithProfile();
      if (hasAnyCompletedStage()) refreshStages(select, page);
    });
    window.addEventListener("learninghaus:leaderboard-open", (event) => {
      const stage = Number((event as CustomEvent<{ stage: number }>).detail?.stage);
      if (hasCompletedStage(stage)) refreshStages(select, page, stage);
    });
    window.addEventListener("learninghaus:quiz-stage-complete", (event) => {
      const detail = (event as CustomEvent<Record<string, unknown>>).detail || {};
      const profile = window.LearningHausProfile?.getProfile?.();
      const stage = Number(detail.index) + 1;
      const score = Number(detail.stageScore);
      if (!profile || !Number.isFinite(score) || score < 0) return;
      const localScore: LocalScore = {
        stage,
        name: String(profile.name || "TONOAK"),
        avatar: resolveEntryAvatar({ name: String(profile.name || "TONOAK"), avatar: profile.avatar, isCurrentPlayer: true }),
        score,
        correct: Number(detail.correctCount) || 0,
        total: Number(detail.totalQuestions) || 10,
        timeSeconds: Number(detail.elapsedSeconds) || 0,
        totalXp: Number(profile.totalXp) || LearningHausRules.level.initialExp,
        message: "Improving one stage at a time.",
        isCurrentPlayer: true
      };
      saveLocalScore(localScore);
      const social = window.LearningHausSocial;
      if (social?.submitScore) {
        void social
          .submitScore({
            stage,
            score,
            correct: localScore.correct,
            totalQuestions: localScore.total,
            timeSeconds: localScore.timeSeconds,
            totalXp: localScore.totalXp,
            courseId: "eu-ai-act"
          })
          .catch((error: Error) => {
            const summary = page.querySelector("[data-leaderboard-summary]");
            if (summary) {
              summary.textContent = LearningHausI18n.t(
                `Shared score was not saved: ${error.message}`,
                `ไม่สามารถบันทึกคะแนนจัดอันดับรวมได้: ${error.message}`
              );
            }
          })
          .finally(() => refreshStages(select, page, stage));
      } else {
        refreshStages(select, page, stage);
      }
    });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
}
