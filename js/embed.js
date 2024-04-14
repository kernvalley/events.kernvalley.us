customElements.whenDefined('krv-events').then(KRVEvents => {
	const url = new URL(location.href);
	const events = new KRVEvents();

	if (url.searchParams.has('o')) {
		events.target = url.searchParams.get('o');
	} else {
		events.target = '_blank';
	}

	if (url.searchParams.has('c')) {
		events.count = parseInt(url.searchParams.get('c'));
	}

	if (url.searchParams.has('t')) {
		events.theme = url.searchParams.get('t');
		document.documentElement.dataset.theme = url.searchParams.get('t');
	}
	
	if (url.searchParams.has('s')) {
		events.source = url.searchParams.get('s');
	}

	document.body.replaceChildren(events);
});
