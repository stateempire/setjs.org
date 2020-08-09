import setjs from '@stateempire/setjs';

export default {
  templates: ['site/home'],
  getComp: function() {
    return setjs.getComp('site/home');
  }
};
