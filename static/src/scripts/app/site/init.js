import {addPage, addPaths} from 'setbp/kernel/page-manager.js';

import './template-functions.js';
import './api.js';
import home from './pages/home.js';

export default function() {
  addPage('', home);
  addPaths('site', ['about']);
}
