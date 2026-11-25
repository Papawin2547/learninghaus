// ส่วนนี้ทำหน้าที่: แสดงและแก้ข้อมูล Profile ในเบราว์เซอร์ รวมถึงออกจากระบบและซิงค์กับเซิร์ฟเวอร์
(() => {
  type ProfileState = {
    name: string;
    level: string;
    exp: number;
    totalXp: number;
    username: string;
    email: string;
    phoneCountry: string;
    phone: string;
    phoneVerified: boolean;
    emailVerified: boolean;
    about: string;
    facebook: string;
    facebookUrl: string;
    instagram: string;
    instagramUrl: string;
    x: string;
    xUrl: string;
    avatar: string;
    featuredAchievements: string[] | null;
    accountState: string;
  };

  type EditableFieldKey = "name" | "username" | "email" | "phone" | "about";
  type ContactKey = "facebook" | "instagram" | "x";
  type AccountActionType =
    | "remove-phone"
    | "verify-email"
    | "verify-phone"
    | "disable-account"
    | "restore-account"
    | "delete-account";

  const initProfileControls = (): void => {
    const page = document.querySelector<HTMLElement>(".profile-page");
    const editorDialog = document.getElementById("profile-editor-dialog") as HTMLDialogElement | null;
    const passwordDialog = document.getElementById("profile-password-dialog") as HTMLDialogElement | null;
    const accountDialog = document.getElementById("profile-account-dialog") as HTMLDialogElement | null;
    if (!page || !editorDialog || !passwordDialog || !accountDialog) return;

    const storageKey = "learninghaus.profile.v1";
    const phoneCountries = [
      { code: "+66", label: "Thailand (+66)" },
      { code: "+1", label: "United States / Canada (+1)" },
      { code: "+44", label: "United Kingdom (+44)" },
      { code: "+61", label: "Australia (+61)" },
      { code: "+65", label: "Singapore (+65)" },
      { code: "+81", label: "Japan (+81)" },
      { code: "+82", label: "South Korea (+82)" },
      { code: "+86", label: "China (+86)" },
      { code: "+33", label: "France (+33)" },
      { code: "+49", label: "Germany (+49)" }
    ];

    const defaults: ProfileState = {
      name: "TONOAK",
      level: "1",
      exp: LearningHausRules.level.initialExp,
      totalXp: LearningHausRules.level.initialExp,
      username: "TONOAKPAPAWIN048",
      email: "6631306048@lamduan.ac.mfu.th",
      phoneCountry: "+66",
      phone: "616844924",
      phoneVerified: false,
      emailVerified: false,
      about: "",
      facebook: "Papawin Namchue",
      facebookUrl: "https://www.facebook.com/",
      instagram: "it.papawin",
      instagramUrl: "https://www.instagram.com/",
      x: "KillSMz",
      xUrl: "https://x.com/",
      avatar: "",
      featuredAchievements: null,
      accountState: "active"
    };

    const normalizeFeatured = (value: unknown): string[] | null => {
      if (value === null || value === undefined || value === "") return null;
      let parsed: unknown = value;
      if (typeof value === "string") {
        try {
          parsed = JSON.parse(value);
        } catch {
          return null;
        }
      }
      if (!Array.isArray(parsed)) return null;
      const validIds = new Set(LearningHausAchievementCatalog.all.map((item) => item.id));
      const seen = new Set<string>();
      const out: string[] = [];
      for (const entry of parsed) {
        const id = String(entry || "").trim();
        if (validIds.has(id) && !seen.has(id)) {
          seen.add(id);
          out.push(id);
          if (out.length >= 3) break;
        }
      }
      return out;
    };

    const resolveValidAvatar = (candidate: string | undefined): string => {
      const headAvatar = window.LearningHausPixelCat?.getActiveAvatarDataUrl?.() || "";
      if (headAvatar) return headAvatar;
      const trimmed = String(candidate || "").trim();
      if (!trimmed || trimmed.includes("Profire/PF0")) return "";
      return trimmed;
    };

    let profile: ProfileState = { ...defaults, avatar: resolveValidAvatar("") };
    let editTarget = "";
    let accountAction: AccountActionType | "" = "";

    const saved = LearningHausAccountStorage.readJson<Partial<ProfileState> | null>(storageKey, null);
    if (saved && typeof saved === "object") profile = { ...profile, ...saved };
    profile.avatar = resolveValidAvatar(profile.avatar);
    profile.featuredAchievements = normalizeFeatured(profile.featuredAchievements);

    // ย้ายข้อมูลเก่า level/exp ให้มี XP รวมสำหรับสูตร Level แบบใหม่ โดยไม่ล้างข้อมูลเดิม
    const savedTotalXp = Number(profile.totalXp);
    if (!Number.isFinite(savedTotalXp)) {
      profile.totalXp = LearningHausProgression.getLegacyTotalXp(Number(profile.level), Number(profile.exp));
    }

    const normalizePhoneState = (): void => {
      const rawPhone = String(profile.phone || "").trim();
      let country = phoneCountries.find((option) => option.code === profile.phoneCountry);
      let digits = rawPhone.replace(/\D/g, "");
      if (!country) {
        country =
          phoneCountries
            .slice()
            .sort((first, second) => second.code.length - first.code.length)
            .find((option) => digits.startsWith(option.code.replace(/\D/g, ""))) || phoneCountries[0];
        if (digits.startsWith(country.code.replace(/\D/g, ""))) {
          digits = digits.slice(country.code.replace(/\D/g, "").length);
        }
      } else if (rawPhone.startsWith("+") && digits.startsWith(country.code.replace(/\D/g, ""))) {
        digits = digits.slice(country.code.replace(/\D/g, "").length);
      }
      profile.phoneCountry = country.code;
      profile.phone = digits;
      profile.phoneVerified = Boolean(profile.phoneVerified);
      profile.emailVerified = Boolean(profile.emailVerified);
    };

    const formatPhoneNumber = (): string => {
      const digits = String(profile.phone || "");
      if (!digits) return "Not added";
      return `${profile.phoneCountry} ${digits.replace(/(\d{3})(?=\d)/g, "$1 ")}`;
    };

    const isValidEmail = (value: string): boolean => {
      const [local, domain, extra] = value.split("@");
      const topLevel = domain ? domain.split(".").pop() || "" : "";
      return Boolean(
        local &&
          domain &&
          !extra &&
          topLevel.length >= 2 &&
          !local.includes("..") &&
          !local.startsWith(".") &&
          !local.endsWith(".") &&
          /^[A-Za-z0-9.!#$%&'*+/=?^_{|}~-]+$/.test(local) &&
          /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(domain)
      );
    };

    normalizePhoneState();

    const saveProfile = (): boolean => {
      try {
        window.localStorage.setItem(LearningHausAccountStorage.key(storageKey), JSON.stringify(profile));
        return true;
      } catch {
        return false;
      }
    };

    const notifyProfileUpdated = (): void => {
      window.dispatchEvent(new CustomEvent("learninghaus:profile-updated", { detail: { ...profile } }));
    };

    const feedback = page.querySelector<HTMLElement>("[data-profile-feedback]");
    const settingsStatus = document.querySelector<HTMLElement>('[data-home-panel="settings"] [data-settings-status]');
    let feedbackTimer: number | undefined;
    const showFeedback = (message: string): void => {
      if (feedback) {
        feedback.textContent = message;
        feedback.hidden = false;
      }
      if (settingsStatus && !document.querySelector('[data-home-panel="settings"]')?.hasAttribute("hidden")) {
        settingsStatus.textContent = message;
        settingsStatus.hidden = false;
      }
      window.clearTimeout(feedbackTimer);
      feedbackTimer = window.setTimeout(() => {
        if (feedback) feedback.hidden = true;
        if (settingsStatus) settingsStatus.hidden = true;
      }, 3500);
    };

    const setError = (node: HTMLElement | null, message: string): void => {
      if (!node) return;
      node.textContent = message || "";
      node.hidden = !message;
    };

    const ABOUT_MAX_LENGTH = 200;
    const aboutCard = page.querySelector<HTMLElement>("[data-profile-about-card]");
    const aboutInput = page.querySelector<HTMLTextAreaElement>("[data-profile-about-input]");
    const aboutCounter = page.querySelector<HTMLElement>("[data-profile-about-counter]");
    const aboutSaveBtn = page.querySelector<HTMLButtonElement>("[data-profile-about-save]");
    const aboutError = page.querySelector<HTMLElement>("[data-profile-about-error]");
    let isSavingAbout = false;

    const syncAboutEditorUI = (): void => {
      if (!aboutInput) return;
      if (aboutInput.value.length > ABOUT_MAX_LENGTH) {
        aboutInput.value = aboutInput.value.slice(0, ABOUT_MAX_LENGTH);
      }
      const len = aboutInput.value.length;
      if (aboutCounter) {
        aboutCounter.textContent = `${len}/${ABOUT_MAX_LENGTH}`;
        aboutCounter.classList.toggle("is-near-limit", len >= ABOUT_MAX_LENGTH - 20);
      }
      aboutInput.style.height = "auto";
      aboutInput.style.height = `${Math.max(44, aboutInput.scrollHeight)}px`;
      aboutCard?.classList.toggle("has-content", Boolean(aboutInput.value.trim()));
      const isDirty = aboutInput.value.trim() !== String(profile.about || "").trim();
      if (aboutSaveBtn) {
        aboutSaveBtn.disabled = !isDirty || isSavingAbout;
      }
    };

    const renderProfile = (): void => {
      const profileRecord = profile as unknown as Record<string, string | number | boolean>;
      document.querySelectorAll<HTMLElement>("[data-profile-value]").forEach((node) => {
        const key = node.dataset.profileValue || "";
        const value = key === "phone" ? formatPhoneNumber() : String(profileRecord[key] ?? "");
        node.textContent = value;
      });
      if (aboutInput && document.activeElement !== aboutInput) {
        aboutInput.value = String(profile.about || "").slice(0, ABOUT_MAX_LENGTH);
        setError(aboutError, "");
        syncAboutEditorUI();
      }

      const levelState = LearningHausProgression.getLevelState(Number(profile.totalXp));
      profile.level = String(levelState.level);
      profile.exp = levelState.progressXp;
      const expPerLevel = levelState.requiredXp;
      const currentExp = levelState.progressXp;

      document
        .querySelectorAll<HTMLElement>(".quiz-profile-card .quiz-meter:not([data-daily-quest-meter]), .profile-page__summary-card:not(.profile-page__quest-card) .profile-page__progress")
        .forEach((meter) => {
          meter.setAttribute("aria-valuenow", String(currentExp));
          meter.setAttribute("aria-valuemax", String(expPerLevel));
          const fill = meter.querySelector<HTMLElement>("span");
          if (fill) fill.style.width = `${(currentExp / expPerLevel) * 100}%`;
        });
      document
        .querySelectorAll<HTMLElement>(".quiz-profile-card__labels span:last-child, .profile-page__summary-labels span:last-child")
        .forEach((label) => {
          label.textContent = `${currentExp}/${expPerLevel} exp`;
        });
      document.querySelectorAll<HTMLElement>("[data-hud-exp-text]").forEach((el) => {
        el.textContent = `${currentExp}/${expPerLevel} exp`;
      });
      document.querySelectorAll<HTMLElement>("[data-hud-exp-compact]").forEach((el) => {
        el.textContent = `${currentExp}/${expPerLevel}`;
      });
      document.querySelectorAll<HTMLElement>("[data-hud-exp-fill]").forEach((el) => {
        el.style.width = `${(currentExp / expPerLevel) * 100}%`;
      });
      const hasVerificationTarget = (key: string): boolean =>
        key === "phone" ? Boolean(String(profile.phone || "").trim()) : Boolean(String(profileRecord[key] || "").trim());

      page.querySelectorAll<HTMLElement>("[data-profile-verification]").forEach((node) => {
        const key = node.dataset.profileVerification || "";
        const hasValue = hasVerificationTarget(key);
        const verified = hasValue && Boolean(profileRecord[`${key}Verified`]);
        node.hidden = !hasValue;
        node.textContent = verified
          ? LearningHausI18n.t("Verified", "ยืนยันแล้ว")
          : LearningHausI18n.t("Not verified", "ยังไม่ยืนยัน");
        node.classList.toggle("is-verified", verified);
      });
      page.querySelectorAll<HTMLButtonElement>("[data-profile-verify]").forEach((button) => {
        const key = button.dataset.profileVerify || "";
        button.hidden = !hasVerificationTarget(key) || Boolean(profileRecord[`${key}Verified`]);
      });
      const contactNames: Record<ContactKey, string> = { facebook: "Facebook", instagram: "Instagram", x: "X" };
      (["facebook", "instagram", "x"] as ContactKey[]).forEach((key) => {
        const link = page.querySelector<HTMLAnchorElement>(`[data-profile-contact="${key}"]`);
        if (!link) return;
        const name = String(profile[key] || "").trim();
        const url = String(profile[`${key}Url`] || "").trim();
        const connected = Boolean(name && url);
        link.hidden = false;
        link.classList.toggle("is-connected", connected);
        link.classList.toggle("is-unconnected", !connected);
        const labelNode = link.querySelector<HTMLElement>(`[data-profile-value="${key}"]`);
        const statusNode = link.querySelector<HTMLElement>(`[data-profile-contact-status="${key}"]`);
        if (connected) {
          link.href = url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.removeAttribute("data-profile-edit-focus");
          link.setAttribute("aria-label", `Open ${contactNames[key]} profile for ${name}`);
          if (labelNode) labelNode.textContent = name;
          if (statusNode) statusNode.textContent = `${contactNames[key]} ↗`;
        } else {
          link.href = "#";
          link.removeAttribute("target");
          link.removeAttribute("rel");
          link.dataset.profileEditFocus = key;
          link.setAttribute(
            "aria-label",
            LearningHausI18n.t(`Connect ${contactNames[key]} link`, `เชื่อมต่อลิงก์ ${contactNames[key]}`)
          );
          if (labelNode) labelNode.textContent = contactNames[key];
          if (statusNode) statusNode.textContent = LearningHausI18n.t("Click to connect", "คลิกเพื่อเชื่อมต่อ");
        }
      });
      const removePhone = page.querySelector<HTMLElement>('[data-profile-action="remove-phone"]');
      if (removePhone) removePhone.hidden = !profile.phone;
      profile.avatar = resolveValidAvatar(profile.avatar);
      document.querySelectorAll<HTMLImageElement>("[data-profile-avatar]").forEach((image) => {
        image.src = profile.avatar;
        image.alt = `${profile.name} profile avatar`;
      });
      window.LearningHausPixelCat?.renderProfilePageSlots?.();
      const showcaseContainer = page.querySelector<HTMLElement>("[data-profile-featured-achievements]");
      if (showcaseContainer) {
        const selectedIds = normalizeFeatured(profile.featuredAchievements);
        let displayIds: string[] = [];
        if (selectedIds !== null) {
          displayIds = selectedIds;
        } else {
          const unlockedSet = new Set<string>();
          try {
            const key = LearningHausAccountStorage.key("learninghaus.achievement.unlockedAt");
            const stored = JSON.parse(window.localStorage.getItem(key) || "{}") as Record<string, string>;
            Object.entries(stored).forEach(([id, ts]) => {
              if (ts) unlockedSet.add(id);
            });
          } catch {
            // ignore storage errors
          }
          document.querySelectorAll<HTMLElement>(".quiz-achievement-item.is-unlocked[data-achievement-id]").forEach((el) => {
            if (el.dataset.achievementId) unlockedSet.add(el.dataset.achievementId);
          });
          displayIds = ["beginner", "expert", "master"].filter((id) => unlockedSet.has(id)).slice(0, 3);
        }

        const slotCards: HTMLElement[] = [];
        for (let slotIndex = 0; slotIndex < 3; slotIndex += 1) {
          const badgeId = displayIds[slotIndex];
          const item = badgeId ? LearningHausAchievementCatalog.all.find((entry) => entry.id === badgeId) : undefined;
          const card = document.createElement("button");
          card.type = "button";
          card.dataset.homeNav = "achievement-showcase";
          card.className = `profile-page__showcase-card${item ? " is-filled" : " is-empty"}`;

          if (item) {
            const locName = LearningHausAchievementCatalog.localizeName(item);
            card.setAttribute("aria-label", `Slot ${slotIndex + 1}: ${locName}. Click to choose leaderboard badges`);
            const img = document.createElement("img");
            img.src = item.imagePath.replace("lesson-assets/achievements/", "lesson-assets/achievements/normalized/");
            img.alt = `${locName} badge`;
            const title = document.createElement("strong");
            title.textContent = locName;
            const slotLabel = document.createElement("span");
            slotLabel.textContent = LearningHausI18n.t(`Slot #${slotIndex + 1}`, `ช่องที่ ${slotIndex + 1}`);
            card.append(img, title, slotLabel);
          } else {
            card.setAttribute("aria-label", `Empty slot ${slotIndex + 1}. Click to choose a leaderboard badge`);
            const plus = document.createElement("span");
            plus.className = "profile-page__showcase-plus";
            plus.setAttribute("aria-hidden", "true");
            plus.textContent = "+";
            const label = document.createElement("span");
            label.textContent = LearningHausI18n.t("Choose Badge", "เลือกเหรียญ");
            card.append(plus, label);
          }
          slotCards.push(card);
        }
        showcaseContainer.replaceChildren(...slotCards);
      }
      page.dataset.accountState = profile.accountState;
      document.querySelectorAll<HTMLElement>("[data-profile-account-toggle]").forEach((accountToggle) => {
        const disabled = profile.accountState === "disabled";
        accountToggle.dataset.profileAction = disabled ? "restore-account" : "disable-account";
        accountToggle.textContent = disabled ? "Restore Account" : "Disable Account";
      });

      window.LearningHausProfile = {
        getProfile: () => ({ ...profile }),
        setAvatar: async (
          avatarDataUrl: string,
          catConfigJson?: string,
          catPresetsJson?: string
        ): Promise<boolean> => {
          const previousAvatar = profile.avatar;
          try {
            const payload: Record<string, string> = { avatar: avatarDataUrl };
            if (catConfigJson !== undefined) payload.catConfig = catConfigJson;
            if (catPresetsJson !== undefined) payload.catPresets = catPresetsJson;
            await window.LearningHausSocial?.updateAccountProfile?.(payload);
          } catch (error) {
            showFeedback((error as Error).message);
            return false;
          }
          profile.avatar = avatarDataUrl;
          if (!saveProfile()) {
            profile.avatar = previousAvatar;
            renderProfile();
            showFeedback(
              LearningHausI18n.t(
                "The image is too large to save in this browser.",
                "ไฟล์รูปภาพมีขนาดใหญ่เกินกว่าจะบันทึกในเบราว์เซอร์นี้"
              )
            );
            return false;
          }
          renderProfile();
          notifyProfileUpdated();
          showFeedback(
          LearningHausI18n.t(
            "Your Pixel Cat has been saved as your primary character and profile avatar!",
            "ตั้งค่าตัวละครแมว Pixel เป็นตัวละครหลักและรูปโปรไฟล์เรียบร้อยแล้ว!"
          )
        );
          return true;
        },
        setFeaturedAchievements: async (achievementIds: string[] | null): Promise<boolean> => {
          const previous = profile.featuredAchievements ? [...profile.featuredAchievements] : profile.featuredAchievements;
          const normalized = achievementIds === null ? null : normalizeFeatured(achievementIds) || [];
          try {
            await window.LearningHausSocial?.updateAccountProfile?.({ featuredAchievements: normalized });
          } catch (error) {
            showFeedback((error as Error).message);
            return false;
          }
          profile.featuredAchievements = normalized;
          if (!saveProfile()) {
            profile.featuredAchievements = previous ?? null;
            renderProfile();
            showFeedback(
              LearningHausI18n.t(
                "Could not save achievement showcase in this browser.",
                "ไม่สามารถบันทึกรายการเหรียญรางวัลแนะนำในเบราว์เซอร์นี้ได้"
              )
            );
            return false;
          }
          renderProfile();
          notifyProfileUpdated();
          showFeedback(LearningHausI18n.t("Leaderboard achievements updated.", "อัปเดตเหรียญรางวัลบนตารางอันดับแล้ว"));
          return true;
        },
        switchAccount: () => {
          const connected = Boolean(window.LearningHausSocial?.currentUserId?.());
          profile = connected
            ? {
                ...defaults,
                name: "",
                username: "",
                email: "",
                phone: "",
                about: "",
                facebook: "",
                facebookUrl: "",
                instagram: "",
                instagramUrl: "",
                x: "",
                xUrl: "",
                avatar: resolveValidAvatar(""),
                featuredAchievements: null
              }
            : { ...defaults, avatar: resolveValidAvatar("") };
          const stored = LearningHausAccountStorage.readJson<Partial<ProfileState> | null>(storageKey, null);
          if (stored && typeof stored === "object") profile = { ...profile, ...stored };
          profile.avatar = resolveValidAvatar(profile.avatar);
          profile.featuredAchievements = normalizeFeatured(profile.featuredAchievements);
          normalizePhoneState();
          renderProfile();
        },
        syncAccount: (account) => {
          window.LearningHausPixelCat?.syncFromServerAccount?.(account);
          profile.name = account.name || profile.name;
          profile.email = account.email || profile.email;
          if (!String(profile.username || "").trim()) {
            profile.username = String(account.name || account.email?.split("@")[0] || "").trim();
          }
          profile.avatar = resolveValidAvatar(account.avatar || profile.avatar);
          if (account.featuredAchievements !== undefined) {
            profile.featuredAchievements = normalizeFeatured(account.featuredAchievements);
          }
          profile.totalXp = Math.max(0, Number(account.totalXp) || 0);
          profile.about = account.about || "";
          (["facebook", "instagram", "x"] as ContactKey[]).forEach((key) => {
            const accountRecord = account as unknown as Record<string, string | undefined>;
            profile[key] = accountRecord[`${key}Name`] || "";
            profile[`${key}Url`] = accountRecord[`${key}Url`] || "";
          });
          profile.accountState = account.accountState || "active";
          renderProfile();
          saveProfile();
          notifyProfileUpdated();
        }
      };
      saveProfile();
    };

    const closeDialog = (dialog: HTMLDialogElement | null): void => {
      if (dialog && dialog.open) dialog.close();
    };
    const openDialog = (dialog: HTMLDialogElement): void => {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    };

    const fieldLabel = (key: EditableFieldKey): string => {
      switch (key) {
        case "name":
          return LearningHausI18n.t("Display name", "ชื่อที่แสดง");
        case "username":
          return LearningHausI18n.t("Username", "ชื่อผู้ใช้");
        case "email":
          return LearningHausI18n.t("Email address", "อีเมล");
        case "phone":
          return LearningHausI18n.t("Phone number", "เบอร์โทรศัพท์");
        case "about":
          return LearningHausI18n.t("About you", "เกี่ยวกับคุณ");
      }
    };
    const fieldType: Partial<Record<EditableFieldKey, string>> = { email: "email", phone: "tel" };

    const openEditor = (target: string, focusContactKey?: string): void => {
      editTarget = target;
      const title = editorDialog.querySelector<HTMLElement>("[data-profile-editor-title]");
      const fields = editorDialog.querySelector<HTMLElement>("[data-profile-editor-fields]");
      setError(editorDialog.querySelector<HTMLElement>("[data-profile-editor-error]"), "");
      if (!title || !fields) return;
      fields.replaceChildren();

      if (target === "phone") {
        title.textContent = LearningHausI18n.t("Edit Phone Number", "แก้ไขเบอร์โทรศัพท์");
        const countryLabel = document.createElement("label");
        countryLabel.className = "profile-dialog__field";
        countryLabel.textContent = LearningHausI18n.t("Country / calling code", "รหัสประเทศ / รหัสโทรศัพท์");
        const countrySelect = document.createElement("select");
        countrySelect.name = "phoneCountry";
        phoneCountries.forEach((option) => {
          const selectOption = document.createElement("option");
          selectOption.value = option.code;
          selectOption.textContent = option.label;
          selectOption.selected = option.code === profile.phoneCountry;
          countrySelect.append(selectOption);
        });
        countryLabel.append(countrySelect);

        const phoneLabel = document.createElement("label");
        phoneLabel.className = "profile-dialog__field";
        phoneLabel.textContent = LearningHausI18n.t("Phone number", "เบอร์โทรศัพท์");
        const phoneInput = document.createElement("input");
        phoneInput.name = "phone";
        phoneInput.type = "tel";
        phoneInput.inputMode = "numeric";
        phoneInput.autocomplete = "tel-national";
        phoneInput.maxLength = 15;
        phoneInput.pattern = "[0-9]*";
        phoneInput.value = profile.phone || "";
        phoneInput.required = true;
        phoneInput.addEventListener("input", () => {
          phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 15);
        });
        phoneLabel.append(phoneInput);
        fields.append(countryLabel, phoneLabel);
      } else if (target === "contacts") {
        title.textContent = LearningHausI18n.t("Edit Contact Links", "แก้ไขลิงก์ติดต่อ");
        const contactLabels: Record<ContactKey, string> = { facebook: "Facebook", instagram: "Instagram", x: "X" };
        (["facebook", "instagram", "x"] as ContactKey[]).forEach((key) => {
          const nameLabel = document.createElement("label");
          nameLabel.className = "profile-dialog__field";
          nameLabel.textContent = LearningHausI18n.t(
            `${contactLabels[key]} name`,
            `ชื่อบัญชี ${contactLabels[key]}`
          );
          const nameInput = document.createElement("input");
          nameInput.name = key;
          nameInput.type = "text";
          nameInput.value = profile[key] || "";
          nameLabel.append(nameInput);

          const urlLabel = document.createElement("label");
          urlLabel.className = "profile-dialog__field";
          urlLabel.textContent = LearningHausI18n.t(
            `${contactLabels[key]} link`,
            `ลิงก์ ${contactLabels[key]}`
          );
          const urlInput = document.createElement("input");
          urlInput.name = `${key}Url`;
          urlInput.type = "url";
          urlInput.inputMode = "url";
          urlInput.placeholder = "https://example.com/your-profile";
          urlInput.value = profile[`${key}Url`] || "";
          urlLabel.append(urlInput);

          fields.append(nameLabel, urlLabel);
        });
      } else {
        const key = target as EditableFieldKey;
        const profileRecord = profile as unknown as Record<string, string>;
        const resolvedLabel = fieldLabel(key) || LearningHausI18n.t("Profile", "โปรไฟล์");
        title.textContent = LearningHausI18n.t(`Edit ${resolvedLabel}`, `แก้ไข${resolvedLabel}`);
        const label = document.createElement("label");
        label.className = "profile-dialog__field";
        label.textContent = resolvedLabel;
        const control = key === "about" ? document.createElement("textarea") : document.createElement("input");
        control.name = key;
        if (control instanceof HTMLInputElement) control.type = fieldType[key] || "text";
        control.value = profileRecord[key] || "";
        if (key !== "about") control.required = true;
        label.append(control);
        fields.append(label);
      }
      openDialog(editorDialog);
      const preferredControl =
        target === "contacts" && focusContactKey
          ? fields.querySelector<HTMLElement>(`input[name="${focusContactKey}"]`)
          : null;
      const firstControl = preferredControl || fields.querySelector<HTMLElement>("input, textarea");
      firstControl?.focus();
    };

    const VERIFIED_RECOVERY_KEY = "learninghaus.verifiedRecovery.v1";
    let pendingVerifyOtp = "";

    const normalizeRecoveryKey = (kind: "email" | "phone", value: string): string => {
      const raw = String(value || "").trim();
      if (!raw) return "";
      if (kind === "email") return `email:${raw.toLowerCase()}`;
      const digits = raw.replace(/\D/g, "");
      if (!digits) return "";
      const norm = digits.startsWith("66") ? `0${digits.slice(2)}` : digits;
      return `phone:${norm}`;
    };

    const removeOldVerifiedContact = (kind: "email" | "phone", oldValue: string): void => {
      const oldKey = normalizeRecoveryKey(kind, oldValue);
      if (!oldKey) return;
      try {
        const raw = window.localStorage.getItem(VERIFIED_RECOVERY_KEY);
        const parsed = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
        if (parsed && parsed[oldKey]) {
          delete parsed[oldKey];
          window.localStorage.setItem(VERIFIED_RECOVERY_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
    };

    const syncVerifiedRecoveryRegistry = (): void => {
      try {
        const raw = window.localStorage.getItem(VERIFIED_RECOVERY_KEY);
        const parsed = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
        const map: Record<string, boolean> = parsed && typeof parsed === "object" ? { ...parsed } : {};
        const eKey = normalizeRecoveryKey("email", profile.email);
        const pKey = normalizeRecoveryKey("phone", profile.phone);
        if (eKey) {
          if (profile.emailVerified) map[eKey] = true;
          else delete map[eKey];
        }
        if (pKey) {
          if (profile.phoneVerified) map[pKey] = true;
          else delete map[pKey];
        }
        window.localStorage.setItem(VERIFIED_RECOVERY_KEY, JSON.stringify(map));
      } catch {
        // ignore storage errors
      }
    };

    const openAccountConfirmation = (action: AccountActionType): void => {
      accountAction = action;
      const title = accountDialog.querySelector<HTMLElement>("[data-profile-account-title]");
      const message = accountDialog.querySelector<HTMLElement>("[data-profile-account-message]");
      const confirm = accountDialog.querySelector<HTMLElement>("[data-profile-account-confirm]");
      const passwordField = accountDialog.querySelector<HTMLElement>("[data-profile-account-password-field]");
      const otpWrap = accountDialog.querySelector<HTMLElement>("[data-profile-account-otp-wrap]");
      const otpDemo = accountDialog.querySelector<HTMLElement>("[data-profile-account-otp-demo]");
      const sharedAccount = Boolean(window.LearningHausSocial?.hasAccount?.());
      setError(accountDialog.querySelector<HTMLElement>("[data-profile-account-error]"), "");
      accountDialog.querySelector("form")?.reset();
      const isOtpAction = action === "verify-email" || action === "verify-phone";
      if (passwordField) {
        passwordField.hidden = !sharedAccount || action === "remove-phone" || isOtpAction;
      }
      if (otpWrap) {
        otpWrap.hidden = !isOtpAction;
      }
      if (isOtpAction) {
        pendingVerifyOtp = String(Math.floor(100000 + Math.random() * 900000));
        if (otpDemo) {
          otpDemo.textContent = LearningHausI18n.t(
            `Demo OTP code: ${pendingVerifyOtp}. Enter this 6-digit code below to verify your account.`,
            `รหัส OTP จำลอง: ${pendingVerifyOtp} กรอกรหัส 6 หลักนี้ด้านล่างเพื่อยืนยันสำหรับกู้รหัสผ่าน`
          );
        }
      } else {
        pendingVerifyOtp = "";
      }

      const settings: Record<AccountActionType, [string, string, string]> = {
        "remove-phone": [
          LearningHausI18n.t("Remove Phone Number", "ลบเบอร์โทรศัพท์"),
          LearningHausI18n.t("Remove the phone number from this profile? You can add it again later.", "ต้องการลบเบอร์โทรศัพท์ออกจากโปรไฟล์นี้หรือไม่?"),
          LearningHausI18n.t("Remove", "ลบ")
        ],
        "verify-email": [
          LearningHausI18n.t("Verify Email (OTP)", "ยืนยันอีเมลด้วย OTP"),
          LearningHausI18n.t(
            `Verify ${profile.email || "this email address"} so you can recover your account if you forget your password.`,
            `ยืนยันอีเมล ${profile.email || ""} เพื่อใช้ยืนยันตัวตนในกรณีกู้คืนรหัสผ่าน`
          ),
          LearningHausI18n.t("Verify Email", "ยืนยันอีเมล")
        ],
        "verify-phone": [
          LearningHausI18n.t("Verify Phone Number (OTP)", "ยืนยันเบอร์โทรด้วย OTP"),
          LearningHausI18n.t(
            `Verify ${formatPhoneNumber()} so you can recover your account if you forget your password.`,
            `ยืนยันเบอร์ ${formatPhoneNumber()} เพื่อใช้ยืนยันตัวตนในกรณีกู้คืนรหัสผ่าน`
          ),
          LearningHausI18n.t("Verify Phone", "ยืนยันเบอร์โทร")
        ],
        "disable-account": [
          "Disable Account",
          sharedAccount
            ? "Your shared account will be temporarily disabled. You can restore it with your current password."
            : "Your profile will be marked as temporarily disabled in this browser.",
          "Disable Account"
        ],
        "restore-account": ["Restore Account", "Restore your account and continue using LearningHaus?", "Restore Account"],
        "delete-account": [
          "Delete Account",
          sharedAccount
            ? "This permanently deletes your account, friends, chats and shared scores. This cannot be undone."
            : "This will clear the saved profile data in this browser.",
          sharedAccount ? "Delete Account" : "Delete Local Data"
        ]
      };
      const [heading, copy, button] = settings[action];
      if (title) title.textContent = heading;
      if (message) message.textContent = copy;
      if (confirm) {
        confirm.textContent = button;
        confirm.classList.toggle(
          "profile-page__button--danger",
          action === "remove-phone" || action === "disable-account" || action === "delete-account"
        );
      }
      openDialog(accountDialog);
    };

    page.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const verifyBtn = target.closest<HTMLElement>("[data-profile-verify]");
      if (verifyBtn) {
        event.preventDefault();
        event.stopPropagation();
        const verifyType = verifyBtn.dataset.profileVerify;
        if (verifyType === "email" && profile.email && !profile.emailVerified) {
          openAccountConfirmation("verify-email");
        } else if (verifyType === "phone" && profile.phone && !profile.phoneVerified) {
          openAccountConfirmation("verify-phone");
        }
        return;
      }

      const unconnectedContact = target.closest<HTMLAnchorElement>("[data-profile-contact].is-unconnected");
      if (unconnectedContact) {
        event.preventDefault();
        openEditor("contacts", unconnectedContact.dataset.profileEditFocus);
        return;
      }

      if (target.closest("a, [data-profile-action], button:not([data-profile-edit])")) return;

      const edit = target.closest<HTMLElement>("[data-profile-edit]");
      if (edit && edit.dataset.profileEdit) {
        event.preventDefault();
        openEditor(edit.dataset.profileEdit);
      }
    });

    page.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target as HTMLElement | null;
      if (
        !target ||
        target.closest("a, input, textarea, select") ||
        (target.closest("button") && !target.matches("[data-profile-edit]"))
      ) {
        return;
      }
      const edit = target.closest<HTMLElement>("[data-profile-edit]");
      if (edit && edit.dataset.profileEdit) {
        event.preventDefault();
        openEditor(edit.dataset.profileEdit);
      }
    });

    aboutCard?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-profile-about-save]")) return;
      aboutInput?.focus();
    });

    aboutInput?.addEventListener("focus", () => {
      syncAboutEditorUI();
    });

    aboutInput?.addEventListener("input", () => {
      setError(aboutError, "");
      syncAboutEditorUI();
    });

    aboutSaveBtn?.addEventListener("click", async () => {
      if (!aboutInput || isSavingAbout) return;
      const value = aboutInput.value.trim().slice(0, ABOUT_MAX_LENGTH);
      setError(aboutError, "");
      isSavingAbout = true;
      aboutSaveBtn.textContent = LearningHausI18n.t("Saving...", "กำลังบันทึก...");
      syncAboutEditorUI();
      try {
        await window.LearningHausSocial?.updateAccountProfile?.({ about: value });
        profile.about = value;
        aboutInput.value = value;
        saveProfile();
        renderProfile();
        notifyProfileUpdated();
        showFeedback(LearningHausI18n.t("About you saved.", "บันทึกข้อมูลเกี่ยวกับคุณแล้ว"));
      } catch (problem) {
        setError(
          aboutError,
          (problem as Error).message || LearningHausI18n.t("Could not save About you.", "ไม่สามารถบันทึกข้อมูลเกี่ยวกับคุณได้")
        );
      } finally {
        isSavingAbout = false;
        aboutSaveBtn.textContent = LearningHausI18n.t("Save", "บันทึก");
        syncAboutEditorUI();
      }
    });

    document.addEventListener("click", async (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const action = target.closest<HTMLElement>("[data-profile-action]");
      if (action && action.dataset.profileAction) {
        event.preventDefault();
        const actionName = action.dataset.profileAction;
        if (actionName === "change-account") {
          window.dispatchEvent(new CustomEvent("learninghaus:change-account"));
          return;
        }
        if (actionName === "logout") {
          await window.LearningHausSocial?.logout?.();
          showFeedback(LearningHausI18n.t("Signed out.", "ออกจากระบบแล้ว"));
          return;
        }
        if (actionName === "change-password") {
          setError(passwordDialog.querySelector<HTMLElement>("[data-profile-password-error]"), "");
          passwordDialog.querySelector("form")?.reset();
          openDialog(passwordDialog);
          passwordDialog.querySelector<HTMLElement>("input")?.focus();
        } else if (actionName === "restore-account") {
          openAccountConfirmation("restore-account");
        } else if (
          actionName === "remove-phone" ||
          actionName === "disable-account" ||
          actionName === "delete-account"
        ) {
          openAccountConfirmation(actionName);
        }
      }
    });

    editorDialog.querySelector<HTMLFormElement>("[data-profile-editor-form]")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const error = editorDialog.querySelector<HTMLElement>("[data-profile-editor-error]");
      const formData = new FormData(form);
      const values: Record<string, string> = {};
      formData.forEach((value, key) => {
        values[key] = String(value);
      });
      if (editTarget === "phone") {
        const countryCode = String(values.phoneCountry || "");
        const phone = String(values.phone || "").replace(/\D/g, "");
        if (!phoneCountries.some((option) => option.code === countryCode)) {
          setError(error, LearningHausI18n.t("Choose a country calling code.", "กรุณาเลือกรหัสประเทศ"));
          return;
        }
        if (!/^\d{4,15}$/.test(phone)) {
          setError(error, LearningHausI18n.t("Enter a phone number using 4 to 15 digits only.", "กรุณากรอกเบอร์โทรศัพท์เป็นตัวเลข 4 ถึง 15 หลัก"));
          return;
        }
        const prevPhone = profile.phone;
        profile.phoneCountry = countryCode;
        profile.phone = phone;
        profile.phoneVerified = false;
        removeOldVerifiedContact("phone", prevPhone);
      } else if (editTarget === "contacts") {
        const contactLabels: Record<ContactKey, string> = { facebook: "Facebook", instagram: "Instagram", x: "X" };
        const contactUpdates: Record<string, string> = {};
        for (const key of ["facebook", "instagram", "x"] as ContactKey[]) {
          const name = String(values[key] || "").trim();
          const url = String(values[`${key}Url`] || "").trim();
          if (Boolean(name) !== Boolean(url)) {
            setError(
              error,
              LearningHausI18n.t(
                `Enter both a name and link for ${contactLabels[key]}.`,
                `กรุณากรอกทั้งชื่อบัญชีและลิงก์สำหรับ ${contactLabels[key]}`
              )
            );
            return;
          }
          if (url && !/^https?:\/\/\S+$/i.test(url)) {
            setError(
              error,
              LearningHausI18n.t(
                `Enter a valid http or https link for ${contactLabels[key]}.`,
                `กรุณากรอกลิงก์ http หรือ https ที่ถูกต้องสำหรับ ${contactLabels[key]}`
              )
            );
            return;
          }
          contactUpdates[key] = name;
          contactUpdates[`${key}Url`] = url;
        }
        const sharedContacts = Object.fromEntries(
          (["facebook", "instagram", "x"] as ContactKey[]).flatMap((key) => [
            [`${key}Name`, contactUpdates[key]],
            [`${key}Url`, contactUpdates[`${key}Url`]]
          ])
        );
        try {
          await window.LearningHausSocial?.updateAccountProfile?.(sharedContacts);
        } catch (problem) {
          setError(error, (problem as Error).message);
          return;
        }
        Object.assign(profile, contactUpdates);
      } else {
        const value = String(values[editTarget] || "").trim();
        if (editTarget !== "about" && !value) {
          setError(error, LearningHausI18n.t("Please enter a value.", "กรุณากรอกข้อมูล"));
          return;
        }
        if (editTarget === "email" && !isValidEmail(value)) {
          setError(error, LearningHausI18n.t("Enter a valid email address.", "กรุณากรอกอีเมลที่ถูกต้อง"));
          return;
        }
        if (editTarget === "name" || editTarget === "email" || editTarget === "about") {
          try {
            await window.LearningHausSocial?.updateAccountProfile?.({ [editTarget]: value });
          } catch (problem) {
            setError(error, (problem as Error).message);
            return;
          }
        }
        const prevEmail = profile.email;
        (profile as unknown as Record<string, string>)[editTarget] = value;
        if (editTarget === "email") {
          profile.emailVerified = false;
          removeOldVerifiedContact("email", prevEmail);
        }
      }
      saveProfile();
      syncVerifiedRecoveryRegistry();
      renderProfile();
      notifyProfileUpdated();
      closeDialog(editorDialog);
      showFeedback(LearningHausI18n.t("Profile updated.", "อัปเดตโปรไฟล์เรียบร้อยแล้ว"));
    });

    passwordDialog.querySelector<HTMLFormElement>("[data-profile-password-form]")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const error = passwordDialog.querySelector<HTMLElement>("[data-profile-password-error]");
      const currentInput = form.elements.namedItem("currentPassword") as HTMLInputElement | null;
      const nextInput = form.elements.namedItem("newPassword") as HTMLInputElement | null;
      const confirmInput = form.elements.namedItem("confirmPassword") as HTMLInputElement | null;
      const current = currentInput?.value || "";
      const next = nextInput?.value || "";
      const confirm = confirmInput?.value || "";
      if (!current) {
        setError(error, LearningHausI18n.t("Enter your current password.", "กรุณากรอกรหัสผ่านปัจจุบัน"));
        return;
      }
      if (next.length < 8) {
        setError(error, LearningHausI18n.t("Your new password needs at least 8 characters.", "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร"));
        return;
      }
      if (next !== confirm) {
        setError(error, LearningHausI18n.t("The new passwords do not match.", "รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน"));
        return;
      }
      try {
        await window.LearningHausSocial?.changePassword?.(current, next);
      } catch (problem) {
        setError(error, (problem as Error).message);
        return;
      }
      form.reset();
      closeDialog(passwordDialog);
      showFeedback(LearningHausI18n.t("Password updated.", "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว"));
    });

    accountDialog.querySelector<HTMLFormElement>("[data-profile-account-form]")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const sharedAccount = Boolean(window.LearningHausSocial?.hasAccount?.());
      const requiresPasswordCheck =
        sharedAccount &&
        accountAction !== "remove-phone" &&
        accountAction !== "verify-email" &&
        accountAction !== "verify-phone" &&
        accountAction !== "";
      if (requiresPasswordCheck) {
        const currentInput = form.elements.namedItem("currentPassword") as HTMLInputElement | null;
        const currentPassword = String(currentInput?.value || "");
        const error = accountDialog.querySelector<HTMLElement>("[data-profile-account-error]");
        if (!currentPassword) {
          setError(error, LearningHausI18n.t("Enter your current password.", "กรุณากรอกรหัสผ่านปัจจุบัน"));
          return;
        }
        const userId = window.LearningHausSocial?.currentUserId?.() || 0;
        const serverAction = accountAction.replace("-account", "") as "disable" | "restore" | "delete";
        try {
          await window.LearningHausSocial?.accountAction?.(serverAction, currentPassword);
        } catch (problem) {
          setError(error, (problem as Error).message);
          return;
        }
        if (accountAction === "delete-account") {
          const prefix = `learninghaus.user.${userId}.`;
          Object.keys(window.localStorage)
            .filter((key) => key.startsWith(prefix))
            .forEach((key) => window.localStorage.removeItem(key));
          closeDialog(accountDialog);
          return;
        }
      }
      if (accountAction === "verify-email" || accountAction === "verify-phone") {
        const otpInput = form.elements.namedItem("otpCode") as HTMLInputElement | null;
        const entered = String(otpInput?.value || "").trim();
        const error = accountDialog.querySelector<HTMLElement>("[data-profile-account-error]");
        if (!entered || entered !== pendingVerifyOtp) {
          setError(
            error,
            LearningHausI18n.t(
              "Invalid OTP code. Please enter the 6-digit code shown above.",
              "รหัส OTP ไม่ถูกต้อง กรุณากรอกรหัส 6 หลักที่แสดงด้านบน"
            )
          );
          otpInput?.focus();
          return;
        }
        pendingVerifyOtp = "";
      }
      if (accountAction === "remove-phone") {
        profile.phone = "";
        profile.phoneVerified = false;
        showFeedback(LearningHausI18n.t("Phone number removed.", "ลบเบอร์โทรศัพท์เรียบร้อยแล้ว"));
      } else if (accountAction === "verify-email") {
        profile.emailVerified = true;
        showFeedback(LearningHausI18n.t("Email verified for account recovery.", "ยืนยันอีเมลเรียบร้อยแล้ว (ใช้กู้คืนรหัสผ่านได้)"));
      } else if (accountAction === "verify-phone") {
        profile.phoneVerified = true;
        showFeedback(LearningHausI18n.t("Phone number verified for account recovery.", "ยืนยันเบอร์โทรศัพท์เรียบร้อยแล้ว (ใช้กู้คืนรหัสผ่านได้)"));
      } else if (accountAction === "disable-account") {
        profile.accountState = "disabled";
        showFeedback(
          sharedAccount
            ? LearningHausI18n.t("Account temporarily disabled.", "ปิดการใช้งานบัญชีชั่วคราวแล้ว")
            : LearningHausI18n.t("Account is temporarily disabled in this browser.", "ปิดการใช้งานบัญชีชั่วคราวในเบราว์เซอร์นี้แล้ว")
        );
      } else if (accountAction === "restore-account") {
        profile.accountState = "active";
        showFeedback(LearningHausI18n.t("Account restored.", "กู้คืนการใช้งานบัญชีเรียบร้อยแล้ว"));
      } else if (accountAction === "delete-account") {
        profile = { ...defaults, accountState: "deleted" };
        try {
          window.localStorage.removeItem(storageKey);
        } catch {
          // Session-only fallback.
        }
        showFeedback(LearningHausI18n.t("Saved profile data was cleared in this browser.", "ล้างข้อมูลโปรไฟล์ที่บันทึกไว้ในเบราว์เซอร์นี้แล้ว"));
      }
      saveProfile();
      syncVerifiedRecoveryRegistry();
      renderProfile();
      notifyProfileUpdated();
      closeDialog(accountDialog);
    });

    document.querySelectorAll<HTMLElement>("[data-profile-dialog-close]").forEach((button) => {
      button.addEventListener("click", () => closeDialog(button.closest("dialog")));
    });
    [editorDialog, passwordDialog, accountDialog].forEach((dialog) => {
      dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeDialog(dialog);
      });
    });

    window.addEventListener("learninghaus:quiz-xp-awarded", (event) => {
      const amount = Number((event as CustomEvent<{ amount?: number }>).detail?.amount);
      if (!Number.isFinite(amount) || amount <= 0) return;
      profile.totalXp = Math.max(0, Number(profile.totalXp) || 0) + amount;
      const levelState = LearningHausProgression.getLevelState(profile.totalXp);
      profile.level = String(levelState.level);
      profile.exp = levelState.progressXp;
      saveProfile();
      renderProfile();
      notifyProfileUpdated();
    });

    window.addEventListener("learninghaus:achievement-progress", () => {
      if (profile.featuredAchievements === null) renderProfile();
    });

    window.addEventListener("learninghaus:language-changed", () => {
      renderProfile();
    });

    syncVerifiedRecoveryRegistry();
    renderProfile();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProfileControls, { once: true });
  } else {
    initProfileControls();
  }
})();
