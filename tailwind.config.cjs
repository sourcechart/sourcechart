const config = {
	mode: 'jit',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	plugins: [require('flowbite/plugin')],
	darkMode: 'class',
	theme: {
		extend: {
			backgroundColor: {
				body: '#1A202C' // dark gray color
			}
		}
	}
};

module.exports = config;
