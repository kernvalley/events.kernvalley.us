import '@shgysk8zer0/polyfills/all.min.js';
import '@shgysk8zer0/components/photo-booth.js';
import { createQRCode } from '@shgysk8zer0/kazoo/qr.js';
import { getJSON } from '@shgysk8zer0/kazoo/http.js';
import { initializeApp } from 'firebase/firebase-app.js';
import { getFirestore, getDoc, doc } from 'firebase/firebase-firestore.js';
import { getStorage, ref, uploadBytes } from 'firebase/firebase-storage.js';

const BUCKET = 'photo-booth-3347d.appspot.com';
const FIRESTORE = 'https://firebasestorage.googleapis.com/v0/b/';
const STORE = 'events';
const cache = new Map();
const params = new URLSearchParams(location.search);

if (! (Function.prototype.once instanceof Function)) {
	Function.prototype.once = function once() {
		return (...args) => {
			if (cache.has(this)) {
				return cache.get(this);
			} else {
				try {
					const result = this(...args);

					if (this.constructor.name === 'AsyncFunction') {
						return result.then(val => {
							cache.set(this, val);
							return val;
						});
					} else {
						cache.set(this, result);
						return result;
					}
				} catch(err) {
					console.error(err);
				}
			}
		};
	}
}

function getImageURL(path, file, config) {
	const url = new URL(`${FIRESTORE}${config.storageBucket}/o/${encodeURIComponent(path)}${encodeURIComponent(file.name)}`);
	url.searchParams.set('alt', 'media');
	return url;
}

const loadFirebase = (async function getFirebase() {
	const config = await getConfig();
	const app = initializeApp(config);
	return app;
}).once();

const loadFirestore = (async () => {
	const app = await loadFirebase();
	const db = getFirestore(app);
	return db;
}).once();

const loadStorage = (async function loadStorage() {
	return await getStorage(await loadFirebase(), BUCKET);
}).once();

async function getDocument(id) {
	const ref = doc(await loadFirestore(), STORE, id);
	const snap = await getDoc(ref);

	if (snap.exists()) {
		return snap.data();
	} else {
		throw new Error('Not found');
	}
}

async function uploadFile(file, { name } = {}) {
	if (!(file instanceof File)) {
		throw new TypeError('Not a file');
	} else {
		const storage = await loadStorage(BUCKET);
		const fileRef = typeof name === 'string' ? ref(storage, name) : ref(storage, file.name);

		return await uploadBytes(fileRef, file, {
			contentType: file.type,
		});
	}
}

const getConfig = (async ()  => getJSON('./config.json')).once();

const dateToPath = (date = new Date()) => [
	date.getFullYear().toString(),
	(date.getMonth() + 1).toString().padStart(2, '0'),
	date.getDate().toString().padStart(2, '0'),
].join('/') + '/';

async function captureHandler(event) {
	const controller = new AbortController();

	try {
		const config = await getConfig();
		const path = `${dateToPath(new Date())}${event.target.dataset.eventId}/`;
		const file = await event.target.toFile(`${crypto.randomUUID()}${event.target.ext}`);
		const dialog = document.createElement('dialog');
		const qrCode = createQRCode(getImageURL(path, file, config), { margin: 20 });
		dialog.append(qrCode);
		document.body.append(dialog);
		dialog.showModal();

		await qrCode.decode();
		const signal = AbortSignal.any([AbortSignal.timeout(5000), controller.signal]);

		dialog.addEventListener('close', ({ target }) => {
			target.remove();

			if (! signal.aborted) {
				controller.abort('User closed dialog.');
			}
		}, { signal });

		dialog.addEventListener('click', ({  target }) => target.close(), { signal });

		signal.addEventListener('abort', () => {
			if (dialog.open) {
				dialog.close();
			}
		}, { once: true });

		await uploadFile(file, { name: `${path}${file.name}` });


		// 4. Show Dialog
	} catch (error) {
		controller.abort(error);
		console.error(error);
		// Handle errors (e.g., show error message to the user)
	}
}

if (params.has('event')) {
	Promise.all([
		getDocument(params.get('event')),
		customElements.whenDefined('photo-booth'),
	]).then(async ([{ images, overlays, text, fonts, share }, HTMLPhotoBoothElement]) => {
		const photoBooth = await HTMLPhotoBoothElement.create({
			dataset: { eventId: params.get('event') }, share,
			images, overlays, text, fonts, delay: 3, shutter: true, quality: 0.85,
			resolution: HTMLPhotoBoothElement.UHD, type: HTMLPhotoBoothElement.WebP,
		});

		photoBooth.addEventListener('aftercapture', captureHandler);
		document.body.append(photoBooth);
	}).catch(err => {
		console.error(err);
		location.href = '/';
	});
}  else {
	location.href = '/';
}
