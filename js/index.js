import '@shgysk8zer0/kazoo/theme-cookie.js';
import { DAYS } from '@shgysk8zer0/kazoo/date-consts.js';
import { shareInit } from '@shgysk8zer0/kazoo/data-share.js';
import { getGooglePolicy, getDefaultPolicyWithDisqus } from '@shgysk8zer0/kazoo/trust-policies.js';
import { createPolicy } from '@shgysk8zer0/kazoo/trust.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from '@shgysk8zer0/kazoo/google-analytics.js';
import { loaded, on, toggleClass } from '@shgysk8zer0/kazoo/dom.js';
import { GA } from './consts.js';
import './components.js';
import '@shgysk8zer0/components/loading-spinner.js';

getDefaultPolicyWithDisqus();

toggleClass([document.documentElement], {
	'no-dialog': document.createElement('dialog') instanceof HTMLUnknownElement,
	'no-details': document.createElement('details') instanceof HTMLUnknownElement,
	'js': true,
	'no-js': false,
});

if (navigator.canShare() && typeof customElements.get('share-button') === 'undefined') {
	[...document.querySelectorAll('[is="share-button"]')].forEach(btn => {
		btn.dataset.shareTitle = btn.getAttribute('sharetitle') || document.title;
		btn.dataset.shareText = btn.getAttribute('text');
		btn.dataset.shareUrl = btn.hasAttribute('url') ? new URL(btn.getAttribute('url') || './', location.origin).href : location.href;
		['sharetitle', 'text', 'url'].forEach(attr => btn.removeAttribute(attr));
		shareInit(btn);
		btn.hidden = false;
	});
}

[...document.querySelectorAll('a:not([rel~="external"])')]
	.filter(a => a.origin !== location.origin)
	.forEach(a => a.relList.add('external', 'noopener', 'noreferrer'));

if (typeof GA === 'string' && GA.length !== 0) {
	const policy = getGooglePolicy();

	scheduler.postTask(async () => {
		const { ga, hasGa } = await importGa(GA, {}, { policy });

		if (hasGa()) {
			ga('create', GA, 'auto');
			ga('set', 'transport', 'beacon');
			ga('send', 'pageview');

			on('a[rel~="external"]', ['click'], externalHandler, { passive: true });
			on('a[href^="tel:"]', ['click'], telHandler, { passive: true });
			on('a[href^="mailto:"]', ['click'], mailtoHandler, { passive: true });
		}
	}, { priority: 'background' });

	loaded().then(() => {
		requestIdleCallback(() => {
		});
	});
} else {
	createPolicy('goog#script-url', {});
	createPolicy('goog#html', {});
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.ready.then(async reg => {
		if ('periodicSync' in reg && 'permissions' in navigator) {
			const { state } = await navigator.permissions.query({ name: 'periodic-background-sync' });

			if (state === 'granted') {
				reg.periodicSync.register('main-assets', { minInterval: 7 *  DAYS }).catch(console.error);
				reg.periodicSync.register('upcoming-events', { minInterval: 1 * DAYS }).catch(console.error);
			}
		}
	});
}

customElements.whenDefined('install-prompt').then(HTMLInstallPromptElement => {
	const btn = document.getElementById('install-btn');

	if (btn instanceof Element) {
		btn.addEventListener('click', () => new HTMLInstallPromptElement().show());
		btn.hidden = false;
	}
});
