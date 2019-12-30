import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://polyfill.io/v3/polyfill.min.js?features=matchMedia%2CWebAnimations';
import 'https://unpkg.com/@webcomponents/custom-elements@1.3.1/custom-elements.min.js';
import 'https://cdn.kernvalley.us/components/share-button.js';
import {ready, $, registerServiceWorker} from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import HTMLOpenStreetMapElement from 'https://cdn.kernvalley.us/components/open-street-map.js';

document.documentElement.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);
document.documentElement.classList.toggle('no-details', document.createElement('details') instanceof HTMLUnknownElement);
document.documentElement.classList.replace('no-js', 'js');

customElements.define(HTMLOpenStreetMapElement.tagName, HTMLOpenStreetMapElement);

if (document.documentElement.dataset.hasOwnProperty('serviceWorker')) {
	registerServiceWorker(document.documentElement.dataset.serviceWorker).catch(console.error);
}

ready().then(async () => {
	$('[data-show-modal]').click(event => {
		const target = event.target.closest('[data-show-modal]');
		const dialog = document.querySelector(target.dataset.showModal);
		if (dialog instanceof HTMLElement) {
			dialog.showModal();
		}
	});

	$('[data-close]').click(event => {
		const target = event.target.closest('[data-close]');
		const dialog = document.querySelector(target.dataset.close);
		if (dialog instanceof HTMLElement) {
			dialog.close();
		}
	});

	$('dialog.form form').reset(({target}) => target.closest('dialog').close());
});
