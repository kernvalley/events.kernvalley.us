import { getJSON } from  '@shgysk8zer0/kazoo/http.js';
import { getStorage, ref, getBlob, list } from 'firebase/firebase-storage.js';
import { initializeApp } from 'firebase/firebase-app.js';
import { createElement } from '@shgysk8zer0/kazoo/elements.js';
import { useSVG } from '@shgysk8zer0/kazoo/svg.js';

const params = new URLSearchParams(location.search);
const BUCKET = 'photo-booth-3347d.appspot.com';
const dlIcon = useSVG('download', { src: null, fill: 'currentColor', height: 20, width: 20, classList: ['icon'] });

async function getConfig() {
	return await getJSON('/photo-booth.json');
}

async function getPhotoBoothStorage() {
	return getStorage(initializeApp(await getConfig(), BUCKET));
}

async function getEventPhotos(eventId) {
	const storage = await getPhotoBoothStorage();
	const results = await list(ref(storage, `event/${eventId}`));
	return results.items;
}

async function getImageBlobURI(storage, path) {
	const blob = await getBlob(ref(storage, path));
	return URL.createObjectURL(blob);
}

function photoClickHandler({ target }) {
	const controller = new AbortController();
	const dialog = document.createElement('dialog');
	const duration = 400;
	const easing = 'ease-out';
	const keyframes = [
		{ opacity: 0, transform: 'scale(0)' },
		{ opacity: 1, transform: 'none' },
	];

	dialog.addEventListener('close', ({ target }) => {
		target.remove();
		controller.abort();
	}, { passive: true, once: true });

	dialog.addEventListener('click', async ({ currentTarget}) => {
		await currentTarget.animate(keyframes, { duration, easing, direction: 'reverse' }).finished;

		currentTarget.close();
	}, { passive: true, signal: controller.signal });

	document.body.addEventListener('keydown', async (event) => {
		if (event.key === 'Escape') {
			event.preventDefault();
			await dialog.animate(keyframes, { duration, easing, direction: 'reverse' }).finished;

			dialog.close();
		}
	},  { signal: controller.signal });

	dialog.classList.add('photo-modal');
	dialog.animate(keyframes, { duration, easing });
	dialog.append(target.cloneNode());

	document.body.append(dialog);
	dialog.showModal();
}

function createImageCard(blob, fullPath, n) {
	return createElement('div', {
		classList: ['photo-booth-card', 'card'],
		animation: {
			keyframes: [
				{ opacity: 0, transform: 'scale(0)' },
				{ opacity: 1, transform: 'none' },
			],
			duration: 200,
			easing: 'ease-out',
		},
		children: [
			createElement('img', {
				src: blob,
				id: `photo-${n}`,
				alt: 'photo-booth preview',
				classList: ['photo-booth-img'],
				dataset: { name: fullPath },
				events: { click: photoClickHandler },
			}),

			document.createElement('br'),
			createElement('a', {
				role: 'button',
				classList: ['btn', 'btn-primary', 'dl-btn'],
				href: blob,
				download: fullPath.split('/').at(-1),
				children: [
					dlIcon.cloneNode(true),
					createElement('span', { text: 'Download' }),
				],
			})
		]
	});
}

if (params.has('photo')) {
	getPhotoBoothStorage().then(async (storage) => {
		document.getElementById('photo-booth-gallery').append(...await Array.fromAsync(
			params.getAll('photo'),
			async (photoPath, n) => createImageCard(await getImageBlobURI(storage, photoPath), photoPath, n),
		));
	});
} else if (params.has('event')) {
	getEventPhotos(params.get('event')).then(async (eventImgs) => {
		const gallery = document.getElementById('photo-booth-gallery');

		for (let n = 0; n < eventImgs.length; n++) {
			getBlob(eventImgs[n]).then(blob => {
				gallery.append(createImageCard(URL.createObjectURL(blob), eventImgs[n].fullPath, n));
			});
		}
	});
}
