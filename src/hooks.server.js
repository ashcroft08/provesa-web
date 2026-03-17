import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { analyticsService } from '$lib/server/services/analytics.service';
import { sequence } from '@sveltejs/kit/hooks';

/** @type {import('@sveltejs/kit').Handle} */ 
const handleAnalytics = async ({ event, resolve }) => {
	const { pathname } = event.url;
	
	const isPublic = !pathname.startsWith('/admin') && 
					 !pathname.startsWith('/login') && 
					 !pathname.includes('.');

	if (!building && isPublic) {
		analyticsService.trackView(pathname);
	}

	return resolve(event);
};

/** @type {import('@sveltejs/kit').Handle} */ 
const handleBetterAuth = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle = sequence(handleAnalytics, handleBetterAuth);
