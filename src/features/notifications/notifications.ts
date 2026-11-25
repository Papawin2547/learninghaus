// ระบบแจ้งเตือนมุมขวาล่าง (Vector Bell FAB + Floating Notification Center + Inline Class Approval + Sound Chime)
namespace LearningHausNotifications {
  export type NotificationKind =
    | "class_join_request"
    | "class_member_joined"
    | "class_completed"
    | "friend_request"
    | "chat_message"
    | "achievement"
    | "quest_claim"
    | "system";

  export type NotificationMeta = {
    courseId?: string;
    courseTitle?: string;
    classCode?: string;
    requestId?: string;
    learnerName?: string;
    personId?: number;
    personName?: string;
    chatId?: number;
    chatName?: string;
    achievementId?: string;
    questId?: string;
  };

  export type NotificationItem = {
    id: string;
    kind: NotificationKind;
    important: boolean;
    titleEn: string;
    titleTh: string;
    bodyEn: string;
    bodyTh: string;
    createdAt: string;
    read: boolean;
    status?: "pending" | "approved" | "declined";
    meta?: NotificationMeta;
  };

  export type PushPayload = {
    id?: string;
    kind: NotificationKind;
    important?: boolean;
    titleEn: string;
    titleTh?: string;
    bodyEn: string;
    bodyTh?: string;
    status?: "pending" | "approved" | "declined";
    meta?: NotificationMeta;
    silent?: boolean;
  };

  export type NotificationCategory =
    | "class_requests"
    | "class_members"
    | "social"
    | "achievements_quests"
    | "class_completed";

  export type CategoryPref = {
    enabled: boolean;
    sound: boolean;
  };

  export type NotificationPreferences = {
    masterSound: boolean;
    categories: Record<NotificationCategory, CategoryPref>;
  };

  const STORAGE_KEY = "learninghaus.notifications.v1";
  const DISMISSED_REQS_KEY = "learninghaus.notifications.dismissedReqs.v1";
  const PREFS_KEY = "learninghaus.notifications.prefs.v1";
  const MAX_ITEMS = 50;

  const defaultNotifPrefs = (): NotificationPreferences => ({
    masterSound: true,
    categories: {
      class_requests: { enabled: true, sound: true },
      class_members: { enabled: true, sound: true },
      social: { enabled: true, sound: true },
      achievements_quests: { enabled: true, sound: true },
      class_completed: { enabled: true, sound: true }
    }
  });

  const categoryForKind = (kind: NotificationKind): NotificationCategory | null => {
    switch (kind) {
      case "class_join_request":
        return "class_requests";
      case "class_member_joined":
        return "class_members";
      case "friend_request":
      case "chat_message":
        return "social";
      case "achievement":
      case "quest_claim":
        return "achievements_quests";
      case "class_completed":
        return "class_completed";
      default:
        return null;
    }
  };

  const t = (en: string, th: string): string =>
    typeof LearningHausI18n !== "undefined" ? LearningHausI18n.t(en, th) : en;

  const esc = (v: string): string =>
    String(v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const SVG = {
    bell: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
    userPlus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>`,
    users: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    award: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    sparkles: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    message: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
    check: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`,
    x: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    volumeOn: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
    volumeOff: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>`,
    star: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  };

  let items: NotificationItem[] = [];
  let dismissedReqIds = new Set<string>();
  let activeFilter: "all" | "important" | "requests" = "all";
  let notifPrefs: NotificationPreferences = defaultNotifPrefs();
  let toastTimer: number | null = null;
  let knownAchievementIds = new Set<string>();
  let achievementBaselineReady = false;
  let knownClaimableQuestCount = -1;

  const fabEl = (): HTMLButtonElement | null => document.querySelector<HTMLButtonElement>("[data-notif-corner-fab]");
  const badgeEl = (): HTMLElement | null => document.querySelector<HTMLElement>("[data-notif-fab-badge]");
  const popupEl = (): HTMLElement | null => document.querySelector<HTMLElement>("[data-notif-popup]");
  const listEl = (): HTMLElement | null => document.querySelector<HTMLElement>("[data-notif-list]");
  const toastEl = (): HTMLElement | null => document.querySelector<HTMLElement>("[data-notif-live-toast]");

  const loadNotifPrefs = (): void => {
    const base = defaultNotifPrefs();
    try {
      const raw = window.localStorage.getItem(PREFS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<NotificationPreferences>;
        base.masterSound = typeof parsed.masterSound === "boolean" ? parsed.masterSound : true;
        if (parsed.categories && typeof parsed.categories === "object") {
          (Object.keys(base.categories) as NotificationCategory[]).forEach((cat) => {
            const c = parsed.categories?.[cat];
            if (c) {
              base.categories[cat] = {
                enabled: typeof c.enabled === "boolean" ? c.enabled : true,
                sound: typeof c.sound === "boolean" ? c.sound : true
              };
            }
          });
        }
      }
    } catch {
      // Fall back to defaults.
    }
    notifPrefs = base;
  };

  const saveNotifPrefs = (): void => {
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(notifPrefs));
    } catch {
      // Ignore storage quota issues.
    }
  };

  export const getPreferences = (): NotificationPreferences => ({
    masterSound: notifPrefs.masterSound,
    categories: {
      class_requests: { ...notifPrefs.categories.class_requests },
      class_members: { ...notifPrefs.categories.class_members },
      social: { ...notifPrefs.categories.social },
      achievements_quests: { ...notifPrefs.categories.achievements_quests },
      class_completed: { ...notifPrefs.categories.class_completed }
    }
  });

  const syncSettingsControls = (): void => {
    const masterCb = document.querySelector<HTMLInputElement>("[data-settings-notif-master-sound]");
    if (masterCb) masterCb.checked = notifPrefs.masterSound;

    (Object.keys(notifPrefs.categories) as NotificationCategory[]).forEach((cat) => {
      const pref = notifPrefs.categories[cat];
      const enabledCb = document.querySelector<HTMLInputElement>(`[data-settings-notif-cat-enabled="${cat}"]`);
      const soundCb = document.querySelector<HTMLInputElement>(`[data-settings-notif-cat-sound="${cat}"]`);
      if (enabledCb) enabledCb.checked = pref.enabled;
      if (soundCb) {
        soundCb.checked = pref.sound;
        soundCb.disabled = !notifPrefs.masterSound || !pref.enabled;
      }
    });
  };

  const isCategoryEnabled = (kind: NotificationKind): boolean => {
    const cat = categoryForKind(kind);
    return cat ? notifPrefs.categories[cat].enabled : true;
  };

  const isSoundEnabledForKind = (kind: NotificationKind): boolean => {
    if (!notifPrefs.masterSound) return false;
    const cat = categoryForKind(kind);
    return cat ? notifPrefs.categories[cat].enabled && notifPrefs.categories[cat].sound : true;
  };

  const loadItems = (): void => {
    const parsed = LearningHausAccountStorage.readJson<NotificationItem[]>(STORAGE_KEY, []);
    items = Array.isArray(parsed) ? parsed.slice(0, MAX_ITEMS) : [];
    const dismissed = LearningHausAccountStorage.readJson<string[]>(DISMISSED_REQS_KEY, []);
    dismissedReqIds = new Set(Array.isArray(dismissed) ? dismissed : []);
  };

  const saveItems = (): void => {
    LearningHausAccountStorage.writeJson(STORAGE_KEY, items.slice(0, MAX_ITEMS));
  };

  const saveDismissedReqs = (): void => {
    LearningHausAccountStorage.writeJson(DISMISSED_REQS_KEY, Array.from(dismissedReqIds).slice(-200));
  };

  const playNotificationSound = (important: boolean, force = false): void => {
    if (!force && !notifPrefs.masterSound) return;
    try {
      LearningHausSettings?.playTone?.(important ? "notify-important" : "notify");
    } catch {
      // Ignore audio errors if blocked before first gesture.
    }
  };

  const triggerBellRing = (): void => {
    const fab = fabEl();
    if (!fab) return;
    fab.classList.remove("is-ringing");
    void fab.offsetWidth;
    fab.classList.add("is-ringing");
    window.setTimeout(() => fab.classList.remove("is-ringing"), 720);
  };

  const formatRelativeTime = (iso: string): string => {
    const ms = Date.now() - Date.parse(iso);
    if (!Number.isFinite(ms) || ms < 45_000) return t("Just now", "เมื่อสักครู่");
    const mins = Math.floor(ms / 60_000);
    if (mins < 60) return t(`${mins}m ago`, `${mins} นาทีที่แล้ว`);
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t(`${hours}h ago`, `${hours} ชม. ที่แล้ว`);
    const days = Math.floor(hours / 24);
    return t(`${days}d ago`, `${days} วันที่แล้ว`);
  };

  const iconForKind = (kind: NotificationKind): string => {
    switch (kind) {
      case "class_join_request":
        return SVG.userPlus;
      case "class_member_joined":
        return SVG.users;
      case "class_completed":
      case "achievement":
        return SVG.award;
      case "quest_claim":
        return SVG.sparkles;
      case "friend_request":
        return SVG.userPlus;
      case "chat_message":
        return SVG.message;
      default:
        return SVG.bell;
    }
  };

  export const getUnreadCount = (): number => items.filter((i) => !i.read).length;

  export const getImportantUnreadCount = (): number =>
    items.filter((i) => i.important && (!i.read || i.status === "pending")).length;

  const getPendingRequestCount = (): number =>
    items.filter((i) => i.kind === "class_join_request" && i.status === "pending").length;

  const showLiveToast = (item: NotificationItem): void => {
    const popup = popupEl();
    if (popup && !popup.hidden) return;
    if (!document.body.classList.contains("home-mode")) return;
    const toast = toastEl();
    if (!toast) return;

    toast.classList.toggle("is-important", item.important);
    const title = t(item.titleEn, item.titleTh);
    const body = t(item.bodyEn, item.bodyTh);
    toast.innerHTML = `
      <span class="notif-live-toast__icon">${iconForKind(item.kind)}</span>
      <span class="notif-live-toast__copy">
        <strong>${esc(title)}</strong>
        <small>${esc(body)}</small>
      </span>
    `;
    toast.hidden = false;
    toast.classList.add("is-visible");

    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => {
        if (!toast.classList.contains("is-visible")) toast.hidden = true;
      }, 220);
    }, 4600);
  };

  const updateFabState = (): void => {
    const fab = fabEl();
    const badge = badgeEl();
    const unread = getUnreadCount();
    const pendingReqs = getPendingRequestCount();
    const totalCount = Math.max(unread, pendingReqs);
    const hasImportant = getImportantUnreadCount() > 0;

    if (fab) {
      fab.classList.toggle("has-important", hasImportant);
      fab.classList.toggle("has-unread", totalCount > 0);
    }
    if (badge) {
      badge.hidden = totalCount === 0;
      badge.textContent = totalCount > 99 ? "99+" : String(totalCount);
      badge.classList.toggle("is-important", hasImportant);
    }

    document.querySelectorAll<HTMLElement>("[data-notif-proxy-badge]").forEach((pBadge) => {
      pBadge.hidden = totalCount === 0;
      pBadge.textContent = totalCount > 99 ? "99+" : String(totalCount);
      pBadge.classList.toggle("is-important", hasImportant);
    });
    document.querySelectorAll<HTMLElement>("[data-notif-trigger-proxy]").forEach((proxyBtn) => {
      proxyBtn.classList.toggle("has-important", hasImportant);
      proxyBtn.classList.toggle("is-active", isOpen());
    });

    const headerCount = document.querySelector<HTMLElement>("[data-notif-header-count]");
    if (headerCount) {
      headerCount.hidden = unread === 0;
      headerCount.textContent = String(unread);
    }

    const impDot = document.querySelector<HTMLElement>("[data-notif-tab-imp-dot]");
    if (impDot) impDot.hidden = !hasImportant;

    const reqBadge = document.querySelector<HTMLElement>("[data-notif-tab-req-count]");
    if (reqBadge) {
      reqBadge.hidden = pendingReqs === 0;
      reqBadge.textContent = String(pendingReqs);
    }

    const soundBtn = document.querySelector<HTMLButtonElement>("[data-notif-sound-toggle]");
    if (soundBtn) {
      soundBtn.innerHTML = notifPrefs.masterSound ? SVG.volumeOn : SVG.volumeOff;
      soundBtn.setAttribute("aria-pressed", String(notifPrefs.masterSound));
      const label = notifPrefs.masterSound
        ? t("Notification sound: ON", "เสียงแจ้งเตือน: เปิด")
        : t("Notification sound: OFF", "เสียงแจ้งเตือน: ปิด");
      soundBtn.title = label;
      soundBtn.setAttribute("aria-label", label);
    }

    const clearBtn = document.querySelector<HTMLButtonElement>("[data-notif-clear-read]");
    if (clearBtn) {
      clearBtn.disabled = items.length === 0;
      clearBtn.title =
        items.length > 0
          ? t(`Clear all ${items.length} notification(s)`, `ล้างการแจ้งเตือนทั้งหมด ${items.length} รายการ`)
          : t("No notifications to clear", "ไม่มีการแจ้งเตือนให้ล้าง");
    }
    syncSettingsControls();
  };

  const renderList = (): void => {
    updateFabState();
    const list = listEl();
    if (!list) return;

    document.querySelectorAll<HTMLButtonElement>("[data-notif-filter]").forEach((btn) => {
      const isAct = btn.dataset.notifFilter === activeFilter;
      btn.classList.toggle("is-active", isAct);
      btn.setAttribute("aria-selected", String(isAct));
    });

    const filtered = items.filter((item) => {
      if (activeFilter === "important") return item.important;
      if (activeFilter === "requests") return item.kind === "class_join_request";
      return true;
    });

    if (!filtered.length) {
      const emptyMsg =
        activeFilter === "requests"
          ? t("No class join requests right now.", "ยังไม่มีคำขอเข้าห้องเรียนในตอนนี้")
          : activeFilter === "important"
            ? t("No important alerts yet.", "ยังไม่มีการแจ้งเตือนสำคัญ")
            : t("You're all caught up! New alerts will appear here.", "อ่านครบทั้งหมดแล้ว แจ้งเตือนใหม่จะแสดงที่นี่");
      list.innerHTML = `
        <div class="notif-empty">
          <span class="notif-empty__icon">${SVG.bell}</span>
          <p>${esc(emptyMsg)}</p>
        </div>
      `;
      return;
    }

    list.innerHTML = filtered
      .map((item) => {
        const title = t(item.titleEn, item.titleTh);
        const body = t(item.bodyEn, item.bodyTh);
        const isPendingReq = item.kind === "class_join_request" && item.status === "pending";
        const statusChip =
          item.kind === "class_join_request" && item.status === "approved"
            ? `<span class="notif-status-chip notif-status-chip--approved">${SVG.check} ${t("Approved", "อนุมัติแล้ว")}</span>`
            : item.kind === "class_join_request" && item.status === "declined"
              ? `<span class="notif-status-chip notif-status-chip--declined">${SVG.x} ${t("Declined", "ปฏิเสธแล้ว")}</span>`
              : "";

        const inlineActions = isPendingReq
          ? `
            <div class="notif-item__actions">
              <button type="button" class="notif-action-btn notif-action-btn--approve" data-notif-approve="${esc(item.id)}">
                ${SVG.check}<span>${t("Approve", "อนุมัติ")}</span>
              </button>
              <button type="button" class="notif-action-btn notif-action-btn--decline" data-notif-decline="${esc(item.id)}">
                ${SVG.x}<span>${t("Decline", "ปฏิเสธ")}</span>
              </button>
            </div>
          `
          : statusChip
            ? `<div class="notif-item__actions">${statusChip}</div>`
            : "";

        const impTag = item.important
          ? `<span class="notif-imp-pill">${SVG.star}<span>${t("Important", "สำคัญ")}</span></span>`
          : "";

        const dismissBtn = `<button type="button" class="notif-item__dismiss" data-notif-dismiss="${esc(item.id)}" aria-label="${t("Dismiss", "ลบ")}" title="${t("Dismiss", "ลบ")}">×</button>`;

        return `
          <article class="notif-item${item.important ? " is-important" : ""}${item.read ? " is-read" : " is-unread"}" data-notif-id="${esc(item.id)}">
            <div class="notif-item__icon">${iconForKind(item.kind)}</div>
            <div class="notif-item__body">
              <div class="notif-item__top">
                <strong class="notif-item__title">${esc(title)}</strong>
                ${impTag}
              </div>
              <p class="notif-item__desc">${esc(body)}</p>
              <div class="notif-item__meta">
                <span>${esc(formatRelativeTime(item.createdAt))}</span>
                ${!item.read ? `<span class="notif-unread-dot" aria-label="Unread"></span>` : ""}
              </div>
              ${inlineActions}
            </div>
            ${dismissBtn}
          </article>
        `;
      })
      .join("");
  };

  export const push = (payload: PushPayload): NotificationItem | null => {
    if (!isCategoryEnabled(payload.kind)) {
      return null;
    }

    const important =
      typeof payload.important === "boolean"
        ? payload.important
        : payload.kind === "class_join_request" ||
          payload.kind === "friend_request" ||
          payload.kind === "achievement" ||
          payload.kind === "quest_claim" ||
          payload.kind === "class_completed";

    // Deduplicate pending class join request by requestId
    if (payload.kind === "class_join_request" && payload.meta?.requestId) {
      const dup = items.find(
        (i) => i.kind === "class_join_request" && i.meta?.requestId === payload.meta?.requestId
      );
      if (dup) {
        renderList();
        return dup;
      }
    }

    const item: NotificationItem = {
      id: payload.id || `notif-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      kind: payload.kind,
      important,
      titleEn: payload.titleEn,
      titleTh: payload.titleTh || payload.titleEn,
      bodyEn: payload.bodyEn,
      bodyTh: payload.bodyTh || payload.bodyEn,
      createdAt: new Date().toISOString(),
      read: false,
      status: payload.status || (payload.kind === "class_join_request" ? "pending" : undefined),
      meta: payload.meta
    };

    items.unshift(item);
    if (items.length > MAX_ITEMS) items = items.slice(0, MAX_ITEMS);
    saveItems();
    renderList();

    if (!payload.silent) {
      if (isSoundEnabledForKind(payload.kind)) {
        playNotificationSound(important);
      }
      triggerBellRing();
      showLiveToast(item);
    }

    return item;
  };

  export const syncClassRequests = (silent = true): void => {
    const hub = (window as unknown as {
      LearningHausLearnHub?: {
        getPendingJoinRequests?: () => Array<{
          courseId: string;
          courseTitle: string;
          classCode: string;
          req: { id: string; learnerName: string; requestedAt: string };
        }>;
      };
    }).LearningHausLearnHub;
    if (!hub?.getPendingJoinRequests) return;

    const activePending = hub.getPendingJoinRequests();
    const activeIds = new Set(activePending.map((e) => e.req.id));
    let changed = false;

    // Add any missing pending join requests into notifications (respecting category toggle & dismissed history)
    if (isCategoryEnabled("class_join_request")) {
      activePending.forEach((entry) => {
        if (dismissedReqIds.has(entry.req.id)) return;
        const exists = items.some(
          (i) => i.kind === "class_join_request" && i.meta?.requestId === entry.req.id
        );
        if (!exists) {
          items.unshift({
            id: `notif-req-${entry.req.id}`,
            kind: "class_join_request",
            important: true,
            titleEn: `${entry.req.learnerName} requested to join`,
            titleTh: `${entry.req.learnerName} ขอเข้าร่วมห้องเรียน`,
            bodyEn: `Wants to enter "${entry.courseTitle}" (${entry.classCode}). Approve or decline below.`,
            bodyTh: `ขอเข้าห้องเรียน "${entry.courseTitle}" (${entry.classCode}) สามารถกดอนุมัติได้ทันที`,
            createdAt: entry.req.requestedAt || new Date().toISOString(),
            read: false,
            status: "pending",
            meta: {
              courseId: entry.courseId,
              courseTitle: entry.courseTitle,
              classCode: entry.classCode,
              requestId: entry.req.id,
              learnerName: entry.req.learnerName
            }
          });
          changed = true;
          if (!silent) {
            if (isSoundEnabledForKind("class_join_request")) playNotificationSound(true);
            triggerBellRing();
          }
        }
      });
    }

    // If a pending notification was already resolved in the Approval Modal, sync its status
    items.forEach((item) => {
      if (item.kind === "class_join_request" && item.status === "pending" && item.meta?.requestId) {
        if (!activeIds.has(item.meta.requestId)) {
          item.status = "approved";
          item.read = true;
          changed = true;
        }
      }
    });

    if (changed) {
      if (items.length > MAX_ITEMS) items = items.slice(0, MAX_ITEMS);
      saveItems();
    }
    renderList();
  };

  export const isOpen = (): boolean => {
    const p = popupEl();
    return Boolean(p && !p.hidden);
  };

  export const close = (): void => {
    const popup = popupEl();
    if (popup) popup.hidden = true;
    fabEl()?.classList.remove("is-active");
    document.querySelectorAll<HTMLElement>("[data-notif-trigger-proxy]").forEach((btn) => btn.classList.remove("is-active"));
  };

  export const open = (): void => {
    const popup = popupEl();
    if (!popup) return;
    window.dispatchEvent(new CustomEvent("learninghaus:social-close"));
    const toast = toastEl();
    if (toast) {
      toast.classList.remove("is-visible");
      toast.hidden = true;
    }
    syncClassRequests(true);
    popup.hidden = false;
    fabEl()?.classList.add("is-active");
    renderList();
  };

  export const toggle = (): void => {
    if (isOpen()) close();
    else open();
  };

  export const markAllRead = (): void => {
    let changed = false;
    items.forEach((item) => {
      if (!item.read) {
        item.read = true;
        changed = true;
      }
    });
    if (changed) saveItems();
    renderList();
  };

  export const clearAll = (): void => {
    items.forEach((item) => {
      if (item.meta?.requestId) dismissedReqIds.add(item.meta.requestId);
    });
    saveDismissedReqs();
    items = [];
    saveItems();
    renderList();
  };

  export const clearRead = clearAll;

  const handleNotificationNavigation = (item: NotificationItem): void => {
    if (!item.read) {
      item.read = true;
      saveItems();
      renderList();
    }
    if (item.kind === "class_join_request" || item.kind === "class_member_joined" || item.kind === "class_completed") {
      window.dispatchEvent(new CustomEvent("learninghaus:open-home-panel", { detail: { panel: "learn" } }));
      if (item.meta?.courseId) {
        window.dispatchEvent(
          new CustomEvent("learninghaus:learn-subview", {
            detail: { subview: "deck", courseId: item.meta.courseId }
          })
        );
      } else {
        window.dispatchEvent(new CustomEvent("learninghaus:learn-subview", { detail: { subview: "classes" } }));
      }
      close();
      return;
    }
    if (item.kind === "friend_request" || item.kind === "chat_message") {
      close();
      window.dispatchEvent(new CustomEvent("learninghaus:social-open"));
      return;
    }
    if (item.kind === "achievement") {
      window.dispatchEvent(new CustomEvent("learninghaus:open-home-panel", { detail: { panel: "achievement" } }));
      close();
      return;
    }
    if (item.kind === "quest_claim") {
      window.dispatchEvent(new CustomEvent("learninghaus:open-home-panel", { detail: { panel: "daily-quests" } }));
      close();
      return;
    }
    close();
  };

  const checkAchievementUnlocks = (): void => {
    try {
      if (typeof LearningHausAchievementCatalog === "undefined") return;
      const saved = LearningHausAccountStorage.readJson<Record<string, string>>("learninghaus.achievements.v1", {});
      const unlockedIds = Object.keys(saved);
      if (!achievementBaselineReady) {
        knownAchievementIds = new Set(unlockedIds);
        achievementBaselineReady = true;
        return;
      }
      unlockedIds.forEach((id) => {
        if (!knownAchievementIds.has(id)) {
          knownAchievementIds.add(id);
          const def = LearningHausAchievementCatalog.all.find((a) => a.id === id);
          const titleEn = def ? def.name : id;
          const titleTh = def ? def.nameTh : id;
          const descEn = def ? def.description : "You unlocked a new achievement badge!";
          const descTh = def ? def.descriptionTh : "คุณปลดล็อกเหรียญความสำเร็จใหม่แล้ว!";
          push({
            kind: "achievement",
            important: true,
            titleEn: `Achievement Unlocked: ${titleEn}`,
            titleTh: `ปลดล็อกความสำเร็จ: ${titleTh}`,
            bodyEn: descEn,
            bodyTh: descTh,
            meta: { achievementId: id }
          });
        }
      });
    } catch {
      // Ignore if achievement catalog not ready yet.
    }
  };

  const checkClaimableQuests = (): void => {
    try {
      const questsApi = (window as unknown as {
        LearningHausQuests?: { getClaimableCount?: () => number };
      }).LearningHausQuests;
      if (!questsApi?.getClaimableCount) return;
      const count = questsApi.getClaimableCount();
      if (knownClaimableQuestCount < 0) {
        knownClaimableQuestCount = count;
        return;
      }
      if (count > knownClaimableQuestCount) {
        push({
          kind: "quest_claim",
          important: true,
          titleEn: "Quest Reward Ready to Claim!",
          titleTh: "ภารกิจสำเร็จพร้อมรับรางวัลแล้ว!",
          bodyEn: "Open Daily Quests to claim your EXP and Pixel Cat rewards.",
          bodyTh: "เปิดหน้าภารกิจประจำวันเพื่อกดรับ EXP และของรางวัลได้เลย"
        });
      }
      knownClaimableQuestCount = count;
    } catch {
      // Ignore if quests module not ready.
    }
  };

  const init = (): void => {
    loadNotifPrefs();
    loadItems();
    syncClassRequests(true);
    checkAchievementUnlocks();
    checkClaimableQuests();
    syncSettingsControls();

    const fab = fabEl();
    const popup = popupEl();
    const toast = toastEl();

    fab?.addEventListener("click", (event) => {
      event.stopPropagation();
      toggle();
    });

    document.querySelectorAll<HTMLElement>("[data-notif-trigger-proxy]").forEach((proxyBtn) => {
      proxyBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        toggle();
      });
    });

    toast?.addEventListener("click", () => {
      open();
    });

    popup?.querySelector<HTMLButtonElement>("[data-notif-popup-close]")?.addEventListener("click", close);
    popup?.querySelector<HTMLButtonElement>("[data-notif-mark-all]")?.addEventListener("click", markAllRead);
    popup?.querySelector<HTMLButtonElement>("[data-notif-clear-read]")?.addEventListener("click", clearRead);

    popup?.querySelector<HTMLButtonElement>("[data-notif-sound-toggle]")?.addEventListener("click", () => {
      notifPrefs.masterSound = !notifPrefs.masterSound;
      saveNotifPrefs();
      updateFabState();
      if (notifPrefs.masterSound) playNotificationSound(true, true);
    });

    // Settings page Notification Preferences controls (2-way synced with Bell Popup)
    const masterSoundInput = document.querySelector<HTMLInputElement>("[data-settings-notif-master-sound]");
    masterSoundInput?.addEventListener("change", () => {
      notifPrefs.masterSound = masterSoundInput.checked;
      saveNotifPrefs();
      updateFabState();
      if (notifPrefs.masterSound) playNotificationSound(false, true);
    });

    document.querySelector<HTMLButtonElement>("[data-settings-notif-test]")?.addEventListener("click", () => {
      playNotificationSound(true, true);
      triggerBellRing();
    });

    document.querySelectorAll<HTMLInputElement>("[data-settings-notif-cat-enabled]").forEach((cb) => {
      cb.addEventListener("change", () => {
        const cat = cb.dataset.settingsNotifCatEnabled as NotificationCategory | undefined;
        if (!cat || !notifPrefs.categories[cat]) return;
        notifPrefs.categories[cat].enabled = cb.checked;
        saveNotifPrefs();
        syncSettingsControls();
      });
    });

    document.querySelectorAll<HTMLInputElement>("[data-settings-notif-cat-sound]").forEach((cb) => {
      cb.addEventListener("change", () => {
        const cat = cb.dataset.settingsNotifCatSound as NotificationCategory | undefined;
        if (!cat || !notifPrefs.categories[cat]) return;
        notifPrefs.categories[cat].sound = cb.checked;
        saveNotifPrefs();
        syncSettingsControls();
        if (cb.checked && notifPrefs.masterSound) {
          const isImp = cat === "class_requests" || cat === "achievements_quests" || cat === "class_completed";
          playNotificationSound(isImp, true);
        }
      });
    });

    window.addEventListener("learninghaus:settings-reset", () => {
      notifPrefs = defaultNotifPrefs();
      saveNotifPrefs();
      updateFabState();
    });

    popup?.querySelectorAll<HTMLButtonElement>("[data-notif-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.dataset.notifFilter as "all" | "important" | "requests" | undefined;
        if (next) {
          activeFilter = next;
          renderList();
        }
      });
    });

    // Subtle test triggers in footer so creators can test sound & inline approval immediately
    popup?.querySelector<HTMLButtonElement>("[data-notif-test-request]")?.addEventListener("click", () => {
      const hub = (window as unknown as {
        LearningHausLearnHub?: { addSampleJoinRequest?: () => void };
      }).LearningHausLearnHub;
      if (hub?.addSampleJoinRequest) {
        hub.addSampleJoinRequest();
      } else {
        push({
          kind: "class_join_request",
          important: true,
          titleEn: "NekoNova requested to join",
          titleTh: "NekoNova ขอเข้าร่วมห้องเรียน",
          bodyEn: "Wants to enter your class. Approve or decline below.",
          bodyTh: "ขอเข้าร่วมห้องเรียนของคุณ สามารถกดอนุมัติได้ทันที"
        });
      }
    });

    popup?.querySelector<HTMLButtonElement>("[data-notif-test-joined]")?.addEventListener("click", () => {
      const hub = (window as unknown as {
        LearningHausLearnHub?: { simulateMemberJoined?: () => void };
      }).LearningHausLearnHub;
      if (hub?.simulateMemberJoined) {
        hub.simulateMemberJoined();
      } else {
        push({
          kind: "class_member_joined",
          important: false,
          titleEn: "SakuraPaws joined your class",
          titleTh: "SakuraPaws เข้าห้องเรียนของคุณแล้ว",
          bodyEn: "Entered classroom via Class Code.",
          bodyTh: "เข้าร่วมห้องเรียนด้วยรหัสห้องเรียน"
        });
      }
    });

    // Delegated clicks inside notification list (Approve / Decline / Dismiss / Navigate)
    listEl()?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const dismissBtn = target.closest<HTMLElement>("[data-notif-dismiss]");
      if (dismissBtn?.dataset.notifDismiss) {
        event.stopPropagation();
        const removed = items.find((i) => i.id === dismissBtn.dataset.notifDismiss);
        if (removed?.meta?.requestId) {
          dismissedReqIds.add(removed.meta.requestId);
          saveDismissedReqs();
        }
        items = items.filter((i) => i.id !== dismissBtn.dataset.notifDismiss);
        saveItems();
        renderList();
        return;
      }

      const approveBtn = target.closest<HTMLElement>("[data-notif-approve]");
      if (approveBtn?.dataset.notifApprove) {
        event.stopPropagation();
        const item = items.find((i) => i.id === approveBtn.dataset.notifApprove);
        if (!item) return;
        const hub = (window as unknown as {
          LearningHausLearnHub?: {
            approveJoinRequest?: (courseId: string, requestId: string) => { ok: boolean };
          };
        }).LearningHausLearnHub;
        if (item.meta?.courseId && item.meta?.requestId && hub?.approveJoinRequest) {
          hub.approveJoinRequest(item.meta.courseId, item.meta.requestId);
        }
        item.status = "approved";
        item.read = true;
        saveItems();
        renderList();
        return;
      }

      const declineBtn = target.closest<HTMLElement>("[data-notif-decline]");
      if (declineBtn?.dataset.notifDecline) {
        event.stopPropagation();
        const item = items.find((i) => i.id === declineBtn.dataset.notifDecline);
        if (!item) return;
        const hub = (window as unknown as {
          LearningHausLearnHub?: {
            declineJoinRequest?: (courseId: string, requestId: string) => { ok: boolean };
          };
        }).LearningHausLearnHub;
        if (item.meta?.courseId && item.meta?.requestId && hub?.declineJoinRequest) {
          hub.declineJoinRequest(item.meta.courseId, item.meta.requestId);
        }
        item.status = "declined";
        item.read = true;
        saveItems();
        renderList();
        return;
      }

      const card = target.closest<HTMLElement>("[data-notif-id]");
      if (card?.dataset.notifId) {
        const item = items.find((i) => i.id === card.dataset.notifId);
        if (item) handleNotificationNavigation(item);
      }
    });

    // Global event listeners
    window.addEventListener("learninghaus:notify", (event) => {
      const detail = (event as CustomEvent<PushPayload>).detail;
      if (detail?.kind) push(detail);
    });

    window.addEventListener("learninghaus:notif-close", close);

    window.addEventListener("learninghaus:class-requests-changed", (event) => {
      const detail = (event as CustomEvent<{ requestId?: string; action?: string }>).detail;
      if (detail?.requestId && (detail.action === "approved" || detail.action === "declined")) {
        items.forEach((item) => {
          if (item.kind === "class_join_request" && item.meta?.requestId === detail.requestId) {
            item.status = detail.action as "approved" | "declined";
            item.read = true;
          }
        });
        saveItems();
      }
      syncClassRequests(true);
    });

    window.addEventListener("learninghaus:stage-progress-updated", () => {
      checkAchievementUnlocks();
      checkClaimableQuests();
    });

    window.addEventListener("learninghaus:quest-updated", () => {
      checkClaimableQuests();
    });

    window.addEventListener("learninghaus:profile-updated", () => {
      checkAchievementUnlocks();
    });

    window.addEventListener("learninghaus:language-changed", () => {
      renderList();
    });

    window.addEventListener("learninghaus:social-session", () => {
      loadItems();
      achievementBaselineReady = false;
      knownClaimableQuestCount = -1;
      syncClassRequests(true);
      checkAchievementUnlocks();
      checkClaimableQuests();
      renderList();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        close();
      }
    });

    document.addEventListener("click", (event) => {
      if (!isOpen()) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest("[data-notif-popup]") ||
        target.closest("[data-notif-corner-fab]") ||
        target.closest("[data-notif-trigger-proxy]")
      ) {
        return;
      }
      close();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}

Object.assign(window, { LearningHausNotifications });
