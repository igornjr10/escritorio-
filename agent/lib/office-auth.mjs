import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
export const COOKIE_NAME = 'igor_office_session';
export const SESSION_SECONDS = 12 * 60 * 60;
export function configuredKey() { const key = process.env.OFFICE_ACCESS_KEY; return key && key.length >= 32 ? key : null; }
export function equalSecret(a, b) { return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest()); }
function signature(payload, key) { return createHmac('sha256', key).update('igor-office-session-v1:' + payload).digest('base64url'); }
export function issueSession(key, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ sub: 'igor-office-owner', exp: Math.floor(now / 1000) + SESSION_SECONDS, nonce: randomBytes(16).toString('hex') })).toString('base64url');
  return payload + '.' + signature(payload, key);
}
export function verifySession(token, key, now = Date.now()) {
  if (!key || key.length < 32 || typeof token !== 'string' || token.length > 1000) return false;
  const parts = token.split('.');
  if (parts.length !== 2 || !equalSecret(parts[1], signature(parts[0], key))) return false;
  try { const data = JSON.parse(Buffer.from(parts[0], 'base64url').toString()); return data.sub === 'igor-office-owner' && Number.isSafeInteger(data.exp) && data.exp > Math.floor(now / 1000) && data.exp <= Math.floor(now / 1000) + SESSION_SECONDS; } catch { return false; }
}
export function sessionFromRequest(request) { const cookie = request.headers.get('cookie') || ''; return cookie.split(';').map(x => x.trim()).find(x => x.startsWith(COOKIE_NAME + '='))?.slice(COOKIE_NAME.length + 1) || ''; }
export function sameOrigin(request) { return request.headers.get('origin') === (process.env.OFFICE_ORIGIN || new URL(request.url).origin); }
export function isAuthenticated(request) {
  if (!['GET', 'HEAD'].includes(request.method) && !sameOrigin(request)) return false;
  return verifySession(sessionFromRequest(request), configuredKey());
}
export function sessionCookie(value, maxAge = SESSION_SECONDS) { return `${COOKIE_NAME}=${value}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`; }
