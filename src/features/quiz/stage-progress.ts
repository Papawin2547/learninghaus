// ส่วนนี้ทำหน้าที่: สร้างแผนที่ด่าน ปลดล็อกด่าน และซิงค์ความคืบหน้ากับระบบรางวัล
(() => {
  type StoredAttempt = {
    courseId?: string;
    subjectId?: string;
    stage?: number;
    score?: number;
    correct?: number;
    totalQuestions?: number;
    timeSeconds?: number;
    completedAt?: string;
  };

  type ServerAchievementPayload = {
    metrics: LearningHausAchievementEngine.Metrics;
    unlocked?: { id: string; unlockedAt: string }[];
    legacyUnlockedIds?: string[];
    completedStages?: number[];
  };

  const initQuizStageProgress = (): void => {
    const quizView = document.querySelector<HTMLElement>("#quiz-view");
    if (!quizView) {
      document.addEventListener("DOMContentLoaded", initQuizStageProgress, { once: true });
      return;
    }

    const chapterCount = LearningHausRules.quiz.chapterCount;
    const stagesPerChapter = LearningHausRules.quiz.stagesPerChapter;
    const quizStage = quizView.querySelector<HTMLElement>(".quiz-stage");
    if (!quizStage) return;

    const nodeLefts = [295, 405, 295, 184, 295, 405, 295, 184, 295, 405];
    const mapHeight = 2060 + (chapterCount - 2) * 2030 + 9 * 185 + 275;

    const getBiomeBackdropSVG = (chNum: number, height: number): string => {
      return LearningHausStageCatalog.renderEuChapterBiomeSvg(chNum, height);
    };

    // Tier 1: Cute 24x24 Mini Pixel-Art Props clinging to regular stages (simpler & smaller than Mid & Final Boss!)
    const getMiniStagePropSVG = (chNum: number, variant: number): string => {
      const v = variant & 1;
      switch (chNum) {
        case 1: // Sunflower Meadow — mini sunflower bud / fluttering tiny honeybee
          return v === 0
            ? `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="11" y="13" width="2" height="8" fill="#2D752E" stroke="#191724" stroke-width="1"/>
                <rect x="7" y="16" width="4" height="3" fill="#52AB44" stroke="#191724" stroke-width="1"/>
                <rect x="13" y="15" width="4" height="3" fill="#52AB44" stroke="#191724" stroke-width="1"/>
                <rect x="7" y="4" width="10" height="10" fill="#EAB308" stroke="#191724" stroke-width="1"/>
                <rect x="8" y="5" width="8" height="8" fill="#FDE047"/>
                <rect x="10" y="7" width="4" height="4" fill="#5C2D12"/>
                <rect x="10" y="7" width="1" height="1" fill="#FEF08A"/>
              </svg>`
            : `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="8" y="5" width="5" height="4" fill="#E0F2FE" stroke="#191724" stroke-width="1"/>
                <rect x="12" y="5" width="5" height="4" fill="#FFFFFF" stroke="#191724" stroke-width="1"/>
                <rect x="6" y="9" width="11" height="7" fill="#FDE047" stroke="#191724" stroke-width="1"/>
                <rect x="9" y="9" width="2" height="7" fill="#451A03"/>
                <rect x="13" y="9" width="2" height="7" fill="#451A03"/>
                <rect x="7" y="11" width="1" height="2" fill="#191724"/>
                <rect x="7" y="13" width="2" height="1" fill="#F472B6"/>
              </svg>`;
        case 2: // Obsidian Vault — faceted ruby shard / flickering mini vault candle
          return v === 0
            ? `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="10" y="5" width="5" height="14" fill="#B91C1C" stroke="#191724" stroke-width="1"/>
                <rect x="11" y="6" width="3" height="11" fill="#EF4444"/>
                <rect x="12" y="7" width="1" height="7" fill="#FECACA"/>
                <rect x="6" y="11" width="4" height="8" fill="#991B1B" stroke="#191724" stroke-width="1"/>
                <rect x="15" y="12" width="4" height="7" fill="#F59E0B" stroke="#191724" stroke-width="1"/>
                <rect x="16" y="13" width="2" height="4" fill="#FEF08A"/>
              </svg>`
            : `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="10" y="4" width="4" height="5" fill="#F97316" stroke="#191724" stroke-width="1"/>
                <rect x="11" y="5" width="2" height="3" fill="#FEF08A"/>
                <rect x="9" y="9" width="6" height="10" fill="#E2D9F3" stroke="#191724" stroke-width="1"/>
                <rect x="10" y="10" width="3" height="8" fill="#F8FAFC"/>
                <rect x="7" y="18" width="10" height="3" fill="#4C3D69" stroke="#191724" stroke-width="1"/>
              </svg>`;
        case 3: // Amber Bastion (Brick Castle) — mini crimson pennant / castle brick with ivy
          return v === 0
            ? `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="6" y="4" width="2" height="17" fill="#5C2B14" stroke="#191724" stroke-width="1"/>
                <rect x="8" y="5" width="11" height="7" fill="#B91C1C" stroke="#191724" stroke-width="1"/>
                <rect x="9" y="6" width="9" height="2" fill="#EF4444"/>
                <rect x="12" y="7" width="3" height="3" fill="#FBBF24"/>
              </svg>`
            : `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="5" y="9" width="14" height="11" fill="#B4592D" stroke="#191724" stroke-width="1"/>
                <rect x="6" y="10" width="5" height="4" fill="#D97D42"/>
                <rect x="12" y="10" width="6" height="4" fill="#C76B35"/>
                <rect x="9" y="15" width="7" height="4" fill="#D97D42"/>
                <rect x="5" y="7" width="7" height="5" fill="#2D6A30" stroke="#191724" stroke-width="1"/>
                <rect x="6" y="8" width="4" height="2" fill="#7EC45A"/>
              </svg>`;
        case 4: // Mirror Observatory — twinkling starlight gem / floating cyan prism
          return v === 0
            ? `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="10" y="4" width="4" height="16" fill="#38BDF8" stroke="#191724" stroke-width="1"/>
                <rect x="4" y="10" width="16" height="4" fill="#38BDF8" stroke="#191724" stroke-width="1"/>
                <rect x="8" y="8" width="8" height="8" fill="#BAE6FD"/>
                <rect x="10" y="10" width="4" height="4" fill="#FFFFFF"/>
              </svg>`
            : `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="9" y="4" width="6" height="16" fill="#0284C7" stroke="#191724" stroke-width="1"/>
                <rect x="10" y="5" width="4" height="14" fill="#7DD3FC"/>
                <rect x="11" y="7" width="2" height="9" fill="#FFFFFF"/>
                <rect x="16" y="6" width="3" height="3" fill="#FDE047"/>
              </svg>`;
        case 5: // Astral Spire — tiny glowing amethyst crystal / baby violet mushroom
          return v === 0
            ? `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="9" y="5" width="6" height="14" fill="#7C3AED" stroke="#191724" stroke-width="1"/>
                <rect x="10" y="6" width="4" height="11" fill="#C084FC"/>
                <rect x="11" y="7" width="2" height="7" fill="#FDF4FF"/>
                <rect x="5" y="11" width="4" height="8" fill="#6D28D9" stroke="#191724" stroke-width="1"/>
                <rect x="16" y="7" width="3" height="3" fill="#FDE047"/>
              </svg>`
            : `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="10" y="13" width="4" height="7" fill="#E9D5FF" stroke="#191724" stroke-width="1"/>
                <rect x="6" y="7" width="12" height="7" fill="#7E22CE" stroke="#191724" stroke-width="1"/>
                <rect x="7" y="8" width="10" height="4" fill="#D946EF"/>
                <rect x="9" y="9" width="2" height="2" fill="#FEF08A"/>
                <rect x="14" y="8" width="2" height="2" fill="#FEF08A"/>
              </svg>`;
        case 6: // Emerald Conservatory — baby red-spotted mushroom / glowing mint firefly sprout
          return v === 0
            ? `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="10" y="13" width="4" height="7" fill="#D6A887" stroke="#191724" stroke-width="1"/>
                <rect x="6" y="7" width="12" height="7" fill="#B93822" stroke="#191724" stroke-width="1"/>
                <rect x="7" y="8" width="10" height="4" fill="#E05638"/>
                <rect x="8" y="9" width="2" height="2" fill="#FDE8D7"/>
                <rect x="14" y="8" width="2" height="2" fill="#FDE8D7"/>
              </svg>`
            : `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="11" y="12" width="2" height="8" fill="#24635C" stroke="#191724" stroke-width="1"/>
                <rect x="6" y="14" width="5" height="4" fill="#328071" stroke="#191724" stroke-width="1"/>
                <rect x="13" y="13" width="5" height="4" fill="#4BA38B" stroke="#191724" stroke-width="1"/>
                <rect x="9" y="5" width="6" height="6" fill="#A7F3D0" stroke="#191724" stroke-width="1"/>
                <rect x="11" y="7" width="2" height="2" fill="#FFFFFF"/>
              </svg>`;
        case 7: // Riverside Village — blooming peach blossom / miniature paper boat
          return v === 0
            ? `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="11" y="13" width="2" height="7" fill="#2D6B47" stroke="#191724" stroke-width="1"/>
                <rect x="7" y="6" width="10" height="8" fill="#F29C8A" stroke="#191724" stroke-width="1"/>
                <rect x="8" y="7" width="8" height="6" fill="#FDD5AD"/>
                <rect x="10" y="9" width="4" height="2" fill="#FEF08A"/>
                <rect x="13" y="15" width="4" height="3" fill="#529E6C" stroke="#191724" stroke-width="1"/>
              </svg>`
            : `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="11" y="5" width="2" height="9" fill="#78350F"/>
                <rect x="12" y="6" width="6" height="7" fill="#FFF7EB" stroke="#191724" stroke-width="1"/>
                <rect x="5" y="13" width="14" height="5" fill="#C26D3A" stroke="#191724" stroke-width="1"/>
                <rect x="4" y="18" width="16" height="3" fill="#3898D4" stroke="#191724" stroke-width="1"/>
              </svg>`;
        default: // Snowy Peak — sparkling ice crystal / mini snow-dusted pine
          return v === 0
            ? `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="11" y="4" width="2" height="16" fill="#60A5FA" stroke="#1E3A5F" stroke-width="1"/>
                <rect x="4" y="11" width="16" height="2" fill="#60A5FA" stroke="#1E3A5F" stroke-width="1"/>
                <rect x="8" y="8" width="8" height="8" fill="#E0F2FE" stroke="#1E3A5F" stroke-width="1"/>
                <rect x="10" y="10" width="4" height="4" fill="#FFFFFF"/>
              </svg>`
            : `<svg class="quiz-pixel-svg" viewBox="0 0 24 24">
                <rect x="10" y="17" width="4" height="4" fill="#5C341D" stroke="#191724" stroke-width="1"/>
                <rect x="5" y="12" width="14" height="6" fill="#216163" stroke="#191724" stroke-width="1"/>
                <rect x="7" y="7" width="10" height="6" fill="#32827F" stroke="#191724" stroke-width="1"/>
                <rect x="9" y="4" width="6" height="4" fill="#FFFFFF" stroke="#1E3A5F" stroke-width="1"/>
                <rect x="7" y="12" width="10" height="2" fill="#E0F2FE"/>
              </svg>`;
      }
    };

    // Tier 2: Detailed 32x32 Mid-Chapter Mascot Companions (Stages 3 & 5)
    const getStage3CreatureSVG = (chNum: number): string => {
      switch (chNum) {
        case 1: // Sunflower Meadow — Plump Golden Honeybee Companion perched on layered Sunflower
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="8" y="2" width="8" height="5" fill="#E0F2FE" stroke="#191724" stroke-width="1"/>
            <rect x="15" y="2" width="8" height="5" fill="#FFFFFF" stroke="#191724" stroke-width="1"/>
            <rect x="9" y="3" width="5" height="2" fill="#FFFFFF"/>
            <rect x="6" y="7" width="18" height="11" fill="#FDE047" stroke="#191724" stroke-width="1"/>
            <rect x="7" y="8" width="16" height="3" fill="#FEF9C3"/>
            <rect x="11" y="7" width="3" height="11" fill="#451A03"/>
            <rect x="17" y="7" width="3" height="11" fill="#451A03"/>
            <rect x="8" y="10" width="2" height="3" fill="#191724"/><rect x="8" y="10" width="1" height="1" fill="#FFFFFF"/>
            <rect x="7" y="14" width="3" height="2" fill="#F472B6"/>
            <rect x="24" y="11" width="4" height="3" fill="#451A03" stroke="#191724" stroke-width="1"/>
            <rect x="3" y="19" width="12" height="10" fill="#EAB308" stroke="#191724" stroke-width="1"/>
            <rect x="4" y="20" width="10" height="8" fill="#FDE047"/>
            <rect x="6" y="22" width="6" height="4" fill="#5C2D12"/>
            <rect x="7" y="23" width="2" height="1" fill="#92400E"/>
            <rect x="15" y="23" width="7" height="4" fill="#3B8146" stroke="#191724" stroke-width="1"/>
            <rect x="16" y="24" width="4" height="1" fill="#86EFAC"/>
          </svg>`;
        case 2: // Obsidian Vault — Winged Ruby Crystal Bat with glowing golden eyes
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="1" y="7" width="9" height="8" fill="#241A36" stroke="#191724" stroke-width="1"/>
            <rect x="3" y="9" width="6" height="4" fill="#3B2B57"/>
            <rect x="22" y="7" width="9" height="8" fill="#241A36" stroke="#191724" stroke-width="1"/>
            <rect x="23" y="9" width="6" height="4" fill="#3B2B57"/>
            <rect x="9" y="3" width="4" height="5" fill="#382854" stroke="#191724" stroke-width="1"/>
            <rect x="19" y="3" width="4" height="5" fill="#382854" stroke="#191724" stroke-width="1"/>
            <rect x="10" y="5" width="2" height="2" fill="#FB7185"/>
            <rect x="20" y="5" width="2" height="2" fill="#FB7185"/>
            <rect x="8" y="7" width="16" height="12" fill="#2B2042" stroke="#191724" stroke-width="1"/>
            <rect x="11" y="11" width="3" height="3" fill="#FBBF24"/><rect x="11" y="11" width="1" height="1" fill="#FFFFFF"/>
            <rect x="18" y="11" width="3" height="3" fill="#FBBF24"/><rect x="18" y="11" width="1" height="1" fill="#FFFFFF"/>
            <rect x="12" y="16" width="2" height="2" fill="#FFFFFF"/>
            <rect x="18" y="16" width="2" height="2" fill="#FFFFFF"/>
            <rect x="12" y="20" width="8" height="10" fill="#EF4444" stroke="#191724" stroke-width="1"/>
            <rect x="14" y="21" width="3" height="7" fill="#FECACA"/>
          </svg>`;
        case 3: // Amber Bastion — Heraldic Castle Banner, Brass Shield & Torch
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="5" y="2" width="3" height="27" fill="#5C2B14" stroke="#191724" stroke-width="1"/>
            <rect x="8" y="3" width="18" height="11" fill="#B91C1C" stroke="#191724" stroke-width="1"/>
            <rect x="9" y="4" width="16" height="3" fill="#EF4444"/>
            <rect x="14" y="6" width="6" height="5" fill="#FBBF24"/>
            <rect x="15" y="7" width="3" height="2" fill="#FEF08A"/>
            <rect x="13" y="15" width="14" height="14" fill="#475569" stroke="#191724" stroke-width="1"/>
            <rect x="15" y="17" width="10" height="10" fill="#D97028"/>
            <rect x="16" y="18" width="4" height="8" fill="#F59E0B"/>
            <rect x="18" y="20" width="4" height="4" fill="#FEF08A"/>
            <rect x="2" y="19" width="6" height="9" fill="#924B22" stroke="#191724" stroke-width="1"/>
            <rect x="3" y="14" width="4" height="5" fill="#F97316" stroke="#191724" stroke-width="1"/>
            <rect x="4" y="15" width="2" height="3" fill="#FEF08A"/>
          </svg>`;
        case 4: // Mirror Observatory — Starlight Crescent Owl with Shaded Feathers
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="19" y="2" width="11" height="11" fill="#F8FAFC" stroke="#1E2D57" stroke-width="1"/>
            <rect x="23" y="3" width="7" height="8" fill="#1E2D57"/>
            <rect x="6" y="7" width="16" height="16" fill="#4B65A6" stroke="#191724" stroke-width="1"/>
            <rect x="7" y="4" width="4" height="4" fill="#3B528C" stroke="#191724" stroke-width="1"/>
            <rect x="17" y="4" width="4" height="4" fill="#3B528C" stroke="#191724" stroke-width="1"/>
            <rect x="8" y="9" width="12" height="11" fill="#DBEAFE"/>
            <rect x="9" y="11" width="4" height="4" fill="#1E2D57"/><rect x="10" y="12" width="2" height="2" fill="#38BDF8"/><rect x="10" y="12" width="1" height="1" fill="#FFFFFF"/>
            <rect x="15" y="11" width="4" height="4" fill="#1E2D57"/><rect x="16" y="12" width="2" height="2" fill="#38BDF8"/><rect x="16" y="12" width="1" height="1" fill="#FFFFFF"/>
            <rect x="13" y="15" width="2" height="3" fill="#FBBF24"/>
            <rect x="2" y="12" width="5" height="9" fill="#38BDF8" stroke="#191724" stroke-width="1"/>
            <rect x="21" y="14" width="5" height="8" fill="#38BDF8" stroke="#191724" stroke-width="1"/>
            <rect x="9" y="23" width="4" height="3" fill="#FBBF24"/><rect x="15" y="23" width="4" height="3" fill="#FBBF24"/>
          </svg>`;
        case 5: // Astral Spire — Floating Arcane Orb Familiar with Orbiting Golden Ring
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="9" y="4" width="14" height="14" fill="#7C3AED" stroke="#191724" stroke-width="1"/>
            <rect x="11" y="6" width="10" height="10" fill="#E879F9"/>
            <rect x="13" y="8" width="6" height="6" fill="#FDF4FF"/>
            <rect x="14" y="10" width="2" height="2" fill="#191724"/><rect x="17" y="10" width="2" height="2" fill="#191724"/>
            <rect x="3" y="12" width="26" height="3" fill="#FDE047" stroke="#191724" stroke-width="1"/>
            <rect x="5" y="3" width="4" height="4" fill="#67E8F9" stroke="#191724" stroke-width="1"/>
            <rect x="23" y="19" width="4" height="4" fill="#67E8F9" stroke="#191724" stroke-width="1"/>
            <rect x="11" y="19" width="10" height="9" fill="#4C1D95" stroke="#191724" stroke-width="1"/>
            <rect x="13" y="21" width="6" height="5" fill="#C084FC"/>
          </svg>`;
        case 6: // Emerald Conservatory — Cute Red-Spotted Forest Mushroom Buddy & Firefly
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="10" y="15" width="12" height="12" fill="#D6A887" stroke="#191724" stroke-width="1"/>
            <rect x="11" y="16" width="9" height="10" fill="#F3D6B8"/>
            <rect x="5" y="6" width="22" height="11" fill="#B93822" stroke="#191724" stroke-width="1"/>
            <rect x="7" y="7" width="18" height="7" fill="#E05638"/>
            <rect x="8" y="8" width="4" height="3" fill="#FDE8D7"/>
            <rect x="16" y="7" width="4" height="3" fill="#FDE8D7"/>
            <rect x="20" y="12" width="4" height="3" fill="#FDE8D7"/>
            <rect x="12" y="19" width="2" height="3" fill="#191724"/><rect x="12" y="19" width="1" height="1" fill="#FFFFFF"/>
            <rect x="18" y="19" width="2" height="3" fill="#191724"/><rect x="18" y="19" width="1" height="1" fill="#FFFFFF"/>
            <rect x="11" y="22" width="2" height="1" fill="#F472B6"/><rect x="19" y="22" width="2" height="1" fill="#F472B6"/>
            <rect x="23" y="2" width="5" height="5" fill="#A7F3D0" stroke="#191724" stroke-width="1"/>
            <rect x="25" y="4" width="1" height="1" fill="#FFFFFF"/>
            <rect x="3" y="21" width="7" height="6" fill="#328071" stroke="#191724" stroke-width="1"/>
            <rect x="4" y="22" width="4" height="2" fill="#82D4B5"/>
          </svg>`;
        case 7: // Riverside Village — Detailed Wooden River Sailboat & Sunrise Wave
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="14" y="3" width="2" height="16" fill="#78350F" stroke="#191724" stroke-width="1"/>
            <rect x="16" y="4" width="11" height="12" fill="#FFF7EB" stroke="#191724" stroke-width="1"/>
            <rect x="17" y="6" width="9" height="3" fill="#F29C8A"/>
            <rect x="17" y="11" width="8" height="2" fill="#FDD5AD"/>
            <rect x="8" y="9" width="6" height="7" fill="#FEF3C7" stroke="#191724" stroke-width="1"/>
            <rect x="4" y="18" width="24" height="7" fill="#92400E" stroke="#191724" stroke-width="1"/>
            <rect x="6" y="19" width="20" height="3" fill="#C26D3A"/>
            <rect x="2" y="25" width="28" height="5" fill="#3898D4" stroke="#191724" stroke-width="1"/>
            <rect x="6" y="26" width="8" height="2" fill="#E0F2FE"/>
            <rect x="18" y="27" width="6" height="1" fill="#E0F2FE"/>
          </svg>`;
        default: // Snowy Peak — Shimmering Snowflake Spirit & Frosted Pine
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="14" y="2" width="4" height="22" fill="#E0F2FE" stroke="#1E3A5F" stroke-width="1"/>
            <rect x="5" y="11" width="22" height="4" fill="#E0F2FE" stroke="#1E3A5F" stroke-width="1"/>
            <rect x="8" y="5" width="16" height="16" fill="#60A5FA" stroke="#1E3A5F" stroke-width="1"/>
            <rect x="10" y="7" width="12" height="12" fill="#FFFFFF"/>
            <rect x="12" y="10" width="2" height="3" fill="#1E3A5F"/><rect x="12" y="10" width="1" height="1" fill="#38BDF8"/>
            <rect x="18" y="10" width="2" height="3" fill="#1E3A5F"/><rect x="18" y="10" width="1" height="1" fill="#38BDF8"/>
            <rect x="11" y="14" width="2" height="1" fill="#F472B6"/><rect x="19" y="14" width="2" height="1" fill="#F472B6"/>
            <rect x="14" y="15" width="4" height="2" fill="#34D399"/>
            <rect x="3" y="21" width="9" height="8" fill="#216163" stroke="#191724" stroke-width="1"/>
            <rect x="4" y="21" width="7" height="3" fill="#FFFFFF"/>
          </svg>`;
      }
    };

    // Tier 3: Grand Detailed 40x40 Final Exam Boss Guardians (Stage 10, 20, 30..80 — visibly richer & grander!)
    const getStage4CreatureSVG = (chNum: number): string => {
      switch (chNum) {
        case 1: // Ch.1 Final: Royal Sunflower Bee King + Golden Crown + Twin Shaded Sunflowers
          return `<svg class="quiz-pixel-svg" viewBox="0 0 40 40">
            <rect x="15" y="2" width="10" height="5" fill="#F59E0B" stroke="#191724" stroke-width="1"/>
            <rect x="16" y="3" width="8" height="3" fill="#FDE047"/>
            <rect x="17" y="1" width="2" height="2" fill="#FEF08A"/><rect x="21" y="1" width="2" height="2" fill="#FEF08A"/>
            <rect x="7" y="7" width="10" height="6" fill="#E0F2FE" stroke="#191724" stroke-width="1"/>
            <rect x="23" y="7" width="10" height="6" fill="#FFFFFF" stroke="#191724" stroke-width="1"/>
            <rect x="11" y="8" width="18" height="14" fill="#FDE047" stroke="#191724" stroke-width="1"/>
            <rect x="12" y="9" width="16" height="4" fill="#FEF9C3"/>
            <rect x="14" y="14" width="12" height="3" fill="#451A03"/>
            <rect x="14" y="18" width="12" height="2" fill="#451A03"/>
            <rect x="14" y="10" width="3" height="3" fill="#191724"/><rect x="14" y="10" width="1" height="1" fill="#FFFFFF"/>
            <rect x="23" y="10" width="3" height="3" fill="#191724"/><rect x="23" y="10" width="1" height="1" fill="#FFFFFF"/>
            <rect x="12" y="13" width="2" height="2" fill="#F472B6"/><rect x="26" y="13" width="2" height="2" fill="#F472B6"/>
            <rect x="3" y="21" width="14" height="14" fill="#EAB308" stroke="#191724" stroke-width="1"/>
            <rect x="5" y="23" width="10" height="10" fill="#FDE047"/>
            <rect x="7" y="25" width="6" height="6" fill="#5C2D12"/>
            <rect x="23" y="23" width="13" height="13" fill="#EAB308" stroke="#191724" stroke-width="1"/>
            <rect x="25" y="25" width="9" height="9" fill="#FDE047"/>
            <rect x="27" y="27" width="5" height="5" fill="#5C2D12"/>
            <rect x="15" y="28" width="10" height="8" fill="#2D752E" stroke="#191724" stroke-width="1"/>
            <rect x="17" y="29" width="6" height="3" fill="#72C456"/>
          </svg>`;
        case 2: // Ch.2 Final: Obsidian Gargoyle-Cat Guardian with Ruby Horns & Hanging Lantern
          return `<svg class="quiz-pixel-svg" viewBox="0 0 40 40">
            <rect x="2" y="11" width="11" height="13" fill="#1C142B" stroke="#191724" stroke-width="1"/>
            <rect x="4" y="13" width="7" height="8" fill="#352650"/>
            <rect x="27" y="11" width="11" height="13" fill="#1C142B" stroke="#191724" stroke-width="1"/>
            <rect x="29" y="13" width="7" height="8" fill="#352650"/>
            <rect x="11" y="3" width="4" height="7" fill="#EF4444" stroke="#191724" stroke-width="1"/>
            <rect x="25" y="3" width="4" height="7" fill="#EF4444" stroke="#191724" stroke-width="1"/>
            <rect x="12" y="4" width="2" height="4" fill="#FECACA"/>
            <rect x="26" y="4" width="2" height="4" fill="#FECACA"/>
            <rect x="11" y="9" width="18" height="16" fill="#2B2042" stroke="#191724" stroke-width="1"/>
            <rect x="14" y="13" width="4" height="4" fill="#FBBF24"/><rect x="15" y="14" width="2" height="2" fill="#FEF08A"/>
            <rect x="22" y="13" width="4" height="4" fill="#FBBF24"/><rect x="23" y="14" width="2" height="2" fill="#FEF08A"/>
            <rect x="16" y="19" width="8" height="3" fill="#140D22"/>
            <rect x="17" y="19" width="2" height="2" fill="#FFFFFF"/><rect x="21" y="19" width="2" height="2" fill="#FFFFFF"/>
            <rect x="13" y="25" width="14" height="12" fill="#F59E0B" stroke="#191724" stroke-width="1"/>
            <rect x="15" y="27" width="10" height="8" fill="#FEF08A"/>
            <rect x="18" y="29" width="4" height="4" fill="#FFFFFF"/>
            <rect x="5" y="28" width="6" height="9" fill="#EF4444" stroke="#191724" stroke-width="1"/>
            <rect x="29" y="28" width="6" height="9" fill="#A855F7" stroke="#191724" stroke-width="1"/>
          </svg>`;
        case 3: // Ch.3 Final: Grand Brick Castle Keep + Twin Crimson Flags + Golden Knight Crest
          return `<svg class="quiz-pixel-svg" viewBox="0 0 40 40">
            <rect x="6" y="2" width="2" height="11" fill="#4A2511"/>
            <rect x="8" y="3" width="9" height="5" fill="#B91C1C" stroke="#191724" stroke-width="1"/>
            <rect x="11" y="4" width="3" height="2" fill="#FBBF24"/>
            <rect x="30" y="2" width="2" height="11" fill="#4A2511"/>
            <rect x="23" y="3" width="9" height="5" fill="#B91C1C" stroke="#191724" stroke-width="1"/>
            <rect x="26" y="4" width="3" height="2" fill="#FBBF24"/>
            <rect x="4" y="12" width="32" height="24" fill="#B4592D" stroke="#191724" stroke-width="1"/>
            <rect x="4" y="9" width="6" height="4" fill="#C76B35" stroke="#191724" stroke-width="1"/>
            <rect x="13" y="9" width="6" height="4" fill="#C76B35" stroke="#191724" stroke-width="1"/>
            <rect x="21" y="9" width="6" height="4" fill="#C76B35" stroke="#191724" stroke-width="1"/>
            <rect x="30" y="9" width="6" height="4" fill="#C76B35" stroke="#191724" stroke-width="1"/>
            <rect x="6" y="15" width="7" height="4" fill="#D97D42"/><rect x="27" y="15" width="7" height="4" fill="#D97D42"/>
            <rect x="14" y="16" width="12" height="16" fill="#475569" stroke="#191724" stroke-width="1"/>
            <rect x="16" y="18" width="8" height="12" fill="#FBBF24"/>
            <rect x="18" y="20" width="4" height="8" fill="#FEF08A"/>
            <rect x="6" y="23" width="6" height="11" fill="#F97316" stroke="#191724" stroke-width="1"/>
            <rect x="8" y="24" width="2" height="5" fill="#FEF08A"/>
            <rect x="28" y="23" width="6" height="11" fill="#F97316" stroke="#191724" stroke-width="1"/>
            <rect x="30" y="24" width="2" height="5" fill="#FEF08A"/>
          </svg>`;
        case 4: // Ch.4 Final: Celestial Astrolabe Owl Monarch on Golden Crescent Moon
          return `<svg class="quiz-pixel-svg" viewBox="0 0 40 40">
            <rect x="5" y="18" width="30" height="16" fill="#F59E0B" stroke="#191724" stroke-width="1"/>
            <rect x="7" y="19" width="26" height="13" fill="#FDE047"/>
            <rect x="11" y="15" width="18" height="12" fill="#1E2D57"/>
            <rect x="12" y="6" width="16" height="18" fill="#4B65A6" stroke="#191724" stroke-width="1"/>
            <rect x="16" y="2" width="8" height="4" fill="#FDE047" stroke="#191724" stroke-width="1"/>
            <rect x="14" y="9" width="12" height="11" fill="#DBEAFE"/>
            <rect x="15" y="11" width="4" height="4" fill="#1E2D57"/><rect x="16" y="12" width="2" height="2" fill="#38BDF8"/>
            <rect x="21" y="11" width="4" height="4" fill="#1E2D57"/><rect x="22" y="12" width="2" height="2" fill="#38BDF8"/>
            <rect x="19" y="15" width="2" height="3" fill="#F59E0B"/>
            <rect x="3" y="10" width="9" height="11" fill="#38BDF8" stroke="#191724" stroke-width="1"/>
            <rect x="5" y="12" width="5" height="6" fill="#BAE6FD"/>
            <rect x="28" y="10" width="9" height="11" fill="#38BDF8" stroke="#191724" stroke-width="1"/>
            <rect x="30" y="12" width="5" height="6" fill="#BAE6FD"/>
            <rect x="5" y="4" width="4" height="4" fill="#FFFFFF"/><rect x="31" y="4" width="4" height="4" fill="#7DD3FC"/>
          </svg>`;
        case 5: // Ch.5 Final: Archmage Wizard Hat Crystal Sovereign + Orbiting Rune Rings
          return `<svg class="quiz-pixel-svg" viewBox="0 0 40 40">
            <rect x="16" y="2" width="8" height="5" fill="#6D28D9" stroke="#191724" stroke-width="1"/>
            <rect x="12" y="6" width="16" height="6" fill="#7C3AED" stroke="#191724" stroke-width="1"/>
            <rect x="12" y="10" width="16" height="2" fill="#FDE047"/>
            <rect x="7" y="12" width="26" height="3" fill="#4C1D95" stroke="#191724" stroke-width="1"/>
            <rect x="12" y="15" width="16" height="15" fill="#9333EA" stroke="#191724" stroke-width="1"/>
            <rect x="14" y="17" width="12" height="11" fill="#E879F9"/>
            <rect x="16" y="19" width="8" height="7" fill="#FDF4FF"/>
            <rect x="17" y="21" width="2" height="3" fill="#191724"/><rect x="21" y="21" width="2" height="3" fill="#191724"/>
            <rect x="3" y="22" width="34" height="3" fill="#67E8F9" stroke="#191724" stroke-width="1"/>
            <rect x="4" y="28" width="9" height="8" fill="#7E22CE" stroke="#191724" stroke-width="1"/>
            <rect x="6" y="29" width="5" height="3" fill="#D946EF"/>
            <rect x="27" y="28" width="9" height="8" fill="#7E22CE" stroke="#191724" stroke-width="1"/>
            <rect x="29" y="29" width="5" height="3" fill="#D946EF"/>
            <rect x="5" y="5" width="4" height="4" fill="#FDE047"/><rect x="31" y="6" width="4" height="4" fill="#67E8F9"/>
          </svg>`;
        case 6: // Ch.6 Final: Ancient Forest Mushroom Sovereign + Emerald Moss Crown + Fireflies
          return `<svg class="quiz-pixel-svg" viewBox="0 0 40 40">
            <rect x="10" y="3" width="20" height="7" fill="#24635C" stroke="#191724" stroke-width="1"/>
            <rect x="12" y="4" width="16" height="4" fill="#4BA38B"/>
            <rect x="15" y="4" width="6" height="2" fill="#A7F3D0"/>
            <rect x="5" y="9" width="30" height="13" fill="#B93822" stroke="#191724" stroke-width="1"/>
            <rect x="7" y="10" width="26" height="9" fill="#E05638"/>
            <rect x="9" y="11" width="5" height="4" fill="#FDE8D7"/>
            <rect x="19" y="10" width="5" height="4" fill="#FDE8D7"/>
            <rect x="27" y="14" width="5" height="4" fill="#FDE8D7"/>
            <rect x="12" y="22" width="16" height="14" fill="#D6A887" stroke="#191724" stroke-width="1"/>
            <rect x="14" y="23" width="12" height="12" fill="#F3D6B8"/>
            <rect x="15" y="26" width="3" height="3" fill="#191724"/><rect x="15" y="26" width="1" height="1" fill="#FFFFFF"/>
            <rect x="22" y="26" width="3" height="3" fill="#191724"/><rect x="22" y="26" width="1" height="1" fill="#FFFFFF"/>
            <rect x="14" y="30" width="2" height="2" fill="#F472B6"/><rect x="24" y="30" width="2" height="2" fill="#F472B6"/>
            <rect x="3" y="26" width="9" height="10" fill="#328071" stroke="#191724" stroke-width="1"/>
            <rect x="5" y="24" width="5" height="4" fill="#EC4899" stroke="#191724" stroke-width="1"/>
            <rect x="28" y="26" width="9" height="10" fill="#B93822" stroke="#191724" stroke-width="1"/>
            <rect x="30" y="28" width="4" height="3" fill="#FDE8D7"/>
            <rect x="4" y="5" width="4" height="4" fill="#A7F3D0" stroke="#191724" stroke-width="1"/>
            <rect x="32" y="5" width="4" height="4" fill="#FDE047" stroke="#191724" stroke-width="1"/>
          </svg>`;
        case 7: // Ch.7 Final: Sunrise Lantern Riverboat + Leaping Peach-Gold Koi + Blossoms
          return `<svg class="quiz-pixel-svg" viewBox="0 0 40 40">
            <rect x="18" y="3" width="2" height="20" fill="#78350F" stroke="#191724" stroke-width="1"/>
            <rect x="20" y="5" width="13" height="14" fill="#FFF7EB" stroke="#191724" stroke-width="1"/>
            <rect x="21" y="7" width="11" height="4" fill="#F29C8A"/>
            <rect x="21" y="13" width="10" height="3" fill="#FDD5AD"/>
            <rect x="7" y="7" width="8" height="10" fill="#F59E0B" stroke="#191724" stroke-width="1"/>
            <rect x="9" y="9" width="4" height="6" fill="#FEF08A"/>
            <rect x="5" y="22" width="30" height="8" fill="#92400E" stroke="#191724" stroke-width="1"/>
            <rect x="7" y="23" width="26" height="4" fill="#C26D3A"/>
            <rect x="2" y="30" width="36" height="7" fill="#3898D4" stroke="#191724" stroke-width="1"/>
            <rect x="6" y="32" width="10" height="2" fill="#E0F2FE"/>
            <rect x="24" y="33" width="8" height="2" fill="#E0F2FE"/>
            <rect x="26" y="25" width="9" height="6" fill="#F97316" stroke="#191724" stroke-width="1"/>
            <rect x="28" y="26" width="4" height="3" fill="#FFF7EB"/>
            <rect x="32" y="27" width="1" height="1" fill="#191724"/>
          </svg>`;
        default: // Ch.8 Final: Aurora Summit Arctic Snow Fox + Northern Lights Crown & Ice Crystals
          return `<svg class="quiz-pixel-svg" viewBox="0 0 40 40">
            <rect x="4" y="3" width="32" height="5" fill="#34D399" stroke="#1E3A5F" stroke-width="1"/>
            <rect x="8" y="4" width="24" height="2" fill="#67E8F9"/>
            <rect x="10" y="9" width="5" height="6" fill="#E0F2FE" stroke="#1E3A5F" stroke-width="1"/>
            <rect x="25" y="9" width="5" height="6" fill="#E0F2FE" stroke="#1E3A5F" stroke-width="1"/>
            <rect x="11" y="11" width="3" height="3" fill="#93C5FD"/>
            <rect x="26" y="11" width="3" height="3" fill="#93C5FD"/>
            <rect x="10" y="14" width="20" height="14" fill="#FFFFFF" stroke="#1E3A5F" stroke-width="1"/>
            <rect x="12" y="23" width="16" height="4" fill="#DBEAFE"/>
            <rect x="14" y="18" width="3" height="3" fill="#1E3A5F"/><rect x="14" y="18" width="1" height="1" fill="#38BDF8"/>
            <rect x="23" y="18" width="3" height="3" fill="#1E3A5F"/><rect x="23" y="18" width="1" height="1" fill="#38BDF8"/>
            <rect x="19" y="21" width="2" height="2" fill="#1E3A5F"/>
            <rect x="12" y="21" width="2" height="2" fill="#F472B6"/><rect x="26" y="21" width="2" height="2" fill="#F472B6"/>
            <rect x="11" y="28" width="18" height="4" fill="#DC2626" stroke="#191724" stroke-width="1"/>
            <rect x="24" y="30" width="4" height="7" fill="#DC2626" stroke="#191724" stroke-width="1"/>
            <rect x="3" y="26" width="8" height="11" fill="#60A5FA" stroke="#1E3A5F" stroke-width="1"/>
            <rect x="5" y="28" width="4" height="7" fill="#E0F2FE"/>
            <rect x="29" y="26" width="8" height="11" fill="#60A5FA" stroke="#1E3A5F" stroke-width="1"/>
            <rect x="31" y="28" width="4" height="7" fill="#E0F2FE"/>
          </svg>`;
      }
    };

    const getLeftSidePixelCharacterSVG = (chNum: number): string => {
      switch (chNum) {
        case 1:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="2" y="22" width="10" height="3" fill="#8F2229"/><rect x="1" y="25" width="11" height="3" fill="#286336"/>
            <rect x="11" y="5" width="3" height="3" fill="#B86B35"/><rect x="20" y="5" width="3" height="3" fill="#3D2618"/>
            <rect x="10" y="8" width="14" height="9" fill="#F5E6D3"/><rect x="10" y="8" width="5" height="5" fill="#B86B35"/><rect x="19" y="8" width="5" height="4" fill="#3D2618"/>
            <rect x="11" y="11" width="5" height="4" fill="#C79A3B"/><rect x="12" y="12" width="3" height="2" fill="#1F1A17"/>
            <rect x="18" y="11" width="5" height="4" fill="#C79A3B"/><rect x="19" y="12" width="3" height="2" fill="#1F1A17"/>
            <rect x="11" y="17" width="12" height="10" fill="#2A2623"/><rect x="16" y="17" width="2" height="6" fill="#3B8146"/>
            <rect x="13" y="21" width="9" height="4" fill="#FFF7DC"/>
            <rect x="24" y="11" width="2" height="8" fill="#F4C24E"/><rect x="25" y="9" width="3" height="3" fill="#FFFFFF"/>
          </svg>`;
        case 2:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="9" y="4" width="3" height="3" fill="#F2B84B"/><rect x="20" y="4" width="3" height="3" fill="#F2B84B"/>
            <rect x="8" y="7" width="16" height="10" fill="#3A121E"/><rect x="10" y="9" width="12" height="7" fill="#140A12"/>
            <rect x="12" y="12" width="3" height="2" fill="#FF3B3B"/><rect x="17" y="12" width="3" height="2" fill="#FF3B3B"/>
            <rect x="9" y="17" width="14" height="11" fill="#240D16"/><rect x="15" y="17" width="2" height="11" fill="#C93B3B"/>
            <rect x="3" y="10" width="2" height="18" fill="#7A6878"/><rect x="1" y="13" width="6" height="7" fill="#C93B3B"/><rect x="2" y="14" width="4" height="5" fill="#F2B84B"/>
          </svg>`;
        case 3:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="13" y="2" width="6" height="4" fill="#D97028"/><rect x="10" y="6" width="12" height="10" fill="#6D7A99"/>
            <rect x="12" y="10" width="8" height="3" fill="#1F2430"/><rect x="10" y="16" width="12" height="11" fill="#47526E"/>
            <rect x="2" y="14" width="9" height="13" fill="#D97028"/><rect x="3" y="15" width="7" height="11" fill="#47526E"/><rect x="5" y="17" width="3" height="7" fill="#F7C552"/>
            <rect x="24" y="10" width="2" height="17" fill="#8C531E"/><rect x="21" y="8" width="8" height="5" fill="#6D7A99"/>
          </svg>`;
        case 4:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <polygon points="14,1 22,9 6,9" fill="#393F8E"/><rect x="5" y="8" width="18" height="2" fill="#4CA3DD"/>
            <rect x="8" y="10" width="12" height="7" fill="#FFFFFF"/><rect x="10" y="12" width="2" height="2" fill="#545BB8"/><rect x="16" y="12" width="3" height="3" fill="#4CA3DD"/>
            <rect x="8" y="17" width="12" height="11" fill="#545BB8"/>
            <rect x="19" y="12" width="11" height="4" fill="#F4C24E"/><rect x="28" y="11" width="3" height="6" fill="#7CE0FF"/>
            <rect x="23" y="16" width="2" height="12" fill="#8C6810"/>
          </svg>`;
        case 5:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="12" y="1" width="6" height="4" fill="#5F24A8"/><rect x="7" y="7" width="16" height="2" fill="#EB76CD"/>
            <rect x="9" y="9" width="12" height="7" fill="#1B0C38"/><rect x="11" y="11" width="3" height="2" fill="#72F2EB"/><rect x="16" y="11" width="3" height="2" fill="#72F2EB"/>
            <rect x="9" y="16" width="12" height="12" fill="#5F24A8"/><rect x="14" y="16" width="2" height="12" fill="#EB76CD"/>
            <rect x="3" y="4" width="4" height="4" fill="#72F2EB"/><rect x="4" y="8" width="2" height="20" fill="#A566ED"/>
            <rect x="22" y="13" width="8" height="5" fill="#EB76CD"/><rect x="23" y="14" width="6" height="3" fill="#FFFFFF"/>
          </svg>`;
        case 6:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="8" y="7" width="14" height="3" fill="#9E741E"/><rect x="10" y="7" width="4" height="3" fill="#7CF2D4"/><rect x="16" y="7" width="4" height="3" fill="#7CF2D4"/>
            <rect x="8" y="10" width="14" height="7" fill="#F5E6D3"/><rect x="11" y="12" width="2" height="2" fill="#125E4A"/><rect x="17" y="12" width="2" height="2" fill="#125E4A"/>
            <rect x="8" y="17" width="14" height="11" fill="#FFFFFF"/><rect x="11" y="18" width="8" height="10" fill="#1C8A6E"/>
            <rect x="22" y="18" width="7" height="8" fill="#1C8A6E"/><rect x="23" y="20" width="5" height="5" fill="#7CF2D4"/>
          </svg>`;
        case 7:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="8" y="7" width="16" height="2" fill="#E6B435"/><rect x="9" y="9" width="14" height="8" fill="#FFFFFF"/>
            <rect x="12" y="12" width="2" height="2" fill="#2456B5"/><rect x="18" y="12" width="2" height="2" fill="#2456B5"/>
            <rect x="9" y="17" width="14" height="11" fill="#FFFFFF"/><rect x="9" y="17" width="6" height="11" fill="#2456B5"/><rect x="15" y="19" width="3" height="9" fill="#E6B435"/>
            <rect x="4" y="8" width="2" height="20" fill="#E6B435"/><rect x="2" y="5" width="6" height="5" fill="#E6B435"/>
          </svg>`;
        default:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="8" y="4" width="16" height="5" fill="#FFFDF7"/><rect x="7" y="8" width="3" height="9" fill="#EDE4CE"/><rect x="22" y="8" width="3" height="9" fill="#EDE4CE"/>
            <rect x="10" y="9" width="12" height="8" fill="#E8A856"/><rect x="12" y="12" width="2" height="2" fill="#1F1A17"/><rect x="18" y="12" width="2" height="2" fill="#1F1A17"/>
            <rect x="9" y="17" width="14" height="11" fill="#9E3E3E"/><rect x="14" y="17" width="4" height="11" fill="#FFFDF7"/>
            <rect x="25" y="9" width="2" height="11" fill="#8F580D"/><rect x="22" y="7" width="8" height="4" fill="#F7C948"/>
          </svg>`;
      }
    };

    const getRightSidePixelCharacterSVG = (chNum: number): string => {
      switch (chNum) {
        case 1:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="17" y="7" width="14" height="13" fill="#286336"/><rect x="18" y="8" width="12" height="11" fill="#FAF6EA"/>
            <rect x="20" y="10" width="4" height="4" fill="#3B8146"/><rect x="25" y="10" width="4" height="2" fill="#C79A3B"/>
            <rect x="20" y="20" width="2" height="8" fill="#5C4428"/><rect x="27" y="20" width="2" height="8" fill="#5C4428"/>
            <rect x="3" y="9" width="12" height="8" fill="#FFFFFF"/><rect x="5" y="12" width="2" height="2" fill="#4CA3DD"/><rect x="10" y="12" width="2" height="2" fill="#4CA3DD"/>
            <rect x="4" y="17" width="10" height="11" fill="#23272E"/><rect x="8" y="17" width="2" height="6" fill="#3B8146"/>
            <rect x="13" y="14" width="9" height="2" fill="#C79A3B"/>
          </svg>`;
        case 2:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="18" y="20" width="12" height="8" fill="#3B101B" stroke="#F2B84B" stroke-width="1"/><rect x="23" y="22" width="3" height="4" fill="#F2B84B"/>
            <rect x="6" y="4" width="2" height="4" fill="#C93B3B"/><rect x="14" y="4" width="2" height="4" fill="#C93B3B"/>
            <rect x="5" y="8" width="12" height="8" fill="#2E1C2B"/><rect x="7" y="11" width="2" height="2" fill="#F2B84B"/><rect x="12" y="11" width="2" height="2" fill="#F2B84B"/>
            <rect x="5" y="16" width="12" height="12" fill="#1B0F1A"/><rect x="17" y="4" width="2" height="24" fill="#8C7A8B"/><rect x="19" y="6" width="6" height="8" fill="#C93B3B"/>
          </svg>`;
        case 3:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="13" y="5" width="12" height="5" fill="#B3521B"/><rect x="16" y="6" width="6" height="3" fill="#F7C552"/>
            <rect x="13" y="10" width="12" height="7" fill="#E8934A"/><rect x="15" y="12" width="2" height="2" fill="#1F1A17"/><rect x="20" y="12" width="2" height="2" fill="#1F1A17"/>
            <rect x="13" y="17" width="12" height="11" fill="#6E421C"/><rect x="26" y="12" width="3" height="9" fill="#6D7A99"/>
            <rect x="2" y="17" width="12" height="6" fill="#363E52"/><rect x="5" y="22" width="6" height="6" fill="#8C531E"/><rect x="0" y="18" width="3" height="4" fill="#F7C552"/>
          </svg>`;
        case 4:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="2" y="8" width="10" height="14" fill="#F4C24E"/><rect x="4" y="10" width="6" height="10" fill="#7CE0FF"/><rect x="5" y="12" width="2" height="6" fill="#FFFFFF"/>
            <rect x="15" y="8" width="14" height="8" fill="#DCE3FA"/><rect x="18" y="11" width="2" height="2" fill="#393F8E"/><rect x="23" y="11" width="2" height="2" fill="#393F8E"/>
            <rect x="15" y="16" width="14" height="12" fill="#393F8E"/><rect x="19" y="16" width="6" height="12" fill="#4CA3DD"/>
          </svg>`;
        case 5:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="2" y="7" width="5" height="5" fill="#72F2EB"/><rect x="4" y="16" width="4" height="4" fill="#EB76CD"/>
            <rect x="18" y="2" width="2" height="4" fill="#72F2EB"/><rect x="13" y="6" width="12" height="9" fill="#3B2366"/><rect x="15" y="9" width="8" height="3" fill="#72F2EB"/>
            <rect x="10" y="15" width="18" height="13" fill="#28154A"/><rect x="16" y="18" width="6" height="6" fill="#EB76CD"/>
          </svg>`;
        case 6:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="3" y="21" width="8" height="7" fill="#B3521B"/><rect x="6" y="13" width="2" height="8" fill="#1C8A6E"/><rect x="3" y="7" width="8" height="6" fill="#F4D068"/>
            <rect x="14" y="5" width="16" height="3" fill="#D4A33E"/><rect x="16" y="8" width="12" height="8" fill="#9E7B56"/>
            <rect x="16" y="16" width="12" height="12" fill="#125E4A"/><rect x="19" y="18" width="6" height="10" fill="#D4A33E"/>
          </svg>`;
        case 7:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="2" y="11" width="11" height="3" fill="#E6B435"/><rect x="1" y="9" width="3" height="7" fill="#F7D358"/>
            <rect x="16" y="4" width="12" height="5" fill="#2456B5"/><rect x="16" y="9" width="12" height="7" fill="#F5E6D3"/>
            <rect x="16" y="16" width="12" height="12" fill="#183B82"/><rect x="20" y="19" width="4" height="4" fill="#E6B435"/>
          </svg>`;
        default:
          return `<svg class="quiz-pixel-svg" viewBox="0 0 32 32">
            <rect x="2" y="10" width="12" height="2" fill="#F7C948"/><rect x="7" y="8" width="2" height="10" fill="#C9821E"/>
            <rect x="1" y="12" width="4" height="4" fill="#9E3E3E"/><rect x="11" y="12" width="4" height="4" fill="#9E3E3E"/>
            <rect x="17" y="3" width="10" height="3" fill="#F7C948"/><rect x="16" y="6" width="12" height="9" fill="#FFFFFF"/><rect x="16" y="9" width="12" height="3" fill="#F5D79C"/>
            <rect x="16" y="15" width="12" height="13" fill="#FFF6E3"/><rect x="19" y="15" width="6" height="13" fill="#C9821E"/>
          </svg>`;
      }
    };

    const populateChapterDivider = (divider: HTMLElement, chapter: number, existingHintText?: string): void => {
      const theme = LearningHausStageCatalog.getChapterTheme(chapter);
      divider.dataset.chapterDivider = String(chapter);
      divider.style.setProperty("--chapter-accent", theme.accent);
      divider.style.setProperty("--chapter-secondary", theme.secondary);
      divider.style.setProperty("--chapter-banner-bg", theme.bannerBg);
      divider.style.setProperty("--chapter-banner-text", theme.bannerText);

      const roman = document.createElement("span");
      roman.className = "quiz-chapter-divider__roman";
      roman.textContent = theme.roman;

      const body = document.createElement("div");
      body.className = "quiz-chapter-divider__body";

      const chapterLine = document.createElement("strong");
      chapterLine.className = "quiz-chapter-divider__realm";
      chapterLine.textContent = `${LearningHausI18n.t("Chapter", "บทที่")} ${chapter}: ${theme.chapterTitle}`;

      const dividerHint = document.createElement("span");
      dividerHint.className = "quiz-chapter-divider__hint";
      dividerHint.dataset.chapterHint = String(chapter);
      if (existingHintText) dividerHint.textContent = existingHintText;

      body.append(chapterLine, dividerHint);
      divider.replaceChildren(roman, body);
    };

    const existingChapter2Divider = quizStage.querySelector<HTMLElement>('.quiz-chapter-divider[aria-label="Chapter 2"]');
    if (existingChapter2Divider) {
      const initialHint = existingChapter2Divider.querySelector<HTMLElement>("[data-chapter-hint]")?.textContent || "";
      populateChapterDivider(existingChapter2Divider, 2, initialHint);
    }

    // Replace Chapter 1's smooth illustrated cats with asymmetric Left & Right Pixel Side Characters
    const ch1LeftCat = quizStage.querySelector<HTMLElement>(".quiz-crop--black-cat");
    if (ch1LeftCat) {
      ch1LeftCat.classList.add("quiz-crop--pixel-side", "quiz-crop--pixel-side-left");
      ch1LeftCat.innerHTML = getLeftSidePixelCharacterSVG(1);
    }
    const ch1RightCat = quizStage.querySelector<HTMLElement>(".quiz-crop--orange-cat");
    if (ch1RightCat) {
      ch1RightCat.classList.add("quiz-crop--pixel-side", "quiz-crop--pixel-side-right");
      ch1RightCat.innerHTML = getRightSidePixelCharacterSVG(1);
    }

    const biomesFragment = document.createDocumentFragment();
    const biomeEdgeColors: Record<number, { top: string; bottom: string }> = {
      1: { top: "#2577CF", bottom: "#2D752E" }, // Sunflower Meadow
      2: { top: "#090711", bottom: "#120D1D" }, // Obsidian Vault
      3: { top: "#E08A4F", bottom: "#7C4625" }, // Amber Bastion (Brick Castle)
      4: { top: "#0F1733", bottom: "#4E70B0" }, // Mirror Observatory
      5: { top: "#0F0624", bottom: "#1C0C38" }, // Astral Spire
      6: { top: "#10262B", bottom: "#1A4A47" }, // Emerald Conservatory
      7: { top: "#F29C8A", bottom: "#2D6B47" }, // Riverside Village
      8: { top: "#081529", bottom: "#9EC0E6" }  // Snowy Peak
    };
    const mixHexColors = (hexA: string, hexB: string, ratio = 0.5): string => {
      const parse = (hex: string) => {
        const clean = hex.replace("#", "");
        return [
          parseInt(clean.slice(0, 2), 16),
          parseInt(clean.slice(2, 4), 16),
          parseInt(clean.slice(4, 6), 16)
        ];
      };
      const [r1, g1, b1] = parse(hexA);
      const [r2, g2, b2] = parse(hexB);
      const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
      return `#${toHex(r1 + (r2 - r1) * ratio)}${toHex(g1 + (g2 - g1) * ratio)}${toHex(b1 + (b2 - b1) * ratio)}`;
    };
    for (let chapter = 1; chapter <= chapterCount; chapter += 1) {
      const theme = LearningHausStageCatalog.getChapterTheme(chapter);
      const biomeTop = chapter === 1 ? 0 : 1910 + (chapter - 2) * 2030;
      const biomeHeight = chapter === 1 ? 1910 : chapter === chapterCount ? mapHeight - biomeTop : 2030;
      const biomeBottom = biomeTop + biomeHeight;
      const desktopTop = Math.round(biomeTop * 0.76);
      const desktopHeight = Math.round(biomeBottom * 0.76) - desktopTop;
      const tabletTop = Math.round(biomeTop * 0.68);
      const tabletHeight = Math.round(biomeBottom * 0.68) - tabletTop;
      const mobileTop = Math.round(biomeTop * 0.5);
      const mobileHeight = Math.round(biomeBottom * 0.5) - mobileTop;
      const biome = document.createElement("div");
      biome.className = `quiz-chapter-biome${theme.darkBiome ? " is-dark-biome" : ""}`;
      biome.dataset.chapterBiome = String(chapter);
      biome.setAttribute("aria-hidden", "true");
      biome.style.top = `${biomeTop}px`;
      biome.style.height = `${biomeHeight}px`;
      biome.style.setProperty("--quiz-biome-top-desktop", `${desktopTop}px`);
      biome.style.setProperty("--quiz-biome-height-desktop", `${desktopHeight}px`);
      biome.style.setProperty("--quiz-biome-top-tablet", `${tabletTop}px`);
      biome.style.setProperty("--quiz-biome-height-tablet", `${tabletHeight}px`);
      biome.style.setProperty("--quiz-biome-top-mobile", `${mobileTop}px`);
      biome.style.setProperty("--quiz-biome-height-mobile", `${mobileHeight}px`);
      biome.style.setProperty("--chapter-biome-bg", theme.biomeBg);
      biome.style.setProperty("--chapter-accent", theme.accent);
      biome.style.setProperty("--chapter-secondary", theme.secondary);
      biome.style.setProperty("--chapter-banner-bg", theme.bannerBg);
      biome.style.setProperty("--chapter-banner-text", theme.bannerText);
      const ownEdge = biomeEdgeColors[chapter] || { top: "#fafafa", bottom: "#fafafa" };
      const prevEdge = chapter > 1 ? biomeEdgeColors[chapter - 1]?.bottom : null;
      const nextEdge = chapter < chapterCount ? biomeEdgeColors[chapter + 1]?.top : null;
      const topSeamColor = prevEdge ? mixHexColors(prevEdge, ownEdge.top, 0.5) : "#fafafa";
      const bottomSeamColor = nextEdge ? mixHexColors(ownEdge.bottom, nextEdge, 0.5) : "#fafafa";
      biome.style.setProperty("--prev-biome-edge", topSeamColor);
      biome.style.setProperty("--next-biome-edge", bottomSeamColor);
      biome.innerHTML = getBiomeBackdropSVG(chapter, biomeHeight);
      biomesFragment.append(biome);
    }
    quizStage.prepend(biomesFragment);

    const extraChapters = document.createDocumentFragment();
    for (let chapter = 2; chapter <= chapterCount; chapter += 1) {
      const offset = (chapter - 2) * 2030;
      const firstStageTop = 2060 + offset;

      // Asymmetric Left & Right Flanking Pixel Side Characters for Chapters 2..8
      const leftGuardian = document.createElement("figure");
      leftGuardian.className = "quiz-crop quiz-crop--chapter-guardian quiz-crop--pixel-side quiz-crop--pixel-side-left";
      leftGuardian.dataset.guardianChapter = String(chapter);
      leftGuardian.dataset.guardianSide = "left";
      leftGuardian.style.left = "20px";
      leftGuardian.style.top = `${firstStageTop + 115}px`;
      leftGuardian.setAttribute("aria-hidden", "true");
      leftGuardian.innerHTML = getLeftSidePixelCharacterSVG(chapter);
      extraChapters.append(leftGuardian);

      const rightGuardian = document.createElement("figure");
      rightGuardian.className = "quiz-crop quiz-crop--chapter-guardian quiz-crop--pixel-side quiz-crop--pixel-side-right";
      rightGuardian.dataset.guardianChapter = String(chapter);
      rightGuardian.dataset.guardianSide = "right";
      rightGuardian.style.left = "455px";
      rightGuardian.style.top = `${firstStageTop + 495}px`;
      rightGuardian.setAttribute("aria-hidden", "true");
      rightGuardian.innerHTML = getRightSidePixelCharacterSVG(chapter);
      extraChapters.append(rightGuardian);

      if (chapter >= 3) {
        const divider = document.createElement("div");
        divider.className = "quiz-chapter-divider";
        divider.style.top = `${1935 + offset}px`;
        divider.setAttribute("role", "separator");
        divider.setAttribute("aria-label", `Chapter ${chapter}`);
        populateChapterDivider(divider, chapter);
        extraChapters.append(divider);

        for (let position = 0; position < stagesPerChapter; position += 1) {
          const stageIndex = (chapter - 1) * stagesPerChapter + position;
          const top = firstStageTop + position * 185;
          if (position < stagesPerChapter - 1) {
            const startX = nodeLefts[position] + 70;
            const nextX = nodeLefts[position + 1] + 70;
            const path = document.createElement("div");
            path.className = "quiz-stage__path quiz-stage__path--generated";
            path.dataset.stagePath = String(stageIndex);
            path.style.left = `${startX}px`;
            path.style.top = `${top + 70}px`;
            path.style.width = `${Math.hypot(nextX - startX, 185)}px`;
            path.style.setProperty("--quiz-path-angle", `${Math.atan2(185, nextX - startX)}rad`);
            path.setAttribute("aria-hidden", "true");
            extraChapters.append(path);
          }
          const node = document.createElement("a");
          node.className = "quiz-node is-locked";
          node.href = "#quiz";
          node.dataset.stageIndex = String(stageIndex);
          node.style.left = `${nodeLefts[position]}px`;
          node.style.top = `${top}px`;
          node.setAttribute("aria-label", `Stage ${stageIndex + 1} locked`);
          node.setAttribute("aria-disabled", "true");
          const number = document.createElement("span");
          number.className = "quiz-node__glyph";
          number.setAttribute("aria-hidden", "true");
          number.textContent = String(stageIndex + 1);
          const lock = document.createElement("span");
          lock.className = "quiz-node__lock";
          lock.setAttribute("aria-hidden", "true");
          lock.innerHTML = LearningHausIcons.svg("lock");
          node.append(number, lock);
          extraChapters.append(node);
        }
      }
    }
    quizStage.append(extraChapters);

    quizStage.style.setProperty("--quiz-map-height", `${Math.ceil(mapHeight * 0.76)}px`);
    quizStage.style.setProperty("--quiz-map-height-tablet", `${Math.ceil(mapHeight * 0.68)}px`);
    quizStage.style.setProperty("--quiz-map-height-mobile", `${Math.ceil(mapHeight * 0.5)}px`);
    const chapterOneNodeLefts = [295, 405, 295, 184, 292, 410, 292, 184, 292, 410];
    const chapterOneNodeTops = [30, 215, 400, 585, 770, 986, 1170, 1355, 1540, 1725];

    type DynamicChapterLayout = {
      chapter: number;
      stageCount: number;
      biomeTop: number;
      biomeHeight: number;
      dividerTop: number;
      firstStageTop: number;
      themePresetId: number;
      isCustom: boolean;
    };
    let activeChapterLayouts: DynamicChapterLayout[] | null = null;
    let reapplyCustomCourseRef: (() => void) | null = null;

    const getNodePosition = (index: number): { left: number; top: number } => {
      const chapter = Math.floor(index / stagesPerChapter) + 1;
      const position = index % stagesPerChapter;
      const customLayout = activeChapterLayouts?.[chapter - 1];
      if (customLayout?.isCustom) {
        return {
          left: chapter === 1 ? chapterOneNodeLefts[position] : nodeLefts[position],
          top: customLayout.firstStageTop + position * 185
        };
      }
      return {
        left: chapter === 1 ? chapterOneNodeLefts[position] : nodeLefts[position],
        top: chapter === 1 ? chapterOneNodeTops[position] : 2060 + (chapter - 2) * 2030 + position * 185
      };
    };

    const setScaledPosition = (item: HTMLElement, left: number, top: number): void => {
      item.style.setProperty("--quiz-map-left-desktop", `${left * 0.76}px`);
      item.style.setProperty("--quiz-map-top-desktop", `${top * 0.76}px`);
      item.style.setProperty("--quiz-map-left-tablet", `${left * 0.68}px`);
      item.style.setProperty("--quiz-map-top-tablet", `${top * 0.68}px`);
      item.style.setProperty("--quiz-map-left-mobile", `${left * 0.5}px`);
      item.style.setProperty("--quiz-map-top-mobile", `${top * 0.5}px`);
    };

    if (ch1LeftCat) setScaledPosition(ch1LeftCat, 18, 116);
    if (ch1RightCat) setScaledPosition(ch1RightCat, 455, 500);

    quizStage.querySelectorAll<HTMLElement>(".quiz-node[data-stage-index]").forEach((node) => {
      const index = Number(node.dataset.stageIndex);
      const chapter = Math.floor(index / stagesPerChapter) + 1;
      const stagePosition = index % stagesPerChapter;
      const theme = LearningHausStageCatalog.getChapterTheme(chapter);
      node.dataset.chapter = String(chapter);
      node.classList.toggle("is-dark-biome-node", theme.darkBiome);
      node.style.setProperty("--chapter-accent", theme.accent);
      node.style.setProperty("--chapter-shadow", theme.shadow);
      node.style.setProperty("--chapter-secondary", theme.secondary);
      const position = getNodePosition(index);
      setScaledPosition(node, position.left, position.top);

      // 3-Tier Theme-Matched Pixel Clinging Mascots:
      // Tier 3 (Grand 40x40 Final Boss Guardian) on Stage 10 -> Tier 2 (32x32 Mid Mascot) on Stages 3 & 6 -> Tier 1 (Simpler 24x24 Mini Props) on Stages 2,4,5,7,8,9!
      node.classList.toggle("is-final-stage", stagePosition === 9);
      if (!node.querySelector(".quiz-node__ornaments")) {
        let creatureHTML = "";
        if (stagePosition === 9) {
          creatureHTML = `<span class="quiz-node__creature quiz-node__creature--final">${getStage4CreatureSVG(chapter)}</span>`;
        } else if (stagePosition === 2 || stagePosition === 5) {
          const side = stagePosition === 2 ? "quiz-node__creature--stage3" : "quiz-node__creature--mid-right";
          creatureHTML = `<span class="quiz-node__creature ${side}">${getStage3CreatureSVG(chapter)}</span>`;
        } else if (stagePosition > 0) {
          const sideCls = stagePosition % 2 === 1 ? "quiz-node__mini--right" : "quiz-node__mini--left";
          creatureHTML = `<span class="quiz-node__mini ${sideCls}" style="animation-delay:${(stagePosition % 4) * 0.4}s">${getMiniStagePropSVG(chapter, stagePosition)}</span>`;
        }
        if (creatureHTML) {
          const ornamentWrap = document.createElement("span");
          ornamentWrap.className = "quiz-node__ornaments";
          ornamentWrap.setAttribute("aria-hidden", "true");
          ornamentWrap.innerHTML = creatureHTML;
          node.prepend(ornamentWrap);
        }
      }
    });

    const trackColors: Record<number, { track: string; overlayStroke: string; overlayDash: string; overlayWidth: number }> = {
      1: { track: "rgba(254, 249, 195, 0.78)", overlayStroke: "#3B8146", overlayDash: "10 12", overlayWidth: 5.5 }, // Sunflower Meadow
      2: { track: "rgba(42, 24, 62, 0.82)", overlayStroke: "#FBBF24", overlayDash: "10 12", overlayWidth: 5.5 },    // Obsidian Vault
      3: { track: "rgba(254, 232, 200, 0.80)", overlayStroke: "#B45309", overlayDash: "10 12", overlayWidth: 5.5 }, // Amber Bastion (Brick Castle)
      4: { track: "rgba(219, 234, 254, 0.80)", overlayStroke: "#3B82F6", overlayDash: "10 12", overlayWidth: 5.5 }, // Mirror Observatory
      5: { track: "rgba(59, 20, 117, 0.82)", overlayStroke: "#E879F9", overlayDash: "10 12", overlayWidth: 5.5 },   // Astral Spire
      6: { track: "rgba(209, 250, 229, 0.78)", overlayStroke: "#1C8A6E", overlayDash: "10 12", overlayWidth: 5.5 }, // Emerald Conservatory
      7: { track: "rgba(255, 240, 226, 0.80)", overlayStroke: "#2C7A7B", overlayDash: "10 12", overlayWidth: 5.5 }, // Riverside Village
      8: { track: "rgba(224, 242, 254, 0.82)", overlayStroke: "#2563EB", overlayDash: "10 12", overlayWidth: 5.5 }  // Snowy Peak
    };

    const positionCurvedPath = (path: HTMLElement, index: number, isDarkOverride?: boolean, accentOverride?: string): void => {
      const chapter = Math.floor(index / stagesPerChapter) + 1;
      const theme = LearningHausStageCatalog.getChapterTheme(chapter);
      path.dataset.chapter = String(chapter);
      path.classList.add("quiz-stage__path--curved");
      path.classList.toggle("is-dark-biome-path", isDarkOverride ?? theme.darkBiome);
      path.style.setProperty("--chapter-path", accentOverride || theme.pathColor);
      const from = getNodePosition(index);
      const to = getNodePosition(index + 1);
      const x1 = from.left + 70;
      const y1 = from.top + 70;
      const x2 = to.left + 70;
      const y2 = to.top + 70;
      const pad = 42;
      const boxLeft = Math.min(x1, x2) - pad;
      const boxTop = Math.min(y1, y2) - pad;
      const boxWidth = Math.abs(x2 - x1) + pad * 2;
      const boxHeight = Math.abs(y2 - y1) + pad * 2;
      path.style.left = `${boxLeft}px`;
      path.style.top = `${boxTop}px`;
      path.style.width = `${boxWidth}px`;
      path.style.height = `${boxHeight}px`;
      setScaledPosition(path, boxLeft, boxTop);

      const sx = x1 - boxLeft;
      const sy = y1 - boxTop;
      const ex = x2 - boxLeft;
      const ey = y2 - boxTop;
      const dy = ey - sy;
      const bend = ex >= sx ? 26 : -26;
      const d = `M ${sx} ${sy} C ${sx + bend} ${sy + dy * 0.42}, ${ex - bend} ${sy + dy * 0.58}, ${ex} ${ey}`;
      const tc = trackColors[chapter] || trackColors[1];
      const strokeColor = accentOverride || tc.overlayStroke;

      path.innerHTML = `
        <svg class="quiz-stage__curve-svg" viewBox="0 0 ${boxWidth} ${boxHeight}" preserveAspectRatio="none" aria-hidden="true">
          <path class="quiz-curve__shadow" d="${d}" fill="none" stroke="rgba(8,14,22,0.18)" stroke-width="11" stroke-linecap="round"/>
          <path class="quiz-curve__base" d="${d}" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="6.5" stroke-dasharray="10 14" stroke-linecap="round"/>
          <path class="quiz-curve__active" d="${d}" fill="none" stroke="rgba(255,255,255,0.82)" stroke-width="6.5" stroke-dasharray="10 14" stroke-linecap="round"/>
          <path class="quiz-curve__overlay" d="${d}" fill="none" stroke="${strokeColor}" stroke-width="3.5" stroke-dasharray="10 14" stroke-linecap="round"/>
        </svg>
      `;
    };

    quizStage.querySelectorAll<HTMLElement>(".quiz-stage__path[data-stage-path]").forEach((path) => {
      positionCurvedPath(path, Number(path.dataset.stagePath));
    });
    quizStage.querySelectorAll<HTMLElement>(".quiz-chapter-divider").forEach((divider) => {
      const chapter = Number(divider.getAttribute("aria-label")?.replace("Chapter ", ""));
      setScaledPosition(divider, 40, 1922 + (chapter - 2) * 2030);
      divider.style.top = `${1922 + (chapter - 2) * 2030}px`;
    });
    quizStage.querySelectorAll<HTMLElement>(".quiz-crop--chapter-guardian").forEach((guardian) => {
      const chapter = Number(guardian.dataset.guardianChapter);
      const isLeft = guardian.dataset.guardianSide === "left";
      const firstStageTop = 2060 + (chapter - 2) * 2030;
      const guardianLeft = isLeft ? 20 : 455;
      const guardianTop = isLeft ? firstStageTop + 115 : firstStageTop + 495;
      setScaledPosition(guardian, guardianLeft, guardianTop);
    });

    const nodes = Array.from(quizView.querySelectorAll<HTMLElement>(".quiz-node[data-stage-index]"))
      .sort((a, b) => Number(a.dataset.stageIndex) - Number(b.dataset.stageIndex));
    const paths = new Map<number, HTMLElement>(
      Array.from(quizView.querySelectorAll<HTMLElement>(".quiz-stage__path[data-stage-path]"), (path) => [Number(path.dataset.stagePath), path])
    );
    const achievements = Array.from(document.querySelectorAll<HTMLElement>(".quiz-achievement-item[data-achievement-id]"));
    let serverAchievementSnapshot: ServerAchievementPayload | null = null;

    const readProgress = (key: string): string | null => {
      try {
        return window.localStorage.getItem(LearningHausAccountStorage.key(key));
      } catch {
        return null;
      }
    };

    const saveProgress = (key: string, value: string | number | boolean): void => {
      try {
        window.localStorage.setItem(LearningHausAccountStorage.key(key), String(value));
      } catch {
        // Storage is optional in restricted browser contexts.
      }
    };

    const readAchievementAttempts = (): StoredAttempt[] => {
      return LearningHausAccountStorage.readJson<StoredAttempt[]>("learninghaus.achievement.attempts", []);
    };

    const recordLearningDay = (): void => {
      const days = LearningHausAccountStorage.readJson<string[]>("learninghaus.achievement.activityDays", []);
      const today = new Date().toISOString().slice(0, 10);
      if (!days.includes(today)) days.push(today);
      LearningHausAccountStorage.writeJson("learninghaus.achievement.activityDays", days.slice(-365));
    };

    const recordAchievementAttempt = (detail: {
      index?: number;
      correctCount?: number;
      totalQuestions?: number;
      elapsedSeconds?: number;
      stageScore?: number;
    }): void => {
      const stageIndex = Number(detail.index);
      const correctAnswers = Number(detail.correctCount);
      const totalQuestions = Number(detail.totalQuestions);
      const elapsedSeconds = Number(detail.elapsedSeconds);
      if (!Number.isInteger(stageIndex) || !Number.isFinite(correctAnswers) || !Number.isFinite(totalQuestions) || !Number.isFinite(elapsedSeconds)) return;
      const attempts = readAchievementAttempts();
      recordLearningDay();
      attempts.push({
        courseId: "eu-ai-act",
        subjectId: "ai-law",
        stage: stageIndex + 1,
        score: Number(detail.stageScore) || 0,
        correct: correctAnswers,
        totalQuestions,
        timeSeconds: elapsedSeconds,
        completedAt: new Date().toISOString()
      });
      LearningHausAccountStorage.writeJson("learninghaus.achievement.attempts", attempts.slice(-1000));
    };

    const chapters = Array.from({ length: chapterCount }, (_, position) => {
      const chapter = position + 1;
      return {
        chapter,
        videoKey: `learninghaus.chapter${chapter}VideoCompleted`,
        progressKey: chapter === 1 ? "learninghaus.quizHighestPassed" : `learninghaus.quizChapter${chapter === 2 ? "Two" : chapter}HighestPassed`,
        videoCompleted: chapter === 1 || readProgress(`learninghaus.chapter${chapter}VideoCompleted`) === "true",
        highestUnlocked: -1,
        highestPassed: -1
      };
    });

    const getAchievementSnapshot = (): ServerAchievementPayload & { legacyUnlockedIds: string[] } => {
      const completedStages = new Set<number>();
      chapters.forEach((chapter) => {
        if (chapter.highestPassed < 0) return;
        const first = (chapter.chapter - 1) * stagesPerChapter;
        for (let stage = first; stage <= chapter.highestPassed; stage += 1) completedStages.add(stage + 1);
      });
      const attempts = readAchievementAttempts();
      const activeDays = new Set<string>();
      const savedDays = LearningHausAccountStorage.readJson<string[]>("learninghaus.achievement.activityDays", []);
      savedDays.forEach((day) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(day)) activeDays.add(day);
      });

      const bestByStage = new Map<number, number>();
      const improvedStages = new Set<number>();
      const minMissedCorrectByStage = new Map<number, number>();
      const comebackStages = new Set<number>();
      let perfectQuizzes = 0;
      let fastStages = 0;

      for (const attempt of attempts) {
        const stage = Number(attempt.stage);
        const correct = Number(attempt.correct);
        const score = Number(attempt.score ?? attempt.correct);
        const total = Number(attempt.totalQuestions);
        const seconds = Number(attempt.timeSeconds);
        const completedAt = String(attempt.completedAt || "");
        if (completedAt) activeDays.add(completedAt.slice(0, 10));
        if (total >= 5 && correct === total) perfectQuizzes += 1;
        if (total === 10 && correct >= 8 && seconds <= 180) fastStages += 1;

        const previousMissedCorrect = minMissedCorrectByStage.get(stage);
        if (
          previousMissedCorrect !== undefined &&
          total > 0 &&
          correct >= Math.ceil(total * 0.7) &&
          correct > previousMissedCorrect
        ) {
          comebackStages.add(stage);
        }
        if (total > 0 && correct < total) {
          minMissedCorrectByStage.set(
            stage,
            previousMissedCorrect === undefined ? correct : Math.min(previousMissedCorrect, correct)
          );
        }

        const previousBest = bestByStage.get(stage);
        if (previousBest !== undefined && score > previousBest) improvedStages.add(stage);
        if (previousBest === undefined || score > previousBest) bestByStage.set(stage, score);
      }

      const completedCourses = LearningHausStageCatalog.courses.filter((course) => {
        if (course.id !== "eu-ai-act") return false;
        return completedStages.size >= course.requiredLessons;
      }).length;
      const subjects = new Set(
        LearningHausStageCatalog.courses
          .filter((course) => course.id === "eu-ai-act" && completedStages.size > 0)
          .map((course) => course.subjectId)
      ).size;

      const chapterProgress: Record<string, number> = {};
      for (let chapter = 1; chapter <= chapterCount; chapter += 1) {
        const start = (chapter - 1) * stagesPerChapter + 1;
        let done = 0;
        for (let stage = start; stage < start + stagesPerChapter; stage += 1) {
          if (completedStages.has(stage)) done += 1;
        }
        chapterProgress[`eu-ai-act:${chapter}`] = done;
      }

      const legacyUnlockedIds = ["fast-thinker", "comeback"].filter(
        (id) => readProgress(`learninghaus.achievement.${id}`) === "true"
      );
      if (completedStages.has(1)) legacyUnlockedIds.push("beginner");
      for (let chapter = 1; chapter <= chapterCount; chapter += 1) {
        if (chapterProgress[`eu-ai-act:${chapter}`] >= stagesPerChapter) legacyUnlockedIds.push(`chapter-${chapter}`);
      }
      const savedLegacyIds = LearningHausAccountStorage.readJson<string[]>("learninghaus.achievement.legacyIds", []);
      legacyUnlockedIds.push(...savedLegacyIds);

      return {
        metrics: {
          completedLessons: completedStages.size,
          completedQuizzes: attempts.length,
          perfectQuizzes,
          fastStages,
          comebackPasses: comebackStages.size,
          subjects,
          improvedReplays: improvedStages.size,
          activeDays: activeDays.size,
          completedCourses,
          chapterProgress,
          creator: { available: false, publishedCourses: 0, createdLessons: 0, completedStudents: 0 }
        },
        legacyUnlockedIds
      };
    };

    const migrateLegacyAchievementAwards = (): void => {
      if (readProgress("learninghaus.achievement.legacyAwardsMigratedV1") === "true") return;
      const ids = new Set<string>(LearningHausAccountStorage.readJson<string[]>("learninghaus.achievement.legacyIds", []));
      if (chapters.slice(0, 4).every((chapter) => chapter.highestPassed >= chapter.chapter * stagesPerChapter - 1)) ids.add("expert");
      if (chapters.every((chapter) => chapter.highestPassed >= chapter.chapter * stagesPerChapter - 1)) ids.add("master");
      LearningHausAccountStorage.writeJson("learninghaus.achievement.legacyIds", Array.from(ids));
      saveProgress("learninghaus.achievement.legacyAwardsMigratedV1", true);
    };

    const updateChapterHint = (chapter: number): void => {
      if (chapter < 2 || chapter > chapterCount) return;
      const hint = quizView.querySelector<HTMLElement>(`[data-chapter-hint="${chapter}"]`);
      if (!hint) return;
      const progress = chapters[chapter - 1];
      const lastStage = chapter * stagesPerChapter - 1;
      hint.textContent = !progress.videoCompleted
        ? window.location.protocol === "file:"
          ? LearningHausI18n.t(
              `Open LearningHaus through a local web server, then finish the Chapter ${chapter} video.`,
              `เปิด LearningHaus ผ่านเซิร์ฟเวอร์ แล้วดูวิดีโอบทที่ ${chapter} ให้จบเพื่อปลดล็อกด่าน`
            )
          : LearningHausI18n.t(
              `Watch the full Chapter ${chapter} video to unlock these stages.`,
              `ดูวิดีโอบทที่ ${chapter} ให้จบเพื่อปลดล็อกด่านเหล่านี้`
            )
        : progress.highestPassed === lastStage
          ? LearningHausI18n.t(`Chapter ${chapter} complete.`, `ผ่านบทที่ ${chapter} ครบทั้งหมดแล้ว`)
          : LearningHausI18n.t(
              `Chapter ${chapter} unlocked. Continue with Stage ${progress.highestUnlocked + 1}.`,
              `ปลดล็อกบทที่ ${chapter} แล้ว เล่นต่อที่ด่าน ${progress.highestUnlocked + 1}`
            );
    };

    const setNodeState = (node: HTMLElement, unlocked: boolean): void => {
      const index = Number(node.dataset.stageIndex);
      const gameLabel = LearningHausStageCatalog.getStageGameLabel(index);
      node.classList.toggle("is-locked", !unlocked);
      node.classList.toggle("is-unlocked", unlocked);
      node.setAttribute("aria-disabled", String(!unlocked));
      node.setAttribute("aria-label", unlocked ? `Stage ${index + 1} · ${gameLabel}` : `Stage ${index + 1} · ${gameLabel} locked`);
      node.title = `Stage ${index + 1} · ${gameLabel}`;
    };

    const notifyStageProgressUpdated = (): void => {
      window.dispatchEvent(new CustomEvent("learninghaus:stage-progress-updated"));
    };

    const updateAchievements = (): void => {
      const localSnapshot = getAchievementSnapshot();
      const snapshot = serverAchievementSnapshot || localSnapshot;
      const unlocked = new Set([
        ...(snapshot.unlocked || []).map((item) => item.id),
        ...(localSnapshot.legacyUnlockedIds || [])
      ]);
      achievements.forEach((achievement) => {
        const id = achievement.dataset.achievementId || "";
        const definition = LearningHausAchievementCatalog.all.find((item) => item.id === id);
        const earned = unlocked.has(id) || Boolean(definition && LearningHausAchievementEngine.evaluate(definition, snapshot.metrics).unlocked);
        const nameNode = achievement.querySelector(".quiz-achievement-item__name");
        const name = nameNode ? nameNode.textContent : "Achievement";
        achievement.classList.toggle("quiz-achievement-item--locked", !earned);
        achievement.classList.toggle("is-unlocked", earned);
        achievement.setAttribute("aria-disabled", String(!earned));
        achievement.setAttribute("aria-label", earned ? `${name} achievement` : `${name} achievement locked`);
        let lock = achievement.querySelector<HTMLElement>(".quiz-achievement-item__lock");
        if (!lock) {
          lock = document.createElement("span");
          lock.className = "quiz-achievement-item__lock";
          lock.setAttribute("aria-hidden", "true");
          lock.innerHTML = LearningHausIcons.svg("lock");
          achievement.append(lock);
        } else if (!lock.querySelector(".lucide-icon")) {
          lock.innerHTML = LearningHausIcons.svg("lock");
        }
        lock.hidden = earned;
      });
      window.dispatchEvent(
        new CustomEvent("learninghaus:achievement-progress", {
          detail: {
            ...snapshot,
            legacyUnlockedIds: Array.from(new Set([...(snapshot.legacyUnlockedIds || []), ...(localSnapshot.legacyUnlockedIds || [])]))
          }
        })
      );
    };

    const unlockStage = (index: number): void => {
      if (!Number.isInteger(index) || index < 0 || index >= nodes.length) return;
      const chapterIndex = Math.floor(index / stagesPerChapter);
      const progress = chapters[chapterIndex];
      if (!progress.videoCompleted || index <= progress.highestUnlocked) return;
      const start = Math.max(chapterIndex * stagesPerChapter, progress.highestUnlocked + 1);
      for (let i = start; i <= index; i += 1) {
        setNodeState(nodes[i], true);
        const path = paths.get(i - 1);
        if (path) path.classList.add("is-connected");
      }
      progress.highestUnlocked = index;
      if (chapterIndex === 0) updateAchievements();
    };

    const passStage = (index: number): void => {
      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= nodes.length ||
        nodes[index].classList.contains("is-locked") ||
        nodes[index].classList.contains("is-passed")
      ) {
        return;
      }
      const chapterIndex = Math.floor(index / stagesPerChapter);
      const progress = chapters[chapterIndex];
      if (index > progress.highestUnlocked) return;
      nodes[index].classList.add("is-passed");
      if (index > progress.highestPassed) {
        progress.highestPassed = index;
        saveProgress(progress.progressKey, index);
      }
      if (index < (chapterIndex + 1) * stagesPerChapter - 1) unlockStage(index + 1);
      updateAchievements();
      updateChapterHint(progress.chapter);
      window.dispatchEvent(new CustomEvent("learninghaus:stage-passed", { detail: { index } }));
      notifyStageProgressUpdated();
    };

    const DEMO_COMPLETE_CHAPTERS_KEY = "learninghaus.quiz.demoCompleteAllChapters.v1";
    const DEMO_PROGRESS_BACKUP_KEY = "learninghaus.quiz.demoProgressBackup.v1";

    const isDemoCompleteAllChapters = (): boolean =>
      Boolean(LearningHausAccountStorage.readJson<boolean>(DEMO_COMPLETE_CHAPTERS_KEY, false));

    const removeProgressKey = (key: string): void => {
      try {
        window.localStorage.removeItem(LearningHausAccountStorage.key(key));
      } catch {
        // Optional in restricted browser contexts.
      }
    };

    const loadAllProgress = (): void => {
      const demoAllComplete = isDemoCompleteAllChapters();
      nodes.forEach((node) => {
        setNodeState(node, false);
        node.classList.remove("is-passed");
      });
      paths.forEach((path) => path.classList.remove("is-connected"));

      chapters.forEach((progress, chapterIndex) => {
        progress.videoCompleted = demoAllComplete || progress.chapter === 1 || readProgress(progress.videoKey) === "true";
        progress.highestUnlocked = -1;
        progress.highestPassed = -1;
        if (!progress.videoCompleted) {
          updateChapterHint(progress.chapter);
          return;
        }
        const firstStage = chapterIndex * stagesPerChapter;
        const lastStage = firstStage + stagesPerChapter - 1;
        unlockStage(firstStage);
        const storedPassed = demoAllComplete ? String(lastStage) : readProgress(progress.progressKey);
        const savedPassed = Number(storedPassed);
        if (storedPassed !== null && Number.isInteger(savedPassed) && savedPassed >= firstStage) {
          progress.highestPassed = Math.min(savedPassed, lastStage);
          unlockStage(Math.min(progress.highestPassed + 1, lastStage));
          for (let i = firstStage; i <= progress.highestPassed; i += 1) {
            setNodeState(nodes[i], true);
            nodes[i].classList.add("is-passed");
          }
        }
        updateChapterHint(progress.chapter);
      });
      migrateLegacyAchievementAwards();
      updateAchievements();
      notifyStageProgressUpdated();
    };

    window.addEventListener("learninghaus:achievement-server-loaded", (event) => {
      const detail = (event as CustomEvent<ServerAchievementPayload | null>).detail;
      serverAchievementSnapshot = detail;
      if (detail && Array.isArray(detail.completedStages) && detail.completedStages.length > 0) {
        let updatedAnyChapter = false;
        chapters.forEach((progress, chapterIndex) => {
          const firstStageIndex = chapterIndex * stagesPerChapter;
          const lastStageIndex = firstStageIndex + stagesPerChapter - 1;
          const completedIndexes = (detail.completedStages || [])
            .map((stageNum) => Number(stageNum) - 1)
            .filter((idx) => idx >= firstStageIndex && idx <= lastStageIndex);
          if (completedIndexes.length > 0) {
            const maxCompletedIndex = Math.max(...completedIndexes);
            if (!progress.videoCompleted) {
              progress.videoCompleted = true;
              saveProgress(progress.videoKey, true);
              updatedAnyChapter = true;
            }
            if (maxCompletedIndex > progress.highestPassed) {
              saveProgress(progress.progressKey, maxCompletedIndex);
              updatedAnyChapter = true;
            }
          }
        });
        if (updatedAnyChapter) {
          loadAllProgress();
          if (activeChapterLayouts) reapplyCustomCourseRef?.();
          return;
        }
      }
      updateAchievements();
      notifyStageProgressUpdated();
    });

    // =========================================================================
    // PLAYER-CREATED PIXEL CAT TRAVELER, CAMERA ZOOM/FOLLOW & WARP GATE SYSTEM
    // =========================================================================
    const playerTraveler = document.createElement("div");
    playerTraveler.className = "quiz-player-cat is-seated";
    playerTraveler.dataset.playerStageIndex = "0";
    playerTraveler.setAttribute("aria-hidden", "true");
    const playerShadow = document.createElement("span");
    playerShadow.className = "quiz-player-cat__shadow";
    const playerBadge = document.createElement("span");
    playerBadge.className = "quiz-player-cat__badge";
    playerBadge.textContent = "YOU";
    const playerCanvas = document.createElement("canvas");
    playerCanvas.className = "quiz-player-cat__canvas";
    playerCanvas.width = 156;
    playerCanvas.height = 156;
    playerTraveler.append(playerShadow, playerCanvas, playerBadge);
    quizStage.append(playerTraveler);

    const warpGateEl = document.createElement("div");
    warpGateEl.className = "quiz-warp-gate";
    warpGateEl.hidden = true;
    warpGateEl.setAttribute("aria-hidden", "true");
    warpGateEl.innerHTML = `
      <span class="quiz-warp-gate__aura"></span>
      <span class="quiz-warp-gate__ring quiz-warp-gate__ring--outer"></span>
      <span class="quiz-warp-gate__ring quiz-warp-gate__ring--inner"></span>
      <span class="quiz-warp-gate__core"></span>
      <span class="quiz-warp-gate__spark quiz-warp-gate__spark--1"></span>
      <span class="quiz-warp-gate__spark quiz-warp-gate__spark--2"></span>
      <span class="quiz-warp-gate__spark quiz-warp-gate__spark--3"></span>
      <span class="quiz-warp-gate__spark quiz-warp-gate__spark--4"></span>
    `;
    quizStage.append(warpGateEl);

    const warpFlashEl = document.createElement("div");
    warpFlashEl.className = "quiz-warp-flash";
    warpFlashEl.setAttribute("aria-hidden", "true");
    quizView.append(warpFlashEl);

    let irisOverlay = document.querySelector<HTMLElement>(".quiz-iris-transition");
    if (!irisOverlay) {
      irisOverlay = document.createElement("div");
      irisOverlay.className = "quiz-iris-transition";
      irisOverlay.setAttribute("aria-hidden", "true");
      document.body.append(irisOverlay);
    }

    let currentCatStageIndex = 0;
    let isCatWalking = false;
    let pendingCelebrationStageIndex: number | null = null;
    let catIdleFrameIdx = 0;
    const catIdleFrames: readonly LearningHausPixelCat.IdleAnimPose[] = [
      { swayDx: 0, breathDy: 0, tailDx: 0, jumpPhase: "idle" },
      { swayDx: 1, breathDy: 0, tailDx: 1, jumpPhase: "idle" },
      { swayDx: 0, breathDy: 1, tailDx: 0, jumpPhase: "idle" },
      { swayDx: -1, breathDy: 0, tailDx: -1, jumpPhase: "idle" }
    ];

    const renderPlayerTravelerCanvas = (pose?: LearningHausPixelCat.IdleAnimPose): void => {
      try {
        const cfg = window.LearningHausPixelCat?.getActiveConfig?.();
        if (cfg && window.LearningHausPixelCat?.renderCatToCanvas) {
          window.LearningHausPixelCat.renderCatToCanvas(
            playerCanvas,
            { ...cfg, showGrid: false },
            pose || catIdleFrames[catIdleFrameIdx % catIdleFrames.length]
          );
        }
      } catch {
        // Fallback if pixel cat studio is still initializing
      }
    };

    const getCatSeatedOffset = (stageIdx: number): { left: number; top: number } => {
      const nodePos = getNodePosition(stageIdx);
      // Sit perched cleanly on the checkpoint circle while keeping the stage number visible and never clipping at the top edge
      return {
        left: nodePos.left + 22,
        top: Math.max(12, nodePos.top - 18)
      };
    };

    const getMapViewportMetrics = (): { scale: number; mapWidth: number; jumpZoom: number; warpZoom: number } => {
      if (window.matchMedia("(min-width: 1025px)").matches) {
        return { scale: 0.76, mapWidth: 548, jumpZoom: 1.3, warpZoom: 1.36 };
      }
      if (window.matchMedia("(min-width: 769px)").matches) {
        return { scale: 0.68, mapWidth: 490, jumpZoom: 1.22, warpZoom: 1.26 };
      }
      return { scale: 0.5, mapWidth: 360, jumpZoom: 1.15, warpZoom: 1.18 };
    };

    // Transform-immune document Y coordinate (never corrupted by CSS transform: scale(...)!)
    const getLayoutDocumentTop = (el: HTMLElement): number => {
      let top = 0;
      let node: HTMLElement | null = el;
      while (node) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return top;
    };

    const isStageInternalScroller = (): boolean => {
      const ov = window.getComputedStyle(quizStage).overflowY;
      return (ov === "auto" || ov === "scroll") && quizStage.scrollHeight > quizStage.clientHeight + 20;
    };

    // Smooth camera rig: gradually zooms in onto the cat and follows its position seamlessly across Desktop, Tablet & Mobile
    const camera = {
      zoom: 1,
      targetZoom: 1,
      originX: 274,
      originY: 220,
      originInitialized: false,
      focusLeft: 317,
      focusTop: 12,
      following: false,
      manualScrollControl: false,
      followLerp: 0.16,
      zoomLerp: 0.09,
      rafId: null as number | null,
      idleZoomOutTimer: null as number | null
    };

    const clampValue = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));

    const getDesiredStageScrollForPoint = (left: number, top: number): {
      isDesktopScroller: boolean;
      targetScroll: number;
      contentX: number;
      contentY: number;
      stageW: number;
      stageH: number;
      stageDocTop: number;
    } => {
      const metrics = getMapViewportMetrics();
      const stageW = quizStage.clientWidth || metrics.mapWidth;
      const stageH = quizStage.clientHeight || window.innerHeight || 760;
      const shiftX = (stageW - metrics.mapWidth) / 2;
      const contentX = shiftX + (left + 48) * metrics.scale;
      const contentY = (top + 48) * metrics.scale;
      const isDesktopScroller = isStageInternalScroller();
      if (isDesktopScroller) {
        const maxScroll = Math.max(0, quizStage.scrollHeight - stageH);
        const targetScroll = clampValue(contentY - stageH * 0.48, 0, maxScroll);
        return { isDesktopScroller, targetScroll, contentX, contentY, stageW, stageH, stageDocTop: 0 };
      }
      const stageDocTop = getLayoutDocumentTop(quizStage);
      const maxWinScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const targetScroll = clampValue(stageDocTop + contentY - window.innerHeight * 0.45, 0, maxWinScroll);
      return { isDesktopScroller: false, targetScroll, contentX, contentY, stageW, stageH, stageDocTop };
    };

    const applyCameraStyles = (): void => {
      quizStage.style.setProperty("--camera-origin-x", `${camera.originX.toFixed(1)}px`);
      quizStage.style.setProperty("--camera-origin-y", `${camera.originY.toFixed(1)}px`);
      quizStage.style.setProperty("--camera-zoom", camera.zoom.toFixed(4));
      quizStage.classList.toggle("is-camera-zoomed", camera.zoom > 1.004);
    };

    const stepCamera = (): void => {
      camera.rafId = null;
      if (quizView.hidden) {
        camera.following = false;
        camera.zoom = 1;
        camera.targetZoom = 1;
        applyCameraStyles();
        return;
      }

      const reducedMotion = document.body.classList.contains("is-reduced-motion");
      const info = getDesiredStageScrollForPoint(camera.focusLeft, camera.focusTop);

      if (camera.following && !camera.manualScrollControl) {
        if (info.isDesktopScroller) {
          const curScroll = quizStage.scrollTop;
          const nextScroll = curScroll + (info.targetScroll - curScroll) * camera.followLerp;
          if (Math.abs(nextScroll - curScroll) > 0.25) {
            quizStage.scrollTop = nextScroll;
          } else {
            quizStage.scrollTop = info.targetScroll;
          }
        } else {
          const curWinScroll = window.scrollY;
          const nextWinScroll = curWinScroll + (info.targetScroll - curWinScroll) * camera.followLerp;
          if (Math.abs(nextWinScroll - curWinScroll) > 0.4) {
            window.scrollTo(0, nextWinScroll);
          } else if (Math.abs(info.targetScroll - curWinScroll) > 0.1) {
            window.scrollTo(0, info.targetScroll);
          }
        }
      }

      const desiredOriginX = clampValue(info.contentX, 0, info.stageW);
      // On internal scroller (Desktop): transform-origin is in border-box (0..stageH) relative to fresh scrollTop.
      // On document scroller (Tablet & Mobile): transform-origin === contentY keeps the cat the exact fixed point of scale(zoom)!
      const desiredOriginY = info.isDesktopScroller
        ? clampValue(info.contentY - quizStage.scrollTop, 0, info.stageH)
        : clampValue(info.contentY, 0, Math.max(quizStage.offsetHeight, quizStage.scrollHeight, info.stageH));

      if (!camera.originInitialized || reducedMotion) {
        camera.originX = desiredOriginX;
        camera.originY = desiredOriginY;
        camera.originInitialized = true;
      } else {
        const originLerp = info.isDesktopScroller ? 0.38 : 0.42;
        camera.originX += (desiredOriginX - camera.originX) * originLerp;
        camera.originY += (desiredOriginY - camera.originY) * originLerp;
      }

      const effectiveTargetZoom = reducedMotion ? 1 : camera.targetZoom;
      if (reducedMotion) {
        camera.zoom = 1;
      } else {
        camera.zoom += (effectiveTargetZoom - camera.zoom) * camera.zoomLerp;
        if (Math.abs(camera.zoom - effectiveTargetZoom) < 0.0012) {
          camera.zoom = effectiveTargetZoom;
        }
      }

      applyCameraStyles();

      const needsMoreFrames =
        camera.following ||
        Math.abs(camera.zoom - effectiveTargetZoom) > 0.0012;
      if (needsMoreFrames) {
        camera.rafId = window.requestAnimationFrame(stepCamera);
      }
    };

    window.addEventListener("resize", () => {
      camera.originInitialized = false;
    });

    const ensureCameraLoop = (): void => {
      if (camera.rafId === null) {
        camera.rafId = window.requestAnimationFrame(stepCamera);
      }
    };

    const clearIdleZoomOutTimer = (): void => {
      if (camera.idleZoomOutTimer !== null) {
        window.clearTimeout(camera.idleZoomOutTimer);
        camera.idleZoomOutTimer = null;
      }
    };

    const setCameraFocus = (
      left: number,
      top: number,
      targetZoom: number,
      followLerp = 0.14,
      zoomLerp = 0.085
    ): void => {
      clearIdleZoomOutTimer();
      camera.focusLeft = left;
      camera.focusTop = top;
      camera.targetZoom = targetZoom;
      camera.followLerp = followLerp;
      camera.zoomLerp = zoomLerp;
      camera.following = true;
      ensureCameraLoop();
    };

    const easeCameraOut = (delayMs = 0): void => {
      clearIdleZoomOutTimer();
      const triggerOut = (): void => {
        camera.idleZoomOutTimer = null;
        camera.following = false;
        camera.manualScrollControl = false;
        camera.targetZoom = 1;
        camera.zoomLerp = 0.095;
        ensureCameraLoop();
      };
      if (delayMs > 0) {
        camera.idleZoomOutTimer = window.setTimeout(triggerOut, delayMs);
      } else {
        triggerOut();
      }
    };

    const resetCameraImmediate = (): void => {
      clearIdleZoomOutTimer();
      if (camera.rafId !== null) {
        window.cancelAnimationFrame(camera.rafId);
        camera.rafId = null;
      }
      camera.following = false;
      camera.manualScrollControl = false;
      camera.zoom = 1;
      camera.targetZoom = 1;
      camera.originInitialized = false;
      applyCameraStyles();
    };

    // If the user scrolls manually with wheel or touch while zoomed in (idle), release zoom gently
    const handleManualCameraRelease = (): void => {
      if (!isCatWalking && (camera.zoom > 1.01 || camera.targetZoom > 1.01)) {
        easeCameraOut(0);
      }
    };
    quizStage.addEventListener("wheel", handleManualCameraRelease, { passive: true });
    quizStage.addEventListener("touchstart", handleManualCameraRelease, { passive: true });

    const applyCatVisuals = (
      left: number,
      top: number,
      arcJump = 0,
      tiltDeg = 0,
      scaleX = 1,
      scaleY = 1,
      opacity = 1
    ): void => {
      const renderTop = top - arcJump;
      playerTraveler.style.left = `${left}px`;
      playerTraveler.style.top = `${renderTop}px`;
      setScaledPosition(playerTraveler, left, renderTop);
      playerTraveler.style.setProperty("--cat-tilt", `${tiltDeg.toFixed(2)}deg`);
      playerTraveler.style.setProperty("--cat-sx", scaleX.toFixed(3));
      playerTraveler.style.setProperty("--cat-sy", scaleY.toFixed(3));
      playerTraveler.style.setProperty("--cat-shadow-drop", `${arcJump.toFixed(1)}px`);
      playerTraveler.style.setProperty("--cat-shadow-scale", Math.max(0.42, 1 - arcJump / 118).toFixed(3));
      playerTraveler.style.setProperty("--cat-shadow-opacity", Math.max(0.08, 0.28 - arcJump / 250).toFixed(3));
      playerTraveler.style.opacity = String(opacity);
    };

    const spawnDustPuff = (left: number, top: number, tintColor?: string): void => {
      if (document.body.classList.contains("is-reduced-motion")) return;
      const puff = document.createElement("span");
      puff.className = "quiz-cat-dust";
      puff.setAttribute("aria-hidden", "true");
      if (tintColor) puff.style.setProperty("--dust-tint", tintColor);
      const dustLeft = left + 48;
      const dustTop = top + 78;
      puff.style.left = `${dustLeft}px`;
      puff.style.top = `${dustTop}px`;
      setScaledPosition(puff, dustLeft, dustTop);
      quizStage.append(puff);
      window.setTimeout(() => puff.remove(), 420);
    };

    const positionWarpGate = (left: number, top: number, chapterNumber: number): void => {
      const theme = LearningHausStageCatalog.getChapterTheme(chapterNumber);
      warpGateEl.style.setProperty("--warp-accent", theme.accent);
      warpGateEl.style.setProperty("--warp-secondary", theme.secondary);
      warpGateEl.style.left = `${left}px`;
      warpGateEl.style.top = `${top}px`;
      setScaledPosition(warpGateEl, left, top);
    };

    const hideWarpEffects = (): void => {
      warpGateEl.hidden = true;
      warpGateEl.classList.remove("is-open", "is-closing", "is-burst", "is-departing", "is-arriving");
      warpFlashEl.classList.remove("is-active");
    };

    const placeCatAtStage = (stageIdx: number): void => {
      const clamped = Math.max(0, Math.min(nodes.length - 1, stageIdx));
      currentCatStageIndex = clamped;
      playerTraveler.dataset.playerStageIndex = String(clamped);
      const pos = getCatSeatedOffset(clamped);
      applyCatVisuals(pos.left, pos.top, 0, 0, 1, 1, 1);
    };

    const getDefaultSeatedStageIndex = (): number => {
      let best = 0;
      for (const ch of chapters) {
        if (ch.highestUnlocked >= 0) best = ch.highestUnlocked;
      }
      return Math.max(0, best);
    };

    window.setInterval(() => {
      if (quizView.hidden || isCatWalking) return;
      catIdleFrameIdx = (catIdleFrameIdx + 1) % catIdleFrames.length;
      renderPlayerTravelerCanvas();
    }, 360);

    window.addEventListener("learninghaus:pixel-cat-updated", () => {
      renderPlayerTravelerCanvas();
    });
    window.addEventListener("learninghaus:profile-updated", () => {
      renderPlayerTravelerCanvas();
    });

    let walkToken = 0;
    let activeWalkRafId: number | null = null;
    let activeWalkTimeoutId: number | null = null;
    let activeIrisCoverTimeoutId: number | null = null;
    let activeIrisOpenTimeoutId: number | null = null;

    const cancelPendingStageTransition = (): void => {
      walkToken += 1;
      if (activeWalkRafId !== null) {
        window.cancelAnimationFrame(activeWalkRafId);
        activeWalkRafId = null;
      }
      if (activeWalkTimeoutId !== null) {
        window.clearTimeout(activeWalkTimeoutId);
        activeWalkTimeoutId = null;
      }
      if (activeIrisCoverTimeoutId !== null) {
        window.clearTimeout(activeIrisCoverTimeoutId);
        activeIrisCoverTimeoutId = null;
      }
      if (activeIrisOpenTimeoutId !== null) {
        window.clearTimeout(activeIrisOpenTimeoutId);
        activeIrisOpenTimeoutId = null;
      }
      if (irisOverlay) {
        irisOverlay.classList.remove("is-active", "is-closing", "is-opening");
      }
      hideWarpEffects();
      resetCameraImmediate();
      if (isCatWalking) {
        isCatWalking = false;
        playerTraveler.classList.remove("is-walking", "is-jumping", "is-speed-hopping", "is-warping");
        playerTraveler.classList.add("is-seated");
        placeCatAtStage(currentCatStageIndex);
        renderPlayerTravelerCanvas({ swayDx: 0, breathDy: 0, tailDx: 0, jumpPhase: "idle" });
      }
    };

    window.addEventListener("learninghaus:cancel-quiz-travel", cancelPendingStageTransition);
    const quizViewElement = document.getElementById("quiz-view");
    if (quizViewElement) {
      const quizVisibilityObserver = new MutationObserver(() => {
        if (quizViewElement.hidden) cancelPendingStageTransition();
      });
      quizVisibilityObserver.observe(quizViewElement, { attributes: true, attributeFilter: ["hidden"] });
    }

    const runCircularIrisTransition = (targetNode: HTMLElement, token: number, onCovered: () => void): void => {
      if (token !== walkToken || quizViewElement?.hidden) return;
      if (!irisOverlay) {
        onCovered();
        return;
      }
      const rect = targetNode.getBoundingClientRect();
      const cx = rect.width > 0 ? Math.round(rect.left + rect.width / 2) : Math.round(window.innerWidth / 2);
      const cy = rect.height > 0 ? Math.round(rect.top + rect.height / 2) : Math.round(window.innerHeight / 2);
      irisOverlay.style.setProperty("--iris-x", `${cx}px`);
      irisOverlay.style.setProperty("--iris-y", `${cy}px`);

      irisOverlay.classList.remove("is-active", "is-closing", "is-opening");
      void irisOverlay.offsetWidth;
      irisOverlay.classList.add("is-active", "is-closing");

      // At peak blackout (circle closed to 0% + soft black fade), open the quiz stage and then iris-open out
      activeIrisCoverTimeoutId = window.setTimeout(() => {
        activeIrisCoverTimeoutId = null;
        if (token !== walkToken || quizViewElement?.hidden) {
          irisOverlay?.classList.remove("is-active", "is-closing", "is-opening");
          return;
        }
        resetCameraImmediate();
        onCovered();
        irisOverlay?.classList.remove("is-closing");
        irisOverlay?.classList.add("is-opening");
        activeIrisOpenTimeoutId = window.setTimeout(() => {
          activeIrisOpenTimeoutId = null;
          irisOverlay?.classList.remove("is-active", "is-opening");
        }, 620);
      }, 520);
    };

    // Core travel engine: camera zoom-in & follow, true jumping pose, distance-based speed scaling, and cross-chapter Warp Gate!
    const moveCatToStage = (
      targetIndex: number,
      options: { enterAfter: boolean; targetNode?: HTMLElement | null; zoomOutDelayMs?: number }
    ): void => {
      if (quizViewElement?.hidden) return;
      const clampedTarget = Math.max(0, Math.min(nodes.length - 1, targetIndex));
      const targetNode = options.targetNode || nodes[clampedTarget];
      if (!targetNode) return;

      // Allow interrupting an idle non-entering movement seamlessly
      if (isCatWalking) return;

      const token = ++walkToken;
      const startIndex = currentCatStageIndex;
      const startPos = getCatSeatedOffset(startIndex);
      const endPos = getCatSeatedOffset(clampedTarget);
      const reducedMotion = document.body.classList.contains("is-reduced-motion");
      const metrics = getMapViewportMetrics();

      const startChapter = Math.floor(startIndex / stagesPerChapter) + 1;
      const targetChapter = Math.floor(clampedTarget / stagesPerChapter) + 1;
      const stageDelta = Math.abs(clampedTarget - startIndex);

      isCatWalking = true;
      playerTraveler.classList.remove("is-seated");
      playerTraveler.classList.add("is-walking", "is-jumping");

      const finishArrival = (): void => {
        if (token !== walkToken || quizViewElement?.hidden) return;
        hideWarpEffects();
        placeCatAtStage(clampedTarget);
        playerTraveler.classList.remove("is-walking", "is-jumping", "is-speed-hopping", "is-warping");
        playerTraveler.classList.add("is-seated");
        renderPlayerTravelerCanvas({ swayDx: 0, breathDy: 0, tailDx: 0, jumpPhase: "idle" });
        setCameraFocus(endPos.left, endPos.top, metrics.jumpZoom, 0.16, 0.1);

        if (options.enterAfter) {
          activeWalkTimeoutId = window.setTimeout(() => {
            activeWalkTimeoutId = null;
            if (token !== walkToken || quizViewElement?.hidden) return;
            runCircularIrisTransition(targetNode, token, () => {
              if (token !== walkToken || quizViewElement?.hidden) return;
              isCatWalking = false;
              window.dispatchEvent(new CustomEvent("learninghaus:quiz-stage-open", { detail: { index: clampedTarget } }));
            });
          }, 120);
        } else {
          isCatWalking = false;
          easeCameraOut(options.zoomOutDelayMs ?? 1500);
        }
      };

      // =======================================================================
      // CASE A: CROSS-CHAPTER TRAVEL -> RUN THROUGH A GLOWING WARP GATE!
      // =======================================================================
      if (startChapter !== targetChapter) {
        playerTraveler.classList.add("is-warping");
        const depOnRight = startPos.left <= 300;
        const depGateLeft = depOnRight ? startPos.left + 110 : startPos.left - 110;
        const depGateTop = Math.max(8, startPos.top - 22);
        const depPortalCenterLeft = depGateLeft + 8;
        const depPortalCenterTop = depGateTop + 20;

        const arrOnRight = endPos.left <= 300;
        const arrGateLeft = arrOnRight ? endPos.left + 110 : endPos.left - 110;
        const arrGateTop = Math.max(8, endPos.top - 22);
        const arrPortalCenterLeft = arrGateLeft + 8;
        const arrPortalCenterTop = arrGateTop + 20;

        const targetTheme = LearningHausStageCatalog.getChapterTheme(targetChapter);

        // Phase 1: Bring Departure Gate cleanly into view (snap if currently scrolled far away), then zoom in onto cat
        const depScrollInfo = getDesiredStageScrollForPoint((startPos.left + depPortalCenterLeft) * 0.5, startPos.top);
        const curScrollNow = depScrollInfo.isDesktopScroller ? quizStage.scrollTop : window.scrollY;
        if (Math.abs(depScrollInfo.targetScroll - curScrollNow) > window.innerHeight * 0.75) {
          if (depScrollInfo.isDesktopScroller) quizStage.scrollTop = depScrollInfo.targetScroll;
          else window.scrollTo(0, depScrollInfo.targetScroll);
        }
        camera.originInitialized = false;
        setCameraFocus(
          (startPos.left + depPortalCenterLeft) * 0.5,
          startPos.top,
          metrics.warpZoom,
          0.26,
          0.11
        );
        playerTraveler.classList.toggle("is-facing-left", !depOnRight);
        renderPlayerTravelerCanvas({ swayDx: 0, breathDy: 0, tailDx: -1, jumpPhase: "crouch" });
        applyCatVisuals(startPos.left, startPos.top, 0, depOnRight ? 5 : -5, 1.08, 0.9, 1);

        positionWarpGate(depGateLeft, depGateTop, targetChapter);
        warpGateEl.hidden = false;
        warpGateEl.classList.remove("is-closing", "is-burst", "is-arriving");
        void warpGateEl.offsetWidth;
        warpGateEl.classList.add("is-open", "is-departing");

        // Phase 2: Cat sprints/bounds into Departure Warp Gate
        activeWalkTimeoutId = window.setTimeout(() => {
          activeWalkTimeoutId = null;
          if (token !== walkToken || quizViewElement?.hidden) return;

          const runIntoDuration = 420;
          const runStart = performance.now();
          let lastDustT = -0.2;
          spawnDustPuff(startPos.left, startPos.top, targetTheme.accent);

          const stepRunIntoGate = (now: number): void => {
            activeWalkRafId = null;
            if (token !== walkToken || quizViewElement?.hidden) return;
            const t = Math.min(1, (now - runStart) / runIntoDuration);
            const easeIn = t * t * (2.2 - 1.2 * t);
            const curLeft = startPos.left + (depPortalCenterLeft - startPos.left) * easeIn;
            const curTop = startPos.top + (depPortalCenterTop - startPos.top) * easeIn;
            const strideArc = Math.abs(Math.sin(t * Math.PI * 2.5)) * 22 * (1 - t * 0.5);

            // Suck into the portal vortex at the end of the sprint
            const warpFactor = t > 0.66 ? (t - 0.66) / 0.34 : 0;
            const sx = warpFactor > 0 ? 1.32 - warpFactor * 1.12 : 1.06;
            const sy = warpFactor > 0 ? 0.8 - warpFactor * 0.62 : 0.95;
            const opacity = warpFactor > 0 ? Math.max(0, 1 - warpFactor * 1.15) : 1;
            const tilt = (depOnRight ? 1 : -1) * (10 + warpFactor * 10);

            applyCatVisuals(curLeft, curTop, strideArc, tilt, sx, sy, opacity);
            renderPlayerTravelerCanvas({
              swayDx: depOnRight ? 1 : -1,
              breathDy: 0,
              tailDx: depOnRight ? -1 : 1,
              jumpPhase: strideArc > 9 ? "air" : "launch"
            });
            setCameraFocus(curLeft, curTop, metrics.warpZoom, 0.22, 0.11);

            if (t - lastDustT >= 0.28 && t < 0.72) {
              lastDustT = t;
              spawnDustPuff(curLeft, curTop, targetTheme.accent);
            }

            if (t < 1) {
              activeWalkRafId = window.requestAnimationFrame(stepRunIntoGate);
              return;
            }

            // Flash & close Departure Gate, then glide through Hyperspace to Destination Chapter
            applyCatVisuals(depPortalCenterLeft, depPortalCenterTop, 0, 0, 0.2, 0.2, 0);
            warpGateEl.classList.add("is-burst", "is-closing");
            warpFlashEl.style.setProperty("--warp-accent", targetTheme.accent);
            warpFlashEl.style.setProperty("--warp-secondary", targetTheme.secondary);
            warpFlashEl.classList.add("is-active");

            const glideDuration = 520;
            const glideStart = performance.now();
            const startInfo = getDesiredStageScrollForPoint(startPos.left, startPos.top);
            const endInfo = getDesiredStageScrollForPoint(endPos.left, endPos.top);
            const startScroll = startInfo.isDesktopScroller ? quizStage.scrollTop : window.scrollY;
            const destScroll = endInfo.targetScroll;
            camera.manualScrollControl = true;

            const stepWarpGlide = (glideNow: number): void => {
              activeWalkRafId = null;
              if (token !== walkToken || quizViewElement?.hidden) return;
              const gt = Math.min(1, (glideNow - glideStart) / glideDuration);
              const ge = gt < 0.5 ? 4 * gt * gt * gt : 1 - Math.pow(-2 * gt + 2, 3) / 2;
              const curScroll = startScroll + (destScroll - startScroll) * ge;
              if (endInfo.isDesktopScroller) {
                quizStage.scrollTop = curScroll;
              } else {
                window.scrollTo(0, curScroll);
              }
              const midLeft = startPos.left + (endPos.left - startPos.left) * ge;
              const midTop = startPos.top + (endPos.top - startPos.top) * ge;
              // Gently pull zoom out to 1.0 during long hyperspace glide so viewport never clips off-axis
              setCameraFocus(midLeft, midTop, 1.0, 0.24, 0.16);

              if (gt < 1) {
                activeWalkRafId = window.requestAnimationFrame(stepWarpGlide);
                return;
              }

              // Phase 4: Snap exact scroll & zoom origin onto Arrival Warp Gate before zooming in!
              if (endInfo.isDesktopScroller) {
                quizStage.scrollTop = destScroll;
              } else {
                window.scrollTo(0, destScroll);
              }
              camera.manualScrollControl = false;
              camera.originInitialized = false;
              warpFlashEl.classList.remove("is-active");
              window.LearningHausSettings?.setBgmChapter?.(targetChapter);

              positionWarpGate(arrGateLeft, arrGateTop, targetChapter);
              warpGateEl.hidden = false;
              warpGateEl.classList.remove("is-closing", "is-burst", "is-departing", "is-open");
              void warpGateEl.offsetWidth;
              warpGateEl.classList.add("is-open", "is-arriving", "is-burst");

              playerTraveler.classList.toggle("is-facing-left", arrOnRight);
              setCameraFocus(endPos.left, endPos.top, metrics.warpZoom, 0.28, 0.13);

              activeWalkTimeoutId = window.setTimeout(() => {
                activeWalkTimeoutId = null;
                if (token !== walkToken || quizViewElement?.hidden) return;

                const exitDuration = 460;
                const exitStart = performance.now();
                const exitDir = arrOnRight ? -1 : 1;

                const stepExitGate = (exitNow: number): void => {
                  activeWalkRafId = null;
                  if (token !== walkToken || quizViewElement?.hidden) return;
                  const et = Math.min(1, (exitNow - exitStart) / exitDuration);
                  const easeOut = 1 - Math.pow(1 - et, 2.4);
                  const curLeft = arrPortalCenterLeft + (endPos.left - arrPortalCenterLeft) * easeOut;
                  const curTop = arrPortalCenterTop + (endPos.top - arrPortalCenterTop) * easeOut;
                  const leapArc = Math.sin(et * Math.PI) * 52;

                  const emerge = Math.min(1, et / 0.28);
                  const sx = emerge < 1 ? 0.25 + emerge * 0.92 : et > 0.85 ? 1.12 : 0.95;
                  const sy = emerge < 1 ? 0.3 + emerge * 0.82 : et > 0.85 ? 0.86 : 1.08;
                  const opacity = emerge;
                  const tilt = exitDir * (1 - et) * 14;

                  applyCatVisuals(curLeft, curTop, leapArc, tilt, sx, sy, opacity);
                  renderPlayerTravelerCanvas({
                    swayDx: exitDir as -1 | 0 | 1,
                    breathDy: 0,
                    tailDx: -exitDir as -1 | 0 | 1,
                    jumpPhase: et > 0.86 ? "land" : et > 0.25 ? "air" : "launch"
                  });
                  setCameraFocus(curLeft, curTop, metrics.jumpZoom, 0.22, 0.1);

                  if (et < 1) {
                    activeWalkRafId = window.requestAnimationFrame(stepExitGate);
                    return;
                  }

                  spawnDustPuff(endPos.left, endPos.top, targetTheme.accent);
                  warpGateEl.classList.remove("is-open", "is-burst");
                  warpGateEl.classList.add("is-closing");
                  placeCatAtStage(clampedTarget);
                  renderPlayerTravelerCanvas({ swayDx: 0, breathDy: 1, tailDx: 0, jumpPhase: "land" });
                  applyCatVisuals(endPos.left, endPos.top, 0, 0, 1.12, 0.86, 1);

                  activeWalkTimeoutId = window.setTimeout(() => {
                    activeWalkTimeoutId = null;
                    finishArrival();
                  }, 170);
                };

                activeWalkRafId = window.requestAnimationFrame(stepExitGate);
              }, 170);
            };

            activeWalkRafId = window.requestAnimationFrame(stepWarpGlide);
          };

          activeWalkRafId = window.requestAnimationFrame(stepRunIntoGate);
        }, 290);
        return;
      }

      // =======================================================================
      // CASE B: SAME-STAGE TAP -> ZOOM IN + JOYFUL READY JUMP IN PLACE
      // =======================================================================
      if (stageDelta === 0) {
        camera.originInitialized = false;
        setCameraFocus(startPos.left, startPos.top, metrics.jumpZoom, 0.24, 0.12);
        renderPlayerTravelerCanvas({ swayDx: 0, breathDy: 1, tailDx: 0, jumpPhase: "crouch" });
        applyCatVisuals(startPos.left, startPos.top, 0, 0, 1.12, 0.86, 1);

        activeWalkTimeoutId = window.setTimeout(() => {
          activeWalkTimeoutId = null;
          if (token !== walkToken || quizViewElement?.hidden) return;
          spawnDustPuff(startPos.left, startPos.top);
          const hopStart = performance.now();
          const hopMs = 390;

          const stepReadyHop = (now: number): void => {
            activeWalkRafId = null;
            if (token !== walkToken || quizViewElement?.hidden) return;
            const t = Math.min(1, (now - hopStart) / hopMs);
            const arcJump = Math.sin(t * Math.PI) * 44;
            const sx = t < 0.25 ? 0.92 : t > 0.82 ? 1.12 : 1.02;
            const sy = t < 0.25 ? 1.12 : t > 0.82 ? 0.86 : 1.04;
            applyCatVisuals(startPos.left, startPos.top, arcJump, 0, sx, sy, 1);
            renderPlayerTravelerCanvas({
              swayDx: 0,
              breathDy: 0,
              tailDx: t < 0.5 ? 1 : -1,
              jumpPhase: t < 0.22 ? "launch" : t < 0.82 ? "air" : "land"
            });
            setCameraFocus(startPos.left, startPos.top - arcJump * 0.25, metrics.jumpZoom, 0.16, 0.11);

            if (t < 1) {
              activeWalkRafId = window.requestAnimationFrame(stepReadyHop);
              return;
            }
            spawnDustPuff(startPos.left, startPos.top);
            finishArrival();
          };

          activeWalkRafId = window.requestAnimationFrame(stepReadyHop);
        }, 95);
        return;
      }

      // =======================================================================
      // CASE C: SAME-CHAPTER STAGE-BY-STAGE JUMPING (SLOW CLOSE, FAST WHEN FAR)
      // =======================================================================
      const stepDir = clampedTarget > startIndex ? 1 : -1;
      const waypoints: number[] = [];
      for (let idx = startIndex; idx !== clampedTarget; idx += stepDir) {
        waypoints.push(idx + stepDir);
      }

      // Dynamic pacing: slow & expressive for nearby levels, smoothly accelerates for far levels
      const isFarJump = stageDelta >= 4;
      playerTraveler.classList.toggle("is-speed-hopping", isFarJump);

      let crouchMs = 95;
      let hopDuration = 520;
      let landPauseMs = 125;
      let arcHeight = 56;
      let followLerp = 0.13;
      if (stageDelta === 2) {
        crouchMs = 80;
        hopDuration = 460;
        landPauseMs = 105;
        arcHeight = 52;
        followLerp = 0.15;
      } else if (stageDelta === 3) {
        crouchMs = 64;
        hopDuration = 380;
        landPauseMs = 80;
        arcHeight = 48;
        followLerp = 0.18;
      } else if (stageDelta === 4) {
        crouchMs = 38;
        hopDuration = 245;
        landPauseMs = 42;
        arcHeight = 42;
        followLerp = 0.25;
      } else if (stageDelta === 5) {
        crouchMs = 30;
        hopDuration = 210;
        landPauseMs = 32;
        arcHeight = 39;
        followLerp = 0.29;
      } else if (stageDelta >= 6) {
        crouchMs = 22;
        hopDuration = 165;
        landPauseMs = 22;
        arcHeight = 36;
        followLerp = 0.35;
      }

      // Start gradually zooming camera in on the cat immediately (pre-frame if scrolled far away!)
      const hopStartInfo = getDesiredStageScrollForPoint(startPos.left, startPos.top);
      const curHopScroll = hopStartInfo.isDesktopScroller ? quizStage.scrollTop : window.scrollY;
      if (Math.abs(hopStartInfo.targetScroll - curHopScroll) > window.innerHeight * 0.75) {
        if (hopStartInfo.isDesktopScroller) quizStage.scrollTop = hopStartInfo.targetScroll;
        else window.scrollTo(0, hopStartInfo.targetScroll);
      }
      camera.originInitialized = false;
      setCameraFocus(startPos.left, startPos.top, metrics.jumpZoom, Math.max(0.22, followLerp), isFarJump ? 0.12 : 0.09);

      let legCursor = 0;
      let legFromIndex = startIndex;

      const runHopLeg = (): void => {
        activeWalkTimeoutId = null;
        if (token !== walkToken || quizViewElement?.hidden) return;
        if (legCursor >= waypoints.length) {
          finishArrival();
          return;
        }

        const legToIndex = waypoints[legCursor];
        const fromPos = getCatSeatedOffset(legFromIndex);
        const toPos = getCatSeatedOffset(legToIndex);
        const dx = toPos.left - fromPos.left;
        const dirSign: -1 | 0 | 1 = dx < -4 ? -1 : dx > 4 ? 1 : 0;

        if (dirSign < 0) {
          playerTraveler.classList.add("is-facing-left");
        } else if (dirSign > 0) {
          playerTraveler.classList.remove("is-facing-left");
        }

        // Brief crouch anticipation before leaping
        renderPlayerTravelerCanvas({ swayDx: 0, breathDy: 1, tailDx: -dirSign as -1 | 0 | 1, jumpPhase: "crouch" });
        applyCatVisuals(fromPos.left, fromPos.top, 0, dirSign * 4, 1.13, 0.85, 1);
        setCameraFocus(fromPos.left, fromPos.top, metrics.jumpZoom, followLerp, isFarJump ? 0.11 : 0.085);

        activeWalkTimeoutId = window.setTimeout(() => {
          activeWalkTimeoutId = null;
          if (token !== walkToken || quizViewElement?.hidden) return;

          spawnDustPuff(fromPos.left, fromPos.top);
          const legStart = performance.now();

          const stepHop = (now: number): void => {
            activeWalkRafId = null;
            if (token !== walkToken || quizViewElement?.hidden) return;
            const t = Math.min(1, (now - legStart) / hopDuration);
            const easeX = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            const curveBend = Math.sin(t * Math.PI) * (dirSign * 14);
            const arcJump = Math.sin(t * Math.PI) * arcHeight;

            const curLeft = fromPos.left + (toPos.left - fromPos.left) * easeX + curveBend;
            const curTop = fromPos.top + (toPos.top - fromPos.top) * easeX;

            // Squash & stretch + directional air tilt
            let sx = 1;
            let sy = 1;
            let tilt = 0;
            let jumpPhase: LearningHausPixelCat.CatJumpPhase = "air";
            if (t < 0.22) {
              sx = 0.9;
              sy = 1.14;
              tilt = dirSign * 9;
              jumpPhase = "launch";
            } else if (t < 0.78) {
              sx = 1.03;
              sy = 1.02;
              tilt = dirSign * (6 - (t - 0.22) * 14);
              jumpPhase = "air";
            } else {
              sx = 0.94;
              sy = 1.09;
              tilt = -dirSign * 5;
              jumpPhase = "launch";
            }

            applyCatVisuals(curLeft, curTop, arcJump, tilt, sx, sy, 1);
            renderPlayerTravelerCanvas({
              swayDx: dirSign,
              breathDy: 0,
              tailDx: -dirSign as -1 | 0 | 1,
              jumpPhase
            });

            // Continuously pan & keep camera zoomed onto the jumping cat
            setCameraFocus(curLeft, curTop - arcJump * 0.25, metrics.jumpZoom, followLerp, isFarJump ? 0.11 : 0.085);

            if (t < 1) {
              activeWalkRafId = window.requestAnimationFrame(stepHop);
              return;
            }

            // Cushioned landing on intermediate stage
            placeCatAtStage(legToIndex);
            spawnDustPuff(toPos.left, toPos.top);
            applyCatVisuals(toPos.left, toPos.top, 0, 0, 1.14, 0.84, 1);
            renderPlayerTravelerCanvas({ swayDx: 0, breathDy: 1, tailDx: 0, jumpPhase: "land" });
            setCameraFocus(toPos.left, toPos.top, metrics.jumpZoom, followLerp, 0.1);

            legFromIndex = legToIndex;
            legCursor += 1;

            if (legCursor < waypoints.length) {
              activeWalkTimeoutId = window.setTimeout(runHopLeg, landPauseMs);
            } else {
              activeWalkTimeoutId = window.setTimeout(finishArrival, Math.min(115, landPauseMs));
            }
          };

          activeWalkRafId = window.requestAnimationFrame(stepHop);
        }, crouchMs);
      };

      runHopLeg();
    };

    const walkCatToStageAndEnter = (targetIndex: number, targetNode: HTMLElement): void => {
      moveCatToStage(targetIndex, { enterAfter: true, targetNode });
    };

    loadAllProgress();
    renderPlayerTravelerCanvas();
    placeCatAtStage(getDefaultSeatedStageIndex());

    window.addEventListener("learninghaus:social-session", () => {
      serverAchievementSnapshot = null;
      loadAllProgress();
      renderPlayerTravelerCanvas();
      if (!isCatWalking) placeCatAtStage(getDefaultSeatedStageIndex());
      const legacyIds = getAchievementSnapshot().legacyUnlockedIds;
      if (legacyIds.length) {
        void window.LearningHausSocial?.importLegacyAchievements?.(legacyIds).catch(() => {
          // Keep local achievement records when offline.
        });
      }
    });

    window.addEventListener("learninghaus:chapter-video-ended", (event) => {
      const detail = (event as CustomEvent<{ chapter?: number }>).detail;
      const chapter = Number(detail?.chapter);
      if (!Number.isInteger(chapter) || chapter < 1 || chapter > chapterCount) return;
      const progress = chapters[chapter - 1];
      progress.videoCompleted = true;
      saveProgress(progress.videoKey, true);
      recordLearningDay();
      void window.LearningHausSocial?.recordLearningActivity?.().catch(() => {
        // Offline mode continues using localStorage.
      });
      updateAchievements();
      unlockStage((chapter - 1) * stagesPerChapter);
      updateChapterHint(chapter);
      notifyStageProgressUpdated();
    });

    quizView.addEventListener(
      "click",
      (event) => {
        const target = event.target as HTMLElement | null;
        const node = target?.closest<HTMLElement>(".quiz-node[data-stage-index]");
        if (!node) return;

        event.preventDefault();
        event.stopPropagation();
        if (isCatWalking) return;
        const index = Number(node.dataset.stageIndex);
        if (node.classList.contains("is-locked")) {
          node.classList.remove("is-shaking");
          void node.offsetWidth;
          node.classList.add("is-shaking");
          return;
        }
        walkCatToStageAndEnter(index, node);
      },
      true
    );

    // Directional movement on the Stage Map (Arrow keys / WASD) with camera zoom-in & jumping
    window.addEventListener("keydown", (event) => {
      if (quizView.hidden || isCatWalking) return;
      if (document.body.classList.contains("quiz-flow-open")) return;
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT" ||
          activeEl.isContentEditable ||
          Boolean(activeEl.closest("dialog[open], .looking-people-page:not([hidden])")))
      ) {
        return;
      }

      const key = event.key;
      const isDirKey =
        key === "ArrowUp" ||
        key === "ArrowDown" ||
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "w" ||
        key === "W" ||
        key === "s" ||
        key === "S" ||
        key === "a" ||
        key === "A" ||
        key === "d" ||
        key === "D";

      if (key === "Enter" && activeEl === quizStage) {
        const currentNode = nodes[currentCatStageIndex];
        if (currentNode && !currentNode.classList.contains("is-locked")) {
          event.preventDefault();
          walkCatToStageAndEnter(currentCatStageIndex, currentNode);
        }
        return;
      }

      if (!isDirKey) return;

      const isUnlockedIdx = (idx: number): boolean =>
        idx >= 0 && idx < nodes.length && !nodes[idx].hidden && !nodes[idx].classList.contains("is-locked");

      const findNextUnlocked = (dir: 1 | -1): number | null => {
        for (let idx = currentCatStageIndex + dir; idx >= 0 && idx < nodes.length; idx += dir) {
          if (isUnlockedIdx(idx)) return idx;
        }
        return null;
      };

      let nextIdx: number | null = null;
      const curPos = getCatSeatedOffset(currentCatStageIndex);

      if (key === "ArrowDown" || key === "s" || key === "S") {
        nextIdx = findNextUnlocked(1);
      } else if (key === "ArrowUp" || key === "w" || key === "W") {
        nextIdx = findNextUnlocked(-1);
      } else if (key === "ArrowLeft" || key === "a" || key === "A") {
        const candidates = [currentCatStageIndex + 1, currentCatStageIndex - 1].filter(isUnlockedIdx);
        const leftMatch = candidates.find((idx) => getCatSeatedOffset(idx).left < curPos.left - 4);
        nextIdx = leftMatch ?? findNextUnlocked(-1);
      } else if (key === "ArrowRight" || key === "d" || key === "D") {
        const candidates = [currentCatStageIndex + 1, currentCatStageIndex - 1].filter(isUnlockedIdx);
        const rightMatch = candidates.find((idx) => getCatSeatedOffset(idx).left > curPos.left + 4);
        nextIdx = rightMatch ?? findNextUnlocked(1);
      }

      if (nextIdx !== null && nextIdx !== currentCatStageIndex) {
        event.preventDefault();
        moveCatToStage(nextIdx, { enterAfter: false, zoomOutDelayMs: 1700 });
      }
    });

    window.addEventListener("learninghaus:quiz-stage-complete", (event) => {
      const detail = (event as CustomEvent<{
        courseId?: string;
        index?: number;
        correctCount?: number;
        totalQuestions?: number;
        elapsedSeconds?: number;
        stageScore?: number;
      }>).detail;
      if (detail?.courseId && detail.courseId !== "eu-ai-act") return;
      const index = Number(detail?.index);
      if (Number.isInteger(index)) {
        serverAchievementSnapshot = null;
        recordAchievementAttempt(detail || {});
        updateAchievements();
        const prevBest = getDefaultSeatedStageIndex();
        passStage(index);
        const nextBest = getDefaultSeatedStageIndex();
        if (nextBest !== prevBest && nextBest !== currentCatStageIndex) {
          pendingCelebrationStageIndex = nextBest;
        } else if (!isCatWalking && !document.body.classList.contains("quiz-flow-open")) {
          placeCatAtStage(nextBest);
        }
      }
    });

    window.addEventListener("learninghaus:quiz-flow-closed", () => {
      if (pendingCelebrationStageIndex !== null && !quizView.hidden && !isCatWalking) {
        const nextStage = pendingCelebrationStageIndex;
        pendingCelebrationStageIndex = null;
        if (nextStage !== currentCatStageIndex && nodes[nextStage] && !nodes[nextStage].classList.contains("is-locked")) {
          window.setTimeout(() => {
            if (!quizView.hidden && !isCatWalking) {
              moveCatToStage(nextStage, { enterAfter: false, zoomOutDelayMs: 1300 });
            }
          }, 160);
        }
      }
    });

    // =========================================================================
    // SCROLL-REACTIVE CHAPTER BACKGROUND MUSIC & FLOATING BGM CONTROLLER
    // =========================================================================
    const bgmControlBtn = document.createElement("button");
    bgmControlBtn.type = "button";
    bgmControlBtn.className = "quiz-bgm-pill";
    bgmControlBtn.dataset.quizBgmPill = "";
    bgmControlBtn.setAttribute("aria-label", "Toggle chapter background music");
    const bgmIconSpan = document.createElement("span");
    bgmIconSpan.className = "quiz-bgm-pill__icon";
    bgmIconSpan.setAttribute("aria-hidden", "true");
    const bgmLabelSpan = document.createElement("span");
    bgmLabelSpan.className = "quiz-bgm-pill__label";
    bgmLabelSpan.dataset.quizBgmLabel = "";
    bgmControlBtn.append(bgmIconSpan, bgmLabelSpan);
    quizView.append(bgmControlBtn);

    const syncBgmPillUi = (): void => {
      const state = window.LearningHausSettings?.getBgmState?.() || {
        chapter: 1,
        title: "Sky Temple Serenity",
        enabled: true
      };
      const theme = LearningHausStageCatalog.getChapterTheme(state.chapter);
      bgmControlBtn.dataset.bgmChapter = String(state.chapter);
      bgmControlBtn.classList.toggle("is-muted", !state.enabled);
      bgmControlBtn.setAttribute("aria-pressed", String(state.enabled));
      bgmControlBtn.style.setProperty("--chapter-accent", theme.accent);
      bgmControlBtn.style.setProperty("--chapter-secondary", theme.secondary);
      bgmIconSpan.innerHTML = LearningHausIcons.svg(state.enabled ? "volume-2" : "volume-x");
      bgmLabelSpan.textContent = LearningHausI18n.t(
        `Ch.${state.chapter} · ${state.title}`,
        `บทที่ ${state.chapter} · เพลงประจำบท`
      );
    };

    bgmControlBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      window.LearningHausSettings?.toggleBackgroundMusic?.();
      syncBgmPillUi();
    });

    window.addEventListener("learninghaus:bgm-updated", syncBgmPillUi);
    window.addEventListener("learninghaus:language-changed", () => {
      syncBgmPillUi();
      for (let ch = 2; ch <= chapterCount; ch += 1) updateChapterHint(ch);
    });

    const detectScrolledChapter = (): number => {
      const biomes = Array.from(quizStage.querySelectorAll<HTMLElement>(".quiz-chapter-biome[data-chapter-biome]"));
      if (biomes.length > 0) {
        const stageRect = quizStage.getBoundingClientRect();
        const isDesktopScroller = quizStage.scrollHeight > quizStage.clientHeight + 20 && stageRect.height > 0;
        const probeViewportY = isDesktopScroller
          ? stageRect.top + stageRect.height * 0.42
          : window.innerHeight * 0.42;
        let bestChapter = 1;
        let bestDist = Infinity;
        for (const biome of biomes) {
          if (biome.hidden) continue;
          const rect = biome.getBoundingClientRect();
          const ch = Number(biome.dataset.chapterBiome) || 1;
          if (probeViewportY >= rect.top && probeViewportY <= rect.bottom) {
            return ch;
          }
          const centerDist = Math.abs((rect.top + rect.bottom) / 2 - probeViewportY);
          if (centerDist < bestDist) {
            bestDist = centerDist;
            bestChapter = ch;
          }
        }
        return bestChapter;
      }
      const scrollY = quizStage.scrollTop || window.scrollY || 0;
      const probeY = scrollY + 360;
      if (probeY < 1910) return 1;
      return Math.max(1, Math.min(chapterCount, Math.floor((probeY - 1910) / 2030) + 2));
    };

    let scrollBgmRaf: number | null = null;
    const handleMapScrollForBgm = (): void => {
      if (quizView.hidden) return;
      if (scrollBgmRaf !== null) return;
      scrollBgmRaf = window.requestAnimationFrame(() => {
        scrollBgmRaf = null;
        if (quizView.hidden) return;
        const targetChapter = detectScrolledChapter();
        window.LearningHausSettings?.setBgmChapter?.(targetChapter);
      });
    };

    quizStage.addEventListener("scroll", handleMapScrollForBgm, { passive: true });
    window.addEventListener("scroll", handleMapScrollForBgm, { passive: true });

    const setDemoCompleteAllChapters = (enabled: boolean): void => {
      LearningHausAccountStorage.writeJson(DEMO_COMPLETE_CHAPTERS_KEY, enabled);
      if (enabled) {
        const existingBackup = LearningHausAccountStorage.readJson<Record<string, string | null> | null>(
          DEMO_PROGRESS_BACKUP_KEY,
          null
        );
        if (!existingBackup) {
          const snapshot: Record<string, string | null> = {};
          chapters.forEach((ch) => {
            snapshot[ch.videoKey] = readProgress(ch.videoKey);
            snapshot[ch.progressKey] = readProgress(ch.progressKey);
          });
          LearningHausAccountStorage.writeJson(DEMO_PROGRESS_BACKUP_KEY, snapshot);
        }
        chapters.forEach((ch, idx) => {
          const lastStage = idx * stagesPerChapter + (stagesPerChapter - 1);
          saveProgress(ch.videoKey, true);
          saveProgress(ch.progressKey, lastStage);
        });
      } else {
        const backup = LearningHausAccountStorage.readJson<Record<string, string | null> | null>(
          DEMO_PROGRESS_BACKUP_KEY,
          null
        );
        if (backup) {
          chapters.forEach((ch) => {
            const origVideo = backup[ch.videoKey];
            const origProgress = backup[ch.progressKey];
            if (origVideo === null || origVideo === undefined) removeProgressKey(ch.videoKey);
            else saveProgress(ch.videoKey, origVideo);
            if (origProgress === null || origProgress === undefined) removeProgressKey(ch.progressKey);
            else saveProgress(ch.progressKey, origProgress);
          });
          removeProgressKey(DEMO_PROGRESS_BACKUP_KEY);
        }
      }
      serverAchievementSnapshot = null;
      loadAllProgress();
      if (!isCatWalking) {
        placeCatAtStage(enabled ? Math.min(currentCatStageIndex, Math.max(0, visibleChapterCount * stagesPerChapter - 1)) : getDefaultSeatedStageIndex());
      }
    };

    // =========================================================================
    // LEARN-FIRST GATE & CLEAN 1-LINE ACTIVE COURSE BAR ON QUIZ VIEW
    // =========================================================================
    const courseBarEl = quizView.querySelector<HTMLElement>("[data-quiz-course-bar]");
    const activeCourseNameEl = quizView.querySelector<HTMLElement>("[data-quiz-active-course-name]");
    const activeCourseMetaEl = quizView.querySelector<HTMLElement>("[data-quiz-active-course-meta]");
    const backToCourseBtn = quizView.querySelector<HTMLButtonElement>("[data-quiz-back-course]");
    const browseCoursesBtn = quizView.querySelector<HTMLButtonElement>("[data-quiz-browse-courses]");
    const learnGateEl = quizView.querySelector<HTMLElement>("[data-quiz-learn-gate]");
    const gateGoLearnBtn = quizView.querySelector<HTMLButtonElement>("[data-quiz-gate-go-learn]");
    const gateQuickWrap = quizView.querySelector<HTMLElement>("[data-quiz-gate-quick-wrap]");
    const gateQuickList = quizView.querySelector<HTMLElement>("[data-quiz-gate-quick-list]");
    let visibleChapterCount: number = chapterCount;
    let lastAppliedCourseId: string | null = null;

    const bookmarkFilledSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`;
    const bookOpenSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;

    const navigateToLearn = (subview: "hub" | "deck", courseId?: string): void => {
      cancelPendingStageTransition();
      const learnNav = document.querySelector<HTMLElement>('#quiz-view [data-home-nav="learn"]');
      learnNav?.click();
      if (subview === "deck") {
        window.LearningHausLearnHub?.showDeck?.(courseId);
      } else {
        window.LearningHausLearnHub?.showHub?.();
      }
    };

    const applyCourseMapLayout = (courseId: string): void => {
      const course =
        window.LearningHausLearnHub?.getAllCourses?.().find((c) => c.id === courseId) ||
        window.LearningHausLearnHub?.getActiveCourse?.();
      const targetChapters = course ? Math.max(1, Math.min(chapterCount, course.chapters.length)) : chapterCount;
      visibleChapterCount = targetChapters;
      const isCustomCourse = Boolean(course && course.id !== "eu-ai-act");

      let totalCustomHeight = 0;
      const customStagesByChapter: LearningHausCustomQuizStudio.CustomQuizStage[][] = [];

      if (isCustomCourse && course) {
        const layouts: DynamicChapterLayout[] = [];
        let curY = 0;
        for (let ch = 1; ch <= targetChapters; ch += 1) {
          const chObj = course.chapters[ch - 1];
          LearningHausCustomQuizStudio.ensureLessonQuizConfig(chObj, ch - 1);
          const chStages =
            chObj.quizStages && chObj.quizStages.length > 0
              ? chObj.quizStages
              : [LearningHausCustomQuizStudio.createDefaultStage(1, chObj.title)];
          customStagesByChapter.push(chStages);
          const stageCount = Math.max(1, Math.min(stagesPerChapter, chStages.length));
          const themePresetId = chObj.quizThemePreset || (((ch - 1) + 5) % 10) + 1;
          const biomeTop = curY;
          const dividerTop = ch === 1 ? 0 : curY + 22;
          const firstStageTop = ch === 1 ? 54 : curY + 150;
          const lastStageEnd = firstStageTop + (stageCount - 1) * 185 + 185;
          const biomeHeight = Math.max(460, lastStageEnd - biomeTop);
          layouts.push({
            chapter: ch,
            stageCount,
            biomeTop,
            biomeHeight,
            dividerTop,
            firstStageTop,
            themePresetId,
            isCustom: true
          });
          curY = biomeTop + biomeHeight;
        }
        activeChapterLayouts = layouts;
        totalCustomHeight = curY;
      } else {
        activeChapterLayouts = null;
      }

      // 1. Update chapter biomes (visibility, vertical span, and pixel biome backdrop image)
      quizStage.querySelectorAll<HTMLElement>(".quiz-chapter-biome[data-chapter-biome]").forEach((biome) => {
        const ch = Number(biome.dataset.chapterBiome) || 1;
        biome.hidden = ch > targetChapters;
        if (biome.hidden) return;
        const layout = activeChapterLayouts?.[ch - 1];
        const biomeTop = layout ? layout.biomeTop : ch === 1 ? 0 : 1910 + (ch - 2) * 2030;
        const biomeHeight = layout
          ? layout.biomeHeight
          : ch === 1
            ? 1910
            : ch === chapterCount
              ? mapHeight - biomeTop
              : 2030;
        const biomeBottom = biomeTop + biomeHeight;
        biome.style.top = `${biomeTop}px`;
        biome.style.height = `${biomeHeight}px`;
        biome.style.setProperty("--quiz-biome-top-desktop", `${Math.round(biomeTop * 0.76)}px`);
        biome.style.setProperty("--quiz-biome-height-desktop", `${Math.round(biomeBottom * 0.76) - Math.round(biomeTop * 0.76)}px`);
        biome.style.setProperty("--quiz-biome-top-tablet", `${Math.round(biomeTop * 0.68)}px`);
        biome.style.setProperty("--quiz-biome-height-tablet", `${Math.round(biomeBottom * 0.68) - Math.round(biomeTop * 0.68)}px`);
        biome.style.setProperty("--quiz-biome-top-mobile", `${Math.round(biomeTop * 0.5)}px`);
        biome.style.setProperty("--quiz-biome-height-mobile", `${Math.round(biomeBottom * 0.5) - Math.round(biomeTop * 0.5)}px`);

        const themeId = layout
          ? layout.themePresetId
          : LearningHausStageCatalog.EU_CHAPTER_TO_THEME_ID[ch] || 8;
        const isDark = layout ? themeId <= 4 : LearningHausStageCatalog.getChapterTheme(ch).darkBiome;
        biome.classList.toggle("is-dark-biome", isDark);
        const sceneImg = biome.querySelector<HTMLImageElement>("img.quiz-biome-scene--pixel");
        const nextSrc = LearningHausStageCatalog.getBiomeImagePath(themeId);
        if (sceneImg && sceneImg.getAttribute("src") !== nextSrc) {
          sceneImg.src = nextSrc;
        }
      });

      // 2. Update chapter dividers
      quizStage.querySelectorAll<HTMLElement>(".quiz-chapter-divider[data-chapter-divider]").forEach((divider) => {
        const ch = Number(divider.dataset.chapterDivider) || 2;
        divider.hidden = ch > targetChapters;
        if (divider.hidden) return;
        const layout = activeChapterLayouts?.[ch - 1];
        const dividerTop = layout ? layout.dividerTop : 1922 + (ch - 2) * 2030;
        divider.style.top = `${dividerTop}px`;
        setScaledPosition(divider, 40, dividerTop);
        const realmEl = divider.querySelector<HTMLElement>(".quiz-chapter-divider__realm");
        if (realmEl) {
          const courseChapterTitle = course?.chapters?.[ch - 1]?.title;
          const fallbackTitle = LearningHausStageCatalog.getChapterTheme(ch).chapterTitle;
          realmEl.textContent = `${LearningHausI18n.t("Chapter", "บทที่")} ${ch}: ${courseChapterTitle || fallbackTitle}`;
        }
        const hintEl = divider.querySelector<HTMLElement>(".quiz-chapter-divider__hint");
        if (hintEl && isCustomCourse && layout) {
          hintEl.textContent = LearningHausI18n.t(
            `${layout.stageCount} ${layout.stageCount === 1 ? "stage" : "stages"} in this lesson`,
            `บทเรียนนี้มี ${layout.stageCount} ด่าน`
          );
        }
      });

      // 3. Update side pixel guardians
      if (ch1RightCat) {
        ch1RightCat.hidden = Boolean(isCustomCourse && (activeChapterLayouts?.[0]?.biomeHeight || 0) < 650);
      }
      quizStage.querySelectorAll<HTMLElement>(".quiz-crop--chapter-guardian").forEach((guardian) => {
        const ch = Number(guardian.dataset.guardianChapter) || 2;
        const isLeft = guardian.dataset.guardianSide === "left";
        const layout = activeChapterLayouts?.[ch - 1];
        if (ch > targetChapters || (isCustomCourse && !isLeft && (layout?.biomeHeight || 0) < 650)) {
          guardian.hidden = true;
          return;
        }
        guardian.hidden = false;
        const firstStageTop = layout ? layout.firstStageTop : 2060 + (ch - 2) * 2030;
        const guardianLeft = isLeft ? 20 : 455;
        const guardianTop = isLeft ? firstStageTop + 115 : firstStageTop + 495;
        guardian.style.top = `${guardianTop}px`;
        setScaledPosition(guardian, guardianLeft, guardianTop);
      });

      // 4. Update stage nodes (positions, sequential numbering, final boss badge, and per-class unlock/passed state)
      let customSeqNum = 0;
      let firstUnclearedCustomIdx: number | null = null;
      let firstVisibleCustomIdx: number | null = null;
      const customUnlockedSet = new Set<number>();

      quizStage.querySelectorAll<HTMLElement>(".quiz-node[data-stage-index]").forEach((node) => {
        const idx = Number(node.dataset.stageIndex) || 0;
        const ch = Math.floor(idx / stagesPerChapter) + 1;
        const stageInCh = idx % stagesPerChapter;
        const layout = activeChapterLayouts?.[ch - 1];
        const visible = isCustomCourse
          ? Boolean(layout && ch <= targetChapters && stageInCh < layout.stageCount)
          : ch <= targetChapters;
        node.hidden = !visible;
        if (!visible) return;

        const pos = getNodePosition(idx);
        node.style.left = `${pos.left}px`;
        node.style.top = `${pos.top}px`;
        setScaledPosition(node, pos.left, pos.top);

        const glyph = node.querySelector<HTMLElement>(".quiz-node__glyph");
        if (isCustomCourse && course && layout) {
          customSeqNum += 1;
          if (firstVisibleCustomIdx === null) firstVisibleCustomIdx = idx;
          if (glyph) glyph.textContent = String(customSeqNum);
          node.classList.toggle("is-final-stage", layout.stageCount > 1 && stageInCh === layout.stageCount - 1);
          node.classList.toggle("is-dark-biome-node", layout.themePresetId <= 4);
          const customTheme = LearningHausCustomQuizStudio.getThemePreset(layout.themePresetId);
          node.style.setProperty("--chapter-accent", customTheme.accent);
          node.style.setProperty("--chapter-shadow", customTheme.bannerBg);

          const chStages = customStagesByChapter[ch - 1] || [];
          const stObj = chStages[stageInCh];
          const cleared = stObj ? LearningHausCustomQuizStudio.isStageCleared(course.id, ch - 1, stObj.id) : false;
          const prevSt = stageInCh > 0 ? chStages[stageInCh - 1] : null;
          const prevCleared =
            stageInCh === 0
              ? true
              : prevSt
                ? LearningHausCustomQuizStudio.isStageCleared(course.id, ch - 1, prevSt.id)
                : false;
          const unlocked = course.role === "teaching" || stageInCh === 0 || cleared || prevCleared;
          if (unlocked) customUnlockedSet.add(idx);
          if (!cleared && unlocked && firstUnclearedCustomIdx === null) firstUnclearedCustomIdx = idx;

          node.classList.toggle("is-passed", cleared);
          node.classList.toggle("is-locked", !unlocked);
          node.classList.toggle("is-unlocked", unlocked);
          node.setAttribute("aria-disabled", String(!unlocked));
          const labelTitle = stObj ? `${stObj.title} (${stObj.items.length} ${LearningHausI18n.t("items", "ข้อ")})` : `Stage ${customSeqNum}`;
          node.setAttribute("aria-label", unlocked ? labelTitle : `${labelTitle} locked`);
          node.title = labelTitle;
        } else {
          if (glyph) glyph.textContent = String(idx + 1);
          const euTheme = LearningHausStageCatalog.getChapterTheme(ch);
          node.classList.toggle("is-final-stage", stageInCh === stagesPerChapter - 1);
          node.classList.toggle("is-dark-biome-node", euTheme.darkBiome);
          node.style.setProperty("--chapter-accent", euTheme.accent);
          node.style.setProperty("--chapter-shadow", euTheme.shadow);
        }
      });

      // 5. Update curved connecting paths
      quizStage.querySelectorAll<HTMLElement>(".quiz-stage__path[data-stage-path]").forEach((path) => {
        const idx = Number(path.dataset.stagePath) || 0;
        const ch = Math.floor(idx / stagesPerChapter) + 1;
        const stageInCh = idx % stagesPerChapter;
        const layout = activeChapterLayouts?.[ch - 1];
        const visible = isCustomCourse
          ? Boolean(layout && ch <= targetChapters && stageInCh < layout.stageCount - 1)
          : ch <= targetChapters;
        path.hidden = !visible;
        if (!visible) return;
        const isDark = layout ? layout.themePresetId <= 4 : LearningHausStageCatalog.getChapterTheme(ch).darkBiome;
        const customAccent = isCustomCourse && layout
          ? LearningHausCustomQuizStudio.getThemePreset(layout.themePresetId).accent
          : undefined;
        positionCurvedPath(path, idx, isDark, customAccent);
        if (isCustomCourse) {
          path.classList.toggle("is-connected", customUnlockedSet.has(idx + 1));
        }
      });

      if (!isCustomCourse && lastAppliedCourseId && lastAppliedCourseId !== "eu-ai-act") {
        // Restore EU AI Act node unlock/passed states cleanly when returning from a custom class
        loadAllProgress();
      }

      const activeMapHeight = isCustomCourse
        ? Math.max(820, totalCustomHeight + 120)
        : targetChapters === 1
          ? 2000
          : 2060 + (targetChapters - 2) * 2030 + 9 * 185 + 275;
      quizStage.style.setProperty("--quiz-map-height", `${Math.ceil(activeMapHeight * 0.76)}px`);
      quizStage.style.setProperty("--quiz-map-height-tablet", `${Math.ceil(activeMapHeight * 0.68)}px`);
      quizStage.style.setProperty("--quiz-map-height-mobile", `${Math.ceil(activeMapHeight * 0.5)}px`);

      const maxStageIdx = Math.max(0, targetChapters * stagesPerChapter - 1);
      const customDefaultIdx = firstUnclearedCustomIdx ?? firstVisibleCustomIdx ?? 0;
      const currentNodeHidden = Boolean(nodes[currentCatStageIndex]?.hidden);

      if (lastAppliedCourseId !== courseId) {
        lastAppliedCourseId = courseId;
        quizStage.scrollTop = 0;
        if (!isCatWalking) {
          const targetStage = isCustomCourse
            ? customDefaultIdx
            : Math.min(getDefaultSeatedStageIndex(), maxStageIdx);
          placeCatAtStage(targetStage);
        }
      } else if (!isCatWalking && (currentCatStageIndex > maxStageIdx || currentNodeHidden)) {
        placeCatAtStage(isCustomCourse ? customDefaultIdx : 0);
      } else if (!isCatWalking && isCustomCourse) {
        placeCatAtStage(currentCatStageIndex);
      }
    };

    const renderLearnGateQuickCourses = (): void => {
      if (!gateQuickWrap || !gateQuickList) return;
      const library = window.LearningHausLearnHub?.getLibraryCourses?.() || [];
      gateQuickWrap.hidden = library.length === 0;
      if (!library.length) return;
      gateQuickList.replaceChildren(
        ...library.map((course) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "quiz-learn-gate__quick-btn";
          btn.dataset.gateOpenCourse = course.id;
          const chCount = Math.min(chapterCount, course.chapters.length);
          const chBadge = LearningHausI18n.t(`${chCount} Ch.`, `${chCount} บท`);
          btn.innerHTML = `
            <span class="quiz-learn-gate__quick-icon">${course.isFavorite ? bookmarkFilledSvg : bookOpenSvg}</span>
            <span class="quiz-learn-gate__quick-name">${course.title}</span>
            <span class="quiz-learn-gate__quick-meta">${chBadge}</span>
          `;
          return btn;
        })
      );
    };

    const syncQuizCourseContext = (): void => {
      const hasSelected = Boolean(window.LearningHausLearnHub?.hasSelectedCourse?.());
      if (learnGateEl) learnGateEl.hidden = hasSelected;
      if (courseBarEl) courseBarEl.hidden = !hasSelected;
      quizStage.hidden = !hasSelected;
      bgmControlBtn.hidden = !hasSelected;

      if (!hasSelected) {
        renderLearnGateQuickCourses();
        window.LearningHausSettings?.stopBgm?.();
        return;
      }

      const activeCourse = window.LearningHausLearnHub?.getActiveCourse?.();
      const activeId = activeCourse?.id || "eu-ai-act";
      const chCount = activeCourse ? Math.min(chapterCount, activeCourse.chapters.length) : chapterCount;
      if (activeCourseNameEl) {
        activeCourseNameEl.textContent = activeCourse ? activeCourse.title : "EU AI Act: Foundations to Enforcement";
      }
      if (activeCourseMetaEl) {
        activeCourseMetaEl.textContent = LearningHausI18n.t(`${chCount} Ch.`, `${chCount} บท`);
      }
      applyCourseMapLayout(activeId);
    };
    reapplyCustomCourseRef = syncQuizCourseContext;

    backToCourseBtn?.addEventListener("click", () => {
      const activeId = window.LearningHausLearnHub?.getActiveCourseId?.() || "eu-ai-act";
      navigateToLearn("deck", activeId);
    });

    browseCoursesBtn?.addEventListener("click", () => {
      navigateToLearn("hub");
    });

    gateGoLearnBtn?.addEventListener("click", () => {
      navigateToLearn("hub");
    });

    gateQuickList?.addEventListener("click", (event) => {
      const btn = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>("[data-gate-open-course]");
      if (!btn?.dataset.gateOpenCourse) return;
      // Opens the selected course in Learn first so the user enters Quiz through its Course Quiz Group
      navigateToLearn("deck", btn.dataset.gateOpenCourse);
    });

    window.addEventListener("learninghaus:library-updated", syncQuizCourseContext);
    window.addEventListener("learninghaus:custom-quiz-cleared", syncQuizCourseContext);
    window.addEventListener("learninghaus:quest-updated", syncQuizCourseContext);
    window.addEventListener("learninghaus:active-course-changed", syncQuizCourseContext);
    window.addEventListener("learninghaus:language-changed", syncQuizCourseContext);
    window.addEventListener("learninghaus:social-session", syncQuizCourseContext);

    const unlockWhenVisible = (): void => {
      if (!quizView.hidden && chapters[0].highestUnlocked < 0) unlockStage(0);
      if (!quizView.hidden) {
        syncQuizCourseContext();
        if (window.LearningHausLearnHub?.hasSelectedCourse?.()) {
          const ch = detectScrolledChapter();
          window.LearningHausSettings?.setBgmChapter?.(ch, true);
          syncBgmPillUi();
        }
      } else {
        window.LearningHausSettings?.stopBgm?.();
      }
    };
    window.addEventListener("learninghaus:quiz-visible", unlockWhenVisible);
    if (typeof MutationObserver === "function") {
      const visibilityObserver = new MutationObserver(unlockWhenVisible);
      visibilityObserver.observe(quizView, { attributes: true, attributeFilter: ["hidden"] });
    }
    syncQuizCourseContext();
    syncBgmPillUi();
    unlockWhenVisible();

    window.LearningHausQuiz = Object.freeze({
      unlockStage,
      passStage,
      setDemoCompleteAllChapters,
      isDemoCompleteAllChapters,
      getProgress: () => ({
        highestUnlocked: chapters[0].highestUnlocked,
        highestPassed: chapters[0].highestPassed,
        chapterTwoHighestUnlocked: chapters[1].highestUnlocked,
        chapterTwoHighestPassed: chapters[1].highestPassed,
        chapterTwoVideoCompleted: chapters[1].videoCompleted,
        chapters: chapters.map(({ chapter, videoKey, videoCompleted, highestUnlocked, highestPassed }) => ({
          chapter,
          videoCompleted,
          videoWatched: readProgress(videoKey) === "true" || highestPassed >= (chapter - 1) * stagesPerChapter,
          highestUnlocked,
          highestPassed
        })),
        totalStages: nodes.length
      })
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initQuizStageProgress, { once: true });
  } else {
    initQuizStageProgress();
  }
})();
