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
  return {
    ...wordDTO,
    id: wordId,
    selected: false,
    widthPx: calculateWordWidthPx({ wordDTO, audioDuration, timelineWidth }),
    leftPx: calculateWordLeftPositionPx({ wordDTO, audioDuration, timelineWidth }),
    phonemes: wordDTO.phonemes.map<Phoneme>((phonemeDTO, index) => {
      return {
        ...phonemeDTO,
        id: String(index),
        widthPercent: calculatePhonemeWidthPercent(phonemeDTO, wordDTO),
        leftPercent: calculatePhonemeLeftPercent(phonemeDTO, wordDTO),
      };
    }),
  };
}

export function convertWordToWordDTO(word: Word): WordDTO {
  return {
    word: word.word,
    start: word.start,
    end: word.end,
    phonemes: word.phonemes.map((phoneme, _index) => {
      // TODO toFixed(2) for start and end
      return { phoneme: phoneme.phoneme, start: phoneme.start, end: phoneme.end };
    }),
  };
}

export function recalculateWordWithByNewTimelineWidth({
  word,
  audioDuration,
  newTimelineWidth,
}: {
  word: Word;
  audioDuration: number;
  newTimelineWidth: number;
}): Word {
  return {
    ...word,
    widthPx: calculateWordWidthPx({ wordDTO: word, audioDuration, timelineWidth: newTimelineWidth }),
    leftPx: calculateWordLeftPositionPx({ wordDTO: word, audioDuration, timelineWidth: newTimelineWidth }),
    phonemes: [...word.phonemes],
  };
}

export function calculateWordWidthPx({
  wordDTO,
  audioDuration,
  timelineWidth,
}: {
  wordDTO: WordDTO;
  audioDuration: number;
  timelineWidth: number;
}): number {
  return ((wordDTO.end - wordDTO.start) / audioDuration) * timelineWidth;
}

export function calculateWordLeftPositionPx({
  wordDTO,
  audioDuration,
  timelineWidth,
}: {
  wordDTO: WordDTO;
  audioDuration: number;
  timelineWidth: number;
}): number {
  return (wordDTO.start / audioDuration) * timelineWidth;
}

export function calculatePhonemeWidthPercent(phonemeDTO: PhonemeDTO, parentWordDTO: WordDTO): number {
  return ((phonemeDTO.end - phonemeDTO.start) / (parentWordDTO.end - parentWordDTO.start)) * 100;
}

export function calculatePhonemeLeftPercent(phonemeDTO: PhonemeDTO, parentWordDTO: WordDTO): number {
  return ((phonemeDTO.start - parentWordDTO.start) / (parentWordDTO.end - parentWordDTO.start)) * 100;
}

export function recalculatePhonemesStartEnd(word: Word): Phoneme[] {
  return word.phonemes.map(phoneme => {
    const start = word.start + (phoneme.leftPercent / 100) * (word.end - word.start);
    const end = start + (phoneme.widthPercent / 100) * (word.end - word.start);
    return { ...phoneme, start, end };
  });
}
