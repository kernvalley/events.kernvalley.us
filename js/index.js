import 'std-js/theme-cookie.js';
import '@shgysk8zer0/components/share-to-button/share-to-button.js';
import '@shgysk8zer0/components/install/prompt.js';
import '@shgysk8zer0/components/share-button.js';
import '@shgysk8zer0/components/copy-button.js';
import '@shgysk8zer0/components/weather/current.js';
import '@shgysk8zer0/components/github/user.js';
import '@kernvalley/components/ad.js';
import '@shgysk8zer0/components/app/list-button.js';
import '@shgysk8zer0/components/app/stores.js';
import '@shgysk8zer0/components/disqus/comments.js';
import { DAYS } from 'std-js/date-consts.js';
import { shareInit } from 'std-js/data-share.js';
import { getCustomElement } from 'std-js/custom-elements.js';
import { getGooglePolicy, getDefaultPolicyWithDisqus } from 'std-js/trust-policies.js';
import { createPolicy } from 'std-js/trust.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from 'std-js/google-analytics.js';
import { loaded, on, toggleClass } from 'std-js/dom.js';
import { GA } from './consts.js';

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
	.forEach(a => a.relList.add('external', 'noopener', 'noreerrer'));

if (typeof GA === 'string' && GA.length !== 0) {
	const policy = getGooglePolicy();

	loaded().then(() => {
		requestIdleCallback(() => {
			importGa(GA, {}, { policy }).then(({ ga, hasGa }) => {
				if (hasGa()) {
					ga('create', GA, 'auto');
					ga('set', 'transport', 'beacon');
					ga('send', 'pageview');

					on('a[rel~="external"]', ['click'], externalHandler, { passive: true });
					on('a[href^="tel:"]', ['click'], telHandler, { passive: true });
					on('a[href^="mailto:"]', ['click'], mailtoHandler, { passive: true });
				}
			});
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

getCustomElement('install-prompt').then(HTMLInstallPromptElement => {
	const btn = document.getElementById('install-btn');

	if (btn instanceof Element) {
		btn.addEventListener('click', () => new HTMLInstallPromptElement().show());
		btn.hidden = false;
	}
});
