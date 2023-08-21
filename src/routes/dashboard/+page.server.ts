import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/login');
	}

	const { data, error } = await supabase
		.from('sessions')
		.insert({ userId: session.user.id, id: session.user.session_id })
		.select();

	console.log(data);
};
