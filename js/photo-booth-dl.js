import { getJSON } from  '@shgysk8zer0/kazoo/http.js';
import { getStorage, ref, getBlob, list } from 'firebase/firebase-storage.js';
import { initializeApp } from 'firebase/firebase-app.js';
import { createElement } from '@shgysk8zer0/kazoo/elements.js';

async function getImageBlobURI(storage, path) {
	const blob = await getBlob(ref(storage, path));
	return URL.createObjectURL(blob);
}

function clickHandler(event) {
	const target = event.currentTarget.tagName === 'IMG' ? event.currentTarget : event.target.parentElement.querySelector('img');
	const link = createElement('a', {
		href: target.src,
		download: target.dataset.name,
	});

	setTimeout(() => link.remove(), 300);
	document.body.append(link);
	link.click();
}

const params = new URLSearchParams(location.search);
const BUCKET = 'photo-booth-3347d.appspot.com';

if (params.has('photo')) {
	getJSON('/photo-booth.json').then(async (config) => {
		const storage = getStorage(initializeApp(config), BUCKET);

		document.getElementById('photo-booth-gallery').append(...await Array.fromAsync(
			params.getAll('photo'),
			async photoPath => {
				const blob = await getImageBlobURI(storage, photoPath);
				return createElement('div', {
					classList:  ['photo-booth-card'],
					children: [
						createElement('img', {
							src: blob,
							alt: 'photo-booth preview',
							classList: ['photo-booth-img'],
							dataset: { name: photoPath },
							events: { click: clickHandler },
						}),
						createElement('button',  {
							type: 'button',
							classList: ['btn', 'btn-primary', 'dl-btn'],
							text: 'Download',
							events: { click: clickHandler },
						})
					]
				});
			}
		));
	});
} else if (params.has('event')) {
	getJSON('/photo-booth.json').then(async (config) => {
		const storage = getStorage(initializeApp(config), BUCKET);
		const eventImgs = await list(ref(storage, `event/${params.get('event')}`));
		console.log(eventImgs);

		document.getElementById('photo-booth-gallery').append(...await Array.fromAsync(
			eventImgs.items,
			async ref => {
				const blob = URL.createObjectURL(await getBlob(ref));
				return createElement('div', {
					classList:  ['photo-booth-card', 'card'],
					children: [
						createElement('img', {
							src: blob,
							alt: 'photo-booth preview',
							classList: ['photo-booth-img'],
							dataset: { name: ref.fullPath },
							events: { click: clickHandler },
						}),
						document.createElement('br'),
						createElement('button',  {
							type: 'button',
							classList: ['btn', 'btn-primary', 'dl-btn'],
							text: 'Download',
							events: { click: clickHandler },
						})
					]
				});
			}
		));
	});
}
