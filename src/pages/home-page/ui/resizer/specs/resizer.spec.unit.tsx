import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import Resizer from 'src/pages/home-page/ui/resizer/resizer';
import { ResizerType } from 'src/pages/home-page/ui/resizer/resizer.types';

describe('Resizer', () => {
  const baseProps = {
    onMouseDown: jest.fn(),
    color: 'red',
    zIndex: 10,
    widthPx: 8,
  };

  it.each<ResizerType>(['left', 'right', 'chain'])('renders correctly with type %s', type => {
    const { container } = render(<Resizer {...baseProps} type={type} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies correct style for width and zIndex', () => {
    const { container } = render(<Resizer {...baseProps} type="left" />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.width).toBe('8px');
    expect(div.style.zIndex).toBe('10');
  });

  it('applies correct class for left type', () => {
    const { container } = render(<Resizer {...baseProps} type="left" />);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toMatch(/left-0/);
  });

  it('applies correct class for right type', () => {
    const { container } = render(<Resizer {...baseProps} type="right" />);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toMatch(/right-0/);
  });

  it('applies correct style for chain type (right offset)', () => {
    const { container } = render(<Resizer {...baseProps} type="chain" />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.right).toBe('-4px');
  });

  it('calls onMouseDown when clicked', () => {
    const onMouseDown = jest.fn();
    const { container } = render(<Resizer {...baseProps} onMouseDown={onMouseDown} type="left" />);
    const div = container.firstChild as HTMLElement;
    fireEvent.mouseDown(div);
    expect(onMouseDown).toHaveBeenCalled();
  });

  it('changes background color on mouse enter and resets on leave', () => {
    const { container } = render(<Resizer {...baseProps} type="left" />);
    const div = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(div);
    expect(div.style.backgroundColor).toBe('red');
    fireEvent.mouseLeave(div);
    expect(div.style.backgroundColor).toBe('transparent');
  });

  it('sets data-testid if provided', () => {
    const { getByTestId } = render(<Resizer {...baseProps} type="left" dataTestId="custom-resizer" />);
    expect(getByTestId('custom-resizer')).toBeInTheDocument();
  });
});
