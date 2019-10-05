// Direct ported PAC runtime from Mozilla
// See: https://dxr.mozilla.org/mozilla-central/source/netwerk/base/ProxyAutoConfig.cpp#45

export function dnsDomainIs(host: string, domain: string): boolean {
	return (
		host.length >= domain.length &&
		host.substring(host.length - domain.length) == domain
	);
}
export function dnsDomainLevels(host: string): number {
	return host.split('.').length - 1;
}
export function isValidIpAddress(ipchars: string): boolean {
	const matches = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(
		ipchars
	);
	if (
		matches == null ||
		matches.slice(1).some((m: string) => parseInt(m) > 255)
	) {
		return false;
	}
	return true;
}

// eslint-disable-next-line @typescript-eslint/camelcase
export function convert_addr(ipchars: string): number {
	const bytes = ipchars.split('.').map((v: string) => parseInt(v));
	const result =
		((bytes[0] & 0xff) << 24) |
		((bytes[1] & 0xff) << 16) |
		((bytes[2] & 0xff) << 8) |
		(bytes[3] & 0xff);
	return result;
}

export function dnsResolve(addr: string): string | null {
	return addr[0] === '$' ? null : '173.245.48.1'; // One of Cloudflare IP
}

export function isInNet(
	ipaddr: string,
	pattern: string,
	maskstr: string
): boolean {
	if (!isValidIpAddress(pattern) || !isValidIpAddress(maskstr)) {
		return false;
	}
	if (!isValidIpAddress(ipaddr)) {
		const t = dnsResolve(ipaddr);
		if (t == null) {
			return false;
		} else {
			ipaddr = t;
		}
	}
	const host = convert_addr(ipaddr);
	const pat = convert_addr(pattern);
	const mask = convert_addr(maskstr);
	return (host & mask) == (pat & mask);
}
export function isPlainHostName(host: string): boolean {
	return host.search('\\.') == -1;
}
export function isResolvable(host: string): boolean {
	const ip = dnsResolve(host);
	return ip != null;
}
export function localHostOrDomainIs(host: string, hostdom: string): boolean {
	return host == hostdom || hostdom.lastIndexOf(host + '.', 0) == 0;
}
export function shExpMatch(url: string, pattern: string): boolean {
	pattern = pattern.replace(/\./g, '\\.');
	pattern = pattern.replace(/\*/g, '.*');
	pattern = pattern.replace(/\?/g, '.');
	const newRe = new RegExp('^' + pattern + '$');
	return newRe.test(url);
}
const wdays: {
	[week: string]: number;
} = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };
const months: {
	[month: string]: number;
} = {
	JAN: 0,
	FEB: 1,
	MAR: 2,
	APR: 3,
	MAY: 4,
	JUN: 5,
	JUL: 6,
	AUG: 7,
	SEP: 8,
	OCT: 9,
	NOV: 10,
	DEC: 11
};
export function weekdayRange(...args: (string | number)[]): boolean {
	function getDay(weekday: string): number {
		if (weekday in wdays) {
			return wdays[weekday];
		}
		return -1;
	}
	const date = new Date();
	let argc = args.length;
	let wday;
	if (argc < 1) return false;
	if (args[argc - 1] == 'GMT') {
		argc--;
		wday = date.getUTCDay();
	} else {
		wday = date.getDay();
	}
	const wd1 = getDay(args[0] + '');
	const wd2 = argc == 2 ? getDay(args[1] + '') : wd1;
	return wd1 == -1 || wd2 == -1
		? false
		: wd1 <= wd2
		? wd1 <= wday && wday <= wd2
		: wd2 >= wday || wday >= wd1;
}
export function dateRange(...args: (string | number)[]): boolean {
	function getMonth(name: string): number {
		if (name in months) {
			return months[name];
		}
		return -1;
	}
	let date = new Date();
	let argc = args.length;
	if (argc < 1) {
		return false;
	}
	const isGMT = args[argc - 1] == 'GMT';

	if (isGMT) {
		argc--;
	}
	// function will work even without explict handling of this case
	if (argc == 1) {
		const tmp = parseInt(args[0] + '');
		if (isNaN(tmp)) {
			return (
				(isGMT ? date.getUTCMonth() : date.getMonth()) ==
				getMonth(args[0] + '')
			);
		} else if (tmp < 32) {
			return (isGMT ? date.getUTCDate() : date.getDate()) == tmp;
		} else {
			return (isGMT ? date.getUTCFullYear() : date.getFullYear()) == tmp;
		}
	}
	const year = date.getFullYear();
	const date1 = new Date(year, 0, 1, 0, 0, 0);
	const date2 = new Date(year, 11, 31, 23, 59, 59);
	let adjustMonth = false;
	for (let i = 0; i < argc >> 1; i++) {
		const tmp = parseInt(args[i] + '');
		if (isNaN(tmp)) {
			const mon = getMonth(args[i] + '');
			date1.setMonth(mon);
		} else if (tmp < 32) {
			adjustMonth = argc <= 2;
			date1.setDate(tmp);
		} else {
			date1.setFullYear(tmp);
		}
	}
	for (let i = argc >> 1; i < argc; i++) {
		const tmp = parseInt(args[i] + '');
		if (isNaN(tmp)) {
			const mon = getMonth(args[i] + '');
			date2.setMonth(mon);
		} else if (tmp < 32) {
			date2.setDate(tmp);
		} else {
			date2.setFullYear(tmp);
		}
	}
	if (adjustMonth) {
		date1.setMonth(date.getMonth());
		date2.setMonth(date.getMonth());
	}
	if (isGMT) {
		const tmp = date;
		tmp.setFullYear(date.getUTCFullYear());
		tmp.setMonth(date.getUTCMonth());
		tmp.setDate(date.getUTCDate());
		tmp.setHours(date.getUTCHours());
		tmp.setMinutes(date.getUTCMinutes());
		tmp.setSeconds(date.getUTCSeconds());
		date = tmp;
	}
	return date1 <= date2
		? date1 <= date && date <= date2
		: date2 >= date || date >= date1;
}
export function timeRange(...args: (string | number)[]): boolean {
	let argc = args.length;
	const date = new Date();
	let isGMT = false;
	if (argc < 1) {
		return false;
	}
	if (args[argc - 1] == 'GMT') {
		isGMT = true;
		argc--;
	}

	const hour = isGMT ? date.getUTCHours() : date.getHours();
	const date1 = new Date();
	const date2 = new Date();

	if (argc == 1) {
		return hour == args[0];
	} else if (argc == 2) {
		return args[0] <= hour && hour <= args[1];
	} else {
		switch (argc) {
			case 6:
				date1.setSeconds(parseInt(args[2] + ''));
				date2.setSeconds(parseInt(args[5] + ''));
			case 4:
				const middle = argc >> 1;
				date1.setHours(parseInt(args[0] + ''));
				date1.setMinutes(parseInt(args[1] + ''));
				date2.setHours(parseInt(args[middle] + ''));
				date2.setMinutes(parseInt(args[middle + 1] + ''));
				if (middle == 2) {
					date2.setSeconds(59);
				}
				break;
			default:
				throw 'timeRange: bad number of arguments';
		}
	}

	if (isGMT) {
		date.setFullYear(date.getUTCFullYear());
		date.setMonth(date.getUTCMonth());
		date.setDate(date.getUTCDate());
		date.setHours(date.getUTCHours());
		date.setMinutes(date.getUTCMinutes());
		date.setSeconds(date.getUTCSeconds());
	}
	return date1 <= date2
		? date1 <= date && date <= date2
		: date2 >= date || date >= date1;
}

export function myIPAddress(): string {
	return '127.0.0.1';
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function alert(s: any): void {
	console.log(s);
}
