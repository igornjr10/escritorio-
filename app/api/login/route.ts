import { configuredKey, equalSecret, issueSession, sameOrigin, sessionCookie } from '../../../agent/lib/office-auth.mjs';
export async function POST(request: Request) {
  const headers = { 'Cache-Control': 'no-store' };
  if (!sameOrigin(request)) return Response.json({ error: 'Origem não autorizada.' }, { status: 403, headers });
  const key = configuredKey();
  if (!key) return Response.json({ error: 'O acesso do escritório ainda precisa ser configurado na hospedagem.' }, { status: 503, headers });
  if (!request.headers.get('content-type')?.startsWith('application/json')) return Response.json({ error: 'Formato inválido.' }, { status: 415, headers });
  const raw = await request.text();
  if (raw.length > 2048) return Response.json({ error: 'Solicitação muito grande.' }, { status: 413, headers });
  let body;
  try { body = JSON.parse(raw); } catch { return Response.json({ error: 'Solicitação inválida.' }, { status: 400, headers }); }
  if (typeof body?.key !== 'string' || !equalSecret(body.key, key)) return Response.json({ error: 'Código de acesso incorreto.' }, { status: 401, headers });
  return Response.json({ ok: true }, { headers: { ...headers, 'Set-Cookie': sessionCookie(issueSession(key)) } });
}
