import './seo.js';

import siteInit from './site/init.js';

export default function({success}) {
  siteInit();
  success();
}
