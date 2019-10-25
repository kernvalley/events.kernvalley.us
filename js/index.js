import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://cdn.kernvalley.us/components/share-button.js';
import {ready, $, registerServiceWorker} from 'https://cdn.kernvalley.us/js/std-js/functions.js';

document.documentElement.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);
document.documentElement.classList.toggle('no-details', document.createElement('details') instanceof HTMLUnknownElement);
document.documentElement.classList.replace('no-js', 'js');

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
});
