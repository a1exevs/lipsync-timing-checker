export type AudioTrackTextItemDTO = {
  start: number;
  end: number;
};

export type PhonemeDTO = {
  phoneme: string;
} & AudioTrackTextItemDTO;

export type WordDTO = {
  word: string;
  phonemes: PhonemeDTO[];
} & AudioTrackTextItemDTO;

export type AudioTrackTextDataDTO = {
  words: WordDTO[];
};

export type ResizerSide = 'left' | 'right';

export type AudioTrackWordItemMetaData = {
  id: string;
  selected: boolean;
  widthPx: number;
  leftPx: number;
};

export type AudioTrackPhonemeItemMetaData = {
  id: string;
  widthPercent: number;
};

export type Phoneme = {
  start: number;
  end: number;
  phoneme: string;
} & AudioTrackPhonemeItemMetaData;

export type Word = {
  word: string;
  phonemes: Phoneme[];
  start: number;
  end: number;
} & AudioTrackWordItemMetaData;
