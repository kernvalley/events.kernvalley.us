import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://unpkg.com/@webcomponents/custom-elements@1.4.2/custom-elements.min.js';
import 'https://cdn.kernvalley.us/components/share-to-button/share-to-button.js';
import 'https://cdn.kernvalley.us/components/share-button.js';
import 'https://cdn.kernvalley.us/components/leaflet/map.js';
import 'https://cdn.kernvalley.us/components/leaflet/marker.js';
import 'https://cdn.kernvalley.us/components/copy-button.js';
import 'https://cdn.kernvalley.us/components/pwa/install.js';
import 'https://cdn.kernvalley.us/components/weather-current.js';
import 'https://cdn.kernvalley.us/components/github/user.js';
import 'https://cdn.kernvalley.us/components/ad/block.js';
import { loadScript } from 'https://cdn.kernvalley.us/js/std-js/loader.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from 'https://cdn.kernvalley.us/js/std-js/google-analytics.js';
import { $, ready } from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import { GA } from './consts.js';

document.documentElement.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);
document.documentElement.classList.toggle('no-details', document.createElement('details') instanceof HTMLUnknownElement);
document.documentElement.classList.replace('no-js', 'js');

if (typeof GA === 'string' && GA.length !== 0) {
	requestIdleCallback(() => {
		importGa(GA).then(async () => {
			/* global ga */
			ga('create', GA, 'auto');
			ga('set', 'transport', 'beacon');
			ga('send', 'pageview');

			await ready();

			$('a[rel~="external"]').click(externalHandler, { passive: true, capture: true });
			$('a[href^="tel:"]').click(telHandler, { passive: true, capture: true });
			$('a[href^="mailto:"]').click(mailtoHandler, { passive: true, capture: true });
		});
	});
}

Promise.allSettled([
	ready(),
	loadScript('https://cdn.polyfill.io/v3/polyfill.min.js'),
]).then(async () => {
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

	if (location.pathname.startsWith('/events/') && 'TimestampTrigger' in window) {
		navigator.serviceWorker.ready.then(reg => {
			$('.schedule-notification[data-uuid][data-time]').each(async el => {
				const cookie = await await cookieStore.get({ name: `notification-${el.dataset.uuid}` });
				console.info({ cookie, el });
				if (! cookie) {
					el.hidden = false;

					el.addEventListener('click', async () => {
						if (confirm('Schedule reminder for 1 hour before event?')) {
							await new Promise((resolve, reject) => {
								switch(Notification.permission) {
									case 'default':
										Notification.requestPermission().then(resp => {
											switch(resp) {
												case 'granted':
													resolve();
													break;

												case 'denied':
													reject('Notification permission denied');
													break;

												default:
													reject('Notification permission dismissed');
													break;
											}
										});
										break;

									case 'granted':
										resolve();
										break;

									case 'denied':
										reject('Notification permission denied');
										break;
								}
							});

							await reg.showNotification(el.dataset.title, {
								body: el.dataset.body,
								tag: el.dataset.tag || 'event-reminder',
								icon: el.dataset.icon || '/img/icon-192.png',
								image: el.dataset.image,
								// Schedule for an hour before the event
								showTrigger: new TimestampTrigger(new Date(el.dataset.time) - 3600000),
								vibrate: [800, 0, 800],
								requireInteraction: true,
								data: {
									url: location.href,
									locationUrl: el.dataset.locationUrl,
								},
								actions: [{
									title: 'View Event',
									action: 'open',
								}, {
									title: 'Open in Maps',
									action: 'map',
								}, {
									title: 'Dismiss',
									action: 'dismiss'
								}]
							});

							await cookieStore.set({
								name: `notification-${el.dataset.uuid}`,
								value: 'scheduled',
								secure: true,
								expires: new Date(el.dataset.time),
								sameSite: 'strict',
							});

							$(`.schedule-notification[data-uuid=${CSS.escape(el.dataset.uuid)}]`).hide();
						}
					});
				}
			});
		});
	}
});
