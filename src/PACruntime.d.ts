// Not used yet
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

export declare function dnsResolve(host?: string): string; // optional, for lazy
export declare function convert_addr(ipchars: string): number; //eslint-disable-line @typescript-eslint/camelcase
export declare function myIPAddress(): string;
export declare function dnsDomainLevels(host: string): number;
export declare function shExpMatch(url: string, pattern: string): string;

export declare function weekdayRange(): boolean;
export declare function dateRange(): boolean;
export declare function timeRange(): boolean;

export declare function alert(msg: string): void;
export declare function isValidIpAddress(ipchars: string): boolean;
