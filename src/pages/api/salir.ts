import type { APIRoute } from 'astro';
import { COOKIE } from '../../lib/acceso';
export const prerender = false;
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (request.headers.get('origin') !== new URL(request.url).origin) return new Response(null, { status: 403 });
  cookies.delete(COOKIE, { path: '/' });
  return redirect('/documentacion#documentacion-acceso', 303);
};
