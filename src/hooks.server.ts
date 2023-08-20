//@ts-ignore
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';
import { redirect, error } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	//@ts-ignore
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	if (event.url.pathname.startsWith('/dashboard')) {
		const session = await event.locals.getSession();
		if (!session) {
			// the user is not signed in
			throw redirect(303, '/');
		}
	}

	if (event.url.pathname.startsWith('/dashboard') && event.request.method === 'POST') {
		const session = await event.locals.getSession();
		if (!session) {
			// the user is not signed in
			throw error(303, '/');
		}
	}

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	//@ts-ignore
	event.locals.getSession = async () => {
		const {
			data: { session } //@ts-ignore
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

// src/hooks.server.ts
