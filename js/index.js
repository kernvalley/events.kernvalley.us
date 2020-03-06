import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://polyfill.io/v3/polyfill.min.js';
import 'https://unpkg.com/@webcomponents/custom-elements@1.3.1/custom-elements.min.js';
import 'https://cdn.kernvalley.us/components/share-button.js';
import 'https://cdn.kernvalley.us/components/leaflet/map.js';
import 'https://cdn.kernvalley.us/components/leaflet/marker.js';
import { registerServiceWorker, $, ready } from 'https://cdn.kernvalley.us/js/std-js/functions.js';

document.documentElement.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);
document.documentElement.classList.toggle('no-details', document.createElement('details') instanceof HTMLUnknownElement);
document.documentElement.classList.replace('no-js', 'js');

if (document.documentElement.dataset.hasOwnProperty('serviceWorker')) {
	registerServiceWorker(document.documentElement.dataset.serviceWorker).catch(console.error);
}

ready().then(() => {
	$('form.stepped-form').each(form => {
		form.hidden = false;
		$('fieldset.form-step[data-step] [data-to-step]', form).click(({target}) => {
			const btn = target.closest('[data-to-step]');
			const current = btn.closest('[data-step]');
			const currentStep = parseInt(current.dataset.step);
			const step = parseInt(btn.dataset.toStep);
			const fieldset = form.querySelector(`[data-step="${step}"]`);
			const inputs = [...current.querySelectorAll('input, select, textarea')];
			const invalid = inputs.find(input => ! input.validity.valid);

			if (! (invalid instanceof HTMLElement) || step < currentStep) {
				current.classList.remove('step-active');
				fieldset.classList.add('step-active');
			} else {
				invalid.scrollIntoView({block: 'start', behavior: 'smooth'});
				invalid.focus();
			}
		}, {
			passive: true,
		});
	});
});
