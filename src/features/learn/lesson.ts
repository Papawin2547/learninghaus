// ส่วนนี้ทำหน้าที่: เปิดบทเรียน วิดีโอ และพื้นที่ความคิดเห็น
(() => {
  type CommentReply = {
    author: string;
    avatar: string;
    text: string;
    mine: boolean;
  };

  type LessonComment = {
    author: string;
    avatar: string;
    text: string;
    liked: boolean;
    replies: CommentReply[];
  };

  const initLessonPage = (): void => {
    const home = document.querySelector<HTMLElement>("#home-view");
    const page = home?.querySelector<HTMLElement>('[data-home-panel="lesson"]');
    if (!home || !page) return;

    const title = page.querySelector<HTMLElement>("[data-lesson-title]");
    const chapterPill = page.querySelector<HTMLElement>("[data-lesson-chapter-pill]");
    const commentCountBadge = page.querySelector<HTMLElement>("[data-lesson-comment-count]");
    const description = page.querySelector<HTMLElement>("[data-lesson-description]");
    const poster = page.querySelector<HTMLElement>("[data-lesson-poster]");
    const posterImage = page.querySelector<HTMLImageElement>("[data-lesson-poster-image]");
    const play = page.querySelector<HTMLAnchorElement>("[data-lesson-play]");
    const frame = page.querySelector<HTMLIFrameElement>("[data-lesson-frame]");
    const youtubeWrapper = page.querySelector<HTMLElement>("[data-lesson-youtube-wrapper]");
    const localVideo = page.querySelector<HTMLVideoElement>("[data-lesson-video]");
    const next = page.querySelector<HTMLButtonElement>("[data-lesson-next]");
    const favorite = page.querySelector<HTMLButtonElement>("[data-lesson-favorite]");
    const share = page.querySelector<HTMLButtonElement>("[data-lesson-share]");
    const mediaStatus = page.querySelector<HTMLElement>("[data-lesson-media-status]");
    const feedback = page.querySelector<HTMLElement>("[data-lesson-feedback]");
    const form = page.querySelector<HTMLFormElement>("[data-lesson-comment-form]");
    const commentsList = page.querySelector<HTMLElement>("[data-lesson-comments]");
    const chat = page.querySelector<HTMLElement>("[data-lesson-chat]");
    const chatThread = page.querySelector<HTMLElement>("[data-lesson-chat-thread]");
    const chatCount = page.querySelector<HTMLElement>("[data-lesson-chat-count]");
    const chatForm = page.querySelector<HTMLFormElement>("[data-lesson-chat-form]");
    const chatCloseButton = page.querySelector<HTMLButtonElement>("[data-lesson-chat-close]");

    if (
      !title ||
      !description ||
      !poster ||
      !posterImage ||
      !play ||
      !frame ||
      !youtubeWrapper ||
      !localVideo ||
      !next ||
      !favorite ||
      !share ||
      !mediaStatus ||
      !feedback ||
      !form ||
      !commentsList ||
      !chat ||
      !chatThread ||
      !chatCount ||
      !chatForm ||
      !chatCloseButton
    ) {
      return;
    }

    const heartIcon = LearningHausIcons.svg("heart");
    const chapterData = [
      {
        title: "Chapter 1 - Foundations & Scope",
        titleTh: "บทที่ 1 - พื้นฐานและขอบเขตของกฎหมาย AI",
        paragraphs: [
          "This document discusses the foundations and scope of digital law, focusing on a comparison between the EU AI Act, which regulates risks and artificial intelligence systems, and the PDPA, which protects personal data. Both laws have extraterritorial applicability, covering organizations or outcomes across borders, regardless of whether they are located in the European Union or Thailand. Furthermore, the document defines key terminology to differentiate the roles and responsibilities of stakeholders, such as providers (software developers) and deployers (system users), and promotes technological awareness or AI literacy."
        ],
        paragraphsTh: [
          "บทเรียนนี้อธิบายพื้นฐานและขอบเขตของกฎหมายดิจิทัล โดยเปรียบเทียบระหว่างกฎหมาย EU AI Act ที่กำกับดูแลความเสี่ยงของระบบปัญญาประดิษฐ์ กับกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA) ซึ่งกฎหมายทั้งสองฉบับมีผลบังคับใช้ข้ามพรมแดนครอบคลุมองค์กรหรือผลกระทบที่เกิดขึ้น ไม่ว่าจะตั้งอยู่ในสหภาพยุโรปหรือประเทศไทย พร้อมนิยามคำศัพท์สำคัญเพื่อแยกบทบาทและความรับผิดชอบของผู้พัฒนา (Provider) และผู้ใช้งานระบบ (Deployer) รวมถึงการส่งเสริมความรู้เท่าทัน AI (AI Literacy)"
        ]
      },
      {
        title: "Chapter 2 - Prohibited AI Practices",
        titleTh: "บทที่ 2 - แนวทางปฏิบัติ AI ที่ต้องห้าม",
        paragraphs: [
          "Learn the strict red lines of the EU AI Act, which ban AI practices with unacceptable risk. In this chapter, you will see what is banned under Article 5 (such as manipulative AI, social scoring, and restricted biometric uses), spot tricky edge cases, and see how these rules connect with personal data protection (PDPA)."
        ],
        paragraphsTh: [
          "เรียนรู้ข้อห้ามเด็ดขาดของ EU AI Act ที่ห้ามการใช้ AI ซึ่งก่อให้เกิดความเสี่ยงระดับไม่อาจยอมรับได้ ตามมาตรา 5 เช่น AI ที่ชักจูงจิตใจ การให้คะแนนทางสังคม (Social Scoring) และการใช้ข้อมูลชีวมิติที่ถูกจำกัด พร้อมสังเกตกรณีศึกษาที่ซับซ้อนและดูความเชื่อมโยงกับกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)"
        ]
      },
      {
        title: "Chapter 3 - High-Risk AI Systems",
        titleTh: "บทที่ 3 - ระบบ AI ความเสี่ยงสูง",
        paragraphs: [
          "Learn how the EU AI Act handles AI systems with high risks to people's safety, rights, and life choices, such as tools that screen, rank, or match job candidates. In this chapter, you will see how high-risk systems are grouped under Chapter III and Annex III, what strict rules they must follow (including risk checks, data quality, technical records, and human review), and the main duties of providers and deployers."
        ],
        paragraphsTh: [
          "ทำความเข้าใจวิธีที่ EU AI Act กำกับดูแลระบบ AI ความเสี่ยงสูงที่กระทบต่อความปลอดภัย สิทธิ และโอกาสในชีวิตของประชาชน เช่น ระบบคัดกรองและจัดอันดับผู้สมัครงาน พร้อมเรียนรู้การจัดกลุ่มตามหมวด III และภาคผนวก III รวมถึงข้อกำหนดเข้มงวดด้านการประเมินความเสี่ยง คุณภาพข้อมูล เอกสารทางเทคนิค การควบคุมโดยมนุษย์ และหน้าที่หลักของผู้พัฒนาและผู้ใช้งาน"
        ]
      },
      {
        title: "Chapter 4 - Transparency for Specific AI Systems",
        titleTh: "บทที่ 4 - ความโปร่งใสสำหรับระบบ AI เฉพาะทาง",
        paragraphs: [
          "Learn the transparency rules under Chapter IV (Article 50) of the EU AI Act, which help people know when they are talking to AI or viewing AI-made content. In this chapter, you will learn the main notice duties for providers and deployers, including telling users about AI chatbots, labeling synthetic media, and marking deepfakes, along with key exceptions and how these rules fit with PDPA notices."
        ],
        paragraphsTh: [
          "เรียนรู้หลักเกณฑ์ความโปร่งใสภายใต้หมวด IV (มาตรา 50) ของ EU AI Act เพื่อให้ผู้ใช้รู้ตัวเมื่อกำลังโต้ตอบกับ AI หรือรับชมสื่อที่สร้างโดย AI รวมถึงหน้าที่แจ้งเตือนสำหรับแชทบอท การติดฉลากสื่อสังเคราะห์ และ Deepfake ตลอดจนข้อยกเว้นสำคัญและความสอดคล้องกับการแจ้งเตือนข้อมูลส่วนบุคคลตาม PDPA"
        ]
      },
      {
        title: "Chapter 5 - General-Purpose AI Models (GPAI)",
        titleTh: "บทที่ 5 - โมเดล AI วัตถุประสงค์ทั่วไป (GPAI)",
        paragraphs: [
          "Dive into Chapter V of the EU AI Act to understand how versatile, large-scale AI models are regulated. In this chapter, you will explore the difference between standard GPAI models and models posing systemic risks, the core transparency and documentation duties for providers (Articles 53–55), how the Code of Practice helps developers meet compliance requirements, and how training data rules connect with personal data protection (PDPA)."
        ],
        paragraphsTh: [
          "เจาะลึกหมวด V ของ EU AI Act เพื่อทำความเข้าใจการกำกับดูแลโมเดล AI ขนาดใหญ่ที่ใช้งานได้หลากหลาย (GPAI) โดยเปรียบเทียบระหว่างโมเดล GPAI ทั่วไปกับโมเดลที่มีความเสี่ยงเชิงระบบ หน้าที่ด้านเอกสารและความโปร่งใสของผู้พัฒนา (มาตรา 53–55) บทบาทของแนวปฏิบัติ Code of Practice และความเชื่อมโยงระหว่างข้อมูลที่ใช้ฝึกสอนโมเดลกับ PDPA"
        ]
      },
      {
        title: "Chapter 6 - Supporting Innovation & Small Businesses",
        titleTh: "บทที่ 6 - การส่งเสริมนวัตกรรมและธุรกิจขนาดเล็ก",
        paragraphs: [
          "Discover how Chapter VI (Articles 57–63) of the EU AI Act supports responsible AI development without stifling innovation. In this chapter, you will learn how AI regulatory sandboxes provide a supervised space to build and test new systems, the strict safeguards required for real-world testing of high-risk AI (such as informed consent and human oversight), dedicated support measures for SMEs and start-ups, and how sandbox data use aligns with personal data protection (PDPA)."
        ],
        paragraphsTh: [
          "สำรวจแนวทางตามหมวด VI (มาตรา 57–63) ของ EU AI Act ที่สนับสนุนการพัฒนา AI อย่างรับผิดชอบโดยไม่ปิดกั้นนวัตกรรม ตั้งแต่สนามทดสอบ AI Regulatory Sandbox มาตรการคุ้มครองสำหรับการทดสอบในสภาพแวดล้อมจริง (เช่น ความยินยอมและการกำกับดูแลโดยมนุษย์) มาตรการช่วยเหลือ SME และสตาร์ตอัป ไปจนถึงการใช้ข้อมูลใน Sandbox ให้สอดคล้องกับ PDPA"
        ]
      },
      {
        title: "Chapter 7 - Governance & Who Is in Charge?",
        titleTh: "บทที่ 7 - ธรรมาภิบาลและผู้มีอำนาจกำกับดูแล",
        paragraphs: [
          "Discover who enforces the rules of the EU AI Act under Chapter VII (Articles 64–70). In this chapter, you will explore the two-tier governance structure—comparing Union-level institutions (the European AI Office, Artificial Intelligence Board, Advisory Forum, and Scientific Panel) with national competent authorities across Member States—and see how AI oversight coordinates with personal data protection regulators (PDPA)."
        ],
        paragraphsTh: [
          "รู้จักหน่วยงานผู้บังคับใช้กฎหมายตามหมวด VII (มาตรา 64–70) ของ EU AI Act ผ่านโครงสร้างการกำกับดูแลแบบสองระดับ ระหว่างหน่วยงานระดับสหภาพยุโรป (European AI Office, AI Board, Advisory Forum และคณะผู้เชี่ยวชาญวิทยาศาสตร์) กับหน่วยงานผู้มีอำนาจระดับประเทศสมาชิก รวมถึงการประสานงานกับหน่วยงานคุ้มครองข้อมูลส่วนบุคคล (PDPA)"
        ]
      },
      {
        title: "Chapter 8 - Your Rights & Enforcement",
        titleTh: "บทที่ 8 - สิทธิของประชาชนและการบังคับใช้กฎหมาย",
        paragraphs: [
          "Discover how the EU AI Act empowers individuals and enforces accountability under Chapters IX and XII. In this chapter, you will explore your core legal remedies—including the right to lodge a complaint, the right to an explanation for high-risk AI decisions, and whistleblower protections—alongside post-market monitoring, serious incident reporting, tiered administrative fines, and how personal data protection rights and liabilities (PDPA) apply in parallel."
        ],
        paragraphsTh: [
          "เรียนรู้สิทธิของบุคคลและกลไกการบังคับใช้กฎหมายภายใต้หมวด IX และ XII ของ EU AI Act ทั้งสิทธิในการร้องเรียน สิทธิในการขอคำอธิบายจากการตัดสินใจของ AI ความเสี่ยงสูง และการคุ้มครองผู้แจ้งเบาะแส ควบคู่กับการติดตามผลหลังออกสู่ตลาด การรายงานเหตุการณ์ร้ายแรง ค่าปรับทางปกครองแบบขั้นบันได และสิทธิความรับผิดตามกฎหมาย PDPA"
        ]
      }
    ];

    const localVideoByChapter: Record<number, string> = {
      1: "lesson-assets/chapter-1-video.mp4",
      2: "lesson-assets/chapter-2-video.mp4",
      3: "lesson-assets/chapter-3-video.mp4",
      4: "lesson-assets/chapter-4-video.mp4",
      5: "lesson-assets/chapter-5-video.mp4",
      6: "lesson-assets/chapter-6-video.mp4",
      7: "lesson-assets/chapter-7-video.mp4",
      8: "lesson-assets/chapter-8-video.mp4"
    };
    const videoIds: string[] = Array(chapterData.length).fill("X6FbK-rhca0");
    const resolveCommentAvatar = (author: string, rawAvatar: string, mine = false): string => {
      const clean = String(rawAvatar || "").trim();
      if (clean && !clean.includes("Profire/PF0")) return clean;
      if (mine || author.toUpperCase() === "TONOAK" || author.toUpperCase() === "YOU") {
        return window.LearningHausProfile?.getProfile?.()?.avatar || window.LearningHausPixelCat?.getActiveAvatarDataUrl?.() || "";
      }
      return window.LearningHausPixelCat?.getNpcAvatarDataUrl?.(author) || "";
    };

    const comments: LessonComment[][] = chapterData.map(() => []);

    const VIDEO_WATCHED_KEY = "learninghaus.videoWatched.v1";
    const readWatchedMap = (): Record<string, boolean> =>
      LearningHausAccountStorage.readJson<Record<string, boolean>>(VIDEO_WATCHED_KEY, {});
    const isChapterVideoFinished = (chapter: number): boolean => Boolean(readWatchedMap()[`eu-ai-act:${chapter}`]);
    const saveChapterVideoFinished = (chapter: number): void => {
      const map = readWatchedMap();
      map[`eu-ai-act:${chapter}`] = true;
      LearningHausAccountStorage.writeJson(VIDEO_WATCHED_KEY, map);
    };

    const favorites = new Set<number>();
    let activeChapter = 1;
    let activeCommentIndex: number | null = null;
    let youtubeApiPromise: Promise<NonNullable<Window["YT"]>> | null = null;
    let lessonYoutubePlayer: LearningHausTypes.YouTubePlayer | null = null;
    let localMaxWatched = 0;
    let ytMaxWatched = 0;
    let ytSeekGuardTimer: number | null = null;

    const stopYtSeekGuard = (): void => {
      if (ytSeekGuardTimer !== null) {
        window.clearInterval(ytSeekGuardTimer);
        ytSeekGuardTimer = null;
      }
    };

    const startYtSeekGuard = (chapter: number): void => {
      stopYtSeekGuard();
      ytMaxWatched = 0;
      if (isChapterVideoFinished(chapter)) return;
      ytSeekGuardTimer = window.setInterval(() => {
        if (!lessonYoutubePlayer || youtubeWrapper.hidden || activeChapter !== chapter) {
          stopYtSeekGuard();
          return;
        }
        if (isChapterVideoFinished(chapter)) {
          stopYtSeekGuard();
          return;
        }
        try {
          const cur = Number(lessonYoutubePlayer.getCurrentTime?.() || 0);
          const state = Number(lessonYoutubePlayer.getPlayerState?.() ?? -1);
          if (cur > ytMaxWatched + 2.0) {
            lessonYoutubePlayer.seekTo?.(ytMaxWatched, true);
            mediaStatus.textContent = LearningHausI18n.t(
              "Watch the video to the end once before skipping the timeline. You can still pause or rewind anytime.",
              "กรุณาดูวิดีโอให้จบอย่างน้อย 1 ครั้งก่อนจึงจะข้าม Timeline ได้ (กดหยุดหรือย้อนกลับได้ตามปกติ)"
            );
            return;
          }
          if (state === 1 && cur > ytMaxWatched && cur - ytMaxWatched <= 2.0) {
            ytMaxWatched = cur;
          }
        } catch {
          // Player may not be ready yet.
        }
      }, 350);
    };

    const loadYouTubeApi = (): Promise<NonNullable<Window["YT"]>> => {
      if (window.YT?.Player) return Promise.resolve(window.YT);
      if (!youtubeApiPromise) {
        youtubeApiPromise = new Promise<NonNullable<Window["YT"]>>((resolve, reject) => {
          const previousReady = window.onYouTubeIframeAPIReady;
          window.onYouTubeIframeAPIReady = () => {
            if (typeof previousReady === "function") previousReady();
            if (window.YT) resolve(window.YT);
            else reject(new Error("YouTube player API did not initialize"));
          };
          const script = document.createElement("script");
          script.src = "https://www.youtube.com/iframe_api";
          script.onerror = () => reject(new Error("YouTube player API could not load"));
          document.head.append(script);
        }).catch((error) => {
          youtubeApiPromise = null;
          throw error;
        });
      }
      return youtubeApiPromise;
    };

    const markChapterVideoWatched = (): void => {
      if (activeChapter < 1 || activeChapter > chapterData.length || page.hidden) return;
      saveChapterVideoFinished(activeChapter);
      stopYtSeekGuard();
      window.LearningHausSocial?.trackEvent?.("video_complete", `chapter-${activeChapter}`, { chapter: activeChapter });
      window.dispatchEvent(new CustomEvent("learninghaus:chapter-video-ended", { detail: { chapter: activeChapter } }));
      mediaStatus.textContent =
        activeChapter === 1
          ? LearningHausI18n.t(
              "Chapter 1 video completed. Stage 1 is ready in Quiz, and timeline seeking is now unlocked.",
              "ดูวิดีโอบทที่ 1 จบแล้ว ด่านที่ 1 พร้อมเล่นใน Quiz และสามารถข้าม Timeline วิดีโอได้แล้ว"
            )
          : LearningHausI18n.t(
              `Chapter ${activeChapter} video completed. Stage ${(activeChapter - 1) * 10 + 1} is now unlocked in Quiz, and timeline seeking is unlocked.`,
              `ดูวิดีโอบทที่ ${activeChapter} จบแล้ว ด่านที่ ${(activeChapter - 1) * 10 + 1} ปลดล็อกใน Quiz และสามารถข้าม Timeline วิดีโอได้แล้ว`
            );
    };

    const closeVideo = (): void => {
      stopYtSeekGuard();
      localMaxWatched = 0;
      localVideo.pause();
      localVideo.hidden = true;
      localVideo.removeAttribute("src");
      localVideo.load();
      if (lessonYoutubePlayer && !youtubeWrapper.hidden) {
        try {
          lessonYoutubePlayer.stopVideo?.();
        } catch {
          // The player may still be loading.
        }
      }
      youtubeWrapper.hidden = true;
      frame.removeAttribute("src");
      frame.hidden = true;
      poster.hidden = false;
      mediaStatus.textContent = "";
    };

    const renderComments = (): void => {
      const chapterComments = comments[activeChapter - 1] || [];
      if (commentCountBadge) {
        commentCountBadge.textContent = LearningHausI18n.t(
          `${chapterComments.length} ${chapterComments.length === 1 ? "Comment" : "Comments"}`,
          `${chapterComments.length} ความคิดเห็น`
        );
      }
      commentsList.replaceChildren();
      if (!chapterComments.length) {
        const empty = document.createElement("li");
        empty.className = "lesson-studio__comment-empty";
        empty.textContent = LearningHausI18n.t(
          "No comments yet. Start the discussion for this chapter!",
          "ยังไม่มีความคิดเห็นในบทนี้ ลองเริ่มพูดคุยเป็นคนแรกได้เลย!"
        );
        commentsList.append(empty);
        return;
      }
      chapterComments.forEach((comment, index) => {
        const row = document.createElement("li");
        row.className = "lesson-studio__comment-item";
        const avatar = document.createElement("img");
        avatar.className = "lesson-page__avatar";
        avatar.src = resolveCommentAvatar(comment.author, comment.avatar);
        avatar.alt = `${comment.author} avatar`;

        const body = document.createElement("div");
        body.className = "lesson-studio__comment-body";

        const meta = document.createElement("div");
        meta.className = "lesson-studio__comment-meta";
        const authorName = document.createElement("strong");
        authorName.textContent = comment.author;
        meta.append(authorName);

        const bubble = document.createElement("p");
        bubble.className = "lesson-page__comment-text";
        bubble.textContent = comment.text;

        const actions = document.createElement("div");
        actions.className = "lesson-page__comment-actions";

        const like = document.createElement("button");
        like.type = "button";
        like.className = "lesson-page__comment-like";
        like.dataset.lessonCommentLike = String(index);
        like.setAttribute(
          "aria-label",
          comment.liked ? LearningHausI18n.t("Unlike comment", "เลิกถูกใจความคิดเห็น") : LearningHausI18n.t("Like comment", "ถูกใจความคิดเห็น")
        );
        like.setAttribute("aria-pressed", String(comment.liked));
        like.innerHTML = heartIcon;

        const openChat = document.createElement("button");
        openChat.type = "button";
        openChat.className = "lesson-page__open-chat";
        openChat.dataset.lessonOpenChat = String(index);
        openChat.setAttribute("aria-expanded", String(activeCommentIndex === index && !chat.hidden));
        openChat.setAttribute("aria-controls", "lesson-comment-chat");
        openChat.setAttribute(
          "aria-label",
          LearningHausI18n.t(
            `Open chat for comment, ${comment.replies.length} replies`,
            `เปิดแชทสำหรับความคิดเห็นนี้ (${comment.replies.length} การตอบกลับ)`
          )
        );
        openChat.textContent = LearningHausI18n.t("Open chat", "เปิดแชท");

        const count = document.createElement("span");
        count.className = "lesson-page__reply-count";
        count.setAttribute("aria-label", LearningHausI18n.t(`${comment.replies.length} replies`, `${comment.replies.length} การตอบกลับ`));
        count.textContent = String(comment.replies.length);

        actions.append(like, openChat, count);
        body.append(meta, bubble, actions);
        row.append(avatar, body);
        commentsList.append(row);
      });
    };

    const renderChat = (): void => {
      if (activeCommentIndex === null) return;
      const comment = comments[activeChapter - 1][activeCommentIndex];
      if (!comment) return;
      chatCount.textContent = LearningHausI18n.t(
        `${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`,
        `${comment.replies.length} การตอบกลับ`
      );
      chatThread.replaceChildren();
      const addMessage = (message: { author: string; avatar: string; text: string; mine: boolean }): void => {
        const row = document.createElement("div");
        row.className = `lesson-page__chat-message${message.mine ? " lesson-page__chat-message--mine" : ""}`;
        const avatar = document.createElement("img");
        avatar.className = "lesson-page__avatar";
        avatar.src = resolveCommentAvatar(message.author, message.avatar, message.mine);
        avatar.alt = `${message.author} avatar`;
        const bubble = document.createElement("div");
        bubble.className = "lesson-page__chat-bubble";
        const author = document.createElement("strong");
        author.textContent = message.author;
        const copy = document.createElement("span");
        copy.textContent = message.text;
        bubble.append(author, copy);
        row.append(avatar, bubble);
        chatThread.append(row);
      };
      addMessage({ ...comment, mine: false });
      comment.replies.forEach(addMessage);
      chatThread.scrollTop = chatThread.scrollHeight;
    };

    const closeChat = (): void => {
      activeCommentIndex = null;
      chat.hidden = true;
      chatForm.reset();
      renderComments();
    };

    const applyChapterCopy = (chapter: number): void => {
      if (!Number.isInteger(chapter) || chapter < 1 || chapter > chapterData.length) return;
      const entry = chapterData[chapter - 1];
      const localizedTitle = LearningHausI18n.t(entry.title, entry.titleTh);
      title.textContent = localizedTitle;
      if (chapterPill) {
        const shortName = localizedTitle.replace(/^(?:Chapter|บทที่)\s+\d+\s*-\s*/i, "");
        chapterPill.innerHTML = "";
        const strong = document.createElement("strong");
        strong.textContent = LearningHausI18n.t(`Chapter ${chapter}`, `บทที่ ${chapter}`);
        chapterPill.append(strong, ` / ${chapterData.length} · ${shortName}`);
      }
      description.replaceChildren();
      const localizedParagraphs = LearningHausI18n.isThai() ? entry.paragraphsTh : entry.paragraphs;
      localizedParagraphs.forEach((copy) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = copy;
        description.append(paragraph);
      });
      posterImage.alt = LearningHausI18n.t(
        `Chapter ${chapter} lesson video thumbnail`,
        `ภาพหน้าปกวิดีโอบทที่ ${chapter}`
      );
      favorite.setAttribute(
        "aria-label",
        favorites.has(chapter)
          ? LearningHausI18n.t("Unlike this lesson", "เลิกถูกใจบทเรียนนี้")
          : LearningHausI18n.t("Like this lesson", "ถูกใจบทเรียนนี้")
      );
    };

    const renderChapter = (chapter: number): void => {
      if (!Number.isInteger(chapter) || chapter < 1 || chapter > chapterData.length) return;
      closeChat();
      closeVideo();
      activeChapter = chapter;
      applyChapterCopy(chapter);
      description.scrollTop = 0;
      poster.classList.remove("lesson-page__poster--card");
      posterImage.src = `lesson-assets/chapter-${chapter}-poster.png`;
      const localSource = localVideoByChapter[chapter];
      const videoId = videoIds[chapter - 1];
      play.href = localSource || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : "#");
      play.setAttribute(
        "aria-label",
        localSource
          ? `Play Chapter ${chapter} video`
          : window.location.protocol === "file:"
            ? `Watch Chapter ${chapter} video on YouTube (opens in a new tab)`
            : `Play Chapter ${chapter} video`
      );
      localVideo.setAttribute("aria-label", `Chapter ${chapter} lesson video`);
      frame.title = `Chapter ${chapter} lesson video`;
      next.disabled = chapter === chapterData.length;
      favorite.setAttribute("aria-pressed", String(favorites.has(chapter)));
      favorite.setAttribute("aria-label", favorites.has(chapter) ? "Unlike this lesson" : "Like this lesson");
      feedback.textContent = "";
      mediaStatus.textContent =
        !localSource && window.location.protocol === "file:"
          ? `Open LearningHaus through a local web server to track the end of the Chapter ${chapter} video and unlock its quiz stages.`
          : "";
      renderComments();
      home.querySelector("[data-chapter-picker]")?.dispatchEvent(new CustomEvent("learninghaus:select-chapter", { detail: { chapter } }));
      home.querySelector(".home-main")?.scrollTo(0, 0);
    };

    home.addEventListener("learninghaus:lesson-open", (event) => {
      const detail = (event as CustomEvent<{ chapter?: number }>).detail;
      renderChapter(Number(detail?.chapter));
    });
    home.addEventListener("learninghaus:lesson-hide", () => {
      closeVideo();
      closeChat();
    });
    localVideo.addEventListener("error", () => {
      if (localVideo.hidden) return;
      localVideo.hidden = true;
      poster.hidden = false;
      mediaStatus.textContent = LearningHausI18n.t(
        "This video could not be played in this browser.",
        "ไม่สามารถเล่นวิดีโอนี้ในเบราว์เซอร์ได้"
      );
    });
    localVideo.addEventListener("timeupdate", () => {
      if (localVideo.hidden || isChapterVideoFinished(activeChapter)) return;
      if (!localVideo.seeking && localVideo.currentTime > localMaxWatched && localVideo.currentTime - localMaxWatched <= 1.5) {
        localMaxWatched = localVideo.currentTime;
      }
    });
    localVideo.addEventListener("seeking", () => {
      if (localVideo.hidden || isChapterVideoFinished(activeChapter)) return;
      if (localVideo.currentTime > localMaxWatched + 0.6) {
        localVideo.currentTime = localMaxWatched;
        mediaStatus.textContent = LearningHausI18n.t(
          "Watch the video to the end once before skipping the timeline. You can still pause or rewind anytime.",
          "กรุณาดูวิดีโอให้จบอย่างน้อย 1 ครั้งก่อนจึงจะข้าม Timeline ได้ (กดหยุดหรือย้อนกลับได้ตามปกติ)"
        );
      }
    });
    localVideo.addEventListener("ended", markChapterVideoWatched);
    play.addEventListener("click", (event) => {
      window.LearningHausSocial?.trackEvent?.("video_start", `chapter-${activeChapter}`, { chapter: activeChapter });
      const localSource = localVideoByChapter[activeChapter];
      if (localSource) {
        event.preventDefault();
        localMaxWatched = 0;
        localVideo.src = localSource;
        poster.hidden = true;
        localVideo.hidden = false;
        mediaStatus.textContent = isChapterVideoFinished(activeChapter)
          ? ""
          : LearningHausI18n.t(
              "Watch to the end once to unlock timeline skipping. Pause and rewind are always available.",
              "ดูให้จบ 1 ครั้งเพื่อปลดล็อกการข้าม Timeline (สามารถกดหยุดหรือย้อนกลับได้ตลอด)"
            );
        localVideo.play().catch(() => {
          if (!localVideo.error) {
            mediaStatus.textContent = LearningHausI18n.t(
              "Press play in the video controls to begin.",
              "กดปุ่มเล่นที่ตัวควบคุมวิดีโอเพื่อเริ่มรับชม"
            );
          }
        });
        return;
      }
      const videoId = videoIds[activeChapter - 1];
      if (!videoId) {
        event.preventDefault();
        mediaStatus.textContent = LearningHausI18n.t(
          "This chapter's video is not available yet.",
          "วิดีโอของบทเรียนนี้ยังไม่พร้อมใช้งานในขณะนี้"
        );
        return;
      }
      if (window.location.protocol === "file:") {
        mediaStatus.textContent = LearningHausI18n.t(
          `This file opens YouTube in a new tab, so completion cannot be detected. Open LearningHaus through a local web server to unlock Chapter ${activeChapter} quiz stages.`,
          `การเปิดไฟล์ตรงจะเปิด YouTube ในแท็บใหม่ทำให้ตรวจจับการดูจบไม่ได้ กรุณาเปิด LearningHaus ผ่านเว็บเซิร์ฟเวอร์เพื่อปลดล็อกด่านทดสอบบทที่ ${activeChapter}`
        );
        return;
      }
      event.preventDefault();
      const requestedChapter = activeChapter;
      poster.hidden = true;
      youtubeWrapper.hidden = false;
      mediaStatus.textContent = LearningHausI18n.t(
        `Loading the Chapter ${activeChapter} player...`,
        `กำลังโหลดตัวเล่นวิดีโอบทที่ ${activeChapter}...`
      );
      loadYouTubeApi()
        .then((YT) => {
          if (activeChapter !== requestedChapter || youtubeWrapper.hidden || !YT.Player) return;
          if (lessonYoutubePlayer) {
            lessonYoutubePlayer.loadVideoById?.(videoId);
            startYtSeekGuard(requestedChapter);
            mediaStatus.textContent = isChapterVideoFinished(requestedChapter)
              ? ""
              : LearningHausI18n.t(
                  "Watch to the end once to unlock timeline skipping. Pause and rewind are always available.",
                  "ดูให้จบ 1 ครั้งเพื่อปลดล็อกการข้าม Timeline (สามารถกดหยุดหรือย้อนกลับได้ตลอด)"
                );
            return;
          }
          lessonYoutubePlayer = new YT.Player("lesson-youtube-player", {
            videoId,
            playerVars: { autoplay: 1, playsinline: 1, rel: 0, origin: window.location.origin },
            events: {
              onReady: (playerEvent) => {
                if (activeChapter === requestedChapter && !youtubeWrapper.hidden) {
                  playerEvent.target.playVideo?.();
                  startYtSeekGuard(requestedChapter);
                }
                mediaStatus.textContent = isChapterVideoFinished(requestedChapter)
                  ? ""
                  : LearningHausI18n.t(
                      "Watch to the end once to unlock timeline skipping. Pause and rewind are always available.",
                      "ดูให้จบ 1 ครั้งเพื่อปลดล็อกการข้าม Timeline (สามารถกดหยุดหรือย้อนกลับได้ตลอด)"
                    );
              },
              onStateChange: (playerEvent) => {
                if (!youtubeWrapper.hidden && playerEvent.data === YT.PlayerState?.ENDED) markChapterVideoWatched();
              },
              onError: () => {
                mediaStatus.textContent = LearningHausI18n.t(
                  `This YouTube video cannot be played here. Chapter ${activeChapter} quiz stages remain locked.`,
                  `ไม่สามารถเล่นวิดีโอ YouTube นี้ได้ที่นี่ ด่านทดสอบบทที่ ${activeChapter} จึงยังคงล็อคอยู่`
                );
              }
            }
          });
        })
        .catch(() => {
          mediaStatus.textContent = LearningHausI18n.t(
            `The YouTube player could not load. Chapter ${activeChapter} quiz stages remain locked.`,
            `ไม่สามารถโหลดตัวเล่น YouTube ได้ ด่านทดสอบบทที่ ${activeChapter} จึงยังคงล็อคอยู่`
          );
        });
    });

    next.addEventListener("click", () => renderChapter(activeChapter + 1));
    favorite.addEventListener("click", () => {
      if (favorites.has(activeChapter)) favorites.delete(activeChapter);
      else favorites.add(activeChapter);
      favorite.setAttribute("aria-pressed", String(favorites.has(activeChapter)));
      favorite.setAttribute(
        "aria-label",
        favorites.has(activeChapter)
          ? LearningHausI18n.t("Unlike this lesson", "เลิกถูกใจบทเรียนนี้")
          : LearningHausI18n.t("Like this lesson", "ถูกใจบทเรียนนี้")
      );
    });
    share.addEventListener("click", async () => {
      if (localVideoByChapter[activeChapter]) {
        feedback.textContent = LearningHausI18n.t(
          "This local video can be shared after the site is published online.",
          "วิดีโอในเครื่องนี้จะแชร์ลิงก์ได้เมื่อนำเว็บไซต์ขึ้นระบบออนไลน์"
        );
        return;
      }
      const url = `https://www.youtube.com/watch?v=${videoIds[activeChapter - 1]}`;
      try {
        await navigator.clipboard.writeText(url);
        feedback.textContent = LearningHausI18n.t("Video link copied.", "คัดลอกลิงก์วิดีโอแล้ว");
      } catch {
        feedback.textContent = LearningHausI18n.t(`Video link: ${url}`, `ลิงก์วิดีโอ: ${url}`);
      }
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.elements.namedItem("comment") as HTMLInputElement | null;
      const message = input?.value.trim() || "";
      if (!input || !message) return;
      const profile = window.LearningHausProfile?.getProfile?.();
      comments[activeChapter - 1].push({
        author: profile?.name || LearningHausI18n.t("You", "คุณ"),
        avatar: resolveCommentAvatar(profile?.name || "You", profile?.avatar || "", true),
        text: message,
        liked: false,
        replies: []
      });
      input.value = "";
      feedback.textContent = LearningHausI18n.t("Comment added.", "เพิ่มความคิดเห็นแล้ว");
      window.LearningHausSocial?.trackEvent?.("lesson_comment", `chapter-${activeChapter}`, { chapter: activeChapter });
      renderComments();
    });
    commentsList.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      const openButton = target?.closest<HTMLElement>("[data-lesson-open-chat]");
      if (openButton) {
        const index = Number(openButton.dataset.lessonOpenChat);
        if (!comments[activeChapter - 1][index]) return;
        if (activeCommentIndex === index && !chat.hidden) {
          closeChat();
          return;
        }
        activeCommentIndex = index;
        chat.hidden = false;
        renderComments();
        renderChat();
        const replyInput = chatForm.elements.namedItem("reply") as HTMLInputElement | null;
        replyInput?.focus();
        return;
      }
      const button = target?.closest<HTMLElement>("[data-lesson-comment-like]");
      if (!button) return;
      const comment = comments[activeChapter - 1][Number(button.dataset.lessonCommentLike)];
      if (!comment) return;
      comment.liked = !comment.liked;
      renderComments();
    });
    chatCloseButton.addEventListener("click", closeChat);
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (activeCommentIndex === null) return;
      const input = chatForm.elements.namedItem("reply") as HTMLInputElement | null;
      const message = input?.value.trim() || "";
      if (!input || !message) return;
      const profile = window.LearningHausProfile?.getProfile?.();
      comments[activeChapter - 1][activeCommentIndex].replies.push({
        author: profile?.name || "You",
        avatar: resolveCommentAvatar(profile?.name || "You", profile?.avatar || "", true),
        text: message,
        mine: true
      });
      input.value = "";
      renderChat();
      renderComments();
      input.focus();
    });
    page.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Escape" || chat.hidden) return;
        event.preventDefault();
        event.stopPropagation();
        closeChat();
      },
      true
    );

    window.addEventListener("learninghaus:language-changed", () => {
      applyChapterCopy(activeChapter);
      renderComments();
      if (activeCommentIndex !== null && !chat.hidden) renderChat();
    });

    renderChapter(1);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLessonPage, { once: true });
  } else {
    initLessonPage();
  }
})();
