import { render } from '@testing-library/react';
import React from 'react';

import { Phoneme } from 'src/pages/home/model/types';
import Word from 'src/pages/home/ui/word/word';

describe('Word', () => {
  const basePhonemes: Phoneme[] = [
    {
      id: 'ph1',
      phoneme: 'a',
      leftPercent: 0,
      widthPercent: 50,
      start: 0,
      end: 1,
    },
    {
      id: 'ph2',
      phoneme: 'b',
      leftPercent: 50,
      widthPercent: 50,
      start: 1,
      end: 2,
    },
  ];
  const baseProps = {
    id: 'w1',
    word: 'test',
    widthPx: 100,
    leftPx: 10,
    movingInProgress: false,
    phonemes: basePhonemes,
    onWordResizeStart: jest.fn(),
    onWordChainResizeStart: jest.fn(),
    onPhonemeResizeStart: jest.fn(),
    onPhonemeChainResizeStart: jest.fn(),
    onWordMoveStart: jest.fn(),
    onPhonemeMoveStart: jest.fn(),
  };

  it('matches snapshot (default)', () => {
    const { asFragment } = render(<Word {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot (movingInProgress)', () => {
    const { asFragment } = render(<Word {...baseProps} movingInProgress />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot (hideLeftResizer)', () => {
    const { asFragment } = render(<Word {...baseProps} hideLeftResizer />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot (hideRightResizer)', () => {
    const { asFragment } = render(<Word {...baseProps} hideRightResizer />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot (hideChainResizer)', () => {
    const { asFragment } = render(<Word {...baseProps} hideChainResizer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
