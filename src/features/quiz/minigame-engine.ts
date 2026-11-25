// Universal Subject-Agnostic Mini-Game Engine for Stages 2-9 inside #quiz-flow
namespace LearningHausMiniGameEngine {
  export type ReviewRecord = {
    question: string;
    selectedAnswer: string | null;
    correctAnswer: string;
    explanation: string;
    isCorrect: boolean;
    answeredCorrectly: boolean;
    madeMistake: boolean;
    timedOut: boolean;
    removedChoices: string[];
  };

  export type CompletionPayload = {
    correctCount: number;
    totalCount: number;
    reviews: ReviewRecord[];
  };

  export type MountOptions = {
    container: HTMLElement;
    level: LearningHausMiniGamePacks.MiniGameLevel;
    onFeedback: (isCorrect: boolean) => void;
    onComplete: (result: CompletionPayload) => void;
  };

  export type ActiveController = {
    destroy: () => void;
    finishOnTimeout: () => void;
    rerender: () => void;
  };

  const t = (en: string, th: string): string => LearningHausI18n.t(en, th);
  const bi = (v: LearningHausMiniGamePacks.BiText): string => LearningHausMiniGamePacks.text(v);

  const checkSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;
  const banSvg = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>`;

  const deterministicShuffle = <T>(items: readonly T[], seedOffset = 1): T[] => {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = (i * 7 + seedOffset * 3 + 1) % (i + 1);
      [out[i], out[j]] = [out[j], out[i]];
    }
    if (out.length > 1 && out[0] === items[0]) {
      const first = out.shift()!;
      out.push(first);
    }
    return out;
  };

  export const mount = (opts: MountOptions): ActiveController => {
    const { container, level, onFeedback, onComplete } = opts;
    let destroyed = false;
    let completed = false;
    let pendingTimer: number | null = null;

    const schedule = (fn: () => void, ms: number): void => {
      if (pendingTimer !== null) window.clearTimeout(pendingTimer);
      pendingTimer = window.setTimeout(() => {
        pendingTimer = null;
        if (!destroyed && !completed) fn();
      }, ms);
    };

    const emitDone = (payload: CompletionPayload): void => {
      if (completed || destroyed) return;
      completed = true;
      onComplete(payload);
    };

    let renderFn: () => void = () => {};
    let timeoutFn: () => void = () => emitDone({ correctCount: 0, totalCount: 1, reviews: [] });

    // ==================== 1. PAIR MATCH ====================
    if (level.kind === "matching") {
      const rightOrder = deterministicShuffle(level.pairs, 2);
      let selectedLeft: string | null = null;
      let selectedRight: string | null = null;
      const matched = new Set<string>();
      const missedIds = new Set<string>();
      let wrongPair: [string, string] | null = null;

      const tryPair = (lid: string, rid: string): void => {
        if (rid === lid) {
          matched.add(rid);
          selectedLeft = null;
          selectedRight = null;
          wrongPair = null;
          onFeedback(true);
          renderFn();
          if (matched.size === level.pairs.length) {
            const reviews = buildReviews(false);
            const correctCount = reviews.filter((r) => r.isCorrect).length;
            schedule(() => emitDone({ correctCount, totalCount: level.pairs.length, reviews }), 460);
          }
        } else {
          missedIds.add(lid);
          wrongPair = [lid, rid];
          selectedLeft = null;
          selectedRight = null;
          onFeedback(false);
          renderFn();
        }
      };

      const buildReviews = (timedOut = false): ReviewRecord[] =>
        level.pairs.map((p) => {
          const ok = matched.has(p.id);
          const clean = ok && !missedIds.has(p.id);
          return {
            question: bi(p.left),
            selectedAnswer: ok ? bi(p.right) : timedOut ? t("Timed out before matching.", "หมดเวลาก่อนจับคู่ครบ") : null,
            correctAnswer: bi(p.right),
            explanation: bi(p.explain),
            isCorrect: clean,
            answeredCorrectly: ok,
            madeMistake: missedIds.has(p.id),
            timedOut: timedOut && !ok,
            removedChoices: []
          };
        });

      renderFn = () => {
        container.innerHTML = `
          <div class="mg-shell">
            <p class="mg-instruction">${bi(level.instruction)}</p>
            <div class="mg-match-grid">
              <div class="mg-match-col">
                <span class="mg-col-label">${bi(level.leftLabel)}</span>
                ${level.pairs
                  .map(
                    (p) => `
                  <button class="mg-match-item${selectedLeft === p.id ? " is-selected" : ""}${matched.has(p.id) ? " is-matched" : ""}${wrongPair && wrongPair[0] === p.id ? " is-wrong" : ""}" type="button" data-mg-left="${p.id}" ${matched.has(p.id) ? "disabled" : ""}>
                    <span>${bi(p.left)}</span>
                    ${matched.has(p.id) ? checkSvg : ""}
                  </button>`
                  )
                  .join("")}
              </div>
              <div class="mg-match-col">
                <span class="mg-col-label">${bi(level.rightLabel)}</span>
                ${rightOrder
                  .map(
                    (p) => `
                  <button class="mg-match-item${selectedRight === p.id ? " is-selected" : ""}${matched.has(p.id) ? " is-matched" : ""}${wrongPair && wrongPair[1] === p.id ? " is-wrong" : ""}" type="button" data-mg-right="${p.id}" ${matched.has(p.id) ? "disabled" : ""}>
                    <span>${bi(p.right)}</span>
                    ${matched.has(p.id) ? checkSvg : ""}
                  </button>`
                  )
                  .join("")}
              </div>
            </div>
            <div class="mg-feedback${wrongPair ? " is-error" : ""}">
              <span>${
                wrongPair
                  ? t("Not a match. Try pairing another card.", "ยังไม่ตรงกัน ลองเลือกคู่ใหม่อีกครั้ง")
                  : selectedLeft
                    ? t("Now tap the matching card on the right.", "แตะเลือกการ์ดที่ตรงกันฝั่งขวาได้เลย")
                    : selectedRight
                      ? t("Now tap the matching card on the left.", "แตะเลือกการ์ดที่ตรงกันฝั่งซ้ายได้เลย")
                      : t(`Matched ${matched.size} / ${level.pairs.length} pairs.`, `จับคู่แล้ว ${matched.size} / ${level.pairs.length} คู่`)
              }</span>
            </div>
          </div>
        `;
        container.querySelectorAll<HTMLButtonElement>("[data-mg-left]").forEach((btn) => {
          btn.onclick = () => {
            const lid = btn.dataset.mgLeft || "";
            if (!lid || matched.has(lid)) return;
            wrongPair = null;
            if (selectedRight) {
              tryPair(lid, selectedRight);
            } else {
              selectedLeft = selectedLeft === lid ? null : lid;
              renderFn();
            }
          };
        });
        container.querySelectorAll<HTMLButtonElement>("[data-mg-right]").forEach((btn) => {
          btn.onclick = () => {
            const rid = btn.dataset.mgRight || "";
            if (!rid || matched.has(rid)) return;
            wrongPair = null;
            if (selectedLeft) {
              tryPair(selectedLeft, rid);
            } else {
              selectedRight = selectedRight === rid ? null : rid;
              renderFn();
            }
          };
        });
      };

      timeoutFn = () => {
        const reviews = buildReviews(true);
        emitDone({ correctCount: reviews.filter((r) => r.isCorrect).length, totalCount: level.pairs.length, reviews });
      };
    }

    // ==================== 2. RAPID STAMP ====================
    else if (level.kind === "binary-stamp") {
      let idx = 0;
      let lastPick: "left" | "right" | null = null;
      const reviews: ReviewRecord[] = [];

      renderFn = () => {
        const card = level.cards[idx];
        if (!card) return;
        const leftLabel = bi(level.leftStamp);
        const rightLabel = bi(level.rightStamp);
        const isCorrect = lastPick === card.answer;
        container.innerHTML = `
          <div class="mg-shell mg-shell--narrow">
            <p class="mg-instruction">${bi(level.instruction)}</p>
            <div class="mg-case-file">
              <div class="mg-case-meta">
                <span>${card.code}</span>
                <span>${t(`Card ${idx + 1} / ${level.cards.length}`, `ใบที่ ${idx + 1} / ${level.cards.length}`)}</span>
              </div>
              <h2 class="mg-case-title">${bi(card.title)}</h2>
              <p class="mg-case-desc">${bi(card.desc)}</p>
              <div class="mg-stamp${lastPick === "left" ? " is-left is-visible" : lastPick === "right" ? " is-right is-visible" : ""}">
                ${lastPick === "left" ? leftLabel : lastPick === "right" ? rightLabel : ""}
              </div>
            </div>
            <div class="mg-binary-actions">
              <button class="mg-binary-btn mg-binary-btn--left" type="button" data-mg-stamp="left" ${lastPick ? "disabled" : ""}>
                ${checkSvg}<span>${bi(level.leftButton)}</span>
              </button>
              <button class="mg-binary-btn mg-binary-btn--right" type="button" data-mg-stamp="right" ${lastPick ? "disabled" : ""}>
                ${banSvg}<span>${bi(level.rightButton)}</span>
              </button>
            </div>
            ${
              lastPick
                ? `<div class="mg-feedback ${isCorrect ? "is-win" : "is-error"}">
                     <span>${isCorrect ? t("Correct! ", "ถูกต้อง! ") : t("Not quite! ", "ยังไม่ถูก! ")}${bi(card.explain)}</span>
                     <button class="mg-next-btn" type="button" data-mg-next>${idx + 1 >= level.cards.length ? t("Finish →", "สรุปผล →") : t("Next Card →", "ใบถัดไป →")}</button>
                   </div>`
                : ""
            }
          </div>
        `;
        container.querySelectorAll<HTMLButtonElement>("[data-mg-stamp]").forEach((btn) => {
          btn.onclick = () => {
            if (lastPick) return;
            const pick = btn.dataset.mgStamp === "left" ? "left" : "right";
            lastPick = pick;
            const ok = pick === card.answer;
            onFeedback(ok);
            reviews[idx] = {
              question: `${bi(card.title)}: ${bi(card.desc)}`,
              selectedAnswer: pick === "left" ? leftLabel : rightLabel,
              correctAnswer: card.answer === "left" ? leftLabel : rightLabel,
              explanation: bi(card.explain),
              isCorrect: ok,
              answeredCorrectly: ok,
              madeMistake: !ok,
              timedOut: false,
              removedChoices: []
            };
            renderFn();
          };
        });
        const nextBtn = container.querySelector<HTMLButtonElement>("[data-mg-next]");
        if (nextBtn) {
          nextBtn.onclick = () => {
            idx += 1;
            lastPick = null;
            if (idx >= level.cards.length) {
              emitDone({ correctCount: reviews.filter((r) => r.isCorrect).length, totalCount: level.cards.length, reviews });
            } else {
              renderFn();
            }
          };
        }
      };

      timeoutFn = () => {
        const leftLabel = bi(level.leftStamp);
        const rightLabel = bi(level.rightStamp);
        for (let i = 0; i < level.cards.length; i += 1) {
          if (!reviews[i]) {
            const c = level.cards[i];
            reviews[i] = {
              question: `${bi(c.title)}: ${bi(c.desc)}`,
              selectedAnswer: null,
              correctAnswer: c.answer === "left" ? leftLabel : rightLabel,
              explanation: bi(c.explain),
              isCorrect: false,
              answeredCorrectly: false,
              madeMistake: true,
              timedOut: true,
              removedChoices: []
            };
          }
        }
        emitDone({ correctCount: reviews.filter((r) => r.isCorrect).length, totalCount: level.cards.length, reviews });
      };
    }

    // ==================== 3. CATEGORY SORT ====================
    else if (level.kind === "sorting") {
      let idx = 0;
      let wrongBucket = false;
      let missedCurrent = false;
      const placed: Record<string, typeof level.items[number][]> = {};
      level.buckets.forEach((b) => { placed[b.id] = []; });
      const reviews: ReviewRecord[] = [];
      const bucketTitleById = (id: string): string => {
        const b = level.buckets.find((x) => x.id === id);
        return b ? bi(b.title) : id;
      };

      renderFn = () => {
        const done = idx >= level.items.length;
        const cur = level.items[idx];
        container.innerHTML = `
          <div class="mg-shell">
            <p class="mg-instruction">${bi(level.instruction)}</p>
            <div class="mg-sort-tray">
              ${
                done
                  ? `<strong class="mg-sort-done">${t("All items sorted!", "คัดแยกครบทุกรายการแล้ว!")}</strong>`
                  : `<div class="mg-sort-card">
                       <small>${t(`Card ${idx + 1} / ${level.items.length}`, `การ์ด ${idx + 1} / ${level.items.length}`)}</small>
                       <strong>${bi(cur.name)}</strong>
                       <span>${bi(cur.hint)}</span>
                     </div>`
              }
            </div>
            <div class="mg-bucket-grid" style="--mg-cols:${Math.min(4, Math.max(2, level.buckets.length))};">
              ${level.buckets
                .map(
                  (b) => `
                <button class="mg-bucket tone-${b.tone}" type="button" data-mg-bucket="${b.id}" ${done ? "disabled" : ""}>
                  <h4>${bi(b.title)}</h4>
                  <small>${bi(b.subtitle)}</small>
                  <div class="mg-bucket-chips">
                    ${(placed[b.id] || []).map((it) => `<span class="mg-chip">${bi(it.name)}</span>`).join("")}
                  </div>
                </button>`
                )
                .join("")}
            </div>
            ${wrongBucket ? `<div class="mg-feedback is-error"><span>${t("Wrong group. Try another one.", "ยังไม่ใช่กล่องนี้ ลองเลือกหมวดหมู่อื่นดูนะ")}</span></div>` : ""}
          </div>
        `;
        container.querySelectorAll<HTMLButtonElement>("[data-mg-bucket]").forEach((btn) => {
          btn.onclick = () => {
            if (done || !cur) return;
            const pick = btn.dataset.mgBucket || "";
            if (pick === cur.bucketId) {
              placed[cur.bucketId].push(cur);
              reviews[idx] = {
                question: `${bi(cur.name)} (${bi(cur.hint)})`,
                selectedAnswer: bucketTitleById(pick),
                correctAnswer: bucketTitleById(cur.bucketId),
                explanation: bi(cur.explain),
                isCorrect: !missedCurrent,
                answeredCorrectly: true,
                madeMistake: missedCurrent,
                timedOut: false,
                removedChoices: []
              };
              idx += 1;
              wrongBucket = false;
              missedCurrent = false;
              onFeedback(true);
              renderFn();
              if (idx >= level.items.length) {
                schedule(
                  () => emitDone({ correctCount: reviews.filter((r) => r.isCorrect).length, totalCount: level.items.length, reviews }),
                  460
                );
              }
            } else {
              wrongBucket = true;
              missedCurrent = true;
              onFeedback(false);
              renderFn();
            }
          };
        });
      };

      timeoutFn = () => {
        for (let i = 0; i < level.items.length; i += 1) {
          if (!reviews[i]) {
            const it = level.items[i];
            reviews[i] = {
              question: `${bi(it.name)} (${bi(it.hint)})`,
              selectedAnswer: null,
              correctAnswer: bucketTitleById(it.bucketId),
              explanation: bi(it.explain),
              isCorrect: false,
              answeredCorrectly: false,
              madeMistake: true,
              timedOut: true,
              removedChoices: []
            };
          }
        }
        emitDone({ correctCount: reviews.filter((r) => r.isCorrect).length, totalCount: level.items.length, reviews });
      };
    }

    // ==================== 4. DECISION PATH ====================
    else if (level.kind === "scenario") {
      let stepIdx = 0;
      let meter = level.initialMeter;
      let lastNote = "";
      let lastGood = true;
      const reviews: ReviewRecord[] = [];

      renderFn = () => {
        const cur = level.steps[stepIdx];
        if (!cur) return;
        const pct = Math.max(0, Math.min(100, meter));
        container.innerHTML = `
          <div class="mg-shell mg-shell--narrow">
            <p class="mg-instruction">${bi(level.instruction)}</p>
            <div class="mg-meter">
              <strong>${bi(level.meterLabel)}</strong>
              <div class="mg-meter-track"><span style="width:${pct}%"></span></div>
              <b>${pct}%</b>
            </div>
            <div class="mg-scenario-card">
              <div class="mg-scenario-top">
                <span class="mg-speaker">${bi(cur.speaker)}</span>
                <span class="mg-step-pill">${t(`Step ${stepIdx + 1} / ${level.steps.length}`, `ขั้นที่ ${stepIdx + 1} / ${level.steps.length}`)}</span>
              </div>
              <p class="mg-scenario-prompt">${bi(cur.prompt)}</p>
            </div>
            <div class="mg-choices">
              ${cur.choices
                .map((ch, i) => `<button class="mg-choice-btn" type="button" data-mg-choice="${i}">${bi(ch.text)}</button>`)
                .join("")}
            </div>
            ${lastNote ? `<div class="mg-feedback ${lastGood ? "" : "is-error"}"><span>${lastNote}</span></div>` : ""}
          </div>
        `;
        container.querySelectorAll<HTMLButtonElement>("[data-mg-choice]").forEach((btn) => {
          btn.onclick = () => {
            const pick = cur.choices[Number(btn.dataset.mgChoice)];
            if (!pick) return;
            const best = cur.choices.find((c) => c.isBest) || cur.choices[0];
            meter = Math.max(0, Math.min(100, meter + pick.delta));
            lastGood = pick.isBest;
            lastNote = bi(pick.note);
            onFeedback(pick.isBest);
            reviews[stepIdx] = {
              question: bi(cur.prompt),
              selectedAnswer: bi(pick.text),
              correctAnswer: bi(best.text),
              explanation: bi(pick.note),
              isCorrect: pick.isBest,
              answeredCorrectly: pick.isBest,
              madeMistake: !pick.isBest,
              timedOut: false,
              removedChoices: []
            };
            stepIdx += 1;
            if (stepIdx >= level.steps.length) {
              schedule(
                () => emitDone({ correctCount: reviews.filter((r) => r.isCorrect).length, totalCount: level.steps.length, reviews }),
                420
              );
            } else {
              renderFn();
            }
          };
        });
      };

      timeoutFn = () => {
        for (let i = 0; i < level.steps.length; i += 1) {
          if (!reviews[i]) {
            const st = level.steps[i];
            const best = st.choices.find((c) => c.isBest) || st.choices[0];
            reviews[i] = {
              question: bi(st.prompt),
              selectedAnswer: null,
              correctAnswer: bi(best.text),
              explanation: bi(best.note),
              isCorrect: false,
              answeredCorrectly: false,
              madeMistake: true,
              timedOut: true,
              removedChoices: []
            };
          }
        }
        emitDone({ correctCount: reviews.filter((r) => r.isCorrect).length, totalCount: level.steps.length, reviews });
      };
    }

    // ==================== 5. RAPID BLITZ ====================
    else if (level.kind === "true-false-sprint") {
      let idx = 0;
      let combo = 0;
      let lastMsg = "";
      let lastOk = true;
      const reviews: ReviewRecord[] = [];
      const trueLabel = level.trueLabel ? bi(level.trueLabel) : t("TRUE", "จริง (TRUE)");
      const falseLabel = level.falseLabel ? bi(level.falseLabel) : t("FALSE", "เท็จ (FALSE)");

      renderFn = () => {
        const stmt = level.statements[idx];
        if (!stmt) return;
        container.innerHTML = `
          <div class="mg-shell mg-shell--narrow">
            <p class="mg-instruction">${bi(level.instruction)}</p>
            <div class="mg-blitz-card">
              <span class="mg-combo-pill">${t(`Combo x${Math.max(1, combo)} · Statement ${idx + 1} / ${level.statements.length}`, `คอมโบ x${Math.max(1, combo)} · ข้อที่ ${idx + 1} / ${level.statements.length}`)}</span>
              <h2 class="mg-blitz-text">${bi(stmt.text)}</h2>
              <div class="mg-binary-actions">
                <button class="mg-binary-btn mg-binary-btn--left" type="button" data-mg-tf="true">${checkSvg}<span>${trueLabel}</span></button>
                <button class="mg-binary-btn mg-binary-btn--right" type="button" data-mg-tf="false">${banSvg}<span>${falseLabel}</span></button>
              </div>
              ${lastMsg ? `<div class="mg-feedback ${lastOk ? "is-win" : "is-error"}"><span>${lastMsg}</span></div>` : ""}
            </div>
          </div>
        `;
        container.querySelectorAll<HTMLButtonElement>("[data-mg-tf]").forEach((btn) => {
          btn.onclick = () => {
            const pick = btn.dataset.mgTf === "true";
            const ok = pick === stmt.isTrue;
            combo = ok ? combo + 1 : 0;
            lastOk = ok;
            lastMsg = ok
              ? t(`Correct! Combo x${combo}`, `ถูกต้อง! คอมโบ x${combo}`)
              : t(`Oops! ${bi(stmt.explain)}`, `พลาดนิดหน่อย: ${bi(stmt.explain)}`);
            onFeedback(ok);
            reviews[idx] = {
              question: bi(stmt.text),
              selectedAnswer: pick ? trueLabel : falseLabel,
              correctAnswer: stmt.isTrue ? trueLabel : falseLabel,
              explanation: bi(stmt.explain),
              isCorrect: ok,
              answeredCorrectly: ok,
              madeMistake: !ok,
              timedOut: false,
              removedChoices: []
            };
            idx += 1;
            if (idx >= level.statements.length) {
              schedule(
                () => emitDone({ correctCount: reviews.filter((r) => r.isCorrect).length, totalCount: level.statements.length, reviews }),
                420
              );
            } else {
              renderFn();
            }
          };
        });
      };

      timeoutFn = () => {
        for (let i = 0; i < level.statements.length; i += 1) {
          if (!reviews[i]) {
            const st = level.statements[i];
            reviews[i] = {
              question: bi(st.text),
              selectedAnswer: null,
              correctAnswer: st.isTrue ? trueLabel : falseLabel,
              explanation: bi(st.explain),
              isCorrect: false,
              answeredCorrectly: false,
              madeMistake: true,
              timedOut: true,
              removedChoices: []
            };
          }
        }
        emitDone({ correctCount: reviews.filter((r) => r.isCorrect).length, totalCount: level.statements.length, reviews });
      };
    }

    // ==================== 6. SPOT THE CLUES ====================
    else if (level.kind === "inspector") {
      const targets = level.hotspots.filter((h) => h.isTarget);
      const found = new Set<string>();
      const falseClicks = new Set<string>();

      const buildReviews = (timedOut = false): ReviewRecord[] =>
        targets.map((tg) => {
          const hit = found.has(tg.id);
          return {
            question: `${bi(tg.title)}: ${bi(tg.desc)}`,
            selectedAnswer: hit
              ? t("Flagged correctly", "จับผิดถูกต้อง")
              : timedOut
                ? t("Missed before time ran out", "ยังไม่พบก่อนหมดเวลา")
                : null,
            correctAnswer: t("Target violation / clue", "จุดผิด / จุดสำคัญที่ต้องจับให้ได้"),
            explanation: bi(tg.explain),
            isCorrect: hit && falseClicks.size === 0,
            answeredCorrectly: hit,
            madeMistake: falseClicks.size > 0 || !hit,
            timedOut: timedOut && !hit,
            removedChoices: []
          };
        });

      renderFn = () => {
        container.innerHTML = `
          <div class="mg-shell">
            <p class="mg-instruction">${bi(level.instruction)}</p>
            <div class="mg-spec">
              <div class="mg-spec-bar">
                <span>${bi(level.artifactTitle)}</span>
                <span>${bi(level.goalLabel)} (${found.size}/${targets.length})</span>
              </div>
              <div class="mg-spec-grid">
                ${level.hotspots
                  .map(
                    (sp) => `
                  <button class="mg-hotspot${found.has(sp.id) ? " is-target-found" : ""}${falseClicks.has(sp.id) ? " is-safe-click" : ""}" type="button" data-mg-spot="${sp.id}" ${found.has(sp.id) || falseClicks.has(sp.id) ? "disabled" : ""}>
                    <strong>${bi(sp.title)}</strong>
                    <span>${bi(sp.desc)}</span>
                  </button>`
                  )
                  .join("")}
              </div>
            </div>
            <div class="mg-feedback${falseClicks.size > 0 ? " is-error" : ""}">
              <span>${t(
                `Found ${found.size} of ${targets.length} clues${falseClicks.size > 0 ? ` · ${falseClicks.size} safe item(s) tapped` : ""}.`,
                `พบแล้ว ${found.size} จาก ${targets.length} จุด${falseClicks.size > 0 ? ` · กดโดนจุดปกติ ${falseClicks.size} ครั้ง` : ""}`
              )}</span>
            </div>
          </div>
        `;
        container.querySelectorAll<HTMLButtonElement>("[data-mg-spot]").forEach((btn) => {
          btn.onclick = () => {
            const sp = level.hotspots.find((h) => h.id === btn.dataset.mgSpot);
            if (!sp) return;
            if (sp.isTarget) {
              found.add(sp.id);
              onFeedback(true);
              renderFn();
              if (found.size === targets.length) {
                const reviews = buildReviews(false);
                const cleanScore = Math.max(1, targets.length - falseClicks.size);
                schedule(() => emitDone({ correctCount: Math.min(targets.length, cleanScore), totalCount: targets.length, reviews }), 480);
              }
            } else {
              falseClicks.add(sp.id);
              onFeedback(false);
              renderFn();
            }
          };
        });
      };

      timeoutFn = () => {
        const reviews = buildReviews(true);
        const score = Math.max(0, found.size - falseClicks.size);
        emitDone({ correctCount: score, totalCount: targets.length, reviews });
      };
    }

    // ==================== 7. STEP SEQUENCE ====================
    else if (level.kind === "order-steps") {
      const sorted = [...level.steps].sort((a, b) => a.rank - b.rank);
      const shuffled = deterministicShuffle(sorted, 3);
      const chosen: typeof sorted = [];
      const missedRanks = new Set<number>();
      let wrongPick = false;

      const buildReviews = (timedOut = false): ReviewRecord[] =>
        sorted.map((st, i) => {
          const placed = Boolean(chosen[i]);
          const clean = placed && !missedRanks.has(st.rank);
          return {
            question: t(`Step ${st.rank}`, `ขั้นที่ ${st.rank}`),
            selectedAnswer: placed ? bi(chosen[i].label) : timedOut ? t("Timed out", "หมดเวลา") : null,
            correctAnswer: bi(st.label),
            explanation: bi(st.explain),
            isCorrect: clean,
            answeredCorrectly: placed,
            madeMistake: missedRanks.has(st.rank),
            timedOut: timedOut && !placed,
            removedChoices: []
          };
        });

      renderFn = () => {
        container.innerHTML = `
          <div class="mg-shell">
            <p class="mg-instruction">${bi(level.instruction)}</p>
            <div class="mg-order-slots">
              ${sorted
                .map(
                  (_, i) => `
                <div class="mg-order-slot${chosen[i] ? " is-filled" : ""}">
                  <small>${t(`Step ${i + 1}`, `ขั้นที่ ${i + 1}`)}</small>
                  <span>${chosen[i] ? bi(chosen[i].label) : t("Tap next step...", "แตะเลือกขั้นต่อไป...")}</span>
                </div>`
                )
                .join("")}
            </div>
            <div class="mg-order-pool">
              ${shuffled
                .map((st) => {
                  const used = chosen.some((c) => c.rank === st.rank);
                  return `<button class="mg-order-tile" type="button" data-mg-rank="${st.rank}" ${used ? "disabled" : ""}>${bi(st.label)}</button>`;
                })
                .join("")}
            </div>
            <div class="mg-feedback${wrongPick ? " is-error" : ""}">
              <span>${
                wrongPick
                  ? t("Wrong order. Think about what comes next.", "ลำดับยังไม่ถูก ลองคิดว่าขั้นไหนต้องทำต่อเป็นอันดับถัดไป")
                  : t(`Placed ${chosen.length} / ${sorted.length} steps in order.`, `เรียงลำดับแล้ว ${chosen.length} / ${sorted.length} ขั้นตอน`)
              }</span>
            </div>
          </div>
        `;
        container.querySelectorAll<HTMLButtonElement>("[data-mg-rank]").forEach((btn) => {
          btn.onclick = () => {
            const rank = Number(btn.dataset.mgRank);
            const expected = sorted[chosen.length];
            if (!expected) return;
            if (rank === expected.rank) {
              chosen.push(expected);
              wrongPick = false;
              onFeedback(true);
              renderFn();
              if (chosen.length === sorted.length) {
                const reviews = buildReviews(false);
                schedule(
                  () => emitDone({ correctCount: reviews.filter((r) => r.isCorrect).length, totalCount: sorted.length, reviews }),
                  460
                );
              }
            } else {
              missedRanks.add(expected.rank);
              wrongPick = true;
              onFeedback(false);
              renderFn();
            }
          };
        });
      };

      timeoutFn = () => {
        const reviews = buildReviews(true);
        emitDone({ correctCount: reviews.filter((r) => r.isCorrect).length, totalCount: sorted.length, reviews });
      };
    }

    renderFn();

    return {
      destroy: () => {
        destroyed = true;
        if (pendingTimer !== null) window.clearTimeout(pendingTimer);
        container.replaceChildren();
      },
      finishOnTimeout: () => {
        if (!completed && !destroyed) timeoutFn();
      },
      rerender: () => {
        if (!destroyed && !completed) renderFn();
      }
    };
  };
}

Object.assign(window, { LearningHausMiniGameEngine });
