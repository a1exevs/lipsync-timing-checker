import { render } from '@testing-library/react';
import React from 'react';

import Phoneme from 'src/pages/home-page/ui/phoneme/phoneme';

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

  it('matches snapshot (default)', () => {
    const { asFragment } = render(<Phoneme {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot (without borders)', () => {
    const { asFragment } = render(<Phoneme {...baseProps} withoutLeftBorder withoutRightBorder />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot (movingInProgress)', () => {
    const { asFragment } = render(<Phoneme {...baseProps} movingInProgress />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot (hideChainResizer)', () => {
    const { asFragment } = render(<Phoneme {...baseProps} hideChainResizer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
