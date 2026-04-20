---
layout: null
---
import { HermesWorker } from '{{ site.data.importmap.imports["@aegisjsproject/hermes/"] }}worker.js';

const staticDirs = ['js', 'css', 'img'];

new HermesWorker([
	{
		name: '{{ site.data.app.name | slugify }}',
		version: '{{ site.data.app.version | default: site.version }}',
		strategy: 'network-first',
		pattern: new URLPattern({
			baseURL: location.origin,
			pathname: `/((?!(?:${staticDirs.join('|')})/).*)`
		}),
		prefetch: [
			'/',
			'/tags/kernville',
			'/tags/lake-isabella',
			'/tags/wofford-heights',
			'/tags/mt-mesa',
			'/tags/weldon',
			'/tags/south-lake',
			'/webapp.webmanifest',
			'/create/',
		].map(path => URL.parse(path, location.origin))
	}, {
		name: '{{ site.data.app.name | slugify }}-assets',
		version: '{{ site.data.app.version | default: site.version }}',
		strategy: 'stale-while-revalidate',
		pattern: new URLPattern({
			baseURL: location.origin,
			pathname: `/(${staticDirs.join('|')})/*`,
		}),
		prefetch: [
			'/js/index.min.js',
			'/css/index.min.css',
			'/img/icons.svg',
			'/img/apple-touch-icon.png',
			'/img/icon-192.png',
			'/img/favicon.svg',
		].map(path => URL.parse(path, location.origin))
	}, {
		name: 'unpkg',
		strategy: 'cache-first',
		pattern: new URLPattern({ baseURL: 'https://unpkg.com/', pathname: '/*' }),
	}, {
		name: 'imgur',
		strategy: 'cache-first',
		pattern: new URLPattern({
			baseURL: 'https://i.imgur.com',
			pathname: '/*',
		}),
	},
]);
