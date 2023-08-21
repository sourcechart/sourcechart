import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/login');
	}

	const { error } = await supabase
		.from('countries')
		.insert({ id: 250, name: 'test', iso2: '', iso3: '', continent: 'Africa', local_name: '' });

	console.log(error);
	const { data } = await supabase.from('countries').select('name');

	return {
		countries: data ?? []
	};
};
