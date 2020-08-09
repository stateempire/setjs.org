import setup from 'config/setup.js';
import eventTypes from 'config/event-types.js';

export var storageTypes = {
  gdpr: {name: 'gdpr', type: 'boolean', eventAfter: eventTypes.gdpr},
};

export default function() {
  storageTypes.token = {name: setup.tokenName()};
}
