import { languageCodes } from 'src/shared/model/lang/lang.consts';

export type LanguageCode = (typeof languageCodes)[number];

const enLabels = {
  APP_NAME: 'Lipsync timing checker',
  LOAD_AUDIO: 'Load audio',
  LOAD_JSON_DATA: 'Load JSON data',
  LOAD_EXAMPLE: 'Load example',
  DOWNLOAD_JSON_DATA: 'Download JSON data',
  PLAY: 'Play',
  PAUSE: 'Pause',
  LOCK_CARET_POSITION: 'Lock caret position',
  UNLOCK_CARET_POSITION: 'Unlock caret position',
  ENABLE_AUDIO_WHILE_DRAGGING: 'Enable audio while dragging',
  DISABLE_AUDIO_WHILE_DRAGGING: 'Disable audio while dragging',
};

const enMessages = {};

const enErrors = {};

export type LanguageConstants = {
  labels: typeof enLabels;
  messages: typeof enMessages;
  errors: typeof enErrors;
};

export type LocalizationData = Record<LanguageCode, LanguageConstants>;

export const lang: LocalizationData = {
  en: {
    labels: enLabels,
    messages: enMessages,
    errors: enErrors,
  },
};
