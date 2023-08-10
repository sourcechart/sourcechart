import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

/** @type {import('vite').Plugin} */
const viteServerConfig = {
	name: 'log-request-middleware',
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Methods', 'GET');
			res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
			res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
			next();
		});
	}
};

export default defineConfig({
	plugins: [viteServerConfig, sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	build: { target: ['es2020'] }, // Needed in `sqlite-wasm-esm` for big-ints to work
	optimizeDeps: {
		exclude: ['sqlite-wasm-esm'], // TODO remove once fixed https://github.com/vitejs/vite/issues/8427
		esbuildOptions: { target: 'es2020' } // Needed in `sqlite-wasm-esm` for big-ints to work
	}
});
