// Not used yet, only for information
export declare function isPlainHostName(host: string): boolean;
export declare function dnsDomainIs(host: string, domain: string): boolean;
export declare function localHostOrDomainIs(
	host: string,
	hostdom: string
): boolean;
export declare function isResolvable(host: string): boolean;
export declare function isInNet(
	ipaddr: string,
	pattern: string,
	maskstr: string
): boolean;

export declare function dnsResolve(host: string): string;
export declare function convert_addr(ipchars: string): number; //eslint-disable-line @typescript-eslint/camelcase
export declare function myIPAddress(): string;
export declare function dnsDomainLevels(host: string): number;
export declare function shExpMatch(url: string, pattern: string): string;

type Weekdays = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

type Days =
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8
	| 9
	| 10
	| 11
	| 12
	| 13
	| 14
	| 15
	| 16
	| 17
	| 18
	| 19
	| 20
	| 21
	| 22
	| 23
	| 24
	| 25
	| 26
	| 27
	| 28
	| 29
	| 30
	| 31;

type Months =
	| 'JAN'
	| 'FEB'
	| 'MAR'
	| 'APR'
	| 'MAY'
	| 'JUN'
	| 'JUL'
	| 'AUG'
	| 'SEP'
	| 'OCT'
	| 'NOV'
	| 'DEC';
// #region weekdayRange
export declare function weekdayRange(w1: Weekdays, gmt?: 'GMT'): boolean;
export declare function weekdayRange(
	w1: Weekdays,
	w2: Weekdays,
	gmt?: 'GMT'
): boolean;
// #endregion

// #region dateRange
export declare function dateRange(
	ymd: Days | Months | number,
	gmt?: 'GMT'
): boolean;
export declare function dateRange(
	yd1: Days | number,
	yd2: Days | number,
	gmt?: 'GMT'
): boolean;
export declare function dateRange(
	d1: Days,
	m1: Months,
	d2: Days,
	m2: Months,
	gmt?: 'GMT'
): boolean;
export declare function dateRange(
	m1: Months,
	y1: number,
	m2: Months,
	y2: number,
	gmt?: 'GMT'
): boolean;
export declare function dateRange(
	d1: Days,
	m1: Months,
	y1: number,
	d2: Days,
	m2: Months,
	y2: number,
	gmt?: 'GMT'
): boolean;
export declare function dateRange(m1: Months, m2: Months, gmt?: 'GMT'): boolean;
// #endregion

// #region timeRange
export declare function timeRange(
	h1: number,
	h2?: number,
	gmt?: 'GMT'
): boolean;
export declare function timeRange(
	h1: number,
	m1: number,
	h2: number,
	m2: number,
	gmt?: 'GMT'
): boolean;
export declare function timeRange(
	h1: number,
	m1: number,
	s1: number,
	h2: number,
	m2: number,
	s2: number,
	gmt?: 'GMT'
): boolean;
// #endregion

export declare function alert(msg: string): void;
export declare function isValidIpAddress(ipchars: string): boolean;
