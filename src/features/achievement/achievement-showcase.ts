// Dedicated page controller for selecting up to 3 unlocked achievements to display on the leaderboard profile.
(() => {
  type UnlockRecord = { id: string; unlockedAt: string };
  type Snapshot = {
    metrics: LearningHausAchievementEngine.Metrics;
    unlocked?: UnlockRecord[];
    legacyUnlockedIds?: string[];
  };

  const MAX_SHOWCASE = 3;
  const DEFAULT_SHOWCASE_ORDER = ["beginner", "expert", "master"];

  const initAchievementShowcase = (): void => {
    const page = document.querySelector<HTMLElement>('[data-home-panel="achievement-showcase"]');
    const slotsContainer = page?.querySelector<HTMLElement>("[data-showcase-slots]");
    const tabsContainer = page?.querySelector<HTMLElement>("[data-showcase-tabs]");
    const grid = page?.querySelector<HTMLElement>("[data-showcase-grid]");
    const countNode = page?.querySelector<HTMLElement>("[data-showcase-count]");
    const clearBtn = page?.querySelector<HTMLButtonElement>("[data-showcase-clear]");
    const saveBtn = page?.querySelector<HTMLButtonElement>("[data-showcase-save]");
    const viewLeaderboardBtn = page?.querySelector<HTMLButtonElement>("[data-showcase-view-leaderboard]");
    const feedbackNode = page?.querySelector<HTMLElement>("[data-showcase-feedback]");
    if (!page || !slotsContainer || !tabsContainer || !grid) return;

    let activeFilter: "all" | LearningHausAchievementCatalog.Category = "all";
    let latestSnapshot: Snapshot | null = null;
    let draftIds: string[] = [];
    let initializedFromProfile = false;
    let feedbackTimer: number | undefined;
    let saving = false;
    let queuedSave = false;

    const getUnlockedSet = (): Set<string> => {
      const unlocked = new Set<string>();
      if (latestSnapshot) {
        for (const item of latestSnapshot.unlocked || []) unlocked.add(item.id);
        for (const id of latestSnapshot.legacyUnlockedIds || []) unlocked.add(id);
        for (const achievement of LearningHausAchievementCatalog.all) {
          if (LearningHausAchievementEngine.evaluate(achievement, latestSnapshot.metrics).unlocked) {
            unlocked.add(achievement.id);
          }
        }
      }
      try {
        const key = LearningHausAccountStorage.key("learninghaus.achievement.unlockedAt");
        const stored = JSON.parse(window.localStorage.getItem(key) || "{}") as Record<string, string>;
        for (const [id, timestamp] of Object.entries(stored)) {
          if (timestamp) unlocked.add(id);
        }
      } catch {
        // Ignore storage errors.
      }
      document.querySelectorAll<HTMLElement>(".achievement-page__card.is-unlocked[data-achievement-id]").forEach((card) => {
        const id = card.dataset.achievementId;
        if (id) unlocked.add(id);
      });
      return unlocked;
    };

    const showFeedback = (text: string, isWarning = false): void => {
      if (!feedbackNode) return;
      feedbackNode.textContent = text;
      feedbackNode.classList.toggle("is-warning", isWarning);
      feedbackNode.hidden = !text;
      window.clearTimeout(feedbackTimer);
      if (text) {
        feedbackTimer = window.setTimeout(() => {
          feedbackNode.hidden = true;
        }, 3400);
      }
    };

    const syncDraftFromProfile = (): void => {
      const profile = window.LearningHausProfile?.getProfile?.();
      const saved = profile?.featuredAchievements;
      const unlocked = getUnlockedSet();
      if (Array.isArray(saved)) {
        draftIds = saved.filter((id) => unlocked.has(id) || !latestSnapshot).slice(0, MAX_SHOWCASE);
        initializedFromProfile = true;
      } else if (!initializedFromProfile) {
        draftIds = DEFAULT_SHOWCASE_ORDER.filter((id) => unlocked.has(id)).slice(0, MAX_SHOWCASE);
      }
    };

    const persistDraft = async (navigateAfter?: "profile" | "leaderboards"): Promise<void> => {
      if (saving) {
        queuedSave = true;
        return;
      }
      saving = true;
      const payload = [...draftIds];
      const ok = Boolean(await window.LearningHausProfile?.setFeaturedAchievements?.(payload));
      saving = false;
      if (queuedSave) {
        queuedSave = false;
        await persistDraft(navigateAfter);
        return;
      }
      if (ok) {
        initializedFromProfile = true;
        showFeedback(
          payload.length
            ? LearningHausI18n.t(
                `Saved ${payload.length} achievement${payload.length === 1 ? "" : "s"} to display on your leaderboard profile.`,
                `บันทึกเหรียญความสำเร็จ ${payload.length} รายการสำหรับแสดงบนหน้าอันดับแล้ว`
              )
            : LearningHausI18n.t("Cleared leaderboard display achievements.", "ล้างรายการเหรียญที่แสดงบนหน้าอันดับแล้ว")
        );
        if (navigateAfter === "profile") {
          document.querySelector<HTMLElement>('.home-sidebar [data-home-nav="profile"]')?.click();
        } else if (navigateAfter === "leaderboards") {
          window.dispatchEvent(new CustomEvent("learninghaus:open-home-panel", { detail: { panel: "leaderboards" } }));
        }
      } else {
        showFeedback(
          LearningHausI18n.t("Could not update showcase selection right now.", "ไม่สามารถอัปเดตเหรียญที่แสดงได้ในขณะนี้"),
          true
        );
      }
    };

    const renderTabs = (unlocked: Set<string>): void => {
      const filters: { id: "all" | LearningHausAchievementCatalog.Category; label: string }[] = [
        { id: "all", label: LearningHausI18n.t("All", "ทั้งหมด") },
        ...LearningHausAchievementCatalog.categories.map((cat) => ({
          id: cat.id,
          label: LearningHausAchievementCatalog.localizeCategoryLabel(cat)
        }))
      ];
      tabsContainer.replaceChildren(
        ...filters.map((filter) => {
          const matching =
            filter.id === "all"
              ? LearningHausAchievementCatalog.all
              : LearningHausAchievementCatalog.all.filter((item) => item.category === filter.id);
          const unlockedCount = matching.filter((item) => unlocked.has(item.id)).length;
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `achievement-showcase__tab${activeFilter === filter.id ? " is-active" : ""}`;
          btn.dataset.showcaseFilter = filter.id;
          btn.setAttribute("role", "tab");
          btn.setAttribute("aria-selected", String(activeFilter === filter.id));
          const labelSpan = document.createElement("span");
          labelSpan.textContent = filter.label;
          const countSpan = document.createElement("span");
          countSpan.className = "achievement-showcase__tab-count";
          countSpan.textContent = `${unlockedCount}/${matching.length}`;
          btn.append(labelSpan, countSpan);
          btn.addEventListener("click", () => {
            activeFilter = filter.id;
            renderAll();
          });
          return btn;
        })
      );
    };

    const renderSlots = (): void => {
      if (countNode) countNode.textContent = String(draftIds.length);
      if (clearBtn) clearBtn.disabled = draftIds.length === 0;
      if (viewLeaderboardBtn) {
        viewLeaderboardBtn.hidden = !LearningHausLeaderboards.hasAnyCompletedStage();
      }

      const slotNodes: HTMLElement[] = [];
      for (let index = 0; index < MAX_SHOWCASE; index += 1) {
        const id = draftIds[index];
        const achievement = id ? LearningHausAchievementCatalog.all.find((item) => item.id === id) : undefined;
        const slot = document.createElement("div");
        slot.className = `achievement-showcase__slot${achievement ? " is-filled" : " is-empty"}`;
        slot.dataset.showcaseSlot = String(index + 1);

        const order = document.createElement("span");
        order.className = "achievement-showcase__slot-order";
        order.textContent = `#${index + 1}`;

        if (achievement) {
          const locName = LearningHausAchievementCatalog.localizeName(achievement);
          const img = document.createElement("img");
          img.src = achievement.imagePath.replace("lesson-assets/achievements/", "lesson-assets/achievements/normalized/");
          img.alt = `${locName} badge`;
          const name = document.createElement("strong");
          name.textContent = locName;
          const removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.className = "achievement-showcase__slot-remove";
          removeBtn.setAttribute("aria-label", `${LearningHausI18n.t("Remove", "นำออก")} ${locName}`);
          removeBtn.textContent = LearningHausI18n.t("Remove", "นำออก");
          removeBtn.addEventListener("click", () => {
            draftIds = draftIds.filter((item) => item !== achievement.id);
            renderAll();
            void persistDraft();
          });
          slot.append(order, img, name, removeBtn);
        } else {
          const empty = document.createElement("span");
          empty.className = "achievement-showcase__slot-empty";
          empty.textContent = LearningHausI18n.t("Select an unlocked badge below", "เลือกเหรียญที่ปลดล็อกด้านล่าง");
          slot.append(order, empty);
        }
        slotNodes.push(slot);
      }
      slotsContainer.replaceChildren(...slotNodes);
    };

    const renderGrid = (unlocked: Set<string>): void => {
      const items = LearningHausAchievementCatalog.all
        .filter((item) => activeFilter === "all" || item.category === activeFilter)
        .slice()
        .sort((a, b) => Number(unlocked.has(b.id)) - Number(unlocked.has(a.id)));

      grid.replaceChildren(
        ...items.map((achievement) => {
          const isUnlocked = unlocked.has(achievement.id);
          const slotIndex = draftIds.indexOf(achievement.id);
          const isSelected = slotIndex >= 0;

          const card = document.createElement("button");
          card.type = "button";
          card.className = `achievement-showcase__card${isUnlocked ? " is-unlocked" : " is-locked"}${isSelected ? " is-selected" : ""}`;
          card.dataset.showcaseAchievementId = achievement.id;
          card.setAttribute("role", "listitem");
          card.setAttribute("aria-pressed", String(isSelected));
          card.disabled = !isUnlocked;

          const imgWrap = document.createElement("div");
          imgWrap.className = "achievement-showcase__badge-wrap";
          const img = document.createElement("img");
          img.src = achievement.imagePath.replace("lesson-assets/achievements/", "lesson-assets/achievements/normalized/");
          img.alt = `${achievement.name} badge`;
          imgWrap.append(img);

          const copy = document.createElement("div");
          copy.className = "achievement-showcase__card-copy";
          const title = document.createElement("h3");
          title.textContent = LearningHausAchievementCatalog.localizeName(achievement);
          const desc = document.createElement("p");
          desc.textContent = isUnlocked
            ? LearningHausAchievementCatalog.localizeDescription(achievement)
            : LearningHausAchievementCatalog.localizeRequirement(achievement);
          const state = document.createElement("span");
          state.className = "achievement-showcase__card-state";
          state.textContent = isSelected
            ? LearningHausI18n.t(`Displayed (#${slotIndex + 1})`, `กำลังแสดง (#${slotIndex + 1})`)
            : isUnlocked
              ? LearningHausI18n.t("Unlocked · Click to display", "ปลดล็อกแล้ว · คลิกเพื่อแสดง")
              : LearningHausI18n.t("Locked", "ยังไม่ปลดล็อก");
          copy.append(title, desc, state);
          card.append(imgWrap, copy);

          card.addEventListener("click", () => {
            if (!isUnlocked) return;
            if (isSelected) {
              draftIds = draftIds.filter((item) => item !== achievement.id);
              renderAll();
              void persistDraft();
              return;
            }
            if (draftIds.length >= MAX_SHOWCASE) {
              showFeedback(
                LearningHausI18n.t(
                  "You can display up to 3 achievements. Remove one first to swap.",
                  "เลือกแสดงได้สูงสุด 3 เหรียญ กรุณานำออก 1 เหรียญก่อนเปลี่ยน"
                ),
                true
              );
              return;
            }
            draftIds = [...draftIds, achievement.id];
            renderAll();
            void persistDraft();
          });

          return card;
        })
      );
    };

    const renderAll = (): void => {
      const unlocked = getUnlockedSet();
      renderTabs(unlocked);
      renderSlots();
      renderGrid(unlocked);
    };

    clearBtn?.addEventListener("click", () => {
      draftIds = [];
      renderAll();
      void persistDraft();
    });

    saveBtn?.addEventListener("click", () => {
      void persistDraft("profile");
    });

    viewLeaderboardBtn?.addEventListener("click", () => {
      void persistDraft("leaderboards");
    });

    window.addEventListener("learninghaus:achievement-progress", (event) => {
      latestSnapshot = (event as CustomEvent<Snapshot>).detail;
      syncDraftFromProfile();
      renderAll();
    });
    window.addEventListener("learninghaus:achievement-server-loaded", (event) => {
      latestSnapshot = (event as CustomEvent<Snapshot>).detail;
      syncDraftFromProfile();
      renderAll();
    });
    window.addEventListener("learninghaus:achievement-server-snapshot", (event) => {
      latestSnapshot = (event as CustomEvent<Snapshot>).detail;
      syncDraftFromProfile();
      renderAll();
    });
    window.addEventListener("learninghaus:profile-updated", () => {
      syncDraftFromProfile();
      renderAll();
    });
    window.addEventListener("learninghaus:social-session", () => {
      initializedFromProfile = false;
      syncDraftFromProfile();
      renderAll();
    });
    window.addEventListener("learninghaus:language-changed", () => {
      renderAll();
    });
    document.addEventListener("click", (event) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-home-nav="achievement-showcase"]');
      if (!target) return;
      syncDraftFromProfile();
      renderAll();
    });

    syncDraftFromProfile();
    renderAll();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAchievementShowcase, { once: true });
  } else {
    initAchievementShowcase();
  }
})();
