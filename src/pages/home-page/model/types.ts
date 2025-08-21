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

export type AudioTrackWordItemMetaData = {
  id: string;
  widthPx: number;
  leftPx: number;
  movingInProgress?: boolean;
};

export type AudioTrackPhonemeItemMetaData = {
  id: string;
  widthPercent: number;
  leftPercent: number;
  movingInProgress?: boolean;
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
