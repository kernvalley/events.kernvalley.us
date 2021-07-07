customElements.whenDefined('krv-events').then(async () => {
	const url = new URL(location.href);
	const KRVEvents = customElements.get('krv-events');
	const events = new KRVEvents();

	if (url.searchParams.has('c')) {
		events.count = parseInt(url.searchParams.get('c'));
	}

	if (url.searchParams.has('t')) {
		events.theme = url.searchParams.get('t');
	}

	document.body.append(events);
});
