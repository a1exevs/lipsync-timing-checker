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
  const getWordStart = (word: Word): number => {
    return (word.leftPx / timelineWidth) * audioDuration;
  };

  const getWordEnd = (word: Word): number => {
    return getWordStart(word) + (word.widthPx / timelineWidth) * audioDuration;
  };

  let phonemeStartShift = 0;

  const getPhonemeStart = (phoneme: Phoneme, parentWord: Word): number => {
    const wordNewStart = getWordStart(parentWord);
    return phonemeStartShift + wordNewStart;
  };

  const getPhonemeEnd = (phoneme: Phoneme, parentWord: Word): number => {
    const wordNewStart = getWordStart(parentWord);
    const wordNewWidth = getWordEnd(parentWord) - wordNewStart;
    const phonemeWidth = (phoneme.widthPercent * wordNewWidth) / 100;
    return getPhonemeStart(phoneme, parentWord) + phonemeWidth;
  };

  return {
    word: word.word,
    start: getWordStart(word),
    end: getWordEnd(word),
    phonemes: word.phonemes.map((phoneme, index) => {
      const start = getPhonemeStart(phoneme, word);
      const end = getPhonemeEnd(phoneme, word);
      phonemeStartShift += end - start;
      return { phoneme: phoneme.phoneme, start, end };
    }),
  };
}
