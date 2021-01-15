---
layout: null
---
'use strict';
/*eslint no-unused-vars: 0*/
const config = {
	version: '{{ site.data.app.version | default: site.version }}',
	fresh: [
		'{{ site.pages | where: "pinned", true | map: "url" | join: "', '" }}',
		'{{ site.events | where: "pinned", true | map: "url" | join: "', '" }}',
		'https://apps.kernvalley.us/apps.json',
		'/manifest.json',
	].map(path => new URL(path, location.origin).href),
	stale: [
		'/css/index.min.css',
		'/js/index.min.js',
		'/img/icons.svg',

		/* JS, `customElements`, etc. */
		'https://cdn.kernvalley.us/components/toast-message.html',
		'https://cdn.kernvalley.us/components/share-to-button/share-to-button.html',
		'https://cdn.kernvalley.us/components/leaflet/map.html',
		'https://cdn.kernvalley.us/components/pwa/prompt.html',
		'https://cdn.kernvalley.us/components/weather-current.html',

		/* CSS */
		'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css',
		'https://cdn.kernvalley.us/components/toast-message.css',
		'https://cdn.kernvalley.us/components/share-to-button/share-to-button.css',
		'https://cdn.kernvalley.us/components/leaflet/map.css',
		'https://cdn.kernvalley.us/components/pwa/prompt.css',
		'https://cdn.kernvalley.us/components/weather-current.css',

		/* Images & Icons */
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
		'https://cdn.kernvalley.us/fonts/Libertine.woff',
		'https://cdn.kernvalley.us/fonts/ubuntu.woff2',
		/* Other */
	].map(path => new URL(path, location.origin).href),
	allowed: [
		/https:\/\/secure\.gravatar\.com\/avatar\/*/,
		/https:\/\/i\.imgur\.com\/*/,
		/https:\/\/maps\.wikimedia\.org\/osm-intl\/*/,
		/https:\/\/events\.kernvalley\.us\/events\/*/,
		/https:\/\/api\.github\.com\/users\/*/,
		/https:\/\/*\.githubusercontent\.com\/u\/*/,
	],
};
