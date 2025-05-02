import { Phoneme, PhonemeDTO, Word, WordDTO } from 'src/pages/home/model/types';

export function convertWordDTOToWord({
  wordDTO,
  wordId,
  audioDuration,
  timelineWidth,
}: {
  wordDTO: WordDTO;
  wordId: string;
  audioDuration: number;
  timelineWidth: number;
}): Word {
  const getWordWidthPx = (wordDTO: WordDTO): number => {
    return ((wordDTO.end - wordDTO.start) / audioDuration) * timelineWidth;
  };

  const getWordLeftPositionPx = (wordDTO: WordDTO): number => {
    return (wordDTO.start / audioDuration) * timelineWidth;
  };

  const getPhonemeWidthPercent = (phonemeDTO: PhonemeDTO, parentWordDTO: WordDTO): number => {
    return ((phonemeDTO.end - phonemeDTO.start) / (parentWordDTO.end - parentWordDTO.start)) * 100;
  };
  return {
    ...wordDTO,
    id: wordId,
    selected: false,
    widthPx: getWordWidthPx(wordDTO),
    leftPx: getWordLeftPositionPx(wordDTO),
    phonemes: wordDTO.phonemes.map<Phoneme>((phonemeDTO, index) => {
      return {
        ...phonemeDTO,
        id: String(index),
        widthPercent: getPhonemeWidthPercent(phonemeDTO, wordDTO),
      };
    }),
  };
}

export function convertWordToWordDTO({
  word,
  audioDuration,
  timelineWidth,
}: {
  word: Word;
  audioDuration: number;
  timelineWidth: number;
}): WordDTO {
  let phonemeStartShift = 0;

  const getPhonemeStart = (parentWord: Word): number => {
    return phonemeStartShift + parentWord.start;
  };

  const getPhonemeEnd = (phoneme: Phoneme, parentWord: Word): number => {
    const wordNewWidth = parentWord.end - parentWord.start;
    const phonemeWidth = (phoneme.widthPercent * wordNewWidth) / 100;
    return getPhonemeStart(parentWord) + phonemeWidth;
  };

  return {
    word: word.word,
    start: word.start,
    end: word.end,
    phonemes: word.phonemes.map((phoneme, index) => {
      // TODO toFixed(2) for start and end
      const start = getPhonemeStart(word);
      const end = getPhonemeEnd(phoneme, word);
      phonemeStartShift += end - start;
      return { phoneme: phoneme.phoneme, start, end };
    }),
  };
}

export function recalculateWordWithByNewTimelineWidth({
  word,
  prevTimelineWidth,
  newTimelineWidth,
}: {
  word: Word;
  prevTimelineWidth: number;
  newTimelineWidth: number;
}): Word {
  const getWordWidthPx = (word: Word): number => {
    return (word.widthPx / prevTimelineWidth) * newTimelineWidth;
  };

  const getWordLeftPositionPx = (word: Word): number => {
    return (word.leftPx / prevTimelineWidth) * newTimelineWidth;
  };
  return {
    ...word,
    widthPx: getWordWidthPx(word),
    leftPx: getWordLeftPositionPx(word),
  };
}
