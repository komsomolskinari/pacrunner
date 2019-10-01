import { PACTestSuite } from './pac_runtime_tester_base';

import * as ffts from '../src/3rd/mozillaTSruntime';
const ff = require('../src/3rd/mozillaruntime'); // eslint-disable-line @typescript-eslint/no-var-requires
PACTestSuite('Mozilla firefox PAC runtime TS test', ffts);
PACTestSuite('Mozilla firefox PAC runtime test', ff);
