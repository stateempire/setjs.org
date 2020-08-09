import setjs from '@stateempire/setjs';
import {makeLazy} from 'setbp/utility/lazy-media.js';

setjs.addFuncs({
  lazyImg: makeLazy('src'),
  lazyBg: makeLazy('bg'),
});
