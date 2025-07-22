import {
  calculatePhonemeLeftPercent,
  calculatePhonemeWidthPercent,
  calculateWordLeftPositionPx,
  calculateWordWidthPx,
  convertWordDTOToWord,
  convertWordToWordDTO,
  recalculatePhonemesStartEnd,
  recalculateWordWithByNewTimelineWidth,
} from 'src/pages/home/model/converters';
import { Phoneme, PhonemeDTO, Word, WordDTO } from 'src/pages/home/model/types';

const wordId = 'w1';
const wordText = 'test';
const phonemeA = 'a';
const phonemeB = 'b';
const audioDuration = 2;
const timelineWidth = 200;
const newTimelineWidth = 400;

const samplePhonemeDTOs: PhonemeDTO[] = [
  { phoneme: phonemeA, start: 0, end: 0.5 },
  { phoneme: phonemeB, start: 0.5, end: 1 },
];
const sampleWordDTO: WordDTO = {
  word: wordText,
  start: 0,
  end: 1,
  phonemes: samplePhonemeDTOs,
};

const samplePhonemes: Phoneme[] = [
  { id: '0', phoneme: phonemeA, start: 0, end: 0.5, widthPercent: 50, leftPercent: 0 },
  { id: '1', phoneme: phonemeB, start: 0.5, end: 1, widthPercent: 50, leftPercent: 50 },
];
const sampleWord: Word = {
  id: wordId,
  word: wordText,
  start: 0,
  end: 1,
  phonemes: samplePhonemes,
  widthPx: 100,
  leftPx: 0,
};

describe('converters', () => {
  describe('convertWordDTOToWord', () => {
    it('should convert WordDTO to Word with correct fields', () => {
      const word = convertWordDTOToWord({ wordDTO: sampleWordDTO, wordId, audioDuration, timelineWidth });
      expect(word.id).toBe(wordId);
      expect(word.word).toBe(wordText);
      expect(word.widthPx).toBeCloseTo(100);
      expect(word.leftPx).toBeCloseTo(0);
      expect(word.phonemes.length).toBe(2);
      expect(word.phonemes[0].phoneme).toBe(phonemeA);
      expect(word.phonemes[1].phoneme).toBe(phonemeB);
      expect(word.phonemes[0].widthPercent).toBeCloseTo(50);
      expect(word.phonemes[1].leftPercent).toBeCloseTo(50);
    });
  });

  describe('convertWordToWordDTO', () => {
    it('should convert Word to WordDTO', () => {
      const dto = convertWordToWordDTO(sampleWord);
      expect(dto.word).toBe(wordText);
      expect(dto.start).toBe(0);
      expect(dto.end).toBe(1);
      expect(dto.phonemes.length).toBe(2);
      expect(dto.phonemes[0].phoneme).toBe(phonemeA);
      expect(dto.phonemes[1].phoneme).toBe(phonemeB);
    });
  });

  describe('recalculateWordWithByNewTimelineWidth', () => {
    it('should recalculate widthPx and leftPx for new timeline width', () => {
      const newWord = recalculateWordWithByNewTimelineWidth({ word: sampleWord, audioDuration, newTimelineWidth });
      expect(newWord.widthPx).toBeCloseTo(200);
      expect(newWord.leftPx).toBeCloseTo(0);
    });
  });

  describe('calculateWordWidthPx', () => {
    it('should calculate word width in px', () => {
      const width = calculateWordWidthPx({ wordDTO: sampleWordDTO, audioDuration, timelineWidth });
      expect(width).toBeCloseTo(100);
    });
  });

  describe('calculateWordLeftPositionPx', () => {
    it('should calculate word left position in px', () => {
      const left = calculateWordLeftPositionPx({ wordDTO: sampleWordDTO, audioDuration, timelineWidth });
      expect(left).toBeCloseTo(0);
    });
  });

  describe('calculatePhonemeWidthPercent', () => {
    it('should calculate phoneme width percent', () => {
      const percent = calculatePhonemeWidthPercent(samplePhonemeDTOs[0], sampleWordDTO);
      expect(percent).toBeCloseTo(50);
    });
  });

  describe('calculatePhonemeLeftPercent', () => {
    it('should calculate phoneme left percent', () => {
      const percent = calculatePhonemeLeftPercent(samplePhonemeDTOs[1], sampleWordDTO);
      expect(percent).toBeCloseTo(50);
    });
  });

  describe('recalculatePhonemesStartEnd', () => {
    it('should recalculate phoneme start and end based on percent', () => {
      const recalc = recalculatePhonemesStartEnd(sampleWord);
      expect(recalc[0].start).toBeCloseTo(0);
      expect(recalc[0].end).toBeCloseTo(0.5);
      expect(recalc[1].start).toBeCloseTo(0.5);
      expect(recalc[1].end).toBeCloseTo(1);
    });
  });
});
