import type { APIRoute } from 'astro';
import { COOKIE } from '../../lib/acceso';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(COOKIE, { path: '/' });
  return redirect('/documentacion', 303);
};
