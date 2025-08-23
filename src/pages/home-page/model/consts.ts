import { WordDTO } from 'src/pages/home-page/model/types';

export const DEFAULT_TIME_LINE_SCALE_COEFFICIENT = 400;
export const MIN_TIME_LINE_SCALE_COEFFICIENT = 100;
export const TIME_LINE_SCALE_COEFFICIENT_STEP = 100;
export const MAX_TIME_LINE_SCALE_COEFFICIENT = 5000;

export const WAVE_FORM_HEIGHT = 200;
export const WAVE_FORM_CLONE_HEIGHT = 0;
export const DEFAULT_WAVE_FORM_WIDTH = '100%';
export const DEFAULT_WAVE_FORM_COLOR = 'violet';
export const PLAY_DURING_DRAG_THROTTLE_TIME_SEC = 0.2;

export const TIME_SCALE_HEIGHT_PX = 50;
export const TIME_SCALE_TICK_COLOR = 'white';
export const TIME_SCALE_TEXT_COLOR = 'white';
export const TIME_SCALE_TEXT_FONT = '1rem Roboto, sans-serif';
export const TICK_STEP_THRESHOLD_SUB_SECOND = 500;
export const TICK_STEP_THRESHOLD_HALF_SECOND = 200;

export const WHOLE_SECOND__TICK_X_OFFSET = 15;
export const HALF_SECOND_TICK_X_OFFSET = 20;
export const SUB_SECOND_TICK_X_OFFSET = 20;

export const EXAMPLE_AUDIO_FILE_NAME = `audio_calibration.mp3`;
export const EXAMPLE_AUDIO_FILE_PATH = `${process.env.PUBLIC_URL}/example/${EXAMPLE_AUDIO_FILE_NAME}`;
export const EXAMPLE_WORDS_DATA_FILE_NAME = `phonemes_timing_calibration_ru.json`;
export const EXAMPLE_WORDS_DATA_FILE_PATH = `${process.env.PUBLIC_URL}/example/${EXAMPLE_WORDS_DATA_FILE_NAME}`;

export const WORDS_DATA_EXAMPLE: { words: WordDTO[] } = {
  words: [
    {
      word: 'Hello',
      start: 0.12,
      end: 0.48,
      phonemes: [
        { phoneme: 'HH', start: 0.12, end: 0.2 },
        { phoneme: 'AH', start: 0.2, end: 0.32 },
        { phoneme: 'L', start: 0.32, end: 0.4 },
        { phoneme: 'OW', start: 0.4, end: 0.48 },
      ],
    },
  ],
};

export const ABOUT_APP_DIALOG_SEEN_KEY = 'ltc-about-app-dialog-seen';
