// ตัวควบคุมระบบสร้างตัวละครแมว Pixel 52x52, พรีเซ็ตสี 4 ช่อง (Classic Front Sit) และซิงก์ตัวละครหลักทั่วทั้งระบบ LearningHaus
namespace LearningHausPixelCat {
  const STORAGE_KEY = "learninghaus.pixelCat.v7";
  const LEGACY_STORAGE_KEYS = ["learninghaus.pixelCat.v6", "learninghaus.pixelCat.v5", "learninghaus.pixelCat.v4"] as const;
  const PRESETS_STORAGE_KEY = "learninghaus.pixelCat.presets.v7";
  const LEGACY_PRESETS_KEYS = ["learninghaus.pixelCat.presets.v6", "learninghaus.pixelCat.presets.v5"] as const;
  const DEMO_UNLOCK_KEY = "learninghaus.pixelCat.demoUnlock.v1";
  const CREATED_GATE_KEY = "learninghaus.pixelCat.heartopiaCreated.v1";
  const ANIM_PAUSED_KEY = "learninghaus.pixelCat.animPaused.v1";

  const CATEGORY_SWATCHES: Record<CreatorCategoryTab, readonly string[]> = Object.freeze({
    fur: ["#FC8C44", "#D98B5F", "#454C54", "#F6EFE2", "#D8B482", "#8B796C", "#2A3036"],
    eyes: ["#346739", "#2563EB", "#D97706", "#16A34A", "#7C3AED", "#2F2235", "#0EA5E9"],
    outfit: ["#3C7D42", "#346739", "#546B41", "#B45309", "#1D4ED8", "#BE123C", "#374151"],
    prop: ["#3C7D42", "#99AD7A", "#D97706", "#1F2937", "#2563EB", "#DC2626", "#F59E0B"]
  });

  const IDLE_ANIM_FRAMES: readonly IdleAnimPose[] = Object.freeze([
    { swayDx: 0, breathDy: 0, tailDx: 0 },
    { swayDx: 1, breathDy: 0, tailDx: 1 },
    { swayDx: 1, breathDy: 1, tailDx: 0 },
    { swayDx: 0, breathDy: 1, tailDx: 0 },
    { swayDx: -1, breathDy: 0, tailDx: -1 },
    { swayDx: -1, breathDy: 1, tailDx: 0 }
  ]);

  // พรีเซ็ตสีและธีม 4 ช่อง โดยยึดท่านั่งหันหน้าตรงอันแรกเป็นหลักทุกช่อง
  const STARTER_PRESETS: readonly { name: string; config: CatConfig }[] = Object.freeze([
    {
      name: "Original Ginger",
      config: normalizeConfig({
        pattern: "tabby",
        eyeStyle: "round",
        outfit: "none",
        prop: "none",
        colors: {
          fur: { h: 23, s: 73, v: 99, a: 100 },
          pattern1: { h: 7, s: 76, v: 95, a: 100 },
          pattern2: { h: 63, s: 8, v: 98, a: 100 },
          pattern3: { h: 355, s: 21, v: 90, a: 100 },
          eyeLeft: { h: 315, s: 48, v: 26, a: 100 },
          eyeRight: { h: 315, s: 48, v: 26, a: 100 },
          eyeGlint: { h: 65, s: 6, v: 99, a: 100 }
        }
      })
    },
    {
      name: "Midnight Tuxedo",
      config: normalizeConfig({
        pattern: "tuxedo",
        eyeStyle: "sparkle",
        outfit: "suit",
        prop: "none",
        colors: {
          fur: { h: 248, s: 26, v: 28, a: 100 },
          pattern1: { h: 60, s: 4, v: 98, a: 100 },
          eyeLeft: { h: 44, s: 92, v: 96, a: 100 },
          eyeRight: { h: 44, s: 92, v: 96, a: 100 },
          eyeGlint: { h: 60, s: 5, v: 100, a: 100 },
          outfit1: { h: 222, s: 68, v: 46, a: 100 },
          outfit2: { h: 210, s: 8, v: 98, a: 100 },
          outfit3: { h: 352, s: 82, v: 88, a: 100 }
        }
      })
    },
    {
      name: "Sakura Odd-Eye",
      config: normalizeConfig({
        pattern: "calico",
        eyeStyle: "heterochromia",
        outfit: "scarf",
        prop: "ribbon",
        colors: {
          fur: { h: 342, s: 32, v: 99, a: 100 },
          pattern1: { h: 22, s: 68, v: 95, a: 100 },
          pattern2: { h: 332, s: 58, v: 56, a: 100 },
          pattern3: { h: 350, s: 5, v: 99, a: 100 },
          eyeLeft: { h: 196, s: 85, v: 92, a: 100 },
          eyeRight: { h: 42, s: 90, v: 96, a: 100 },
          eyeGlint: { h: 60, s: 5, v: 100, a: 100 },
          outfit1: { h: 338, s: 72, v: 90, a: 100 },
          outfit2: { h: 45, s: 80, v: 98, a: 100 },
          prop1: { h: 345, s: 82, v: 94, a: 100 },
          prop2: { h: 46, s: 90, v: 98, a: 100 }
        }
      })
    },
    {
      name: "Royal Siamese",
      config: normalizeConfig({
        pattern: "siamese",
        eyeStyle: "cool",
        outfit: "cloak",
        prop: "none",
        colors: {
          fur: { h: 34, s: 22, v: 96, a: 100 },
          pattern1: { h: 20, s: 62, v: 36, a: 100 },
          pattern2: { h: 34, s: 12, v: 98, a: 100 },
          pattern3: { h: 24, s: 22, v: 84, a: 100 },
          eyeLeft: { h: 205, s: 88, v: 95, a: 100 },
          eyeRight: { h: 205, s: 88, v: 95, a: 100 },
          eyeGlint: { h: 195, s: 20, v: 100, a: 100 },
          outfit1: { h: 262, s: 70, v: 74, a: 100 },
          outfit2: { h: 186, s: 90, v: 98, a: 100 },
          outfit3: { h: 45, s: 94, v: 98, a: 100 }
        }
      })
    }
  ]);

  export const defaultPresetSlots = (): PresetSlot[] => {
    return Array.from({ length: TOTAL_PRESET_SLOTS }, (_, index) => {
      const starter = STARTER_PRESETS[index];
      return {
        slot: index + 1,
        name: starter ? starter.name : `Preset ${index + 1}`,
        config: starter ? normalizeConfig(starter.config) : null,
        updatedAt: starter ? "starter" : null
      };
    });
  };

  export const normalizePresetSlots = (raw: unknown): PresetSlot[] => {
    const defaults = defaultPresetSlots();
    if (!Array.isArray(raw)) return defaults;
    return defaults.map((fallback, idx) => {
      const item = raw[idx] as Record<string, unknown> | undefined;
      if (!item || typeof item !== "object") return fallback;
      const name =
        typeof item.name === "string" && item.name.trim().length > 0
          ? item.name.trim().slice(0, 28)
          : fallback.name;
      const hasConfig = item.config && typeof item.config === "object";
      return {
        slot: idx + 1,
        name,
        config: hasConfig ? normalizeConfig(item.config) : null,
        updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : null
      };
    });
  };

  export const readSavedConfig = (): CatConfig => {
    const saved = LearningHausAccountStorage.readJson<Partial<CatConfig> | null>(STORAGE_KEY, null);
    if (saved && typeof saved === "object") {
      return normalizeConfig(saved);
    }
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      const legacy = LearningHausAccountStorage.readJson<Partial<CatConfig> | null>(legacyKey, null);
      if (legacy && typeof legacy === "object") {
        const migrated = normalizeConfig(legacy);
        LearningHausAccountStorage.writeJson(STORAGE_KEY, migrated);
        return migrated;
      }
    }
    return defaultConfig();
  };

  export const readPresetSlots = (): PresetSlot[] => {
    const raw = LearningHausAccountStorage.readJson<unknown>(PRESETS_STORAGE_KEY, null);
    if (Array.isArray(raw)) {
      return normalizePresetSlots(raw.slice(0, TOTAL_PRESET_SLOTS));
    }
    for (const legacyKey of LEGACY_PRESETS_KEYS) {
      const legacyRaw = LearningHausAccountStorage.readJson<unknown>(legacyKey, null);
      if (Array.isArray(legacyRaw)) {
        const migrated = normalizePresetSlots(legacyRaw.slice(0, TOTAL_PRESET_SLOTS));
        LearningHausAccountStorage.writeJson(PRESETS_STORAGE_KEY, migrated);
        return migrated;
      }
    }
    const seeded = defaultPresetSlots();
    LearningHausAccountStorage.writeJson(PRESETS_STORAGE_KEY, seeded);
    return seeded;
  };

  export const writePresetSlots = (slots: PresetSlot[]): PresetSlot[] => {
    const normalized = normalizePresetSlots(slots.slice(0, TOTAL_PRESET_SLOTS));
    LearningHausAccountStorage.writeJson(PRESETS_STORAGE_KEY, normalized);
    return normalized;
  };

  export const getActiveConfig = (): CatConfig => readSavedConfig();

  export const getActiveAvatarDataUrl = (size = 240): string => {
    return renderConfigToDataUrl(readSavedConfig(), size);
  };

  export const getAvailableColorChannels = (config: CatConfig): ColorChannelMeta[] => {
    const channels: ColorChannelMeta[] = [
      { target: "fur", label: LearningHausI18n.t("Base Fur", "สีขนหลัก"), category: "fur" }
    ];
    const patternDef = PATTERN_CATALOG[config.pattern] || PATTERN_CATALOG.tabby;
    for (const slot of patternDef.activeSlots) {
      channels.push({
        target: slot,
        label: localizePatternSlot(patternDef, slot),
        category: "fur"
      });
    }

    channels.push(
      { target: "eyeLeft", label: LearningHausI18n.t("Left Eye", "สีตาซ้าย"), category: "eyes" },
      { target: "eyeRight", label: LearningHausI18n.t("Right Eye", "สีตาขวา"), category: "eyes" },
      { target: "eyeGlint", label: LearningHausI18n.t("Eye Highlight", "สีประกายตา"), category: "eyes" }
    );

    const outfitDef = OUTFIT_CATALOG[config.outfit] || OUTFIT_CATALOG.none;
    for (const ch of outfitDef.channels) {
      channels.push({
        target: ch.target,
        label: LearningHausI18n.t(ch.label, ch.labelTh),
        category: "outfit"
      });
    }

    const propDef = PROPS.find((p) => p.id === config.prop) || PROPS[0];
    for (const ch of propDef.channels) {
      channels.push({
        target: ch.target,
        label: LearningHausI18n.t(ch.label, ch.labelTh),
        category: "prop"
      });
    }

    return channels;
  };

  const getUnlockedAchievementIds = (): Set<string> => {
    const ids = new Set<string>();
    const saved = LearningHausAccountStorage.readJson<Record<string, string>>(
      "learninghaus.achievement.unlockedAt",
      {}
    );
    Object.keys(saved || {}).forEach((id) => {
      if (saved[id]) ids.add(id);
    });
    document
      .querySelectorAll<HTMLElement>(".achievement-page__card.is-unlocked, .quiz-achievement-item.is-unlocked")
      .forEach((el) => {
        if (el.dataset.achievementId) ids.add(el.dataset.achievementId);
      });
    return ids;
  };

  const drawColorWheel = (wheelCanvas: HTMLCanvasElement, brightness: number): void => {
    const ctx = wheelCanvas.getContext("2d");
    if (!ctx) return;
    const width = wheelCanvas.width;
    const height = wheelCanvas.height;
    const radius = Math.min(width, height) / 2;
    const cx = width / 2;
    const cy = height / 2;
    const image = ctx.createImageData(width, height);
    const data = image.data;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.hypot(dx, dy);
        const idx = (y * width + x) * 4;
        if (dist <= radius) {
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          const hue = (angle + 360) % 360;
          const sat = (dist / radius) * 100;
          const [r, g, b] = hsvToRgb(hue, sat, brightness);
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = dist > radius - 1.5 ? Math.round((radius - dist) * 170) : 255;
        } else {
          data[idx + 3] = 0;
        }
      }
    }
    ctx.putImageData(image, 0, 0);
  };

  let refreshCreatorUiHook: (() => void) | null = null;
  let refreshCreatorPresetsOnlyHook: (() => void) | null = null;

  const persistPresetChange = async (
    slotNumber: number,
    nextConfig: CatConfig | null,
    explicitName?: string
  ): Promise<PresetSlot[]> => {
    const currentSlots = readPresetSlots();
    const existing = currentSlots.find((s) => s.slot === slotNumber);
    const cleanName = explicitName?.trim().slice(0, 28);
    const updated = currentSlots.map((item) => {
      if (item.slot !== slotNumber) return item;
      if (nextConfig === null) {
        return {
          slot: item.slot,
          name: `Empty Slot ${item.slot}`,
          config: null,
          updatedAt: null
        };
      }
      const fallbackName =
        existing && existing.config ? existing.name : `Preset ${item.slot}`;
      return {
        slot: item.slot,
        name: cleanName || fallbackName,
        config: normalizeConfig({ ...nextConfig, showGrid: false }),
        updatedAt: new Date().toISOString()
      };
    });
    const saved = writePresetSlots(updated);
    renderProfilePageSlots();
    refreshCreatorPresetsOnlyHook?.();
    await window.LearningHausSocial?.updateAccountProfile?.({
      catPresets: JSON.stringify(saved)
    });
    return saved;
  };

  const equipSlotConfig = async (slotConfig: CatConfig): Promise<boolean> => {
    const currentBg = readSavedConfig().avatarBg || "sage-cream";
    const loaded = normalizeConfig({ ...slotConfig, avatarBg: slotConfig.avatarBg || currentBg, showGrid: false });
    LearningHausAccountStorage.writeJson(STORAGE_KEY, loaded);
    const dataUrl = renderConfigToDataUrl(loaded, 280);
    const ok = Boolean(
      await window.LearningHausProfile?.setAvatar?.(
        dataUrl,
        JSON.stringify(loaded),
        JSON.stringify(readPresetSlots())
      )
    );
    renderProfilePageSlots();
    refreshCreatorUiHook?.();
    window.dispatchEvent(new CustomEvent("learninghaus:pixel-cat-updated"));
    return ok;
  };

  export const renderProfilePageSlots = (): void => {
    const containers = document.querySelectorAll<HTMLElement>("[data-profile-cat-slots]");
    if (!containers.length) return;
    const slots = readPresetSlots();
    const activeConfigJson = JSON.stringify({ ...readSavedConfig(), showGrid: false });

    containers.forEach((container) => {
      container.replaceChildren(
        ...slots.map((slot) => {
          const card = document.createElement("div");
          const isMatched =
            slot.config !== null &&
            JSON.stringify({ ...normalizeConfig(slot.config), showGrid: false }) === activeConfigJson;
          card.className = `profile-cat-slot${slot.config ? "" : " is-empty"}${isMatched ? " is-active" : ""}`;
          card.dataset.profilePresetSlot = String(slot.slot);

          const previewBtn = document.createElement("button");
          previewBtn.type = "button";
          previewBtn.className = "profile-cat-slot__preview";
          previewBtn.dataset.profileSlotEquip = String(slot.slot);
          previewBtn.title = slot.config
            ? `Equip preset: ${slot.name}`
            : `Empty slot ${slot.slot}. Click to open Character Creator Studio.`;

          if (slot.config) {
            const miniCanvas = document.createElement("canvas");
            miniCanvas.width = 104;
            miniCanvas.height = 104;
            miniCanvas.className = "profile-cat-slot__canvas";
            renderCatToCanvas(miniCanvas, { ...slot.config, showGrid: false }, NEUTRAL_POSE);
            previewBtn.appendChild(miniCanvas);
          } else {
            const emptyLabel = document.createElement("span");
            emptyLabel.className = "profile-cat-slot__plus";
            emptyLabel.textContent = "+";
            previewBtn.appendChild(emptyLabel);
          }

          previewBtn.addEventListener("click", async () => {
            if (!slot.config) {
              open();
              return;
            }
            await equipSlotConfig(slot.config);
          });

          const numBadge = document.createElement("span");
          numBadge.className = "profile-cat-slot__num";
          numBadge.textContent = String(slot.slot);

          const title = document.createElement("span");
          title.className = "profile-cat-slot__name";
          title.textContent = `${slot.slot}. ${slot.config ? slot.name : LearningHausI18n.t("Empty", "ว่าง")}`;

          const actions = document.createElement("div");
          actions.className = "profile-cat-slot__actions";

          const loadBtn = document.createElement("button");
          loadBtn.type = "button";
          loadBtn.className = `profile-cat-slot__btn${isMatched ? " is-active-btn" : ""}`;
          loadBtn.textContent = isMatched
            ? LearningHausI18n.t("Active", "กำลังใช้")
            : LearningHausI18n.t("Use", "ใช้งาน");
          loadBtn.title = LearningHausI18n.t(`Load and equip slot ${slot.slot}`, `โหลดและสวมใส่ช่อง ${slot.slot}`);
          loadBtn.disabled = !slot.config;
          loadBtn.dataset.profileSlotLoad = String(slot.slot);
          loadBtn.addEventListener("click", async () => {
            if (!slot.config) return;
            await equipSlotConfig(slot.config);
          });

          const saveBtn = document.createElement("button");
          saveBtn.type = "button";
          saveBtn.className = "profile-cat-slot__btn";
          saveBtn.textContent = LearningHausI18n.t("Save", "บันทึก");
          saveBtn.title = LearningHausI18n.t(`Save current character to slot ${slot.slot}`, `บันทึกตัวละครปัจจุบันลงช่อง ${slot.slot}`);
          saveBtn.dataset.profileSlotSave = String(slot.slot);
          saveBtn.addEventListener("click", async () => {
            const active = readSavedConfig();
            const customLabel = slot.config ? slot.name : `Preset ${slot.slot}`;
            await persistPresetChange(slot.slot, active, customLabel);
          });

          const clearBtn = document.createElement("button");
          clearBtn.type = "button";
          clearBtn.className = "profile-cat-slot__btn profile-cat-slot__btn--muted profile-cat-slot__clear";
          clearBtn.innerHTML = `<span class="profile-cat-slot__clear-text">${LearningHausI18n.t("Clear", "ล้าง")}</span><span class="profile-cat-slot__clear-x" aria-hidden="true">×</span>`;
          clearBtn.title = LearningHausI18n.t(`Clear slot ${slot.slot}`, `ล้างช่อง ${slot.slot}`);
          clearBtn.setAttribute("aria-label", LearningHausI18n.t(`Clear slot ${slot.slot}`, `ล้างช่อง ${slot.slot}`));
          clearBtn.disabled = !slot.config;
          clearBtn.dataset.profileSlotClear = String(slot.slot);
          clearBtn.addEventListener("click", async () => {
            await persistPresetChange(slot.slot, null);
          });

          actions.append(loadBtn, saveBtn, clearBtn);
          card.append(numBadge, previewBtn, title, actions);
          return card;
        })
      );
    });
  };

  let activeBgFilter: "all" | AvatarBgSource = "all";
  let bgStatusOverride: { text: string; locked: boolean } | null = null;

  const isBgUnlocked = (bg: AvatarBgDefinition): boolean => {
    if (bg.source === "starter") return true;
    const demoOn = Boolean(LearningHausAccountStorage.readJson<boolean>(DEMO_UNLOCK_KEY, false));
    if (demoOn) return true;
    if (bg.source === "achievement" && bg.achievementId) {
      return getUnlockedAchievementIds().has(bg.achievementId);
    }
    if (bg.source === "quest" && bg.questId) {
      return Boolean(window.LearningHausQuests?.isBgUnlocked?.(bg.id));
    }
    return false;
  };

  const equipProfileBg = async (bgId: AvatarBgId): Promise<void> => {
    const current = readSavedConfig();
    const next = normalizeConfig({ ...current, avatarBg: bgId, showGrid: false });
    LearningHausAccountStorage.writeJson(STORAGE_KEY, next);
    const dataUrl = renderConfigToDataUrl(next, 280);
    await window.LearningHausProfile?.setAvatar?.(
      dataUrl,
      JSON.stringify(next),
      JSON.stringify(readPresetSlots())
    );
    const def = AVATAR_BACKGROUNDS.find((b) => b.id === bgId) || AVATAR_BACKGROUNDS[0];
    bgStatusOverride = {
      text: LearningHausI18n.t(
        `Profile background set to "${def.name}"!`,
        `เปลี่ยนพื้นหลังโปรไฟล์เป็น "${def.nameTh}" เรียบร้อยแล้ว!`
      ),
      locked: false
    };
    renderProfileBgPicker();
    window.dispatchEvent(new CustomEvent("learninghaus:pixel-cat-updated"));
  };

  export const renderProfileBgPicker = (): void => {
    const grid = document.querySelector<HTMLElement>("[data-profile-bg-grid]");
    if (!grid) return;
    const statusEl = document.querySelector<HTMLElement>("[data-profile-bg-status]");
    const countEl = document.querySelector<HTMLElement>("[data-profile-bg-count]");
    const activeBg = readSavedConfig().avatarBg || "sage-cream";

    const unlockedTotal = AVATAR_BACKGROUNDS.filter(isBgUnlocked).length;
    if (countEl) {
      countEl.textContent = LearningHausI18n.t(
        `${unlockedTotal}/${AVATAR_BACKGROUNDS.length} Unlocked`,
        `ปลดล็อกแล้ว ${unlockedTotal}/${AVATAR_BACKGROUNDS.length}`
      );
    }

    document.querySelectorAll<HTMLButtonElement>("[data-profile-bg-filter]").forEach((btn) => {
      const match = (btn.dataset.profileBgFilter || "all") === activeBgFilter;
      btn.classList.toggle("is-active", match);
      btn.setAttribute("aria-pressed", String(match));
    });

    const filtered = AVATAR_BACKGROUNDS.filter((bg) => activeBgFilter === "all" || bg.source === activeBgFilter);
    const lockSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>`;
    const checkSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

    grid.replaceChildren(
      ...filtered.map((bg) => {
        const unlocked = isBgUnlocked(bg);
        const selected = bg.id === activeBg;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `profile-bg-swatch${selected ? " is-selected" : ""}${!unlocked ? " is-locked" : ""}`;
        btn.dataset.profileBgId = bg.id;
        btn.setAttribute("aria-pressed", String(selected));
        btn.title = `${localizeBgName(bg)}: ${localizeBgHint(bg)}`;

        const circle = document.createElement("span");
        circle.className = "profile-bg-swatch__circle";
        const img = document.createElement("img");
        img.src = renderBgSwatchDataUrl(bg.id, 80);
        img.alt = localizeBgName(bg);
        circle.append(img);

        if (selected) {
          const badge = document.createElement("span");
          badge.className = "profile-bg-swatch__badge is-check";
          badge.innerHTML = checkSvg;
          circle.append(badge);
        } else if (!unlocked) {
          const badge = document.createElement("span");
          badge.className = "profile-bg-swatch__badge is-lock";
          badge.innerHTML = lockSvg;
          circle.append(badge);
        }

        const name = document.createElement("strong");
        name.className = "profile-bg-swatch__name";
        name.textContent = localizeBgName(bg);

        const tag = document.createElement("small");
        tag.className = `profile-bg-swatch__tag is-${bg.source}`;
        tag.textContent =
          bg.source === "starter"
            ? LearningHausI18n.t("Starter", "เริ่มต้น")
            : bg.source === "achievement"
              ? LearningHausI18n.t("Achievement", "ความสำเร็จ")
              : LearningHausI18n.t("Quest", "เควส");

        btn.append(circle, name, tag);
        btn.addEventListener("click", () => {
          if (!unlocked) {
            bgStatusOverride = {
              text: `${localizeBgName(bg)}: ${localizeBgHint(bg)}`,
              locked: true
            };
            renderProfileBgPicker();
            return;
          }
          void equipProfileBg(bg.id);
        });
        return btn;
      })
    );

    if (statusEl) {
      if (bgStatusOverride) {
        statusEl.hidden = false;
        statusEl.classList.toggle("is-locked", bgStatusOverride.locked);
        statusEl.textContent = bgStatusOverride.text;
      } else {
        const activeDef = AVATAR_BACKGROUNDS.find((b) => b.id === activeBg) || AVATAR_BACKGROUNDS[0];
        statusEl.hidden = false;
        statusEl.classList.remove("is-locked");
        statusEl.textContent = LearningHausI18n.t(
          `Active: ${activeDef.name} · Unlock special colors and pixel patterns from Achievements and Quests.`,
          `ใช้งานอยู่: ${activeDef.nameTh} · ปลดล็อกสีและลายพิเศษเพิ่มเติมได้จากการทำเควสและ Achievement`
        );
      }
    }
  };

  export const syncFromServerAccount = (account: LearningHausTypes.ServerAccountPerson): void => {
    if (account.catPresets && typeof account.catPresets === "string") {
      try {
        const parsedPresets = JSON.parse(account.catPresets);
        if (Array.isArray(parsedPresets) && parsedPresets.length > 0) {
          writePresetSlots(parsedPresets);
        }
      } catch {
        // ignore invalid preset JSON
      }
    }
    if (account.catConfig && typeof account.catConfig === "string" && account.catConfig.trim()) {
      try {
        const parsedConfig = JSON.parse(account.catConfig);
        if (parsedConfig && typeof parsedConfig === "object") {
          const normalized = normalizeConfig(parsedConfig);
          LearningHausAccountStorage.writeJson(STORAGE_KEY, normalized);
        }
      } catch {
        // ignore invalid config JSON
      }
    }
    renderProfilePageSlots();
    renderProfileBgPicker();
    refreshCreatorUiHook?.();
    window.dispatchEvent(new CustomEvent("learninghaus:pixel-cat-updated"));
  };

  const init = (): void => {
    // อัปเดตรูปตัวอย่าง NPC ในหน้า Leaderboard / Looking-People ให้เป็นแมว Pixel พื้นหลังโปร่งใสทั้งหมด
    document.querySelectorAll<HTMLElement>("[data-looking-person]").forEach((row) => {
      const personName = row.dataset.lookingPerson || "KITTYCAT";
      const avatarAttr = row.dataset.personAvatar || "";
      if (!avatarAttr || avatarAttr.includes("Profire/PF0")) {
        const npcUrl = getNpcAvatarDataUrl(personName, 156);
        row.dataset.personAvatar = npcUrl;
        const img = row.querySelector<HTMLImageElement>("img");
        if (img) img.src = npcUrl;
      }
    });

    renderProfilePageSlots();
    renderProfileBgPicker();

    document.querySelectorAll<HTMLButtonElement>("[data-profile-bg-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeBgFilter = (btn.dataset.profileBgFilter as "all" | AvatarBgSource) || "all";
        bgStatusOverride = null;
        renderProfileBgPicker();
      });
    });

    const dialog = document.getElementById("pixel-cat-dialog") as HTMLDialogElement | null;
    if (!dialog) return;

    const previewCanvas = dialog.querySelector<HTMLCanvasElement>("[data-pixel-cat-canvas]");
    const wheelCanvas = dialog.querySelector<HTMLCanvasElement>("[data-pixel-cat-wheel]");
    const wheelCursor = dialog.querySelector<HTMLElement>("[data-pixel-cat-wheel-cursor]");
    const valueRange = dialog.querySelector<HTMLInputElement>("[data-pixel-cat-value]");
    const valueLabel = dialog.querySelector<HTMLElement>("[data-pixel-cat-value-label]");
    const opacityRange = dialog.querySelector<HTMLInputElement>("[data-pixel-cat-opacity]");
    const opacityLabel = dialog.querySelector<HTMLElement>("[data-pixel-cat-opacity-label]");
    const hexInput = dialog.querySelector<HTMLInputElement>("[data-pixel-cat-hex]");
    const rgbaDisplay = dialog.querySelector<HTMLElement>("[data-pixel-cat-rgba]");
    const swatchPreview = dialog.querySelector<HTMLElement>("[data-pixel-cat-swatch]");
    const activeChannelBadge = dialog.querySelector<HTMLElement>("[data-pixel-cat-active-channel]");
    const propsContainer = dialog.querySelector<HTMLElement>("[data-pixel-cat-props]");
    const propStatusBanner = dialog.querySelector<HTMLElement>("[data-pixel-cat-prop-status]");
    const demoUnlockToggle = dialog.querySelector<HTMLInputElement>("[data-pixel-cat-demo-unlock]");
    const gridToggle = dialog.querySelector<HTMLInputElement>("[data-pixel-cat-grid-toggle]");
    const stageBubble = dialog.querySelector<HTMLElement>("[data-pixel-cat-stage-bubble]");
    const stageCaption = dialog.querySelector<HTMLElement>("[data-pixel-cat-stage-caption]");
    const presetContainer = dialog.querySelector<HTMLElement>("[data-pixel-cat-presets]");
    const presetPopover = dialog.querySelector<HTMLElement>("[data-pixel-cat-preset-popover]");
    const presetSlotLabel = dialog.querySelector<HTMLElement>("[data-pixel-cat-preset-slot-label]");
    const presetNameInput = dialog.querySelector<HTMLInputElement>("[data-pixel-cat-preset-name]");
    const presetStatus = dialog.querySelector<HTMLElement>("[data-pixel-cat-preset-status]");
    const modeCreateBtn = dialog.querySelector<HTMLButtonElement>('[data-pixel-cat-mode="create"]');
    const modeWardrobeBtn = dialog.querySelector<HTMLButtonElement>('[data-pixel-cat-mode="wardrobe"]');
    const panelTitleEl = dialog.querySelector<HTMLElement>("[data-pixel-cat-panel-title]");
    const panelSubEl = dialog.querySelector<HTMLElement>("[data-pixel-cat-panel-sub]");
    const stepTagEl = dialog.querySelector<HTMLElement>("[data-pixel-cat-step-tag]");
    const lockTipEl = dialog.querySelector<HTMLElement>("[data-pixel-cat-lock-tip]");
    const dyeEmptyEl = dialog.querySelector<HTMLElement>("[data-pixel-cat-dye-empty]");
    const dyeActiveEl = dialog.querySelector<HTMLElement>("[data-pixel-cat-dye-active]");
    const swatchesContainer = dialog.querySelector<HTMLElement>("[data-pixel-cat-swatches]");
    const wheelToggleBtn = dialog.querySelector<HTMLButtonElement>("[data-pixel-cat-wheel-toggle]");
    const wheelPopover = dialog.querySelector<HTMLElement>("[data-pixel-cat-wheel-popover]");
    const primaryCtaBtn = dialog.querySelector<HTMLButtonElement>("[data-pixel-cat-primary-cta]");
    const quickSaveBtn = dialog.querySelector<HTMLButtonElement>("[data-pixel-cat-save-quick]");
    const animToggleBtn = dialog.querySelector<HTMLButtonElement>("[data-pixel-cat-anim-toggle]");
    if (!previewCanvas || !wheelCanvas || !valueRange || !opacityRange || !propsContainer) return;

    let config: CatConfig = readSavedConfig();
    let selectedPresetSlot = 1;
    let activeCategoryTab: CreatorCategoryTab = "fur";
    let activeTarget: ColorTarget = "fur";
    let furPicked = LearningHausAccountStorage.readJson<boolean>(CREATED_GATE_KEY, false);
    let eyesPicked = furPicked;
    let wheelExpanded = false;
    let lastWheelBrightness = -1;
    let animPaused = LearningHausAccountStorage.readJson<boolean>(ANIM_PAUSED_KEY, false);
    let demoUnlockAll = LearningHausAccountStorage.readJson<boolean>(DEMO_UNLOCK_KEY, false);
    if (demoUnlockToggle) demoUnlockToggle.checked = demoUnlockAll;
    if (gridToggle) gridToggle.checked = Boolean(config.showGrid);

    let animFrameIdx = 0;
    let animTimerId: number | null = null;
    const FRAME_DURATION_MS = 380;

    const getCurrentAnimPose = (): IdleAnimPose => {
      if (animPaused) {
        return NEUTRAL_POSE;
      }
      return IDLE_ANIM_FRAMES[animFrameIdx % IDLE_ANIM_FRAMES.length];
    };

    const syncAnimToggleUi = (): void => {
      dialog.classList.toggle("is-anim-paused", animPaused);
      if (!animToggleBtn) return;
      animToggleBtn.classList.toggle("is-on", animPaused);
      animToggleBtn.setAttribute("aria-pressed", String(animPaused));
      animToggleBtn.title = animPaused
        ? LearningHausI18n.t("Animation paused (reduces motion) · Click to resume", "แอนิเมชันหยุดอยู่ (ลดอาการกระตุก) · คลิกเพื่อเปิดใหม่")
        : LearningHausI18n.t("Pause idle animation to reduce motion", "หยุดแอนิเมชันเพื่อลดอาการกระตุก");
      const iconEl = animToggleBtn.querySelector<HTMLElement>("[data-pixel-cat-anim-icon]");
      const labelEl = animToggleBtn.querySelector<HTMLElement>("[data-pixel-cat-anim-label]");
      if (iconEl) {
        iconEl.innerHTML = animPaused
          ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>`
          : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
      }
      if (labelEl) {
        labelEl.textContent = animPaused
          ? LearningHausI18n.t("Play", "เปิดขยับ")
          : LearningHausI18n.t("Pause", "หยุดขยับ");
      }
    };

    const stopIdleAnimation = (): void => {
      if (animTimerId !== null) {
        window.clearInterval(animTimerId);
        animTimerId = null;
      }
    };

    const startIdleAnimation = (): void => {
      if (animPaused) {
        stopIdleAnimation();
        return;
      }
      if (animTimerId !== null) return;
      animTimerId = window.setInterval(() => {
        if (animPaused || (!dialog.open && !dialog.hasAttribute("open"))) {
          stopIdleAnimation();
          return;
        }
        animFrameIdx = (animFrameIdx + 1) % IDLE_ANIM_FRAMES.length;
        renderCatToCanvas(previewCanvas, config, getCurrentAnimPose());
      }, FRAME_DURATION_MS);
    };

    const isPropUnlocked = (prop: PropDefinition): boolean => {
      if (demoUnlockAll) return true;
      if (prop.questId) {
        return Boolean(window.LearningHausQuests?.isRewardUnlocked?.(prop.id));
      }
      if (!prop.achievementId) return true;
      return getUnlockedAchievementIds().has(prop.achievementId);
    };

    const ensureValidActiveTarget = (): void => {
      const available = getAvailableColorChannels(config);
      if (!available.some((ch) => ch.target === activeTarget)) {
        const categoryMatch = available.find((ch) => ch.category === activeCategoryTab);
        activeTarget = categoryMatch ? categoryMatch.target : "fur";
      }
    };

    const saveConfigToStorage = (): void => {
      LearningHausAccountStorage.writeJson(STORAGE_KEY, config);
    };

    const setPresetFeedback = (msg: string): void => {
      if (!presetStatus) return;
      presetStatus.hidden = !msg;
      presetStatus.textContent = msg;
    };

    const updateWheelCursorAndInputs = (): void => {
      ensureValidActiveTarget();
      const layer = config.colors[activeTarget];
      const radius = wheelCanvas.width / 2;
      const rad = (layer.h * Math.PI) / 180;
      const dist = (layer.s / 100) * radius;
      const x = radius + Math.cos(rad) * dist;
      const y = radius + Math.sin(rad) * dist;
      if (wheelCursor) {
        wheelCursor.style.left = `${(x / wheelCanvas.width) * 100}%`;
        wheelCursor.style.top = `${(y / wheelCanvas.height) * 100}%`;
      }
      const roundedV = Math.round(layer.v);
      const roundedA = Math.round(layer.a);
      valueRange.value = String(roundedV);
      if (valueLabel) valueLabel.textContent = `${roundedV}%`;
      opacityRange.value = String(roundedA);
      if (opacityLabel) opacityLabel.textContent = `${roundedA}%`;

      const [r, g, b] = hsvToRgb(layer.h, layer.s, layer.v);
      const hex = toHex(r, g, b);
      if (hexInput && document.activeElement !== hexInput) hexInput.value = hex;
      if (rgbaDisplay) rgbaDisplay.textContent = `RGBA(${r}, ${g}, ${b}, ${(layer.a / 100).toFixed(2)})`;
      if (swatchPreview) swatchPreview.style.background = directRgbaCss(layer);

      const channelMeta = getAvailableColorChannels(config).find((c) => c.target === activeTarget);
      if (activeChannelBadge) {
        activeChannelBadge.textContent = channelMeta
          ? channelMeta.label
          : LearningHausI18n.t("Base Fur", "สีขนหลัก");
      }
    };

    const renderPresetSlotsUi = (): void => {
      const presetSlots = readPresetSlots();
      if (!presetContainer) return;

      const currentSlotObj = presetSlots.find((s) => s.slot === selectedPresetSlot) || presetSlots[0];
      if (presetNameInput && document.activeElement !== presetNameInput) {
        presetNameInput.value = currentSlotObj.name;
      }
      if (presetSlotLabel) {
        presetSlotLabel.textContent = LearningHausI18n.t(
          `Manage Preset Slot ${currentSlotObj.slot}: ${currentSlotObj.name}`,
          `จัดการพรีเซ็ตช่อง ${currentSlotObj.slot}: ${currentSlotObj.name}`
        );
      }

      presetContainer.replaceChildren(
        ...presetSlots.map((slot) => {
          const isSelected = slot.slot === selectedPresetSlot;
          const bubble = document.createElement("button");
          bubble.type = "button";
          bubble.className = `pixel-cat__preset-bubble${isSelected ? " is-active" : ""}${
            slot.config ? "" : " is-empty"
          }`;
          bubble.dataset.pixelCatPresetSlot = String(slot.slot);
          bubble.dataset.pixelCatPresetLoad = String(slot.slot);
          bubble.title = slot.config
            ? LearningHausI18n.t(
                `Slot ${slot.slot}: ${slot.name} (Click to load)`,
                `ช่อง ${slot.slot}: ${slot.name} (คลิกเพื่อโหลด)`
              )
            : LearningHausI18n.t(
                `Empty Slot ${slot.slot} (Click then press Save below)`,
                `ช่องว่าง ${slot.slot} (คลิกแล้วกดปุ่มบันทึกด้านล่าง)`
              );

          if (slot.config) {
            const mini = document.createElement("canvas");
            mini.width = 72;
            mini.height = 72;
            mini.className = "pixel-cat__preset-bubble-canvas";
            renderCatToCanvas(mini, { ...slot.config, showGrid: false }, NEUTRAL_POSE);
            bubble.appendChild(mini);
          } else {
            const plus = document.createElement("span");
            plus.className = "pixel-cat__preset-bubble-plus";
            plus.textContent = "+";
            bubble.appendChild(plus);
          }

          const numBadge = document.createElement("span");
          numBadge.className = "pixel-cat__preset-bubble-num";
          numBadge.textContent = String(slot.slot);
          bubble.appendChild(numBadge);

          bubble.addEventListener("click", () => {
            selectedPresetSlot = slot.slot;
            if (presetNameInput) presetNameInput.value = slot.name;
            if (slot.config) {
              config = normalizeConfig(slot.config);
              furPicked = true;
              eyesPicked = true;
              ensureValidActiveTarget();
              setPresetFeedback(
                LearningHausI18n.t(
                  `Loaded preset "${slot.name}" (Slot ${slot.slot}).`,
                  `โหลดพรีเซ็ต "${slot.name}" (ช่อง ${slot.slot}) เรียบร้อยแล้ว`
                )
              );
              renderAll(true);
            } else {
              if (presetPopover) presetPopover.hidden = false;
              setPresetFeedback(
                LearningHausI18n.t(
                  `Selected Empty Slot ${slot.slot}. Click "Save" to keep your current look.`,
                  `เลือกช่องว่าง ${slot.slot} แล้ว กด "บันทึก" เพื่อเก็บชุดปัจจุบัน`
                )
              );
              renderPresetSlotsUi();
            }
          });

          return bubble;
        })
      );
    };

    refreshCreatorPresetsOnlyHook = renderPresetSlotsUi;

    const renderPropButtons = (): void => {
      propsContainer.replaceChildren(
        ...PROPS.map((prop) => {
          const unlocked = isPropUnlocked(prop);
          const selected = config.prop === prop.id;
          const propName = localizePropName(prop);
          const achName = localizePropAchievement(prop);
          const button = document.createElement("button");
          button.type = "button";
          button.className = `pixel-cat__prop-btn${selected ? " is-selected" : ""}${!unlocked ? " is-locked" : ""}${prop.questId ? " is-quest-exclusive" : ""}`;
          button.dataset.propId = prop.id;
          button.setAttribute("aria-pressed", String(selected));

          const thumb = document.createElement("span");
          thumb.className = "pixel-cat__prop-thumb";
          thumb.setAttribute("aria-hidden", "true");
          if (prop.id === "none") {
            thumb.innerHTML = `<svg viewBox="0 0 16 16" width="22" height="22"><circle cx="8" cy="8" r="5" fill="none" stroke="#99ad7a" stroke-width="1.5" stroke-dasharray="2 2"/><path d="M5.5 5.5l5 5" stroke="#99ad7a" stroke-width="1.5"/></svg>`;
          } else {
            const img = document.createElement("img");
            img.src = renderPropPreviewDataUrl(prop.id, config, 72);
            img.alt = "";
            thumb.append(img);
          }

          const copyWrap = document.createElement("span");
          copyWrap.className = "pixel-cat__prop-copy";

          const titleRow = document.createElement("span");
          titleRow.className = "pixel-cat__prop-title-row";
          const label = document.createElement("strong");
          label.textContent = propName;
          titleRow.append(label);
          if (prop.questId) {
            const questTag = document.createElement("span");
            questTag.className = "pixel-cat__quest-pill";
            questTag.textContent = LearningHausI18n.t("Quest Exclusive", "เฉพาะเควส");
            titleRow.append(questTag);
          }
          const badge = document.createElement("small");
          badge.textContent = unlocked
            ? prop.questId
              ? LearningHausI18n.t(`Unlocked via ${achName}`, `ปลดล็อกจาก ${achName}`)
              : prop.achievementId
                ? LearningHausI18n.t(`Unlocked via ${achName}`, `ปลดล็อกจาก ${achName}`)
                : LearningHausI18n.t("Ready to equip", "พร้อมใช้งาน")
            : prop.questId
              ? LearningHausI18n.t(`Locked · Claim in Quests (${achName})`, `ล็อกอยู่ · รับจากเควส (${achName})`)
              : LearningHausI18n.t(`Locked (Requires ${achName})`, `ล็อกอยู่ (ต้องผ่าน ${achName})`);

          copyWrap.append(titleRow, badge);
          button.append(thumb, copyWrap);
          button.addEventListener("click", () => {
            config.prop = prop.id;
            if (prop.id !== "none") {
              activeTarget = "prop1";
            } else if (activeTarget.startsWith("prop")) {
              activeTarget = "fur";
            }
            renderAll();
          });
          return button;
        })
      );

      const currentProp = PROPS.find((item) => item.id === config.prop) || PROPS[0];
      const unlocked = isPropUnlocked(currentProp);
      if (propStatusBanner) {
        propStatusBanner.hidden = unlocked && !currentProp.achievementId && !currentProp.questId;
        propStatusBanner.classList.toggle("is-locked-warning", !unlocked);
        const propName = localizePropName(currentProp);
        const achName = localizePropAchievement(currentProp);
        const hint = localizePropHint(currentProp);
        propStatusBanner.textContent = unlocked
          ? currentProp.questId
            ? LearningHausI18n.t(
                `Equipped: ${propName} (Quest Exclusive: ${achName})`,
                `กำลังสวมใส่: ${propName} (พร็อพพิเศษจากเควส: ${achName})`
              )
            : LearningHausI18n.t(
                `Equipped: ${propName} (Achievement: ${achName})`,
                `กำลังสวมใส่: ${propName} (จาก Achievement: ${achName})`
              )
          : LearningHausI18n.t(
              `Preview Mode: ${propName} (${hint})`,
              `โหมดทดลองสวม: ${propName} (${hint})`
            );
      }
    };

    const isWardrobeUnlocked = (): boolean => furPicked && eyesPicked;

    const renderHeartopiaSwatches = (): void => {
      if (!swatchesContainer) return;
      const palette = CATEGORY_SWATCHES[activeCategoryTab] || CATEGORY_SWATCHES.fur;
      const layer = config.colors[activeTarget];
      const [cr, cg, cb] = hsvToRgb(layer.h, layer.s, layer.v);
      const currentHex = toHex(cr, cg, cb).toLowerCase();

      swatchesContainer.replaceChildren(
        ...palette.map((hex) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `pixel-cat__circle-swatch${currentHex === hex.toLowerCase() ? " is-active" : ""}`;
          btn.style.background = hex;
          btn.title = hex;
          btn.setAttribute("aria-label", `Select color ${hex}`);
          btn.addEventListener("click", () => {
            const clean = hex.replace("#", "");
            const intVal = parseInt(clean, 16);
            const r = (intVal >> 16) & 255;
            const g = (intVal >> 8) & 255;
            const b = intVal & 255;
            const [h, s, v] = rgbToHsv(r, g, b);
            config.colors[activeTarget] = { ...config.colors[activeTarget], h, s, v, a: 100 };
            if (activeTarget === "eyeLeft" && config.eyeStyle !== "heterochromia") {
              config.colors.eyeRight = { ...config.colors.eyeRight, h, s, v, a: 100 };
            }
            renderAll();
          });
          return btn;
        })
      );
    };

    const syncOptionButtons = (): void => {
      ensureValidActiveTarget();
      const patternDef = PATTERN_CATALOG[config.pattern] || PATTERN_CATALOG.tabby;
      const activePatternSlots = patternDef.activeSlots;
      const outfitDef = OUTFIT_CATALOG[config.outfit] || OUTFIT_CATALOG.none;
      const propDef = PROPS.find((item) => item.id === config.prop) || PROPS[0];
      const outfitEquipped = config.outfit !== "none";
      const propEquipped = config.prop !== "none";
      const doneCount = (furPicked ? 1 : 0) + (eyesPicked ? 1 : 0);
      const unlocked = isWardrobeUnlocked();
      const inWardrobe = activeCategoryTab === "outfit" || activeCategoryTab === "prop";

      if (!unlocked && inWardrobe) {
        activeCategoryTab = "fur";
      }

      // Sync Heartopia Mode Pills
      if (modeCreateBtn) {
        modeCreateBtn.classList.toggle("is-active", !inWardrobe);
      }
      if (modeWardrobeBtn) {
        modeWardrobeBtn.classList.toggle("is-active", inWardrobe);
        modeWardrobeBtn.classList.toggle("is-locked", !unlocked);
        const modeLock = modeWardrobeBtn.querySelector<HTMLElement>("[data-pixel-cat-mode-lock]");
        if (modeLock) modeLock.hidden = unlocked;
      }

      // Sync Vertical Rail Tabs, Done Dots, and Locks
      const furDot = dialog.querySelector<HTMLElement>('[data-pixel-cat-done-dot="fur"]');
      const eyesDot = dialog.querySelector<HTMLElement>('[data-pixel-cat-done-dot="eyes"]');
      if (furDot) furDot.hidden = !furPicked;
      if (eyesDot) eyesDot.hidden = !eyesPicked;

      dialog.querySelectorAll<HTMLElement>("[data-pixel-cat-tab]").forEach((tabBtn) => {
        const tabId = tabBtn.dataset.pixelCatTab as CreatorCategoryTab | undefined;
        const isCurrent = tabId === activeCategoryTab;
        const isGated = (tabId === "outfit" || tabId === "prop") && !unlocked;
        tabBtn.classList.toggle("is-active", isCurrent);
        tabBtn.classList.toggle("is-locked", isGated);
        tabBtn.setAttribute("aria-selected", String(isCurrent));
        tabBtn.setAttribute("aria-disabled", String(isGated));
        const lockBadge = tabId
          ? dialog.querySelector<HTMLElement>(`[data-pixel-cat-lock-badge="${tabId}"]`)
          : null;
        if (lockBadge) lockBadge.hidden = unlocked;
      });

      dialog.querySelectorAll<HTMLElement>("[data-pixel-cat-panel]").forEach((panel) => {
        const panelId = panel.dataset.pixelCatPanel as CreatorCategoryTab | undefined;
        panel.hidden = panelId !== activeCategoryTab;
      });

      // Sync Panel Header & Stage Caption
      const PANEL_META: Record<CreatorCategoryTab, [string, string]> = {
        fur: [
          LearningHausI18n.t("Fur & Patterns", "ขนและลวดลาย"),
          LearningHausI18n.t("Pick your favorite coat pattern first, then customize colors", "แตะเลือกลายขนที่ชอบก่อน แล้วค่อยปรับเฉดสี")
        ],
        eyes: [
          LearningHausI18n.t("Eye Style", "ทรงดวงตา"),
          LearningHausI18n.t("Choose an eye style to open the eye color palette below", "แตะเลือกทรงดวงตา เพื่อเปิดจานสีตาด้านล่าง")
        ],
        outfit: [
          LearningHausI18n.t("Wardrobe Outfits", "เสื้อผ้า (Wardrobe)"),
          LearningHausI18n.t("Select an outfit first to unlock its color channels", "แตะเลือกชุดก่อน จานสีของชุดนั้นจึงจะเปิดให้ปรับ")
        ],
        prop: [
          LearningHausI18n.t("Props & Hats", "พร็อพและหมวก"),
          LearningHausI18n.t("Equip unlocked props to personalize your cat", "แตะเลือกพร็อพที่ปลดล็อกแล้ว เพื่อแต่งเติม")
        ]
      };
      if (panelTitleEl) panelTitleEl.textContent = PANEL_META[activeCategoryTab][0];
      if (panelSubEl) panelSubEl.textContent = PANEL_META[activeCategoryTab][1];
      if (stepTagEl) {
        stepTagEl.textContent = unlocked
          ? LearningHausI18n.t("Wardrobe Unlocked", "ปลดล็อกแต่งตัวแล้ว")
          : LearningHausI18n.t(`${doneCount}/2 Steps`, `${doneCount}/2 ขั้นสร้างตัว`);
      }
      if (lockTipEl) lockTipEl.hidden = unlocked;

      if (stageCaption) {
        stageCaption.textContent = !unlocked
          ? LearningHausI18n.t(
              `Create Character: Choose fur pattern and eye style (${doneCount}/2)`,
              `สร้างตัวละคร: เลือกลายขนและดวงตา (${doneCount}/2)`
            )
          : inWardrobe
            ? LearningHausI18n.t(
                "Wardrobe Mode · Pick an outfit or prop on the right",
                "โหมดตู้เสื้อผ้า · แตะเลือกชุดหรือพร็อพด้านขวา"
              )
            : LearningHausI18n.t(
                "Character ready! Continue to the Wardrobe to dress up.",
                "สร้างตัวละครครบแล้ว! ไปแต่งตัวในตู้เสื้อผ้าได้เลย"
              );
      }
      if (stageBubble) {
        stageBubble.classList.toggle("is-grid", Boolean(config.showGrid));
      }
      if (gridToggle) {
        gridToggle.closest(".pixel-cat__round-tool")?.classList.toggle("is-on", Boolean(config.showGrid));
      }

      // Context-Gated Dye Drawer: Only open when the active tab has a chosen item!
      const hasSelectedItemInActiveTab =
        (activeCategoryTab === "fur" && furPicked) ||
        (activeCategoryTab === "eyes" && eyesPicked) ||
        (activeCategoryTab === "outfit" && outfitEquipped) ||
        (activeCategoryTab === "prop" && propEquipped);

      if (dyeEmptyEl) {
        dyeEmptyEl.hidden = hasSelectedItemInActiveTab;
        if (!hasSelectedItemInActiveTab) {
          const emptyStrong = dyeEmptyEl.querySelector("strong");
          if (emptyStrong) {
            emptyStrong.textContent =
              activeCategoryTab === "fur"
                ? LearningHausI18n.t("No fur pattern selected", "ยังไม่ได้เลือกลายขน")
                : activeCategoryTab === "eyes"
                  ? LearningHausI18n.t("No eye style selected", "ยังไม่ได้เลือกทรงดวงตา")
                  : activeCategoryTab === "outfit"
                    ? LearningHausI18n.t("No outfit selected", "ยังไม่ได้เลือกเสื้อผ้า")
                    : LearningHausI18n.t("No prop selected", "ยังไม่ได้เลือกพร็อพ");
          }
        }
      }
      if (dyeActiveEl) dyeActiveEl.hidden = !hasSelectedItemInActiveTab;

      // Show ONLY the color zones that belong to the active tab
      const visibleTargetsForTab: ColorTarget[] = [];
      dialog.querySelectorAll<HTMLButtonElement>("[data-pixel-cat-target]").forEach((btn) => {
        const target = btn.dataset.pixelCatTarget as ColorTarget | undefined;
        if (!target) return;

        let isVisible = false;
        let dynamicLabel = btn.dataset.defaultLabel || btn.textContent || target;

        if (activeCategoryTab === "fur") {
          if (target === "fur") {
            isVisible = furPicked;
            dynamicLabel = LearningHausI18n.t("Base Fur", "สีขนหลัก");
          } else if (target === "pattern1" || target === "pattern2" || target === "pattern3") {
            isVisible = furPicked && activePatternSlots.includes(target);
            dynamicLabel = localizePatternSlot(patternDef, target);
          }
        } else if (activeCategoryTab === "eyes") {
          if (target === "eyeLeft") {
            isVisible = eyesPicked;
            dynamicLabel =
              config.eyeStyle === "heterochromia"
                ? LearningHausI18n.t("Left Eye", "สีตาซ้าย")
                : LearningHausI18n.t("Eye Color", "สีดวงตา");
          } else if (target === "eyeRight") {
            isVisible = eyesPicked && config.eyeStyle === "heterochromia";
            dynamicLabel = LearningHausI18n.t("Right Eye", "สีตาขวา");
          } else if (target === "eyeGlint") {
            isVisible = eyesPicked;
            dynamicLabel = LearningHausI18n.t("Eye Highlight", "ประกายตา");
          }
        } else if (activeCategoryTab === "outfit") {
          if (target === "outfit1" || target === "outfit2" || target === "outfit3") {
            const found = outfitDef.channels.find((ch) => ch.target === target);
            if (outfitEquipped && found) {
              isVisible = true;
              dynamicLabel = LearningHausI18n.t(found.label, found.labelTh);
            }
          }
        } else if (activeCategoryTab === "prop") {
          if (target === "prop1" || target === "prop2" || target === "prop3") {
            const found = propDef.channels.find((ch) => ch.target === target);
            if (propEquipped && found) {
              isVisible = true;
              dynamicLabel = LearningHausI18n.t(found.label, found.labelTh);
            }
          }
        }

        if (isVisible) visibleTargetsForTab.push(target);

        btn.hidden = !isVisible;
        btn.style.display = isVisible ? "" : "none";
        btn.disabled = !isVisible;

        const labelSpan = btn.querySelector<HTMLElement>("[data-target-label]");
        if (labelSpan) labelSpan.textContent = dynamicLabel;
        else btn.textContent = dynamicLabel;

        const dotSpan = btn.querySelector<HTMLElement>("[data-target-dot]");
        if (dotSpan) dotSpan.style.background = directRgbaCss(config.colors[target]);
      });

      if (visibleTargetsForTab.length > 0 && !visibleTargetsForTab.includes(activeTarget)) {
        activeTarget = visibleTargetsForTab[0];
      }

      dialog.querySelectorAll<HTMLButtonElement>("[data-pixel-cat-target]").forEach((btn) => {
        const target = btn.dataset.pixelCatTarget as ColorTarget | undefined;
        const active = Boolean(target && target === activeTarget && !btn.hidden);
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", String(active));
      });

      // Highlight selected tiles (only highlight Fur/Eyes once picked!)
      dialog.querySelectorAll<HTMLElement>("[data-pixel-cat-pattern]").forEach((btn) => {
        btn.classList.toggle("is-selected", furPicked && btn.dataset.pixelCatPattern === config.pattern);
      });
      dialog.querySelectorAll<HTMLElement>("[data-pixel-cat-eye]").forEach((btn) => {
        btn.classList.toggle("is-selected", eyesPicked && btn.dataset.pixelCatEye === config.eyeStyle);
      });
      dialog.querySelectorAll<HTMLElement>("[data-pixel-cat-outfit]").forEach((btn) => {
        btn.classList.toggle("is-selected", btn.dataset.pixelCatOutfit === config.outfit);
      });

      // Sync Wheel Popover & Circular Swatches
      if (wheelPopover) wheelPopover.hidden = !wheelExpanded || !hasSelectedItemInActiveTab;
      if (wheelToggleBtn) {
        wheelToggleBtn.classList.toggle("is-open", wheelExpanded);
        wheelToggleBtn.setAttribute("aria-expanded", String(wheelExpanded));
      }
      if (hasSelectedItemInActiveTab) {
        renderHeartopiaSwatches();
      }

      // Sync Primary Bottom CTA & Quick Save (single Save overwrites active slot)
      if (primaryCtaBtn) {
        if (!unlocked) {
          primaryCtaBtn.disabled = true;
          primaryCtaBtn.textContent = LearningHausI18n.t(
            `Select Fur & Eyes first (${doneCount}/2)`,
            `เลือกขนและดวงตาก่อน (${doneCount}/2)`
          );
        } else if (!inWardrobe) {
          primaryCtaBtn.disabled = false;
          primaryCtaBtn.textContent = LearningHausI18n.t("Go to Wardrobe →", "ไปตู้เสื้อผ้า →");
        } else {
          primaryCtaBtn.disabled = false;
          primaryCtaBtn.textContent = LearningHausI18n.t("Save", "บันทึก");
        }
      }
      if (quickSaveBtn) {
        quickSaveBtn.hidden = !unlocked || inWardrobe;
        quickSaveBtn.textContent = LearningHausI18n.t("Save", "บันทึก");
      }
    };

    const renderAll = (includePresets = false): void => {
      syncOptionButtons();
      ensureValidActiveTarget();
      renderCatToCanvas(previewCanvas, config, getCurrentAnimPose());
      if (wheelExpanded) {
        const roundedV = Math.round(config.colors[activeTarget].v);
        if (roundedV !== lastWheelBrightness) {
          drawColorWheel(wheelCanvas, roundedV);
          lastWheelBrightness = roundedV;
        }
      }
      updateWheelCursorAndInputs();
      if (activeCategoryTab === "prop") renderPropButtons();
      if (includePresets) renderPresetSlotsUi();
      saveConfigToStorage();
    };

    refreshCreatorUiHook = () => {
      config = readSavedConfig();
      renderAll(true);
    };

    let draggingWheel = false;
    const pickFromWheel = (clientX: number, clientY: number): void => {
      const rect = wheelCanvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const radius = rect.width / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const dist = Math.min(radius, Math.hypot(dx, dy));
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const newH = Number(((angle + 360) % 360).toFixed(2));
      const newS = Number(((dist / radius) * 100).toFixed(2));
      config.colors[activeTarget].h = newH;
      config.colors[activeTarget].s = newS;
      if (activeTarget === "eyeLeft" && config.eyeStyle !== "heterochromia") {
        config.colors.eyeRight.h = newH;
        config.colors.eyeRight.s = newS;
      }
      renderCatToCanvas(previewCanvas, config, getCurrentAnimPose());
      updateWheelCursorAndInputs();
      syncOptionButtons();
      saveConfigToStorage();
    };

    wheelCanvas.addEventListener("pointerdown", (event) => {
      draggingWheel = true;
      wheelCanvas.setPointerCapture(event.pointerId);
      pickFromWheel(event.clientX, event.clientY);
    });
    wheelCanvas.addEventListener("pointermove", (event) => {
      if (!draggingWheel) return;
      pickFromWheel(event.clientX, event.clientY);
    });
    const stopWheelDrag = (): void => {
      draggingWheel = false;
    };
    wheelCanvas.addEventListener("pointerup", stopWheelDrag);
    wheelCanvas.addEventListener("pointercancel", stopWheelDrag);

    valueRange.addEventListener("input", () => {
      const val = Number(valueRange.value);
      config.colors[activeTarget].v = val;
      if (activeTarget === "eyeLeft" && config.eyeStyle !== "heterochromia") {
        config.colors.eyeRight.v = val;
      }
      renderAll();
    });

    opacityRange.addEventListener("input", () => {
      const alpha = Number(opacityRange.value);
      config.colors[activeTarget].a = alpha;
      if (activeTarget === "eyeLeft" && config.eyeStyle !== "heterochromia") {
        config.colors.eyeRight.a = alpha;
      }
      renderCatToCanvas(previewCanvas, config, getCurrentAnimPose());
      updateWheelCursorAndInputs();
      syncOptionButtons();
      saveConfigToStorage();
    });

    const applyHexInput = (): void => {
      if (!hexInput) return;
      const raw = hexInput.value.trim();
      const match = /^#?([0-9a-fA-F]{6})$/.exec(raw);
      if (!match) return;
      const intVal = parseInt(match[1], 16);
      const r = (intVal >> 16) & 255;
      const g = (intVal >> 8) & 255;
      const b = intVal & 255;
      const [h, s, v] = rgbToHsv(r, g, b);
      config.colors[activeTarget] = { ...config.colors[activeTarget], h, s, v };
      if (activeTarget === "eyeLeft" && config.eyeStyle !== "heterochromia") {
        config.colors.eyeRight = { ...config.colors.eyeRight, h, s, v };
      }
      renderAll();
    };

    hexInput?.addEventListener("input", applyHexInput);
    hexInput?.addEventListener("change", applyHexInput);

    const switchToTab = (tabId: CreatorCategoryTab): void => {
      if ((tabId === "outfit" || tabId === "prop") && !isWardrobeUnlocked()) {
        if (stageCaption) {
          const lockMsg = LearningHausI18n.t(
            "Please select both a Fur Pattern and an Eye Style before unlocking Wardrobe.",
            "กรุณาเลือกทั้ง ลายขน และ ทรงดวงตา ก่อนปลดล็อกตู้เสื้อผ้า"
          );
          stageCaption.innerHTML =
            `<span class="pixel-cat__lock-icon" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg></span> ${lockMsg}`;
        }
        return;
      }
      activeCategoryTab = tabId;
      if (tabId === "fur" && !["fur", "pattern1", "pattern2", "pattern3"].includes(activeTarget)) {
        activeTarget = "fur";
      } else if (tabId === "eyes" && !["eyeLeft", "eyeRight", "eyeGlint"].includes(activeTarget)) {
        activeTarget = "eyeLeft";
      } else if (tabId === "outfit" && config.outfit !== "none" && !activeTarget.startsWith("outfit")) {
        activeTarget = "outfit1";
      } else if (tabId === "prop" && config.prop !== "none" && !activeTarget.startsWith("prop")) {
        activeTarget = "prop1";
      }
      renderAll();
    };

    dialog.querySelectorAll<HTMLElement>("[data-pixel-cat-tab]").forEach((tabBtn) => {
      tabBtn.addEventListener("click", () => {
        const tabId = (tabBtn.dataset.pixelCatTab as CreatorCategoryTab) || "fur";
        switchToTab(tabId);
      });
    });

    modeCreateBtn?.addEventListener("click", () => {
      switchToTab(furPicked && !eyesPicked ? "eyes" : "fur");
    });

    modeWardrobeBtn?.addEventListener("click", () => {
      switchToTab("outfit");
    });

    wheelToggleBtn?.addEventListener("click", () => {
      wheelExpanded = !wheelExpanded;
      renderAll();
    });

    dialog.querySelectorAll<HTMLElement>("[data-pixel-cat-preset-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!presetPopover) return;
        presetPopover.hidden = !presetPopover.hidden;
        if (!presetPopover.hidden) renderPresetSlotsUi();
      });
    });

    dialog.querySelector<HTMLElement>("[data-pixel-cat-preset-clear-current]")?.addEventListener("click", () => {
      if (presetNameInput) {
        presetNameInput.value = LearningHausI18n.t(`Empty Slot ${selectedPresetSlot}`, `ช่องว่าง ${selectedPresetSlot}`);
      }
      void persistPresetChange(selectedPresetSlot, null).then(() => {
        setPresetFeedback(
          LearningHausI18n.t(
            `Cleared preset in Slot ${selectedPresetSlot}.`,
            `ล้างข้อมูลพรีเซ็ตในช่อง ${selectedPresetSlot} เรียบร้อยแล้ว`
          )
        );
      });
    });

    dialog.querySelectorAll<HTMLButtonElement>("[data-pixel-cat-target]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled || btn.hidden) return;
        const target = btn.dataset.pixelCatTarget as ColorTarget | undefined;
        if (!target) return;
        activeTarget = target;
        renderAll();
      });
    });

    dialog.querySelectorAll<HTMLElement>("[data-pixel-cat-pattern]").forEach((btn) => {
      btn.addEventListener("click", () => {
        config.pattern = (btn.dataset.pixelCatPattern as FurPatternId) || "tabby";
        furPicked = true;
        if (!["fur", "pattern1", "pattern2", "pattern3"].includes(activeTarget)) {
          activeTarget = "fur";
        }
        ensureValidActiveTarget();
        renderAll();
      });
    });

    dialog.querySelectorAll<HTMLElement>("[data-pixel-cat-eye]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextStyle = (btn.dataset.pixelCatEye as EyeStyleId) || "round";
        config.eyeStyle = nextStyle;
        eyesPicked = true;
        if (!["eyeLeft", "eyeRight", "eyeGlint"].includes(activeTarget)) {
          activeTarget = "eyeLeft";
        }
        if (
          nextStyle === "heterochromia" &&
          config.colors.eyeLeft.h === config.colors.eyeRight.h &&
          config.colors.eyeLeft.s === config.colors.eyeRight.s
        ) {
          config.colors.eyeRight = {
            ...config.colors.eyeLeft,
            h: (config.colors.eyeLeft.h + 150) % 360,
            s: Math.max(70, config.colors.eyeLeft.s),
            v: Math.max(85, config.colors.eyeLeft.v)
          };
        }
        renderAll();
      });
    });

    dialog.querySelectorAll<HTMLElement>("[data-pixel-cat-outfit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        config.outfit = (btn.dataset.pixelCatOutfit as OutfitId) || "none";
        if (config.outfit !== "none") {
          activeTarget = "outfit1";
        } else if (activeTarget.startsWith("outfit")) {
          activeTarget = "fur";
        }
        renderAll();
      });
    });

    dialog.querySelector<HTMLElement>("[data-pixel-cat-preset-save-current]")?.addEventListener("click", () => {
      const slots = readPresetSlots();
      const targetSlot = slots.find((s) => s.slot === selectedPresetSlot) || slots[0];
      const newName =
        presetNameInput && presetNameInput.value.trim()
          ? presetNameInput.value.trim()
          : targetSlot.name;
      void persistPresetChange(targetSlot.slot, config, newName).then((savedSlots) => {
        const finalName = savedSlots.find((s) => s.slot === targetSlot.slot)?.name || newName;
        setPresetFeedback(
          LearningHausI18n.t(
            `Saved preset "${finalName}" to Slot ${targetSlot.slot}.`,
            `บันทึกพรีเซ็ตสีและชื่อ "${finalName}" ลงใน Slot ${targetSlot.slot} แล้ว`
          )
        );
      });
    });

    dialog.querySelector<HTMLElement>("[data-pixel-cat-preset-rename]")?.addEventListener("click", () => {
      if (!presetNameInput || !presetNameInput.value.trim()) return;
      const newName = presetNameInput.value.trim().slice(0, 28);
      const updated = readPresetSlots().map((item) =>
        item.slot === selectedPresetSlot ? { ...item, name: newName } : item
      );
      writePresetSlots(updated);
      setPresetFeedback(
        LearningHausI18n.t(
          `Renamed Slot ${selectedPresetSlot} to "${newName}".`,
          `เปลี่ยนชื่อ Slot ${selectedPresetSlot} เป็น "${newName}" แล้ว`
        )
      );
      renderPresetSlotsUi();
      renderProfilePageSlots();
      void window.LearningHausSocial?.updateAccountProfile?.({
        catPresets: JSON.stringify(updated)
      });
    });

    dialog.querySelector<HTMLElement>("[data-pixel-cat-random]")?.addEventListener("click", () => {
      const patterns: FurPatternId[] = ["tabby", "solid", "tuxedo", "calico", "siamese"];
      const eyes: EyeStyleId[] = ["round", "sparkle", "cool", "heterochromia", "happy"];
      const outfits: OutfitId[] = ["none", "scarf", "hoodie", "suit", "sweater", "cloak"];
      const unlockedProps = PROPS.filter((p) => isPropUnlocked(p));
      const randInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

      config.pattern = patterns[randInt(0, patterns.length - 1)];
      config.eyeStyle = eyes[randInt(0, eyes.length - 1)];
      config.outfit = outfits[randInt(0, outfits.length - 1)];
      config.prop = unlockedProps[randInt(0, unlockedProps.length - 1)].id;
      furPicked = true;
      eyesPicked = true;

      const leftEyeH = randInt(0, 359);
      config.colors = {
        fur: { h: randInt(0, 359), s: randInt(25, 85), v: randInt(45, 99), a: 100 },
        pattern1: { h: randInt(0, 359), s: randInt(40, 90), v: randInt(25, 92), a: 100 },
        pattern2: { h: randInt(0, 359), s: randInt(5, 75), v: randInt(40, 99), a: 100 },
        pattern3: { h: randInt(0, 359), s: randInt(5, 35), v: randInt(82, 99), a: 100 },
        eyeLeft: { h: leftEyeH, s: randInt(55, 95), v: randInt(35, 95), a: 100 },
        eyeRight: {
          h: config.eyeStyle === "heterochromia" ? (leftEyeH + randInt(110, 220)) % 360 : leftEyeH,
          s: randInt(55, 95),
          v: randInt(35, 95),
          a: 100
        },
        eyeGlint: { h: randInt(45, 75), s: randInt(4, 20), v: 99, a: 100 },
        outfit1: { h: randInt(0, 359), s: randInt(50, 90), v: randInt(50, 95), a: 100 },
        outfit2: { h: randInt(0, 359), s: randInt(15, 85), v: randInt(70, 98), a: 100 },
        outfit3: { h: randInt(0, 359), s: randInt(60, 95), v: randInt(65, 98), a: 100 },
        prop1: { h: randInt(0, 359), s: randInt(60, 95), v: randInt(70, 98), a: 100 },
        prop2: { h: randInt(0, 359), s: randInt(50, 95), v: randInt(75, 99), a: 100 },
        prop3: { h: randInt(0, 359), s: randInt(60, 95), v: randInt(80, 99), a: 100 }
      };
      ensureValidActiveTarget();
      renderAll();
    });

    dialog.querySelector<HTMLElement>("[data-pixel-cat-reset]")?.addEventListener("click", () => {
      config = defaultConfig();
      furPicked = false;
      eyesPicked = false;
      activeCategoryTab = "fur";
      activeTarget = "fur";
      wheelExpanded = false;
      animFrameIdx = 0;
      renderAll();
    });

    gridToggle?.addEventListener("change", () => {
      config.showGrid = gridToggle.checked;
      renderAll();
    });

    animToggleBtn?.addEventListener("click", () => {
      animPaused = !animPaused;
      LearningHausAccountStorage.writeJson(ANIM_PAUSED_KEY, animPaused);
      syncAnimToggleUi();
      if (animPaused) {
        stopIdleAnimation();
        renderCatToCanvas(previewCanvas, config, NEUTRAL_POSE);
      } else {
        startIdleAnimation();
        renderCatToCanvas(previewCanvas, config, getCurrentAnimPose());
      }
    });

    demoUnlockToggle?.addEventListener("change", () => {
      demoUnlockAll = demoUnlockToggle.checked;
      LearningHausAccountStorage.writeJson(DEMO_UNLOCK_KEY, demoUnlockAll);
      renderPropButtons();
      renderProfileBgPicker();
    });

    const saveAsActiveCharacter = async (): Promise<void> => {
      const selectedProp = PROPS.find((p) => p.id === config.prop) || PROPS[0];
      if (!isPropUnlocked(selectedProp)) {
        if (propStatusBanner) {
          propStatusBanner.hidden = false;
          propStatusBanner.classList.add("is-locked-warning");
          const propName = localizePropName(selectedProp);
          propStatusBanner.textContent = LearningHausI18n.t(
            `Prop "${propName}" is still locked. Choose an unlocked prop or enable Demo Unlock before saving.`,
            `พร็อพ "${propName}" ยังไม่ปลดล็อก กรุณาเลือกพร็อพที่ปลดล็อกแล้ว หรือเปิดโหมดทดสอบก่อนกดบันทึก`
          );
        }
        return;
      }

      const cleanConfig = normalizeConfig({ ...config, showGrid: false });
      LearningHausAccountStorage.writeJson(STORAGE_KEY, cleanConfig);
      LearningHausAccountStorage.writeJson(CREATED_GATE_KEY, true);
      furPicked = true;
      eyesPicked = true;

      // Always overwrite the currently selected preset slot cleanly when saving
      const existingSlots = readPresetSlots();
      const targetSlot = existingSlots.find((s) => s.slot === selectedPresetSlot) || existingSlots[0];
      const slotName =
        presetNameInput && presetNameInput.value.trim()
          ? presetNameInput.value.trim().slice(0, 28)
          : targetSlot.name;
      const updatedSlots = existingSlots.map((item) =>
        item.slot === targetSlot.slot
          ? {
              ...item,
              name: slotName,
              config: cleanConfig,
              updatedAt: new Date().toISOString()
            }
          : item
      );
      writePresetSlots(updatedSlots);

      const dataUrl = renderConfigToDataUrl(cleanConfig, 280);
      const ok = await window.LearningHausProfile?.setAvatar?.(
        dataUrl,
        JSON.stringify(cleanConfig),
        JSON.stringify(updatedSlots)
      );
      renderPresetSlotsUi();
      renderProfilePageSlots();
      window.dispatchEvent(new CustomEvent("learninghaus:pixel-cat-updated"));
      if (ok && dialog.open) dialog.close();
    };

    primaryCtaBtn?.addEventListener("click", () => {
      if (!isWardrobeUnlocked()) return;
      if (activeCategoryTab === "fur" || activeCategoryTab === "eyes") {
        switchToTab("outfit");
      } else {
        void saveAsActiveCharacter();
      }
    });

    quickSaveBtn?.addEventListener("click", () => {
      if (!isWardrobeUnlocked()) return;
      void saveAsActiveCharacter();
    });

    dialog.querySelectorAll<HTMLElement>("[data-pixel-cat-save]").forEach((btn) => {
      btn.addEventListener("click", () => {
        void saveAsActiveCharacter();
      });
    });

    dialog.querySelector<HTMLElement>("[data-pixel-cat-download]")?.addEventListener("click", () => {
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = 520;
      exportCanvas.height = 520;
      renderCatToCanvas(exportCanvas, { ...config, showGrid: false }, NEUTRAL_POSE);
      const link = document.createElement("a");
      link.download = "learninghaus-pixel-cat.png";
      link.href = exportCanvas.toDataURL("image/png");
      link.click();
    });

    const openModal = (): void => {
      config = readSavedConfig();
      const hasCreated = LearningHausAccountStorage.readJson<boolean>(CREATED_GATE_KEY, false);
      furPicked = hasCreated;
      eyesPicked = hasCreated;
      activeCategoryTab = "fur";
      activeTarget = "fur";
      wheelExpanded = false;
      lastWheelBrightness = -1;
      animPaused = LearningHausAccountStorage.readJson<boolean>(ANIM_PAUSED_KEY, false);
      if (presetPopover) presetPopover.hidden = true;
      demoUnlockAll = LearningHausAccountStorage.readJson<boolean>(DEMO_UNLOCK_KEY, false);
      if (demoUnlockToggle) demoUnlockToggle.checked = demoUnlockAll;
      if (gridToggle) gridToggle.checked = Boolean(config.showGrid);
      animFrameIdx = 0;
      syncAnimToggleUi();
      renderAll(true);
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
      if (!animPaused) startIdleAnimation();
    };

    document.querySelectorAll<HTMLElement>("[data-open-pixel-cat]").forEach((btn) => {
      btn.addEventListener("click", openModal);
    });

    dialog.addEventListener("close", stopIdleAnimation);
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      if (dialog.open) dialog.close();
    });

    window.addEventListener("learninghaus:achievement-progress", () => {
      if (dialog.open) renderPropButtons();
      renderProfileBgPicker();
    });

    window.addEventListener("learninghaus:quest-updated", () => {
      if (dialog.open) renderPropButtons();
      renderProfileBgPicker();
    });

    window.addEventListener("learninghaus:language-changed", () => {
      bgStatusOverride = null;
      renderProfilePageSlots();
      renderProfileBgPicker();
      syncAnimToggleUi();
      if (dialog.open || dialog.hasAttribute("open")) {
        renderAll(true);
      }
    });

    window.addEventListener("learninghaus:social-session", () => {
      bgStatusOverride = null;
      renderProfilePageSlots();
      renderProfileBgPicker();
    });

    open = openModal;
  };

  export let open: () => void = () => {};

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}
Object.assign(window, { LearningHausPixelCat });
