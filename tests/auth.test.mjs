import test from 'node:test';
import assert from 'node:assert/strict';
import { issueSession, verifySession, isAuthenticated, sessionCookie, COOKIE_NAME, SESSION_SECONDS } from '../agent/lib/office-auth.mjs';
const key = 'test-only-secret-with-more-than-32-characters';
test('accepts signed owner sessions and rejects expiration', () => {
  const now = Date.now(), token = issueSession(key, now);
  assert.equal(verifySession(token, key, now + 1000), true);
  assert.equal(verifySession(token, key, now + SESSION_SECONDS * 1000 + 1), false);
});
test('rejects tampered signatures and rotated keys', () => {
  const token = issueSession(key);
  assert.equal(verifySession(token + 'x', key), false);
  assert.equal(verifySession(token, key + 'rotated'), false);
  assert.equal(verifySession('invalid', key), false);
});
test('fails closed when access key is absent or too short', () => {
  assert.equal(verifySession(issueSession(key), null), false);
  assert.equal(verifySession(issueSession(key), 'short'), false);
});
test('rejects cross-origin mutation even with a valid owner cookie', () => {
  process.env.OFFICE_ACCESS_KEY = key;
  const cookie = `${COOKIE_NAME}=${issueSession(key)}`;
  assert.equal(isAuthenticated(new Request('https://office.example/eve/v1/session', { method: 'POST', headers: { cookie, origin: 'https://attacker.example' } })), false);
  assert.equal(isAuthenticated(new Request('https://office.example/eve/v1/session', { method: 'POST', headers: { cookie, origin: 'https://office.example' } })), true);
  delete process.env.OFFICE_ACCESS_KEY;
});
test('marks production cookie HttpOnly, Secure and SameSite=Strict', () => {
  const old = process.env.NODE_ENV; process.env.NODE_ENV = 'production';
  assert.match(sessionCookie('token'), /HttpOnly/); assert.match(sessionCookie('token'), /SameSite=Strict/); assert.match(sessionCookie('token'), /; Secure/);
  if (old) process.env.NODE_ENV = old; else delete process.env.NODE_ENV;
});
