import setup from 'config/setup.js';

export default function(overrides) {
  return $.extend({
    apiKey: setup.cloudinaryKey(),
    cloudName: setup.cloudinaryCloud(),
    uploadPreset: setup.cloudinaryPreset(),
    folder: setup.cloudinaryFolder(),
    sources: [
      'local',
      'url',
      'camera',
      'google_drive',
      'dropbox'
    ],
    // cropping: true,
    // defaultSource: 'local',
    styles: {
      palette: {
        window: '#F9F9F9',
        sourceBg: '#FFFFFF',
        windowBorder: '#C7C7C7',
        tabIcon: '#0148E0',
        inactiveTabIcon: '#C7C7C7',
        menuIcons: '#0148E0',
        link: '#0148E0',
        action: '#8F5DA5',
        inProgress: '#0148E0',
        complete: '#4CAF50',
        error: '#E7224C',
        textDark: '#C7C7C7',
        textLight: '#FFFFFF'
      },
      fonts: {
        default: null, 'Poppins, sans-serif': {
          url: 'https://fonts.googleapis.com/css?family=Poppins',
          active: true
        }
      }
    }
  }, overrides);
}
