const config = {
	mode:"jit",
	content: [
	  "./src/**/*.{html,js,svelte,ts}",
	  "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
	],
  
	theme: {
		gradientColorStops: theme => ({
		  ...theme('colors'),
		  primary: '#3490dc',
		  secondary: '#ffed4a',
		  danger: '#e3342f',
		  pink: '#d53369',
		  yellow: '#daae51',
		}),
		extend: {},
	},
  
	plugins: [
	  require('flowbite/plugin')
	],
	darkMode: 'class',
  };
  
  module.exports = config;