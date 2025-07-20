import { isNull } from '@alexevs/ts-guards';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { Phoneme } from 'src/pages/home/model/types';
import Word from 'src/pages/home/ui/word/word';
import {
  WORD_CHAIN_RESIZER_TEST_ID,
  WORD_LEFT_RESIZER_TEST_ID,
  WORD_RIGHT_RESIZER_TEST_ID,
} from 'src/pages/home/ui/word/word.consts';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders word text', () => {
    const { getByText } = render(<Word {...baseProps} />);
    expect(getByText('test')).toBeInTheDocument();
  });

  it('calls onWordMoveStart on mouse down', () => {
    const onWordMoveStart = jest.fn();
    const { container } = render(<Word {...baseProps} onWordMoveStart={onWordMoveStart} />);
    if (isNull(container.firstChild)) {
      throw new Error('Unexpected error');
    }
    fireEvent.mouseDown(container.firstChild);
    expect(onWordMoveStart).toHaveBeenCalledWith(expect.any(Object), 'w1');
  });

  it('calls onWordResizeStart for left and right resizers', () => {
    const onWordResizeStart = jest.fn();
    const { getByTestId } = render(<Word {...baseProps} onWordResizeStart={onWordResizeStart} />);
    fireEvent.mouseDown(getByTestId(WORD_LEFT_RESIZER_TEST_ID));
    expect(onWordResizeStart).toHaveBeenCalledWith(expect.any(Object), 'w1', 'left');
    fireEvent.mouseDown(getByTestId(WORD_RIGHT_RESIZER_TEST_ID));
    expect(onWordResizeStart).toHaveBeenCalledWith(expect.any(Object), 'w1', 'right');
  });

  it('calls onWordChainResizeStart for chain resizer', () => {
    const onWordChainResizeStart = jest.fn();
    const { getByTestId } = render(<Word {...baseProps} onWordChainResizeStart={onWordChainResizeStart} />);
    fireEvent.mouseDown(getByTestId(WORD_CHAIN_RESIZER_TEST_ID));
    expect(onWordChainResizeStart).toHaveBeenCalledWith(expect.any(Object), 'w1');
  });

  it('does not render left resizer if hideLeftResizer is true', () => {
    const { queryByTestId } = render(<Word {...baseProps} hideLeftResizer />);
    expect(queryByTestId(WORD_LEFT_RESIZER_TEST_ID)).toBeNull();
  });

  it('does not render right resizer if hideRightResizer is true', () => {
    const { queryByTestId } = render(<Word {...baseProps} hideRightResizer />);
    expect(queryByTestId(WORD_RIGHT_RESIZER_TEST_ID)).toBeNull();
  });

  it('does not render chain resizer if hideChainResizer is true', () => {
    const { queryByTestId } = render(<Word {...baseProps} hideChainResizer />);
    expect(queryByTestId(WORD_CHAIN_RESIZER_TEST_ID)).toBeNull();
  });

  it('renders all phonemes', () => {
    const { getByText } = render(<Word {...baseProps} />);
    expect(getByText('a')).toBeInTheDocument();
    expect(getByText('b')).toBeInTheDocument();
  });

  it('applies movingInProgress styles', () => {
    const { container } = render(<Word {...baseProps} movingInProgress />);
    expect(container.firstChild).toHaveClass('cursor-grabbing');
  });
});
