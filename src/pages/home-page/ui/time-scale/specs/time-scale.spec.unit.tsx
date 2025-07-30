import { render } from '@testing-library/react';
import React from 'react';

import TimeScale from 'src/pages/home-page/ui/time-scale/time-scale';

describe('TimeScale', () => {
  const defaultProps = {
    durationSec: 10,
    timelineWidthPx: 1000,
    scrollLeftPx: 0,
    viewportWidthPx: 500,
    heightPx: 50,
  };

  let getContextMock: jest.Mock;
  let ctxMock: jest.Mocked<
    Pick<
      CanvasRenderingContext2D,
      'setTransform' | 'clearRect' | 'beginPath' | 'moveTo' | 'lineTo' | 'stroke' | 'fillText'
    >
  > & {
    strokeStyle: string;
    fillStyle: string;
    font: string;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
  };

  beforeEach(() => {
    ctxMock = {
      setTransform: jest.fn(),
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      fillText: jest.fn(),
      strokeStyle: '',
      fillStyle: '',
      font: '',
      textAlign: 'center',
      textBaseline: 'top',
    };
    getContextMock = jest.fn().mockReturnValue(ctxMock);
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(getContextMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders canvas element', () => {
    const { container } = render(<TimeScale {...defaultProps} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('calls canvas context methods for drawing', () => {
    render(<TimeScale {...defaultProps} />);
    expect(getContextMock).toHaveBeenCalledWith('2d');
    expect(ctxMock.setTransform).toHaveBeenCalled();
    expect(ctxMock.clearRect).toHaveBeenCalled();
    expect(ctxMock.stroke).toHaveBeenCalled();
    expect(ctxMock.fillText).toHaveBeenCalled();
  });
});
