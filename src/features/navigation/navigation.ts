// ส่วนนี้ทำหน้าที่: สลับหน้า เมนูหลัก การเปลี่ยนภาษา และการจัดการปุ่มในหน้าเข้าสู่ระบบ
(() => {
  const initAppNavigation = (): void => {
    const authView = document.querySelector<HTMLElement>("#auth-view");
    const authPages = Array.from(document.querySelectorAll<HTMLElement>("[data-auth-page]"));
    const homeView = document.querySelector<HTMLElement>("#home-view");
    const quizView = document.querySelector<HTMLElement>("#quiz-view");
    const homePanels = Array.from(document.querySelectorAll<HTMLElement>("[data-home-panel]"));
    const homeLinks = Array.from(document.querySelectorAll<HTMLElement>(".home-nav__link[data-home-nav]"));
    if (!authView || !authPages.length || !homeView || !quizView) return;

    const homeMain = homeView.querySelector<HTMLElement>(".home-main");
    const rankingList = homeView.querySelector<HTMLElement>(".leaderboards-table__list");

    homeMain?.addEventListener(
      "wheel",
      (event) => {
        if (homeView.dataset.activePanel !== "leaderboards" || !rankingList || event.ctrlKey) return;
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        if (event.target instanceof Element && event.target.closest(".leaderboards-table__list")) return;
        rankingList.scrollTop += event.deltaY;
        event.preventDefault();
      },
      { passive: false }
    );

    const showFormFeedback = (form: HTMLFormElement, message: string, isNotice = false): void => {
      let node = form.querySelector<HTMLElement>("[data-auth-error]");
      if (!node) {
        node = document.createElement("p");
        node.dataset.authError = "";
        node.className = "auth-card__error";
        node.setAttribute("role", isNotice ? "status" : "alert");
        form.querySelector(".auth-fields")?.after(node);
      }
      node.classList.toggle("auth-card__error--notice", isNotice);
      node.textContent = message;
      node.hidden = !message;
    };

    const setAuthPage = (pageName: string): void => {
      authPages.forEach((page) => {
        const isActive = page.dataset.authPage === pageName;
        page.hidden = !isActive;
        page.setAttribute("aria-hidden", String(!isActive));
      });
    };

    // Keep Friends & Chat panel as a floating corner popup mounted on document.body (works over Home & Quiz!)
    const floatingSocialPanel = document.querySelector<HTMLElement>('[data-home-panel="social"]');
    if (floatingSocialPanel && floatingSocialPanel.parentElement !== document.body) {
      document.body.appendChild(floatingSocialPanel);
    }

    const setHomePanel = (panelName: string): void => {
      if (panelName === "social") return;
      homeView.dataset.activePanel = panelName;
      const isLeaderboardsMode = panelName === "leaderboards" || panelName === "looking-people";
      document.body.classList.toggle("leaderboards-mode", isLeaderboardsMode);
      document.documentElement.classList.toggle("leaderboards-mode", isLeaderboardsMode);
      const navPanelName =
        panelName === "looking-people"
          ? "leaderboards"
          : panelName === "lesson" || panelName === "quiz"
            ? "learn"
            : panelName === "achievement-showcase"
              ? "profile"
              : panelName;
      if (panelName !== "lesson") homeView.dispatchEvent(new Event("learninghaus:lesson-hide"));
      homePanels.forEach((panel) => {
        if (panel.dataset.homePanel === "social") return;
        const isBackdrop = panelName === "looking-people" && panel.dataset.homePanel === "leaderboards";
        panel.hidden = panel.dataset.homePanel !== panelName && !isBackdrop;
      });
      homeLinks.forEach((link) => {
        const active = link.dataset.homeNav === navPanelName;
        link.classList.toggle("home-nav__link--active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
      document.querySelectorAll<HTMLElement>("[data-mobile-tab]").forEach((tab) => {
        const key = tab.dataset.mobileTab;
        const active =
          (key === "learn" && (navPanelName === "learn" || navPanelName === "daily-quests" || navPanelName === "leaderboards")) ||
          key === navPanelName;
        tab.classList.toggle("is-active", active);
      });
    };

    const ACTIVE_VIEW_KEY = "learninghaus.activeView.v1";
    const EXPLICIT_LOGOUT_KEY = "learninghaus.explicitLogout.v1";

    const saveActiveView = (viewName: string): void => {
      try {
        window.localStorage.setItem(ACTIVE_VIEW_KEY, viewName);
      } catch {
        // Ignore storage errors.
      }
    };

    const clearExplicitLogout = (): void => {
      try {
        window.localStorage.removeItem(EXPLICIT_LOGOUT_KEY);
      } catch {
        // Ignore storage errors.
      }
    };

    let returnFromAuthPanel = "";
    const lookingPeoplePanel = document.querySelector<HTMLElement>('[data-home-panel="looking-people"]');
    let personCatAnimTimer: number | null = null;

    const stopPersonCatAnimation = (): void => {
      if (personCatAnimTimer !== null) {
        window.clearInterval(personCatAnimTimer);
        personCatAnimTimer = null;
      }
    };

    // Smooth drag-to-scroll & horizontal mouse-wheel scroll on right-sidebar Achievement carousels (no visible scrollbar)
    document.querySelectorAll<HTMLElement>(".quiz-achievement-list").forEach((rail) => {
      let dragging = false;
      let startX = 0;
      let startScrollLeft = 0;

      rail.addEventListener(
        "wheel",
        (event) => {
          if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault();
            rail.scrollBy({ left: event.deltaY * 0.9, behavior: "smooth" });
          }
        },
        { passive: false }
      );

      rail.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        dragging = true;
        startX = event.clientX;
        startScrollLeft = rail.scrollLeft;
        rail.classList.add("is-dragging");
        try {
          rail.setPointerCapture(event.pointerId);
        } catch {
          // ignore
        }
      });

      rail.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        rail.scrollLeft = startScrollLeft - (event.clientX - startX);
      });

      const stopDrag = (): void => {
        if (!dragging) return;
        dragging = false;
        rail.classList.remove("is-dragging");
      };
      rail.addEventListener("pointerup", stopDrag);
      rail.addEventListener("pointercancel", stopDrag);
    });

    const closeLookingPeopleModal = (): void => {
      stopPersonCatAnimation();
      if (lookingPeoplePanel) lookingPeoplePanel.hidden = true;
    };

    const closeQuizFlowIfOpen = (): void => {
      const quizFlow = document.getElementById("quiz-flow");
      if (quizFlow && !quizFlow.hidden) {
        quizFlow.querySelector<HTMLButtonElement>("[data-quiz-exit]")?.click();
      }
    };
    const switchCancelLink = authView.querySelector<HTMLElement>("[data-auth-cancel-switch]");
    const syncSwitchCancel = (): void => {
      if (switchCancelLink) switchCancelLink.hidden = !returnFromAuthPanel;
    };

    const closeAuthModal = (): void => {
      authView.hidden = true;
      document.body.classList.remove("auth-mode");
      returnFromAuthPanel = "";
      syncSwitchCancel();
    };

    const showAuth = (pageName: string): void => {
      window.dispatchEvent(new Event("learninghaus:cancel-quiz-travel"));
      document.body.classList.add("auth-mode");
      authView.hidden = false;
      setAuthPage(pageName);
      authView.querySelectorAll<HTMLFormElement>("[data-auth-form]").forEach((f) => showFormFeedback(f, ""));
      syncSwitchCancel();
      authView.scrollTop = 0;
      authView.focus({ preventScroll: true });
    };

    window.addEventListener("learninghaus:change-account", () => {
      returnFromAuthPanel = "settings";
      const signInForm = authView.querySelector<HTMLFormElement>('[data-auth-form="signin"]');
      if (signInForm) {
        signInForm.reset();
        showFormFeedback(signInForm, "");
      }
      showAuth("signin");
      (document.getElementById("auth-signin-email") as HTMLInputElement | null)?.focus();
    });

    window.addEventListener("learninghaus:social-account-deleted", () => {
      returnFromAuthPanel = "";
      saveActiveView("landing");
      showLanding();
      showAuth("signin");
    });
    window.addEventListener("learninghaus:social-logout", () => {
      returnFromAuthPanel = "";
      saveActiveView("landing");
      showLanding();
      showAuth("signin");
    });

    const showHome = (panelName = "learn"): void => {
      window.dispatchEvent(new Event("learninghaus:cancel-quiz-travel"));
      clearExplicitLogout();
      const persistedPanel =
        panelName === "looking-people"
          ? "leaderboards"
          : panelName === "lesson" || panelName === "daily-quests"
            ? "learn"
            : panelName;
      if (panelName !== "social") lastNonSocialView = persistedPanel;
      saveActiveView(persistedPanel);
      document.body.classList.remove("auth-mode", "quiz-map-active");
      document.body.classList.add("home-mode");
      authView.hidden = true;
      quizView.hidden = true;
      homeView.hidden = false;
      setHomePanel(panelName);
      cornerChatFab?.classList.toggle("is-active", panelName === "social");
      if (panelName === "lesson" && homeMain) homeMain.scrollTop = 0;
      homeView.focus({ preventScroll: true });
      window.scrollTo(0, 0);
      window.LearningHausSocial?.trackEvent?.("view_switch", panelName);
    };

    const cornerChatFab = document.querySelector<HTMLButtonElement>("[data-social-corner-fab]");
    let lastNonSocialView = "learn";

    const closeFloatingChat = (): void => {
      if (floatingSocialPanel) floatingSocialPanel.hidden = true;
      cornerChatFab?.classList.remove("is-active");
      document.querySelectorAll<HTMLElement>("[data-social-trigger-proxy]").forEach((b) => b.classList.remove("is-active"));
    };

    const openFloatingChat = (): void => {
      if (!floatingSocialPanel) return;
      window.dispatchEvent(new CustomEvent("learninghaus:notif-close"));
      floatingSocialPanel.hidden = false;
      cornerChatFab?.classList.add("is-active");
      document.querySelectorAll<HTMLElement>("[data-social-trigger-proxy]").forEach((b) => b.classList.add("is-active"));
    };

    window.addEventListener("learninghaus:social-close", closeFloatingChat);

    const toggleFloatingChat = (): void => {
      if (!floatingSocialPanel) return;
      if (floatingSocialPanel.hidden) openFloatingChat();
      else closeFloatingChat();
    };

    cornerChatFab?.addEventListener("click", toggleFloatingChat);
    document.querySelectorAll<HTMLElement>("[data-social-trigger-proxy]").forEach((proxyBtn) => {
      proxyBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleFloatingChat();
      });
    });

    floatingSocialPanel?.querySelector<HTMLButtonElement>("[data-social-popup-close]")?.addEventListener("click", closeFloatingChat);
    const socialExpandBtn = floatingSocialPanel?.querySelector<HTMLButtonElement>("[data-social-popup-expand]");
    socialExpandBtn?.addEventListener("click", () => {
      if (!floatingSocialPanel) return;
      const expanded = floatingSocialPanel.classList.toggle("is-expanded");
      socialExpandBtn.setAttribute("aria-pressed", String(expanded));
    });

    window.addEventListener("learninghaus:social-open", () => {
      closeLookingPeopleModal();
      openFloatingChat();
    });

    const showQuiz = (): void => {
      clearExplicitLogout();
      lastNonSocialView = "quiz";
      saveActiveView("quiz");
      document.body.classList.remove("auth-mode");
      document.body.classList.add("home-mode", "quiz-map-active");
      authView.hidden = true;
      homeView.hidden = true;
      quizView.hidden = false;
      setHomePanel("quiz");
      cornerChatFab?.classList.remove("is-active");
      quizView.dispatchEvent(new Event("learninghaus:quiz-visible"));
      quizView.focus({ preventScroll: true });
      quizView.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      window.scrollTo(0, 0);
      window.LearningHausSocial?.trackEvent?.("view_switch", "quiz");
    };

    window.addEventListener("learninghaus:open-quiz", () => {
      closeLookingPeopleModal();
      closeQuizFlowIfOpen();
      showQuiz();
    });
    window.addEventListener("learninghaus:leaderboard-open", (event) => {
      const stage = Number((event as CustomEvent<{ stage?: number }>).detail?.stage);
      if (LearningHausLeaderboards.hasCompletedStage(stage)) showHome("leaderboards");
    });
    window.addEventListener("learninghaus:open-home-panel", (event) => {
      const panel = (event as CustomEvent<{ panel?: string }>).detail?.panel;
      if (!panel) return;
      if (panel === "leaderboards" && !LearningHausLeaderboards.hasAnyCompletedStage()) return;
      showHome(panel);
    });

    const showLanding = (): void => {
      window.dispatchEvent(new Event("learninghaus:cancel-quiz-travel"));
      authView.hidden = true;
      homeView.hidden = true;
      quizView.hidden = true;
      document.body.classList.remove("auth-mode", "home-mode", "quiz-map-active");
    };

    const EYE_STYLE_LABELS: Record<LearningHausPixelCat.EyeStyleId, { en: string; th: string }> = {
      round: { en: "Round Eyes", th: "ตากลม" },
      sparkle: { en: "Sparkle Eyes", th: "ตาเป็นประกาย" },
      cool: { en: "Cool Eyes", th: "ตาเท่" },
      heterochromia: { en: "Heterochromia", th: "ตาสองสี" },
      happy: { en: "Happy Eyes", th: "ตายิ้ม" }
    };

    const resolvePersonCatConfig = (
      isCurrentPerson: boolean,
      rawCatConfig: string | undefined,
      personName: string
    ): LearningHausPixelCat.CatConfig | null => {
      const pixelCat = window.LearningHausPixelCat;
      if (!pixelCat) return null;
      if (isCurrentPerson) {
        return pixelCat.getActiveConfig?.() || pixelCat.defaultConfig();
      }
      if (rawCatConfig) {
        try {
          const parsed = JSON.parse(rawCatConfig);
          return pixelCat.normalizeConfig(parsed);
        } catch {
          // fall through to deterministic NPC config
        }
      }
      return pixelCat.getNpcConfig?.(personName) || pixelCat.defaultConfig();
    };

    let lastLookingPersonTarget: HTMLElement | null = null;

    const setLookingPerson = (personTarget: HTMLElement): void => {
      const panel = document.querySelector<HTMLElement>('[data-home-panel="looking-people"]');
      if (!panel || !personTarget) return;
      lastLookingPersonTarget = personTarget;
      const data = personTarget.dataset;
      const requestedName = data.lookingPerson || "KITTYCAT";
      const personId = Number(data.personId) || 0;
      const isCurrentPerson = LearningHausAccountStorage.isCurrentUser({ userId: personId, name: requestedName });
      const currentProfile = isCurrentPerson ? window.LearningHausProfile?.getProfile?.() || null : null;
      const name = String(currentProfile?.name || requestedName);
      const avatar = panel.querySelector<HTMLImageElement>("[data-person-avatar]");
      const nameNode = panel.querySelector<HTMLElement>("[data-person-name]");
      const levelNode = panel.querySelector<HTMLElement>("[data-person-level]");
      const achievementsNode = panel.querySelector<HTMLElement>("[data-person-achievements]");
      const editShowcaseBtn = panel.querySelector<HTMLElement>("[data-person-edit-showcase]");
      const level = Number(currentProfile?.level || data.personLevel || 1);

      if (avatar) {
        const candidateAvatar = String(currentProfile?.avatar || data.personAvatar || "").trim();
        avatar.src = isCurrentPerson
          ? window.LearningHausPixelCat?.getActiveAvatarDataUrl?.() || candidateAvatar
          : candidateAvatar && !candidateAvatar.includes("Profire/PF0")
            ? candidateAvatar
            : window.LearningHausPixelCat?.getNpcAvatarDataUrl?.(name) || "";
        avatar.alt = `${name} avatar`;
      }
      if (nameNode) nameNode.textContent = name;
      if (levelNode) levelNode.textContent = String(level);

      const aboutBox = panel.querySelector<HTMLElement>("[data-person-about-box]");
      const aboutNode = panel.querySelector<HTMLElement>("[data-person-about]");
      const aboutText = String(currentProfile?.about ?? data.personAbout ?? "").trim();
      if (aboutNode && aboutBox) {
        if (aboutText) {
          aboutNode.textContent = aboutText;
          aboutNode.classList.remove("is-empty");
          aboutBox.hidden = false;
        } else if (isCurrentPerson) {
          aboutNode.textContent = LearningHausI18n.t(
            "No bio yet. Add one in Profile -> About you!",
            "ยังไม่ได้เขียนแนะนำตัว เขียนได้ที่หน้าโปรไฟล์ (About you)"
          );
          aboutNode.classList.add("is-empty");
          aboutBox.hidden = false;
        } else {
          aboutNode.textContent = "";
          aboutNode.classList.remove("is-empty");
          aboutBox.hidden = true;
        }
      }

      // Render player's full-body animated Pixel Cat & style traits on the right pane
      const catStyleSection = panel.querySelector<HTMLElement>("[data-person-cat-style]");
      const catStage = panel.querySelector<HTMLElement>("[data-person-cat-stage]");
      const catCanvas = panel.querySelector<HTMLCanvasElement>("[data-person-cat-canvas]");
      const catTagsHost = panel.querySelector<HTMLElement>("[data-person-cat-tags]");
      const catAnimBtn = panel.querySelector<HTMLButtonElement>("[data-person-cat-anim-toggle]");
      const catAnimLabel = panel.querySelector<HTMLElement>("[data-person-cat-anim-label]");
      const catCfg = resolvePersonCatConfig(isCurrentPerson, data.personCatConfig, name);
      stopPersonCatAnimation();
      if (catStyleSection && catCanvas && catTagsHost && catCfg && window.LearningHausPixelCat) {
        const pixelCat = window.LearningHausPixelCat;
        const cleanCatCfg: LearningHausPixelCat.CatConfig = { ...catCfg, showGrid: false };
        catStyleSection.hidden = false;

        const personPoses: readonly LearningHausPixelCat.IdleAnimPose[] = [
          { ...pixelCat.NEUTRAL_POSE, swayDx: 0, breathDy: 0, tailDx: 0 },
          { ...pixelCat.NEUTRAL_POSE, swayDx: 0, breathDy: 1, tailDx: 1 },
          { ...pixelCat.NEUTRAL_POSE, swayDx: 1, breathDy: 0, tailDx: 1 },
          { ...pixelCat.NEUTRAL_POSE, swayDx: 0, breathDy: 0, tailDx: 0 },
          { ...pixelCat.NEUTRAL_POSE, swayDx: 0, breathDy: 1, tailDx: -1 },
          { ...pixelCat.NEUTRAL_POSE, swayDx: -1, breathDy: 0, tailDx: -1 }
        ];
        let poseIdx = 0;
        const reduceMotion = document.body.classList.contains("is-reduced-motion");
        let paused = reduceMotion || panel.dataset.catAnimPaused === "1";

        const renderPose = (): void => {
          pixelCat.renderCatToCanvas(catCanvas, cleanCatCfg, paused ? pixelCat.NEUTRAL_POSE : personPoses[poseIdx % personPoses.length]);
        };
        const catAnimIcon = panel.querySelector<HTMLElement>("[data-person-cat-anim-icon]");
        const avatarFallback = panel.querySelector<HTMLElement>("[data-person-avatar-fallback]");
        if (avatarFallback) avatarFallback.hidden = true;
        if (catAnimBtn) catAnimBtn.hidden = false;

        const syncAnimBtn = (): void => {
          if (catAnimBtn) catAnimBtn.setAttribute("aria-pressed", String(paused));
          if (catAnimLabel) {
            catAnimLabel.textContent = paused
              ? LearningHausI18n.t("Play", "เปิดขยับ")
              : LearningHausI18n.t("Pause", "หยุดขยับ");
          }
          if (catAnimIcon) {
            catAnimIcon.innerHTML = paused
              ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>`
              : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
          }
        };
        const startLoop = (): void => {
          stopPersonCatAnimation();
          if (paused) return;
          personCatAnimTimer = window.setInterval(() => {
            if (panel.hidden) {
              stopPersonCatAnimation();
              return;
            }
            poseIdx = (poseIdx + 1) % personPoses.length;
            renderPose();
          }, 420);
        };

        renderPose();
        syncAnimBtn();
        startLoop();

        if (catAnimBtn) {
          catAnimBtn.onclick = () => {
            paused = !paused;
            panel.dataset.catAnimPaused = paused ? "1" : "0";
            syncAnimBtn();
            renderPose();
            if (paused) stopPersonCatAnimation();
            else startLoop();
          };
        }

        const bgDef =
          pixelCat.AVATAR_BACKGROUNDS.find((b) => b.id === catCfg.avatarBg) || pixelCat.AVATAR_BACKGROUNDS[0];
        if (catStage && bgDef?.ringColor) {
          catStage.style.borderColor = bgDef.ringColor;
        }

        const patternDef = pixelCat.PATTERN_CATALOG[catCfg.pattern] || pixelCat.PATTERN_CATALOG.tabby;
        const outfitDef = pixelCat.OUTFIT_CATALOG[catCfg.outfit] || pixelCat.OUTFIT_CATALOG.none;
        const propDef = pixelCat.PROPS.find((p) => p.id === catCfg.prop);
        const eyeMeta = EYE_STYLE_LABELS[catCfg.eyeStyle] || EYE_STYLE_LABELS.round;

        const tags: { label: string; value: string; accent?: boolean }[] = [
          {
            label: LearningHausI18n.t("Coat", "ลายขน"),
            value: LearningHausI18n.t(patternDef.name, patternDef.nameTh)
          },
          {
            label: LearningHausI18n.t("Eyes", "ดวงตา"),
            value: LearningHausI18n.t(eyeMeta.en, eyeMeta.th)
          },
          {
            label: LearningHausI18n.t("Outfit", "ชุด"),
            value:
              catCfg.outfit === "none"
                ? LearningHausI18n.t("Classic Fur", "ไม่ใส่ชุด")
                : LearningHausI18n.t(outfitDef.name, outfitDef.nameTh)
          }
        ];
        if (propDef && propDef.id !== "none") {
          tags.push({
            label: LearningHausI18n.t("Prop", "ไอเทม"),
            value: pixelCat.localizePropName(propDef),
            accent: true
          });
        }
        if (bgDef) {
          tags.push({
            label: LearningHausI18n.t("Theme", "พื้นหลัง"),
            value: pixelCat.localizeBgName(bgDef)
          });
        }

        catTagsHost.replaceChildren(
          ...tags.map((item) => {
            const chip = document.createElement("span");
            chip.className = `looking-people-card__cat-tag${item.accent ? " is-accent" : ""}`;
            const keyEl = document.createElement("b");
            keyEl.textContent = `${item.label}:`;
            const valEl = document.createElement("span");
            valEl.textContent = item.value;
            chip.append(keyEl, valEl);
            return chip;
          })
        );
      } else if (catStyleSection) {
        catStyleSection.hidden = true;
        const avatarFallback = panel.querySelector<HTMLElement>("[data-person-avatar-fallback]");
        if (avatarFallback) avatarFallback.hidden = false;
        if (catAnimBtn) catAnimBtn.hidden = true;
      }

      panel.dataset.personId = data.personId || "";
      if (editShowcaseBtn) editShowcaseBtn.hidden = !isCurrentPerson;
      window.dispatchEvent(new CustomEvent("learninghaus:person-open", { detail: { userId: personId } }));

      if (achievementsNode) {
        let selectedIds: string[] | null = null;
        if (isCurrentPerson && currentProfile && currentProfile.featuredAchievements !== undefined) {
          selectedIds = currentProfile.featuredAchievements;
        } else if (data.personFeaturedAchievements) {
          try {
            const parsed = JSON.parse(data.personFeaturedAchievements);
            if (Array.isArray(parsed)) {
              selectedIds = parsed.map((id) => String(id || "").trim()).filter(Boolean).slice(0, 3);
            }
          } catch {
            selectedIds = null;
          }
        }

        if (Array.isArray(selectedIds)) {
          const picked = selectedIds
            .map((id) => LearningHausAchievementCatalog.all.find((item) => item.id === id))
            .filter((item): item is LearningHausAchievementCatalog.Achievement => Boolean(item));
          if (picked.length === 0) {
            const empty = document.createElement("p");
            empty.className = "looking-people-card__achievement-empty";
            empty.textContent = isCurrentPerson
              ? LearningHausI18n.t("No achievements selected for display yet.", "ยังไม่ได้เลือกเหรียญความสำเร็จสำหรับแสดง")
              : LearningHausI18n.t("No achievements showcased yet.", "ยังไม่มีเหรียญความสำเร็จที่แสดง");
            achievementsNode.replaceChildren(empty);
          } else {
            const badges = picked.map((achievement) => {
              const locName = LearningHausAchievementCatalog.localizeName(achievement);
              const badge = document.createElement("article");
              badge.className = "looking-people-card__achievement";
              badge.setAttribute("aria-label", `${locName} achievement unlocked`);

              const image = document.createElement("img");
              image.src = achievement.imagePath.replace("lesson-assets/achievements/", "lesson-assets/achievements/normalized/");
              image.alt = `${locName} badge`;

              const title = document.createElement("strong");
              title.textContent = locName;

              const status = document.createElement("span");
              status.textContent = LearningHausI18n.t("Unlocked", "ปลดล็อกแล้ว");

              badge.append(image, title, status);
              return badge;
            });
            achievementsNode.replaceChildren(...badges);
          }
        } else {
          const featuredBadges = [
            {
              id: "beginner",
              name: LearningHausI18n.t("Beginner", "ผู้เริ่มต้น"),
              image: "lesson-assets/achievements/normalized/beginner.png",
              requiredLevel: 1,
              requirementLabel: LearningHausI18n.t("Complete your first lesson", "เรียนจบบทเรียนแรก")
            },
            {
              id: "expert",
              name: LearningHausI18n.t("Expert", "ผู้เชี่ยวชาญ"),
              image: "lesson-assets/achievements/normalized/expert.png",
              requiredLevel: 5,
              requirementLabel: LearningHausI18n.t("Complete 3 courses", "เรียนจบครบ 3 คอร์ส")
            },
            {
              id: "master",
              name: LearningHausI18n.t("Master", "ปรมาจารย์"),
              image: "lesson-assets/achievements/normalized/master.png",
              requiredLevel: 9,
              requirementLabel: LearningHausI18n.t("Complete 5 courses", "เรียนจบครบ 5 คอร์ส")
            }
          ];

          const badges = featuredBadges.map((achievement) => {
            const domBadge = document.querySelector<HTMLElement>(`.quiz-achievement-item[data-achievement-id="${achievement.id}"]`);
            const unlocked = isCurrentPerson && domBadge
              ? domBadge.classList.contains("is-unlocked")
              : level >= achievement.requiredLevel;

            const badge = document.createElement("article");
            badge.className = "looking-people-card__achievement";
            badge.classList.toggle("is-locked", !unlocked);
            badge.setAttribute("aria-label", `${achievement.name} achievement ${unlocked ? "unlocked" : "locked"}`);

            const image = document.createElement("img");
            image.src = achievement.image;
            image.alt = `${achievement.name} badge`;

            const title = document.createElement("strong");
            title.textContent = achievement.name;

            const status = document.createElement("span");
            status.textContent = unlocked ? LearningHausI18n.t("Unlocked", "ปลดล็อกแล้ว") : achievement.requirementLabel;

            badge.append(image, title, status);
            return badge;
          });
          achievementsNode.replaceChildren(...badges);
        }
      }

      let visibleContacts = 0;
      (["facebook", "instagram", "x"] as const).forEach((key) => {
        const link = panel.querySelector<HTMLAnchorElement>(`[data-person-contact="${key}"]`);
        const label = panel.querySelector<HTMLElement>(`[data-person-contact-name="${key}"]`);
        const profileRecord = currentProfile as Record<string, string | number | boolean> | null;
        const contact = profileRecord
          ? { name: String(profileRecord[key] || ""), url: String(profileRecord[`${key}Url`] || "") }
          : {
              name: data[`person${key[0].toUpperCase()}${key.slice(1)}Name`] || "",
              url: data[`person${key[0].toUpperCase()}${key.slice(1)}Url`] || ""
            };
        if (link) {
          link.href = contact.url || "#";
          link.hidden = !contact.name || !contact.url;
          if (!link.hidden) visibleContacts += 1;
          link.setAttribute("aria-label", `${key} link for ${name}`);
        }
        if (label) label.textContent = contact.name;
      });
      const contactsTitle = panel.querySelector<HTMLElement>(".looking-people-card__contacts-title");
      const contactsEmpty = panel.querySelector<HTMLElement>("[data-person-contacts-empty]");
      if (contactsTitle) contactsTitle.hidden = false;
      if (contactsEmpty) contactsEmpty.hidden = visibleContacts > 0;
    };

    // ระบบสลับภาษาหน้าแรก เมนูหลัก และหน้า Settings (EN / TH)
    const translations = {
      en: {
        langLabel: "Change language",
        enterAppNav: "Open Learning App",
        enterAppHero: "Start Learning",
        heroTitle: 'Learn &amp; Teach <span class="hero__title-accent">Any Subject</span> with slides, videos, articles, and interactive quizzes.',
        heroDesc: "A simple learning site where anyone can join classes or create their own. Attach files, slides, YouTube links, reading articles, quizzes, and fun class quests.",
        signIn: "Sign in",
        createAccount: "Create a new account",
        easyTitle: "Flexible Lessons: Slides, YouTube & Articles",
        easyDesc: "Upload slides or files to read, add YouTube videos, or write simple reading articles. Every lesson fits the way you want to teach or study.",
        respTitle: "Interactive Quizzes & Custom Course Quests",
        respDesc: "Turn any lesson into an engaging quiz or keep it reading-only, assign custom course quests to your learners, and unlock Pixel Cat rewards along the way.",
        stepsTitle: "How It Works ?",
        step1: "Learn",
        step2: "Playing game",
        step3: "View results",
        updatedTitle: "Create & Share Your Own Classroom",
        updatedDesc: "Share a Class Code with friends or students, track progress, collect achievements from easy to master challenges, and grow together in one platform.",
        sponsorsTitle: "Sponsor",
        nav: {
          landing: "Home",
          learn: "Learn",
          quiz: "Quiz",
          achievement: "Achievement",
          social: "Friends & Chat",
          profile: "Profile",
          settings: "Settings"
        }
      },
      th: {
        langLabel: "เปลี่ยนภาษา",
        enterAppNav: "เข้าสู่บทเรียน",
        enterAppHero: "เข้าสู่บทเรียนทันที",
        heroTitle: 'เรียนรู้และสร้างคลาส <span class="hero__title-accent">ได้ทุกวิชา</span> ทั้งสไลด์ วิดีโอ บทความ และเกมควิซ',
        heroDesc: "แพลตฟอร์มการเรียนรู้ยุคใหม่ที่ทุกคนสามารถเข้าเรียนหรือสร้างห้องเรียนของตัวเองได้ แนบไฟล์สไลด์ แปะลิงก์ YouTube เขียนบทความอ่านอย่างเดียว สร้างควิซ และมอบหมายเควสต์พร้อมรางวัล",
        signIn: "เข้าสู่ระบบ",
        createAccount: "สร้างบัญชีใหม่",
        easyTitle: "รองรับทั้งสไลด์ ลิงก์ YouTube และบทความ",
        easyDesc: "อัปโหลดไฟล์สไลด์สำหรับอ่าน แนบลิงก์วิดีโอ YouTube หรือเขียนบทความสรุปความรู้ เลือกรูปแบบบทเรียนให้เหมาะกับทุกสไตล์การสอนและการเรียน",
        respTitle: "ทำควิซโต้ตอบ และมอบหมายเควสต์ประจำคลาส",
        respDesc: "สร้างควิซวัดความเข้าใจในแต่ละบท หรือเปิดเป็นบทเรียนอ่านอย่างเดียว พร้อมระบบมอบหมายเควสต์ประจำคลาสและสุ่มคลังรางวัลแต่งน้องแมวพิกเซลให้ผู้เรียน",
        stepsTitle: "ขั้นตอนการเรียนรู้",
        step1: "บทเรียน",
        step2: "เล่นเกมควิซ",
        step3: "ดูผลลัพธ์",
        updatedTitle: "สร้างและแชร์ห้องเรียนของคุณได้ทันที",
        updatedDesc: "แชร์รหัสห้องเรียนให้เพื่อนหรือผู้เรียน ติดตามความคืบหน้า สะสมเหรียญรางวัลตั้งแต่ระดับเริ่มต้นจนถึงระดับปรมาจารย์ครบในที่เดียว",
        sponsorsTitle: "ผู้สนับสนุน",
        nav: {
          landing: "หน้าแรก",
          learn: "บทเรียน",
          quiz: "เกมควิซ",
          achievement: "ความสำเร็จ",
          social: "เพื่อน & แชท",
          profile: "โปรไฟล์",
          settings: "ตั้งค่า"
        }
      }
    };

    let currentLang: "en" | "th" = "en";
    try {
      const savedLang = window.localStorage.getItem("learninghaus.lang");
      if (savedLang === "th" || savedLang === "en") currentLang = savedLang;
    } catch {
      // Ignore storage access errors.
    }

    const applyLanguage = (lang: "en" | "th"): void => {
      currentLang = lang;
      document.documentElement.lang = lang;
      try {
        window.localStorage.setItem("learninghaus.lang", lang);
      } catch {
        // Ignore storage access errors.
      }
      const copy = translations[lang];
      const langLabel = document.querySelector<HTMLElement>(".site-header__language-label");
      const enterAppNav = document.querySelector<HTMLElement>('[data-i18n="enterAppNav"]');
      const enterAppHero = document.getElementById("enter-app-hero");
      const langEn = document.querySelector<HTMLElement>("[data-lang-en]");
      const langTh = document.querySelector<HTMLElement>("[data-lang-th]");
      if (langLabel) langLabel.textContent = copy.langLabel;
      if (enterAppNav) enterAppNav.textContent = copy.enterAppNav;
      if (enterAppHero) enterAppHero.textContent = copy.enterAppHero;
      if (langEn) langEn.classList.toggle("site-header__language-muted", lang !== "en");
      if (langTh) langTh.classList.toggle("site-header__language-muted", lang !== "th");

      document.querySelectorAll<HTMLElement>("[data-nav-i18n]").forEach((node) => {
        const key = node.dataset.navI18n as keyof typeof copy.nav | undefined;
        if (key && copy.nav[key]) node.textContent = copy.nav[key];
      });

      const heroTitle = document.getElementById("hero-title");
      const heroDesc = document.querySelector<HTMLElement>(".hero__description");
      const signInBtn = document.getElementById("signin");
      const createAccountBtn = document.getElementById("create-account");
      const easyTitle = document.getElementById("easy-title");
      const easyDesc = document.querySelector<HTMLElement>("#product .feature__description");
      const respTitle = document.getElementById("responsible-title");
      const respDesc = document.querySelector<HTMLElement>("#curriculum .feature__description");
      const stepsTitle = document.getElementById("steps-title");
      const stepLabels = Array.from(document.querySelectorAll<HTMLElement>(".steps__label"));
      const updatedTitle = document.getElementById("updated-title");
      const updatedDesc = document.querySelector<HTMLElement>("#effectiveness .feature__description");
      const sponsorsTitle = document.getElementById("sponsors-title");

      if (heroTitle) heroTitle.innerHTML = copy.heroTitle;
      if (heroDesc) heroDesc.textContent = copy.heroDesc;
      if (signInBtn) signInBtn.textContent = copy.signIn;
      if (createAccountBtn) createAccountBtn.textContent = copy.createAccount;
      if (easyTitle) easyTitle.textContent = copy.easyTitle;
      if (easyDesc) easyDesc.textContent = copy.easyDesc;
      if (respTitle) respTitle.textContent = copy.respTitle;
      if (respDesc) respDesc.textContent = copy.respDesc;
      if (stepsTitle) stepsTitle.textContent = copy.stepsTitle;
      if (stepLabels[0]) stepLabels[0].textContent = copy.step1;
      if (stepLabels[1]) stepLabels[1].textContent = copy.step2;
      if (stepLabels[2]) stepLabels[2].textContent = copy.step3;
      if (updatedTitle) updatedTitle.textContent = copy.updatedTitle;
      if (updatedDesc) updatedDesc.textContent = copy.updatedDesc;
      if (sponsorsTitle) sponsorsTitle.textContent = copy.sponsorsTitle;
      LearningHausI18n.applyDom(lang);
      window.dispatchEvent(new CustomEvent("learninghaus:language-changed", { detail: { lang } }));
    };

    window.addEventListener("learninghaus:set-language", (event) => {
      const lang = (event as CustomEvent<{ lang?: string }>).detail?.lang === "th" ? "th" : "en";
      applyLanguage(lang);
    });

    applyLanguage(currentLang);

    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const langToggle = target.closest<HTMLElement>("[data-language-toggle]");
      if (langToggle) {
        event.preventDefault();
        applyLanguage(currentLang === "en" ? "th" : "en");
        return;
      }

      const closeAuthBtn = target.closest<HTMLElement>("[data-auth-close]");
      if (closeAuthBtn || (!authView.hidden && (target === authView || target.classList.contains("auth-page")))) {
        event.preventDefault();
        closeAuthModal();
        return;
      }

      const googleBtn = target.closest<HTMLButtonElement>("[data-auth-google]");
      if (googleBtn) {
        event.preventDefault();
        const form = googleBtn.closest("form");
        if (form) {
          showFormFeedback(
            form,
            LearningHausI18n.t(
              "Google Sign-In requires OAuth configuration on a deployed domain. Please sign in with your email and password.",
              "การเข้าสู่ระบบด้วย Google ต้องตั้งค่า OAuth บนโดเมนจริง กรุณาเข้าสู่ระบบด้วยอีเมลและรหัสผ่าน"
            ),
            true
          );
        }
        return;
      }

      const cancelSwitch = target.closest<HTMLElement>("[data-auth-cancel-switch]");
      if (cancelSwitch) {
        event.preventDefault();
        closeAuthModal();
        return;
      }

      const authTarget = target.closest<HTMLElement>("#signin, #create-account, [data-auth-nav]");
      if (authTarget) {
        event.preventDefault();
        if (!authTarget.dataset.authNav) returnFromAuthPanel = "";
        const pageName = authTarget.dataset.authNav || (authTarget.id === "create-account" ? "signup" : "signin");
        showAuth(pageName);
        return;
      }

      const closePersonBtn = target.closest<HTMLElement>("[data-looking-people-close]");
      if (closePersonBtn || (lookingPeoplePanel && !lookingPeoplePanel.hidden && target === lookingPeoplePanel)) {
        event.preventDefault();
        closeLookingPeopleModal();
        return;
      }

      const closeWorkspaceMenus = (): void => {
        document.querySelectorAll<HTMLElement>(".home-sidebar.is-menu-open, .quiz-sidebar.is-menu-open").forEach((sidebar) => {
          sidebar.classList.remove("is-menu-open");
          sidebar.querySelector<HTMLButtonElement>("[data-workspace-menu-toggle]")?.setAttribute("aria-expanded", "false");
        });
      };

      const workspaceToggle = target.closest<HTMLButtonElement>("[data-workspace-menu-toggle]");
      if (workspaceToggle) {
        event.preventDefault();
        const sidebar = workspaceToggle.closest<HTMLElement>(".home-sidebar, .quiz-sidebar");
        if (sidebar) {
          const isOpen = sidebar.classList.toggle("is-menu-open");
          workspaceToggle.setAttribute("aria-expanded", String(isOpen));
        }
        return;
      }

      if (!target.closest(".home-sidebar, .quiz-sidebar")) {
        closeWorkspaceMenus();
      }

      const homeTarget = target.closest<HTMLElement>("[data-home-nav]");
      if (homeTarget) {
        event.preventDefault();
        closeWorkspaceMenus();
        closeLookingPeopleModal();
        closeQuizFlowIfOpen();
        window.LearningHausPartyArena?.close?.();
        const homeTargetName = homeTarget.dataset.homeNav || "learn";
        if (homeTargetName === "landing") {
          const hrefTarget = homeTarget.getAttribute("href") || "";
          saveActiveView("landing");
          showLanding();
          if (hrefTarget === "#footer-about") {
            requestAnimationFrame(() => {
              document.getElementById("footer-about")?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
          }
          return;
        }
        if (!window.LearningHausSocial?.hasAccount?.()) {
          showAuth("signin");
          return;
        }
        if (homeTargetName === "leaderboards" && !LearningHausLeaderboards.hasAnyCompletedStage()) return;
        if (homeTargetName === "quiz") {
          showQuiz();
        } else {
          showHome(homeTargetName);
          if (homeTargetName === "learn") {
            const subview = homeTarget.dataset.learnReturn === "deck" ? "deck" : "hub";
            window.dispatchEvent(new CustomEvent("learninghaus:learn-subview", { detail: { subview } }));
          }
        }
        return;
      }

      const personTarget = target.closest<HTMLElement>("[data-looking-person]");
      if (personTarget) {
        event.preventDefault();
        setLookingPerson(personTarget);
        if (lookingPeoplePanel) {
          lookingPeoplePanel.hidden = false;
          lookingPeoplePanel.querySelector<HTMLButtonElement>("[data-looking-people-close]")?.focus({ preventScroll: true });
        }
        return;
      }

      const chapterTarget = target.closest<HTMLElement>("[data-home-chapter]");
      if (chapterTarget) {
        event.preventDefault();
        showHome("learn");
        return;
      }

      const startTarget = target.closest<HTMLElement>('[data-home-action="start"]');
      if (startTarget) {
        event.preventDefault();
        const selectedCard = document.querySelector<HTMLElement>("[data-chapter-picker] [data-home-chapter].is-active");
        const chapter = Number(selectedCard?.dataset.homeChapter || 1);
        showHome("lesson");
        homeView.dispatchEvent(new CustomEvent("learninghaus:lesson-open", { detail: { chapter } }));
        return;
      }

      const passwordToggle = target.closest<HTMLElement>("[data-password-toggle]");
      if (passwordToggle) {
        const inputId = passwordToggle.dataset.passwordToggle || "";
        const input = document.getElementById(inputId) as HTMLInputElement | null;
        const eye = passwordToggle.querySelector<HTMLElement>(".auth-eye");
        if (!input) return;
        const isVisible = input.type === "text";
        input.type = isVisible ? "password" : "text";
        passwordToggle.setAttribute("aria-pressed", String(!isVisible));
        passwordToggle.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
        if (eye) {
          eye.classList.toggle("is-visible", !isVisible);
          eye.innerHTML = LearningHausIcons.svg(isVisible ? "eye" : "eye-off", "auth-eye__icon");
        }
      }
    });

    // Verified-Only Forgot Password + 6-Digit Demo OTP
    const VERIFIED_RECOVERY_KEY = "learninghaus.verifiedRecovery.v1";
    let forgotOtpCode = "";
    let forgotOtpIdentifier = "";

    const normalizeForgotIdentifier = (raw: string): { kind: "email" | "phone"; key: string; display: string } | null => {
      const value = String(raw || "").trim();
      if (!value) return null;
      if (value.includes("@")) {
        return { kind: "email", key: `email:${value.toLowerCase()}`, display: value };
      }
      const digits = value.replace(/\D/g, "");
      if (digits.length >= 9) {
        const norm = digits.startsWith("66") ? `0${digits.slice(2)}` : digits;
        return { kind: "phone", key: `phone:${norm}`, display: value };
      }
      return null;
    };

    const isRecoveryIdentifierVerified = (key: string): boolean => {
      try {
        const raw = window.localStorage.getItem(VERIFIED_RECOVERY_KEY);
        const parsed = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
        if (parsed && parsed[key]) return true;
      } catch {
        // ignore
      }
      const prof = window.LearningHausProfile?.getProfile?.() as
        | { email?: string; emailVerified?: boolean; phone?: string; phoneVerified?: boolean }
        | undefined;
      if (prof?.emailVerified && prof.email && `email:${prof.email.trim().toLowerCase()}` === key) return true;
      if (prof?.phoneVerified && prof.phone) {
        const d = prof.phone.replace(/\D/g, "");
        const n = d.startsWith("66") ? `0${d.slice(2)}` : d;
        if (`phone:${n}` === key) return true;
      }
      return false;
    };

    authView.querySelector<HTMLButtonElement>("[data-forgot-send-otp]")?.addEventListener("click", () => {
      const form = authView.querySelector<HTMLFormElement>('[data-auth-form="forgot"]');
      const input = document.getElementById("auth-forgot-email") as HTMLInputElement | null;
      const demoNode = authView.querySelector<HTMLElement>("[data-forgot-otp-demo]");
      if (!form || !input) return;
      const parsed = normalizeForgotIdentifier(input.value);
      if (!parsed) {
        if (demoNode) demoNode.hidden = true;
        showFormFeedback(form, "Please enter a valid verified email address or phone number.");
        return;
      }
      if (!isRecoveryIdentifierVerified(parsed.key)) {
        forgotOtpCode = "";
        forgotOtpIdentifier = "";
        if (demoNode) demoNode.hidden = true;
        showFormFeedback(
          form,
          "This email or phone number is not verified yet. Please verify it in Profile → Account first to enable password recovery."
        );
        return;
      }
      forgotOtpCode = String(Math.floor(100000 + Math.random() * 900000));
      forgotOtpIdentifier = parsed.key;
      showFormFeedback(form, "");
      if (demoNode) {
        demoNode.textContent = `Demo recovery OTP: ${forgotOtpCode} (valid for ${parsed.display})`;
        demoNode.hidden = false;
      }
      (document.getElementById("auth-forgot-otp") as HTMLInputElement | null)?.focus();
    });

    authView.addEventListener("submit", async (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement | null;
      const form = target?.closest<HTMLFormElement>("[data-auth-form]");
      if (!form) return;
      const kind = form.dataset.authForm;
      if (kind === "signin" || kind === "signup") {
        const result = await window.LearningHausSocial?.authenticate?.(kind, form);
        if (result?.handled && !result.success) return;
        returnFromAuthPanel = "";
        syncSwitchCancel();
        showHome("learn");
        return;
      }
      if (kind === "forgot") {
        const formData = new FormData(form);
        const identifier = String(formData.get("email") || "").trim();
        const otpEntered = String(formData.get("otp") || "").trim();
        const password = String(formData.get("password") || "");
        const confirm = String(formData.get("confirm-password") || "");
        const parsed = normalizeForgotIdentifier(identifier);
        if (!parsed) {
          showFormFeedback(form, "Please enter a valid verified email address or phone number.");
          return;
        }
        if (!isRecoveryIdentifierVerified(parsed.key)) {
          showFormFeedback(
            form,
            "Only verified email addresses or phone numbers can reset a password. Please verify your contact in Profile first."
          );
          return;
        }
        if (!forgotOtpCode || forgotOtpIdentifier !== parsed.key) {
          showFormFeedback(form, "Click 'Send OTP' first to receive your 6-digit recovery code.");
          return;
        }
        if (otpEntered !== forgotOtpCode) {
          showFormFeedback(form, "Invalid 6-digit OTP code. Please check the recovery code and try again.");
          return;
        }
        if (password.length < 8) {
          showFormFeedback(form, "New password must be at least 8 characters.");
          return;
        }
        if (password !== confirm) {
          showFormFeedback(form, "New password and confirm password do not match.");
          return;
        }
        forgotOtpCode = "";
        forgotOtpIdentifier = "";
        const demoNode = authView.querySelector<HTMLElement>("[data-forgot-otp-demo]");
        if (demoNode) demoNode.hidden = true;
        showFormFeedback(form, "");
        form.reset();
        showAuth("signin");
        const signInForm = authView.querySelector<HTMLFormElement>('[data-auth-form="signin"]');
        const signInEmail = document.getElementById("auth-signin-email") as HTMLInputElement | null;
        if (signInEmail && parsed.kind === "email") signInEmail.value = parsed.display;
        if (signInForm) {
          showFormFeedback(signInForm, `Password reset verified and updated for ${parsed.display}. Please sign in with your new password.`, true);
        }
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (floatingSocialPanel && !floatingSocialPanel.hidden) {
        event.preventDefault();
        closeFloatingChat();
        return;
      }
      if (lookingPeoplePanel && !lookingPeoplePanel.hidden) {
        event.preventDefault();
        closeLookingPeopleModal();
        return;
      }
      if (!authView.hidden) {
        event.preventDefault();
        closeAuthModal();
        return;
      }
      if (!homeView.hidden) {
        const activePanel = homeView.dataset.activePanel;
        if (activePanel === "achievement-showcase") {
          showHome("profile");
        } else if (activePanel === "lesson" || activePanel === "daily-quests") {
          showHome("learn");
        }
      }
    });

    (["learninghaus:language-changed", "learninghaus:profile-updated", "learninghaus:pixel-cat-updated"] as const).forEach((evName) => {
      window.addEventListener(evName, () => {
        if (lookingPeoplePanel && !lookingPeoplePanel.hidden && lastLookingPersonTarget) {
          setLookingPerson(lastLookingPersonTarget);
        }
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        document.querySelectorAll<HTMLElement>(".home-sidebar.is-menu-open, .quiz-sidebar.is-menu-open").forEach((sidebar) => {
          sidebar.classList.remove("is-menu-open");
          sidebar.querySelector<HTMLButtonElement>("[data-workspace-menu-toggle]")?.setAttribute("aria-expanded", "false");
        });
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        document.querySelectorAll<HTMLElement>(".home-sidebar.is-menu-open, .quiz-sidebar.is-menu-open").forEach((sidebar) => {
          sidebar.classList.remove("is-menu-open");
          sidebar.querySelector<HTMLButtonElement>("[data-workspace-menu-toggle]")?.setAttribute("aria-expanded", "false");
        });
      }
    });

    // เปิดหน้า Landing เป็นค่าเริ่มต้นสำหรับผู้เยี่ยมชมใหม่ และคืนค่าหน้าเดิมเฉพาะเมื่อมีเซสชันล็อกอินจริงจากเซิร์ฟเวอร์
    let initialRestored = false;
    const restoreViewForAuthenticatedUser = (): void => {
      if (initialRestored) return;
      initialRestored = true;
      if (!window.LearningHausSocial?.hasAccount?.()) {
        saveActiveView("landing");
        showLanding();
        return;
      }
      let explicitlyLoggedOut = false;
      let savedView = "landing";
      try {
        explicitlyLoggedOut = window.localStorage.getItem(EXPLICIT_LOGOUT_KEY) === "true";
        savedView = window.localStorage.getItem(ACTIVE_VIEW_KEY) || "landing";
      } catch {
        explicitlyLoggedOut = false;
        savedView = "landing";
      }
      if (!explicitlyLoggedOut && savedView !== "landing") {
        if (savedView === "quiz") {
          showQuiz();
        } else {
          const validPanels = new Set(["learn", "achievement", "achievement-showcase", "social", "profile", "leaderboards", "settings"]);
          const targetPanel = validPanels.has(savedView) ? savedView : "learn";
          if (targetPanel === "leaderboards" && !LearningHausLeaderboards.hasAnyCompletedStage()) {
            showHome("learn");
          } else {
            showHome(targetPanel);
          }
        }
      }
    };
    window.addEventListener("learninghaus:social-session", restoreViewForAuthenticatedUser, { once: true });
    if (window.LearningHausSocial?.hasAccount?.()) {
      restoreViewForAuthenticatedUser();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAppNavigation, { once: true });
  } else {
    initAppNavigation();
  }
})();
