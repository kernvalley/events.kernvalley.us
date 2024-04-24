import { saveFile } from '@shgysk8zer0/kazoo/filesystem.js';
import { stringify } from 'yaml';
import { parse } from 'marked';

const slugify = str => str.toString()
	.trim()
	.replaceAll(' ', '-')
	.toLowerCase()
	.replaceAll(/[^a-z0-9-]/g, '');

document.forms.event.addEventListener('submit', async event => {
	event.preventDefault();
	const data = new FormData(event.target);
	const eventData = {
		'@context': data.get('@context'),
		'@type': data.get('@type'),
		date: data.get('startDate').substring(0, 10),
		name: data.get('name'),
		title: data.get('name'), // Needs to be duplicated
		description: data.get('description'),
		startDate: data.get('startDate'),
		endDate: data.get('endDate'),
		image: data.get('image'),
		organizer: {
			'@type': data.get('organizer[@type]'),
			name: data.get('organizer[name]'),
			email: data.get('organizer[email]'),
			url: data.get('organizer[url]'),
		},
		location: {
			'@type': data.get('location[@type]'),
			name: data.get('location[name]'),
			address: {
				'@type': data.get('location[address][@type]'),
				streetAddress: data.get('location[address][streetAddress]'),
				addressLocality: data.get('location[address][addressLocality]'),
				addressRegion: data.get('location[address][addressRegion]'),
				postalCode: data.get('location[address][postalCode]'),
				addressCountry: data.get('location[address][addressCountry]'),
			}
		}
	};

	if (data.has('location[geo][latitude]') && data.get('location[geo][longitude]')) {
		eventData.location.geo = {
			'@type': data.get('location[geo][@type]'),
			latitude: parseFloat(data.get('location[geo][latitude]')),
			longitude: parseFloat(data.get('location[geo][longitude]')),
		};
	}

	const file = new File([
		'---\n',
		stringify(eventData),
		'---\n',
		data.get('body'),
	], `${eventData.startDate.substring(0, 10)}-${slugify(eventData.name)}.md`, { type: 'text/markdown' });

	await saveFile(file);
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
		const key = prompt('Enter Imgur key.');
		const resp = await fetch('https://api.imgur.com/3/image', {
			method: 'POST',
			body: target.files.item(0),
			headers: new Headers({
				Authorization: `Client-ID ${key}`,
				Accept: 'application/json',
			})
		});

		const json = await resp.json();

		document.getElementById('event-image').value = json.data.link;
		document.getElementById('event-image').dispatchEvent(new Event('change'));
		target.value = null;
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

document.querySelectorAll('fieldset:disabled, button:disabled').forEach(el => el.disabled = false);
