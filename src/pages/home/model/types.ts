export type JSONItem = {
  id: string;
  selected: boolean;
  start: number;
  end: number;
};

export type JSONPhoneme = {
  phoneme: string;
} & JSONItem;

export type JSONWord = {
  word: string;
  phonemes: JSONPhoneme[];
} & JSONItem;

export type JSONData = {
  words: JSONWord[];
};

export type ResizerSide = 'left' | 'right';
