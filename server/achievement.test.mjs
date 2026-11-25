// ตรวจการคำนวณ ความคืบหน้า และการบันทึก Achievement ผ่าน API จริงบนฐานข้อมูลชั่วคราว
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { once } from 'node:events';
import { createServer } from 'node:net';

const freePort = () => new Promise((resolve) => {
  const server = createServer();
  server.listen(0, '127.0.0.1', () => { const port = server.address().port; server.close(() => resolve(port)); });
});
const start = async (directory, port) => {
  const child = spawn(process.execPath, ['server/index.mjs'], {
    cwd: join(import.meta.dirname, '..'),
    env: { ...process.env, LEARNINGHAUS_PORT: String(port), LEARNINGHAUS_HOST: '127.0.0.1', LEARNINGHAUS_DB_PATH: join(directory, 'achievements.sqlite') },
    stdio: 'ignore'
  });
  const base = `http://127.0.0.1:${port}`;
  const client = (cookie = '') => async (path, method = 'GET', data) => {
    const response = await fetch(base + path, {
      method,
      headers: { ...(cookie ? { Cookie: cookie } : {}), ...(data ? { 'Content-Type': 'application/json' } : {}) },
      body: data ? JSON.stringify(data) : undefined
    });
    return { status: response.status, cookie: response.headers.get('set-cookie')?.split(';')[0], data: await response.json() };
  };
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { if ((await client()('/api/status')).status === 200) { ready = true; break; } }
    catch { await new Promise((resolve) => setTimeout(resolve, 100)); }
  }
  assert.equal(ready, true, 'server starts with the additive achievement schema');
  return { child, client, close: async () => { if (child.exitCode === null) { child.kill(); await once(child, 'exit'); } } };
};

test('achievement rules use unique completed lessons, quiz attempts, and survive a server restart', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'learninghaus-achievement-test-'));
  const port = await freePort();
  let server = await start(directory, port);
  try {
    const account = await server.client()('/api/register', 'POST', { email: 'achiever@example.test', password: 'test-password-1', name: 'Achiever' });
    assert.equal(account.status, 201);
    const api = server.client(account.cookie);
    const initial = await api('/api/achievements');
    assert.equal(initial.status, 200);
    assert.equal(initial.data.metrics.completedLessons, 0);
    assert.equal(initial.data.metrics.creator.available, false);
    assert.deepEqual(initial.data.unlocked, []);

    const submit = (stage, correct, totalQuestions = 10, timeSeconds = 60) => api('/api/scores', 'POST', {
      stage, courseId: 'eu-ai-act', score: Math.round(correct / totalQuestions * 1000), correct,
      totalQuestions, timeSeconds, totalXp: 60
    });
    let result = await submit(1, 8, 10, 50);
    assert.equal(result.status, 200);
    assert.deepEqual(new Set(result.data.unlocked.map((item) => item.id)), new Set(['beginner', 'quiz-challenger', 'fast-thinker']));

    result = await submit(1, 6);
    assert.equal(result.data.unlocked.some((item) => item.id === 'comeback'), false, 'a worse or non-passing replay does not earn Comeback Learner');
    result = await submit(1, 9);
    assert.equal(result.data.unlocked.some((item) => item.id === 'comeback'), true, 'a passing replay that improves on an earlier imperfect attempt earns Comeback Learner');
    assert.equal(result.data.unlocked.some((item) => item.id === 'growth-mindset'), true, 'a better replay earns Growth Mindset');
    assert.deepEqual(result.data.completedStages, [1]);
    result = await submit(2, 5, 5);
    assert.equal(result.data.unlocked.some((item) => item.id === 'perfect-score'), true, 'a 100% quiz with at least five questions earns Perfect Score');
    await submit(3, 6);
    await submit(4, 6);
    result = await submit(5, 6);
    assert.equal(result.data.metrics.completedLessons, 5, 'replays do not double-count lessons');
    assert.equal(result.data.metrics.chapterProgress['eu-ai-act:1'], 5);
    assert.equal(result.data.unlocked.some((item) => item.id === 'knowledge-seeker'), true);
    assert.equal(result.data.metrics.activeDays, 1, 'multiple attempts on one calendar day count as one day');
    const activity = await api('/api/activity', 'POST', {});
    assert.equal(activity.data.metrics.activeDays, 1, 'video and quiz activity on the same day are counted once');
    assert.equal(result.data.metrics.completedCourses, 0, 'an unfinished course does not count as completed');
    assert.equal(result.data.unlocked.some((item) => item.id === 'chapter-1'), false);
    assert.equal(result.data.unlocked.some((item) => item.id === 'first-creator'), false);

    for (let stage = 6; stage <= 80; stage += 1) result = await submit(stage, 6);
    assert.equal(result.data.metrics.completedLessons, 80);
    assert.equal(result.data.metrics.completedCourses, 1);
    assert.equal(result.data.unlocked.some((item) => item.id === 'course-finisher'), true, 'the course badge unlocks only after all 80 unique stages');
    assert.equal(result.data.unlocked.some((item) => item.id === 'chapter-8'), true);
    assert.equal(result.data.unlocked.some((item) => item.id === 'expert'), false, 'one course does not meet the three-course Expert condition');
    assert.equal(result.data.unlocked.some((item) => item.id === 'master'), false, 'one course does not meet the five-course Master condition');

    const unlockedBeforeRestart = result.data.unlocked.map((item) => item.id).sort();
    await server.close();
    server = await start(directory, port);
    const afterRestart = await server.client(account.cookie)('/api/achievements');
    assert.equal(afterRestart.status, 200);
    assert.equal(afterRestart.data.metrics.completedLessons, 80);
    assert.equal(afterRestart.data.metrics.completedQuizzes, 82);
    assert.deepEqual(afterRestart.data.unlocked.map((item) => item.id).sort(), unlockedBeforeRestart);

    // Featured leaderboard achievement showcase validation & multi-user visibility
    const lockedAttempt = await server.client(account.cookie)('/api/profile', 'PATCH', {
      featuredAchievements: ['expert']
    });
    assert.equal(lockedAttempt.status, 400, 'cannot showcase a locked achievement');

    const tooManyAttempt = await server.client(account.cookie)('/api/profile', 'PATCH', {
      featuredAchievements: ['beginner', 'quiz-challenger', 'fast-thinker', 'course-finisher']
    });
    assert.equal(tooManyAttempt.status, 400, 'cannot showcase more than 3 achievements');

    const saveShowcase = await server.client(account.cookie)('/api/profile', 'PATCH', {
      featuredAchievements: ['fast-thinker', 'perfect-score', 'beginner']
    });
    assert.equal(saveShowcase.status, 200);
    assert.deepEqual(saveShowcase.data.user.featuredAchievements, ['fast-thinker', 'perfect-score', 'beginner']);

    const viewer = await server.client()('/api/register', 'POST', { email: 'viewer@example.test', password: 'test-password-2', name: 'Viewer' });
    assert.equal(viewer.status, 201);
    const viewerApi = server.client(viewer.cookie);
    assert.equal((await viewerApi('/api/scores', 'POST', {
      stage: 1, courseId: 'eu-ai-act', score: 600, correct: 6, totalQuestions: 10, timeSeconds: 90, totalXp: 60
    })).status, 200);

    await server.close();
    server = await start(directory, port);
    const meAfterRestart = await server.client(account.cookie)('/api/me');
    assert.equal(meAfterRestart.status, 200);
    assert.deepEqual(meAfterRestart.data.user.featuredAchievements, ['fast-thinker', 'perfect-score', 'beginner']);

    const viewerScores = await server.client(viewer.cookie)('/api/scores?stage=1');
    assert.equal(viewerScores.status, 200);
    const achieverEntry = viewerScores.data.entries.find((entry) => entry.name === 'Achiever');
    assert.ok(achieverEntry, 'Achiever appears on stage 1 leaderboard');
    assert.deepEqual(achieverEntry.featuredAchievements, ['fast-thinker', 'perfect-score', 'beginner']);
  } finally {
    await server.close();
    if (resolve(directory).startsWith(resolve(tmpdir()) + sep) && directory.includes('learninghaus-achievement-test-')) {
      rmSync(directory, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
    }
  }
});
