import {api} from 'core/api-helper.js';

var baseConfig = {
  key: '',
  toolbarButtons: [],
  pluginsEnabled: [],
  placeholderText: 'Start typing your article ...',
};

var fullConfig = $.extend({}, baseConfig, {
  toolbarInline: true,
  heightMin: 600,
  pluginsEnabled: ['image', 'link', 'video', 'lists', 'quickInsert', 'inlineStyle', 'quote'],
  toolbarButtons: ['bold', 'italic', 'superscript', 'inlineStyle', 'insertLink', 'quote', '|', 'align', 'formatOL', 'formatUL'],
  colorsHEXInput: false,
  colorsText: ['#0c3d5d', '#4280ff', '#cfe0ff', '#ff9400', '#69a200', '#ff3b24', '#2f3337', '#000000', 'REMOVE'],
  colorsBackground: ['#0c3d5d', '#4280ff', '#cfe0ff', '#ff9400', '#69a200', '#ff3b24', '#2f3337', '#000000', 'REMOVE'],
  inlineStyles: {
    'H2 title': 'font-family: Roboto, Helvetica, Arial, sans-serifs; color: #2f3337; font-size: 2.375rem; font-weight: 500; letter-spacing: 0; padding: 0; margin: 0; margin-bottom: 1.40625rem;',
    'H3 title': 'font-family: Roboto, Helvetica, Arial, sans-serifs; color: #2f3337; font-size: 1.75rem; font-weight: 500; letter-spacing: 0; padding: 0; margin: 0; margin-bottom: 1.40625rem;',
    'H4 title': 'font-family: Roboto, Helvetica, Arial, sans-serifs; color: #2f3337; font-size: 1.375rem; font-weight: 400; letter-spacing: 0; padding: 0; margin: 0; margin-bottom: 1.40625rem;',
    'Paragraph': 'font-size: inherit;'
  },
  videoAllowedProviders: ['youtube', 'vimeo'],
  videoUpload: false,
  linkAlwaysBlank: true,
  linkInsertButtons: ['linkBack'],
  listAdvancedTypes: false,
  imageUploadURL: false,
  imageEditButtons: ['imageAlign', 'imageDisplay', 'imageCaption', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', 'imageReplace', 'imageRemove']
});

var shortConfig = $.extend({}, baseConfig, {
  heightMin: 100,
  toolbarButtons: ['bold', 'italic'],
  toolbarInline: true,
  pastePlain: true,
  // htmlAllowedTags: ['strong'],
  pluginsEnabled: ['charCounter'],
  charCounterMax: 2500,
});

export default {
  prepareS3: function({id, success, error}) {
    api.getUploadPresigned({
      id,
      error,
      success: function (response) {
        delete response.data.params.key;
        success(response.data);
      },
    });
  },
  getFullConfig: function(overrides) {
    return $.extend(true, {}, fullConfig, overrides);
  },
  getShortConfig: function(overrides) {
    return $.extend(true, {}, shortConfig, overrides);
  },
  getEmptyConfig: function() {
    return baseConfig;
  },
};
