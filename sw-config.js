---
layout: null
---
'use strict';
/* eslint-env serviceworker */
/* eslint no-unused-vars: 0 */

async function updateAssets(assets, {
	referrerPolicy = 'no-referrer',
	version = '{{ site.data.app.version | default: site.version }}',
} = {}) {
	if (Array.isArray(assets) && assets.length !== 0) {
		const cache = await caches.open(version);
		await Promise.allSettled(assets.filter(url => url.length !== 0).map(async url => {
			const req = new Request(new URL(url, location.origin), { referrerPolicy: 'no-referrer' });
			const resp = await fetch(req);

			if (resp.ok) {
				await cache.put(req, resp);
			}
		}));
	}
}

const config = {
	version: '{{ site.data.app.version | default: site.version }}',
	fresh: [
		'{{ site.pages | where: "pinned", true | map: "url" | join: "', '" }}',
		'https://apps.kernvalley.us/apps.json',
		'/webapp.webmanifest',
	].map(path => new URL(path, location.origin).href),
	stale: [
		/* JS, `customElements`, etc. */
		'https://cdn.kernvalley.us/js/shims.min.js',
		'https://cdn.kernvalley.us/js/std-js/harden.js',
		'/js/index.min.js',
		// 'https://cdn.kernvalley.us/components/toast-message.html',
		'https://cdn.kernvalley.us/components/share-to-button/share-to-button.html',
		'https://cdn.kernvalley.us/components/pwa/prompt.html',
		'https://cdn.kernvalley.us/components/weather/current.html',

		/* CSS */
		'/css/index.min.css',
		// 'https://cdn.kernvalley.us/components/toast-message.css',
		'https://cdn.kernvalley.us/components/share-to-button/share-to-button.css',
		'https://cdn.kernvalley.us/components/pwa/prompt.css',
		'https://cdn.kernvalley.us/components/weather/current.css',

		/* Images & Icons */
		'/img/icons.svg',
		'/img/apple-touch-icon.png',
		'/img/icon-192.png',
		'/img/favicon.svg',
		'https://cdn.kernvalley.us/img/adwaita-icons/actions/mail-send.svg',
		'https://cdn.kernvalley.us/img/adwaita-icons/actions/mark-location.svg',
		'https://cdn.kernvalley.us/img/octicons/file-media.svg',
		'https://cdn.kernvalley.us/img/logos/play-badge.svg',
		'https://cdn.kernvalley.us/img/logos/instagram.svg',

		/* Fonts */
		'https://cdn.kernvalley.us/fonts/roboto.woff2',
	].map(path => new URL(path, location.origin).href),
	allowed: [
		'https://i.imgur.com/',
		'https://cdn.kernvalley.us/img/branding/',
		/https:\/\/[a-z-]+\.disqus\.com\/embed\.js/,
		/https:\/\/\w+\.githubusercontent\.com\/u\/*/,
		/\.(jpg|png|gif|webp|ico|woff2|woff|ttf|oft)$/,
	],
	allowedFresh: [
		'https://api.github.com/users/',
		'https://api.openweathermap.org/data/2.5/weather',
		/\.(js|css|html|json)$/,
	],
	periodicSync: {
		'main-assets': async () => await updateAssets([
			'/js/index.min.js',
			'/css/index.min.css',
			'/img/icons.svg',
			'/webapp.webmanifest',
		]),
		'upcoming-events': async () => await updateAssets([
			'/', '{{ site.events | where: "pinned", true | map: "url" | join: "', '" }}',
		]),
	},
};
