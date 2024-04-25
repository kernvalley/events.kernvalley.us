customElements.whenDefined('krv-events').then(KRVEvents => {
	const params = new URLSearchParams(location.search);
	const events = new KRVEvents();

	if (params.has('target')) {
		events.target = params.get('target');
	} else {
		events.target = '_blank';
	}

	if (params.has('count')) {
		events.count = Math.max(1, parseInt(params.get('count')));
	}

	if (params.has('theme')) {
		events.theme = params.get('theme');
		document.documentElement.dataset.theme = params.get('theme');
	}
	
	if (params.has('source')) {
		events.source = params.get('source');
	}

	if (params.has('tags')) {
		events.tags = params.getAll('tags');
	}

	document.body.replaceChildren(events);
});
