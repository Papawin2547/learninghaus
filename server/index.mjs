// เซิร์ฟเวอร์กลางของ LearningHaus: บัญชี เพื่อน แชท และคะแนนด่านใช้ฐานข้อมูลเดียวกัน
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const codeRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const siteRoot = resolve(codeRoot, '..');
const dataRoot = process.env.LEARNINGHAUS_DATA_DIR ? resolve(process.env.LEARNINGHAUS_DATA_DIR) : join(codeRoot, 'server', 'data');
mkdirSync(dataRoot, { recursive: true });
const dbPath = process.env.LEARNINGHAUS_DB_PATH || join(dataRoot, 'learninghaus.sqlite');

// ── Turso Cloud SQLite Snapshot Persistence (survives Render Free redeploys & sleeps) ──
const rawTursoUrl = String(process.env.TURSO_DATABASE_URL || '').trim();
const tursoAuthToken = String(process.env.TURSO_AUTH_TOKEN || '').trim();
const tursoPipelineUrl =
  !process.env.LEARNINGHAUS_DB_PATH && rawTursoUrl && tursoAuthToken
    ? `${rawTursoUrl.replace(/^libsql:\/\//i, 'https://').replace(/\/+$/, '')}/v2/pipeline`
    : '';

const tursoExec = async (requests) => {
  const res = await fetch(tursoPipelineUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tursoAuthToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests: [...requests, { type: 'close' }] })
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload?.results) throw new Error(`Turso HTTP ${res.status}`);
  for (const r of payload.results) {
    if (r.type === 'error') throw new Error(r.error?.message || 'Turso SQL error');
  }
  return payload.results;
};

if (tursoPipelineUrl) {
  try {
    await tursoExec([
      {
        type: 'execute',
        stmt: { sql: 'CREATE TABLE IF NOT EXISTS lh_db_chunks (idx INTEGER PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)' }
      }
    ]);
    const results = await tursoExec([
      { type: 'execute', stmt: { sql: 'SELECT idx, data FROM lh_db_chunks ORDER BY idx ASC' } }
    ]);
    const rows = results[0]?.response?.result?.rows || [];
    if (rows.length > 0) {
      const b64 = rows.map((row) => String(row[1]?.value || '')).join('');
      const buf = Buffer.from(b64, 'base64');
      if (buf.length > 100 && buf.subarray(0, 15).toString('utf8') === 'SQLite format 3') {
        for (const suffix of ['-wal', '-shm']) {
          if (existsSync(dbPath + suffix)) {
            try { unlinkSync(dbPath + suffix); } catch { /* ignore */ }
          }
        }
        writeFileSync(dbPath, buf);
        console.log(`[Turso] Restored persistent SQLite database from cloud (${buf.length} bytes).`);
      }
    } else {
      console.log('[Turso] Connected (no cloud snapshot yet; will sync on first write).');
    }
  } catch (err) {
    console.error('[Turso] Startup restore warning:', err?.message || err);
  }
}

const db = new DatabaseSync(dbPath);

let tursoSyncTimer = null;
let tursoSyncInFlight = false;
let tursoSyncDirty = false;
const flushTursoSnapshot = async () => {
  if (!tursoPipelineUrl) return;
  if (tursoSyncInFlight) {
    tursoSyncDirty = true;
    return;
  }
  tursoSyncInFlight = true;
  tursoSyncDirty = false;
  try {
    db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
    const b64 = readFileSync(dbPath).toString('base64');
    const CHUNK = 180000;
    const ts = new Date().toISOString();
    const reqs = [
      { type: 'execute', stmt: { sql: 'BEGIN' } },
      { type: 'execute', stmt: { sql: 'DELETE FROM lh_db_chunks' } }
    ];
    for (let i = 0, idx = 0; i < b64.length; i += CHUNK, idx += 1) {
      reqs.push({
        type: 'execute',
        stmt: {
          sql: 'INSERT INTO lh_db_chunks(idx, data, updated_at) VALUES(?, ?, ?)',
          args: [
            { type: 'integer', value: String(idx) },
            { type: 'text', value: b64.slice(i, i + CHUNK) },
            { type: 'text', value: ts }
          ]
        }
      });
    }
    reqs.push({ type: 'execute', stmt: { sql: 'COMMIT' } });
    await tursoExec(reqs);
  } catch (err) {
    console.error('[Turso] Cloud sync warning:', err?.message || err);
  } finally {
    tursoSyncInFlight = false;
    if (tursoSyncDirty) {
      tursoSyncDirty = false;
      void flushTursoSnapshot();
    }
  }
};
const scheduleTursoSync = () => {
  if (!tursoPipelineUrl) return;
  if (tursoSyncTimer) clearTimeout(tursoSyncTimer);
  tursoSyncTimer = setTimeout(() => {
    tursoSyncTimer = null;
    void flushTursoSnapshot();
  }, 1500);
};
db.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL, avatar TEXT NOT NULL DEFAULT '',
    disabled INTEGER NOT NULL DEFAULT 0, total_xp INTEGER NOT NULL DEFAULT 0,
    about TEXT NOT NULL DEFAULT '', facebook_name TEXT NOT NULL DEFAULT '', facebook_url TEXT NOT NULL DEFAULT '',
    instagram_name TEXT NOT NULL DEFAULT '', instagram_url TEXT NOT NULL DEFAULT '',
    x_name TEXT NOT NULL DEFAULT '', x_url TEXT NOT NULL DEFAULT '',
    cat_config TEXT NOT NULL DEFAULT '', cat_presets TEXT NOT NULL DEFAULT '[]',
    featured_achievements TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS friendships (
    user_low INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_high INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    requested_by INTEGER NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','accepted')),
    created_at TEXT NOT NULL, PRIMARY KEY(user_low,user_high)
  );
  CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY, kind TEXT NOT NULL CHECK(kind IN ('direct','group')),
    name TEXT, direct_key TEXT UNIQUE, created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS chat_members (
    chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(chat_id,user_id)
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY, chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL, created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS messages_by_chat ON messages(chat_id,id);
  -- Course metadata keeps lesson/subject IDs generic for future subjects and courses.
  CREATE TABLE IF NOT EXISTS courses (
    course_id TEXT PRIMARY KEY, subject_id TEXT NOT NULL, title TEXT NOT NULL,
    required_lessons INTEGER NOT NULL, owner_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    published_at TEXT, created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS course_lessons (
    course_id TEXT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL, created_at TEXT NOT NULL, is_creator_content INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY(course_id,lesson_id)
  );
  CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL, lesson_id TEXT NOT NULL, score INTEGER NOT NULL,
    correct INTEGER NOT NULL, total_questions INTEGER NOT NULL, time_seconds REAL NOT NULL,
    completed_at TEXT NOT NULL,
    FOREIGN KEY(course_id,lesson_id) REFERENCES course_lessons(course_id,lesson_id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS quiz_attempts_by_user ON quiz_attempts(user_id,course_id,lesson_id,id);
  CREATE TABLE IF NOT EXISTS course_stage_completions (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL, lesson_id TEXT NOT NULL, completed_at TEXT NOT NULL,
    PRIMARY KEY(user_id,course_id,lesson_id),
    FOREIGN KEY(course_id,lesson_id) REFERENCES course_lessons(course_id,lesson_id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS course_completions (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    completed_at TEXT NOT NULL, PRIMARY KEY(user_id,course_id)
  );
  CREATE TABLE IF NOT EXISTS learning_activity_days (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_date TEXT NOT NULL, PRIMARY KEY(user_id,activity_date)
  );
  CREATE TABLE IF NOT EXISTS user_achievements (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL, unlocked_at TEXT NOT NULL,
    PRIMARY KEY(user_id,achievement_id)
  );
  CREATE TABLE IF NOT EXISTS schema_migrations (
    migration_id TEXT PRIMARY KEY, applied_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS scores (
    stage INTEGER NOT NULL, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL, correct INTEGER NOT NULL, time_seconds REAL NOT NULL,
    total_xp INTEGER NOT NULL, updated_at TEXT NOT NULL,
    PRIMARY KEY(stage,user_id)
  );
  CREATE TABLE IF NOT EXISTS party_presets (
    code TEXT PRIMARY KEY,
    owner_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    questions_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS party_presets_by_owner ON party_presets(owner_user_id, created_at DESC);
  CREATE TABLE IF NOT EXISTS usage_events (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    target TEXT NOT NULL DEFAULT '',
    device_type TEXT NOT NULL DEFAULT '',
    language TEXT NOT NULL DEFAULT 'en',
    meta_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS usage_events_by_user ON usage_events(user_id, id DESC);
  CREATE INDEX IF NOT EXISTS usage_events_by_type ON usage_events(event_type, created_at DESC);
  CREATE TABLE IF NOT EXISTS party_match_logs (
    id INTEGER PRIMARY KEY,
    room_code TEXT NOT NULL,
    host_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    mode TEXT NOT NULL,
    player_count INTEGER NOT NULL,
    question_count INTEGER NOT NULL,
    winner_name TEXT NOT NULL DEFAULT '',
    results_json TEXT NOT NULL DEFAULT '[]',
    completed_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS party_match_logs_by_time ON party_match_logs(completed_at DESC);
`);
const userColumns = new Set(db.prepare('PRAGMA table_info(users)').all().map((column) => column.name));
for (const [name, definition] of Object.entries({
  disabled:'INTEGER NOT NULL DEFAULT 0', total_xp:'INTEGER NOT NULL DEFAULT 0',
  is_developer:'INTEGER NOT NULL DEFAULT 0', last_active_at:"TEXT NOT NULL DEFAULT ''",
  about:"TEXT NOT NULL DEFAULT ''", facebook_name:"TEXT NOT NULL DEFAULT ''", facebook_url:"TEXT NOT NULL DEFAULT ''",
  instagram_name:"TEXT NOT NULL DEFAULT ''", instagram_url:"TEXT NOT NULL DEFAULT ''",
  x_name:"TEXT NOT NULL DEFAULT ''", x_url:"TEXT NOT NULL DEFAULT ''",
  cat_config:"TEXT NOT NULL DEFAULT ''", cat_presets:"TEXT NOT NULL DEFAULT '[]'",
  featured_achievements:"TEXT NOT NULL DEFAULT ''"
})) if (!userColumns.has(name)) db.exec(`ALTER TABLE users ADD COLUMN ${name} ${definition}`);
db.exec("UPDATE users SET avatar='' WHERE avatar LIKE '%Profire/PF0%'");
db.exec('UPDATE users SET total_xp=MAX(total_xp,COALESCE((SELECT MAX(total_xp) FROM scores WHERE user_id=users.id),0))');

const port = Number(process.env.PORT || process.env.LEARNINGHAUS_PORT || 8766);
const host = process.env.LEARNINGHAUS_HOST || '0.0.0.0';
const streams = new Map();
const json = (res, status, value) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(value));
};
const fail = (res, status, error) => json(res, status, { error });
const now = () => new Date().toISOString();
// คอร์สเดิมมี 8 Chapters × 10 ด่าน; seed เพิ่มแบบ idempotent โดยไม่แตะข้อมูลผู้ใช้
db.prepare('INSERT OR IGNORE INTO courses(course_id,subject_id,title,required_lessons,owner_user_id,published_at,created_at) VALUES(?,?,?,?,NULL,?,?)')
  .run('eu-ai-act','ai-law','EU AI Act',80,now(),now());
const addCourseLesson = db.prepare('INSERT OR IGNORE INTO course_lessons(course_id,lesson_id,created_at,is_creator_content) VALUES(?,?,?,0)');
for (let stage = 1; stage <= 80; stage += 1) addCourseLesson.run('eu-ai-act',`stage-${stage}`,now());
// ย้ายคะแนนเดิมเป็นหลักฐานการทำ Quiz/บทเรียนครั้งหนึ่ง เพื่อคง Achievement และความคืบหน้าไว้
db.exec(`
  INSERT OR IGNORE INTO quiz_attempts(user_id,course_id,lesson_id,score,correct,total_questions,time_seconds,completed_at)
    SELECT score_row.user_id,'eu-ai-act','stage-'||score_row.stage,score_row.score,score_row.correct,10,score_row.time_seconds,score_row.updated_at
    FROM scores score_row WHERE NOT EXISTS(SELECT 1 FROM quiz_attempts old_attempt
      WHERE old_attempt.user_id=score_row.user_id AND old_attempt.course_id='eu-ai-act'
        AND old_attempt.lesson_id='stage-'||score_row.stage AND old_attempt.completed_at=score_row.updated_at
        AND old_attempt.score=score_row.score AND old_attempt.correct=score_row.correct);
  INSERT OR IGNORE INTO course_stage_completions(user_id,course_id,lesson_id,completed_at)
    SELECT user_id,'eu-ai-act','stage-'||stage,updated_at FROM scores;
  INSERT OR IGNORE INTO learning_activity_days(user_id,activity_date)
    SELECT DISTINCT user_id,substr(completed_at,1,10) FROM quiz_attempts;
  INSERT OR IGNORE INTO course_completions(user_id,course_id,completed_at)
    SELECT c.user_id,c.course_id,MAX(c.completed_at) FROM course_stage_completions c
    JOIN courses co ON co.course_id=c.course_id
    GROUP BY c.user_id,c.course_id HAVING COUNT(*)>=MAX(co.required_lessons);
`);
// บันทึก Expert/Master ที่ได้จากกติกาเดิมครั้งเดียว ก่อนผู้ใช้จะเริ่มเก็บคอร์สใหม่
if (!db.prepare("SELECT 1 FROM schema_migrations WHERE migration_id='achievement-legacy-awards-v1'").get()) {
  db.exec(`
    INSERT OR IGNORE INTO user_achievements(user_id,achievement_id,unlocked_at)
      SELECT user_id,'expert',MAX(completed_at) FROM course_stage_completions
      WHERE course_id='eu-ai-act' AND CAST(SUBSTR(lesson_id,7) AS INTEGER) BETWEEN 1 AND 40
      GROUP BY user_id HAVING COUNT(DISTINCT lesson_id)>=40;
    INSERT OR IGNORE INTO user_achievements(user_id,achievement_id,unlocked_at)
      SELECT user_id,'master',MAX(completed_at) FROM course_stage_completions
      WHERE course_id='eu-ai-act' AND CAST(SUBSTR(lesson_id,7) AS INTEGER) BETWEEN 1 AND 80
      GROUP BY user_id HAVING COUNT(DISTINCT lesson_id)>=80;
  `);
  db.prepare('INSERT INTO schema_migrations(migration_id,applied_at) VALUES(?,?)').run('achievement-legacy-awards-v1',now());
}
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const passwordHash = (password) => {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
};
const checkPassword = (password, stored) => {
  const [salt, hex] = String(stored).split(':');
  if (!salt || !hex || hex.length !== 128) return false;
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(hex, 'hex'));
};
const CATALOG_ACHIEVEMENT_IDS = new Set([
  'beginner', 'knowledge-seeker', 'lesson-sprinter', 'dedicated-scholar',
  'curious-explorer', 'polymath-explorer', 'consistent-learner', 'habit-builder',
  'course-finisher', 'expert', 'master',
  'quiz-challenger', 'quiz-veteran', 'quiz-champion', 'perfect-score', 'flawless-trio',
  'fast-thinker', 'lightning-master', 'comeback', 'growth-mindset', 'quest-hunter',
  'first-creator', 'knowledge-sharer', 'curriculum-master', 'quest-designer',
  'course-architect', 'learning-mentor',
  'chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5', 'chapter-6', 'chapter-7', 'chapter-8'
]);
const parseFeaturedAchievements = (raw) => {
  if (raw === '' || raw === null || raw === undefined) return null;
  try {
    const parsed = Array.isArray(raw) ? raw : JSON.parse(String(raw));
    if (!Array.isArray(parsed)) return null;
    const seen = new Set();
    const out = [];
    for (const item of parsed) {
      const id = String(item || '').trim();
      if (CATALOG_ACHIEVEMENT_IDS.has(id) && !seen.has(id)) {
        seen.add(id);
        out.push(id);
        if (out.length >= 3) break;
      }
    }
    return out;
  } catch {
    return null;
  }
};
const publicUser = (user) => ({ id: user.id, name: user.display_name, avatar: user.avatar, catConfig: user.cat_config || '' });
const profileUser = (user) => ({ ...publicUser(user), totalXp: user.total_xp, about: user.about,
  facebookName: user.facebook_name, facebookUrl: user.facebook_url,
  instagramName: user.instagram_name, instagramUrl: user.instagram_url,
  xName: user.x_name, xUrl: user.x_url,
  featuredAchievements: parseFeaturedAchievements(user.featured_achievements) });
const accountUser = (user) => ({ ...profileUser(user), email: user.email, catPresets: user.cat_presets || '[]', accountState: user.disabled ? 'disabled' : 'active', isDeveloper: Boolean(user.is_developer) });
// สร้างบัญชี Developer เริ่มต้นสำหรับทดสอบระบบและดูข้อมูลการใช้งาน (ผู้ใช้ทั่วไปจะไม่เห็นเมนูทดสอบ)
const DEV_EMAIL = (process.env.LEARNINGHAUS_DEV_EMAIL || 'dev@learninghaus.app').trim().toLowerCase();
const DEV_PASSWORD = process.env.LEARNINGHAUS_DEV_PASSWORD || 'DevHaus#2026';
{
  const existingDev = db.prepare('SELECT id, is_developer FROM users WHERE email=?').get(DEV_EMAIL);
  if (!existingDev) {
    db.prepare('INSERT INTO users(email,password_hash,display_name,avatar,total_xp,is_developer,created_at) VALUES(?,?,?,?,0,1,?)')
      .run(DEV_EMAIL, passwordHash(DEV_PASSWORD), 'Developer', '', now());
  } else if (!existingDev.is_developer) {
    db.prepare('UPDATE users SET is_developer=1 WHERE id=?').run(existingDev.id);
  }
}
const inferDeviceType = (ua = '') => /ipad|tablet/i.test(ua) ? 'tablet' : /mobi|android|iphone/i.test(ua) ? 'mobile' : 'desktop';
const recordUsageEvent = (userId, eventType, target = '', meta = {}, req = null, lang = '') => {
  if (!userId || !eventType) return;
  try {
    const ts = now();
    const device = String(meta?.deviceType || (req ? inferDeviceType(req.headers['user-agent'] || '') : ''));
    const language = String(lang || meta?.language || 'en').slice(0, 8);
    const safeMeta = JSON.stringify(meta && typeof meta === 'object' ? meta : {}).slice(0, 2000);
    db.prepare('INSERT INTO usage_events(user_id,event_type,target,device_type,language,meta_json,created_at) VALUES(?,?,?,?,?,?,?)')
      .run(userId, String(eventType).slice(0, 64), String(target || '').slice(0, 120), device.slice(0, 24), language, safeMeta, ts);
    db.prepare('UPDATE users SET last_active_at=? WHERE id=?').run(ts, userId);
  } catch {
    // Never break user flows on telemetry errors.
  }
};
// Remember me ออก cookie อายุ 30 วัน; หากไม่เลือก ใช้ session cookie และอายุฝั่งฐานข้อมูล 12 ชั่วโมง
const issueSession = (res, user, rememberMe = true) => {
  const token = randomBytes(32).toString('base64url');
  db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)')
    .run(sha256(token), user.id, Date.now() + (rememberMe ? 365 * 86400000 : 12 * 60 * 60 * 1000));
  const persistence = rememberMe ? '; Max-Age=31536000' : '';
  res.setHeader('Set-Cookie', `lh_session=${token}; HttpOnly; SameSite=Lax; Path=/${persistence}`);
};
const googleOAuthStates = new Map();
const getPublicBaseUrl = (req) => {
  const configured = String(process.env.PUBLIC_BASE_URL || '').trim().replace(/\/+$/, '');
  if (configured) return configured;
  const proto = String(req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
  return `${proto}://${req.headers.host || '127.0.0.1:8766'}`;
};
const isGoogleOAuthConfigured = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const currentUser = (req) => {
  const cookie = /(?:^|;\s*)lh_session=([^;]+)/.exec(req.headers.cookie || '')?.[1];
  if (!cookie) return null;
  return db.prepare(`SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id
    WHERE s.token_hash=? AND s.expires_at>?`).get(sha256(cookie), Date.now()) || null;
};
const body = async (req, maxLength = 16384) => {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > maxLength) throw new Error('Request is too large.');
  }
  try { return JSON.parse(raw || '{}'); } catch { throw new Error('Invalid JSON.'); }
};
const notify = (userIds) => {
  for (const id of userIds) {
    for (const res of streams.get(id) || []) res.write(`event: refresh\ndata: {}\n\n`);
  }
};
const areFriends = (a, b) => {
  const low = Math.min(a, b), high = Math.max(a, b);
  return Boolean(db.prepare("SELECT 1 FROM friendships WHERE user_low=? AND user_high=? AND status='accepted'").get(low, high));
};
const chatMember = (chatId, userId) => Boolean(db.prepare('SELECT 1 FROM chat_members WHERE chat_id=? AND user_id=?').get(chatId, userId));

// คำนวณตัวเลขจากบันทึกจริง; UI ใช้ผลชุดเดียวกันเพื่อแสดง progress โดยไม่สร้างข้อมูลแทนผู้ใช้
const achievementMetrics = (userId) => {
  const completedLessons = Number(db.prepare('SELECT COUNT(*) AS count FROM course_stage_completions WHERE user_id=?').get(userId).count);
  const completedQuizzes = Number(db.prepare('SELECT COUNT(*) AS count FROM quiz_attempts WHERE user_id=?').get(userId).count);
  const perfectQuizzes = Number(db.prepare('SELECT COUNT(*) AS count FROM quiz_attempts WHERE user_id=? AND total_questions>=5 AND correct=total_questions').get(userId).count);
  const fastStages = Number(db.prepare('SELECT COUNT(*) AS count FROM quiz_attempts WHERE user_id=? AND total_questions=10 AND correct>=8 AND time_seconds<=180').get(userId).count);
  const comebackPasses = Number(db.prepare(`SELECT COUNT(DISTINCT later.lesson_id) AS count FROM quiz_attempts later
    WHERE later.user_id=? AND (later.correct * 10) >= (later.total_questions * 7)
      AND EXISTS(SELECT 1 FROM quiz_attempts earlier WHERE earlier.user_id=later.user_id
        AND earlier.course_id=later.course_id AND earlier.lesson_id=later.lesson_id AND earlier.id<later.id
        AND earlier.correct<earlier.total_questions AND later.correct>earlier.correct)`).get(userId).count);
  const subjects = Number(db.prepare(`SELECT COUNT(DISTINCT c.subject_id) AS count FROM course_stage_completions done
    JOIN courses c ON c.course_id=done.course_id WHERE done.user_id=?`).get(userId).count);
  const improvedReplays = Number(db.prepare(`SELECT COUNT(DISTINCT later.lesson_id) AS count FROM quiz_attempts later
    WHERE later.user_id=? AND EXISTS(SELECT 1 FROM quiz_attempts earlier WHERE earlier.user_id=later.user_id
      AND earlier.course_id=later.course_id AND earlier.lesson_id=later.lesson_id AND earlier.id<later.id
      AND later.score>earlier.score)`).get(userId).count);
  const activeDays = Number(db.prepare('SELECT COUNT(*) AS count FROM learning_activity_days WHERE user_id=?').get(userId).count);
  const completedCourses = Number(db.prepare('SELECT COUNT(*) AS count FROM course_completions WHERE user_id=?').get(userId).count);
  const chapterProgress = {};
  for (let chapter = 1; chapter <= 8; chapter += 1) {
    const first = (chapter - 1) * 10 + 1, last = chapter * 10;
    chapterProgress[`eu-ai-act:${chapter}`] = Number(db.prepare(`SELECT COUNT(*) AS count FROM course_stage_completions
      WHERE user_id=? AND course_id='eu-ai-act' AND CAST(SUBSTR(lesson_id,7) AS INTEGER) BETWEEN ? AND ?`)
      .get(userId,first,last).count);
  }
  const publishedCourses = Number(db.prepare('SELECT COUNT(*) AS count FROM courses WHERE owner_user_id=? AND published_at IS NOT NULL').get(userId).count);
  const createdLessons = Number(db.prepare(`SELECT COUNT(*) AS count FROM course_lessons lesson JOIN courses course ON course.course_id=lesson.course_id
    WHERE course.owner_user_id=?`).get(userId).count);
  const completedStudents = Number(db.prepare(`SELECT COUNT(DISTINCT completion.user_id) AS count FROM course_completions completion
    JOIN courses course ON course.course_id=completion.course_id WHERE course.owner_user_id=? AND completion.user_id<>?`).get(userId,userId).count);
  return {
    completedLessons, completedQuizzes, perfectQuizzes, fastStages, comebackPasses, subjects,
    improvedReplays, activeDays, completedCourses, chapterProgress,
    // ปัจจุบันยังไม่มีหน้าสร้าง/เผยแพร่คอร์ส จึงไม่แสดง Creator progress เป็นศูนย์ปลอม
    creator: { available: false, publishedCourses, createdLessons, completedStudents }
  };
};

const unlockAchievement = (userId, id, unlockedAt = now()) => {
  db.prepare('INSERT OR IGNORE INTO user_achievements(user_id,achievement_id,unlocked_at) VALUES(?,?,?)').run(userId,id,unlockedAt);
};
const grantAchievements = (userId, metrics = achievementMetrics(userId)) => {
  if (metrics.completedLessons >= 1) unlockAchievement(userId,'beginner');
  if (metrics.completedLessons >= 5) unlockAchievement(userId,'knowledge-seeker');
  if (metrics.completedLessons >= 15) unlockAchievement(userId,'lesson-sprinter');
  if (metrics.completedLessons >= 40) unlockAchievement(userId,'dedicated-scholar');
  if (metrics.completedQuizzes >= 1) unlockAchievement(userId,'quiz-challenger');
  if (metrics.completedQuizzes >= 10) unlockAchievement(userId,'quiz-veteran');
  if (metrics.completedQuizzes >= 30) unlockAchievement(userId,'quiz-champion');
  if (metrics.perfectQuizzes >= 1) unlockAchievement(userId,'perfect-score');
  if (metrics.perfectQuizzes >= 3) unlockAchievement(userId,'flawless-trio');
  if (metrics.fastStages >= 1) unlockAchievement(userId,'fast-thinker');
  if (metrics.fastStages >= 5) unlockAchievement(userId,'lightning-master');
  if (metrics.comebackPasses >= 1) unlockAchievement(userId,'comeback');
  if (metrics.subjects >= 3) unlockAchievement(userId,'curious-explorer');
  if (metrics.subjects >= 5) unlockAchievement(userId,'polymath-explorer');
  if (metrics.improvedReplays >= 1) unlockAchievement(userId,'growth-mindset');
  if (metrics.activeDays >= 3) unlockAchievement(userId,'consistent-learner');
  if (metrics.activeDays >= 7) unlockAchievement(userId,'habit-builder');
  if (metrics.completedCourses >= 1) unlockAchievement(userId,'course-finisher');
  if (metrics.completedCourses >= 3) unlockAchievement(userId,'expert');
  if (metrics.completedCourses >= 5) unlockAchievement(userId,'master');
  for (let chapter = 1; chapter <= 8; chapter += 1) {
    if (metrics.chapterProgress[`eu-ai-act:${chapter}`] >= 10) unlockAchievement(userId,`chapter-${chapter}`);
  }
};
const achievementSnapshot = (userId) => {
  const metrics = achievementMetrics(userId);
  grantAchievements(userId,metrics);
  const unlocked = db.prepare('SELECT achievement_id AS id,unlocked_at AS unlockedAt FROM user_achievements WHERE user_id=?').all(userId);
  const completedStages = db.prepare(`SELECT CAST(SUBSTR(lesson_id,7) AS INTEGER) AS stage FROM course_stage_completions
    WHERE user_id=? AND course_id='eu-ai-act' AND lesson_id LIKE 'stage-%' ORDER BY stage ASC`).all(userId)
    .map((row) => Number(row.stage))
    .filter((stage) => Number.isInteger(stage) && stage >= 1 && stage <= 80);
  return { metrics, unlocked, completedStages };
};

const partyRooms = new Map();
const PARTY_DEMO_BOTS = [
  { id: -101, name: 'Mochi', catConfig: JSON.stringify({ pattern: 'calico', eyeStyle: 'sparkle', outfit: 'scarf', prop: 'flower-crown' }) },
  { id: -102, name: 'Shadow', catConfig: JSON.stringify({ pattern: 'tuxedo', eyeStyle: 'cool', outfit: 'hoodie', prop: 'headphones' }) },
  { id: -103, name: 'Sunny', catConfig: JSON.stringify({ pattern: 'tabby', eyeStyle: 'happy', outfit: 'sweater', prop: 'sprout' }) },
  { id: -104, name: 'Boba', catConfig: JSON.stringify({ pattern: 'siamese', eyeStyle: 'round', outfit: 'cloak', prop: 'beret' }) },
  { id: -105, name: 'Pepper', catConfig: JSON.stringify({ pattern: 'solid', eyeStyle: 'heterochromia', outfit: 'suit', prop: 'glasses' }) }
];

const PARTY_BOT_EXTRA_NAMES = [
  'Mochi', 'Shadow', 'Sunny', 'Boba', 'Pepper',
  'Matcha', 'Yuzu', 'Milo', 'Kuma', 'Nori',
  'Sora', 'Taro', 'Latte', 'Pochi', 'Chai'
];
const PARTY_BOT_PATTERNS = ['calico', 'tuxedo', 'tabby', 'siamese', 'solid'];
const PARTY_BOT_EYES = ['sparkle', 'cool', 'happy', 'round', 'heterochromia'];
const PARTY_BOT_OUTFITS = ['scarf', 'hoodie', 'sweater', 'cloak', 'suit', 'none'];
const PARTY_BOT_PROPS = ['flower-crown', 'headphones', 'sprout', 'beret', 'glasses', 'none'];

const createPartyBotProfile = (index) => {
  if (index < PARTY_DEMO_BOTS.length) return { ...PARTY_DEMO_BOTS[index], id: -(101 + index) };
  const baseName = PARTY_BOT_EXTRA_NAMES[index % PARTY_BOT_EXTRA_NAMES.length];
  const cycle = Math.floor(index / PARTY_BOT_EXTRA_NAMES.length);
  return {
    id: -(101 + index),
    name: cycle > 0 ? `${baseName} #${cycle + 1}` : baseName,
    catConfig: JSON.stringify({
      pattern: PARTY_BOT_PATTERNS[index % PARTY_BOT_PATTERNS.length],
      eyeStyle: PARTY_BOT_EYES[(index * 2) % PARTY_BOT_EYES.length],
      outfit: PARTY_BOT_OUTFITS[(index * 3) % PARTY_BOT_OUTFITS.length],
      prop: PARTY_BOT_PROPS[(index + 1) % PARTY_BOT_PROPS.length]
    })
  };
};

const adaptivePartyDurationSec = (kind, customSec) => {
  const num = Number(customSec);
  if (Number.isFinite(num) && num >= 5 && num <= 120) return Math.round(num);
  if (kind === 'matching' || kind === 'sorting' || kind === 'order-steps') return 30;
  if (kind === 'binary-stamp' || kind === 'scenario') return 20;
  return 15;
};

const normalizePartyCode = (raw) => String(raw || '').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');

const genPartyCode = (prefix) => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 5; i++) suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${prefix}-${suffix}`;
};

const sanitizePartyQuestions = (list) => {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 20).map((item, idx) => {
    const kind = String(item?.kind || 'quiz');
    const timeLimitSeconds = adaptivePartyDurationSec(kind, item?.timeLimitSeconds);
    return {
      ...item,
      id: String(item?.id || `pq-${idx + 1}`),
      kind,
      timeLimitSeconds
    };
  });
};

const notifyPartyMembers = (room) => {
  const ids = [...room.players.values()].filter((p) => !p.isBot && p.userId > 0).map((p) => p.userId);
  if (ids.length) notify(ids);
};

const computePartyCrown = (room) => {
  const passedFirstQuestion =
    room.status === 'finished' ||
    (room.status === 'reveal' && room.questionIndex >= 0) ||
    (room.status === 'question' && room.questionIndex >= 1);
  if (!passedFirstQuestion) return null;
  const ranked = [...room.players.values()].filter((p) => p.score > 0).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (room.crownUserId === a.userId && room.crownUserId !== b.userId) return -1;
    if (room.crownUserId === b.userId && room.crownUserId !== a.userId) return 1;
    if (a.totalReactionMs !== b.totalReactionMs) return a.totalReactionMs - b.totalReactionMs;
    return a.joinedAt - b.joinedAt;
  });
  return ranked[0] ? ranked[0].userId : null;
};

const shuffleArrayInPlace = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
};

const shufflePartyQuestionChoices = (q) => {
  if (!q || !Array.isArray(q.options) || q.options.length < 2) return q;
  if (q.kind !== 'quiz' && q.kind !== 'scenario') return q;
  const indexed = q.options.map((text, idx) => ({ text, isCorrect: idx === (Number(q.correctIndex) || 0) }));
  shuffleArrayInPlace(indexed);
  const nextCorrect = indexed.findIndex((o) => o.isCorrect);
  return {
    ...q,
    options: indexed.map((o) => o.text),
    correctIndex: nextCorrect >= 0 ? nextCorrect : 0
  };
};

const shufflePartyQuestionsDeck = (questions) => {
  const mapped = questions.map((q) => shufflePartyQuestionChoices(q));
  return shuffleArrayInPlace(mapped);
};

const isPartyDoubleQuestion = (room) =>
  Array.isArray(room?.questions) && room.questions.length >= 2 && room.questionIndex === room.questions.length - 1;

const applyAnswerToPlayer = (player, durationMs, elapsedMs, isCorrect, isDouble = false) => {
  if (player.answeredThisQ) return;
  player.answeredThisQ = true;
  player.lastCorrect = Boolean(isCorrect);
  player.lastReactionMs = Math.max(250, Math.min(durationMs, Math.round(elapsedMs)));
  if (isCorrect) {
    player.correctCount += 1;
    player.streak += 1;
    player.bestStreak = Math.max(player.bestStreak, player.streak);
    player.totalReactionMs += player.lastReactionMs;
    const speedRatio = Math.max(0, 1 - player.lastReactionMs / Math.max(1000, durationMs));
    const basePts = Math.round(600 + 400 * speedRatio + Math.min(250, (player.streak - 1) * 50));
    const pts = isDouble ? basePts * 2 : basePts;
    player.lastPointsEarned = pts;
    if (isDouble) player.clutchPoints = (player.clutchPoints || 0) + pts;
    player.score += pts;
  } else {
    player.streak = 0;
    player.lastPointsEarned = 0;
  }
};

const advancePartyQuestion = (room, ts) => {
  room.questionIndex += 1;
  if (room.questionIndex >= room.questions.length) {
    room.status = 'finished';
    room.crownUserId = computePartyCrown(room);
    try {
      const sorted = Array.from(room.players.values()).sort((a, b) => (b.score - a.score) || (a.totalReactionMs - b.totalReactionMs));
      const winnerName = sorted[0]?.name || '';
      const mode = room.players.size <= 4 ? 'poker-table' : 'solo-desk';
      const summary = sorted.map((p, idx) => ({
        rank: idx + 1,
        userId: p.userId,
        name: p.name,
        isBot: Boolean(p.isBot),
        score: p.score,
        correct: p.correctCount,
        bestStreak: p.bestStreak
      }));
      db.prepare('INSERT INTO party_match_logs(room_code,host_user_id,title,mode,player_count,question_count,winner_name,results_json,completed_at) VALUES(?,?,?,?,?,?,?,?,?)')
        .run(room.code, room.hostUserId, room.title, mode, room.players.size, room.questions.length, winnerName, JSON.stringify(summary), now());
      recordUsageEvent(room.hostUserId, 'party_match_complete', room.code, {
        title: room.title,
        mode,
        playerCount: room.players.size,
        questionCount: room.questions.length,
        winnerName
      });
    } catch {
      // Non-fatal analytics write error.
    }
    return;
  }
  const q = room.questions[room.questionIndex];
  const durationMs = adaptivePartyDurationSec(q.kind, q.timeLimitSeconds) * 1000;
  room.status = 'question';
  room.questionStartedAt = ts;
  room.questionEndsAt = ts + durationMs;
  room.revealEndsAt = 0;
  let botIdx = 0;
  for (const player of room.players.values()) {
    player.answeredThisQ = false;
    player.lastCorrect = null;
    player.lastPointsEarned = 0;
    if (player.isBot) {
      botIdx += 1;
      const hash = Math.abs((player.userId * 31 + room.questionIndex * 17 + botIdx * 13) % 100);
      player.botDelayMs = Math.min(durationMs - 1400, 1800 + (hash % Math.max(1500, Math.round(durationMs * 0.58))));
      player.botCorrect = hash % 5 !== 0;
    }
  }
};

const BOT_REACTIONS = ['clap', 'hype', 'confused', 'gg'];

const syncPartyRoom = (room) => {
  const ts = Date.now();
  const isDouble = isPartyDoubleQuestion(room);
  for (const p of room.players.values()) {
    if (p.reaction && ts - (p.reactionTs || 0) > 4500) {
      p.reaction = '';
      p.reactionTs = 0;
    }
  }
  if (room.status === 'question') {
    const durationMs = Math.max(1000, room.questionEndsAt - room.questionStartedAt);
    const elapsed = Math.max(0, ts - room.questionStartedAt);
    for (const p of room.players.values()) {
      if (p.isBot && !p.answeredThisQ && elapsed >= (p.botDelayMs || 3500)) {
        applyAnswerToPlayer(p, durationMs, p.botDelayMs || 3500, Boolean(p.botCorrect), isDouble);
      }
    }
    const humans = [...room.players.values()].filter((p) => !p.isBot);
    const allHumansAnswered = humans.length > 0 && humans.every((p) => p.answeredThisQ);
    if (ts >= room.questionEndsAt || allHumansAnswered) {
      for (const p of room.players.values()) {
        if (p.isBot && !p.answeredThisQ) {
          applyAnswerToPlayer(p, durationMs, Math.min(durationMs - 300, p.botDelayMs || elapsed), Boolean(p.botCorrect), isDouble);
        }
        if (p.isBot) {
          p.reaction = p.lastCorrect ? BOT_REACTIONS[(Math.abs(p.userId) + room.questionIndex) % 2 === 0 ? 0 : 1] : 'confused';
          p.reactionTs = ts;
        }
      }
      room.status = 'reveal';
      room.revealEndsAt = ts + 3200;
      room.crownUserId = computePartyCrown(room);
    }
  } else if (room.status === 'reveal' && ts >= room.revealEndsAt) {
    advancePartyQuestion(room, ts);
  }
  room.updatedAt = ts;
};

const serializePartyRoom = (room) => {
  syncPartyRoom(room);
  const ts = Date.now();
  const q = room.questions[room.questionIndex] || null;
  const players = [...room.players.values()].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (room.crownUserId === a.userId && room.crownUserId !== b.userId) return -1;
    if (room.crownUserId === b.userId && room.crownUserId !== a.userId) return 1;
    if (a.totalReactionMs !== b.totalReactionMs) return a.totalReactionMs - b.totalReactionMs;
    return a.joinedAt - b.joinedAt;
  });
  const mappedPlayers = players.map((p, idx) => ({
    rank: idx + 1,
    userId: p.userId,
    name: p.name,
    avatar: p.avatar,
    catConfig: p.catConfig,
    isBot: Boolean(p.isBot),
    ready: Boolean(p.isBot ? true : p.ready),
    totalXp: Number(p.totalXp) || (p.isBot ? ((Math.abs(p.userId) % 7) + 2) * 180 : 0),
    about: String(p.about || (p.isBot ? 'Quick Party AI Cat Challenger' : '')),
    featuredAchievements: Array.isArray(p.featuredAchievements) ? p.featuredAchievements : [],
    facebookName: String(p.facebookName || ''),
    facebookUrl: String(p.facebookUrl || ''),
    instagramName: String(p.instagramName || ''),
    instagramUrl: String(p.instagramUrl || ''),
    xName: String(p.xName || ''),
    xUrl: String(p.xUrl || ''),
    score: p.score,
    correctCount: p.correctCount,
    streak: p.streak,
    bestStreak: p.bestStreak,
    clutchPoints: p.clutchPoints || 0,
    avgReactionMs: p.correctCount > 0 ? Math.round(p.totalReactionMs / p.correctCount) : 0,
    answeredThisQ: p.answeredThisQ,
    lastCorrect: p.lastCorrect,
    lastPointsEarned: p.lastPointsEarned,
    lastReactionMs: p.lastReactionMs,
    reaction: p.reaction && ts - (p.reactionTs || 0) <= 4500 ? p.reaction : '',
    hasCrown: room.crownUserId === p.userId
  }));
  const withCorrect = mappedPlayers.filter((p) => p.correctCount > 0 && p.avgReactionMs > 0);
  const fastestPaw = withCorrect.length
    ? withCorrect.reduce((best, cur) => (cur.avgReactionMs < best.avgReactionMs ? cur : best))
    : null;
  const withStreak = mappedPlayers.filter((p) => p.bestStreak > 0);
  const streakMaster = withStreak.length
    ? withStreak.reduce((best, cur) => (cur.bestStreak > best.bestStreak ? cur : best))
    : null;
  const withClutch = mappedPlayers.filter((p) => p.clutchPoints > 0);
  const clutchWinner = withClutch.length
    ? withClutch.reduce((best, cur) => (cur.clutchPoints > best.clutchPoints ? cur : best))
    : null;
  return {
    code: room.code,
    title: room.title,
    hostUserId: room.hostUserId,
    presetCode: room.presetCode || '',
    status: room.status,
    mode: players.length > 4 ? 'solo-desk' : 'poker-table',
    questionIndex: room.questionIndex,
    totalQuestions: room.questions.length,
    isDoublePoints: isPartyDoubleQuestion(room),
    currentQuestion: q,
    remainingMs:
      room.status === 'question'
        ? Math.max(0, room.questionEndsAt - ts)
        : room.status === 'reveal'
          ? Math.max(0, room.revealEndsAt - ts)
          : 0,
    totalDurationMs:
      room.status === 'question' ? Math.max(1000, room.questionEndsAt - room.questionStartedAt) : 0,
    crownUserId: room.crownUserId,
    highlights: {
      fastestPaw: fastestPaw ? { userId: fastestPaw.userId, name: fastestPaw.name, avgReactionMs: fastestPaw.avgReactionMs } : null,
      streakMaster: streakMaster ? { userId: streakMaster.userId, name: streakMaster.name, bestStreak: streakMaster.bestStreak } : null,
      clutchWinner: clutchWinner ? { userId: clutchWinner.userId, name: clutchWinner.name, clutchPoints: clutchWinner.clutchPoints } : null
    },
    players: mappedPlayers
  };
};

async function api(req, res, url) {
  const method = req.method || 'GET';
  if (url.pathname === '/api/status' && method === 'GET') return json(res, 200, { service: 'learninghaus', version: 1 });
  if (url.pathname === '/api/resolve-canva' && method === 'GET') {
    const rawTarget = String(url.searchParams.get('url') || '').trim();
    const isCanvaHost = (hostName) => /(^|\.)(canva\.com|canva\.link|canva\.site)$/i.test(hostName);
    let current;
    try {
      current = new URL(rawTarget);
    } catch {
      return fail(res, 400, 'Invalid Canva URL.');
    }
    if (!['http:', 'https:'].includes(current.protocol) || !isCanvaHost(current.hostname)) {
      return fail(res, 400, 'Only Canva links are supported.');
    }
    for (let hop = 0; hop < 4 && /(^|\.)canva\.link$/i.test(current.hostname); hop++) {
      try {
        const resp = await fetch(current.toString(), { method: 'GET', redirect: 'manual' });
        const loc = resp.headers.get('location');
        if (!loc || resp.status < 300 || resp.status >= 400) break;
        const nextUrl = new URL(loc, current);
        if (!['http:', 'https:'].includes(nextUrl.protocol) || !isCanvaHost(nextUrl.hostname)) break;
        current = nextUrl;
      } catch {
        break;
      }
    }
    let embedUrl = current.toString();
    if (/(^|\.)canva\.com$/i.test(current.hostname) && !/[?&]embed\b/i.test(embedUrl)) {
      const normalized = new URL(embedUrl);
      normalized.pathname = normalized.pathname.replace(/\/(edit|watch|present)\/?$/i, '/view');
      if (/\/design\/[^/]+\/[^/]+\/?$/i.test(normalized.pathname)) {
        normalized.pathname = normalized.pathname.replace(/\/?$/, '/view');
      }
      normalized.searchParams.set('embed', '');
      embedUrl = normalized.toString().replace(/embed=(&|$)/, 'embed$1');
    }
    return json(res, 200, { ok: true, resolvedUrl: current.toString(), embedUrl });
  }
  if (!['GET', 'HEAD'].includes(method) && req.headers.origin) {
    try { if (new URL(req.headers.origin).host !== req.headers.host) return fail(res, 403, 'Invalid origin.'); }
    catch { return fail(res, 403, 'Invalid origin.'); }
  }
  if (url.pathname === '/api/auth/google/status' && method === 'GET') {
    return json(res, 200, { enabled: isGoogleOAuthConfigured() });
  }
  if (url.pathname === '/api/auth/google/start' && method === 'GET') {
    if (!isGoogleOAuthConfigured()) {
      res.writeHead(302, { Location: '/Code/learninghaus.html#google-unconfigured' });
      return res.end();
    }
    const cutoff = Date.now() - 10 * 60 * 1000;
    for (const [k, ts] of googleOAuthStates) if (ts < cutoff) googleOAuthStates.delete(k);
    const state = randomBytes(24).toString('base64url');
    googleOAuthStates.set(state, Date.now());
    const redirectUri = `${getPublicBaseUrl(req)}/api/auth/google/callback`;
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', String(process.env.GOOGLE_CLIENT_ID || ''));
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('prompt', 'select_account');
    res.writeHead(302, { Location: authUrl.toString() });
    return res.end();
  }
  if (url.pathname === '/api/auth/google/callback' && method === 'GET') {
    const code = String(url.searchParams.get('code') || '').trim();
    const state = String(url.searchParams.get('state') || '').trim();
    if (!isGoogleOAuthConfigured() || !code || !state || !googleOAuthStates.has(state)) {
      res.writeHead(302, { Location: '/Code/learninghaus.html#google-error' });
      return res.end();
    }
    googleOAuthStates.delete(state);
    try {
      const redirectUri = `${getPublicBaseUrl(req)}/api/auth/google/callback`;
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: String(process.env.GOOGLE_CLIENT_ID || ''),
          client_secret: String(process.env.GOOGLE_CLIENT_SECRET || ''),
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });
      const tokenData = await tokenRes.json().catch(() => ({}));
      if (!tokenRes.ok || !tokenData.access_token) {
        res.writeHead(302, { Location: '/Code/learninghaus.html#google-error' });
        return res.end();
      }
      const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const profile = await userRes.json().catch(() => ({}));
      const email = String(profile.email || '').trim().toLowerCase();
      if (!userRes.ok || !email) {
        res.writeHead(302, { Location: '/Code/learninghaus.html#google-error' });
        return res.end();
      }
      const displayName = String(profile.name || email.split('@')[0]).trim().slice(0, 40) || 'Learner';
      const picture = String(profile.picture || '').trim().slice(0, 500);
      let user = db.prepare('SELECT * FROM users WHERE email=?').get(email);
      let isNew = false;
      if (!user) {
        isNew = true;
        const id = Number(
          db.prepare('INSERT INTO users(email,password_hash,display_name,avatar,total_xp,created_at) VALUES(?,?,?,?,0,?)')
            .run(email, passwordHash(randomBytes(24).toString('hex')), displayName, picture, now())
            .lastInsertRowid
        );
        user = db.prepare('SELECT * FROM users WHERE id=?').get(id);
      } else if (!user.avatar && picture) {
        db.prepare('UPDATE users SET avatar=? WHERE id=?').run(picture, user.id);
        user = db.prepare('SELECT * FROM users WHERE id=?').get(user.id);
      }
      issueSession(res, user, true);
      recordUsageEvent(user.id, isNew ? 'register' : 'login', 'google', { method: 'google' }, req);
      res.writeHead(302, { Location: '/Code/learninghaus.html#google-login' });
      return res.end();
    } catch {
      res.writeHead(302, { Location: '/Code/learninghaus.html#google-error' });
      return res.end();
    }
  }
  if (url.pathname === '/api/register' && method === 'POST') {
    const input = await body(req);
    const email = String(input.email || '').trim().toLowerCase();
    const password = String(input.password || '');
    const name = String(input.name || '').trim().slice(0, 40) || email.split('@')[0];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || name.length < 2) return fail(res, 400, 'Enter a valid email, name and password of at least 8 characters.');
    if (db.prepare('SELECT 1 FROM users WHERE email=?').get(email)) return fail(res, 409, 'This email is already registered.');
    const id = Number(db.prepare('INSERT INTO users(email,password_hash,display_name,total_xp,created_at) VALUES(?,?,?,0,?)').run(email, passwordHash(password), name, now()).lastInsertRowid);
    const user = db.prepare('SELECT * FROM users WHERE id=?').get(id);
    issueSession(res, user, true);
    recordUsageEvent(user.id, 'register', 'account', { name }, req);
    return json(res, 201, { user: accountUser(user) });
  }
  if (url.pathname === '/api/login' && method === 'POST') {
    const input = await body(req);
    const user = db.prepare('SELECT * FROM users WHERE email=?').get(String(input.email || '').trim().toLowerCase());
    if (!user || !checkPassword(String(input.password || ''), user.password_hash)) return fail(res, 401, 'Email or password is incorrect.');
    issueSession(res, user, input.rememberMe !== false);
    recordUsageEvent(user.id, 'login', 'account', { isDeveloper: Boolean(user.is_developer) }, req);
    return json(res, 200, { user: accountUser(user) });
  }
  if (url.pathname === '/api/auto-session' && method === 'POST') {
    const existing = currentUser(req);
    if (!existing) return fail(res, 401, 'Please sign in or create an account first.');
    return json(res, 200, { user: accountUser(existing) });
  }
  const user = currentUser(req);
  if (!user) return fail(res, 401, 'Sign in to use friends, chat and shared leaderboards.');
  if (url.pathname === '/api/me' && method === 'GET') return json(res, 200, { user: accountUser(user) });
  if (url.pathname === '/api/analytics/event' && method === 'POST') {
    const input = await body(req, 8192);
    const eventType = String(input.eventType || '').trim().slice(0, 64);
    if (!eventType) return fail(res, 400, 'Missing eventType.');
    recordUsageEvent(
      user.id,
      eventType,
      String(input.target || '').trim().slice(0, 120),
      input.meta && typeof input.meta === 'object' ? input.meta : {},
      req,
      String(input.language || '')
    );
    return json(res, 200, { ok: true });
  }
  if (url.pathname === '/api/dev/analytics' && method === 'GET') {
    if (!user.is_developer) return fail(res, 403, 'Developer access required.');
    const users = db.prepare('SELECT id, email, display_name, total_xp, is_developer, disabled, created_at, last_active_at FROM users ORDER BY id ASC').all();
    const eventCounts = db.prepare('SELECT event_type, COUNT(*) AS count FROM usage_events GROUP BY event_type ORDER BY count DESC').all();
    const recentEvents = db.prepare(`SELECT e.id, e.user_id, u.display_name, e.event_type, e.target, e.device_type, e.language, e.meta_json, e.created_at
      FROM usage_events e JOIN users u ON u.id=e.user_id ORDER BY e.id DESC LIMIT 200`).all();
    const quizSummary = db.prepare(`SELECT u.id AS user_id, u.display_name, COUNT(q.id) AS attempts, ROUND(AVG(q.score), 1) AS avg_score,
      SUM(q.correct) AS total_correct, SUM(q.total_questions) AS total_questions
      FROM quiz_attempts q JOIN users u ON u.id=q.user_id GROUP BY q.user_id ORDER BY attempts DESC`).all();
    const partyMatches = db.prepare('SELECT * FROM party_match_logs ORDER BY id DESC LIMIT 100').all();
    return json(res, 200, {
      generatedAt: now(),
      totals: {
        users: users.length,
        quizAttempts: Number(db.prepare('SELECT COUNT(*) AS count FROM quiz_attempts').get().count),
        partyMatches: Number(db.prepare('SELECT COUNT(*) AS count FROM party_match_logs').get().count),
        usageEvents: Number(db.prepare('SELECT COUNT(*) AS count FROM usage_events').get().count)
      },
      users,
      eventCounts,
      quizSummary,
      partyMatches,
      recentEvents
    });
  }
  if (url.pathname.startsWith('/api/account/') && method === 'POST') {
    const action = url.pathname.slice('/api/account/'.length);
    if (!['disable','restore','delete'].includes(action)) return fail(res, 404, 'Account action not found.');
    const input = await body(req);
    if (!checkPassword(String(input.currentPassword || ''), user.password_hash)) return fail(res, 403, 'Current password is incorrect.');
    if (action === 'delete') {
      db.prepare('DELETE FROM users WHERE id=?').run(user.id);
      res.setHeader('Set-Cookie', 'lh_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
      notify([user.id]);
      return json(res, 200, { deleted: true });
    }
    db.prepare('UPDATE users SET disabled=? WHERE id=?').run(action === 'disable' ? 1 : 0, user.id);
    notify([user.id]);
    return json(res, 200, { user: accountUser(db.prepare('SELECT * FROM users WHERE id=?').get(user.id)) });
  }
  if (user.disabled && url.pathname !== '/api/logout') return fail(res, 403, 'Restore your account to use this feature.');
  if (url.pathname === '/api/achievements' && method === 'GET') return json(res, 200, achievementSnapshot(user.id));
  if (url.pathname === '/api/achievements/import-legacy' && method === 'POST') {
    const input = await body(req);
    const legacyIds = new Set(['beginner','expert','master','fast-thinker','comeback', ...Array.from({ length: 8 }, (_, index) => `chapter-${index + 1}`)]);
    const requested = Array.isArray(input.ids) ? input.ids.slice(0,24).map(String) : [];
    for (const id of requested) if (legacyIds.has(id)) unlockAchievement(user.id,id);
    return json(res, 200, achievementSnapshot(user.id));
  }
  if (url.pathname === '/api/activity' && method === 'POST') {
    db.prepare('INSERT OR IGNORE INTO learning_activity_days(user_id,activity_date) VALUES(?,?)').run(user.id,now().slice(0,10));
    return json(res, 200, achievementSnapshot(user.id));
  }
  if (url.pathname === '/api/profile' && method === 'PATCH') {
    const input = await body(req, 2200000);
    const name = input.name === undefined ? user.display_name : String(input.name).trim();
    const email = input.email === undefined ? user.email : String(input.email).trim().toLowerCase();
    const avatar = input.avatar === undefined ? user.avatar : String(input.avatar);
    const about = input.about === undefined ? user.about : String(input.about).trim();
    const catConfig = input.catConfig === undefined
      ? (user.cat_config || '')
      : (typeof input.catConfig === 'string' ? input.catConfig : JSON.stringify(input.catConfig));
    const catPresets = input.catPresets === undefined
      ? (user.cat_presets || '[]')
      : (typeof input.catPresets === 'string' ? input.catPresets : JSON.stringify(input.catPresets));
    let featuredAchievementsCol = user.featured_achievements || '';
    if (input.featuredAchievements !== undefined) {
      if (input.featuredAchievements === null) {
        featuredAchievementsCol = '';
      } else {
        let requestedList = input.featuredAchievements;
        if (typeof requestedList === 'string') {
          try { requestedList = JSON.parse(requestedList); } catch { return fail(res, 400, 'Invalid achievement showcase format.'); }
        }
        if (!Array.isArray(requestedList)) return fail(res, 400, 'Achievement showcase must be an array.');
        if (requestedList.length > 3) return fail(res, 400, 'Select up to 3 achievements to display.');
        const cleanIds = [];
        const seen = new Set();
        for (const rawId of requestedList) {
          const id = String(rawId || '').trim();
          if (!CATALOG_ACHIEVEMENT_IDS.has(id)) return fail(res, 400, 'Invalid achievement ID in showcase.');
          if (!seen.has(id)) {
            seen.add(id);
            cleanIds.push(id);
          }
        }
        grantAchievements(user.id);
        const CLIENT_TRACKED_IDS = new Set([
          'quest-hunter', 'first-creator', 'knowledge-sharer', 'curriculum-master',
          'quest-designer', 'course-architect', 'learning-mentor'
        ]);
        const unlockedIds = new Set(db.prepare('SELECT achievement_id AS id FROM user_achievements WHERE user_id=?').all(user.id).map((row) => row.id));
        for (const id of cleanIds) {
          if (!unlockedIds.has(id) && !CLIENT_TRACKED_IDS.has(id)) {
            return fail(res, 400, 'You can only display achievements you have unlocked.');
          }
        }
        featuredAchievementsCol = JSON.stringify(cleanIds);
      }
    }
    const contacts = Object.fromEntries(['facebook','instagram','x'].map((key) => {
      const nameKey = `${key}Name`, urlKey = `${key}Url`;
      return [key, { name: input[nameKey] === undefined ? user[`${key}_name`] : String(input[nameKey]).trim(),
        url: input[urlKey] === undefined ? user[`${key}_url`] : String(input[urlKey]).trim() }];
    }));
    const validImage = avatar === ''
      || /^https:\/\/[^\s]{1,500}$/i.test(avatar)
      || (/^data:image\/(?:png|jpeg|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(avatar) && avatar.length <= 2100000);
    const validCatData = catConfig.length <= 120000 && catPresets.length <= 500000;
    const validContacts = Object.values(contacts).every(({name,url}) => name.length <= 80 && url.length <= 500 && Boolean(name) === Boolean(url) && (!url || /^https?:\/\/[^\s]+$/i.test(url)));
    if (name.length < 2 || name.length > 40 || about.length > 500 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !validImage || !validCatData || !validContacts) return fail(res, 400, 'Enter a valid name, email, image and contact links.');
    if (email !== user.email && db.prepare('SELECT 1 FROM users WHERE email=?').get(email)) return fail(res, 409, 'This email is already registered.');
    db.prepare(`UPDATE users SET display_name=?,email=?,avatar=?,about=?,facebook_name=?,facebook_url=?,
      instagram_name=?,instagram_url=?,x_name=?,x_url=?,cat_config=?,cat_presets=?,featured_achievements=? WHERE id=?`)
      .run(name,email,avatar,about,contacts.facebook.name,contacts.facebook.url,contacts.instagram.name,contacts.instagram.url,contacts.x.name,contacts.x.url,catConfig,catPresets,featuredAchievementsCol,user.id);
    const updated = db.prepare('SELECT * FROM users WHERE id=?').get(user.id);
    notify([user.id]);
    return json(res, 200, { user: accountUser(updated) });
  }
  if (url.pathname === '/api/password' && method === 'POST') {
    const input = await body(req);
    const current = String(input.currentPassword || ''), next = String(input.newPassword || '');
    if (!checkPassword(current, user.password_hash)) return fail(res, 403, 'Current password is incorrect.');
    if (next.length < 8) return fail(res, 400, 'New password needs at least 8 characters.');
    db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(passwordHash(next),user.id);
    return json(res, 200, { ok: true });
  }
  if (url.pathname === '/api/logout' && method === 'POST') {
    const token = /(?:^|;\s*)lh_session=([^;]+)/.exec(req.headers.cookie || '')?.[1];
    if (token) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(sha256(token));
    res.setHeader('Set-Cookie', 'lh_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
    return json(res, 200, { ok: true });
  }
  if (url.pathname === '/api/events' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
    res.write(': connected\n\n');
    if (!streams.has(user.id)) streams.set(user.id, new Set());
    streams.get(user.id).add(res);
    const heartbeat = setInterval(() => res.write(': keepalive\n\n'), 25000);
    req.on('close', () => { clearInterval(heartbeat); streams.get(user.id)?.delete(res); });
    return;
  }
  if (url.pathname === '/api/users' && method === 'GET') {
    const q = String(url.searchParams.get('q') || '').trim().slice(0, 60);
    if (q.length < 2) return json(res, 200, { users: [] });
    const users = db.prepare('SELECT id,display_name,avatar,cat_config FROM users WHERE id<>? AND (display_name LIKE ? OR email LIKE ?) ORDER BY display_name LIMIT 20')
      .all(user.id, `%${q}%`, `%${q}%`).map(publicUser);
    return json(res, 200, { users });
  }
  if (url.pathname === '/api/friends' && method === 'GET') {
    const rows = db.prepare(`SELECT f.*,u.id,u.display_name,u.avatar,u.cat_config FROM friendships f JOIN users u
      ON u.id=CASE WHEN f.user_low=? THEN f.user_high ELSE f.user_low END
      WHERE f.user_low=? OR f.user_high=? ORDER BY f.created_at DESC`).all(user.id, user.id, user.id);
    return json(res, 200, { friends: rows.map((row) => ({ ...publicUser(row), status: row.status, direction: row.requested_by === user.id ? 'outgoing' : 'incoming' })) });
  }
  if (url.pathname === '/api/friends/request' && method === 'POST') {
    const target = Number((await body(req)).userId);
    if (!Number.isInteger(target) || target === user.id || !db.prepare('SELECT 1 FROM users WHERE id=?').get(target)) return fail(res, 400, 'Choose another registered user.');
    const low = Math.min(user.id, target), high = Math.max(user.id, target);
    const existing = db.prepare('SELECT * FROM friendships WHERE user_low=? AND user_high=?').get(low, high);
    if (existing?.status === 'accepted') return fail(res, 409, 'Already friends.');
    if (existing?.requested_by === user.id) return fail(res, 409, 'Friend request already sent.');
    if (existing) db.prepare("UPDATE friendships SET status='accepted' WHERE user_low=? AND user_high=?").run(low, high);
    else db.prepare('INSERT INTO friendships(user_low,user_high,requested_by,status,created_at) VALUES(?,?,?,?,?)').run(low, high, user.id, 'pending', now());
    notify([user.id, target]);
    return json(res, 200, { status: existing ? 'accepted' : 'pending' });
  }
  if (url.pathname === '/api/friends/respond' && method === 'POST') {
    const input = await body(req), target = Number(input.userId);
    const low = Math.min(user.id, target), high = Math.max(user.id, target);
    const pending = db.prepare("SELECT 1 FROM friendships WHERE user_low=? AND user_high=? AND requested_by=? AND status='pending'").get(low, high, target);
    if (!pending) return fail(res, 404, 'Friend request not found.');
    if (input.action === 'accept') db.prepare("UPDATE friendships SET status='accepted' WHERE user_low=? AND user_high=?").run(low, high);
    else if (input.action === 'reject') db.prepare('DELETE FROM friendships WHERE user_low=? AND user_high=?').run(low, high);
    else return fail(res, 400, 'Choose accept or reject.');
    notify([user.id, target]);
    return json(res, 200, { ok: true });
  }
  if (url.pathname === '/api/chats' && method === 'GET') {
    const chats = db.prepare(`SELECT c.id,c.kind,c.name,c.created_at,
      (SELECT body FROM messages m WHERE m.chat_id=c.id ORDER BY m.id DESC LIMIT 1) AS lastMessage,
      (SELECT COUNT(*) FROM messages m WHERE m.chat_id=c.id) AS messageCount
      FROM chats c JOIN chat_members cm ON cm.chat_id=c.id WHERE cm.user_id=? ORDER BY c.id DESC`).all(user.id);
    return json(res, 200, { chats: chats.map((chat) => ({ ...chat, name: chat.name || db.prepare(`SELECT u.display_name FROM chat_members cm JOIN users u ON u.id=cm.user_id WHERE cm.chat_id=? AND u.id<>? LIMIT 1`).get(chat.id, user.id)?.display_name || 'Direct chat' })) });
  }
  if (url.pathname === '/api/chats/direct' && method === 'POST') {
    const target = Number((await body(req)).userId);
    if (!Number.isInteger(target) || !areFriends(user.id, target)) return fail(res, 403, 'Add this user as a friend first.');
    const key = `${Math.min(user.id,target)}:${Math.max(user.id,target)}`;
    let chat = db.prepare('SELECT id FROM chats WHERE direct_key=?').get(key);
    if (!chat) {
      const id = Number(db.prepare('INSERT INTO chats(kind,direct_key,created_at) VALUES(?,?,?)').run('direct', key, now()).lastInsertRowid);
      const add = db.prepare('INSERT INTO chat_members(chat_id,user_id) VALUES(?,?)'); add.run(id,user.id); add.run(id,target);
      chat = { id };
    }
    notify([user.id, target]);
    return json(res, 200, { chatId: chat.id });
  }
  if (url.pathname === '/api/chats/groups' && method === 'POST') {
    const input = await body(req);
    const name = String(input.name || '').trim().slice(0, 60);
    const members = [...new Set((Array.isArray(input.memberIds) ? input.memberIds : []).map(Number))];
    if (!name || members.length < 1 || members.length > 20 || members.some((id) => !Number.isInteger(id) || !areFriends(user.id, id))) return fail(res, 400, 'Name the group and select 1–20 friends.');
    const id = Number(db.prepare('INSERT INTO chats(kind,name,created_at) VALUES(?,?,?)').run('group', name, now()).lastInsertRowid);
    const add = db.prepare('INSERT INTO chat_members(chat_id,user_id) VALUES(?,?)');
    for (const member of [user.id, ...members]) add.run(id, member);
    notify([user.id, ...members]);
    return json(res, 201, { chatId: id });
  }
  const messagesPath = /^\/api\/chats\/(\d+)\/messages$/.exec(url.pathname);
  if (messagesPath) {
    const chatId = Number(messagesPath[1]);
    if (!chatMember(chatId, user.id)) return fail(res, 403, 'You are not a member of this chat.');
    if (method === 'GET') {
      const messages = db.prepare(`SELECT m.id,m.body,m.created_at AS createdAt,u.id AS userId,u.display_name AS name
        FROM messages m JOIN users u ON u.id=m.user_id WHERE m.chat_id=? ORDER BY m.id DESC LIMIT 100`).all(chatId).reverse();
      return json(res, 200, { messages });
    }
    if (method === 'POST') {
      const message = String((await body(req)).body || '').trim();
      if (!message || message.length > 2000) return fail(res, 400, 'Write a message up to 2,000 characters.');
      db.prepare('INSERT INTO messages(chat_id,user_id,body,created_at) VALUES(?,?,?,?)').run(chatId,user.id,message,now());
      const members = db.prepare('SELECT user_id FROM chat_members WHERE chat_id=?').all(chatId).map((row) => row.user_id);
      notify(members);
      return json(res, 201, { ok: true });
    }
  }
  if (url.pathname === '/api/scores' && method === 'POST') {
    const input = await body(req);
    const stage = Number(input.stage), score = Number(input.score), correct = Number(input.correct), totalQuestions = Number(input.totalQuestions ?? 10), time = Number(input.timeSeconds), xp = Number(input.totalXp);
    const courseId = String(input.courseId || 'eu-ai-act').trim();
    const lessonId = String(input.lessonId || `stage-${stage}`).trim();
    if (!Number.isInteger(stage) || stage < 1 || stage > 80 || !Number.isInteger(score) || score < 0 || score > 1000
      || !Number.isInteger(totalQuestions) || totalQuestions < 1 || totalQuestions > 100
      || !Number.isInteger(correct) || correct < 0 || correct > totalQuestions
      || !Number.isFinite(time) || time < 0 || time > 14400 || !Number.isInteger(xp) || xp < 0
      || !db.prepare('SELECT 1 FROM courses WHERE course_id=?').get(courseId)
      || !db.prepare('SELECT 1 FROM course_lessons WHERE course_id=? AND lesson_id=?').get(courseId,lessonId)) return fail(res, 400, 'Invalid stage score or lesson.');
    const completedAt = now();
    const previous = db.prepare('SELECT score FROM scores WHERE stage=? AND user_id=?').get(stage, user.id);
    if (!previous || score > previous.score) db.prepare(`INSERT INTO scores(stage,user_id,score,correct,time_seconds,total_xp,updated_at)
      VALUES(?,?,?,?,?,?,?) ON CONFLICT(stage,user_id) DO UPDATE SET score=excluded.score,correct=excluded.correct,time_seconds=excluded.time_seconds,total_xp=excluded.total_xp,updated_at=excluded.updated_at`)
      .run(stage,user.id,score,correct,time,xp,completedAt);
    db.prepare(`INSERT INTO quiz_attempts(user_id,course_id,lesson_id,score,correct,total_questions,time_seconds,completed_at)
      VALUES(?,?,?,?,?,?,?,?)`).run(user.id,courseId,lessonId,score,correct,totalQuestions,time,completedAt);
    db.prepare('INSERT OR IGNORE INTO course_stage_completions(user_id,course_id,lesson_id,completed_at) VALUES(?,?,?,?)')
      .run(user.id,courseId,lessonId,completedAt);
    db.prepare('INSERT OR IGNORE INTO learning_activity_days(user_id,activity_date) VALUES(?,?)')
      .run(user.id,completedAt.slice(0,10));
    const course = db.prepare('SELECT required_lessons FROM courses WHERE course_id=?').get(courseId);
    const courseLessonCount = Number(db.prepare('SELECT COUNT(*) AS count FROM course_stage_completions WHERE user_id=? AND course_id=?').get(user.id,courseId).count);
    if (courseLessonCount >= course.required_lessons) db.prepare('INSERT OR IGNORE INTO course_completions(user_id,course_id,completed_at) VALUES(?,?,?)')
      .run(user.id,courseId,completedAt);
    db.prepare('UPDATE users SET total_xp=MAX(total_xp,?) WHERE id=?').run(xp,user.id);
    return json(res, 200, { ok: true, ...achievementSnapshot(user.id) });
  }
  if (url.pathname === '/api/scores' && method === 'GET') {
    const stage = Number(url.searchParams.get('stage'));
    if (!Number.isInteger(stage) || !db.prepare('SELECT 1 FROM scores WHERE stage=? AND user_id=?').get(stage,user.id)) return fail(res, 403, 'Finish this stage to view its leaderboard.');
    const entries = db.prepare(`SELECT u.id AS userId,u.display_name AS name,u.avatar,u.cat_config AS catConfig,u.total_xp AS totalXp,u.about,
      u.facebook_name AS facebookName,u.facebook_url AS facebookUrl,u.instagram_name AS instagramName,u.instagram_url AS instagramUrl,
      u.x_name AS xName,u.x_url AS xUrl,u.featured_achievements AS featuredAchievements,s.score,s.correct,s.time_seconds AS timeSeconds
      FROM scores s JOIN users u ON u.id=s.user_id WHERE s.stage=? ORDER BY s.score DESC,s.correct DESC,s.time_seconds ASC LIMIT 100`).all(stage)
      .map((entry) => ({ ...entry, featuredAchievements: parseFeaturedAchievements(entry.featuredAchievements) }));
    return json(res, 200, { entries });
  }
  // =========================================================================
  // QUICK PARTY ARENA (Synced Single-Match Rooms & Shareable Deck Presets)
  // =========================================================================
  if (url.pathname === '/api/party/presets' && method === 'GET') {
    const rows = db
      .prepare('SELECT code,title,questions_json AS questionsJson,created_at AS createdAt FROM party_presets WHERE owner_user_id=? ORDER BY created_at DESC LIMIT 30')
      .all(user.id)
      .map((r) => ({ code: r.code, title: r.title, questions: JSON.parse(r.questionsJson || '[]'), createdAt: r.createdAt }));
    return json(res, 200, { presets: rows });
  }
  if (url.pathname === '/api/party/presets' && method === 'POST') {
    const input = await body(req, 131072);
    const title = String(input.title || '').trim().slice(0, 60) || 'Quick Party Deck';
    const questions = sanitizePartyQuestions(input.questions);
    if (!questions.length) return fail(res, 400, 'Add at least 1 question before saving a preset.');
    let code = genPartyCode('PRE');
    while (db.prepare('SELECT 1 FROM party_presets WHERE code=?').get(code)) code = genPartyCode('PRE');
    const createdAt = now();
    db.prepare('INSERT INTO party_presets(code,owner_user_id,title,questions_json,created_at) VALUES(?,?,?,?,?)')
      .run(code, user.id, title, JSON.stringify(questions), createdAt);
    return json(res, 201, { preset: { code, title, questions, createdAt } });
  }
  if (url.pathname === '/api/party/presets/by-code' && method === 'GET') {
    const code = normalizePartyCode(url.searchParams.get('code'));
    if (!code) return fail(res, 400, 'Enter a preset code.');
    const row = db
      .prepare('SELECT p.code,p.title,p.questions_json AS questionsJson,p.created_at AS createdAt,u.display_name AS ownerName FROM party_presets p JOIN users u ON u.id=p.owner_user_id WHERE p.code=?')
      .get(code);
    if (!row) return fail(res, 404, 'Preset code not found.');
    return json(res, 200, {
      preset: { code: row.code, title: row.title, ownerName: row.ownerName, questions: JSON.parse(row.questionsJson || '[]'), createdAt: row.createdAt }
    });
  }
  if (url.pathname.startsWith('/api/party/presets/') && method === 'DELETE') {
    const code = normalizePartyCode(url.pathname.slice('/api/party/presets/'.length));
    db.prepare('DELETE FROM party_presets WHERE code=? AND owner_user_id=?').run(code, user.id);
    return json(res, 200, { ok: true });
  }
  if (url.pathname === '/api/party/rooms' && method === 'POST') {
    const cutoff = Date.now() - 3 * 3600 * 1000;
    for (const [k, r] of partyRooms) {
      if ((r.updatedAt || 0) < cutoff) partyRooms.delete(k);
    }
    const input = await body(req, 131072);
    const title = String(input.title || '').trim().slice(0, 60) || 'Quick Party Arena';
    const questions = shufflePartyQuestionsDeck(sanitizePartyQuestions(input.questions));
    if (!questions.length) return fail(res, 400, 'Room needs at least 1 question.');
    let code = genPartyCode('P');
    while (partyRooms.has(code)) code = genPartyCode('P');
    const room = {
      code,
      title,
      hostUserId: user.id,
      presetCode: normalizePartyCode(input.presetCode || ''),
      status: 'lobby',
      questionIndex: -1,
      questionStartedAt: 0,
      questionEndsAt: 0,
      revealEndsAt: 0,
      crownUserId: null,
      questions,
      players: new Map(),
      updatedAt: Date.now()
    };
    const buildHumanPartyPlayer = () => ({
      userId: user.id,
      name: user.display_name,
      avatar: user.avatar || '',
      catConfig: user.cat_config || '',
      totalXp: Number(user.total_xp) || 0,
      about: user.about || '',
      featuredAchievements: parseFeaturedAchievements(user.featured_achievements),
      facebookName: user.facebook_name || '',
      facebookUrl: user.facebook_url || '',
      instagramName: user.instagram_name || '',
      instagramUrl: user.instagram_url || '',
      xName: user.x_name || '',
      xUrl: user.x_url || '',
      isBot: false,
      ready: false,
      joinedAt: Date.now(),
      score: 0,
      correctCount: 0,
      streak: 0,
      bestStreak: 0,
      clutchPoints: 0,
      totalReactionMs: 0,
      answeredThisQ: false,
      lastCorrect: null,
      lastPointsEarned: 0,
      lastReactionMs: 0,
      reaction: '',
      reactionTs: 0
    });
    room.players.set(user.id, buildHumanPartyPlayer());
    partyRooms.set(code, room);
    recordUsageEvent(user.id, 'party_room_create', code, { title, questionCount: questions.length }, req);
    return json(res, 201, { room: serializePartyRoom(room) });
  }
  if (url.pathname === '/api/party/rooms/join' && method === 'POST') {
    const input = await body(req);
    const code = normalizePartyCode(input.code);
    const room = partyRooms.get(code);
    if (!room) return fail(res, 404, 'Party room not found or expired.');
    syncPartyRoom(room);
    if (!room.players.has(user.id)) {
      if (room.players.size >= 80) return fail(res, 400, 'Room is full (max 80 players).');
      room.players.set(user.id, {
        userId: user.id,
        name: user.display_name,
        avatar: user.avatar || '',
        catConfig: user.cat_config || '',
        totalXp: Number(user.total_xp) || 0,
        about: user.about || '',
        featuredAchievements: parseFeaturedAchievements(user.featured_achievements),
        facebookName: user.facebook_name || '',
        facebookUrl: user.facebook_url || '',
        instagramName: user.instagram_name || '',
        instagramUrl: user.instagram_url || '',
        xName: user.x_name || '',
        xUrl: user.x_url || '',
        isBot: false,
        ready: false,
        joinedAt: Date.now(),
        score: 0,
        correctCount: 0,
        streak: 0,
        bestStreak: 0,
        clutchPoints: 0,
        totalReactionMs: 0,
        answeredThisQ: false,
        lastCorrect: null,
        lastPointsEarned: 0,
        lastReactionMs: 0,
        reaction: '',
        reactionTs: 0
      });
      recordUsageEvent(user.id, 'party_room_join', code, { title: room.title, playerCount: room.players.size }, req);
      notifyPartyMembers(room);
    }
    return json(res, 200, { room: serializePartyRoom(room) });
  }
  const partyRoomMatch = url.pathname.match(/^\/api\/party\/rooms\/([A-Z0-9-]+)(?:\/(bots|start|answer|replay|ready|react))?$/i);
  if (partyRoomMatch) {
    const code = normalizePartyCode(partyRoomMatch[1]);
    const action = (partyRoomMatch[2] || '').toLowerCase();
    const room = partyRooms.get(code);
    if (!room) return fail(res, 404, 'Party room not found.');
    if (!action && method === 'GET') {
      return json(res, 200, { room: serializePartyRoom(room) });
    }
    if (action === 'bots' && method === 'POST') {
      if (room.hostUserId !== user.id) return fail(res, 403, 'Only host can adjust bots.');
      if (room.status !== 'lobby') return fail(res, 400, 'Bots can only be changed in the lobby.');
      const input = await body(req);
      for (const [pid, p] of room.players) {
        if (p.isBot) room.players.delete(pid);
      }
      const humanCount = room.players.size;
      const targetTotal = Number(input.targetTotal);
      const count =
        Number.isFinite(targetTotal) && targetTotal > 0
          ? Math.max(0, Math.min(50, Math.round(targetTotal) - humanCount))
          : Math.max(0, Math.min(50, Math.round(Number(input.count) || 0)));
      for (let i = 0; i < count; i++) {
        const b = createPartyBotProfile(i);
        room.players.set(b.id, {
          userId: b.id,
          name: b.name,
          avatar: '',
          catConfig: b.catConfig,
          isBot: true,
          ready: true,
          joinedAt: Date.now() + i + 1,
          score: 0,
          correctCount: 0,
          streak: 0,
          bestStreak: 0,
          clutchPoints: 0,
          totalReactionMs: 0,
          answeredThisQ: false,
          lastCorrect: null,
          lastPointsEarned: 0,
          lastReactionMs: 0,
          reaction: '',
          reactionTs: 0
        });
      }
      notifyPartyMembers(room);
      return json(res, 200, { room: serializePartyRoom(room) });
    }
    if (action === 'ready' && method === 'POST') {
      const player = room.players.get(user.id);
      if (!player) return fail(res, 403, 'Join this party room first.');
      if (room.status !== 'lobby') return fail(res, 400, 'Ready status only toggles in lobby.');
      const input = await body(req);
      player.ready = input.ready !== undefined ? Boolean(input.ready) : !player.ready;
      notifyPartyMembers(room);
      return json(res, 200, { room: serializePartyRoom(room) });
    }
    if (action === 'react' && method === 'POST') {
      const player = room.players.get(user.id);
      if (!player) return fail(res, 403, 'Join this party room first.');
      const input = await body(req);
      const kind = String(input.reaction || '').trim().toLowerCase();
      if (!['clap', 'hype', 'confused', 'gg'].includes(kind)) {
        return fail(res, 400, 'Invalid reaction sticker.');
      }
      player.reaction = kind;
      player.reactionTs = Date.now();
      notifyPartyMembers(room);
      return json(res, 200, { room: serializePartyRoom(room) });
    }
    if (action === 'start' && method === 'POST') {
      if (room.hostUserId !== user.id) return fail(res, 403, 'Only host can start the game.');
      room.questionIndex = -1;
      room.crownUserId = null;
      room.questions = shufflePartyQuestionsDeck(room.questions);
      for (const p of room.players.values()) {
        p.score = 0;
        p.correctCount = 0;
        p.streak = 0;
        p.bestStreak = 0;
        p.clutchPoints = 0;
        p.totalReactionMs = 0;
        p.reaction = '';
        p.reactionTs = 0;
      }
      advancePartyQuestion(room, Date.now());
      notifyPartyMembers(room);
      return json(res, 200, { room: serializePartyRoom(room) });
    }
    if (action === 'answer' && method === 'POST') {
      const player = room.players.get(user.id);
      if (!player) return fail(res, 403, 'Join this party room first.');
      syncPartyRoom(room);
      const input = await body(req);
      const qIdx = Number(input.questionIndex);
      if (room.status === 'question' && qIdx === room.questionIndex && !player.answeredThisQ) {
        const durationMs = Math.max(1000, room.questionEndsAt - room.questionStartedAt);
        const elapsedMs = Math.max(250, Date.now() - room.questionStartedAt);
        applyAnswerToPlayer(player, durationMs, elapsedMs, Boolean(input.isCorrect), isPartyDoubleQuestion(room));
        syncPartyRoom(room);
        notifyPartyMembers(room);
      }
      return json(res, 200, { room: serializePartyRoom(room) });
    }
    if (action === 'replay' && method === 'POST') {
      if (room.hostUserId !== user.id) return fail(res, 403, 'Only host can replay.');
      room.status = 'lobby';
      room.questionIndex = -1;
      room.crownUserId = null;
      for (const p of room.players.values()) {
        p.score = 0;
        p.correctCount = 0;
        p.streak = 0;
        p.bestStreak = 0;
        p.clutchPoints = 0;
        p.totalReactionMs = 0;
        p.answeredThisQ = false;
        p.lastCorrect = null;
        p.lastPointsEarned = 0;
        p.reaction = '';
        p.reactionTs = 0;
        if (!p.isBot) p.ready = false;
      }
      notifyPartyMembers(room);
      return json(res, 200, { room: serializePartyRoom(room) });
    }
  }
  return fail(res, 404, 'API route not found.');
}

const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.gif':'image/gif', '.svg':'image/svg+xml', '.mp4':'video/mp4', '.webm':'video/webm', '.ico':'image/x-icon', '.json':'application/json; charset=utf-8' };
function staticFile(req, res, url) {
  if (url.pathname === '/') { res.writeHead(302, { Location: '/Code/learninghaus.html' }); return res.end(); }
  const pathname = decodeURIComponent(url.pathname);
  if (/(^|\/)(?:server|node_modules|\.git|\.env)(\/|$)/i.test(pathname)) return fail(res, 404, 'Not found.');
  let file = resolve(siteRoot, `.${pathname}`);
  let rootBound = siteRoot;
  if ((!file.startsWith(siteRoot + sep) || !existsSync(file) || !statSync(file).isFile()) && pathname.startsWith('/Code/')) {
    file = resolve(codeRoot, `.${pathname.slice('/Code'.length)}`);
    rootBound = codeRoot;
  }
  if (!file.startsWith(rootBound + sep) || !existsSync(file) || !statSync(file).isFile()) return fail(res, 404, 'Not found.');
  const size = statSync(file).size;
  const type = types[extname(file).toLowerCase()] || 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (range) {
    const start = range[1] ? Number(range[1]) : Math.max(0,size-Number(range[2] || 0));
    const end = range[2] && range[1] ? Math.min(Number(range[2]),size-1) : size-1;
    if (start >= size || end < start) { res.writeHead(416, { 'Content-Range': `bytes */${size}` }); return res.end(); }
    res.writeHead(206, { ...headers, 'Content-Length': end-start+1, 'Content-Range': `bytes ${start}-${end}/${size}` });
    return createReadStream(file,{start,end}).pipe(res);
  }
  res.writeHead(200, { ...headers, 'Content-Length': size });
  createReadStream(file).pipe(res);
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) {
      await api(req, res, url);
      if (req.method !== 'GET' && req.method !== 'HEAD' || url.pathname === '/api/auth/google/callback') {
        scheduleTursoSync();
      }
    } else {
      staticFile(req, res, url);
    }
  } catch (error) {
    console.error(error);
    if (!res.headersSent) fail(res, error.message === 'Request is too large.' ? 413 : 400, error.message || 'Request failed.');
    else res.end();
  }
}).listen(port, host, () => console.log(`LearningHaus server: http://127.0.0.1:${port}/Code/learninghaus.html`));

for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => {
    void flushTursoSnapshot().finally(() => process.exit(0));
  });
}
