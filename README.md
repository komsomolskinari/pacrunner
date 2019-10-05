# PACRunner

[![Build Status](https://travis-ci.org/komsomolskinari/pacrunner.svg?branch=master)](https://travis-ci.org/komsomolskinari/pacrunner)
[![Coverage Status](https://coveralls.io/repos/github/komsomolskinari/pacrunner/badge.svg?branch=master)](https://coveralls.io/github/komsomolskinari/pacrunner?branch=master)
[![npm version](https://badge.fury.io/js/pacrunner.svg)](https://badge.fury.io/js/pacrunner)

Run PAC file in specific context.

## Example
Assume a PAC "template" file `template.pac`, some variable is replaced to real value on server side. (So it can't directly run in JS engine):

```js
// template.pac
// _HOST and _PROXY will replaced with real value before send to client. 
function FindProxyForURL(url, host) {
	if (host == _HOST) return _PROXY;
	return 'DIRECT;';
}
``` 

```js
import { InitPACFromFile, RunPAC } from 'pacrunner';

InitPACFromFile('template.pac');
console.log(
	RunPAC('https://exhentai.org/img/kokomade.jpg', {
		_HOST: 'exhentai.org',
		_PROXY: 'SOCKS 127.0.0.1:1080;'
	})
);
// console: 'SOCKS 127.0.0.1:1080;'
```
