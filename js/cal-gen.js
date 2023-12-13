export async function getKRVEventsCalendar({ signal } = {}) {
	return await Promise.all([
		import('@shgysk8zer0/kazoo/http.js'),
		import('@shgysk8zer0/kazoo/iCal.js'),
		import('@shgysk8zer0/kazoo/filesystem.js'),
	]).then(async ([{ getJSON }, { createICalFile }, { saveFile }]) => {
		const events = await getJSON('/events.json', { signal });
		const iCal = createICalFile(events, { filename: 'krv-events.ics' });
		await saveFile(iCal);
		return iCal;
	});
}
