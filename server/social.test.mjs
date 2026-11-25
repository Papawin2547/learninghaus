// ทดสอบผู้ใช้ 2 คนผ่าน HTTP คนละ session เพื่อยืนยันว่าเพื่อนและข้อความข้ามเครื่องได้
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { once } from 'node:events';
import { createServer } from 'node:net';

const freePort = () => new Promise((resolve) => {
  const server = createServer(); server.listen(0, '127.0.0.1', () => {
    const port = server.address().port; server.close(() => resolve(port));
  });
});

test('shared stage ranking, friend request, direct chat and group chat', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'learninghaus-test-'));
  const port = await freePort();
  const child = spawn(process.execPath, ['server/index.mjs'], {
    cwd: join(import.meta.dirname, '..'),
    env: { ...process.env, LEARNINGHAUS_PORT: String(port), LEARNINGHAUS_HOST: '127.0.0.1', LEARNINGHAUS_DB_PATH: join(directory, 'test.sqlite') },
    stdio: 'ignore'
  });
  const base = `http://127.0.0.1:${port}`;
  const client = (cookie = '') => async (path, method = 'GET', data) => {
    const res = await fetch(base + path, { method, headers: { ...(cookie ? { Cookie: cookie } : {}), ...(data ? { 'Content-Type': 'application/json' } : {}) }, body: data ? JSON.stringify(data) : undefined });
    return { status: res.status, cookie: res.headers.get('set-cookie')?.split(';')[0], data: await res.json() };
  };
  try {
    let ready = false;
    for (let attempt = 0; attempt < 40; attempt += 1) {
      try { if ((await client()('/api/status')).status === 200) { ready = true; break; } }
      catch { await new Promise((resolve) => setTimeout(resolve, 100)); }
    }
    assert.equal(ready, true, 'server starts');
    const one = await client()('/api/register','POST',{email:'one@example.test',password:'test-password-1',name:'One'});
    const two = await client()('/api/register','POST',{email:'two@example.test',password:'test-password-2',name:'Two'});
    assert.equal(one.status, 201); assert.equal(two.status, 201);
    const a = client(one.cookie), b = client(two.cookie);
    const oneId = one.data.user.id, twoId = two.data.user.id;
    assert.equal((await a('/api/scores?stage=1')).status, 403, 'rankings stay locked before a score');
    assert.equal((await a('/api/scores','POST',{stage:1,score:850,correct:8,timeSeconds:50,totalXp:100})).status, 200);
    assert.equal((await b('/api/scores','POST',{stage:1,score:950,correct:9,timeSeconds:40,totalXp:120})).status, 200);
    const ranking = await a('/api/scores?stage=1');
    assert.deepEqual(ranking.data.entries.map((entry) => entry.name), ['Two','One']);
    assert.equal((await a('/api/profile','PATCH',{name:'One Learner',about:'Learning AI law',facebookName:'One on Facebook',facebookUrl:'https://example.test/one'})).status, 200);
    assert.equal((await b('/api/users?q=One Learner')).data.users[0].name, 'One Learner');
    assert.equal((await a('/api/scores?stage=1')).data.entries[1].facebookUrl, 'https://example.test/one');
    assert.equal((await a('/api/password','POST',{currentPassword:'test-password-1',newPassword:'new-password-1'})).status, 200);
    assert.equal((await client()('/api/login','POST',{email:'one@example.test',password:'test-password-1'})).status, 401);
    assert.equal((await client()('/api/login','POST',{email:'one@example.test',password:'new-password-1'})).status, 200);
    assert.equal((await a('/api/chats/direct','POST',{userId:twoId})).status, 403, 'non-friends cannot chat');
    assert.equal((await a('/api/friends/request','POST',{userId:twoId})).status, 200);
    assert.equal((await b('/api/friends')).data.friends[0].direction, 'incoming');
    assert.equal((await b('/api/friends/respond','POST',{userId:oneId,action:'accept'})).status, 200);
    assert.equal((await a('/api/friends')).data.friends[0].status, 'accepted');
    const direct = await a('/api/chats/direct','POST',{userId:twoId});
    assert.equal(direct.status, 200);
    assert.equal((await a(`/api/chats/${direct.data.chatId}/messages`,'POST',{body:'Hello from One'})).status, 201);
    assert.equal((await b(`/api/chats/${direct.data.chatId}/messages`)).data.messages[0].body, 'Hello from One');
    const group = await b('/api/chats/groups','POST',{name:'Study group',memberIds:[oneId]});
    assert.equal(group.status, 201);
    assert.equal((await a(`/api/chats/${group.data.chatId}/messages`,'POST',{body:'Ready to study?'})).status, 201);
    assert.equal((await b(`/api/chats/${group.data.chatId}/messages`)).data.messages[0].body, 'Ready to study?');
    assert.equal((await client()(`/api/chats/${group.data.chatId}/messages`)).status, 401, 'anonymous cannot read messages');
    assert.equal((await a('/api/account/disable','POST',{currentPassword:'new-password-1'})).status, 200);
    assert.equal((await a('/api/chats')).status, 403, 'disabled account cannot read chats');
    assert.equal((await a('/api/account/restore','POST',{currentPassword:'new-password-1'})).status, 200);
    assert.equal((await a('/api/chats')).status, 200);
    assert.equal((await b('/api/account/delete','POST',{currentPassword:'test-password-2'})).status, 200);
    assert.equal((await b('/api/me')).status, 401, 'deleted account session is invalid');
  } finally {
    if (child.exitCode === null) { child.kill(); await once(child, 'exit'); }
    // ลบเฉพาะโฟลเดอร์ทดสอบที่สร้างภายใต้ Temp เท่านั้น
    if (resolve(directory).startsWith(resolve(tmpdir()) + sep) && directory.includes('learninghaus-test-')) {
      rmSync(directory, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
    }
  }
});
