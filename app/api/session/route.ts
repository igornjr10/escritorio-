import { configuredKey, isAuthenticated } from '../../../agent/lib/office-auth.mjs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  return Response.json({ configured: !!configuredKey(), authenticated: isAuthenticated(request) }, { headers: { 'Cache-Control': 'no-store' } });
}
