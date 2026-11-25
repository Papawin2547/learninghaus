// ส่วนนี้ทำหน้าที่: เชื่อมบัญชี เพื่อน แชทส่วนตัว และแชทกลุ่มกับเซิร์ฟเวอร์กลาง
namespace LearningHausSocial {
  type Person = {
    id: number;
    name: string;
    avatar: string;
    catConfig?: string;
    email?: string;
    totalXp?: number;
    about?: string;
    facebookName?: string;
    facebookUrl?: string;
    instagramName?: string;
    instagramUrl?: string;
    xName?: string;
    xUrl?: string;
    featuredAchievements?: string[] | null;
    accountState?: "active" | "disabled";
    status?: string;
    direction?: string;
  };
  type Chat = { id: number; kind: "direct" | "group"; name: string; lastMessage: string | null; messageCount: number };
  type Message = { id: number; userId: number; name: string; body: string; createdAt: string };
  type AuthResult = { handled: boolean; success: boolean };
  type AchievementSnapshot = {
    metrics: LearningHausAchievementEngine.Metrics;
    unlocked: { id: string; unlockedAt: string }[];
    completedStages?: number[];
  };

  const STORY_STORAGE_KEY = "learninghaus.social.storyNote.v1";

  let available: boolean | null = null;
  let me: Person | null = null;
  let friends: Person[] = [];
  let chats: Chat[] = [];
  let searchResults: Person[] | null = null;
  let activeChatId = 0;
  let activeRequestPersonId = 0;
  let activeCategory: "chat" | "group" = "chat";
  let requestsOnly = false;
  let chatFilterQuery = "";
  let groupFilterQuery = "";
  let addFriendOpen = false;
  let eventSource: EventSource | null = null;
  let notifBaselineLoaded = false;
  let knownIncomingReqIds = new Set<number>();
  let knownChatMsgCounts = new Map<number, number>();
  let suppressNextChatNotifyId = 0;
  let page: HTMLElement | null = null;

  const request = async <T>(path: string, method = "GET", data?: unknown): Promise<T> => {
    const response = await fetch(path, {
      method,
      credentials: "same-origin",
      headers: data === undefined ? undefined : { "Content-Type": "application/json" },
      body: data === undefined ? undefined : JSON.stringify(data)
    });
    const result = (await response.json()) as T & { error?: string };
    if (!response.ok) throw new Error(result.error || `Request failed (${response.status}).`);
    return result;
  };

  const checkServer = async (): Promise<boolean> => {
    if (available !== null) return available;
    if (location.protocol === "file:") return (available = false);
    try {
      const status = await request<{ service: string }>("/api/status");
      return (available = status.service === "learninghaus");
    } catch {
      return (available = false);
    }
  };

  const node = <T extends Element>(selector: string): T | null => page?.querySelector<T>(selector) || null;
  const message = (value: string, error = false): void => {
    const target = node<HTMLElement>("[data-social-status]");
    if (target) {
      target.textContent = value;
      target.hidden = !value;
      target.classList.toggle("is-error", error);
    }
  };
  const clear = (target: Element | null): void => {
    target?.replaceChildren();
  };
  const label = (text: string, className?: string): HTMLElement => {
    const element = document.createElement("span");
    if (className) element.className = className;
    element.textContent = text;
    return element;
  };
  const button = (text: string, action: () => void): HTMLButtonElement => {
    const element = document.createElement("button");
    element.type = "button";
    element.textContent = text;
    element.addEventListener("click", action);
    return element;
  };
  const resolvePersonAvatar = (person: Person): string => {
    if (person.id && me && person.id === me.id) {
      return window.LearningHausPixelCat?.getActiveAvatarDataUrl?.() || window.LearningHausProfile?.getProfile?.()?.avatar || "";
    }
    if (person.catConfig) {
      try {
        const parsed = JSON.parse(person.catConfig);
        const rendered = window.LearningHausPixelCat?.renderConfigToDataUrl?.(parsed, 180);
        if (rendered) return rendered;
      } catch {
        // ignore invalid catConfig JSON
      }
    }
    const raw = String(person.avatar || "").trim();
    if (raw && !raw.includes("Profire/PF0")) return raw;
    return window.LearningHausPixelCat?.getNpcAvatarDataUrl?.(person.name) || "";
  };

  const personRow = (person: Person, controls: HTMLElement[]): HTMLElement => {
    const row = document.createElement("div");
    row.className = "social-page__person";
    const image = document.createElement("img");
    image.src = resolvePersonAvatar(person);
    image.alt = "";
    const name = document.createElement("strong");
    name.textContent = person.name;
    row.append(image, name, ...controls);
    return row;
  };

  const statusFor = (id: number): Person | undefined => friends.find((friend) => friend.id === id);

  const refreshProfileActions = (): void => {
    const panel = document.querySelector<HTMLElement>('[data-home-panel="looking-people"]');
    const wrapper = panel?.querySelector<HTMLElement>("[data-person-social]");
    const add = panel?.querySelector<HTMLButtonElement>("[data-person-add-friend]");
    const chat = panel?.querySelector<HTMLButtonElement>("[data-person-start-chat]");
    const status = panel?.querySelector<HTMLElement>("[data-person-social-status]");
    const id = Number(panel?.dataset.personId);
    if (!wrapper || !add || !chat || !status) return;
    wrapper.hidden = !isConnected() || !id || id === me?.id;
    if (wrapper.hidden) return;
    const friend = statusFor(id);
    add.hidden = Boolean(friend);
    chat.hidden = friend?.status !== "accepted";
    status.textContent =
      friend?.status === "pending" ? (friend.direction === "incoming" ? "Friend request received" : "Request sent") : "";
    add.onclick = () => void sendRequest(id);
    chat.onclick = () => void startDirect(id);
  };

  const readMyStory = (): string => {
    try {
      const saved = LearningHausAccountStorage.readJson<string>(STORY_STORAGE_KEY, "");
      return typeof saved === "string" ? saved.trim().slice(0, 60) : "";
    } catch {
      return "";
    }
  };

  const writeMyStory = (note: string): void => {
    LearningHausAccountStorage.writeJson(STORY_STORAGE_KEY, note.trim().slice(0, 60));
  };

  const getIncomingRequests = (): Person[] =>
    friends.filter((person) => person.status === "pending" && person.direction === "incoming");

  const getAcceptedFriends = (): Person[] => friends.filter((person) => person.status === "accepted");

  const syncBadges = (): void => {
    const reqCount = getIncomingRequests().length;
    const reqBadge = node<HTMLElement>("[data-social-requests-badge]");
    if (reqBadge) {
      reqBadge.textContent = String(reqCount);
      reqBadge.hidden = reqCount === 0;
    }
    const fabBadge = document.querySelector<HTMLElement>("[data-social-fab-badge]");
    if (fabBadge) {
      fabBadge.textContent = String(reqCount);
      fabBadge.hidden = reqCount === 0;
    }
    document.querySelectorAll<HTMLElement>("[data-social-proxy-badge]").forEach((badge) => {
      badge.textContent = reqCount > 99 ? "99+" : String(reqCount);
      badge.hidden = reqCount === 0;
    });
  };

  const setMobileDetailOpen = (open: boolean): void => {
    page?.classList.toggle("is-mobile-detail", open);
  };

  const syncRightStageMode = (): void => {
    const room = node<HTMLElement>("[data-social-chat-room]");
    const addPanel = node<HTMLElement>("[data-social-add-panel]");
    if (room) room.hidden = addFriendOpen;
    if (addPanel) addPanel.hidden = !addFriendOpen;
  };

  const syncCategoryTabs = (): void => {
    page?.querySelectorAll<HTMLElement>("[data-social-cat]").forEach((btn) => {
      const isCurrent = btn.dataset.socialCat === activeCategory;
      btn.classList.toggle("is-active", isCurrent);
      btn.setAttribute("aria-selected", String(isCurrent));
    });
    page?.querySelectorAll<HTMLElement>("[data-social-cat-pane]").forEach((pane) => {
      pane.hidden = pane.dataset.socialCatPane !== activeCategory;
    });
    const reqBtn = node<HTMLElement>("[data-social-requests-btn]");
    if (reqBtn) reqBtn.classList.toggle("is-active", requestsOnly);
  };

  const renderStories = (): void => {
    const row = node<HTMLElement>("[data-social-stories]");
    if (!row) return;
    clear(row);

    const myStory = readMyStory();
    const myBtn = document.createElement("button");
    myBtn.type = "button";
    myBtn.className = "social-story-item";

    const myBubble = document.createElement("span");
    myBubble.className = `social-story-bubble${myStory ? "" : " is-prompt"}`;
    myBubble.textContent = myStory || LearningHausI18n.t("Share a note...", "ลงสตอรี่...");

    const myRing = document.createElement("span");
    myRing.className = `social-story-ring${myStory ? " has-story" : " is-self"}`;
    const myInner = document.createElement("span");
    myInner.className = "social-story-ring__inner";
    const myImg = document.createElement("img");
    myImg.src = me ? resolvePersonAvatar(me) : window.LearningHausPixelCat?.getActiveAvatarDataUrl?.() || "";
    myImg.alt = "";
    myInner.append(myImg);
    const plus = document.createElement("span");
    plus.className = "social-story-plus";
    plus.textContent = "+";
    myRing.append(myInner, plus);

    const myName = document.createElement("small");
    myName.textContent = LearningHausI18n.t("Your story", "สตอรี่ของคุณ");

    myBtn.append(myBubble, myRing, myName);
    myBtn.addEventListener("click", () => {
      const viewer = node<HTMLElement>("[data-social-story-viewer]");
      const composer = node<HTMLFormElement>("[data-social-story-form]");
      const input = node<HTMLInputElement>("[data-social-story-input]");
      if (viewer) viewer.hidden = true;
      if (composer) {
        composer.hidden = !composer.hidden;
        if (!composer.hidden && input) {
          input.value = readMyStory();
          input.focus();
        }
      }
    });
    row.append(myBtn);

    getAcceptedFriends().forEach((friend) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "social-story-item";
      const noteText = (friend.about || "").trim();
      if (noteText) {
        const bubble = document.createElement("span");
        bubble.className = "social-story-bubble";
        bubble.textContent = noteText.slice(0, 22);
        btn.append(bubble);
      }
      const ring = document.createElement("span");
      ring.className = `social-story-ring${noteText ? " has-story" : ""}`;
      const inner = document.createElement("span");
      inner.className = "social-story-ring__inner";
      const img = document.createElement("img");
      img.src = resolvePersonAvatar(friend);
      img.alt = "";
      inner.append(img);
      ring.append(inner);
      const nameEl = document.createElement("small");
      nameEl.textContent = friend.name;
      btn.append(ring, nameEl);

      btn.addEventListener("click", () => {
        if (noteText) {
          const composer = node<HTMLElement>("[data-social-story-form]");
          const viewer = node<HTMLElement>("[data-social-story-viewer]");
          const userEl = node<HTMLElement>("[data-social-story-user]");
          const textEl = node<HTMLElement>("[data-social-story-text]");
          if (composer) composer.hidden = true;
          if (userEl) userEl.textContent = friend.name;
          if (textEl) textEl.textContent = noteText;
          if (viewer) viewer.hidden = false;
        } else {
          void startDirect(friend.id);
        }
      });
      row.append(btn);
    });
  };

  const setComposerEnabled = (enabled: boolean, placeholder: string): void => {
    const composer = node<HTMLFormElement>("[data-social-message-form]");
    const pill = node<HTMLElement>("[data-social-composer-pill]");
    const input = node<HTMLInputElement>("#social-message");
    composer?.querySelectorAll<HTMLInputElement | HTMLButtonElement>("input,button").forEach((item) => {
      item.disabled = !enabled;
    });
    pill?.classList.toggle("is-disabled", !enabled);
    if (input) input.placeholder = placeholder;
  };

  const setRoomAvatar = (avatarUrl: string | null, fallbackKind: "user" | "group" = "user"): void => {
    const host = node<HTMLElement>("[data-social-chat-avatar]");
    if (!host) return;
    clear(host);
    if (avatarUrl) {
      const img = document.createElement("img");
      img.src = avatarUrl;
      img.alt = "";
      host.append(img);
    } else if (fallbackKind === "group") {
      host.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    } else {
      host.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    }
  };

  const openRequestThread = (person: Person): void => {
    activeChatId = 0;
    activeRequestPersonId = person.id;
    addFriendOpen = false;
    syncRightStageMode();
    setMobileDetailOpen(true);

    const title = node<HTMLElement>("[data-social-chat-title]");
    const sub = node<HTMLElement>("[data-social-chat-sub]");
    if (title) title.textContent = person.name;
    if (sub) sub.textContent = LearningHausI18n.t("Friend request · Waiting for response", "คำขอเป็นเพื่อน · รอการตอบรับ");
    setRoomAvatar(resolvePersonAvatar(person), "user");

    const reqCard = node<HTMLElement>("[data-social-in-chat-request]");
    const reqAv = node<HTMLElement>("[data-social-req-avatar]");
    const reqTitle = node<HTMLElement>("[data-social-req-title]");
    const reqAccept = node<HTMLButtonElement>("[data-social-req-accept]");
    const reqDecline = node<HTMLButtonElement>("[data-social-req-decline]");
    if (reqCard) reqCard.hidden = false;
    if (reqAv) {
      clear(reqAv);
      const img = document.createElement("img");
      img.src = resolvePersonAvatar(person);
      img.alt = "";
      reqAv.append(img);
    }
    if (reqTitle) {
      reqTitle.textContent = LearningHausI18n.t(
        `${person.name} sent you a friend request`,
        `${person.name} ส่งคำขอเป็นเพื่อนถึงคุณ`
      );
    }
    if (reqAccept) {
      reqAccept.onclick = async () => {
        await respond(person.id, "accept");
        activeRequestPersonId = 0;
        requestsOnly = false;
        syncCategoryTabs();
        await startDirect(person.id);
      };
    }
    if (reqDecline) {
      reqDecline.onclick = async () => {
        await respond(person.id, "reject");
        activeRequestPersonId = 0;
        if (reqCard) reqCard.hidden = true;
        renderChats();
      };
    }

    const msgBox = node<HTMLElement>("[data-social-messages]");
    if (msgBox) {
      clear(msgBox);
      msgBox.append(
        label(
          LearningHausI18n.t(
            `${person.name} wants to add you as a friend and start chatting`,
            `${person.name} ต้องการเพิ่มคุณเป็นเพื่อนและเริ่มแชท`
          ),
          "social-system-pill"
        )
      );
    }
    setComposerEnabled(
      false,
      LearningHausI18n.t(
        "Click Accept above to reply to this friend request...",
        "กดยอมรับคำขอเป็นเพื่อนด้านบนเพื่อเริ่มตอบกลับ..."
      )
    );
    renderChats();
  };

  const renderFriends = (): void => {
    const members = node<HTMLElement>("[data-social-group-members]");
    clear(members);
    if (members) {
      getAcceptedFriends().forEach((person) => {
        const option = document.createElement("label");
        option.className = "social-member-chip";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = String(person.id);
        option.append(checkbox, label(person.name));
        members.append(option);
      });
      if (!members.children.length) {
        members.append(
          label(
            LearningHausI18n.t("Add friends first to create a group chat", "เพิ่มเพื่อนก่อนสร้างกลุ่มแชท"),
            "social-empty-hint"
          )
        );
      }
    }
    syncBadges();
    renderStories();
    renderChats();
    if (searchResults) renderSearch(searchResults);
    refreshProfileActions();
  };

  const renderSearch = (people: Person[]): void => {
    searchResults = people;
    const target = node<HTMLElement>("[data-social-results]");
    clear(target);
    if (!target) return;
    if (!people.length) {
      target.append(
        label(LearningHausI18n.t("No registered users found", "ไม่พบผู้ใช้ที่ลงทะเบียน"), "social-empty-hint")
      );
      return;
    }
    people.forEach((person) => {
      const friend = statusFor(person.id);
      let control: HTMLElement;
      if (friend?.status === "accepted") {
        const btn = button(LearningHausI18n.t("Chat", "แชท"), () => void startDirect(person.id));
        btn.className = "social-btn-sm social-btn-sm--soft";
        control = btn;
      } else if (friend?.status === "pending" && friend.direction === "incoming") {
        const btn = button(LearningHausI18n.t("View Request", "ดูคำขอ"), () => {
          activeCategory = "chat";
          syncCategoryTabs();
          openRequestThread(friend);
        });
        btn.className = "social-btn-sm social-btn-sm--primary";
        control = btn;
      } else if (friend) {
        control = label(LearningHausI18n.t("Request sent", "ส่งคำขอแล้ว"), "social-pending-pill");
      } else {
        const btn = button(LearningHausI18n.t("Send Request", "ส่งคำขอ"), () => void sendRequest(person.id));
        btn.className = "social-btn-sm social-btn-sm--primary";
        control = btn;
      }
      target.append(personRow(person, [control]));
    });
  };

  const renderChats = (): void => {
    const chatList = node<HTMLElement>("[data-social-chat-list]");
    const groupList = node<HTMLElement>("[data-social-group-list]");
    clear(chatList);
    clear(groupList);

    // 1. DIRECT CHATS + ACCEPTED FRIENDS + INCOMING REQUESTS
    if (chatList) {
      const q = chatFilterQuery.trim().toLowerCase();
      const incoming = getIncomingRequests().filter((p) => !q || p.name.toLowerCase().includes(q));
      const directChats = chats.filter((c) => c.kind === "direct");
      const acceptedFriends = getAcceptedFriends();

      const rows: HTMLElement[] = [];

      // Incoming friend requests (clickable to open directly in requester's chat room!)
      incoming.forEach((person) => {
        const row = document.createElement("button");
        row.type = "button";
        row.className = `social-dm-row social-dm-row--request${activeRequestPersonId === person.id ? " is-active" : ""}`;
        const av = document.createElement("span");
        av.className = "social-avatar";
        const img = document.createElement("img");
        img.src = resolvePersonAvatar(person);
        img.alt = "";
        av.append(img);
        const info = document.createElement("div");
        info.className = "social-dm-info";
        const top = document.createElement("div");
        top.className = "social-dm-info__top";
        const nameEl = document.createElement("strong");
        nameEl.textContent = person.name;
        const tag = label(LearningHausI18n.t("Request", "คำขอ"), "social-req-pill-tag");
        top.append(nameEl, tag);
        const preview = document.createElement("p");
        preview.textContent = LearningHausI18n.t("Sent you a friend request · Tap to respond", "ส่งคำขอเป็นเพื่อนถึงคุณ · แตะเพื่อตอบรับ");
        info.append(top, preview);
        row.append(av, info);
        row.addEventListener("click", () => openRequestThread(person));
        rows.push(row);
      });

      if (!requestsOnly) {
        const seenFriendNames = new Set<string>();
        directChats.forEach((chat) => {
          if (q && !chat.name.toLowerCase().includes(q)) return;
          seenFriendNames.add(chat.name.toLowerCase());
          const matchedFriend = acceptedFriends.find((f) => f.name.toLowerCase() === chat.name.toLowerCase());
          const row = document.createElement("button");
          row.type = "button";
          row.className = `social-dm-row${chat.id === activeChatId && !activeRequestPersonId ? " is-active" : ""}`;
          const av = document.createElement("span");
          av.className = "social-avatar";
          const img = document.createElement("img");
          img.src = matchedFriend
            ? resolvePersonAvatar(matchedFriend)
            : window.LearningHausPixelCat?.getNpcAvatarDataUrl?.(chat.name) || "";
          img.alt = "";
          av.append(img);
          const info = document.createElement("div");
          info.className = "social-dm-info";
          const top = document.createElement("div");
          top.className = "social-dm-info__top";
          const nameEl = document.createElement("strong");
          nameEl.textContent = chat.name;
          const countEl = document.createElement("span");
          countEl.className = "social-dm-meta";
          countEl.textContent = chat.messageCount > 0 ? `${chat.messageCount}` : "";
          top.append(nameEl, countEl);
          const preview = document.createElement("p");
          preview.textContent = chat.lastMessage || LearningHausI18n.t("Tap to start chatting", "แตะเพื่อเริ่มคุย");
          info.append(top, preview);
          row.append(av, info);
          row.addEventListener("click", () => void openChat(chat.id));
          rows.push(row);
        });

        // Friends without an existing direct chat yet
        acceptedFriends.forEach((friend) => {
          if (seenFriendNames.has(friend.name.toLowerCase())) return;
          if (q && !friend.name.toLowerCase().includes(q)) return;
          const row = document.createElement("button");
          row.type = "button";
          row.className = "social-dm-row";
          const av = document.createElement("span");
          av.className = "social-avatar";
          const img = document.createElement("img");
          img.src = resolvePersonAvatar(friend);
          img.alt = "";
          av.append(img);
          const info = document.createElement("div");
          info.className = "social-dm-info";
          const top = document.createElement("div");
          top.className = "social-dm-info__top";
          const nameEl = document.createElement("strong");
          nameEl.textContent = friend.name;
          top.append(nameEl);
          const preview = document.createElement("p");
          preview.textContent = LearningHausI18n.t("Friends · Tap to start chatting", "เป็นเพื่อนกันแล้ว · แตะเพื่อเริ่มแชท");
          info.append(top, preview);
          row.append(av, info);
          row.addEventListener("click", () => void startDirect(friend.id));
          rows.push(row);
        });
      }

      if (!rows.length) {
        chatList.append(
          label(
            requestsOnly
              ? LearningHausI18n.t("No pending friend requests", "ไม่มีคำขอเป็นเพื่อนที่รอตอบรับ")
              : LearningHausI18n.t("No friend chats yet. Click Add Friend above to connect.", "ยังไม่มีแชทกับเพื่อน กดเพิ่มเพื่อนด้านบนได้เลย"),
            "social-empty-hint"
          )
        );
      } else {
        chatList.append(...rows);
      }
    }

    // 2. GROUP CHATS
    if (groupList) {
      const gq = groupFilterQuery.trim().toLowerCase();
      const groupChats = chats.filter((c) => c.kind === "group" && (!gq || c.name.toLowerCase().includes(gq)));
      if (!groupChats.length) {
        groupList.append(
          label(
            LearningHausI18n.t("No group chats yet. Click + above to create a group.", "ยังไม่มีแชทกลุ่ม กดปุ่ม + ด้านบนเพื่อสร้างกลุ่มใหม่"),
            "social-empty-hint"
          )
        );
      } else {
        groupChats.forEach((chat) => {
          const row = document.createElement("button");
          row.type = "button";
          row.className = `social-dm-row${chat.id === activeChatId && !activeRequestPersonId ? " is-active" : ""}`;
          const av = document.createElement("span");
          av.className = "social-avatar social-avatar--group";
          av.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
          const info = document.createElement("div");
          info.className = "social-dm-info";
          const top = document.createElement("div");
          top.className = "social-dm-info__top";
          const nameEl = document.createElement("strong");
          nameEl.textContent = chat.name;
          top.append(nameEl);
          const preview = document.createElement("p");
          preview.textContent = chat.lastMessage || LearningHausI18n.t("New group chat · Tap to start chatting", "กลุ่มแชทใหม่ · แตะเพื่อเริ่มคุย");
          info.append(top, preview);
          row.append(av, info);
          row.addEventListener("click", () => void openChat(chat.id));
          groupList.append(row);
        });
      }
    }
  };

  const renderMessages = (messages: Message[]): void => {
    const target = node<HTMLElement>("[data-social-messages]");
    clear(target);
    if (!target) return;
    if (!messages.length) {
      target.append(label(LearningHausI18n.t("Start your first conversation!", "เริ่มบทสนทนาแรกได้เลย!"), "social-system-pill"));
      return;
    }
    const activeChat = chats.find((c) => c.id === activeChatId);
    const isGroup = activeChat?.kind === "group";
    messages.forEach((entry) => {
      const mine = entry.userId === me?.id;
      const article = document.createElement("article");
      article.className = `social-page__message${mine ? " is-mine" : ""}`;
      if (isGroup && !mine) {
        const name = document.createElement("strong");
        name.textContent = entry.name;
        article.append(name);
      }
      const bubble = document.createElement("div");
      bubble.className = "social-msg-bubble";
      bubble.textContent = entry.body;
      const time = document.createElement("time");
      time.dateTime = entry.createdAt;
      time.textContent = new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      article.append(bubble, time);
      target.append(article);
    });
    target.scrollTop = target.scrollHeight;
  };

  const openChat = async (chatId: number): Promise<void> => {
    activeChatId = chatId;
    activeRequestPersonId = 0;
    addFriendOpen = false;
    syncRightStageMode();
    setMobileDetailOpen(true);
    const reqCard = node<HTMLElement>("[data-social-in-chat-request]");
    if (reqCard) reqCard.hidden = true;

    const chat = chats.find((item) => item.id === chatId);
    const title = node<HTMLElement>("[data-social-chat-title]");
    const sub = node<HTMLElement>("[data-social-chat-sub]");
    if (title) title.textContent = chat?.name || LearningHausI18n.t("Chat", "แชท");
    if (sub) {
      sub.textContent = chat?.kind === "group"
        ? LearningHausI18n.t("Group chat", "แชทกลุ่ม")
        : LearningHausI18n.t("Direct message", "ข้อความส่วนตัว");
    }
    if (chat?.kind === "group") {
      setRoomAvatar(null, "group");
    } else if (chat) {
      const matched = getAcceptedFriends().find((f) => f.name.toLowerCase() === chat.name.toLowerCase());
      setRoomAvatar(
        matched ? resolvePersonAvatar(matched) : window.LearningHausPixelCat?.getNpcAvatarDataUrl?.(chat.name) || "",
        "user"
      );
    }
    setComposerEnabled(
      true,
      LearningHausI18n.t(`Message ${chat?.name || ""}...`, `ส่งข้อความถึง ${chat?.name || ""}...`)
    );
    renderChats();
    try {
      renderMessages((await request<{ messages: Message[] }>(`/api/chats/${chatId}/messages`)).messages);
    } catch (error) {
      message((error as Error).message, true);
    }
  };

  const refresh = async (): Promise<void> => {
    if (!me) return;
    try {
      const [friendData, chatData] = await Promise.all([
        request<{ friends: Person[] }>("/api/friends"),
        request<{ chats: Chat[] }>("/api/chats")
      ]);
      friends = friendData.friends;
      chats = chatData.chats;
      const currentIncoming = getIncomingRequests();
      if (!notifBaselineLoaded) {
        knownIncomingReqIds = new Set(currentIncoming.map((p) => p.id));
        knownChatMsgCounts = new Map(chats.map((c) => [c.id, c.messageCount]));
        notifBaselineLoaded = true;
      } else {
        currentIncoming.forEach((person) => {
          if (!knownIncomingReqIds.has(person.id)) {
            window.dispatchEvent(
              new CustomEvent("learninghaus:notify", {
                detail: {
                  kind: "friend_request",
                  important: true,
                  titleEn: `Friend request from ${person.name}`,
                  titleTh: `คำขอเป็นเพื่อนจาก ${person.name}`,
                  bodyEn: `${person.name} wants to connect and chat with you.`,
                  bodyTh: `${person.name} ส่งคำขอเป็นเพื่อนกับคุณ`,
                  meta: { personId: person.id, personName: person.name }
                }
              })
            );
          }
        });
        chats.forEach((chat) => {
          const prev = knownChatMsgCounts.get(chat.id) ?? chat.messageCount;
          if (chat.messageCount > prev && chat.id !== suppressNextChatNotifyId) {
            window.dispatchEvent(
              new CustomEvent("learninghaus:notify", {
                detail: {
                  kind: "chat_message",
                  important: false,
                  titleEn: `New message from ${chat.name}`,
                  titleTh: `ข้อความใหม่จาก ${chat.name}`,
                  bodyEn: chat.lastMessage || "Sent you a message.",
                  bodyTh: chat.lastMessage || "ส่งข้อความถึงคุณ",
                  meta: { chatId: chat.id, chatName: chat.name }
                }
              })
            );
          }
        });
        knownIncomingReqIds = new Set(currentIncoming.map((p) => p.id));
        knownChatMsgCounts = new Map(chats.map((c) => [c.id, c.messageCount]));
      }
      suppressNextChatNotifyId = 0;
      renderFriends();
      if (activeRequestPersonId) {
        const stillPending = getIncomingRequests().find((p) => p.id === activeRequestPersonId);
        if (stillPending) openRequestThread(stillPending);
        else activeRequestPersonId = 0;
      } else if (activeChatId && chats.some((chat) => chat.id === activeChatId)) {
        await openChat(activeChatId);
      }
    } catch (error) {
      message((error as Error).message, true);
    }
  };

  const sendRequest = async (id: number): Promise<void> => {
    try {
      await request("/api/friends/request", "POST", { userId: id });
      message("Friend request sent.");
      await refresh();
    } catch (error) {
      message((error as Error).message, true);
    }
  };

  const respond = async (id: number, action: "accept" | "reject"): Promise<void> => {
    try {
      await request("/api/friends/respond", "POST", { userId: id, action });
      message(action === "accept" ? "Friend added." : "Request rejected.");
      await refresh();
    } catch (error) {
      message((error as Error).message, true);
    }
  };

  const startDirect = async (id: number): Promise<void> => {
    try {
      const result = await request<{ chatId: number }>("/api/chats/direct", "POST", { userId: id });
      await refresh();
      await openChat(result.chatId);
      window.dispatchEvent(new CustomEvent("learninghaus:social-open"));
    } catch (error) {
      message((error as Error).message, true);
    }
  };

  const setSession = async (person: Person | null): Promise<void> => {
    me = person;
    notifBaselineLoaded = false;
    knownIncomingReqIds = new Set();
    knownChatMsgCounts = new Map();
    suppressNextChatNotifyId = 0;
    window.LearningHausProfile?.switchAccount?.();
    if (me) window.LearningHausProfile?.syncAccount?.(me);
    const app = node<HTMLElement>("[data-social-app]");
    const active = Boolean(me && me.accountState !== "disabled");
    if (app) app.hidden = !active;
    const updateGateMessage = (): void => {
      const gate = node<HTMLElement>("[data-social-gate]");
      if (!gate) return;
      const active = Boolean(me && me.accountState !== "disabled");
      gate.hidden = active;
      gate.textContent = !available
        ? LearningHausI18n.t(
            "Open this page through the LearningHaus server to use friends and chat across devices.",
            "เปิดหน้านี้ผ่านเซิร์ฟเวอร์ LearningHaus เพื่อใช้งานเพื่อนและแชทข้ามอุปกรณ์"
          )
        : me?.accountState === "disabled"
          ? LearningHausI18n.t(
              "Restore your account in Profile to use friends and chat.",
              "กู้คืนบัญชีของคุณในหน้าโปรไฟล์เพื่อใช้งานเพื่อนและแชท"
            )
          : LearningHausI18n.t(
              "Sign in or sign up to use friends and chat.",
              "เข้าสู่ระบบหรือสมัครสมาชิกเพื่อใช้งานเพื่อนและแชท"
            );
    };
    updateGateMessage();
    eventSource?.close();
    eventSource = null;
    if (active) {
      eventSource = new EventSource("/api/events");
      eventSource.addEventListener("refresh", () => void refresh());
      await refresh();
    }
    refreshProfileActions();
    window.dispatchEvent(new Event("learninghaus:social-session"));
  };

  export const authenticate = async (kind: string, form: HTMLFormElement): Promise<AuthResult> => {
    if (!(await checkServer())) return { handled: false, success: true };
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const rememberMe = kind === "signin" && data.get("remember-me") === "on";
    const feedback = form.querySelector<HTMLElement>("[data-auth-error]") || document.createElement("p");
    feedback.dataset.authError = "";
    feedback.setAttribute("role", "alert");
    feedback.className = "auth-card__error";
    if (!feedback.parentNode) form.querySelector(".auth-card__submit")?.before(feedback);
    feedback.textContent = "";
    feedback.hidden = true;
    const setAuthError = (msg: string): void => {
      feedback.textContent = msg;
      feedback.hidden = !msg;
    };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
      setAuthError(
        LearningHausI18n.t(
          "Enter a valid email and a password of at least 8 characters.",
          "กรุณากรอกอีเมลให้ถูกต้องและรหัสผ่านอย่างน้อย 8 ตัวอักษร"
        )
      );
      return { handled: true, success: false };
    }
    if (kind === "signup" && data.get("confirm-password") !== password) {
      setAuthError(
        LearningHausI18n.t(
          "Passwords do not match.",
          "รหัสผ่านทั้งสองช่องไม่ตรงกัน"
        )
      );
      return { handled: true, success: false };
    }
    try {
      const savedName = window.LearningHausProfile?.getProfile?.().name;
      const name = savedName && savedName !== "TONOAK" ? savedName : email.split("@")[0];
      const result = await request<{ user: Person }>(kind === "signup" ? "/api/register" : "/api/login", "POST", {
        email,
        password,
        name,
        rememberMe
      });
      try {
        window.localStorage.removeItem("learninghaus.explicitLogout.v1");
      } catch {
        // Ignore storage errors.
      }
      await setSession(result.user);
      return { handled: true, success: true };
    } catch (error) {
      setAuthError((error as Error).message);
      return { handled: true, success: false };
    }
  };

  export const hasAccount = (): boolean => available === true && me !== null;
  export const isConnected = (): boolean => hasAccount() && me?.accountState !== "disabled";
  export const currentUserId = (): number => me?.id || 0;

  export const logout = async (): Promise<void> => {
    try {
      window.localStorage.setItem("learninghaus.explicitLogout.v1", "true");
    } catch {
      // Ignore storage errors.
    }
    if (available === true && me !== null) {
      try {
        await request("/api/logout", "POST", {});
      } catch {
        // Proceed with client session cleanup even if server session already expired.
      }
    }
    friends = [];
    chats = [];
    searchResults = null;
    activeChatId = 0;
    await setSession(null);
    window.dispatchEvent(new Event("learninghaus:social-logout"));
  };

  export const accountAction = async (action: "disable" | "restore" | "delete", currentPassword: string): Promise<void> => {
    if (!hasAccount()) return;
    const result = await request<{ user?: Person; deleted?: boolean }>(`/api/account/${action}`, "POST", { currentPassword });
    if (result.deleted) {
      await setSession(null);
      window.dispatchEvent(new Event("learninghaus:social-account-deleted"));
    } else if (result.user) {
      await setSession(result.user);
    }
  };

  export const updateAccountProfile = async (changes: {
    name?: string;
    email?: string;
    avatar?: string;
    catConfig?: string;
    catPresets?: string;
    about?: string;
    facebookName?: string;
    facebookUrl?: string;
    instagramName?: string;
    instagramUrl?: string;
    xName?: string;
    xUrl?: string;
    featuredAchievements?: string[] | null;
  }): Promise<void> => {
    if (!isConnected()) return;
    const result = await request<{ user: Person }>("/api/profile", "PATCH", changes);
    me = result.user;
  };

  export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    if (!isConnected()) return;
    await request("/api/password", "POST", { currentPassword, newPassword });
  };

  export const getSharedScores = async (stage: number): Promise<LearningHausLeaderboardData.Entry[] | null> => {
    if (!isConnected()) return null;
    return (await request<{ entries: LearningHausLeaderboardData.Entry[] }>(`/api/scores?stage=${stage}`)).entries;
  };

  export const getAchievementSnapshot = async (): Promise<AchievementSnapshot> => request<AchievementSnapshot>("/api/achievements");

  export const importLegacyAchievements = async (ids: string[]): Promise<void> => {
    if (!isConnected()) return;
    const snapshot = await request<AchievementSnapshot>("/api/achievements/import-legacy", "POST", { ids });
    window.dispatchEvent(new CustomEvent("learninghaus:achievement-server-snapshot", { detail: snapshot }));
  };

  export const recordLearningActivity = async (): Promise<void> => {
    if (!isConnected()) return;
    const snapshot = await request<AchievementSnapshot>("/api/activity", "POST", {});
    window.dispatchEvent(new CustomEvent("learninghaus:achievement-server-snapshot", { detail: snapshot }));
  };

  export const submitScore = async (input: {
    stage: number;
    score: number;
    correct: number;
    totalQuestions: number;
    timeSeconds: number;
    totalXp: number;
    courseId: string;
  }): Promise<void> => {
    if (!isConnected()) return;
    const snapshot = await request<AchievementSnapshot>("/api/scores", "POST", input);
    window.dispatchEvent(new CustomEvent("learninghaus:achievement-server-snapshot", { detail: snapshot }));
  };

  const init = async (): Promise<void> => {
    page = document.querySelector<HTMLElement>('[data-home-panel="social"]');
    if (!page) return;
    await checkServer();
    if (available) {
      try {
        await setSession((await request<{ user: Person }>("/api/me")).user);
      } catch {
        let explicitlyLoggedOut = false;
        try {
          explicitlyLoggedOut = window.localStorage.getItem("learninghaus.explicitLogout.v1") === "true";
        } catch {
          explicitlyLoggedOut = false;
        }
        if (!explicitlyLoggedOut) {
          try {
            await setSession((await request<{ user: Person }>("/api/auto-session", "POST", {})).user);
          } catch {
            await setSession(null);
          }
        } else {
          await setSession(null);
        }
      }
    } else {
      await setSession(null);
    }

    // 2 Category Tabs: Chat | Group
    page.querySelectorAll<HTMLElement>("[data-social-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.socialCat === "group" ? "group" : "chat";
        syncCategoryTabs();
      });
    });

    // Requests filter button (shows incoming requests — clicking automatically opens first requester's chat)
    node<HTMLElement>("[data-social-requests-btn]")?.addEventListener("click", () => {
      requestsOnly = !requestsOnly;
      syncCategoryTabs();
      renderChats();
      if (requestsOnly) {
        const firstPending = getIncomingRequests()[0];
        if (firstPending) openRequestThread(firstPending);
      }
    });

    // Add Friend Panel Toggle (supports both desktop left-pane button & mobile top-header button)
    page?.querySelectorAll<HTMLElement>("[data-social-open-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        addFriendOpen = true;
        syncRightStageMode();
        setMobileDetailOpen(true);
        node<HTMLInputElement>("#social-search")?.focus();
      });
    });
    node<HTMLElement>("[data-social-close-add]")?.addEventListener("click", () => {
      addFriendOpen = false;
      syncRightStageMode();
      setMobileDetailOpen(false);
    });
    node<HTMLElement>("[data-social-mobile-back]")?.addEventListener("click", () => {
      addFriendOpen = false;
      syncRightStageMode();
      setMobileDetailOpen(false);
    });

    // Instagram-Style Story / Note Posting & Viewer Close
    node<HTMLFormElement>("[data-social-story-form]")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = node<HTMLInputElement>("[data-social-story-input]");
      const text = input?.value.trim().slice(0, 60) || "";
      writeMyStory(text);
      const form = event.currentTarget as HTMLFormElement;
      form.hidden = true;
      renderStories();
      message(
        text
          ? LearningHausI18n.t("Story posted!", "โพสต์สตอรี่เรียบร้อยแล้ว!")
          : LearningHausI18n.t("Story removed.", "ลบสตอรี่แล้ว")
      );
    });
    node<HTMLElement>("[data-social-story-close]")?.addEventListener("click", () => {
      const viewer = node<HTMLElement>("[data-social-story-viewer]");
      if (viewer) viewer.hidden = true;
    });

    // Search Filter Inputs for Chat & Group Lists
    node<HTMLInputElement>("[data-social-filter-chat]")?.addEventListener("input", (event) => {
      chatFilterQuery = (event.currentTarget as HTMLInputElement).value;
      renderChats();
    });
    node<HTMLInputElement>("[data-social-filter-group]")?.addEventListener("input", (event) => {
      groupFilterQuery = (event.currentTarget as HTMLInputElement).value;
      renderChats();
    });

    // Create Group Drawer Toggle
    const groupFormEl = node<HTMLFormElement>("[data-social-group-form]");
    const groupToggleBtn = node<HTMLButtonElement>("[data-social-group-toggle]");
    groupToggleBtn?.addEventListener("click", () => {
      if (!groupFormEl) return;
      groupFormEl.hidden = !groupFormEl.hidden;
      groupToggleBtn.classList.toggle("is-open", !groupFormEl.hidden);
      if (!groupFormEl.hidden) node<HTMLInputElement>("#social-group-name")?.focus();
    });
    node<HTMLElement>("[data-social-group-close]")?.addEventListener("click", () => {
      if (groupFormEl) groupFormEl.hidden = true;
      groupToggleBtn?.classList.remove("is-open");
    });

    node<HTMLFormElement>("[data-social-search-form]")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const q = node<HTMLInputElement>("#social-search")?.value.trim() || "";
      if (q.length < 2) return message("Enter at least 2 characters.", true);
      try {
        renderSearch((await request<{ users: Person[] }>(`/api/users?q=${encodeURIComponent(q)}`)).users);
        message("");
      } catch (error) {
        message((error as Error).message, true);
      }
    });

    node<HTMLFormElement>("[data-social-group-form]")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = node<HTMLInputElement>("#social-group-name")?.value.trim() || "";
      const memberIds = Array.from(
        page!.querySelectorAll<HTMLInputElement>("[data-social-group-members] input:checked"),
        (input) => Number(input.value)
      );
      try {
        const result = await request<{ chatId: number }>("/api/chats/groups", "POST", { name, memberIds });
        (event.target as HTMLFormElement).reset();
        if (groupFormEl) groupFormEl.hidden = true;
        groupToggleBtn?.classList.remove("is-open");
        activeCategory = "group";
        syncCategoryTabs();
        await refresh();
        await openChat(result.chatId);
        message("Group created.");
      } catch (error) {
        message((error as Error).message, true);
      }
    });

    node<HTMLFormElement>("[data-social-message-form]")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = node<HTMLInputElement>("#social-message");
      const value = input?.value.trim();
      if (!value || !activeChatId) return;
      try {
        suppressNextChatNotifyId = activeChatId;
        await request(`/api/chats/${activeChatId}/messages`, "POST", { body: value });
        if (input) input.value = "";
        await refresh();
      } catch (error) {
        message((error as Error).message, true);
      }
    });

    syncCategoryTabs();
    syncRightStageMode();
    window.addEventListener("learninghaus:person-open", refreshProfileActions);
    window.addEventListener("learninghaus:pixel-cat-updated", renderStories);
    window.addEventListener("learninghaus:language-changed", () => {
      const gate = node<HTMLElement>("[data-social-gate]");
      if (gate && !gate.hidden) {
        gate.textContent = !available
          ? LearningHausI18n.t(
              "Open this page through the LearningHaus server to use friends and chat across devices.",
              "เปิดหน้านี้ผ่านเซิร์ฟเวอร์ LearningHaus เพื่อใช้งานเพื่อนและแชทข้ามอุปกรณ์"
            )
          : me?.accountState === "disabled"
            ? LearningHausI18n.t(
                "Restore your account in Profile to use friends and chat.",
                "กู้คืนบัญชีของคุณในหน้าโปรไฟล์เพื่อใช้งานเพื่อนและแชท"
              )
            : LearningHausI18n.t(
                "Sign in or sign up to use friends and chat.",
                "เข้าสู่ระบบหรือสมัครสมาชิกเพื่อใช้งานเพื่อนและแชท"
              );
      }
      renderFriends();
      if (activeRequestPersonId) {
        const pending = getIncomingRequests().find((p) => p.id === activeRequestPersonId);
        if (pending) openRequestThread(pending);
      } else if (activeChatId && chats.some((chat) => chat.id === activeChatId)) {
        const chat = chats.find((item) => item.id === activeChatId);
        const sub = node<HTMLElement>("[data-social-chat-sub]");
        if (sub) {
          sub.textContent = chat?.kind === "group"
            ? LearningHausI18n.t("Group chat", "แชทกลุ่ม")
            : LearningHausI18n.t("Direct message", "ข้อความส่วนตัว");
        }
        setComposerEnabled(
          true,
          LearningHausI18n.t(`Message ${chat?.name || ""}...`, `ส่งข้อความถึง ${chat?.name || ""}...`)
        );
      }
    });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => void init(), { once: true });
  else void init();
}

// ให้เมนูและหน้าอันดับเรียก API ส่วนกลางผ่านอินเทอร์เฟซเดียว
Object.assign(window, { LearningHausSocial });
