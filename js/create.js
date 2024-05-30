import { saveFile } from '@shgysk8zer0/kazoo/filesystem.js';
import { stringify } from 'yaml';
import { parse } from 'marked';

const slugify = str => str.toString().trim().replaceAll(/[^A-Za-z0-9]+/g, '-').toLowerCase();

document.forms['event-form'].addEventListener('submit', async event => {
	event.preventDefault();
	const data = new FormData(event.target);
	const redirect = data.has('redirect') ? URL.parse(data.get('redirect')) : null;

	const eventData = {
		'@context': data.get('@context'),
		'@type': data.get('@type'),
		layout: redirect instanceof URL ? 'redirect' : 'event-page',
		redirect: redirect ?? undefined,
		date: data.get('startDate').substring(0, 10),
		name: data.get('name').trim(),
		title: data.get('name').trim(), // Needs to be duplicated
		description: data.get('description').trim(),
		tags: data.getAll('tags'),
		startDate: data.get('startDate'),
		endDate: data.get('endDate'),
		image: data.get('image').trim(),
		organizer: {
			'@type': data.get('organizer[@type]'),
			name: data.get('organizer[name]').trim(),
			email: data.get('organizer[email]').trim(),
			url: data.get('organizer[url]').trim(),
		},
		location: data.get('location[@type]') === 'VirtualLocation'? {
			'@type': 'VirtualLocation',
			url: data.get('locattion[url]').trim(),
		} : {
			'@type': data.get('location[@type]'),
			name: data.get('location[name]').trim(),
			address: {
				'@type': data.get('location[address][@type]'),
				streetAddress: data.get('location[address][streetAddress]').trim(),
				addressLocality: data.get('location[address][addressLocality]').trim(),
				addressRegion: data.get('location[address][addressRegion]').trim(),
				postalCode: parseInt(data.get('location[address][postalCode]').trim()),
				addressCountry: data.get('location[address][addressCountry]'),
			}
		}
	};

	if (data.has('location[geo][latitude]') && data.get('location[geo][longitude]')) {
		eventData.location.geo = {
			'@type': data.get('location[geo][@type]'),
			latitude: parseFloat(data.get('location[geo][latitude]').trim()),
			longitude: parseFloat(data.get('location[geo][longitude]').trim()),
		};
	}

	const content = [
		'---\n',
		stringify(eventData),
		'---\n'
	];

	if (data.has('body')) {
		content.push(data.get('body'));
	}

	const file = new File(
		content,
		`${eventData.startDate.substring(0, 10)}-${slugify(eventData.name)}.md`,
		{ type: 'text/markdown' }
	);

	await saveFile(file);

	document.getElementById('instructions-dialog').showModal();
});

document.getElementById('event-start-date').addEventListener('change', ({ target }) => {
	if (typeof target.value !== 'string' || target.value.length < 16) {
		document.getElementById('event-end-date').min = null;
	} else if (target.valueAsDate.getTime() < Date.now()) {
		target.setCustomValidity('Event start time must be in the future.');
	} else {
		document.getElementById('event-end-date').min = target.value;
		target.setCustomValidity('');
	}
});

document.getElementById('event-end-date').addEventListener('change', ({ target }) => {
	if (typeof target.value === 'string' && target.value.length > 15) {
		document.getElementById('event-start-date').max = target.value;
	} else {
		document.getElementById('event-start-date').max = null;
	}
});

document.getElementById('img-upload').addEventListener('change', async ({ target }) => {
	if (target.files.length === 1) {
		target.disabled = true;

		const supported = ['image/jpeg', 'image/png', 'image/webp'];

		try {
			const file = target.files.item(0);

			if (! supported.includes(file.type)) {
				throw new Error(`Invalid file type: ${file.type}.`);
			} else if (file.size > 1048576) { // 1MB
				throw new Error('Image too large. Please resize and try again.');
			}
			const bits = new Uint8Array([67, 108, 105, 101, 110, 116, 45, 73, 68, 32, 100, 98, 52, 102, 99, 49, 102, 52, 52, 102, 98, 54, 54, 48, 99]);
			const resp = await fetch('https://api.imgur.com/3/image', {
				method: 'POST',
				body: file,
				headers: new Headers({
					Authorization: new TextDecoder().decode(bits),
					Accept: 'application/json',
				})
			});

			const json = await resp.json();
			console.log(json);

			if (! json.success) {
				throw new Error(json?.data?.error ?? 'An unknown error occurred uploading the image.');
			} else if (json.data.height > json.data.width) {
				throw new Error('Event images must be "landscape" (width > height).');
			} else if (json.data.width < 640) {
				throw new Error('Image too small. Please use an image that is at least 640 pixels wide.');
			} else {
				document.getElementById('event-image').value = json.data.link;
				document.getElementById('event-image').dispatchEvent(new Event('change'));
				target.value = null;
				target.setCustomValidity('');
			}
		} catch(err) {
			target.setCustomValidity(err.message);
		} finally {
			target.disabled = false;
			target.reportValidity();
		}
	}
});

document.getElementById('preview-md').addEventListener('click', async ({ target }) => {
	try {
		target.disabled = true;
		const { resolve, promise } = Promise.withResolvers();
		const dialog = document.createElement('dialog');
		const content = document.createElement('div');
		const close = document.createElement('button');

		dialog.addEventListener('close', ({ target }) => {
			target.remove();
			resolve();
		});

		content.setHTML(parse(document.getElementById('event-body').value));
		close.type = 'button';
		close.textContent = 'Close';
		close.classList.add('btn','btn-primary');
		dialog.append(close, content);
		close.addEventListener('click', ({ target }) => target.closest('dialog').close());

		document.body.append(dialog);
		dialog.showModal();
		await promise;
	} catch(err) {
		console.error(err);
	} finally {
		target.disabled = false;
	}
});


document.getElementById('import-md').addEventListener('change', async event => {
	const target = event.target;

	if (target.files.length === 1) {
		target.disabled = true;

		try {
			const file = target.files.item(0);

			if (! (
				file.type.startsWith('text/')
				|| ['.txt', '.md'].some(ext => file.name.endsWith(ext))
			)) {
				throw new Error(`${file.name} [${file.type}] is not a markdown or text file.`);
			} else {
				const content = await file.text();

				if (content.startsWith('---')) {
					const trimmed = content.substring(3);
					const endIndex = trimmed.indexOf('---');

					if (endIndex > 0) {
						document.getElementById('event-body').value = trimmed.substring(endIndex + 3).trim();
					} else {
						document.getElementById('event-body').value = content;
					}
				} else {
					document.getElementById('event-body').value = content;
				}

				target.setCustomValidity('');
				target.value = null;
			}
		} catch(err) {
			target.setCustomValidity(err.message);
		} finally {
			target.disabled = false;
			target.reportValidity();
		}
	}
});

function updateAttendance() {
	const isVirtual = document.getElementById('event-attendance-mode').value === 'OnlineEventAttendanceMode';
	const location = document.getElementById('event-location');
	const virtualLocation = document.getElementById('event-virtual-location');

	location.hidden = isVirtual;
	location.disabled = isVirtual;
	virtualLocation.hidden = ! isVirtual;
	virtualLocation.disabled = ! isVirtual;
}

document.getElementById('event-redirect').addEventListener('change', ({ target }) => {
	// Disable article if redirect URL is set
	const content = document.getElementById('event-body');
	const disable = typeof target.value === 'string' && target.value.length !== 0;
	content.disabled = disable;
	content.labels.forEach(label => label.classList.toggle('required', ! disable));
});

document.getElementById('event-attendance-mode').addEventListener('change', updateAttendance);

document.querySelectorAll('[data-close]').forEach(el => {
	el.addEventListener('click', ({ currentTarget }) => {
		document.querySelector(currentTarget.dataset.close).close();
	});
});

document.querySelectorAll('fieldset:disabled:not([hidden]), button:disabled').forEach(el => el.disabled = false);

updateAttendance();
