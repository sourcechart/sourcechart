import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	build: { target: ['es2020'] }, // Needed in `sqlite-wasm-esm` for big-ints to work
	optimizeDeps: {
		exclude: ['sqlite-wasm-esm'], // TODO remove once fixed https://github.com/vitejs/vite/issues/8427
		esbuildOptions: { target: 'es2020' } // Needed in `sqlite-wasm-esm` for big-ints to work
	}
});
