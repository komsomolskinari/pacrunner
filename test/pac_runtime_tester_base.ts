export function PACTestSuite(
	name: string | number | Function | jest.FunctionLike,
	r: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	}
): void {
	describe(name, () => {
		test('emulated native functions', () => {
			expect(r.isValidIpAddress(r.dnsResolve('www.example.com'))).toBe(
				true
			);
			expect(r.dnsResolve('$willreturnnull')).toBe(null);

			expect(r.isResolvable('yes.example.com')).toBe(true);
			expect(r.isResolvable('$no.example.com')).toBe(false);
			expect(r.isValidIpAddress(r.myIPAddress())).toBe(true);
			const t = console.log;
			console.log = jest.fn();
			r.alert(1234567890);
			expect(console.log).toHaveBeenCalledWith(1234567890);
			console.log = t;
		});

		test('isPlainHostName', () => {
			expect(r.isPlainHostName('www.example.com')).toBe(false);
			expect(r.isPlainHostName('example')).toBe(true);
			expect(r.isPlainHostName('com.')).toBe(false);
		});

		test('dnsDomainIs', () => {
			expect(r.dnsDomainIs('www.mozilla.org', 'mozilla.org')).toBe(true);
			expect(r.dnsDomainIs('www', '.mozilla.org')).toBe(false);
		});
		test('localHostOrDomainIs', () => {
			expect(
				r.localHostOrDomainIs('www.mozilla.org', 'www.mozilla.org')
			).toBe(true);
			expect(r.localHostOrDomainIs('www', 'www.mozilla.org')).toBe(true);
			expect(
				r.localHostOrDomainIs('www.google.com', 'www.mozilla.org')
			).toBe(false);
			expect(
				r.localHostOrDomainIs('home.mozilla.org', 'www.mozilla.org')
			).toBe(false);
		});
		test('isInNet', () => {
			expect(
				r.isInNet('www.mozilla.org', '173.245.1.1', '255.255.0.0')
			).toBe(true);
			expect(r.isInNet('1.2.3.4', '1.2.3.200', '255.255.255.127')).toBe(
				false
			);
			expect(
				r.isInNet('$www.mozilla.org', '173.245.1.1', '255.255.0.0')
			).toBe(false);
			expect(
				r.isInNet('www.mozilla.org', '999.245.1.1', '255.255.0.0')
			).toBe(false);
		});

		test('convert_addr', () => {
			expect(r.convert_addr('104.16.41.2')).toBe(1745889538);
		});

		test('dnsDomainLevels', () => {
			expect(r.dnsDomainLevels('www')).toBe(0);
			expect(r.dnsDomainLevels('mozilla.org')).toBe(1);
			expect(r.dnsDomainLevels('www.mozilla.org')).toBe(2);
		});
		test('shExpMatch', () => {
			expect(
				r.shExpMatch(
					'http://home.netscape.com/people/ari/index.html',
					'*/ari/*'
				)
			).toBe(true);
			expect(
				r.shExpMatch(
					'http://home.netscape.com/people/montulli/index.html',
					'*/ari/*'
				)
			).toBe(false);
		});
		test('isValidIpAddress', () => {
			expect(r.isValidIpAddress('1.1.1.1')).toBe(true);
			expect(r.isValidIpAddress('a')).toBe(false);
			expect(r.isValidIpAddress('999.1.1.1')).toBe(false);
		});

		/*test('date times', () => {
			const t1926 = '1926-08-17T01:55:00.500+08:00';
			const t1989 = '1989-06-04T01:55:00.500+08:00';

			let tptr = t1989;
			const realDate = Date;
			const fakeDate = jest.fn((...params) => {
				switch (params.length) {
					case 1:
						return new realDate(params[0]);
					case 2:
						return new realDate(params[0], params[1]);
					case 3:
						return new realDate(params[0], params[1], params[2]);
					case 4:
						return new realDate(
							params[0],
							params[1],
							params[2],
							params[3]
						);
					case 5:
						return new realDate(
							params[0],
							params[1],
							params[2],
							params[3],
							params[4]
						);
					case 6:
						return new realDate(
							params[0],
							params[1],
							params[2],
							params[3],
							params[4],
							params[5]
						);
					case 7:
						return new realDate(
							params[0],
							params[1],
							params[2],
							params[3],
							params[4],
							params[5],
							params[6]
						);
					default:
						return new realDate(tptr);
				}
			});
			Date = (fakeDate as unknown) as DateConstructor;
			expect(new Date().getDay()).toBe(0);
			expect(r.weekdayRange('SUN')).toBe(true);
			expect(r.weekdayRange('SAT', 'SAT', 'GMT')).toBe(true);
			expect(r.weekdayRange('TUE', 'MON', 'GMT')).toBe(true);

			expect(r.dateRange(4)).toBe(true);
			expect(r.dateRange('JUN')).toBe(true);
			expect(r.dateRange(1989)).toBe(true);
			expect(r.dateRange(3, 'GMT')).toBe(true);
			expect(r.dateRange('JUN', 'GMT')).toBe(true);
			expect(r.dateRange(1989, 'GMT')).toBe(true);

			expect(r.dateRange('JUL', 'JAN')).toBe(false);
			expect(r.dateRange(27, 26)).toBe(true);

			expect(r.dateRange(25, 26)).toBe(false);
			expect(r.dateRange('JUL', 'AUG')).toBe(false);
			expect(r.dateRange(1999, 9999)).toBe(false);

			expect(r.dateRange(25, 26, 'GMT')).toBe(false);
			expect(r.dateRange('JUL', 'AUG', 'GMT')).toBe(false);
			expect(r.dateRange(1999, 9999, 'GMT')).toBe(false);
			expect(r.dateRange(1, 'JAN', 1900, 31, 'DEC', 1999)).toBe(true);
			expect(r.dateRange(31, 'DEC', 1989, 1, 'JAN', 1989)).toBe(false);

			// WTF?
			expect(r.timeRange(17, 'GMT')).toBe(true);
			expect(r.timeRange(2)).toBe(true);
			expect(r.timeRange(14, 54, 'GMT')).toBe(true);
			expect(r.timeRange(0, 0, 19, 0)).toBe(true);
			expect(r.timeRange(23, 0, 0, 0)).toBe(false);
			expect(r.timeRange(3)).toBe(false);
			expect(r.timeRange(16, 0, 15, 17, 0, 19)).toBe(false);
			expect(r.timeRange(18, 0, 15, 17, 0, 19, 'GMT')).toBe(true);
			expect(r.timeRange(18, 0, 17, 0)).toBe(true);

			expect(r.weekdayRange('FAIL')).toBe(false);
			expect(r.weekdayRange()).toBe(false);
			expect(r.dateRange()).toBe(false);
			expect(r.dateRange('FAIL')).toBe(false);
			expect(r.timeRange()).toBe(false);
			expect(() => r.timeRange(1, 2, 3, 4, 5)).toThrowError(/arguments/);
			tptr = t1926;
		});*/
	});
}
