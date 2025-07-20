import { isNull } from '@alexevs/ts-guards';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import Phoneme from 'src/pages/home/ui/phoneme/phoneme';

describe('Phoneme', () => {
  const baseProps = {
    id: 'p1',
    phoneme: 'a',
    leftPercent: 10,
    widthPercent: 20,
    onResizeStart: jest.fn(),
    onChainResizeStart: jest.fn(),
    onMoveStart: jest.fn(),
    movingInProgress: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders phoneme text', () => {
    const { getByText } = render(<Phoneme {...baseProps} />);
    expect(getByText('a')).toBeInTheDocument();
  });

  it('calls onMoveStart on mouse down', () => {
    const onMoveStart = jest.fn();
    const { container } = render(<Phoneme {...baseProps} onMoveStart={onMoveStart} />);
    if (isNull(container.firstChild)) {
      throw new Error('Unable to find a phoneme');
    }
    fireEvent.mouseDown(container.firstChild);
    expect(onMoveStart).toHaveBeenCalledWith(expect.any(Object), 'p1');
  });

  it('calls onResizeStart for left and right resizers', () => {
    const onResizeStart = jest.fn();
    const { container } = render(<Phoneme {...baseProps} onResizeStart={onResizeStart} />);
    const resizers = container.querySelectorAll('.cursor-col-resize');
    // left, right, chain (if not hidden)
    fireEvent.mouseDown(resizers[0]);
    expect(onResizeStart).toHaveBeenCalledWith(expect.any(Object), 'p1', 'left');
    fireEvent.mouseDown(resizers[1]);
    expect(onResizeStart).toHaveBeenCalledWith(expect.any(Object), 'p1', 'right');
  });

  it('calls onChainResizeStart for chain resizer', () => {
    const onChainResizeStart = jest.fn();
    const { container } = render(<Phoneme {...baseProps} onChainResizeStart={onChainResizeStart} />);
    const resizers = container.querySelectorAll('.cursor-col-resize');
    // chain resizer is the third one
    fireEvent.mouseDown(resizers[2]);
    expect(onChainResizeStart).toHaveBeenCalledWith(expect.any(Object), 'p1');
  });

  it('does not render chain resizer if hideChainResizer is true', () => {
    const { container } = render(<Phoneme {...baseProps} hideChainResizer />);
    const resizers = container.querySelectorAll('.cursor-col-resize');
    expect(resizers.length).toBe(2); // only left and right
  });

  it('applies border-l-0 and border-r-0 classes when withoutLeftBorder/withoutRightBorder', () => {
    const { container } = render(<Phoneme {...baseProps} withoutLeftBorder withoutRightBorder />);
    expect(container.firstChild).toHaveClass('border-l-0');
    expect(container.firstChild).toHaveClass('border-r-0');
  });

  it('applies movingInProgress styles', () => {
    const { container } = render(<Phoneme {...baseProps} movingInProgress />);
    expect(container.firstChild).toHaveClass('cursor-grabbing');
  });
});
