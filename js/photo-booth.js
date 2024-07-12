import '@shgysk8zer0/polyfills/all.min.js';
import '@shgysk8zer0/components/photo-booth.js';
import { createQRCode } from '@shgysk8zer0/kazoo/qr.js';
import { getJSON } from '@shgysk8zer0/kazoo/http.js';
import { initializeApp } from 'firebase/firebase-app.js';
import { getFirestore, getDoc, doc } from 'firebase/firebase-firestore.js';
import { getStorage, ref, uploadBytes } from 'firebase/firebase-storage.js';

const BUCKET = 'photo-booth-3347d.appspot.com';
const STORE = 'events';
const params = new URLSearchParams(location.search);

async function blobToFile(blob, filename) {
	return new File([await  blob.arrayBuffer()], filename, { type: blob.type });
}

if (! (Function.prototype.once instanceof Function)) {
	const cache = new Map();

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
	};
}

function getImageURL(path, file) {
	const url = new URL('./download/', `${location.origin}/${location.pathname}`);
	url.searchParams.set('photo', `${path}${file.name}`);
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
	if (file instanceof File) {
		const storage = await loadStorage(BUCKET);
		const fileRef = typeof name === 'string' ? ref(storage, name) : ref(storage, file.name);

		return await uploadBytes(fileRef, file, { contentType: file.type });
	} else if (! (file instanceof Blob)) {
		throw new TypeError('Not a file or blob.');
	} else if (typeof name !== 'string' || name.length === 0) {
		throw new TypeError('Name is required for Blobs.');
	} else {
		const storage = await loadStorage(BUCKET);
		const fileRef = ref(storage, name);

		return await uploadBytes(fileRef, file, { contentType: file.type });
	}
}

const getConfig = (async ()  => getJSON('/photo-booth.json')).once();

async function captureHandler(event) {
	const controller = new AbortController();

	try {
		const path = `event/${event.target.dataset.eventId}/`;
		const file = await blobToFile(event.blob, `${crypto.randomUUID()}${event.target.ext}`);

		// Only show QR Code when not saving to device.
		if (! params.has('capture')) {
			const dialog = document.createElement('dialog');
			const qrCode = createQRCode(getImageURL(path, file), { margin: 20 });
			dialog.append(qrCode);
			document.body.append(dialog);
			dialog.showModal();

			await qrCode.decode();
			const signal = AbortSignal.any([AbortSignal.timeout(10000), controller.signal]);

			dialog.addEventListener('close', ({ target }) => {
				target.remove();

				if (! signal.aborted) {
					controller.abort('User closed dialog.');
				}
			}, { once: true });

			dialog.addEventListener('click', ({ target }) => target.close(), { signal });

			signal.addEventListener('abort', () => {
				if (dialog.open) {
					dialog.close();
				}
			}, { once: true });
		}

		await uploadFile(file, { name: `${path}${file.name}` });
	} catch (error) {
		controller.abort(error);
		console.error(error);
	}
}

if (params.has('event')) {
	Promise.all([
		// getJSON('/event.json'),
		getDocument(params.get('event')),
		customElements.whenDefined('photo-booth'),
	]).then(async ([{ images, overlays, text, fonts, share }, HTMLPhotoBoothElement]) => {
		const mq = matchMedia('(orientation: portrait)');
		const photoBooth = await HTMLPhotoBoothElement.create({
			dataset: { eventId: params.get('event') }, share, saveOnCapture: params.has('capture'),
			images, overlays, text, fonts, delay: 3, shutter: true, quality: 0.90,
			resolution: HTMLPhotoBoothElement.UHD, type: HTMLPhotoBoothElement.JPEG,
		});

		photoBooth.hidden = ! mq.matches;
		mq.addEventListener('change', ({ target }) => photoBooth.hidden = ! mq.matches);

		photoBooth.addEventListener('aftercapture', captureHandler);
		photoBooth.append(document.getElementById('placeholder-template').content);
		document.body.append(photoBooth);
	}).catch(err => {
		console.error(err);
		document.forms.eventQuery.hidden = false;
	});
}  else {
	document.forms.eventQuery.hidden = false;
}
