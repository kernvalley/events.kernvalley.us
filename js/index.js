import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://cdn.kernvalley.us/js/std-js/theme-cookie.js';
import 'https://cdn.kernvalley.us/components/share-to-button/share-to-button.js';
import 'https://cdn.kernvalley.us/components/install/prompt.js';
// import 'https://cdn.kernvalley.us/components/share-button.js';
import 'https://cdn.kernvalley.us/components/copy-button.js';
import 'https://cdn.kernvalley.us/components/weather-current.js';
import 'https://cdn.kernvalley.us/components/github/user.js';
import 'https://cdn.kernvalley.us/components/ad/block.js';
import 'https://cdn.kernvalley.us/components/app/list-button.js';
import 'https://cdn.kernvalley.us/components/app/stores.js';
import 'https://cdn.kernvalley.us/components/disqus/comments.js';
import { shareInit } from 'https://cdn.kernvalley.us/js/std-js/data-share.js';
import { getCustomElement } from 'https://cdn.kernvalley.us/js/std-js/custom-elements.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from 'https://cdn.kernvalley.us/js/std-js/google-analytics.js';
import { loaded, on, toggleClass } from 'https://cdn.kernvalley.us/js/std-js/dom.js';
import { GA } from './consts.js';

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
		btn.dataset.shareUrl = btn.hasAttribute('url') ? new URL(btn.getAttribute('url') || '.', location.origin).href : location.href;
		['sharetitle', 'text', 'url'].forEach(attr => btn.removeAttribute(attr));
		shareInit(btn);
	});
}

[...document.querySelectorAll('a:not([rel~="external"])')]
	.filter(a => a.origin !== location.origin)
	.forEach(a => a.relList.add('external', 'noopener', 'noreerrer'));

if (typeof GA === 'string' && GA.length !== 0) {
	loaded().then(() => {
		requestIdleCallback(() => {
			importGa(GA).then(({ ga, hasGa }) => {
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
}

getCustomElement('install-prompt').then(HTMLInstallPromptElement => {
	const btn = document.getElementById('install-btn');

	if (btn instanceof Element) {
		btn.addEventListener('click', () => new HTMLInstallPromptElement().show());
		btn.hidden = false;
	}
});
