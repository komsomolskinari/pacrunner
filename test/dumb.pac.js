function FindProxyForURL(url, host) {
	if (typeof url !== 'string' || typeof host !== 'string')
		throw new TypeError();
	return url + ' ' + host;
}
