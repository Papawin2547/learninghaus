// Swiss Bento Minimalist Achievements Page — powered by central Achievement Engine & Profile Showcase
(() => {
  type UnlockRecord = { id: string; unlockedAt: string };
  type Snapshot = {
    metrics: LearningHausAchievementEngine.Metrics;
    unlocked?: UnlockRecord[];
    legacyUnlockedIds?: string[];
  };
  type StatusFilter = "all" | "unlocked" | "locked";

  type EvaluatedState = {
    achievement: LearningHausAchievementCatalog.Achievement;
    unlocked: boolean;
    unlockedAt: string;
    progress: ReturnType<typeof LearningHausAchievementEngine.evaluate>;
    ratio: number;
    rewardName: string;
  };

  const MAX_PINNED = 3;
  const STAR_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  const STAR_FILLED_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  const LOCK_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

  const t = (en: string, th: string): string => LearningHausI18n.t(en, th);

  const CAT_LABELS: Record<LearningHausAchievementCatalog.Category, { en: string; th: string }> = {
    general: { en: "General", th: "การเรียนทั่วไป" },
    subject: { en: "Quiz & Mastery", th: "พิชิตควิซ" },
    creator: { en: "Creator", th: "ผู้สร้าง" }
  };

  const normalizedBadgeSrc = (imagePath: string): string =>
    imagePath.replace("lesson-assets/achievements/", "lesson-assets/achievements/normalized/");

  const getRewardLabel = (achievementId: string): string => {
    const prop = LearningHausPixelCat.getRewardForAchievement(achievementId);
    if (prop?.name) return prop.name;
    const bg = LearningHausPixelCat.AVATAR_BACKGROUNDS.find((item) => item.achievementId === achievementId);
    if (bg) return LearningHausPixelCat.localizeBgName(bg);
    return "";
  };

  const init = () => {
    const page = document.querySelector<HTMLElement>('[data-home-panel="achievement"]');
    const grid = page?.querySelector<HTMLElement>("[data-achievement-grid]");
    const tabs = page?.querySelector<HTMLElement>("[data-achievement-tabs]");
    const panel = page?.querySelector<HTMLElement>("[data-achievement-panel]");
    if (!page || !grid || !tabs || !panel) return;

    const ringEl = page.querySelector<HTMLElement>("[data-achievement-ring]");
    const pctEl = page.querySelector<HTMLElement>("[data-achievement-pct]");
    const countEl = page.querySelector<HTMLElement>("[data-achievement-count]");
    const catBarsHost = page.querySelector<HTMLElement>("[data-achievement-cat-bars]");
    const nextBox = page.querySelector<HTMLElement>("[data-achievement-next]");
    const nextImg = page.querySelector<HTMLImageElement>("[data-achievement-next-img]");
    const nextTitle = page.querySelector<HTMLElement>("[data-achievement-next-title]");
    const nextReq = page.querySelector<HTMLElement>("[data-achievement-next-req]");
    const nextRatio = page.querySelector<HTMLElement>("[data-achievement-next-ratio]");
    const nextFill = page.querySelector<HTMLElement>("[data-achievement-next-fill]");
    const emptyEl = page.querySelector<HTMLElement>("[data-achievement-empty]");

    const drawerBg = document.querySelector<HTMLElement>("[data-achievement-drawer]");
    if (drawerBg && drawerBg.parentElement !== document.body) {
      document.body.appendChild(drawerBg);
    }
    const drImg = drawerBg?.querySelector<HTMLImageElement>("[data-ach-dr-img]");
    const drTitle = drawerBg?.querySelector<HTMLElement>("[data-ach-dr-title]");
    const drDesc = drawerBg?.querySelector<HTMLElement>("[data-ach-dr-desc]");
    const drReq = drawerBg?.querySelector<HTMLElement>("[data-ach-dr-req]");
    const drBar = drawerBg?.querySelector<HTMLElement>("[data-ach-dr-bar]");
    const drProg = drawerBg?.querySelector<HTMLElement>("[data-ach-dr-prog]");
    const drRewardBox = drawerBg?.querySelector<HTMLElement>("[data-ach-dr-reward-box]");
    const drReward = drawerBg?.querySelector<HTMLElement>("[data-ach-dr-reward]");
    const drPinBtn = drawerBg?.querySelector<HTMLButtonElement>("[data-ach-dr-pin]");

    const total = LearningHausAchievementCatalog.all.length;
    if (ringEl) ringEl.setAttribute("aria-valuemax", String(total));

    let activeCategory: LearningHausAchievementCatalog.Category = "general";
    let activeStatusFilter: StatusFilter = "all";
    let latestSnapshot: Snapshot | null = null;
    let evaluatedMap = new Map<string, EvaluatedState>();
    let closestAchievementId = LearningHausAchievementCatalog.all[0]?.id || "beginner";
    let openDrawerId: string | null = null;

    const getPinnedIds = (): string[] => {
      const saved = window.LearningHausProfile?.getProfile?.()?.featuredAchievements;
      if (Array.isArray(saved)) return saved.slice(0, MAX_PINNED);
      return [];
    };

    const togglePinAchievement = async (achievementId: string): Promise<void> => {
      const state = evaluatedMap.get(achievementId);
      if (!state?.unlocked) return;
      const current = getPinnedIds().filter((id) => evaluatedMap.get(id)?.unlocked);
      let next: string[];
      if (current.includes(achievementId)) {
        next = current.filter((id) => id !== achievementId);
      } else {
        next = [...current];
        if (next.length >= MAX_PINNED) next.shift();
        next.push(achievementId);
      }
      await window.LearningHausProfile?.setFeaturedAchievements?.(next);
      syncPinButtons();
      if (openDrawerId === achievementId && drawerBg && !drawerBg.hidden) {
        renderDrawer(achievementId);
      }
    };

    // Build category tabs
    const tabButtons = LearningHausAchievementCatalog.categories.map((category, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "achievement-page__tab";
      button.id = `achievement-tab-${category.id}`;
      button.dataset.achievementCategory = category.id;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", "achievement-panel");
      button.setAttribute("aria-selected", String(index === 0));
      button.tabIndex = index === 0 ? 0 : -1;

      const label = document.createElement("span");
      label.dataset.catLabel = category.id;
      const loc = CAT_LABELS[category.id];
      label.textContent = t(loc.en, loc.th);

      const badgeCount = document.createElement("span");
      badgeCount.className = "achievement-page__tab-count";
      badgeCount.dataset.categoryCount = category.id;
      badgeCount.textContent = `0/${LearningHausAchievementCatalog.all.filter((item) => item.category === category.id).length}`;

      button.append(label, badgeCount);
      return button;
    });
    tabs.replaceChildren(...tabButtons);

    // Build clean 2-column Swiss Bento cards (preserving .achievement-page__card & .is-unlocked compatibility)
    const cards = LearningHausAchievementCatalog.all.map((achievement) => {
      const card = document.createElement("article");
      card.className = "achievement-page__card achievement-page__card--locked";
      card.dataset.achievementId = achievement.id;
      card.dataset.achievementCategory = achievement.category;
      card.dataset.achievementName = achievement.name;
      card.setAttribute("role", "listitem");
      card.setAttribute("aria-disabled", "true");
      card.tabIndex = 0;

      const imageWrap = document.createElement("div");
      imageWrap.className = "achievement-page__badge-wrap";
      const image = document.createElement("img");
      image.src = normalizedBadgeSrc(achievement.imagePath);
      image.alt = `${achievement.name} achievement badge`;
      image.loading = "lazy";
      image.decoding = "async";
      imageWrap.append(image);

      const copy = document.createElement("div");
      copy.className = "achievement-page__card-copy";

      const title = document.createElement("h2");
      title.textContent = achievement.name;

      const requirement = document.createElement("p");
      requirement.className = "achievement-page__requirement";
      requirement.textContent = achievement.requirement;

      const footerRow = document.createElement("div");
      footerRow.className = "ach-card__meta";
      footerRow.dataset.achCardMeta = "";

      const progressWrap = document.createElement("div");
      progressWrap.className = "ach-card__bar-wrap";
      progressWrap.dataset.achCardBarWrap = "";
      const track = document.createElement("div");
      track.className = "ach-hairline";
      track.setAttribute("role", "progressbar");
      track.setAttribute("aria-label", `${achievement.name} progress`);
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", "1");
      track.setAttribute("aria-valuenow", "0");
      const barFill = document.createElement("span");
      barFill.dataset.achCardFill = "";
      track.append(barFill);
      progressWrap.append(track);

      copy.append(title, requirement, footerRow, progressWrap);

      const rightSlot = document.createElement("div");
      rightSlot.className = "ach-card__right";
      rightSlot.dataset.achCardRight = "";

      card.append(imageWrap, copy, rightSlot);
      return card;
    });

    grid.id = "achievement-grid";
    panel.id = "achievement-panel";
    grid.replaceChildren(...cards);

    const applyVisibility = (): void => {
      let visibleCount = 0;
      cards.forEach((card) => {
        const id = card.dataset.achievementId || "";
        const catMatch = card.dataset.achievementCategory === activeCategory;
        const unlocked = Boolean(evaluatedMap.get(id)?.unlocked);
        const statusMatch =
          activeStatusFilter === "all" ||
          (activeStatusFilter === "unlocked" && unlocked) ||
          (activeStatusFilter === "locked" && !unlocked);
        const show = catMatch && statusMatch;
        card.hidden = !show;
        if (show) visibleCount += 1;
      });
      if (emptyEl) {
        emptyEl.hidden = visibleCount > 0;
        if (visibleCount === 0) {
          emptyEl.textContent =
            activeStatusFilter === "unlocked"
              ? t("No unlocked badges in this category yet.", "ยังไม่มีเหรียญที่ปลดล็อกในหมวดนี้")
              : t("All badges in this category are already unlocked!", "ปลดล็อกเหรียญในหมวดนี้ครบทั้งหมดแล้ว!");
        }
      }
    };

    const setCategory = (categoryId: LearningHausAchievementCatalog.Category, focus = false): void => {
      activeCategory = categoryId;
      tabButtons.forEach((button) => {
        const selected = button.dataset.achievementCategory === categoryId;
        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;
        if (selected && focus) button.focus();
      });
      panel.setAttribute("aria-labelledby", `achievement-tab-${categoryId}`);
      applyVisibility();
    };

    const setStatusFilter = (filter: StatusFilter): void => {
      activeStatusFilter = filter;
      page.querySelectorAll<HTMLButtonElement>("[data-achievement-filter]").forEach((btn) => {
        const active = btn.dataset.achievementFilter === filter;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", String(active));
      });
      applyVisibility();
    };

    const syncPinButtons = (): void => {
      const pinnedSet = new Set(getPinnedIds());
      grid.querySelectorAll<HTMLButtonElement>("[data-achievement-pin]").forEach((btn) => {
        const id = btn.dataset.achievementPin || "";
        const pinned = pinnedSet.has(id);
        btn.classList.toggle("is-pinned", pinned);
        btn.setAttribute("aria-pressed", String(pinned));
        btn.title = pinned
          ? t("Pinned on Profile & Leaderboard (click to remove)", "ปักหมุดบนโปรไฟล์แล้ว (คลิกเพื่อนำออก)")
          : t("Pin to Profile & Leaderboard (up to 3)", "ปักหมุดแสดงบนโปรไฟล์ (สูงสุด 3 เหรียญ)");
        btn.innerHTML = pinned ? STAR_FILLED_SVG : STAR_SVG;
      });
    };

    const renderDrawer = (achievementId: string): void => {
      if (!drawerBg) return;
      const st = evaluatedMap.get(achievementId);
      if (!st) return;
      openDrawerId = achievementId;
      const { achievement, unlocked, unlockedAt, progress, ratio, rewardName } = st;
      const pinned = getPinnedIds().includes(achievement.id);

      if (drImg) {
        drImg.src = normalizedBadgeSrc(achievement.imagePath);
        drImg.alt = `${achievement.name} badge`;
        drImg.classList.toggle("is-locked", !unlocked);
      }
      if (drTitle) drTitle.textContent = LearningHausAchievementCatalog.localizeName(achievement);
      if (drDesc) drDesc.textContent = LearningHausAchievementCatalog.localizeDescription(achievement);
      if (drReq) drReq.textContent = LearningHausAchievementCatalog.localizeRequirement(achievement);
      if (drBar) drBar.style.width = `${unlocked ? 100 : Math.round(ratio * 100)}%`;
      if (drProg) {
        if (unlocked) {
          const d = unlockedAt ? new Date(unlockedAt) : null;
          const validDate = d && Number.isFinite(d.getTime());
          drProg.textContent = validDate
            ? `${t("Unlocked", "ปลดล็อกแล้ว")} · ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(d)}`
            : t("Unlocked", "ปลดล็อกแล้ว");
        } else {
          drProg.textContent = progress.label || t("Locked", "ยังไม่ปลดล็อก");
        }
      }
      if (drRewardBox && drReward) {
        if (rewardName) {
          drRewardBox.hidden = false;
          drReward.textContent = t(
            `Unlocks "${rewardName}" in Pixel Cat Studio`,
            `ปลดล็อก "${rewardName}" ในห้องแต่งตัวแมว`
          );
        } else {
          drRewardBox.hidden = true;
        }
      }
      if (drPinBtn) {
        drPinBtn.disabled = !unlocked;
        drPinBtn.classList.toggle("is-pinned", pinned);
        if (!unlocked) {
          drPinBtn.textContent = t("Unlock badge to pin on profile", "ปลดล็อกเหรียญก่อนเพื่อปักหมุดบนโปรไฟล์");
        } else {
          drPinBtn.textContent = pinned
            ? t("Pinned on Profile (Click to remove)", "ปักหมุดบนโปรไฟล์แล้ว (คลิกเพื่อนำออก)")
            : t("Pin to Leaderboard Profile", "ปักหมุดแสดงบนหน้าโปรไฟล์และอันดับ");
        }
      }
      drawerBg.hidden = false;
    };

    const closeDrawer = (): void => {
      if (drawerBg) drawerBg.hidden = true;
      openDrawerId = null;
    };

    const storedUnlocks = (): Record<string, string> => {
      try {
        const key = LearningHausAccountStorage.key("learninghaus.achievement.unlockedAt");
        return JSON.parse(localStorage.getItem(key) || "{}") as Record<string, string>;
      } catch {
        return {};
      }
    };

    const saveUnlocks = (value: Record<string, string>): void => {
      try {
        localStorage.setItem(LearningHausAccountStorage.key("learninghaus.achievement.unlockedAt"), JSON.stringify(value));
      } catch {
        /* ignore storage errors */
      }
    };

    const update = (snapshot: Snapshot): void => {
      latestSnapshot = snapshot;
      const base = snapshot.metrics;
      const hubOverlay = window.LearningHausLearnHub?.getAchievementMetricsOverlay?.();
      const claimedQuests = window.LearningHausQuests?.getTotalClaimedQuestsCount?.() || 0;
      const metrics: LearningHausAchievementEngine.Metrics = {
        ...base,
        completedLessons: (base.completedLessons || 0) + (hubOverlay?.extraLessons || 0),
        completedQuizzes: (base.completedQuizzes || 0) + (hubOverlay?.extraQuizzes || 0),
        completedCourses: (base.completedCourses || 0) + (hubOverlay?.extraCourses || 0),
        subjects: Math.max(base.subjects || 0, hubOverlay?.subjectsCount || 0),
        claimedQuests,
        creator: {
          available: Boolean(base.creator?.available || hubOverlay?.creator?.available),
          publishedCourses: Math.max(base.creator?.publishedCourses || 0, hubOverlay?.creator?.publishedCourses || 0),
          createdLessons: Math.max(base.creator?.createdLessons || 0, hubOverlay?.creator?.createdLessons || 0),
          assignedQuests: hubOverlay?.creator?.assignedQuests || 0,
          completedStudents: Math.max(base.creator?.completedStudents || 0, hubOverlay?.creator?.completedStudents || 0)
        }
      };
      const saved = storedUnlocks();
      const serverUnlocks = new Map((snapshot.unlocked || []).map((item) => [item.id, item.unlockedAt]));
      const legacy = new Set(snapshot.legacyUnlockedIds || []);
      const pinnedSet = new Set(getPinnedIds());

      let unlockedCount = 0;
      const nextMap = new Map<string, EvaluatedState>();
      const lockedCandidates: EvaluatedState[] = [];

      for (const achievement of LearningHausAchievementCatalog.all) {
        const progress = LearningHausAchievementEngine.evaluate(achievement, metrics);
        const unlockedAt = serverUnlocks.get(achievement.id) || saved[achievement.id] || "";
        const unlocked = progress.unlocked || Boolean(unlockedAt) || legacy.has(achievement.id);
        if (unlocked && !saved[achievement.id]) saved[achievement.id] = unlockedAt || new Date().toISOString();
        if (unlocked) unlockedCount += 1;

        const ratio = unlocked
          ? 1
          : progress.trackable && progress.current !== null && progress.target
            ? Math.max(0, Math.min(0.99, progress.current / progress.target))
            : 0;
        const rewardName = getRewardLabel(achievement.id);
        const st: EvaluatedState = { achievement, unlocked, unlockedAt, progress, ratio, rewardName };
        nextMap.set(achievement.id, st);
        if (!unlocked) lockedCandidates.push(st);

        const card = grid.querySelector<HTMLElement>(`[data-achievement-id="${CSS.escape(achievement.id)}"]`);
        if (!card) continue;

        card.classList.toggle("achievement-page__card--locked", !unlocked);
        card.classList.toggle("is-unlocked", unlocked);
        card.setAttribute("aria-disabled", String(!unlocked));
        card.setAttribute("aria-label", `${achievement.name}. ${unlocked ? "Unlocked." : "Locked."} ${achievement.requirement}`);

        const metaRow = card.querySelector<HTMLElement>("[data-ach-card-meta]");
        const barWrap = card.querySelector<HTMLElement>("[data-ach-card-bar-wrap]");
        const barFill = card.querySelector<HTMLElement>("[data-ach-card-fill]");
        const titleEl = card.querySelector<HTMLElement>("h2");
        if (titleEl) titleEl.textContent = LearningHausAchievementCatalog.localizeName(achievement);
        const reqEl = card.querySelector<HTMLElement>(".achievement-page__requirement");
        if (reqEl) reqEl.textContent = LearningHausAchievementCatalog.localizeRequirement(achievement);

        const track = barWrap?.querySelector<HTMLElement>("[role=progressbar]");
        const rightSlot = card.querySelector<HTMLElement>("[data-ach-card-right]");

        if (metaRow) {
          if (unlocked) {
            metaRow.hidden = false;
            metaRow.innerHTML = `<span class="ach-chip ach-chip--done">${t("Unlocked", "ปลดล็อกแล้ว")}</span>${
              rewardName ? `<span class="ach-chip ach-chip--reward">${rewardName}</span>` : ""
            }`;
          } else if (rewardName) {
            metaRow.hidden = false;
            metaRow.innerHTML = `<span class="ach-chip ach-chip--reward-muted">${rewardName}</span>`;
          } else {
            metaRow.hidden = true;
            metaRow.innerHTML = "";
          }
        }

        if (barWrap && barFill) {
          const showBar = !unlocked && progress.trackable && progress.current !== null && Boolean(progress.target);
          barWrap.hidden = !showBar;
          if (showBar && progress.current !== null && progress.target) {
            barFill.style.width = `${Math.min(100, Math.round((progress.current / progress.target) * 100))}%`;
            track?.setAttribute("aria-valuemax", String(progress.target));
            track?.setAttribute("aria-valuenow", String(Math.min(progress.current, progress.target)));
          } else {
            barFill.style.width = "0%";
          }
        }

        if (rightSlot) {
          if (unlocked) {
            const pinned = pinnedSet.has(achievement.id);
            rightSlot.innerHTML = `<button type="button" class="ach-pin-btn${pinned ? " is-pinned" : ""}" data-achievement-pin="${achievement.id}" aria-pressed="${pinned}" aria-label="${t("Pin badge to profile", "ปักหมุดเหรียญบนโปรไฟล์")}">${pinned ? STAR_FILLED_SVG : STAR_SVG}</button>`;
          } else if (progress.trackable && progress.current !== null && progress.target) {
            rightSlot.innerHTML = `<span class="ach-ratio-txt">${Math.min(progress.current, progress.target)}/${progress.target}</span>`;
          } else {
            rightSlot.innerHTML = `<span class="ach-lock-ico" aria-hidden="true">${LOCK_SVG}</span>`;
          }
        }
      }

      evaluatedMap = nextMap;
      saveUnlocks(saved);

      // Update Swiss Bento Summary Ring & Category Breakdown Bars
      const pct = total ? Math.round((unlockedCount / total) * 100) : 0;
      if (ringEl) {
        ringEl.style.setProperty("--ach-pct", `${pct}%`);
        ringEl.setAttribute("aria-valuenow", String(unlockedCount));
      }
      if (pctEl) pctEl.textContent = `${pct}%`;
      if (countEl) countEl.textContent = `${unlockedCount} / ${total}`;
      document.querySelectorAll<HTMLElement>("[data-hud-ach-count]").forEach((el) => {
        el.textContent = `${unlockedCount}/${total}`;
      });

      if (catBarsHost) {
        catBarsHost.innerHTML = LearningHausAchievementCatalog.categories
          .map((cat) => {
            const items = LearningHausAchievementCatalog.all.filter((i) => i.category === cat.id);
            const done = items.filter((i) => evaluatedMap.get(i.id)?.unlocked).length;
            const cpct = items.length ? Math.round((done / items.length) * 100) : 0;
            const loc = CAT_LABELS[cat.id];
            return `
              <div class="ach-cat-bar">
                <span>${t(loc.en, loc.th)} <b>${done}/${items.length}</b></span>
                <div class="ach-hairline"><span style="width:${cpct}%"></span></div>
              </div>
            `;
          })
          .join("");
      }

      // Update tab counters & localized labels
      LearningHausAchievementCatalog.categories.forEach((category) => {
        const items = LearningHausAchievementCatalog.all.filter((item) => item.category === category.id);
        const done = items.filter((item) => evaluatedMap.get(item.id)?.unlocked).length;
        const buttonCount = tabs.querySelector<HTMLElement>(`[data-category-count="${CSS.escape(category.id)}"]`);
        if (buttonCount) buttonCount.textContent = `${done}/${items.length}`;
        const labelNode = tabs.querySelector<HTMLElement>(`[data-cat-label="${CSS.escape(category.id)}"]`);
        if (labelNode) labelNode.textContent = t(CAT_LABELS[category.id].en, CAT_LABELS[category.id].th);
      });

      // Update Closest Next Unlock Bento Tile
      if (nextBox && nextImg && nextTitle && nextReq && nextRatio && nextFill) {
        if (lockedCandidates.length === 0) {
          const master = LearningHausAchievementCatalog.all.find((a) => a.id === "master") || LearningHausAchievementCatalog.all[0];
          closestAchievementId = master.id;
          nextImg.src = normalizedBadgeSrc(master.imagePath);
          nextImg.alt = master.name;
          nextTitle.textContent = t("All Badges Unlocked!", "ปลดล็อกครบทุกเหรียญแล้ว!");
          nextReq.textContent = t("You completed the entire LearningHaus badge collection.", "คุณสะสมเหรียญความสำเร็จครบทุกหมวดเรียบร้อยแล้ว");
          nextRatio.textContent = `${total} / ${total}`;
          nextFill.style.width = "100%";
        } else {
          lockedCandidates.sort((a, b) => b.ratio - a.ratio);
          const pick = lockedCandidates[0];
          closestAchievementId = pick.achievement.id;
          nextImg.src = normalizedBadgeSrc(pick.achievement.imagePath);
          nextImg.alt = LearningHausAchievementCatalog.localizeName(pick.achievement);
          nextTitle.textContent = LearningHausAchievementCatalog.localizeName(pick.achievement);
          nextReq.textContent = LearningHausAchievementCatalog.localizeRequirement(pick.achievement);
          if (pick.progress.trackable && pick.progress.current !== null && pick.progress.target) {
            nextRatio.textContent = `${Math.min(pick.progress.current, pick.progress.target)} / ${pick.progress.target}`;
            nextFill.style.width = `${Math.round(pick.ratio * 100)}%`;
          } else {
            nextRatio.textContent = `0 / 1`;
            nextFill.style.width = "0%";
          }
        }
      }

      syncPinButtons();
      applyVisibility();
      if (openDrawerId && drawerBg && !drawerBg.hidden) {
        renderDrawer(openDrawerId);
      }
    };

    // Event wiring
    tabButtons.forEach((button, index) => {
      button.addEventListener("click", () =>
        setCategory(button.dataset.achievementCategory as LearningHausAchievementCatalog.Category)
      );
      button.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabButtons.length - 1
              : (index + (event.key === "ArrowRight" ? 1 : tabButtons.length - 1)) % tabButtons.length;
        setCategory(tabButtons[next].dataset.achievementCategory as LearningHausAchievementCatalog.Category, true);
      });
    });

    page.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      const filterBtn = target?.closest<HTMLButtonElement>("[data-achievement-filter]");
      if (filterBtn?.dataset.achievementFilter) {
        setStatusFilter(filterBtn.dataset.achievementFilter as StatusFilter);
        return;
      }
      const pinBtn = target?.closest<HTMLButtonElement>("[data-achievement-pin]");
      if (pinBtn?.dataset.achievementPin) {
        event.stopPropagation();
        void togglePinAchievement(pinBtn.dataset.achievementPin);
        return;
      }
      if (target?.closest("[data-achievement-next]")) {
        renderDrawer(closestAchievementId);
        return;
      }
      const card = target?.closest<HTMLElement>(".achievement-page__card[data-achievement-id]");
      if (card?.dataset.achievementId) {
        renderDrawer(card.dataset.achievementId);
      }
    });

    page.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("button")) return;
      if (target?.closest("[data-achievement-next]")) {
        event.preventDefault();
        renderDrawer(closestAchievementId);
        return;
      }
      const card = target?.closest<HTMLElement>(".achievement-page__card[data-achievement-id]");
      if (card?.dataset.achievementId) {
        event.preventDefault();
        renderDrawer(card.dataset.achievementId);
      }
    });

    drawerBg?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (target === drawerBg || target?.closest("[data-achievement-drawer-close]")) {
        closeDrawer();
        return;
      }
      if (target?.closest("[data-ach-dr-pin]") && openDrawerId) {
        void togglePinAchievement(openDrawerId);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && drawerBg && !drawerBg.hidden) {
        event.preventDefault();
        closeDrawer();
      }
    });

    window.addEventListener("learninghaus:achievement-progress", (event) =>
      update((event as CustomEvent<Snapshot>).detail)
    );
    window.addEventListener("learninghaus:social-session", () => {
      const social = (window as Window & { LearningHausSocial?: { getAchievementSnapshot?: () => Promise<Snapshot> } })
        .LearningHausSocial;
      void social
        ?.getAchievementSnapshot?.()
        .then((snapshot) => {
          update(snapshot);
          window.dispatchEvent(new CustomEvent("learninghaus:achievement-server-loaded", { detail: snapshot }));
        })
        .catch(() => {
          /* keep local progress when offline */
        });
    });
    window.addEventListener("learninghaus:achievement-server-snapshot", (event) => {
      const snapshot = (event as CustomEvent<Snapshot>).detail;
      update(snapshot);
      window.dispatchEvent(new CustomEvent("learninghaus:achievement-server-loaded", { detail: snapshot }));
    });
    window.addEventListener("learninghaus:profile-updated", () => {
      syncPinButtons();
      if (openDrawerId && drawerBg && !drawerBg.hidden) renderDrawer(openDrawerId);
    });
    window.addEventListener("learninghaus:language-changed", () => {
      if (latestSnapshot) update(latestSnapshot);
    });
    window.addEventListener("learninghaus:library-updated", () => {
      if (latestSnapshot) update(latestSnapshot);
    });
    window.addEventListener("learninghaus:quest-updated", () => {
      if (latestSnapshot) update(latestSnapshot);
    });

    setCategory("general");

    if (!latestSnapshot) {
      const empty: LearningHausAchievementEngine.Metrics = {
        completedLessons: 0,
        completedQuizzes: 0,
        perfectQuizzes: 0,
        fastStages: 0,
        comebackPasses: null,
        subjects: 0,
        improvedReplays: 0,
        activeDays: 0,
        completedCourses: 0,
        chapterProgress: {},
        creator: { available: false, publishedCourses: 0, createdLessons: 0, completedStudents: 0 }
      };
      update({ metrics: empty });
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
