import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://cdn.kernvalley.us/js/std-js/theme-cookie.js';
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
import 'https://cdn.kernvalley.us/components/app/list-button.js';
import { HTMLNotificationElement } from 'https://cdn.kernvalley.us/components/notification/html-notification.js';
import { loadScript } from 'https://cdn.kernvalley.us/js/std-js/loader.js';
import { dialogForm } from 'https://cdn.kernvalley.us/js/std-js/dialogForm.js';
import { MINUTES, HOURS, DAYS } from 'https://cdn.kernvalley.us/js/std-js/timeIntervals.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from 'https://cdn.kernvalley.us/js/std-js/google-analytics.js';
import { $, ready, notificationsAllowed } from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import { GA } from './consts.js';

$(document.documentElement).toggleClass({
	'no-dialog': document.createElement('dialog') instanceof HTMLUnknownElement,
	'no-details': document.createElement('details') instanceof HTMLUnknownElement,
	'js': true,
	'no-js': false,
});

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
	if (location.pathname.startsWith('/events/') && 'TimestampTrigger' in window) {
		navigator.serviceWorker.ready.then(reg => {
			const now = Date.now();

			$('.schedule-notification[data-uuid][data-time][data-location-url]').each(async el => {
				const cookie = await await cookieStore.get({ name: `notification-${el.dataset.uuid}` });
				const date = Date.parse(el.dataset.time);

				if (date > now && ! cookie) {
					el.hidden = false;

					el.addEventListener('click', async () => {
						if (await notificationsAllowed()) {
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
									value: reminder.toISOString(),
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
						}
					});
				}
			});
		});
	}
});
