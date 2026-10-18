import test from 'node:test';
import assert from 'node:assert/strict';
import { POST as login } from '../app/api/login/route.ts';
import { GET as session } from '../app/api/session/route.ts';
import { POST as logout } from '../app/api/logout/route.ts';
const secret = 'test-only-owner-access-key-with-32-characters';
function request(key, origin = 'https://office.example') {
  return new Request('https://office.example/api/login', { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) });
}
test('HTTP login fails closed before setup and for wrong credentials', async () => {
  delete process.env.OFFICE_ACCESS_KEY;
  assert.equal((await login(request(secret))).status, 503);
  process.env.OFFICE_ACCESS_KEY = secret;
  assert.equal((await login(request('wrong'))).status, 401);
  assert.equal((await login(request(secret, 'https://attacker.example'))).status, 403);
  delete process.env.OFFICE_ACCESS_KEY;
});
test('HTTP owner login issues a working session and logout expires its cookie', async () => {
  process.env.OFFICE_ACCESS_KEY = secret;
  const result = await login(request(secret)); assert.equal(result.status, 200);
  const cookie = result.headers.get('set-cookie').split(';')[0];
  const state = await session(new Request('https://office.example/api/session', { headers: { cookie } }));
  assert.deepEqual(await state.json(), { configured: true, authenticated: true });
  const out = await logout(new Request('https://office.example/api/logout', { method: 'POST', headers: { origin: 'https://office.example', cookie } }));
  assert.equal(out.status, 200); assert.match(out.headers.get('set-cookie'), /Max-Age=0/);
  delete process.env.OFFICE_ACCESS_KEY;
});
