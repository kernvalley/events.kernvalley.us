/* eslint-env node */
import { getConfig } from '@shgysk8zer0/js-utils/rollup';
import { rollupImport, rollupImportMeta } from '@shgysk8zer0/rollup-import';
import { readJSONFile } from '@shgysk8zer0/npm-utils/json';

const { homepage: baseURL } = await readJSONFile('./package.json');

export default getConfig('./js/create.js', {
	plugins: [
		rollupImport('./_data/importmap.json'),
		rollupImportMeta({ baseURL }),
	],
	format: 'iife',
	minify: true,
	sourcemap: true,
});
