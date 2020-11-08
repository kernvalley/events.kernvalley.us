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
import { HTMLNotificationElement } from 'https://cdn.kernvalley.us/components/notification/html-notification.js';
import { loadScript } from 'https://cdn.kernvalley.us/js/std-js/loader.js';
import { dialogForm } from 'https://cdn.kernvalley.us/js/std-js/dialogForm.js';
import { MINUTES, HOURS, DAYS } from 'https://cdn.kernvalley.us/js/std-js/timeIntervals.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from 'https://cdn.kernvalley.us/js/std-js/google-analytics.js';
import { $, ready } from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import { GA } from './consts.js';

document.documentElement.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);
document.documentElement.classList.toggle('no-details', document.createElement('details') instanceof HTMLUnknownElement);
document.documentElement.classList.replace('no-js', 'js');

if (typeof GA === 'string' && GA.length !== 0) {
	requestIdleCallback(() => {
		importGa(GA).then(async ({ ga }) => {
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
			const now = Date.now();

			$('.schedule-notification[data-uuid][data-time][data-location-url]').each(async el => {
				const cookie = await await cookieStore.get({ name: `notification-${el.dataset.uuid}` });
				const date = Date.parse(el.dataset.time);
				if (date > now && ! cookie) {
					el.hidden = false;

					el.addEventListener('click', async () => {
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

						const interval = parseInt(await dialogForm('When would you like to be reminded?', {
							text: '30 min. before',
							value: 30 * MINUTES,
						}, {
							text: '1 hour before',
							value: HOURS,
						}, {
							text: '3 hours before',
							value: 3 * HOURS,
						}, {
							text: '1 day before',
							value: DAYS,
						}));

						if (! Number.isNaN(interval)) {
							const reminder = new Date(date - interval);

							await reg.showNotification(el.dataset.title, {
								body: el.dataset.body,
								tag: el.dataset.tag || 'event-reminder',
								icon: el.dataset.icon || '/img/icon-192.png',
								image: el.dataset.image,
								showTrigger: new TimestampTrigger(reminder),
								vibrate: [800, 0, 800],
								timestamp: Date.now(),
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

							new HTMLNotificationElement('Reminder Scheduled', {
								body: `You will be reminded at ${reminder.toLocaleString()}`,
								icon: '/img/icon-192.png',
								vibrate: [],
							});

							$(`.schedule-notification[data-uuid=${CSS.escape(el.dataset.uuid)}]`).hide();
						}
					});
				}
			});
		});
	}
});
