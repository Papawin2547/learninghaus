// Quick Party Arena: Code-Based Single-Match Rooms, Synced Kahoot + 7 Minigames, Poker Table (<=4) & Solo Desk (5+) Auto-Mode, Leader Crown, Shareable Presets, & Post-Game Leaderboard
namespace LearningHausPartyArena {
  export type PartyQuestionItem = LearningHausCustomQuizStudio.CustomQuizQuestionItem & {
    timeLimitSeconds?: number;
  };

  type PartyPlayerState = {
    rank: number;
    userId: number;
    name: string;
    avatar: string;
    catConfig: string;
    isBot: boolean;
    ready?: boolean;
    totalXp?: number;
    about?: string;
    featuredAchievements?: string[];
    facebookName?: string;
    facebookUrl?: string;
    instagramName?: string;
    instagramUrl?: string;
    xName?: string;
    xUrl?: string;
    score: number;
    correctCount: number;
    streak: number;
    bestStreak: number;
    clutchPoints?: number;
    avgReactionMs: number;
    answeredThisQ: boolean;
    lastCorrect: boolean | null;
    lastPointsEarned: number;
    lastReactionMs: number;
    reaction?: string;
    hasCrown: boolean;
  };

  type PartyHighlights = {
    fastestPaw?: { userId: number; name: string; avgReactionMs: number } | null;
    streakMaster?: { userId: number; name: string; bestStreak: number } | null;
    clutchWinner?: { userId: number; name: string; clutchPoints: number } | null;
  };

  type PartyRoomState = {
    code: string;
    title: string;
    hostUserId: number;
    presetCode: string;
    status: "lobby" | "question" | "reveal" | "finished";
    mode: "poker-table" | "solo-desk";
    questionIndex: number;
    totalQuestions: number;
    isDoublePoints?: boolean;
    currentQuestion: PartyQuestionItem | null;
    remainingMs: number;
    totalDurationMs: number;
    crownUserId: number | null;
    highlights?: PartyHighlights;
    players: PartyPlayerState[];
  };

  type PartyPreset = {
    code: string;
    title: string;
    ownerName?: string;
    questions: PartyQuestionItem[];
    createdAt: string;
  };

  const t = (en: string, th: string): string => LearningHausI18n.t(en, th);
  const esc = (raw: unknown): string =>
    String(raw ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const adaptiveSecondsForKind = (kind: LearningHausCustomQuizStudio.MixedItemKind): number => {
    if (kind === "matching" || kind === "sorting" || kind === "order-steps") return 30;
    if (kind === "binary-stamp" || kind === "scenario") return 20;
    return 15;
  };

  const LOCAL_PRESETS_KEY = "learninghaus.partyPresets.v1";

  const CROWN_SVG = `
    <svg class="party-crown-svg" viewBox="0 0 24 18" aria-hidden="true">
      <rect x="2" y="13" width="20" height="4" fill="#B45309" stroke="#191724" stroke-width="1"/>
      <rect x="3" y="14" width="18" height="2" fill="#FDE047"/>
      <polygon points="2,13 2,4 7,9 12,2 17,9 22,4 22,13" fill="#F59E0B" stroke="#191724" stroke-width="1.2" stroke-linejoin="round"/>
      <rect x="11" y="7" width="2" height="3" fill="#FEF08A"/>
      <rect x="5" y="9" width="2" height="2" fill="#EF4444"/>
      <rect x="17" y="9" width="2" height="2" fill="#38BDF8"/>
    </svg>
  `;

  const BOLT_SVG = `
    <svg class="party-bolt-svg" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <polygon points="9,1 3,9 7.5,9 6.5,15 13,7 8.5,7" fill="#FDE047" stroke="#92400E" stroke-width="1.2" stroke-linejoin="round"/>
    </svg>
  `;

  const REACTION_SVGS: Record<string, { labelEn: string; labelTh: string; svg: string }> = {
    clap: {
      labelEn: "Clap",
      labelTh: "ปรบมือ",
      svg: `<svg viewBox="0 0 16 16" width="18" height="18" shape-rendering="crispEdges" aria-hidden="true"><rect x="3" y="6" width="5" height="7" fill="#FBBF24" stroke="#191724" stroke-width="1"/><rect x="7" y="4" width="6" height="8" fill="#FDE047" stroke="#191724" stroke-width="1"/><rect x="2" y="2" width="2" height="2" fill="#EF4444"/><rect x="12" y="1" width="2" height="2" fill="#22C55E"/><rect x="1" y="5" width="1" height="2" fill="#38BDF8"/></svg>`
    },
    hype: {
      labelEn: "Hype!",
      labelTh: "ตื่นเต้น",
      svg: `<svg viewBox="0 0 16 16" width="18" height="18" shape-rendering="crispEdges" aria-hidden="true"><polygon points="8,1 10,5 15,6 11,9 12,14 8,12 4,14 5,9 1,6 6,5" fill="#F97316" stroke="#191724" stroke-width="1"/><rect x="7" y="5" width="2" height="4" fill="#FEF08A"/></svg>`
    },
    confused: {
      labelEn: "Huh?",
      labelTh: "งงเลย",
      svg: `<svg viewBox="0 0 16 16" width="18" height="18" shape-rendering="crispEdges" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="#E0E7FF" stroke="#191724" stroke-width="1.2"/><path d="M6 6.2c0-1.1.9-2 2-2s2 .8 2 1.8c0 .8-.5 1.3-1.2 1.7-.5.3-.8.6-.8 1.2v.4" fill="none" stroke="#4338CA" stroke-width="1.6" stroke-linecap="square"/><rect x="7.2" y="11" width="1.6" height="1.6" fill="#4338CA"/></svg>`
    },
    gg: {
      labelEn: "GG",
      labelTh: "สุดยอด",
      svg: `<svg viewBox="0 0 16 16" width="18" height="18" shape-rendering="crispEdges" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" rx="2" fill="#22C55E" stroke="#191724" stroke-width="1.2"/><path d="M3.5 9.5V6.5h3v1H5v1h1.5V10H3.5zm5.5 0V6.5h3v1H10.5v1H12V10H9z" fill="#FFFFFF"/></svg>`
    }
  };

  const renderReactionBarHtml = (): string => `
    <div class="party-react-bar" aria-label="${t("Pixel Reactions", "ส่งสติกเกอร์รีแอคแมว")}">
      <span class="party-react-bar__lbl">${t("React:", "ส่งรีแอค:")}</span>
      ${Object.entries(REACTION_SVGS)
        .map(
          ([key, item]) => `
        <button type="button" class="party-react-btn" data-party-react="${key}" title="${esc(t(item.labelEn, item.labelTh))}">
          ${item.svg}
          <span>${esc(t(item.labelEn, item.labelTh))}</span>
        </button>
      `
        )
        .join("")}
    </div>
  `;

  const CHAIR_BACK_SVG = `
    <svg class="party-desk-chair-svg" viewBox="0 0 120 120" aria-hidden="true">
      <rect x="26" y="18" width="68" height="72" rx="10" fill="#5B3721" stroke="#191724" stroke-width="3"/>
      <rect x="33" y="25" width="54" height="58" rx="6" fill="#2D6A3E" stroke="#191724" stroke-width="2"/>
      <rect x="37" y="29" width="46" height="10" rx="3" fill="#439359"/>
      <rect x="22" y="86" width="12" height="30" fill="#462816" stroke="#191724" stroke-width="2.5"/>
      <rect x="86" y="86" width="12" height="30" fill="#462816" stroke="#191724" stroke-width="2.5"/>
    </svg>
  `;

  const renderQuizDeskFrontSvg = (pawColor: string, buzzerActive: boolean): string => `
    <svg class="party-desk-front-svg${buzzerActive ? " is-pressed" : ""}" viewBox="0 0 220 92" aria-hidden="true">
      <!-- Desk Top Surface -->
      <rect x="10" y="16" width="200" height="20" rx="5" fill="#7C4D2B" stroke="#191724" stroke-width="3"/>
      <rect x="14" y="19" width="192" height="7" rx="3" fill="#A0663C"/>
      <!-- Podium Front Panel -->
      <rect x="22" y="34" width="176" height="54" rx="4" fill="#245732" stroke="#191724" stroke-width="3"/>
      <rect x="30" y="42" width="160" height="38" rx="3" fill="#2F6E40" stroke="#FBBF24" stroke-width="2"/>
      <!-- Glowing Arcade Buzzer Base + Button -->
      <rect x="82" y="14" width="56" height="10" rx="4" fill="#334155" stroke="#191724" stroke-width="2.5"/>
      <ellipse cx="110" cy="${buzzerActive ? 15 : 11}" rx="20" ry="7" fill="${buzzerActive ? "#EF4444" : "#DC2626"}" stroke="#191724" stroke-width="2.5"/>
      <ellipse cx="110" cy="${buzzerActive ? 14 : 9.5}" rx="13" ry="3.5" fill="${buzzerActive ? "#FCA5A5" : "#F87171"}"/>
      <!-- Foreground Cat Paws resting near / tapping the buzzer -->
      <rect x="${buzzerActive ? 88 : 54}" y="${buzzerActive ? 11 : 18}" width="20" height="12" rx="5" fill="${esc(pawColor)}" stroke="#191724" stroke-width="2.5"/>
      <rect x="${buzzerActive ? 124 : 146}" y="18" width="20" height="12" rx="5" fill="${esc(pawColor)}" stroke="#191724" stroke-width="2.5"/>
      <!-- Desk Light Accent -->
      <rect x="86" y="54" width="48" height="14" rx="3" fill="#183A22" stroke="#FDE047" stroke-width="1.5"/>
      <circle cx="96" cy="61" r="2.5" fill="#FDE047"/>
      <circle cx="110" cy="61" r="2.5" fill="${buzzerActive ? "#4ADE80" : "#FDE047"}"/>
      <circle cx="124" cy="61" r="2.5" fill="#FDE047"/>
    </svg>
  `;

  const resolvePlayerCatConfig = (player: PartyPlayerState, isMe: boolean): LearningHausPixelCat.CatConfig | null => {
    const px = window.LearningHausPixelCat;
    if (!px) return null;
    if (isMe) return px.getActiveConfig?.() || px.defaultConfig();
    if (player.catConfig) {
      try {
        return px.normalizeConfig(JSON.parse(player.catConfig));
      } catch {
        // fallback below
      }
    }
    return px.getNpcConfig(player.name || "NPC");
  };

  const shuffleList = <T>(items: T[]): T[] => {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  };

  const shuffleQuestionChoices = (q: PartyQuestionItem): PartyQuestionItem => {
    if ((q.kind !== "quiz" && q.kind !== "scenario") || !q.options || q.options.length < 2) {
      return { ...q };
    }
    const indexed = q.options.map((text, idx) => ({ text, isCorrect: idx === (q.correctIndex || 0) }));
    const mixed = shuffleList(indexed);
    const nextCorrect = mixed.findIndex((o) => o.isCorrect);
    return {
      ...q,
      options: mixed.map((o) => o.text),
      correctIndex: nextCorrect >= 0 ? nextCorrect : 0
    };
  };

  const gatherCustomAndPresetPool = (quizOnly: boolean): PartyQuestionItem[] => {
    const out: PartyQuestionItem[] = [];
    savedPresets.forEach((p) => {
      (p.questions || []).forEach((q) => {
        if (!quizOnly || q.kind === "quiz") out.push({ ...q });
      });
    });
    const lib = (window as unknown as {
      LearningHausLibrary?: { getCustomCourses?: () => { chapters?: { customQuizStages?: { items?: PartyQuestionItem[] }[] }[] }[] };
    }).LearningHausLibrary;
    const customCourses = lib?.getCustomCourses?.() || [];
    customCourses.forEach((c) => {
      (c.chapters || []).forEach((ch) => {
        (ch.customQuizStages || []).forEach((st) => {
          (st.items || []).forEach((it) => {
            if (it && it.prompt && (!quizOnly || it.kind === "quiz")) {
              out.push({ ...it, timeLimitSeconds: adaptiveSecondsForKind(it.kind) });
            }
          });
        });
      });
    });
    return out;
  };

  const generateRandomPartyQuestions = (
    count: number,
    quizOnly: boolean,
    source: "mfu" | "eu" | "all" = "all"
  ): PartyQuestionItem[] => {
    const safeCount = Math.max(1, Math.min(20, count));
    if (source === "mfu" && typeof LearningHausMfuTrivia !== "undefined") {
      return LearningHausMfuTrivia.pickMfuTriviaQuestions(safeCount, quizOnly).map(shuffleQuestionChoices);
    }

    const chapters = [1, 2, 3, 4, 5, 6, 7, 8];
    const poolQuiz: PartyQuestionItem[] = [];
    const poolMixed: PartyQuestionItem[] = [];

    for (const ch of chapters) {
      const qs = LearningHausQuestions.getStageQuestions(ch, ch === 1 ? 0 : 9, 5);
      qs.forEach((qObj, idx) => {
        poolQuiz.push({
          id: `rnd-q-${ch}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
          kind: "quiz",
          prompt: qObj.q,
          options: qObj.a.slice(0, 4),
          correctIndex: qObj.c,
          explanation: qObj.why,
          timeLimitSeconds: 15
        });
      });
      if (!quizOnly) {
        [1, 2, 3, 4, 5, 8].forEach((pos) => {
          const lvl = LearningHausMiniGamePacks.resolveLevel("eu-ai-act", ch, pos);
          if (!lvl) return;
          if (lvl.kind === "true-false-sprint" && lvl.statements.length) {
            const st = lvl.statements[0];
            poolMixed.push({
              id: `rnd-tf-${ch}-${pos}`,
              kind: "true-false-sprint",
              prompt: LearningHausMiniGamePacks.text(st.text),
              isTrue: st.isTrue,
              explanation: LearningHausMiniGamePacks.text(st.explain),
              timeLimitSeconds: 15
            });
          } else if (lvl.kind === "binary-stamp" && lvl.cards.length) {
            const card = lvl.cards[0];
            poolMixed.push({
              id: `rnd-bs-${ch}-${pos}`,
              kind: "binary-stamp",
              prompt: `${LearningHausMiniGamePacks.text(card.title)} — ${LearningHausMiniGamePacks.text(card.desc)}`,
              leftLabel: LearningHausMiniGamePacks.text(lvl.leftButton),
              rightLabel: LearningHausMiniGamePacks.text(lvl.rightButton),
              stampAnswer: card.answer,
              explanation: LearningHausMiniGamePacks.text(card.explain),
              timeLimitSeconds: 20
            });
          } else if (lvl.kind === "matching" && lvl.pairs.length >= 2) {
            poolMixed.push({
              id: `rnd-m-${ch}-${pos}`,
              kind: "matching",
              prompt: LearningHausMiniGamePacks.text(lvl.title),
              pairs: lvl.pairs.slice(0, 4).map((p) => ({
                left: LearningHausMiniGamePacks.text(p.left),
                right: LearningHausMiniGamePacks.text(p.right)
              })),
              explanation: LearningHausMiniGamePacks.text(lvl.pairs[0].explain),
              timeLimitSeconds: 30
            });
          } else if (lvl.kind === "sorting" && lvl.items.length >= 2) {
            const buckets = lvl.buckets.map((b) => LearningHausMiniGamePacks.text(b.title));
            const bIds = lvl.buckets.map((b) => b.id);
            poolMixed.push({
              id: `rnd-s-${ch}-${pos}`,
              kind: "sorting",
              prompt: LearningHausMiniGamePacks.text(lvl.title),
              buckets,
              sortItems: lvl.items.slice(0, 4).map((it) => ({
                text: LearningHausMiniGamePacks.text(it.name),
                bucketIdx: Math.max(0, bIds.indexOf(it.bucketId))
              })),
              explanation: LearningHausMiniGamePacks.text(lvl.items[0].explain),
              timeLimitSeconds: 30
            });
          } else if (lvl.kind === "order-steps" && lvl.steps.length >= 3) {
            const ordered = [...lvl.steps].sort((a, b) => a.rank - b.rank);
            poolMixed.push({
              id: `rnd-o-${ch}-${pos}`,
              kind: "order-steps",
              prompt: LearningHausMiniGamePacks.text(lvl.title),
              steps: ordered.map((s) => LearningHausMiniGamePacks.text(s.label)),
              explanation: LearningHausMiniGamePacks.text(ordered[0].explain),
              timeLimitSeconds: 30
            });
          }
        });
      }
    }

    const combined: PartyQuestionItem[] = quizOnly ? [...poolQuiz] : [...poolQuiz, ...poolMixed];
    if (source === "all") {
      if (typeof LearningHausMfuTrivia !== "undefined") {
        combined.push(...LearningHausMfuTrivia.pickMfuTriviaQuestions(20, quizOnly));
      }
      combined.push(...gatherCustomAndPresetPool(quizOnly));
    }

    return shuffleList(combined).slice(0, safeCount).map(shuffleQuestionChoices);
  };

  const toMiniGameLevel = (item: PartyQuestionItem, timeLimitSeconds: number): LearningHausMiniGamePacks.MiniGameLevel | null => {
    const explain = item.explanation || t("Review this concept!", "ทบทวนแนวคิดนี้!");
    if (item.kind === "matching") {
      const pairs = (item.pairs || []).filter((p) => p.left || p.right);
      const safe = pairs.length ? pairs : [{ left: "Term A", right: "Match A" }, { left: "Term B", right: "Match B" }];
      return {
        kind: "matching",
        title: item.prompt,
        instruction: { en: "Match each pair rapidly!", th: "จับคู่ให้ครบและไวที่สุด!" },
        timeLimitSeconds,
        leftLabel: { en: "Terms", th: "หัวข้อ" },
        rightLabel: { en: "Matches", th: "คู่ที่ตรงกัน" },
        pairs: safe.map((p, i) => ({ id: `pm-${i}`, left: p.left, right: p.right, explain }))
      };
    }
    if (item.kind === "binary-stamp") {
      const l = item.leftLabel || t("Allow", "อนุญาต");
      const r = item.rightLabel || t("Ban", "ต้องห้าม");
      return {
        kind: "binary-stamp",
        title: item.prompt,
        instruction: { en: "Stamp the right side!", th: "กดประทับตราฝั่งที่ถูกต้อง!" },
        timeLimitSeconds,
        leftButton: l,
        rightButton: r,
        leftStamp: l,
        rightStamp: r,
        cards: [
          {
            code: t("STATEMENT", "ข้อความให้ตัดสิน"),
            title: item.prompt,
            desc: t("Read the statement above and stamp the matching verdict below.", "อ่านข้อความด้านบน แล้วกดประทับตราฝั่งที่ถูกต้องด้านล่าง"),
            answer: item.stampAnswer === "right" ? "right" : "left",
            explain
          }
        ]
      };
    }
    if (item.kind === "sorting") {
      const tones: readonly ("blue" | "green" | "amber" | "red")[] = ["blue", "green", "amber", "red"];
      const rawB = (item.buckets || []).length ? item.buckets! : ["Group A", "Group B"];
      const buckets = rawB.map((b, i) => ({ id: `pb-${i}`, title: b, subtitle: "", tone: tones[i % tones.length] }));
      const rawI = (item.sortItems || []).length ? item.sortItems! : [{ text: "Item 1", bucketIdx: 0 }];
      return {
        kind: "sorting",
        title: item.prompt,
        instruction: { en: "Sort each card quickly!", th: "คัดแยกแต่ละใบลงหมวดที่ถูก!" },
        timeLimitSeconds,
        buckets,
        items: rawI.map((si) => ({
          name: si.text,
          hint: "",
          bucketId: `pb-${Math.max(0, Math.min(buckets.length - 1, si.bucketIdx || 0))}`,
          explain
        }))
      };
    }
    if (item.kind === "order-steps") {
      const rawS = (item.steps || []).filter(Boolean);
      const safeS = rawS.length >= 2 ? rawS : ["Step 1", "Step 2", "Step 3"];
      return {
        kind: "order-steps",
        title: item.prompt,
        instruction: { en: "Tap steps from 1st to last!", th: "แตะเรียงลำดับจาก 1 ไปสุดท้าย!" },
        timeLimitSeconds,
        steps: safeS.map((s, i) => ({ rank: i + 1, label: s, explain }))
      };
    }
    if (item.kind === "true-false-sprint") {
      return {
        kind: "true-false-sprint",
        title: item.prompt,
        instruction: { en: "TRUE or FALSE?", th: "จริง (TRUE) หรือ เท็จ (FALSE)?" },
        timeLimitSeconds,
        statements: [{ text: item.prompt, isTrue: item.isTrue !== false, explain }]
      };
    }
    if (item.kind === "scenario") {
      const opts = (item.options || []).length ? item.options! : ["Best Choice", "Risky Choice", "Ignore"];
      const corr = Math.max(0, Math.min(opts.length - 1, item.correctIndex || 0));
      return {
        kind: "scenario",
        title: item.prompt,
        instruction: { en: "Pick the best decision!", th: "เลือกการตัดสินใจที่ดีที่สุด!" },
        timeLimitSeconds,
        meterLabel: { en: "Score Meter", th: "แถบคะแนน" },
        initialMeter: 70,
        steps: [
          {
            speaker: t("Live Case", "สถานการณ์สด"),
            prompt: item.prompt,
            choices: opts.map((o, i) => ({ text: o, delta: i === corr ? 20 : -15, isBest: i === corr, note: explain }))
          }
        ]
      };
    }
    return null;
  };

  let overlayEl: HTMLElement | null = null;
  let screenMode: "hub" | "room" = "hub";
  let draftTitle = "";
  let draftTopic: "mfu" | "eu" | "all" = "all";
  let draftMixMode: "mix" | "quiz" = "mix";
  let draftCount = 8;
  let draftCustomizeOpen = false;
  let draftQuestions: PartyQuestionItem[] = [];
  let savedPresets: PartyPreset[] = [];
  let currentRoom: PartyRoomState | null = null;
  let lastRenderedRoomKey = "";
  let lastQuestionIdxRendered = -2;
  let lastRoomStatus = "";
  let lastTickSec = -1;
  let pollTimer: number | null = null;
  let catAnimTimer: number | null = null;
  let catMood: "idle" | "tap" | "happy" | "oops" = "idle";
  let activeMg: LearningHausMiniGameEngine.ActiveController | null = null;

  const ensureQuestionsInitialized = (): void => {
    if (!draftTitle) {
      draftTitle = t("All-Bank Random Party", "ปาร์ตี้สุ่มรวมทุกคลังคำถาม");
    }
    if (!draftQuestions.length) {
      draftQuestions = generateRandomPartyQuestions(draftCount, draftMixMode === "quiz", draftTopic);
    }
  };

  const syncPartyBgmForState = (): void => {
    if (!overlayEl || overlayEl.hidden) {
      window.LearningHausSettings?.setPartyBgm?.("off");
      return;
    }
    if (screenMode === "hub" || !currentRoom) {
      window.LearningHausSettings?.setPartyBgm?.("hub");
      return;
    }
    if (currentRoom.status === "lobby" || currentRoom.status === "finished") {
      window.LearningHausSettings?.setPartyBgm?.("lobby");
      return;
    }
    window.LearningHausSettings?.setPartyBgm?.(currentRoom.isDoublePoints ? "final" : "play");
  };

  const renderAudioControlsHtml = (): string => {
    const p = window.LearningHausSettings?.getPreferences?.();
    const bgmOn = p ? p.backgroundMusic : true;
    const musicSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`;
    return `
      <button type="button" class="party-audio-btn${bgmOn ? " is-on" : ""}" data-party-toggle-bgm title="${t("Toggle party background music", "เปิด/ปิดเพลงประกอบปาร์ตี้")}">
        ${musicSvg}
        <span>${bgmOn ? t("BGM: ON", "เพลง: เปิด") : t("BGM: OFF", "เพลง: ปิด")}</span>
      </button>
    `;
  };

  const bindAudioControls = (root: ParentNode): void => {
    root.querySelector("[data-party-toggle-bgm]")?.addEventListener("click", () => {
      window.LearningHausSettings?.toggleBackgroundMusic?.();
      syncPartyBgmForState();
      if (screenMode === "room" && currentRoom) renderRoom();
      else renderHub();
    });
  };

  const apiFetch = async <T>(url: string, options?: RequestInit): Promise<{ ok: boolean; status: number; data: T & { error?: string } }> => {
    try {
      const res = await fetch(url, {
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
        ...options
      });
      const data = (await res.json().catch(() => ({}))) as T & { error?: string };
      return { ok: res.ok, status: res.status, data };
    } catch {
      return { ok: false, status: 0, data: { error: t("Server unavailable", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้") } as T & { error?: string } };
    }
  };

  const ensureUserSessionIfNeeded = async (): Promise<number> => {
    const existingId = window.LearningHausSocial?.currentUserId?.();
    if (existingId) return existingId;
    const res = await apiFetch<{ user?: { id: number } }>("/api/auto-session", { method: "POST", body: "{}" });
    return res.data?.user?.id || 0;
  };

  const loadPresetsFromServerOrLocal = async (): Promise<void> => {
    await ensureUserSessionIfNeeded();
    const res = await apiFetch<{ presets?: PartyPreset[] }>("/api/party/presets");
    if (res.ok && Array.isArray(res.data?.presets)) {
      savedPresets = res.data.presets;
      LearningHausAccountStorage.writeJson(LOCAL_PRESETS_KEY, savedPresets);
    } else {
      savedPresets = LearningHausAccountStorage.readJson<PartyPreset[]>(LOCAL_PRESETS_KEY, []);
    }
  };

  const showToast = (msg: string): void => {
    window.dispatchEvent(new CustomEvent("learninghaus:toast", { detail: { message: msg } }));
  };

  const stopLoops = (): void => {
    if (pollTimer !== null) {
      window.clearInterval(pollTimer);
      pollTimer = null;
    }
    if (catAnimTimer !== null) {
      window.clearInterval(catAnimTimer);
      catAnimTimer = null;
    }
    activeMg?.destroy();
    activeMg = null;
  };

  const renderCanvasCats = (): void => {
    if (!overlayEl || overlayEl.hidden) return;
    const px = window.LearningHausPixelCat;
    if (!px || !currentRoom) return;
    const myId = window.LearningHausSocial?.currentUserId?.() || 0;
    const step = Math.floor(Date.now() / 260) % 4;
    const pose: LearningHausPixelCat.IdleAnimPose =
      catMood === "tap"
        ? { swayDx: 0, breathDy: 1, tailDx: 1, jumpPhase: "crouch" }
        : catMood === "happy"
          ? { swayDx: step % 2 === 0 ? 1 : -1, breathDy: 0, tailDx: 1, jumpPhase: step % 2 === 0 ? "air" : "land" }
          : catMood === "oops"
            ? { swayDx: step % 2 === 0 ? -1 : 1, breathDy: 1, tailDx: -1, jumpPhase: "crouch" }
            : { swayDx: 0, breathDy: step % 2 === 0 ? 0 : 1, tailDx: step === 1 ? 1 : step === 3 ? -1 : 0, jumpPhase: "idle" };

    overlayEl.querySelectorAll<HTMLCanvasElement>("canvas[data-party-cat-uid]").forEach((canvas) => {
      const uid = Number(canvas.dataset.partyCatUid);
      const pl = currentRoom?.players.find((p) => p.userId === uid);
      if (!pl) return;
      const isMe = uid === myId;
      const cfg = resolvePlayerCatConfig(pl, isMe);
      if (!cfg) return;
      const seatPose: LearningHausPixelCat.IdleAnimPose = isMe
        ? pose
        : pl.hasCrown && currentRoom?.status === "reveal"
          ? { swayDx: 0, breathDy: 0, tailDx: 1, jumpPhase: step % 2 === 0 ? "air" : "idle" }
          : { swayDx: 0, breathDy: (step + Math.abs(uid)) % 2 === 0 ? 0 : 1, tailDx: (step + Math.abs(uid)) % 2 === 0 ? 1 : 0, jumpPhase: "idle" };
      px.renderCatToCanvas(canvas, cfg, seatPose);
    });
  };

  const startRoomLoops = (): void => {
    stopLoops();
    lastTickSec = -1;
    catAnimTimer = window.setInterval(() => {
      renderCanvasCats();
      if (currentRoom && (currentRoom.status === "question" || currentRoom.status === "reveal")) {
        const timerFill = overlayEl?.querySelector<HTMLElement>("[data-party-timer-fill]");
        const timerSecEl = overlayEl?.querySelector<HTMLElement>("[data-party-timer-sec]");
        if (currentRoom.remainingMs > 0) {
          currentRoom.remainingMs = Math.max(0, currentRoom.remainingMs - 260);
          const sec = Math.ceil(currentRoom.remainingMs / 1000);
          if (currentRoom.status === "question" && sec >= 1 && sec <= 3 && sec !== lastTickSec) {
            lastTickSec = sec;
            window.LearningHausSettings?.playTone?.("tick");
          }
          if (timerSecEl) timerSecEl.textContent = `${sec}s`;
          if (timerFill && currentRoom.totalDurationMs > 0) {
            timerFill.style.transform = `scaleX(${Math.max(0, Math.min(1, currentRoom.remainingMs / currentRoom.totalDurationMs))})`;
          }
        }
      } else {
        lastTickSec = -1;
      }
    }, 260);

    pollTimer = window.setInterval(async () => {
      if (!overlayEl || overlayEl.hidden || screenMode !== "room" || !currentRoom) return;
      const code = currentRoom.code;
      const res = await apiFetch<{ room?: PartyRoomState }>(`/api/party/rooms/${encodeURIComponent(code)}`);
      if (res.ok && res.data?.room) {
        applyRoomSnapshot(res.data.room);
      }
    }, 850);
  };

  const submitAnswer = async (isCorrect: boolean, skipTone = false): Promise<void> => {
    if (!currentRoom || currentRoom.status !== "question") return;
    catMood = "tap";
    renderCanvasCats();
    if (!skipTone) {
      window.LearningHausSettings?.playTone?.(isCorrect ? "correct" : "wrong");
    }
    const res = await apiFetch<{ room?: PartyRoomState }>(`/api/party/rooms/${encodeURIComponent(currentRoom.code)}/answer`, {
      method: "POST",
      body: JSON.stringify({ questionIndex: currentRoom.questionIndex, isCorrect })
    });
    if (res.ok && res.data?.room) {
      applyRoomSnapshot(res.data.room);
    }
  };

  const bindReactionButtons = (root: ParentNode, code: string): void => {
    root.querySelectorAll<HTMLButtonElement>("[data-party-react]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const reaction = btn.dataset.partyReact || "";
        if (!reaction) return;
        window.LearningHausSettings?.playTone?.("react");
        const res = await apiFetch<{ room?: PartyRoomState }>(`/api/party/rooms/${encodeURIComponent(code)}/react`, {
          method: "POST",
          body: JSON.stringify({ reaction })
        });
        if (res.ok && res.data?.room) applyRoomSnapshot(res.data.room);
      });
    });
  };

  const mountActiveAnswerDock = (): void => {
    const dock = overlayEl?.querySelector<HTMLElement>("[data-party-answer-dock]");
    if (!dock || !currentRoom || !currentRoom.currentQuestion) return;
    const room = currentRoom;
    const myId = window.LearningHausSocial?.currentUserId?.() || 0;
    const me = room.players.find((p) => p.userId === myId);
    const q = room.currentQuestion;
    if (!q) return;

    activeMg?.destroy();
    activeMg = null;

    if (room.status === "reveal") {
      const won = me?.lastCorrect === true;
      const pts = me?.lastPointsEarned || 0;
      const crownHolder = room.players.find((p) => p.hasCrown);
      dock.innerHTML = `
        <div class="party-reveal-card ${won ? "is-ok" : "is-bad"}">
          <div class="party-reveal-main">
            <strong>${won ? t(`Correct! +${pts} pts`, `ถูกต้อง! +${pts} คะแนน`) : me?.answeredThisQ ? t("Wrong answer", "ตอบผิดในข้อนี้") : t("Time's up!", "หมดเวลา!")}</strong>
            <span>${esc(q.explanation || "")}</span>
          </div>
          ${crownHolder ? `<div class="party-crown-banner">${CROWN_SVG}<span>${t("Crown Leader:", "ผู้ครองมงกุฎ:")} <b>${esc(crownHolder.name)}</b> (${crownHolder.score} pts)</span></div>` : ""}
        </div>
        ${renderReactionBarHtml()}
      `;
      bindReactionButtons(dock, room.code);
      return;
    }

    if (me?.answeredThisQ) {
      const answeredCount = room.players.filter((p) => p.answeredThisQ).length;
      dock.innerHTML = `
        <div class="party-waiting-card">
          <strong>${t("Answer Locked In!", "ส่งคำตอบแล้ว!")}</strong>
          <span>${t(`Waiting for other players (${answeredCount}/${room.players.length})...`, `กำลังรอผู้เล่นอื่นในห้อง (${answeredCount}/${room.players.length})...`)}</span>
        </div>
      `;
      return;
    }

    if (q.kind === "quiz") {
      const opts = (q.options || []).length ? q.options! : ["A", "B", "C", "D"];
      const letters = ["A", "B", "C", "D"];
      let locked = false;
      dock.innerHTML = `
        <div class="party-soft-grid">
          ${opts
            .slice(0, 4)
            .map(
              (opt, idx) => `
              <button type="button" class="party-soft-choice" data-party-choice="${idx}">
                <span class="party-soft-badge">${letters[idx % 4]}</span>
                <span class="party-soft-text">${esc(opt)}</span>
              </button>
            `
            )
            .join("")}
        </div>
      `;
      const allBtns = Array.from(dock.querySelectorAll<HTMLButtonElement>("[data-party-choice]"));
      allBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          if (locked) return;
          locked = true;
          const chosen = Number(btn.dataset.partyChoice);
          const isCorrect = chosen === (q.correctIndex || 0);
          btn.classList.add(isCorrect ? "is-correct" : "is-wrong");
          allBtns.forEach((b) => {
            b.disabled = true;
          });
          window.LearningHausSettings?.playTone?.(isCorrect ? "correct" : "wrong");
          window.setTimeout(() => {
            void submitAnswer(isCorrect, true);
          }, 360);
        });
      });
      return;
    }

    const lvl = toMiniGameLevel(q, Math.max(5, Math.ceil((room.remainingMs || 20000) / 1000)));
    if (!lvl) return;
    dock.innerHTML = `<div class="party-minigame-host" data-party-mg-host></div>`;
    const host = dock.querySelector<HTMLElement>("[data-party-mg-host]");
    if (!host) return;
    activeMg = LearningHausMiniGameEngine.mount({
      container: host,
      level: lvl,
      onFeedback: (ok) => window.LearningHausSettings?.playTone?.(ok ? "correct" : "wrong"),
      onComplete: (res) => {
        const passed = res.correctCount >= Math.max(1, res.totalCount);
        void submitAnswer(passed);
      }
    });
  };

  const applyDeckConfigCount = (nextCount: number): void => {
    const clamped = Math.max(1, Math.min(20, Math.round(nextCount) || 8));
    draftCount = clamped;
    draftQuestions = generateRandomPartyQuestions(clamped, draftMixMode === "quiz", draftTopic);
  };

  const renderHub = (): void => {
    if (!overlayEl) return;
    ensureQuestionsInitialized();
    const presetChips = [5, 8, 12, 15, 20];

    overlayEl.innerHTML = `
      <div class="party-shell">
        <header class="party-topbar">
          <div>
            <small>${t("QUICK PARTY ARENA · JUST FOR FUN (NO EXP OR REWARDS)", "โหมดปาร์ตี้เล่นขำๆ · ไม่มี EXP หรือรางวัล · 1 ตาจบ")}</small>
            <h2>${t("Quick Party Arena", "Quick Party Arena")}</h2>
          </div>
          <div class="party-topbar__actions">
            ${renderAudioControlsHtml()}
            <button type="button" class="learn-cr-btn" data-party-close>← ${t("Back", "กลับ")}</button>
          </div>
        </header>

        <div class="party-pc-wrap">
          <!-- Draft P-C: Ultra-Minimal Centered Sheet -->
          <section class="party-pc-card" aria-label="${t("Create or Join Party Room", "สร้างหรือเข้าร่วมห้องปาร์ตี้")}">
            <div class="party-pc-title">
              <h3>${t("Join or Open a Fun Room", "กรอกรหัสเข้าห้อง หรือเปิดห้องเล่นขำๆ")}</h3>
              <small>${t("Poker Table ≤4 players · Solo Quiz Stage 5+ players · No EXP", "≤4 คนเล่นโต๊ะโป๊กเกอร์ · 5+ คนสลับเป็นเวทีเดี่ยว · ไม่มี EXP หรือรางวัล")}</small>
            </div>

            <div class="party-pc-join">
              <input type="text" class="cqs-in" data-party-join-code placeholder="${t("Room Code (e.g. P-XXXXX)", "ใส่รหัสห้อง (P-XXXXX)")}" maxlength="12">
              <button type="button" class="learn-cr-btn learn-cr-btn--primary" data-party-join-btn>${t("Join", "เข้าห้อง")}</button>
            </div>

            <div class="party-pc-or">${t("or create a new room in 1 click", "หรือเปิดห้องใหม่ใน 1 คลิก")}</div>

            <div class="party-pc-row">
              <span class="party-pc-row__label">${t("Room Name", "ชื่อห้อง")}</span>
              <input type="text" class="cqs-in" style="flex:1;min-width:190px;" data-party-title value="${esc(draftTitle)}" maxlength="60">
            </div>

            <div class="party-pc-row">
              <span class="party-pc-row__label">${t("Topic", "คลังคำถาม")}</span>
              <div class="party-pc-pills">
                <button type="button" class="party-pc-pill${draftTopic === "all" ? " is-on" : ""}" data-party-topic="all">${t("All Banks (Random)", "สุ่มรวมทุกคลัง")}</button>
                <button type="button" class="party-pc-pill${draftTopic === "mfu" ? " is-on" : ""}" data-party-topic="mfu">${t("MFU Trivia", "แฟนพันธุ์แท้ มฟล.")}</button>
                <button type="button" class="party-pc-pill${draftTopic === "eu" ? " is-on" : ""}" data-party-topic="eu">EU AI Act &amp; PDPA</button>
              </div>
            </div>

            <div class="party-pc-row">
              <span class="party-pc-row__label">${t("Format", "รูปแบบโจทย์")}</span>
              <div class="party-pc-pills">
                <button type="button" class="party-pc-pill${draftMixMode === "mix" ? " is-on" : ""}" data-party-mix="mix">${t("Mixed Minigames", "คละมินิเกม 7 แบบ")}</button>
                <button type="button" class="party-pc-pill${draftMixMode === "quiz" ? " is-on" : ""}" data-party-mix="quiz">${t("4-Choice Only", "4 ตัวเลือกล้วน")}</button>
              </div>
            </div>

            <div class="party-pc-row">
              <span class="party-pc-row__label">${t("Questions (1–20)", "จำนวนข้อ (กำหนดเอง)")}</span>
              <div class="party-pc-pills" style="align-items:center;">
                ${presetChips
                  .map(
                    (n) => `<button type="button" class="party-pc-pill${draftQuestions.length === n ? " is-on" : ""}" data-party-count="${n}">${n}</button>`
                  )
                  .join("")}
                <div class="party-pc-count-box">
                  <button type="button" class="party-pc-step" data-party-count-step="-1" aria-label="Decrease">−</button>
                  <input type="number" min="1" max="20" class="cqs-in party-pc-count-input" data-party-custom-count value="${draftQuestions.length}" aria-label="${t("Custom question count", "กำหนดจำนวนข้อเอง")}">
                  <button type="button" class="party-pc-step" data-party-count-step="1" aria-label="Increase">+</button>
                </div>
              </div>
            </div>

            <button type="button" class="learn-cr-btn learn-cr-btn--primary party-pc-create-btn" data-party-create-room>
              ${t(`Create Room (${draftQuestions.length} Qs) & Wait for Friends →`, `สร้างห้อง (${draftQuestions.length} ข้อ) และรอเพื่อนเลย →`)}
            </button>

            <button type="button" class="party-pc-customize-link" data-party-toggle-customize aria-expanded="${draftCustomizeOpen ? "true" : "false"}">
              ${
                draftCustomizeOpen
                  ? `▲ ${t("Hide Question & Minigame Editor", "ซ่อนตัวแก้ไขคำถามและมินิเกม")}`
                  : `▼ ${t(`Customize Questions & Minigames (${draftQuestions.length}) / Load Preset`, `ปรับแต่งคำถาม & มินิเกม (${draftQuestions.length} ข้อ) / โค้ด Preset`)}`
              }
            </button>
          </section>

          ${
            draftCustomizeOpen
              ? `
            <section class="party-custom-drawer" data-party-custom-drawer>
              <div class="party-custom-drawer__presets">
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                  <button type="button" class="learn-cr-btn" data-party-save-preset>${t("Save as Shareable Preset", "บันทึกเป็น Preset ส่งต่อเพื่อน")}</button>
                  <input type="text" class="cqs-in" style="width:170px;" data-party-import-code placeholder="${t("Preset Code (PRE-...)", "รหัส Preset (PRE-...)")}" maxlength="14">
                  <button type="button" class="learn-cr-btn" data-party-import-btn>${t("Load Code", "โหลดรหัส")}</button>
                </div>
                <button type="button" class="learn-cr-btn learn-cr-btn--primary" data-cqs-add-item ${draftQuestions.length >= 20 ? "disabled" : ""}>+ ${t("Add Question / Minigame", "เพิ่มข้อ / มินิเกมใหม่")}</button>
              </div>

              ${
                savedPresets.length
                  ? `
                <div class="party-custom-drawer__chips">
                  ${savedPresets
                    .map(
                      (p) => `
                    <div class="party-preset-row" style="flex:1;min-width:210px;">
                      <div>
                        <strong>${esc(p.title)}</strong>
                        <small>${p.questions.length} ${t("items", "ข้อ")} · <code>${esc(p.code)}</code></small>
                      </div>
                      <div class="party-preset-acts">
                        <button type="button" class="learn-cr-btn" data-party-use-preset="${esc(p.code)}">${t("Use", "ใช้ชุดนี้")}</button>
                        <button type="button" class="cqs-del-btn" data-party-del-preset="${esc(p.code)}" aria-label="Delete">×</button>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              `
                  : ""
              }

              <div class="cqs-row-head">
                <p class="cqs-sub">
                  <strong>${t("Full Minigame Editor (Same as Class Creation)", "ปรับแต่งทุกข้อและเลือกมินิเกมได้เหมือนตอนสร้าง Class")}</strong> ·
                  ${t("Fun party room only — no EXP or rewards awarded.", "ห้องเล่นขำๆ ไม่มีการเก็บ EXP หรือรางวัล")}
                </p>
              </div>

              <div data-party-cqs-host>
                ${LearningHausCustomQuizStudio.renderItemEditorListHtml(draftQuestions)}
              </div>
            </section>
          `
              : ""
          }
        </div>
      </div>
    `;

    syncPartyBgmForState();
    bindAudioControls(overlayEl);

    overlayEl.querySelector("[data-party-close]")?.addEventListener("click", close);
    overlayEl.querySelector<HTMLInputElement>("[data-party-title]")?.addEventListener("input", (e) => {
      draftTitle = (e.target as HTMLInputElement).value;
    });

    overlayEl.querySelectorAll<HTMLButtonElement>("[data-party-topic]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const raw = btn.dataset.partyTopic;
        draftTopic = raw === "eu" ? "eu" : raw === "mfu" ? "mfu" : "all";
        draftTitle =
          draftTopic === "mfu"
            ? t("MFU Fan Trivia Party", "ปาร์ตี้แฟนพันธุ์แท้ มฟล.")
            : draftTopic === "eu"
              ? t("EU AI Act & PDPA Party", "ปาร์ตี้ EU AI Act & PDPA")
              : t("All-Bank Random Party", "ปาร์ตี้สุ่มรวมทุกคลังคำถาม");
        applyDeckConfigCount(draftQuestions.length || draftCount);
        renderHub();
      });
    });

    overlayEl.querySelectorAll<HTMLButtonElement>("[data-party-mix]").forEach((btn) => {
      btn.addEventListener("click", () => {
        draftMixMode = btn.dataset.partyMix === "quiz" ? "quiz" : "mix";
        applyDeckConfigCount(draftQuestions.length || draftCount);
        renderHub();
      });
    });

    overlayEl.querySelectorAll<HTMLButtonElement>("[data-party-count]").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyDeckConfigCount(Number(btn.dataset.partyCount) || 8);
        renderHub();
      });
    });

    overlayEl.querySelectorAll<HTMLButtonElement>("[data-party-count-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const delta = Number(btn.dataset.partyCountStep) || 0;
        applyDeckConfigCount(draftQuestions.length + delta);
        renderHub();
      });
    });

    overlayEl.querySelector<HTMLInputElement>("[data-party-custom-count]")?.addEventListener("change", (e) => {
      const val = Number((e.target as HTMLInputElement).value);
      applyDeckConfigCount(val || 1);
      renderHub();
    });

    overlayEl.querySelector("[data-party-toggle-customize]")?.addEventListener("click", () => {
      draftCustomizeOpen = !draftCustomizeOpen;
      renderHub();
    });

    const drawerEl = overlayEl.querySelector<HTMLElement>("[data-party-custom-drawer]");
    if (drawerEl) {
      LearningHausCustomQuizStudio.bindItemEditorList(drawerEl, draftQuestions, 20, (needsReRender) => {
        draftQuestions.forEach((q) => {
          q.timeLimitSeconds = adaptiveSecondsForKind(q.kind);
        });
        draftCount = draftQuestions.length;
        if (needsReRender) {
          renderHub();
        } else {
          const createBtn = overlayEl?.querySelector<HTMLElement>("[data-party-create-room]");
          if (createBtn) {
            createBtn.textContent = t(`Create Room (${draftQuestions.length} Qs) & Wait for Friends →`, `สร้างห้อง (${draftQuestions.length} ข้อ) และรอเพื่อนเลย →`);
          }
        }
      });
    }

    overlayEl.querySelector("[data-party-save-preset]")?.addEventListener("click", async () => {
      await ensureUserSessionIfNeeded();
      const res = await apiFetch<{ preset?: PartyPreset }>("/api/party/presets", {
        method: "POST",
        body: JSON.stringify({ title: draftTitle.trim() || "Quick Party Deck", questions: draftQuestions })
      });
      if (res.ok && res.data?.preset) {
        savedPresets.unshift(res.data.preset);
        LearningHausAccountStorage.writeJson(LOCAL_PRESETS_KEY, savedPresets);
        window.LearningHausSettings?.playTone?.("ready");
        showToast(t(`Saved preset! Share code: ${res.data.preset.code}`, `บันทึก Preset แล้ว! รหัสแชร์เพื่อน: ${res.data.preset.code}`));
        renderHub();
      } else {
        showToast(res.data?.error || t("Could not save preset", "บันทึก Preset ไม่สำเร็จ"));
      }
    });

    overlayEl.querySelector("[data-party-import-btn]")?.addEventListener("click", async () => {
      const code = overlayEl?.querySelector<HTMLInputElement>("[data-party-import-code]")?.value.trim() || "";
      if (!code) return;
      await ensureUserSessionIfNeeded();
      const res = await apiFetch<{ preset?: PartyPreset }>(`/api/party/presets/by-code?code=${encodeURIComponent(code)}`);
      if (res.ok && res.data?.preset) {
        draftTitle = res.data.preset.title;
        draftQuestions = res.data.preset.questions;
        draftCount = draftQuestions.length;
        window.LearningHausSettings?.playTone?.("ready");
        showToast(t(`Loaded preset "${draftTitle}"!`, `โหลดชุดโจทย์ "${draftTitle}" เรียบร้อย!`));
        renderHub();
      } else {
        showToast(res.data?.error || t("Preset code not found.", "ไม่พบรหัส Preset นี้"));
      }
    });

    overlayEl.querySelectorAll<HTMLButtonElement>("[data-party-use-preset]").forEach((b) => {
      b.addEventListener("click", () => {
        const found = savedPresets.find((p) => p.code === b.dataset.partyUsePreset);
        if (!found) return;
        draftTitle = found.title;
        draftQuestions = found.questions.map((q) => ({ ...q }));
        draftCount = draftQuestions.length;
        window.LearningHausSettings?.playTone?.("ready");
        showToast(t(`Loaded "${found.title}"!`, `เลือกใช้ "${found.title}" แล้ว!`));
        renderHub();
      });
    });

    overlayEl.querySelectorAll<HTMLButtonElement>("[data-party-del-preset]").forEach((b) => {
      b.addEventListener("click", async () => {
        const code = b.dataset.partyDelPreset || "";
        await apiFetch(`/api/party/presets/${encodeURIComponent(code)}`, { method: "DELETE" });
        savedPresets = savedPresets.filter((p) => p.code !== code);
        LearningHausAccountStorage.writeJson(LOCAL_PRESETS_KEY, savedPresets);
        renderHub();
      });
    });

    overlayEl.querySelector("[data-party-create-room]")?.addEventListener("click", async () => {
      await ensureUserSessionIfNeeded();
      window.LearningHausSettings?.playTone?.("ready");
      if (!draftCustomizeOpen) {
        draftQuestions = generateRandomPartyQuestions(draftQuestions.length || draftCount, draftMixMode === "quiz", draftTopic);
      } else {
        draftQuestions = shuffleList(draftQuestions).map(shuffleQuestionChoices);
      }
      const res = await apiFetch<{ room?: PartyRoomState }>("/api/party/rooms", {
        method: "POST",
        body: JSON.stringify({ title: draftTitle.trim() || "Quick Party Match", questions: draftQuestions })
      });
      if (res.ok && res.data?.room) {
        screenMode = "room";
        lastRenderedRoomKey = "";
        applyRoomSnapshot(res.data.room);
        startRoomLoops();
      } else {
        showToast(res.data?.error || t("Could not create room", "เปิดห้องไม่สำเร็จ"));
      }
    });

    overlayEl.querySelector("[data-party-join-btn]")?.addEventListener("click", async () => {
      const code = overlayEl?.querySelector<HTMLInputElement>("[data-party-join-code]")?.value.trim() || "";
      if (!code) return;
      await ensureUserSessionIfNeeded();
      window.LearningHausSettings?.playTone?.("ready");
      const res = await apiFetch<{ room?: PartyRoomState }>("/api/party/rooms/join", {
        method: "POST",
        body: JSON.stringify({ code })
      });
      if (res.ok && res.data?.room) {
        screenMode = "room";
        lastRenderedRoomKey = "";
        applyRoomSnapshot(res.data.room);
        startRoomLoops();
      } else {
        showToast(res.data?.error || t("Room not found", "ไม่พบรหัสห้องนี้"));
      }
    });
  };

  const partyAvatarCache = new Map<string, string>();

  const getPartyPlayerAvatar = (p: PartyPlayerState, myId: number): string => {
    if (p.userId === myId) {
      const myProfileAvatar = window.LearningHausProfile?.getProfile?.()?.avatar;
      if (myProfileAvatar) return myProfileAvatar;
    }
    if (p.avatar) return p.avatar;
    const cacheKey = `${p.userId}|${p.name}|${p.catConfig || ""}`;
    const hit = partyAvatarCache.get(cacheKey);
    if (hit) return hit;
    const rendered =
      window.LearningHausPixelCat?.renderConfigToDataUrl?.(resolvePlayerCatConfig(p, p.userId === myId)!, 96) || "";
    if (rendered) partyAvatarCache.set(cacheKey, rendered);
    return rendered;
  };

  const buildPersonAttrs = (p: PartyPlayerState, myId: number): string => {
    const xp = Number(p.totalXp) || 0;
    const lvl = LearningHausProgression.getLevelState(xp).level;
    const ach = JSON.stringify(Array.isArray(p.featuredAchievements) ? p.featuredAchievements : []);
    return [
      `data-looking-person="${esc(p.name)}"`,
      `data-person-id="${p.userId > 0 ? p.userId : ""}"`,
      `data-person-level="${lvl}"`,
      `data-person-exp="${xp}"`,
      `data-person-avatar="${esc(getPartyPlayerAvatar(p, myId))}"`,
      `data-person-about="${esc(p.about || "")}"`,
      `data-person-cat-config="${esc(p.catConfig || "")}"`,
      `data-person-featured-achievements="${esc(ach)}"`,
      `data-person-facebook-name="${esc(p.facebookName || "")}"`,
      `data-person-facebook-url="${esc(p.facebookUrl || "")}"`,
      `data-person-instagram-name="${esc(p.instagramName || "")}"`,
      `data-person-instagram-url="${esc(p.instagramUrl || "")}"`,
      `data-person-x-name="${esc(p.xName || "")}"`,
      `data-person-x-url="${esc(p.xUrl || "")}"`
    ].join(" ");
  };

  const renderPokerStageHtml = (room: PartyRoomState, myId: number): string => {
    const seats = [
      { left: "16%", top: "53%" },
      { left: "34%", top: "26%" },
      { left: "66%", top: "26%" },
      { left: "84%", top: "53%" }
    ];
    const tablePlayers = room.players.slice(0, 4);
    return `
      <div class="party-stage party-stage--poker" data-party-stage-mode="poker-table">
        <img class="party-stage__bg" src="lesson-assets/party/party-poker-room.jpg" alt="Poker game room">
        ${tablePlayers
          .map((pl, idx) => {
            const pos = seats[idx % 4];
            const isMe = pl.userId === myId;
            const reactSpec = pl.reaction ? REACTION_SVGS[pl.reaction] : null;
            const statusBubble =
              room.status === "lobby"
                ? `<span class="party-seat__bubble ${pl.ready ? "is-ready-go" : "is-ready-wait"}">${pl.ready ? `✓ ${t("Ready", "พร้อม")}` : t("Idle", "รอ")}</span>`
                : room.status === "question"
                  ? pl.answeredThisQ
                    ? `<span class="party-seat__bubble is-ready">✓ ${t("Locked", "ตอบแล้ว")}</span>`
                    : ""
                  : room.status === "reveal"
                    ? `<span class="party-seat__bubble ${pl.lastCorrect ? "is-ok" : "is-bad"}">${pl.lastCorrect ? `+${pl.lastPointsEarned}` : "×"}</span>`
                    : "";
            return `
              <button type="button" class="party-poker-seat${pl.hasCrown ? " has-crown" : ""}${isMe ? " is-me" : ""}" style="left:${pos.left};top:${pos.top};" ${buildPersonAttrs(pl, myId)} title="${esc(t(`View ${pl.name}'s profile`, `ดูโปรไฟล์ ${pl.name}`))}">
                ${reactSpec ? `<div class="party-seat__react" title="${esc(t(reactSpec.labelEn, reactSpec.labelTh))}">${reactSpec.svg}</div>` : ""}
                ${pl.hasCrown ? `<div class="party-crown-float" title="${t("Crown Leader", "ผู้ครองมงกุฎ")}">${CROWN_SVG}</div>` : ""}
                ${statusBubble}
                <canvas class="party-cat-canvas" data-party-cat-uid="${pl.userId}" width="104" height="104"></canvas>
                <div class="party-seat__plate">
                  <strong>${esc(pl.name)}${isMe ? ` (${t("YOU", "คุณ")})` : ""}</strong>
                  <span>${pl.score} pts</span>
                </div>
              </button>
            `;
          })
          .join("")}
      </div>
    `;
  };

  const renderSoloDeskStageHtml = (room: PartyRoomState, myId: number): string => {
    const me = room.players.find((p) => p.userId === myId) || room.players[0];
    const cfg = me ? resolvePlayerCatConfig(me, true) : null;
    const pawColor = cfg && window.LearningHausPixelCat ? window.LearningHausPixelCat.directRgbaCss(cfg.colors.fur) : "#F59E0B";
    const buzzerActive = Boolean(me?.answeredThisQ || catMood === "tap");
    const topStrip = room.players.slice(0, 5);
    const showMeExtra = me && !topStrip.some((p) => p.userId === me.userId);
    const myReact = me?.reaction ? REACTION_SVGS[me.reaction] : null;

    return `
      <div class="party-stage party-stage--solo" data-party-stage-mode="solo-desk">
        <img class="party-stage__bg" src="lesson-assets/party/party-solo-stage.jpg" alt="Quiz game show stage">
        <aside class="party-live-strip" aria-label="Live scores">
          <small>${t(`LIVE RANK (${room.players.length} PLAYERS)`, `อันดับสด (${room.players.length} คน)`)}</small>
          ${topStrip
            .map(
              (p) => `
            <div class="party-live-row${p.userId === myId ? " is-me" : ""}">
              <span>#${p.rank} ${p.hasCrown ? `<span class="party-live-crown">${CROWN_SVG}</span>` : ""} ${esc(p.name)}</span>
              <b>${p.score}</b>
            </div>
          `
            )
            .join("")}
          ${
            showMeExtra && me
              ? `
            <div class="party-live-row is-me" style="border-top:1px dashed rgba(255,255,255,0.22);padding-top:3px;margin-top:1px;">
              <span>#${me.rank} ${esc(me.name)}</span>
              <b>${me.score}</b>
            </div>
          `
              : ""
          }
        </aside>

        <div class="party-solo-rig">
          ${myReact ? `<div class="party-seat__react party-seat__react--solo">${myReact.svg}</div>` : ""}
          ${me?.hasCrown ? `<div class="party-crown-float party-crown-float--solo" title="${t("Crown Leader", "ผู้ครองมงกุฎ")}">${CROWN_SVG}</div>` : ""}
          ${CHAIR_BACK_SVG}
          <canvas class="party-cat-canvas party-cat-canvas--solo" data-party-cat-uid="${me?.userId || myId}" width="156" height="156"></canvas>
          ${renderQuizDeskFrontSvg(pawColor, buzzerActive)}
        </div>
      </div>
    `;
  };

  const renderFinishedLeaderboardHtml = (room: PartyRoomState, myId: number, isHost: boolean): string => {
    const podium = room.players.slice(0, 3);
    const hl = room.highlights || {};
    const fastestSvg = `<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><polygon points="9,1 3,9 7.5,9 6.5,15 13,7 8.5,7" fill="#F59E0B" stroke="#191724" stroke-width="1"/></svg>`;
    const streakSvg = `<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M8 1c2 3 5 4.5 5 8a5 5 0 1 1-10 0c0-2 1-3.8 2.5-5 .2 1.3 1 2 2 2-.6-1.8-.3-3.5.5-5z" fill="#EF4444" stroke="#191724" stroke-width="1"/></svg>`;
    const clutchSvg = `<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><rect x="2" y="3" width="12" height="10" rx="2" fill="#22C55E" stroke="#191724" stroke-width="1"/><path d="M4.5 9.5 7 7l1.5 1.5L11.5 5.5" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="square"/></svg>`;

    const highlightCards = [
      hl.fastestPaw
        ? {
            icon: fastestSvg,
            title: t("Fastest Paw", "ตอบไวที่สุด (Fastest Paw)"),
            winner: hl.fastestPaw.name,
            stat: t(`${(hl.fastestPaw.avgReactionMs / 1000).toFixed(2)}s avg`, `เฉลี่ย ${(hl.fastestPaw.avgReactionMs / 1000).toFixed(2)} วิ/ข้อ`)
          }
        : null,
      hl.streakMaster
        ? {
            icon: streakSvg,
            title: t("Streak Master", "ตอบถูกติดกันสูงสุด (Streak Master)"),
            winner: hl.streakMaster.name,
            stat: t(`${hl.streakMaster.bestStreak} streak`, `${hl.streakMaster.bestStreak} ข้อติดกัน`)
          }
        : null,
      hl.clutchWinner
        ? {
            icon: clutchSvg,
            title: t("Final Clutch x2", "พลิกเกมข้อสุดท้าย (Clutch x2)"),
            winner: hl.clutchWinner.name,
            stat: `+${hl.clutchWinner.clutchPoints} ${t("pts", "คะแนน")}`
          }
        : null
    ].filter((c): c is NonNullable<typeof c> => Boolean(c));

    const trophySvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55-.47.98-.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`;
    const renderPodiumSlot = (p: PartyPlayerState | undefined, rank: number, variant: "second" | "first" | "third", tone: "fox" | "cat" | "owl"): string => {
      if (!p) {
        return `<button class="leaderboards-podium__item leaderboards-podium__item--${variant} is-static" type="button" hidden disabled></button>`;
      }
      const label = `${p.name}${p.userId === myId ? ` (${t("YOU", "คุณ")})` : ""}`;
      return `
        <button class="leaderboards-podium__item leaderboards-podium__item--${variant}" type="button" ${buildPersonAttrs(p, myId)} aria-label="${rank} ${esc(label)} ${p.score}">
          <span class="leaderboards-podium__avatar leaderboards-podium__avatar--${tone}">
            <img src="${esc(getPartyPlayerAvatar(p, myId))}" alt="${esc(p.name)} avatar">
          </span>
          <span class="leaderboards-podium__rank">${rank}</span>
          <span class="leaderboards-podium__name">${esc(label)}</span>
          <span class="leaderboards-podium__exp">${p.score} ${t("SCORE", "คะแนน")}</span>
        </button>
      `;
    };
    const restPlayers = room.players.slice(3);

    return `
      <div class="party-finish-wrap">
        <div class="lb-shell lb-shell--postgame">
          <div class="lb-header-card">
            <div class="lb-header-left">
              <span class="lb-trophy-icon">${trophySvg}</span>
              <div>
                <h2>${t("LEADERBOARDS", "ตารางอันดับ")}</h2>
                <p class="lb-summary">${t(
                  `Ranked ${room.players.length} players · Party match (No EXP)`,
                  `จัดอันดับผู้เล่น ${room.players.length} คน · คะแนนปาร์ตี้ (ไม่มี EXP)`
                )}</p>
              </div>
            </div>
            <span class="lb-stage-badge">${esc(room.title)} · ${room.mode === "poker-table" ? t("Poker Table", "โต๊ะโป๊กเกอร์") : t("Solo Stage", "เวทีเดี่ยว")}</span>
          </div>

          <section class="leaderboards-podium" aria-label="${t("Top three players", "ผู้ชนะ 3 อันดับแรก")}">
            ${renderPodiumSlot(podium[1], 2, "second", "fox")}
            ${renderPodiumSlot(podium[0], 1, "first", "cat")}
            ${renderPodiumSlot(podium[2], 3, "third", "owl")}
            <div class="leaderboards-podium__base" aria-hidden="true"></div>
          </section>

          ${
            highlightCards.length
              ? `
            <div class="party-highlights-grid" aria-label="${t("Match Highlights", "รางวัลไฮไลต์ประจำแมตช์")}">
              ${highlightCards
                .map(
                  (c) => `
                <div class="party-highlight-card">
                  <div class="party-highlight-icon">${c.icon}</div>
                  <div>
                    <small>${esc(c.title)}</small>
                    <strong>${esc(c.winner)}</strong>
                    <span>${esc(c.stat)}</span>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }

          ${
            restPlayers.length
              ? `
            <section class="leaderboards-table" aria-label="${t("Player rankings", "ตารางอันดับผู้เล่น")}">
              <div class="leaderboards-table__head" role="row">
                <span>${t("Rank", "อันดับ")}</span>
                <span>${t("Player", "ผู้เล่น")}</span>
                <span>${t("Correct", "ถูก")}</span>
                <span>${t("Score", "คะแนน")}</span>
              </div>
              <div class="leaderboards-table__list" tabindex="0">
                ${restPlayers
                  .map(
                    (p) => `
                  <button class="leaderboards-table__row${p.userId === myId ? " leaderboards-table__row--current" : ""}" type="button" ${buildPersonAttrs(p, myId)}>
                    <img src="${esc(getPartyPlayerAvatar(p, myId))}" alt="" aria-hidden="true">
                    <span>${p.rank}</span>
                    <strong>${esc(p.name)}${p.userId === myId ? ` (${t("YOU", "คุณ")})` : ""}</strong>
                    <span>${p.correctCount}/${room.totalQuestions}</span>
                    <span>${p.score}</span>
                  </button>
                `
                  )
                  .join("")}
              </div>
            </section>
          `
              : ""
          }

          <div class="lb-postgame-footer">
            <span class="lb-postgame-hint">${t(
              "Quick Party complete — played just for fun (No EXP or rewards).",
              "จบตา Quick Party แล้ว — โหมดสร้างเล่นขำๆ ไม่มี EXP หรือรางวัล"
            )}</span>
            <div class="party-finish-acts">
              <button type="button" class="learn-cr-btn" data-party-save-from-end>${t("Save & Share Preset Code", "บันทึก & รับรหัส Preset")}</button>
              <button type="button" class="learn-cr-btn" data-party-leave>${t("Back to Party Hub", "กลับหน้าแรกปาร์ตี้")}</button>
              ${isHost ? `<button type="button" class="quiz-flow__next" data-party-replay>${t("Play Another Match →", "เล่นตาใหม่ →")}</button>` : ""}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderRoom = (): void => {
    if (!overlayEl || !currentRoom) return;
    const room = currentRoom;
    const myId = window.LearningHausSocial?.currentUserId?.() || 0;
    const me = room.players.find((p) => p.userId === myId);
    const isHost = room.hostUserId === myId;
    const botCount = room.players.filter((p) => p.isBot).length;
    const readyCount = room.players.filter((p) => p.ready).length;

    if (room.status === "finished") {
      overlayEl.innerHTML = `
        <div class="party-shell">
          <header class="party-topbar">
            <div><small>${esc(room.code)} · ${t("JUST FOR FUN (NO EXP)", "เล่นขำๆ ไม่มี EXP")}</small><h2>${esc(room.title)}</h2></div>
            <div class="party-topbar__actions">
              ${renderAudioControlsHtml()}
              <button type="button" class="learn-cr-btn" data-party-leave>← ${t("Leave Room", "ออกห้อง")}</button>
            </div>
          </header>
          ${renderFinishedLeaderboardHtml(room, myId, isHost)}
        </div>
      `;
      bindAudioControls(overlayEl);
      overlayEl.querySelectorAll("[data-party-leave]").forEach((btn) => btn.addEventListener("click", leaveRoom));
      overlayEl.querySelector("[data-party-replay]")?.addEventListener("click", async () => {
        window.LearningHausSettings?.playTone?.("ready");
        await apiFetch(`/api/party/rooms/${encodeURIComponent(room.code)}/replay`, { method: "POST", body: "{}" });
        const nextRes = await apiFetch<{ room?: PartyRoomState }>(`/api/party/rooms/${encodeURIComponent(room.code)}`);
        if (nextRes.ok && nextRes.data?.room) applyRoomSnapshot(nextRes.data.room);
      });
      overlayEl.querySelector("[data-party-save-from-end]")?.addEventListener("click", async () => {
        const res = await apiFetch<{ preset?: PartyPreset }>("/api/party/presets", {
          method: "POST",
          body: JSON.stringify({ title: room.title, questions: draftQuestions })
        });
        if (res.ok && res.data?.preset) {
          savedPresets.unshift(res.data.preset);
          LearningHausAccountStorage.writeJson(LOCAL_PRESETS_KEY, savedPresets);
          window.LearningHausSettings?.playTone?.("ready");
          showToast(t(`Saved! Share Preset Code: ${res.data.preset.code}`, `บันทึกแล้ว! รหัสแชร์เพื่อน: ${res.data.preset.code}`));
        }
      });
      return;
    }

    const stageHtml = room.mode === "solo-desk" ? renderSoloDeskStageHtml(room, myId) : renderPokerStageHtml(room, myId);
    const pct = room.totalDurationMs > 0 ? Math.max(0, Math.min(1, room.remainingMs / room.totalDurationMs)) : 1;

    overlayEl.innerHTML = `
      <div class="party-shell party-shell--room">
        <header class="party-topbar">
          <div class="party-room-meta">
            <button type="button" class="party-code-chip" data-party-copy-code="${esc(room.code)}" title="Copy room code">
              ${esc(room.code)} · ${t("Copy", "คัดลอก")}
            </button>
            <span class="party-mode-pill">${room.mode === "poker-table" ? t(`Poker Table (${room.players.length}/4)`, `โต๊ะโป๊กเกอร์ (${room.players.length}/4 คน)`) : t(`Solo Quiz Desk (${room.players.length} Players)`, `เวทีโต๊ะเดี่ยว (${room.players.length} คน)`)}</span>
            ${room.status !== "lobby" ? `<span class="party-q-pill">${t("Q", "ข้อ")} ${room.questionIndex + 1} / ${room.totalQuestions}</span>` : ""}
            ${room.status !== "lobby" && room.isDoublePoints ? `<span class="party-x2-pill">${BOLT_SVG} ${t("FINAL x2", "ข้อสุดท้าย x2")}</span>` : ""}
          </div>
          <div class="party-topbar__actions">
            ${renderAudioControlsHtml()}
            <button type="button" class="learn-cr-btn" data-party-leave>← ${t("Leave", "ออกห้อง")}</button>
          </div>
        </header>

        ${
          room.status === "lobby"
            ? `
          <div class="party-lobby-wrap">
            ${stageHtml}
            <div class="party-lobby-bar">
              <div>
                <strong>${esc(room.title)} (${room.totalQuestions} ${t("questions · Final x2", "ข้อ · ข้อสุดท้าย x2")})</strong>
                <small>${t(`Players: ${room.players.length} (${readyCount}/${room.players.length} Ready) — Fun Match, No EXP`, `ผู้เล่นในห้อง: ${room.players.length} คน (พร้อม ${readyCount}/${room.players.length}) — ห้องเล่นขำๆ ไม่มี EXP`)}</small>
              </div>
              <div class="party-lobby-btns">
                <button type="button" class="learn-cr-btn party-ready-btn${me?.ready ? " is-ready" : ""}" data-party-ready>
                  ${me?.ready ? `✓ ${t("Ready!", "พร้อมแล้ว!")}` : t("Ready Up", "กดพร้อม (Ready)")}
                </button>
                ${
                  isHost
                    ? `
                  <button type="button" class="learn-cr-btn" data-party-bots="${Math.min(50, botCount + 1)}" ${botCount >= 50 ? "disabled" : ""}>${t(`+1 Bot (${botCount}/50)`, `+1 บอท (${botCount}/50)`)}</button>
                  <button type="button" class="learn-cr-btn" data-party-bots="${Math.max(0, botCount - 1)}" ${botCount <= 0 ? "disabled" : ""}>${t("-1 Bot", "-1 บอท")}</button>
                  <span class="party-bot-setter">
                    <input type="number" min="0" max="50" class="cqs-in party-bot-input" data-party-bot-input value="${botCount}" aria-label="${t("Custom bot count (0-50)", "ระบุจำนวนบอท (0-50)")}">
                    <button type="button" class="learn-cr-btn" data-party-bot-apply>${t("Set Bots", "ตั้งบอท")}</button>
                  </span>
                  <button type="button" class="learn-cr-btn" data-party-bots="0" ${botCount <= 0 ? "disabled" : ""}>${t("Clear All Bots", "ลบบอททั้งหมด")}</button>
                  <button type="button" class="learn-cr-btn learn-cr-btn--primary" data-party-start>${t("Start Match →", "เริ่มเกมเลย →")}</button>
                `
                    : `<span class="party-waiting-tag">${t("Waiting for Host to start...", "รอหัวหน้าห้องกดเริ่มเกม...")}</span>`
                }
              </div>
            </div>
            <div class="party-lobby-subrow">
              ${renderReactionBarHtml()}
              <small style="color:#536957;font-size:12px;">${t("Final question awards DOUBLE POINTS (x2) for a comeback!", "ข้อสุดท้ายคะแนนคูณ x2 พลิกกระดานได้!")}</small>
            </div>
          </div>
        `
            : `
          <div class="party-play-wrap">
            <div class="party-timer-row">
              <div class="quiz-flow__timer-track"><div class="quiz-flow__timer-fill" data-party-timer-fill style="transform:scaleX(${pct})"></div></div>
              <strong data-party-timer-sec>${Math.ceil(room.remainingMs / 1000)}s</strong>
            </div>
            <div class="party-question-banner${room.isDoublePoints ? " is-double" : ""}">
              ${room.isDoublePoints ? `<span class="party-x2-pill">${BOLT_SVG} ${t("FINAL QUESTION · DOUBLE POINTS x2", "ข้อสุดท้าย · คะแนนคูณ x2 พลิกเกม!")}</span>` : ""}
              <h2>${esc(room.currentQuestion?.prompt || "")}</h2>
            </div>
            ${stageHtml}
            <div class="party-answer-dock" data-party-answer-dock></div>
          </div>
        `
        }
      </div>
    `;

    renderCanvasCats();
    bindAudioControls(overlayEl);
    bindReactionButtons(overlayEl, room.code);

    overlayEl.querySelector("[data-party-leave]")?.addEventListener("click", leaveRoom);
    overlayEl.querySelector<HTMLButtonElement>("[data-party-copy-code]")?.addEventListener("click", (e) => {
      const code = (e.currentTarget as HTMLButtonElement).dataset.partyCopyCode || "";
      navigator.clipboard?.writeText(code).catch(() => undefined);
      showToast(t(`Copied room code ${code}!`, `คัดลอกรหัสห้อง ${code} แล้ว!`));
    });
    overlayEl.querySelector("[data-party-ready]")?.addEventListener("click", async () => {
      window.LearningHausSettings?.playTone?.("ready");
      const res = await apiFetch<{ room?: PartyRoomState }>(`/api/party/rooms/${encodeURIComponent(room.code)}/ready`, {
        method: "POST",
        body: "{}"
      });
      if (res.ok && res.data?.room) applyRoomSnapshot(res.data.room);
    });
    const updateBotCount = async (targetCount: number): Promise<void> => {
      const clamped = Math.max(0, Math.min(50, Math.round(targetCount) || 0));
      window.LearningHausSettings?.playTone?.("ready");
      const res = await apiFetch<{ room?: PartyRoomState }>(`/api/party/rooms/${encodeURIComponent(room.code)}/bots`, {
        method: "POST",
        body: JSON.stringify({ count: clamped })
      });
      if (res.ok && res.data?.room) applyRoomSnapshot(res.data.room);
    };
    overlayEl.querySelectorAll<HTMLButtonElement>("[data-party-bots]").forEach((btn) => {
      btn.addEventListener("click", () => {
        void updateBotCount(Number(btn.dataset.partyBots) || 0);
      });
    });
    const botInputEl = overlayEl.querySelector<HTMLInputElement>("[data-party-bot-input]");
    overlayEl.querySelector("[data-party-bot-apply]")?.addEventListener("click", () => {
      void updateBotCount(Number(botInputEl?.value) || 0);
    });
    botInputEl?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        void updateBotCount(Number(botInputEl.value) || 0);
      }
    });
    overlayEl.querySelector("[data-party-start]")?.addEventListener("click", async () => {
      window.LearningHausSettings?.playTone?.("start");
      const res = await apiFetch<{ room?: PartyRoomState }>(`/api/party/rooms/${encodeURIComponent(room.code)}/start`, {
        method: "POST",
        body: "{}"
      });
      if (res.ok && res.data?.room) applyRoomSnapshot(res.data.room);
    });

    if (room.status === "question" || room.status === "reveal") {
      mountActiveAnswerDock();
    }
  };

  const applyRoomSnapshot = (next: PartyRoomState): void => {
    const myId = window.LearningHausSocial?.currentUserId?.() || 0;
    const prevStatus = lastRoomStatus;
    const prevQ = lastQuestionIdxRendered;
    const me = next.players.find((p) => p.userId === myId);
    if (next.status === "reveal" && prevStatus !== "reveal") {
      catMood = me?.lastCorrect ? "happy" : "oops";
    } else if (next.status === "question" && prevQ !== next.questionIndex) {
      catMood = "idle";
      lastTickSec = -1;
      if (next.isDoublePoints) {
        window.LearningHausSettings?.playTone?.("double");
      }
    }
    if (next.status === "finished" && prevStatus !== "finished") {
      window.LearningHausSettings?.playTone?.("victory");
    }

    const answerSummary = next.players
      .map((p) => `${p.userId}:${p.score}:${p.answeredThisQ ? 1 : 0}:${p.hasCrown ? 1 : 0}:${p.ready ? 1 : 0}:${p.reaction || ""}`)
      .join("|");
    const renderKey = `${next.code}|${next.status}|${next.mode}|${next.questionIndex}|${next.isDoublePoints ? 1 : 0}|${next.players.length}|${answerSummary}`;
    currentRoom = next;
    lastRoomStatus = next.status;
    lastQuestionIdxRendered = next.questionIndex;
    syncPartyBgmForState();

    if (renderKey !== lastRenderedRoomKey) {
      lastRenderedRoomKey = renderKey;
      renderRoom();
    }
  };

  const leaveRoom = (): void => {
    stopLoops();
    currentRoom = null;
    screenMode = "hub";
    lastRenderedRoomKey = "";
    renderHub();
  };

  export const open = async (): Promise<void> => {
    overlayEl = document.querySelector<HTMLElement>("[data-party-arena]");
    if (!overlayEl) return;
    overlayEl.hidden = false;
    await loadPresetsFromServerOrLocal();
    if (currentRoom) {
      screenMode = "room";
      renderRoom();
      startRoomLoops();
    } else {
      screenMode = "hub";
      renderHub();
    }
    syncPartyBgmForState();
  };

  export const close = (): void => {
    stopLoops();
    if (overlayEl) overlayEl.hidden = true;
    window.LearningHausSettings?.setPartyBgm?.("off");
  };

  if (typeof window !== "undefined") {
    window.addEventListener("learninghaus:social-refresh", async () => {
      if (!overlayEl || overlayEl.hidden || screenMode !== "room" || !currentRoom) return;
      const res = await apiFetch<{ room?: PartyRoomState }>(`/api/party/rooms/${encodeURIComponent(currentRoom.code)}`);
      if (res.ok && res.data?.room) applyRoomSnapshot(res.data.room);
    });
  }
}

Object.assign(window, { LearningHausPartyArena });
