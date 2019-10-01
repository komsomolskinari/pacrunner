var context = ExternalVariable;

function FindProxyForURL(url, host) {
	return [context, url, host].join(' ');
}
