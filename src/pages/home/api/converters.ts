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
    widthPx: getWordWidthPx({ wordDTO, audioDuration, timelineWidth }),
    leftPx: getWordLeftPositionPx({ wordDTO, audioDuration, timelineWidth }),
    phonemes: wordDTO.phonemes.map<Phoneme>((phonemeDTO, index) => {
      return {
        ...phonemeDTO,
        id: String(index),
        widthPercent: getPhonemeWidthPercent(phonemeDTO, wordDTO),
        leftPercent: getPhonemeLeftPercent(phonemeDTO, wordDTO),
      };
    }),
  };
}

export function convertWordToWordDTO(word: Word): WordDTO {
  return {
    word: word.word,
    start: word.start,
    end: word.end,
    phonemes: word.phonemes.map((phoneme, index) => {
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
    widthPx: getWordWidthPx({ wordDTO: word, audioDuration, timelineWidth: newTimelineWidth }),
    leftPx: getWordLeftPositionPx({ wordDTO: word, audioDuration, timelineWidth: newTimelineWidth }),
    phonemes: [...word.phonemes],
  };
}

function getWordWidthPx({
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

function getWordLeftPositionPx({
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

function getPhonemeWidthPercent(phonemeDTO: PhonemeDTO, parentWordDTO: WordDTO): number {
  return ((phonemeDTO.end - phonemeDTO.start) / (parentWordDTO.end - parentWordDTO.start)) * 100;
}

function getPhonemeLeftPercent(phonemeDTO: PhonemeDTO, parentWordDTO: WordDTO): number {
  return ((phonemeDTO.start - parentWordDTO.start) / (parentWordDTO.end - parentWordDTO.start)) * 100;
}
