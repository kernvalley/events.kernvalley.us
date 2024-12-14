import { createQRCode } from '@shgysk8zer0/kazoo/qr.js';
import { getJSON } from '@shgysk8zer0/kazoo/http.js';
import { getSUID, BASE64_URL } from '@shgysk8zer0/suid';
import { initializeApp } from 'firebase/app';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import '@shgysk8zer0/components/photo-booth.js';

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

async function captureHandler({ target: { ext, dataset: { eventId }}, blob }) {
	const controller = new AbortController();

	try {
		const path = `event/${eventId}/`;
		const file = await blobToFile(blob, `${getSUID({ alphabet: BASE64_URL })}${ext}`);

		// Only show QR Code when not saving to device.
		if (! params.has('capture')) {
			const dialog = document.createElement('dialog');
			const qrCode = createQRCode(getImageURL(path, file), { margin: 20 });
			dialog.append(qrCode);
			document.body.append(dialog);
			dialog.showModal();

			await qrCode.decode();
			const signal = AbortSignal.any([AbortSignal.timeout(30000), controller.signal]);

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
		getDocument(params.get('event')),
		customElements.whenDefined('photo-booth'),
	]).then(async ([{ images, overlays, text, fonts, share }, HTMLPhotoBoothElement]) => {
		const {
			saveOnCapture = params.has('capture'),
			hideItems = false,
			shutter = true,
			delay = 3,
			quality = 0.90,
			resolution = HTMLPhotoBoothElement.UHD,
			type = HTMLPhotoBoothElement.JPEG,
			facingMode = 'environment',
			mirror = false,
		} = history.state ?? {};

		const photoBooth = await HTMLPhotoBoothElement.create({
			dataset: { eventId: params.get('event') }, share, saveOnCapture,
			images, overlays, text, fonts, delay, shutter, quality,
			resolution, type, facingMode, mirror, hideItems,
		});

		photoBooth.addEventListener('aftercapture', captureHandler);
		photoBooth.append(document.getElementById('placeholder-template').content);
		document.body.append(photoBooth);

		const observer = new MutationObserver(records => {
			const state = history.state ?? {};

			records.forEach(({ attributeName, target }) => {
				switch(attributeName) {
					case 'saveoncapture':
						state.saveOnCapture = target.hasAttribute(attributeName);
						break;

					case 'hideitems':
						state.hideItems = target.hasAttribute(attributeName);
						break;

					case 'facingmode':
						state.facingMode = target.getAttribute(attributeName);
						break;

					case 'delay':
						state.delay = parseInt(target.getAttribute(attributeName));
						break;

					case 'quality':
						state.quality = parseFloat(target.getAttribute(attributeName));
						break;

					case 'mirror':
					case 'shutter':
						state[attributeName] = target.hasAttribute(attributeName);
						break;

					case 'resolution':
					case 'type':
						state[attributeName] = target.getAttribute(attributeName);
						break;
				}
			});

			history.replaceState(state, '', location.href);
		});
		observer.observe(photoBooth, {
			attributeFilter: ['saveoncapture', 'shutter', 'delay', 'quality', 'resolution', 'type', 'facingmore', 'mirror', 'hideitems'],
			attributes: true,
		});
	}).catch(err => {
		console.error(err);
		document.forms.eventQuery.hidden = false;
	});
}  else {
	document.forms.eventQuery.hidden = false;
}
